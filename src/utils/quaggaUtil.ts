import Quagga from '@ericblade/quagga2';

export const stopQuaggaCamera = async () => {
  try {
    await Quagga.CameraAccess.release();
  } catch (error) {
    console.log('Failed to release Quagga camera:', error);
  }
};
