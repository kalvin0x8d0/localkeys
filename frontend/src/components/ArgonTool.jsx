import { useState } from 'react';
import { Lock, Hash } from 'lucide-react';
import { argon2id } from 'hash-wasm';
import OutputField from './OutputField';

const DEFAULTS = { memory: 65536, iterations: 3, parallelism: 4 };

export default function ArgonTool() {
  const [password, setPassword] = useState('');
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [params, setParams] = useState(DEFAULTS);

  const handleHash = async () => {
    if (!password.trim()) {
      setError('Password cannot be empty.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const result = await argon2id({
        password: password,
        salt,
        parallelism: params.parallelism,
        iterations: params.iterations,
        memorySize: params.memory,
        hashLength: 32,
        outputType: 'encoded',
      });
      setHash(result);
    } catch (e) {
      setError('Hashing failed: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const updateParam = (key, value) => {
    const n = parseInt(value, 10);
    if (!isNaN(n) && n > 0) setParams(p => ({ ...p, [key]: n }));
  };

  return (
    <div className="space-y-6 pt-6">
      <div>
        <h2 className="text-2xl tracking-tight font-bold text-white flex items-center gap-2">
          <Lock size={20} className="text-zinc-400" />
          Argon2id Hasher
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Hash a password with Argon2id entirely in your browser via WebAssembly.
          The password never leaves your device.
        </p>
      </div>

      {/* Password input */}
      <div className="space-y-1">
        <label className="text-xs tracking-[0.2em] uppercase font-bold text-zinc-500">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError(''); }}
          placeholder="Enter password to hash"
          data-testid="argon-password-input"
          className="w-full bg-black border border-[#1F1F1F] px-3 py-2.5
                     text-white placeholder:text-zinc-700 outline-none rounded-none
                     focus:border-white focus:ring-1 focus:ring-white text-sm"
        />
        {error && (
          <p className="text-xs text-red-500" data-testid="argon-error">{error}</p>
        )}
      </div>

      {/* Parameters */}
      <div className="space-y-2">
        <p className="text-xs tracking-[0.2em] uppercase font-bold text-zinc-500">Parameters</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'memory', label: 'Memory (KiB)', min: 1024 },
            { key: 'iterations', label: 'Iterations', min: 1 },
            { key: 'parallelism', label: 'Parallelism', min: 1 },
          ].map(({ key, label, min }) => (
            <div key={key} className="space-y-1">
              <label className="text-xs text-zinc-600 uppercase tracking-wider">{label}</label>
              <input
                type="number"
                min={min}
                value={params[key]}
                onChange={e => updateParam(key, e.target.value)}
                data-testid={`argon-param-${key}`}
                className="w-full bg-black border border-[#1F1F1F] px-2 py-1.5
                           text-white outline-none rounded-none
                           focus:border-white text-sm font-mono"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleHash}
        disabled={loading}
        data-testid="argon-hash-btn"
        className="flex items-center gap-2 bg-white text-black px-5 py-2.5
                   font-bold uppercase tracking-wide text-sm rounded-none
                   hover:bg-zinc-200 active:translate-y-0.5
                   transition-colors duration-150 disabled:opacity-50"
      >
        <Hash size={14} className={loading ? 'animate-pulse' : ''} />
        {loading ? 'Hashing…' : 'Hash Password'}
      </button>

      {hash && (
        <div className="space-y-4 border border-[#1F1F1F] p-5 bg-[#0A0A0A]">
          <OutputField label="Argon2id Hash (PHC format)" value={hash} rows={3} testId="argon-hash-output" />

          <div className="flex items-center gap-2 pt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            <p className="text-xs text-zinc-500">
              WASM · PHC format · browser-only · server never sees your password
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
