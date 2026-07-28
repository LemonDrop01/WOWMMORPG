import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Download, Settings, Terminal, CheckCircle2, Copy, ChevronRight,
  Monitor, Wifi, FileText, AlertCircle,
} from 'lucide-react';
import { supabase, type Realm, type ServerInfo } from '@/lib/supabase';

export default function ConnectPage() {
  const [realms, setRealms] = useState<Realm[]>([]);
  const [info, setInfo] = useState<ServerInfo[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [r, i] = await Promise.all([
        supabase.from('realms').select('*').order('display_order'),
        supabase.from('server_info').select('*').order('display_order'),
      ]);
      setRealms(r.data ?? []);
      setInfo(i.data ?? []);
      setLoading(false);
    })();
  }, []);

  const realmlist = info.find((i) => i.key === 'realmlist')?.value ?? 'set realmlist logon.azeroth-eternal.com';

  const copyRealmlist = () => {
    navigator.clipboard.writeText(realmlist);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      icon: Download,
      title: 'Step 1: Get the WoW 3.3.5a Client',
      desc: 'Download a clean World of Warcraft 3.3.5a (12340) client. You need the full Wrath of the Lich King client to play. Make sure it is patched to version 3.3.5a build 12340.',
      detail: 'If you have a different version, you can downgrade using the appropriate patches. We do not distribute the client itself — only the server.',
    },
    {
      icon: FileText,
      title: 'Step 2: Set Your Realmlist',
      desc: 'Open your WoW folder and find the file named "realmlist.wtf". Open it with Notepad and replace its contents with our server address.',
      detail: realmlist,
      copyable: true,
    },
    {
      icon: Settings,
      title: 'Step 3: Create Your Account',
      desc: 'If you haven\'t already, create an account on this website. Your website email and password are what you\'ll use to log in to the game.',
      cta: { label: 'Create Account', to: '/register' },
    },
    {
      icon: Terminal,
      title: 'Step 4: Log In and Play',
      desc: 'Launch WoW.exe (not the launcher). Enter your website email and password. Pick a realm and create your character to start playing!',
      detail: 'Use the same email and password you registered with on this site.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <Monitor className="w-12 h-12 text-gold-400 mx-auto mb-4" />
        <h1 className="font-display text-4xl font-bold text-gold-200">How to Connect</h1>
        <p className="text-stone-400 mt-3 max-w-xl mx-auto">
          Follow these steps to start playing on Azeroth Eternal. The whole process takes just a few minutes.
        </p>
        <div className="divider-gold max-w-xs mx-auto mt-6" />
      </div>

      {/* Quick Info Box */}
      <div className="card p-6 mb-10">
        <h2 className="font-display text-lg font-bold text-gold-300 mb-4 flex items-center gap-2">
          <Wifi className="w-5 h-5" />
          Quick Connection Info
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-stone-500 text-xs uppercase tracking-wider mb-1">Realmlist</p>
            <div className="flex items-center gap-2">
              <code className="text-gold-300 font-mono text-sm bg-dark-500/60 px-3 py-1.5 rounded-sm flex-1">
                {realmlist}
              </code>
              <button
                onClick={copyRealmlist}
                className="p-2 text-gold-400 hover:bg-gold-500/10 rounded-sm transition-colors"
                aria-label="Copy realmlist"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <p className="text-stone-500 text-xs uppercase tracking-wider mb-1">Patch Version</p>
            <p className="text-stone-200 text-sm">3.3.5a (Build 12340)</p>
          </div>
          <div>
            <p className="text-stone-500 text-xs uppercase tracking-wider mb-1">Expansion</p>
            <p className="text-stone-200 text-sm">Wrath of the Lich King</p>
          </div>
          <div>
            <p className="text-stone-500 text-xs uppercase tracking-wider mb-1">Max Level</p>
            <p className="text-stone-200 text-sm">80</p>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-6">
        {steps.map((step, i) => (
          <div key={i} className="card p-6 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 flex items-center justify-center bg-gold-500/10 border border-gold-500/20 rounded-lg">
                  <step.icon className="w-6 h-6 text-gold-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold text-gold-200 mb-2">{step.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed mb-3">{step.desc}</p>

                {step.copyable && step.detail ? (
                  <div className="flex items-center gap-2 bg-dark-500/60 border border-gold-500/20 rounded-sm px-4 py-3">
                    <code className="text-gold-300 font-mono text-sm flex-1">{step.detail}</code>
                    <button
                      onClick={copyRealmlist}
                      className="text-gold-400 hover:text-gold-300"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                ) : step.detail ? (
                  <div className="bg-dark-500/60 border border-gold-500/20 rounded-sm px-4 py-3">
                    <p className="text-stone-300 text-sm">{step.detail}</p>
                  </div>
                ) : null}

                {step.cta && (
                  <Link to={step.cta.to} className="btn-gold text-sm mt-4 py-2.5">
                    {step.cta.label}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Available Realms */}
      <div className="mt-12">
        <h2 className="font-display text-2xl font-bold text-gold-200 mb-4">Available Realms</h2>
        {loading ? (
          <div className="card p-6 animate-pulse h-32" />
        ) : (
          <div className="space-y-3">
            {realms.map((realm) => (
              <div key={realm.id} className="card p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${realm.online ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                    <span className="font-display font-bold text-gold-300">{realm.name}</span>
                    <span className="text-xs text-stone-500">· {realm.type} · {realm.expansion}</span>
                  </div>
                  <p className="text-stone-400 text-xs mt-1 font-mono">{realm.host}:{realm.port}</p>
                </div>
                <div className="text-right">
                  <p className="text-stone-300 text-sm">{realm.players_online} / {realm.max_players}</p>
                  <p className="text-stone-500 text-xs">players</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Troubleshooting */}
      <div className="card p-6 mt-10 border-ember-500/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-ember-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display font-bold text-ember-300 mb-2">Troubleshooting</h3>
            <ul className="text-stone-400 text-sm space-y-1.5 list-disc list-inside">
              <li>Make sure your client is exactly version 3.3.5a (build 12340)</li>
              <li>Run WoW.exe directly, not the launcher</li>
              <li>Check that your realmlist.wtf has no extra lines</li>
              <li>Temporarily disable antivirus if the game won't connect</li>
              <li>If stuck on "Connecting", try again in a few minutes — the realm may be restarting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
