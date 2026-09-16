import React from 'react';
import { Volume2, History, Settings2, Sparkles, Radio } from 'lucide-react';

interface NavbarProps {
  historyCount: number;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  historyCount,
  onOpenHistory,
  onOpenSettings,
}) => {
  return (
    <header id="app-header" className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Volume2 className="w-5 h-5 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-lg font-bold text-slate-900 leading-tight truncate">
                <span className="xs:hidden">Google Cloud TTS</span>
                <span className="hidden xs:inline">Google Cloud Text to Audio</span>
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 shrink-0">
                <Sparkles className="w-3 h-3 text-blue-600" />
                Neural2 & WaveNet
              </span>
            </div>
            <p className="text-xs text-slate-700 hidden sm:block truncate">
              Sintesis Suara Natural AI, Kustomisasi Nada & Unduhan MP3 Cepat
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Cloud TTS Ready</span>
          </div>

          {/* History Button */}
          <button
            id="btn-open-history"
            onClick={onOpenHistory}
            className="relative flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
            title="Buka Riwayat Konversi"
          >
            <History className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Riwayat</span>
            {historyCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full min-w-5 text-center">
                {historyCount}
              </span>
            )}
          </button>

          {/* Settings / API Key modal button */}
          <button
            id="btn-open-settings"
            onClick={onOpenSettings}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            title="Pengaturan API & Kunci"
          >
            <Settings2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
