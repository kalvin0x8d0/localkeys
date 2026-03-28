import { useState } from 'react';
import { KeyRound, RefreshCw } from 'lucide-react';
import { generateSecretKey, getPublicKey } from 'nostr-tools';
import { nsecEncode, npubEncode } from 'nostr-tools/nip19';
import OutputField from './OutputField';

function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function NostrTool() {
  const [keys, setKeys] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    // Use setTimeout to allow React to render the loading state
    setTimeout(() => {
      const privKey = generateSecretKey();        // Uint8Array(32)
      const pubKeyHex = getPublicKey(privKey);    // hex string
      setKeys({
        nsec: nsecEncode(privKey),
        npub: npubEncode(pubKeyHex),
        privHex: bytesToHex(privKey),
        pubHex: pubKeyHex,
      });
      setLoading(false);
    }, 10);
  };

  return (
    <div className="space-y-6 pt-6">
      <div>
        <h2 className="text-2xl tracking-tight font-bold text-white flex items-center gap-2">
          <KeyRound size={20} className="text-zinc-400" />
          Nostr Keypair
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Generates a secp256k1 keypair entirely in your browser.
          The server never sees these keys.
        </p>
      </div>

      <button
        onClick={generate}
        disabled={loading}
        data-testid="nostr-generate-btn"
        className="flex items-center gap-2 bg-white text-black px-5 py-2.5
                   font-bold uppercase tracking-wide text-sm rounded-none
                   hover:bg-zinc-200 active:translate-y-0.5
                   transition-colors duration-150 disabled:opacity-50"
      >
        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        {loading ? 'Generating…' : 'Generate Keypair'}
      </button>

      {keys && (
        <div className="space-y-4 border border-[#1F1F1F] p-5 bg-[#0A0A0A]">
          <OutputField label="Private Key (nsec)" value={keys.nsec} rows={2} testId="nostr-nsec" />
          <OutputField label="Private Key (hex)" value={keys.privHex} rows={2} testId="nostr-priv-hex" />
          <OutputField label="Public Key (npub)" value={keys.npub} rows={2} testId="nostr-npub" />
          <OutputField label="Public Key (hex)" value={keys.pubHex} rows={2} testId="nostr-pub-hex" />

          <div className="flex items-center gap-2 pt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            <p className="text-xs text-zinc-500">
              Generated client-side · never transmitted · safe to use
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
