import React from 'react';
import { Volume2, History, Settings2, Sparkles, Smartphone, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  historyCount: number;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onOpenAndroidInstall: () => void;
  onOpenSecurity: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  historyCount,
  onOpenHistory,
  onOpenSettings,
  onOpenAndroidInstall,
  onOpenSecurity,
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
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Android APK Button */}
          <button
            id="btn-nav-install-apk"
            type="button"
            onClick={onOpenAndroidInstall}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100/80 border border-blue-200/80 rounded-lg transition-all cursor-pointer"
            title="Instal Aplikasi di Android (APK)"
          >
            <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Instal di HP</span>
            <span className="hidden lg:inline-block px-1 py-0.2 text-[9px] uppercase font-extrabold bg-blue-600 text-white rounded">
              APK
            </span>
          </button>

          {/* Security & Data Safety Center */}
          <button
            id="btn-nav-security"
            type="button"
            onClick={onOpenSecurity}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-lg transition-all cursor-pointer"
            title="Keamanan & Privasi Data Aman"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="hidden md:inline">Data Aman</span>
          </button>

          {/* History Button */}
          <button
            id="btn-open-history"
            type="button"
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer"
            title="Buka Riwayat Konversi"
          >
            <History className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Riwayat</span>
            {historyCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold bg-blue-600 text-white rounded-full min-w-4 text-center">
                {historyCount}
              </span>
            )}
          </button>

          {/* Settings / API Key modal button */}
          <button
            id="btn-open-settings"
            type="button"
            onClick={onOpenSettings}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
            title="Pengaturan API & Kunci"
          >
            <Settings2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

