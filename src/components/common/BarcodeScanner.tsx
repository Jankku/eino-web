import { useCallback, useEffect, useRef } from 'react';
import Quagga, {
  type QuaggaJSCodeReader,
  type QuaggaJSResultObject,
  type QuaggaJSResultObject_CodeResult,
} from '@ericblade/quagga2';
import { normalizeValidIsbn } from '../../utils/isbnUtil';
import { stopQuaggaCamera } from '../../utils/quaggaUtil';

function getMedian(arr: number[]) {
  const newArr = arr.toSorted((a, b) => a - b);
  const half = Math.floor(newArr.length / 2);
  if (newArr.length % 2 === 1) {
    return newArr[half];
  }
  return (newArr[half - 1] + newArr[half]) / 2;
}

function getMedianOfCodeErrors(decodedCodes: QuaggaJSResultObject_CodeResult['decodedCodes']) {
  const errors = decodedCodes.flatMap((x) => x.error) as number[];
  return getMedian(errors);
}

const locator = {
  patchSize: 'medium',
  halfSample: true,
  willReadFrequently: true,
};

const decoders = ['ean_reader'] satisfies QuaggaJSCodeReader[];
const maxAcceptedErrorRate = 0.15;
const minimumStableDetections = 3;

interface ScannerProps {
  scannerRef: React.RefObject<HTMLDivElement | null>;
  cameraId: string | null | undefined;
  onDetected: (code: string) => void;
}

export function BarcodeScanner({ scannerRef, cameraId, onDetected }: ScannerProps) {
  const detectionHistoryRef = useRef<string[]>([]);

  const errorCheck = useCallback(
    (result: QuaggaJSResultObject) => {
      const { code } = result.codeResult;
      if (!code) {
        return;
      }

      const isbn = normalizeValidIsbn(code);
      if (!isbn) {
        detectionHistoryRef.current = [];
        return;
      }

      const errorRate = getMedianOfCodeErrors(result.codeResult.decodedCodes);
      if (errorRate > maxAcceptedErrorRate) {
        return;
      }

      detectionHistoryRef.current = [...detectionHistoryRef.current, isbn].slice(
        -minimumStableDetections,
      );

      const isStableDetection =
        detectionHistoryRef.current.length === minimumStableDetections &&
        detectionHistoryRef.current.every((detectedIsbn) => detectedIsbn === isbn);

      if (isStableDetection) {
        detectionHistoryRef.current = [];
        onDetected?.(isbn);
      }
    },
    [onDetected],
  );

  useEffect(() => {
    let ignoreStart = false;
    const init = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1));
      if (ignoreStart) {
        return;
      }
      await Quagga.init(
        {
          inputStream: {
            type: 'LiveStream',
            constraints: {
              ...(cameraId
                ? { deviceId: { exact: cameraId } }
                : { facingMode: { ideal: 'environment' } }),
            },
            // @ts-expect-error -- works
            target: scannerRef.current,
            willReadFrequently: true,
          },
          decoder: { readers: decoders },
          locate: true,
          locator,
        },
        async (err) => {
          if (err) {
            return console.error('Error starting Quagga:', err);
          }
          if (ignoreStart) {
            await stopQuaggaCamera();
            return;
          }
          Quagga.start();
        },
      );
      if (ignoreStart) {
        await stopQuaggaCamera();
        return;
      }
      Quagga.onDetected(errorCheck);
    };

    init();

    return () => {
      ignoreStart = true;
      detectionHistoryRef.current = [];
      Quagga.offDetected(errorCheck);
      stopQuaggaCamera();
    };
  }, [cameraId, onDetected, scannerRef, errorCheck]);

  return null;
}
