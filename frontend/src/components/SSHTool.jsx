import { useState } from 'react';
import { Terminal, RefreshCw } from 'lucide-react';
import { generateSSHKeyPair } from '@/lib/sshGen';
import OutputField from './OutputField';

export default function SSHTool() {
  const [keys, setKeys] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      setKeys(generateSSHKeyPair());
      setLoading(false);
    }, 10);
  };

  return (
    <div className="space-y-6 pt-6">
      <div>
        <h2 className="text-2xl tracking-tight font-bold text-white flex items-center gap-2">
          <Terminal size={20} className="text-zinc-400" />
          SSH Keypair
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Generates an Ed25519 SSH keypair in your browser using the
          Web Crypto API. The private key never leaves your device.
        </p>
      </div>

      <button
        onClick={generate}
        disabled={loading}
        data-testid="ssh-generate-btn"
        className="flex items-center gap-2 bg-white text-black px-5 py-2.5
                   font-bold uppercase tracking-wide text-sm rounded-none
                   hover:bg-zinc-200 active:translate-y-0.5
                   transition-colors duration-150 disabled:opacity-50"
      >
        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        {loading ? 'Generating…' : 'Generate SSH Keypair'}
      </button>

      {keys && (
        <div className="space-y-4 border border-[#1F1F1F] p-5 bg-[#0A0A0A]">
          <OutputField
            label="Private Key (OpenSSH PEM)"
            value={keys.privateKey}
            rows={8}
            testId="ssh-private-key"
          />
          <OutputField
            label="Public Key (authorized_keys format)"
            value={keys.publicKey}
            rows={3}
            testId="ssh-public-key"
          />

          <div className="flex items-center gap-2 pt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            <p className="text-xs text-zinc-500">
              Ed25519 · OpenSSH format · generated client-side · zero knowledge
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
