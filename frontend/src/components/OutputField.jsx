import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function OutputField({ label, value, mono = true, rows = 3, testId }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast('Copied to clipboard', {
        style: { background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#fff' },
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text for manual copy
      const el = document.querySelector(`[data-testid="${testId}"]`);
      if (el) { el.select(); }
      toast('Press Ctrl+C to copy', {
        style: { background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#fff' },
      });
    }
  };

  return (
    <div className="space-y-1">
      {label && (
        <p className="text-xs tracking-[0.2em] uppercase font-bold text-zinc-500">{label}</p>
      )}
      <div className="relative group">
        <textarea
          readOnly
          rows={rows}
          value={value || ''}
          data-testid={testId}
          placeholder="— output will appear here —"
          className={cn(
            'w-full bg-black border border-[#1F1F1F] p-3 pr-12 text-zinc-300',
            'placeholder:text-zinc-700 resize-none outline-none rounded-none',
            'selection:bg-white selection:text-black',
            mono ? 'font-mono text-xs leading-relaxed' : 'text-sm',
          )}
        />
        <button
          onClick={handleCopy}
          disabled={!value}
          data-testid={`${testId}-copy-btn`}
          className="absolute top-2 right-2 p-1.5 text-zinc-600 hover:text-white
                     border border-transparent hover:border-[#1F1F1F]
                     transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Copy to clipboard"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}
