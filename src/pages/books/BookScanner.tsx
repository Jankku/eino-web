import { useState, useRef, useEffect, useCallback } from 'react';
import Quagga from '@ericblade/quagga2';
import { BarcodeScanner } from '../../components/common/BarcodeScanner';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  DialogActions,
  DialogContent,
  Fab,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import FlashOffIcon from '@mui/icons-material/FlashOff';
import BaseDialog from '../../components/common/BaseDialog';
import { useBookIsbnSearch } from '../../data/books/useBookIsbnSearch';
import DetailItem from '../../components/common/DetailItem';
import { languageCodeToName } from '../../utils/languages';
import { useAddBook } from '../../data/books/useAddBook';
import { Book, bookSchema, getBookDefaults } from '../../models/book';
import { useLocation, useNavigate } from 'react-router';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';

export default function Scanner() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccessSnackbar } = useCustomSnackbar();
  const addBookMutation = useAddBook();
  const isbnSearchMutation = useBookIsbnSearch();
  const scannerRef = useRef<HTMLDivElement>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [cameraId, setCameraId] = useState<string>();
  const [cameraError, setCameraError] = useState<Error>();
  const [code, setCode] = useState<string>();
  const [torchOn, setTorch] = useState(false);
  const [scannerKey, setScannerKey] = useState(0);
  const [visible, setVisible] = useState(false);

  const book = isbnSearchMutation.data;

  useEffect(() => {
    const enableCamera = async () => {
      await Quagga.CameraAccess.request(null, {});
    };
    const disableCamera = async () => {
      await Quagga.CameraAccess.release();
    };
    const enumerateCameras = async () => {
      const cameras = await Quagga.CameraAccess.enumerateVideoDevices();
      return cameras;
    };

    const initCamera = async () => {
      try {
        await enableCamera();
        const cameras = await enumerateCameras();
        if (cameras.length > 0) {
          setCameras(cameras);
          //setCameraId(cameras[0].deviceId);
        }
        await disableCamera();
      } catch (error) {
        setCameraError(error as Error);
      }
    };

    initCamera();

    return () => {
      disableCamera();
    };
  }, []);

  const onTorchClick = useCallback(async () => {
    const newTorch = !torchOn;
    if (newTorch) {
      const track = Quagga.CameraAccess.getActiveTrack();
      if (track?.getCapabilities && 'torch' in track.getCapabilities()) {
        await Quagga.CameraAccess.enableTorch();
        setTorch(newTorch);
      }
    } else {
      await Quagga.CameraAccess.disableTorch();
      setTorch(newTorch);
    }
  }, [torchOn, setTorch]);

  const onDetected = useCallback(
    (isbn: string) => {
      setCode(isbn);
      setVisible(true);
      Quagga.stop();
      isbnSearchMutation.mutate(isbn, {});
    },
    [isbnSearchMutation],
  );

  const onImportBook = () => {
    if (!book) return;

    const data = {
      ...getBookDefaults(),
      ...book,
    } satisfies Book;
    addBookMutation.mutate(bookSchema.parse(data), {
      onSuccess: () => {
        navigate(`/books${location.search}`);
        showSuccessSnackbar('Book imported');
      },
    });
  };

  const onClose = () => {
    setVisible(false);
    setCode(undefined);
    isbnSearchMutation.reset();
    setScannerKey((prev) => prev + 1);
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
        {scannerRef.current ? (
          <BarcodeScanner
            key={scannerKey}
            scannerRef={scannerRef}
            cameraId={cameraId}
            onDetected={onDetected}
          />
        ) : null}
      </Box>
      <Box position="fixed" bottom={48}>
        <form style={{ position: 'absolute', top: '0px', left: '0px' }}>
          <select onChange={(event) => setCameraId(event.target.value)}>
            {cameras.map((camera) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || camera.deviceId}
              </option>
            ))}
          </select>
        </form>
      </Box>
      <Fab
        color="primary"
        aria-label={torchOn ? 'Disable Torch' : 'Enable Torch'}
        onClick={onTorchClick}
      >
        {torchOn ? <FlashOffIcon /> : <FlashOnIcon />}
      </Fab>
      {visible ? (
        <BaseDialog maxWidth="sm" title="Scan complete" open={visible} onClose={onClose}>
          <DialogContent sx={{ pt: 0 }}>
            <Stack gap={2}>
              {isbnSearchMutation.isPending ? (
                <Stack gap={2} alignItems="center" justifyContent="center">
                  <CircularProgress size={48} />
                  <Typography>Searching for ISBN {code}</Typography>
                </Stack>
              ) : undefined}
              {isbnSearchMutation.isError ? (
                <Typography color="error">
                  Failed to search for the book. Please try again.
                </Typography>
              ) : undefined}
              {isbnSearchMutation.isSuccess && book ? (
                <>
                  <Grid container gap={2}>
                    {book.image_url ? (
                      <Grid size={4}>
                        <img
                          draggable="false"
                          loading={'lazy'}
                          aria-hidden="true"
                          referrerPolicy="no-referrer"
                          src={book.image_url}
                          width="100%"
                          height="100%"
                          style={{ objectFit: 'cover' }}
                        />
                      </Grid>
                    ) : null}
                    <Grid container direction="column" gap={2}>
                      <Grid container direction="column">
                        <Box component="span" sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
                          {book.title}
                        </Box>
                        <Box component="span">
                          {[book.author, book.year].filter(Boolean).join(', ')}
                        </Box>
                      </Grid>
                      <Grid>
                        {book.publisher ? (
                          <DetailItem title="Publisher" value={book.publisher} />
                        ) : undefined}
                        {book.pages ? <DetailItem title="Pages" value={book.pages} /> : undefined}
                        {book.isbn ? <DetailItem title="ISBN" value={book.isbn} /> : undefined}
                        {book.language_code ? (
                          <DetailItem
                            title="Language"
                            value={languageCodeToName(book.language_code)}
                          />
                        ) : undefined}
                        {book.note ? <DetailItem title="Note" value={book.note} /> : undefined}
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              ) : undefined}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={onClose}>
              Close
            </Button>
            <Button color="primary" disabled={isbnSearchMutation.isError} onClick={onImportBook}>
              Import
            </Button>
          </DialogActions>
        </BaseDialog>
      ) : undefined}
    </Container>
  );
}
