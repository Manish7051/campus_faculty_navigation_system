import { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { QrCode, X, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isScanning) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => stopScanning();
  }, [isScanning]);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Start scanning loop
      setTimeout(scanLoop, 500);

    } catch (err) {
      setError("Camera permission denied");
      setIsScanning(false);
    }
  };

  const scanLoop = () => {
    if (!isScanning || !videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imgData.data, canvas.width, canvas.height);

    if (code) {
      processQRData(code.data);
      setIsScanning(false);
      return;
    }

    requestAnimationFrame(scanLoop);
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
  };

  const processQRData = (data) => {
    setScannedData(data);

    const [type, id] = data.split(':');

    if (type === "building") return navigate(`/building/${id}`);
    if (type === "room") return navigate(`/room/${id}`);
    if (type === "facility") return navigate(`/facilities`);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsScanning(!isScanning)}
        className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg"
      >
        <QrCode className="h-5 w-5" />
        <span>{isScanning ? "Stop Scanning" : "Scan QR Code"}</span>
      </button>

      {isScanning && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Scan QR Code</h3>
              <X
                onClick={() => setIsScanning(false)}
                className="cursor-pointer"
              />
            </div>

            <video ref={videoRef} autoPlay playsInline className="w-full h-64 mt-4 bg-black rounded-lg" />

            <canvas ref={canvasRef} className="hidden"></canvas>

            {error && <p className="mt-4 text-red-600">{error}</p>}
          </div>
        </div>
      )}

      {scannedData && (
        <div className="mt-4 bg-green-100 p-4 rounded-lg">
          Scanned: {scannedData}
        </div>
      )}
    </div>
  );
};

export default QRScanner;
