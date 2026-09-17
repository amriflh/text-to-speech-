import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Database,
  EyeOff,
  Server,
  Key,
  X,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

interface SecurityPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearData: () => void;
}

export const SecurityPrivacyModal: React.FC<SecurityPrivacyModalProps> = ({
  isOpen,
  onClose,
  onClearData,
}) => {
  const [dataClearedNotice, setDataClearedNotice] = useState(false);

  if (!isOpen) return null;

  const handlePurge = () => {
    if (window.confirm('Yakin ingin menghapus semua riwayat audio dan naskah yang tersimpan di perangkat ini?')) {
      onClearData();
      setDataClearedNotice(true);
      setTimeout(() => setDataClearedNotice(false), 3000);
    }
  };

  return (
    <div
      id="modal-security-privacy"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Pusat Keamanan & Privasi Data
              </h3>
              <p className="text-xs text-emerald-100">
                Perlindungan data pribadi & enkripsi anti-hack
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-700 text-sm">
          {/* Security Status Card */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                Status Sistem: Terproteksi Maksimal
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Semua transmisi dienkripsi dengan TLS/HTTPS dan data disimpan di ruang aman perangkat.
              </p>
            </div>
          </div>

          {dataClearedNotice && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Semua data riwayat dan cache audio berhasil dibersihkan dari perangkat.</span>
            </div>
          )}

          {/* Pillars of Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Pilar Keamanan & Keselamatan Data:
            </h4>

            {/* 1. Local Sandbox */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Database className="w-4 h-4 text-blue-600" />
                <span>1. Penyimpanan Lokal Terisolasi (IndexedDB Sandbox)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Teks yang Anda ketik dan file audio yang diunduh tidak disimpan di database server umum. Semuanya berada di memori aman perangkat Anda sendiri melalui peramban yang diisolasi oleh sistem operasi Android.
              </p>
            </div>

            {/* 2. No Tracking / Spyware */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <EyeOff className="w-4 h-4 text-emerald-600" />
                <span>2. Bebas Pelacak, Iklan, & Spyware</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aplikasi tidak memuat script analitik pelacak periklanan pihak ketiga. Tidak ada pemantauan aktivitas atau rekaman pembicaraan di latar belakang.
              </p>
            </div>

            {/* 3. Zero Permissions */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>3. Kebijakan Tanpa Izin Berbahaya (Permissions Policy)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aplikasi secara eksplisit memblokir akses ke kamera, mikrofon perekam luar, kontak, dan GPS melalui header keamanan sistem: <code className="bg-slate-200/70 px-1 py-0.5 rounded text-[10px]">camera=(), microphone=(), geolocation=()</code>.
              </p>
            </div>

            {/* 4. API Key Protection */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Key className="w-4 h-4 text-amber-600" />
                <span>4. Proteksi Kunci Rahasia Sisi Server</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kunci API Google Cloud diproteksi di backend server dan tidak pernah terekspos ke kode publik peramban pengguna.
              </p>
            </div>
          </div>

          {/* Privacy Control Action */}
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
            <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Hak Kendali Data Pengguna:</span>
            </h5>
            <p className="text-xs text-slate-600">
              Anda memiliki kendali penuh untuk menghapus seluruh jejak riwayat audio dan naskah dari perangkat ini kapan saja.
            </p>
            <button
              type="button"
              onClick={handlePurge}
              className="w-full py-2 px-3 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Bersihkan Seluruh Riwayat dari Memori Perangkat</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Sesuai Standar Keamanan OWASP & Android
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
