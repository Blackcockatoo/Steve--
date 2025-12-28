/**
 * Shrine QR Scanner Component
 */

import { useState } from 'react';
import { scanShrineQR, type Shrine, type ShrineBlessing } from '../shrine/qrCodeSystem';

export function ShrineScanner({ userId }: { userId: string }) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{
    shrine?: Shrine;
    blessing?: ShrineBlessing;
    error?: string;
  } | null>(null);

  const handleScan = async () => {
    setScanning(true);

    // In production, use device camera to scan QR code
    // For demo, simulate scan
    setTimeout(() => {
      const mockQrCode = 'MONONOKE-SHRINE-meiji-jingu-5c3d7e1a';
      const scanResult = scanShrineQR(mockQrCode, userId);

      setResult(scanResult);
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="shrine-scanner glass">
      <h2>⛩️ Shrine Blessing</h2>
      <p className="description">
        Visit partner shrines in Japan and scan QR codes to receive sacred blessings for your companions.
      </p>

      {!result && (
        <button
          className="cta-primary scan-button"
          onClick={handleScan}
          disabled={scanning}
        >
          {scanning ? '📷 Scanning...' : '📷 Scan QR Code'}
        </button>
      )}

      {result?.error && (
        <div className="scan-error">
          <span className="error-icon">⚠️</span>
          <p>{result.error}</p>
          <button className="cta-secondary" onClick={() => setResult(null)}>
            Try Again
          </button>
        </div>
      )}

      {result?.shrine && result?.blessing && (
        <div className="blessing-received">
          <div className="shrine-info">
            <h3>{result.shrine.nameJa}</h3>
            <p className="shrine-name-en">{result.shrine.name}</p>
            <p className="shrine-location">
              {result.shrine.location.city}, {result.shrine.location.prefecture}
            </p>
          </div>

          <div className="blessing-effect">
            <div className="blessing-icon">✨</div>
            <h4>Blessing Received!</h4>
            <p className="blessing-desc-ja">{result.blessing.descriptionJa}</p>
            <p className="blessing-desc-en">{result.blessing.description}</p>
            {result.blessing.duration > 0 && (
              <p className="blessing-duration">
                Active for {result.blessing.duration} hours
              </p>
            )}
          </div>

          <button className="cta-primary" onClick={() => setResult(null)}>
            Continue
          </button>
        </div>
      )}

      <div className="visit-history">
        <h4>Your Shrine Visits</h4>
        <p className="placeholder">Visit shrines to build your collection</p>
        {/* List visited shrines here */}
      </div>
    </div>
  );
}
