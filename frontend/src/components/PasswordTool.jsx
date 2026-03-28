import { useState } from 'react';
import { KeyRound, RefreshCw } from 'lucide-react';
import OutputField from './OutputField';

const LETTERS  = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS  = '0123456789';
const SYMBOLS  = '!@#$%^&*()-_=+[]{}|;:,.?';   // web/software-safe

function generatePassword(useLetters, useNumbers, useSymbols, length) {
  let pool = '';
  if (useLetters)  pool += LETTERS;
  if (useNumbers)  pool += NUMBERS;
  if (useSymbols)  pool += SYMBOLS;
  if (!pool) return '';

  // Use crypto.getRandomValues for true randomness
  const values = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(values)
    .map(v => pool[v % pool.length])
    .join('');
}

export default function PasswordTool() {
  const [useLetters, setUseLetters] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [length, setLength]         = useState(20);
  const [password, setPassword]     = useState('');

  const noneSelected = !useLetters && !useNumbers && !useSymbols;

  const generate = () => {
    const pw = generatePassword(useLetters, useNumbers, useSymbols, Number(length));
    setPassword(pw);
  };

  return (
    <div className="space-y-6 pt-6">

      {/* ── Title ── */}
      <div>
        <h2 className="text-2xl tracking-tight font-bold text-white flex items-center gap-2">
          <KeyRound size={20} className="text-zinc-400" />
          Password Generator
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Generates a cryptographically random password entirely in your browser
          using the Web Crypto API.
        </p>
      </div>

      {/* ── Options ── */}
      <div className="border border-[#1F1F1F] p-5 bg-[#0A0A0A] space-y-5">

        {/* Checkboxes */}
        <div className="space-y-3">
          <p className="text-xs tracking-[0.2em] uppercase font-bold text-zinc-500">
            Character set
          </p>

          {[
            {
              id: 'letters',
              label: 'Uppercase & lowercase letters  (A – Z, a – z)',
              checked: useLetters,
              setter: setUseLetters,
              testId: 'pw-chk-letters',
            },
            {
              id: 'numbers',
              label: 'Numbers  (0 – 9)',
              checked: useNumbers,
              setter: setUseNumbers,
              testId: 'pw-chk-numbers',
            },
            {
              id: 'symbols',
              label: 'Web / software-safe symbols  (!@#$%^&*()-_=+[]{}|;:,.?)',
              checked: useSymbols,
              setter: setUseSymbols,
              testId: 'pw-chk-symbols',
            },
          ].map(({ id, label, checked, setter, testId }) => (
            <label
              key={id}
              htmlFor={`pw-chk-${id}`}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`
                  w-4 h-4 border flex-shrink-0 flex items-center justify-center
                  transition-colors duration-150
                  ${checked
                    ? 'bg-white border-white'
                    : 'bg-transparent border-zinc-600 group-hover:border-zinc-400'}
                `}
              >
                {checked && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <input
                id={`pw-chk-${id}`}
                type="checkbox"
                className="sr-only"
                data-testid={testId}
                checked={checked}
                onChange={e => setter(e.target.checked)}
              />
              <span className={`text-sm ${checked ? 'text-zinc-200' : 'text-zinc-500'}`}>
                {label}
              </span>
            </label>
          ))}

          {noneSelected && (
            <p className="text-xs text-red-500 mt-1">
              Select at least one character set.
            </p>
          )}
        </div>

        {/* Length input */}
        <div className="space-y-1">
          <label
            htmlFor="pw-length"
            className="text-xs tracking-[0.2em] uppercase font-bold text-zinc-500 block"
          >
            Password length
          </label>
          <input
            id="pw-length"
            type="number"
            min={1}
            max={512}
            data-testid="pw-length-input"
            value={length}
            onChange={e => {
              const v = Math.max(1, Math.min(512, Number(e.target.value) || 1));
              setLength(v);
            }}
            className="bg-black border border-[#1F1F1F] text-zinc-200 font-mono text-sm
                       px-3 py-2 outline-none rounded-none w-28
                       focus:border-zinc-500 transition-colors duration-150
                       [appearance:textfield]
                       [&::-webkit-outer-spin-button]:appearance-none
                       [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      {/* ── Generate button ── */}
      <button
        onClick={generate}
        disabled={noneSelected}
        data-testid="pw-generate-btn"
        className="flex items-center gap-2 bg-white text-black px-5 py-2.5
                   font-bold uppercase tracking-wide text-sm rounded-none
                   hover:bg-zinc-200 active:translate-y-0.5
                   transition-colors duration-150
                   disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <RefreshCw size={14} />
        Generate Password
      </button>

      {/* ── Output ── */}
      {password && (
        <div className="space-y-4 border border-[#1F1F1F] p-5 bg-[#0A0A0A]">
          <OutputField
            label="Generated Password"
            value={password}
            rows={2}
            testId="pw-output"
          />

          <div className="flex items-center gap-2 pt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            <p className="text-xs text-zinc-500">
              {password.length} characters · uses Web Crypto API · generated in-browser
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
