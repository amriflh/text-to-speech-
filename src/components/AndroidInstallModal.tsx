import React, { useState } from 'react';
import {
  Smartphone,
  ShieldCheck,
  Download,
  CheckCircle2,
  Lock,
  ExternalLink,
  Info,
  X,
  Share2,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'direct' | 'security' | 'builder'>('direct');
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDirectInstall = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div
      id="modal-android-install"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Instal Aplikasi Android (APK)
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/90 text-white">
                  Aman 100%
                </span>
              </h3>
              <p className="text-xs text-blue-100">
                Pemasangan instan di smartphone Android & tablet
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50 px-4 pt-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('direct')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'direct'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-700 hover:text-slate-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Cara Pasang di HP</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'security'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-700 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Keamanan & Anti-Hack</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('builder')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'builder'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-700 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Paket APK Mandiri</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-sm">
          {/* TAB 1: Cara Pasang di HP */}
          {activeTab === 'direct' && (
            <div className="space-y-4">
              {/* Status Banner */}
              {isInstalled ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900">
                      Aplikasi Sudah Terpasang!
                    </h4>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Aplikasi ini telah aktif di layar beranda perangkat Anda dalam mode mandiri (Standalone WebAPK) dengan perlindungan sandbox Android.
                    </p>
                  </div>
                </div>
              ) : isInstallable ? (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-blue-900">
                      Perangkat Anda Siap Pasang Langsung
                    </h4>
                    <p className="text-xs text-blue-700 mt-1 max-w-sm">
                      Tekan tombol di bawah untuk memasang aplikasi ke menu HP Android Anda tanpa perlu unduh file dari situs mencurigakan.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDirectInstall}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Pasang Aplikasi ke Layar HP Sekarang</span>
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 flex items-center gap-3">
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  <p className="text-xs text-slate-600">
                    Buka link ini di browser <strong>Google Chrome</strong> atau <strong>Samsung Internet</strong> pada HP Android untuk memasang dengan 1 ketukan.
                  </p>
                </div>
              )}

              {/* Step by Step Guide for Android */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Langkah Pemasangan di Android (Chrome / Samsung Internet):
                </h4>

                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div className="text-xs">
                      <strong className="text-slate-800 block">Buka Menu Browser di HP</strong>
                      Ketik alamat web ini di Google Chrome pada smartphone Android, lalu ketuk ikon titik tiga (⋮) di pojok kanan atas browser.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div className="text-xs">
                      <strong className="text-slate-800 block">Pilih &ldquo;Instal Aplikasi&rdquo; atau &ldquo;Tambahkan ke Layar Utama&rdquo;</strong>
                      Pilih menu <span className="font-semibold text-blue-700">&ldquo;Instal aplikasi&rdquo;</span> atau <span className="font-semibold text-blue-700">&ldquo;Add to Home screen&rdquo;</span>.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div className="text-xs">
                      <strong className="text-slate-800 block">Selesai — Aplikasi Muncul di Menu HP</strong>
                      Sistem Android otomatis mengompilasi WebAPK aman dengan ikon resmi, terbuka dalam layar penuh tanpa bilah URL peramban.
                    </div>
                  </div>
                </div>
              </div>

              {/* iOS Note if on Apple */}
              {isIOS && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5" /> Untuk Pengguna iPhone / iPad (iOS):
                  </div>
                  <p className="text-amber-800 text-[11px]">
                    Tekan tombol <strong>Share</strong> (kotak panah ke atas) di Safari, lalu pilih <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Keamanan & Anti-Hack */}
          {activeTab === 'security' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">
                    Keamanan Data & Anti-Hack Terjamin
                  </h4>
                  <p className="text-[11px] text-emerald-700">
                    Aplikasi ini dirancang sesuai standar keamanan tertinggi Google Web & Android Sandbox.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Penyimpanan Lokal Sandboxed (Tanpa Bocor Data)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Naskah teks dan riwayat audio Anda disimpan di <strong>IndexedDB lokal</strong> pada memori terlindung HP Anda. Data tidak pernah diunggah atau dijual ke pihak ketiga.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Lebih Aman Dibanding File APK Mod / Bajakan</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Mengunduh file APK mentah dari sumber asing rentan disisipi trojan atau malware. Pemasangan PWA/WebAPK memanfaatkan kernel security Android OS resmi tanpa risiko modifikasi peretas.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Lock className="w-3.5 h-3.5 text-purple-600" />
                    <span>Zero Permission Berbahaya</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Aplikasi ini <strong>TIDAK MEMINTA</strong> akses kamera, mikrofon perekam, kontak, lokasi, atau penyimpanan foto pribadi Anda. Dilindungi oleh kebijakan izin ketat (Permissions-Policy).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Enkripsi Lalu Lintas HTTPS / TLS 1.3</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Semua transmisi audio terlindungi oleh enkripsi kriptografis tingkat tinggi dan anti-penyadapan (Man-in-the-Middle Protection).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Paket APK Mandiri (PWA Builder) */}
          {activeTab === 'builder' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Ingin File .APK Mandiri untuk Google Play atau Dibagikan?</span>
                </div>
                <p className="text-xs text-indigo-700 leading-relaxed">
                  Aplikasi ini sudah 100% memenuhi standar PWA lengkap (Web App Manifest, Service Worker, Icon Maskable 512px). Anda dapat mengonversinya menjadi berkas <strong>.APK</strong> atau <strong>.AAB</strong> menggunakan alat resmi Microsoft PWA Builder secara gratis.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <strong className="text-slate-800 block font-bold">Cara Ekspor File .APK:</strong>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
                  <li>
                    Salin URL website aplikasi ini (misalnya alamat Cloudflare Anda).
                  </li>
                  <li>
                    Buka situs resmi <strong>PWABuilder.com</strong> di komputer/HP.
                  </li>
                  <li>
                    Tempelkan URL aplikasi, lalu klik <strong>&ldquo;Start&rdquo;</strong>.
                  </li>
                  <li>
                    Pilih platform <strong>Android</strong> lalu klik <strong>&ldquo;Generate Package&rdquo;</strong>.
                  </li>
                  <li>
                    Unduh file <strong>.apk</strong> yang dihasilkan dan pasang langsung di HP Android Anda!
                  </li>
                </ol>
              </div>

              <a
                href="https://www.pwabuilder.com"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Buka Situs PWABuilder.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-700 flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-emerald-600" /> Data tersimpan aman di perangkat
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
