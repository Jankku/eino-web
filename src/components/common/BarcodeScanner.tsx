import { useCallback, useLayoutEffect } from 'react';
import Quagga, {
  type QuaggaJSCodeReader,
  type QuaggaJSResultObject,
  type QuaggaJSResultObject_CodeResult,
} from '@ericblade/quagga2';

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

interface ScannerProps {
  scannerRef: React.RefObject<HTMLDivElement | null>;
  cameraId: string | null | undefined;
  onDetected: (code: string) => void;
}

export function BarcodeScanner({ scannerRef, cameraId, onDetected }: ScannerProps) {
  const errorCheck = useCallback(
    (result: QuaggaJSResultObject) => {
      const { code } = result.codeResult;
      if (!code) {
        return;
      }
      const errorRate = getMedianOfCodeErrors(result.codeResult.decodedCodes);
      if (errorRate < 0.25) {
        onDetected?.(code);
      }
    },
    [onDetected],
  );

  useLayoutEffect(() => {
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
              ...(cameraId ? { deviceId: cameraId } : { facingMode: 'environment' }),
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
          Quagga.start();
        },
      );
      Quagga.onDetected(errorCheck);
    };

    init();

    return () => {
      ignoreStart = true;
      Quagga.stop();
      Quagga.offDetected(errorCheck);
    };
  }, [cameraId, onDetected, scannerRef, errorCheck, locator, decoders]);

  return null;
}
