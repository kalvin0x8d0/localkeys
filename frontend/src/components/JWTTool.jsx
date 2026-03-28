import { useState } from 'react';
import { Fingerprint, RefreshCw } from 'lucide-react';
import OutputField from './OutputField';

function generateJWTSecret() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  // Base64
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  const base64 = btoa(binary);
  // Hex
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return { base64, hex };
}

export default function JWTTool() {
  const [secret, setSecret] = useState(null);

  const generate = () => {
    setSecret(generateJWTSecret());
  };

  return (
    <div className="space-y-6 pt-6">
      <div>
        <h2 className="text-2xl tracking-tight font-bold text-white flex items-center gap-2">
          <Fingerprint size={20} className="text-zinc-400" />
          JWT Secret
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Generates a cryptographically random 256-bit secret for HMAC-SHA256
          signing, entirely in your browser.
        </p>
      </div>

      <button
        onClick={generate}
        data-testid="jwt-generate-btn"
        className="flex items-center gap-2 bg-white text-black px-5 py-2.5
                   font-bold uppercase tracking-wide text-sm rounded-none
                   hover:bg-zinc-200 active:translate-y-0.5
                   transition-colors duration-150"
      >
        <RefreshCw size={14} />
        Generate Secret
      </button>

      {secret && (
        <div className="space-y-4 border border-[#1F1F1F] p-5 bg-[#0A0A0A]">
          <OutputField label="Secret (Base64)" value={secret.base64} rows={2} testId="jwt-base64" />
          <OutputField label="Secret (Hex)" value={secret.hex} rows={2} testId="jwt-hex" />

          <div className="flex items-center gap-2 pt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            <p className="text-xs text-zinc-500">
              32 bytes · 256 bits · uses Web Crypto API · generated in-browser
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
