import React from 'react';
import { X, Code2, Sparkles, Plus } from 'lucide-react';

interface SsmlHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertTag: (tag: string) => void;
}

export const SsmlHelperModal: React.FC<SsmlHelperModalProps> = ({
  isOpen,
  onClose,
  onInsertTag,
}) => {
  if (!isOpen) return null;

  const ssmlTags = [
    {
      title: 'Jeda Waktu (Pause / Break)',
      tag: '<break time="500ms"/>',
      description: 'Menambahkan hening 0.5 detik (500ms) atau 1 detik (1s) antar kalimat.',
    },
    {
      title: 'Penekanan Kuat (Emphasis)',
      tag: '<emphasis level="strong">kata penting</emphasis>',
      description: 'Menekankan kata tertentu agar terdengar lebih tegas dan menonjol.',
    },
    {
      title: 'Pengaturan Tempo Kalimat (Prosody Rate)',
      tag: '<prosody rate="slow">kalimat diucapkan perlahan</prosody>',
      description: 'Mengubah kecepatan bicara untuk bagian kalimat tertentu saja.',
    },
    {
      title: 'Pengaturan Nada Kalimat (Prosody Pitch)',
      tag: '<prosody pitch="+4st">nada lebih tinggi</prosody>',
      description: 'Menaikkan atau menurunkan nada intonasi secara spesifik.',
    },
    {
      title: 'Ejaan Huruf Demi Huruf (Spell-out)',
      tag: '<say-as interpret-as="characters">AI</say-as>',
      description: 'Mengeja akronim atau singkatan huruf per huruf (A - I).',
    },
    {
      title: 'Format Tanggal & Waktu (Date/Time)',
      tag: '<say-as interpret-as="date" format="dmy">15-09-2026</say-as>',
      description: 'Membacakan angka sebagai format tanggal lengkap secara natural.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Bantuan Tag SSML</h3>
              <p className="text-xs text-slate-700">Speech Synthesis Markup Language untuk intonasi dinamis</p>
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

        {/* Content list */}
        <div className="p-4 sm:p-5 max-h-96 overflow-y-auto space-y-3">
          {ssmlTags.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 transition-all flex items-start justify-between gap-3"
            >
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">{item.title}</h4>
                <p className="text-xs text-slate-700 mb-2">{item.description}</p>
                <code className="text-[11px] font-mono bg-slate-100 text-purple-700 px-2 py-0.5 rounded border border-slate-200 block max-w-fit">
                  {item.tag}
                </code>
              </div>
              <button
                type="button"
                onClick={() => {
                  onInsertTag(item.tag);
                  onClose();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Sisipkan</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
