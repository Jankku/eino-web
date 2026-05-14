import { useState, useRef, useEffect, useCallback } from 'react';
import Quagga from '@ericblade/quagga2';
import { BarcodeScanner } from '../../components/common/BarcodeScanner';
import { Box, Container, Fab, FormControl, InputLabel, Select } from '@mui/material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { useBookIsbnSearch } from '../../data/books/useBookIsbnSearch';
import { Book } from '../../models/book';
import { useNavigate } from 'react-router';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import ScanBookAddDialog from '../../components/books/ScanBookAddDialog';
import { stopQuaggaCamera } from '../../utils/quaggaUtil';

const backCameraLabelPattern = /back|rear|environment|facing back/i;

const findBackCamera = (cameras: MediaDeviceInfo[]) => {
  const backCameras = cameras
    .filter((camera) => backCameraLabelPattern.test(camera.label))
    .toSorted((a, b) => a.label.localeCompare(b.label));
  return backCameras.length > 0 ? backCameras[0] : undefined;
};

type TorchMediaTrackConstraintSet = MediaTrackConstraintSet & {
  torch?: boolean;
};

export default function BookScanner() {
  const navigate = useNavigate();
  const { showErrorSnackbar } = useCustomSnackbar();
  const isbnSearchMutation = useBookIsbnSearch();
  const scannerRef = useRef<HTMLDivElement>(null);
  const isScanLockedRef = useRef(false);
  const isRedirectingRef = useRef(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [cameraId, setCameraId] = useState<string>();
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<Error>();
  const [initialValues, setInitialValues] = useState<Partial<Book>>();
  const torchOnRef = useRef(false);
  const [scannerKey, setScannerKey] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const enumerateCameras = async () => {
      const cameras = await Quagga.CameraAccess.enumerateVideoDevices();
      return cameras;
    };

    const initCamera = async () => {
      try {
        if (cancelled) {
          return;
        }

        const cameras = await enumerateCameras();
        if (cancelled) {
          return;
        }

        if (cameras.length > 0) {
          setCameras(cameras);
          setCameraId(findBackCamera(cameras)?.deviceId);
        }
      } catch (error) {
        setCameraError(error as Error);
      } finally {
        setCameraReady(true);
      }
    };

    initCamera();

    return () => {
      console.log('stopping cameras');
      cancelled = true;
      stopQuaggaCamera();
    };
  }, []);

  const restartScanner = useCallback(() => {
    stopQuaggaCamera();
    setInitialValues(undefined);
    setCreateDialogOpen(false);
    isbnSearchMutation.reset();
    isScanLockedRef.current = false;
    setScannerKey((prev) => prev + 1);
  }, [isbnSearchMutation]);

  const onTorchClick = useCallback(async () => {
    const newTorch = !torchOnRef.current;

    const track = Quagga.CameraAccess.getActiveTrack();
    const supportsTorch = track?.getCapabilities && 'torch' in track.getCapabilities();

    if (track && supportsTorch) {
      const torchConstraint: TorchMediaTrackConstraintSet = { torch: newTorch };
      await track.applyConstraints({ advanced: [torchConstraint] });
      torchOnRef.current = newTorch;
    }
  }, []);

  const onDetected = useCallback(
    (isbn: string) => {
      if (isScanLockedRef.current) {
        return;
      }

      isScanLockedRef.current = true;
      setInitialValues({ isbn });
      setCreateDialogOpen(true);
      stopQuaggaCamera();

      isbnSearchMutation.mutate(isbn, {
        onSuccess: (book) => {
          if (!book) {
            return;
          }
          setInitialValues((prev) => ({
            ...prev,
            ...book,
            isbn: prev?.isbn ?? book.isbn,
          }));
        },
        onError: () => {
          showErrorSnackbar('Failed to fetch book details for scanned ISBN');
        },
      });
    },
    [isbnSearchMutation, showErrorSnackbar],
  );

  const onCreateSuccess = () => {
    isRedirectingRef.current = true;
    navigate('/books');
  };

  const onCloseDialog = () => {
    if (isRedirectingRef.current) {
      isScanLockedRef.current = false;
      setCreateDialogOpen(false);
      return;
    }
    console.log('restarting scanner');
    restartScanner();
  };

  return (
    <Container disableGutters maxWidth={false} sx={{ position: 'relative' }}>
      <style>
        {`#scanner-container video {
            position: absolute;
            inset: 0;
            width: 100% !important;
            height: 100% !important;
            object-fit: cover;
          }`}
      </style>
      {cameraError ? <p>Error while initializing camera</p> : null}
      <Box
        id="scanner-container"
        ref={scannerRef}
        sx={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}
      >
        {cameraReady && !createDialogOpen ? (
          <BarcodeScanner
            key={scannerKey}
            scannerRef={scannerRef}
            cameraId={cameraId}
            onDetected={onDetected}
          />
        ) : null}
      </Box>
      <Box position="fixed" bottom={16} left={16} zIndex={2}>
        <FormControl fullWidth>
          <InputLabel id="camera-label">Camera</InputLabel>
          <Select
            native
            label="Camera"
            labelId="camera-label"
            value={cameraId}
            onChange={(event) => setCameraId(event.target.value)}
          >
            {cameras.map((camera) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || camera.deviceId}
              </option>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Fab
        color="primary"
        aria-label={'Enable/disable Torch'}
        onClick={onTorchClick}
        sx={{ position: 'fixed', right: 16, bottom: 16, zIndex: 2 }}
      >
        <FlashOnIcon />
      </Fab>
      {createDialogOpen ? (
        <ScanBookAddDialog
          visible={createDialogOpen}
          closeDialog={onCloseDialog}
          initialValues={initialValues}
          onSuccess={onCreateSuccess}
          prefillLoading={isbnSearchMutation.isPending}
        />
      ) : undefined}
    </Container>
  );
}
