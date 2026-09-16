import React, { useState } from 'react';
import { FileText, Trash2, Clipboard, Sparkles, Code2, AlertCircle } from 'lucide-react';
import { SAMPLE_TEMPLATES, TextTemplate } from '../data/templates';

interface TextInputCardProps {
  text: string;
  onChange: (text: string) => void;
  selectedLangCode: string;
  onSelectTemplate: (template: TextTemplate) => void;
  onOpenSsmlHelper: () => void;
  isSsml: boolean;
  onToggleSsml: (val: boolean) => void;
}

export const TextInputCard: React.FC<TextInputCardProps> = ({
  text,
  onChange,
  selectedLangCode,
  onSelectTemplate,
  onOpenSsmlHelper,
  isSsml,
  onToggleSsml,
}) => {
  const [copiedNotification, setCopiedNotification] = useState(false);

  const characterCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const maxCharacters = 5000;

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        onChange(text ? `${text} ${clipText}` : clipText);
      }
    } catch {
      // Clipboard access might be blocked in iframe
    }
  };

  const handleClear = () => {
    onChange('');
  };

  // Filter templates matching current language or general
  const relevantTemplates = SAMPLE_TEMPLATES.filter(
    (t) => t.languageCode === selectedLangCode || t.languageCode === 'id-ID'
  );

  return (
    <div id="card-text-input" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 transition-all">
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Teks Masukan</h2>
            <p className="text-xs text-slate-700">Ketik atau tempel teks yang ingin dikonversi menjadi audio</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => onToggleSsml(!isSsml)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              isSsml
                ? 'bg-purple-50 text-purple-700 border-purple-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="Aktifkan format SSML (Speech Synthesis Markup Language)"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Mode SSML</span>
          </button>

          {isSsml && (
            <button
              type="button"
              onClick={onOpenSsmlHelper}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sisipkan Tag</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePaste}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            title="Tempel dari Clipboard"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tempel</span>
          </button>

          {text.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 border border-red-200 rounded-lg transition-colors"
              title="Kosongkan Teks"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hapus</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          id="textarea-input-text"
          rows={6}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxCharacters}
          placeholder={
            isSsml
              ? `<speak>\n  Halo, selamat datang di <emphasis level="strong">Google Cloud Text to Audio</emphasis>.\n  <break time="500ms"/>\n  Nikmati kejernihan suara natural kelas dunia.\n</speak>`
              : 'Tuliskan kalimat atau naskah Anda di sini (contoh: narasi video, naskah podcast, pengumuman, materi edukasi, atau dongeng)...'
          }
          className="w-full p-4 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-sans text-sm sm:text-base leading-relaxed resize-y"
        />

        {/* Character & Word Count Badge */}
        <div className="flex items-center justify-between text-xs text-slate-700 mt-2 px-1">
          <div className="flex items-center gap-3">
            <span>{wordCount} kata</span>
            <span>•</span>
            <span className={characterCount > maxCharacters * 0.9 ? 'text-amber-600 font-medium' : ''}>
              {characterCount.toLocaleString()} / {maxCharacters.toLocaleString()} karakter
            </span>
          </div>

          {characterCount === 0 && (
            <span className="flex items-center gap-1 text-slate-700">
              <AlertCircle className="w-3.5 h-3.5" />
              Minimal 1 karakter
            </span>
          )}
        </div>
      </div>

      {/* Sample Templates Quick-Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-semibold text-slate-700">Contoh Naskah Siap Pakai:</span>
          </div>
          <span className="text-[11px] text-slate-400 sm:hidden">Geser →</span>
        </div>
        <div className="flex overflow-x-auto pb-2 sm:pb-0 gap-2 sm:flex-wrap scrollbar-thin">
          {relevantTemplates.slice(0, 5).map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelectTemplate(template)}
              className="flex-shrink-0 px-3 py-1.5 text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg border border-slate-200/80 transition-all hover:border-blue-300 text-left font-medium active:scale-95 cursor-pointer"
            >
              {template.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
