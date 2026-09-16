import React from 'react';
import { X, Sparkles, CheckCircle, ShieldCheck, Zap, Globe, AudioLines } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Tentang Layanan Audio</h3>
              <p className="text-xs text-slate-700">Google Cloud Text-to-Speech Engine</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-slate-600 leading-relaxed">
          <div className="flex items-start gap-3 p-3 bg-blue-50/60 rounded-xl border border-blue-100">
            <AudioLines className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5">Model Suara Natural</h4>
              <p>
                Aplikasi ini terhubung langsung dengan model suara Google Cloud Neural2, Journey, dan WaveNet yang dilatih menggunakan jaringan saraf mendalam untuk intonasi manusia yang fasih.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <Zap className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5">Unduhan MP3 Cepat & Efisien</h4>
              <p>
                File audio yang dihasilkan langsung dikemas dalam format MP3 berkualitas tinggi (sample rate 24kHz/320kbps) yang kompatibel dengan semua pemutar audio dan platform pengeditan video.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-purple-50/60 rounded-xl border border-purple-100">
            <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5">Riwayat Penyimpanan Lokal</h4>
              <p>
                Semua file audio yang telah dikonversi disimpan secara lokal di peramban Anda menggunakan IndexedDB, sehingga tidak membebani kuota data dan privasi naskah tetap terjaga.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-700">Versi 1.0 • Google AI Studio</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
