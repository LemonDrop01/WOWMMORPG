import { Users, Wifi, Clock } from 'lucide-react';
import type { Realm } from '@/lib/supabase';

export default function RealmCard({ realm }: { realm: Realm }) {
  const fillPercent = Math.min(100, (realm.players_online / realm.max_players) * 100);

  return (
    <div className="card card-hover p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display text-xl font-bold text-gold-300">{realm.name}</h3>
            <span
              className={`flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full ${
                realm.online
                  ? 'bg-green-500/15 text-green-400'
                  : 'bg-red-500/15 text-red-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  realm.online ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                }`}
              />
              {realm.online ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 bg-gold-500/10 text-gold-400 rounded-sm">{realm.type}</span>
            <span className="px-2 py-1 bg-frost-500/10 text-frost-300 rounded-sm">{realm.expansion}</span>
          </div>
        </div>
      </div>

      {realm.description && (
        <p className="text-stone-400 text-sm mb-4 leading-relaxed">{realm.description}</p>
      )}

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 text-stone-400">
              <Users className="w-3.5 h-3.5" />
              Players Online
            </span>
            <span className="text-gold-300 font-medium">
              {realm.players_online} / {realm.max_players}
            </span>
          </div>
          <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-500 to-ember-400 rounded-full transition-all duration-500"
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-stone-400">
            <Clock className="w-3.5 h-3.5" />
            Uptime
          </span>
          <span className="text-stone-300">{realm.uptime}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-stone-400">
            <Wifi className="w-3.5 h-3.5" />
            Host
          </span>
          <span className="text-stone-300 font-mono text-[11px]">{realm.host}:{realm.port}</span>
        </div>
      </div>
    </div>
  );
}
