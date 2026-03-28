import { ShieldCheck } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Toaster } from 'sonner';
import NostrTool from '@/components/NostrTool';
import JWTTool from '@/components/JWTTool';
import SSHTool from '@/components/SSHTool';
import ArgonTool from '@/components/ArgonTool';
import PasswordTool from '@/components/PasswordTool';
import './App.css';

const TABS = [
  { value: 'nostr',    label: 'Nostr' },
  { value: 'jwt',      label: 'JWT Secret' },
  { value: 'ssh',      label: 'SSH Key' },
  { value: 'argon',    label: 'Argon2id' },
  { value: 'password', label: 'Password' },
];

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* Subtle background texture */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/3612930/pexels-photo-3612930.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* ── Header ── */}
      <header
        data-testid="app-header"
        className="sticky top-0 z-50 bg-black border-b border-[#1F1F1F]
                   py-4 px-6 md:px-8 flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white leading-none">
            localkeys
          </h1>
          <p className="text-xs text-zinc-600 tracking-[0.2em] uppercase mt-0.5">
            Cryptographic Key Generator
          </p>
        </div>

        <div
          data-testid="zero-knowledge-badge"
          className="bg-[#FACC15] text-[#422006] font-bold uppercase
                     tracking-widest text-xs px-3 py-1.5 flex items-center gap-1.5"
        >
          <ShieldCheck size={13} strokeWidth={2.5} />
          Zero Knowledge
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="relative max-w-2xl mx-auto px-6 md:px-8 py-10">

        <Tabs defaultValue="nostr" data-testid="tool-tabs">
          {/* Tab triggers — flat border-bottom style */}
          <TabsList
            className="w-full flex bg-transparent p-0 border-b border-[#1F1F1F] gap-0 h-auto rounded-none"
          >
            {TABS.map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                data-testid={`tab-${value}`}
                className="flex-1 rounded-none bg-transparent border-0 py-2.5 text-sm font-medium
                           text-zinc-500 hover:text-zinc-300 transition-colors duration-150
                           data-[state=active]:text-white data-[state=active]:shadow-none
                           data-[state=active]:border-b-2 data-[state=active]:border-white
                           data-[state=active]:bg-transparent focus-visible:ring-0
                           focus-visible:ring-offset-0"
                style={{ marginBottom: '-1px' }}
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="nostr"><NostrTool /></TabsContent>
          <TabsContent value="jwt"><JWTTool /></TabsContent>
          <TabsContent value="ssh"><SSHTool /></TabsContent>
          <TabsContent value="argon"><ArgonTool /></TabsContent>
          <TabsContent value="password"><PasswordTool /></TabsContent>
        </Tabs>
      </main>

      {/* ── Footer ── */}
      <footer className="relative border-t border-[#1F1F1F] py-5 px-8 text-center">
        <p className="text-xs text-zinc-700">
          All cryptographic operations run in your browser.
          No keys, passwords, or secrets are ever sent to a server.
        </p>
      </footer>

      <Toaster position="bottom-right" />
    </div>
  );
}
