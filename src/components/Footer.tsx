import { Link } from 'react-router-dom';
import { Shield, Github, MessageCircle, Server } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gold-500/20 bg-dark-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-gold-400" />
              <span className="font-display font-bold text-lg text-gold-300">Azeroth Eternal</span>
            </div>
            <p className="text-stone-400 text-sm max-w-md leading-relaxed">
              A blizzlike World of Warcraft: Wrath of the Lich King private server. Experience
              the full 3.3.5a content with an active community and dedicated staff.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center border border-gold-500/30 rounded-sm text-gold-400 hover:bg-gold-500/10 transition-all"
                aria-label="Discord"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center border border-gold-500/30 rounded-sm text-gold-400 hover:bg-gold-500/10 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center border border-gold-500/30 rounded-sm text-gold-400 hover:bg-gold-500/10 transition-all"
                aria-label="Server Status"
              >
                <Server className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-gold-300 mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/realms" className="text-stone-400 hover:text-gold-300 transition-colors">Realm Status</Link></li>
              <li><Link to="/news" className="text-stone-400 hover:text-gold-300 transition-colors">News & Updates</Link></li>
              <li><Link to="/connect" className="text-stone-400 hover:text-gold-300 transition-colors">How to Connect</Link></li>
              <li><Link to="/register" className="text-stone-400 hover:text-gold-300 transition-colors">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-gold-300 mb-4 text-sm uppercase tracking-wider">
              Server Info
            </h3>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>Expansion: WotLK 3.3.5a</li>
              <li>XP Rate: x1 Blizzlike</li>
              <li>Location: Frankfurt, EU</li>
              <li>Uptime: 99.9%</li>
            </ul>
          </div>
        </div>

        <div className="divider-gold my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
          <p>Azeroth Eternal is a non-profit fan project. World of Warcraft is a trademark of Blizzard Entertainment.</p>
          <p>This server is not affiliated with or endorsed by Blizzard Entertainment.</p>
        </div>
      </div>
    </footer>
  );
}
