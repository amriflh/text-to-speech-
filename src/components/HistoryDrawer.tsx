import React, { useState } from 'react';
import { X, History, Search, Download, Play, Pause, Trash2, ArrowUpRight, Copy, Check, Clock, Volume2 } from 'lucide-react';
import { ConversionHistoryItem } from '../types/tts';
import { triggerAudioDownload } from '../utils/audioStorage';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  historyItems: ConversionHistoryItem[];
  onSelectHistoryItem: (item: ConversionHistoryItem) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearAll: () => void;
  onLoadIntoEditor: (item: ConversionHistoryItem) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  historyItems,
  onSelectHistoryItem,
  onDeleteHistoryItem,
  onClearAll,
  onLoadIntoEditor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  const filteredItems = historyItems.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.text.toLowerCase().includes(q) ||
      item.voiceName.toLowerCase().includes(q) ||
      item.languageName.toLowerCase().includes(q)
    );
  });

  const handlePlayAudio = (item: ConversionHistoryItem) => {
    if (playingId === item.id) {
      if (audioRef.current) audioRef.current.pause();
      setPlayingId(null);
      return;
    }

    if (audioRef.current) audioRef.current.pause();

    const audio = new Audio(`data:${item.mimeType || 'audio/mp3'};base64,${item.audioBase64}`);
    audioRef.current = audio;
    setPlayingId(item.id);

    audio.play().catch(() => setPlayingId(null));
    audio.onended = () => setPlayingId(null);
    audio.onerror = () => setPlayingId(null);
  };

  const handleDownload = (item: ConversionHistoryItem) => {
    const dateStr = new Date(item.createdAt).toISOString().slice(0, 10);
    const safeTitle = item.text.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `TTS_${item.voiceName.replace(/[^a-zA-Z0-9]/g, '_')}_${safeTitle}_${dateStr}.mp3`;
    triggerAudioDownload(item.audioBase64, item.mimeType || 'audio/mp3', filename);
  };

  const handleCopyText = (item: ConversionHistoryItem) => {
    navigator.clipboard.writeText(item.text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diffSec = Math.floor((now - timestamp) / 1000);
    if (diffSec < 60) return 'Baru saja';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} menit lalu`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} jam lalu`;
    const diffDays = Math.floor(diffHour / 24);
    return `${diffDays} hari lalu`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Riwayat Konversi</h2>
              <p className="text-xs text-slate-700">{historyItems.length} file tersimpan di perangkat</p>
            </div>
          </div>

          <button
            id="btn-close-history"
            type="button"
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/50">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari teks naskah atau nama suara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>

          {historyItems.length > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700">Daftar Terkini</span>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Hapus seluruh riwayat konversi audio dari perangkat ini?')) {
                    onClearAll();
                  }
                }}
                className="text-red-600 hover:text-red-700 hover:underline font-medium"
              >
                Hapus Semua
              </button>
            </div>
          )}
        </div>

        {/* History Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-700 mb-1">Belum Ada Riwayat</h3>
              <p className="text-xs text-slate-700 max-w-xs mx-auto">
                Setiap konversi audio yang Anda buat akan otomatis disimpan di sini agar dapat diputar dan diunduh kembali kapan saja.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isPlayingThis = playingId === item.id;

              return (
                <div
                  key={item.id}
                  className="pt-3 first:pt-0 group hover:bg-slate-50 p-3 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                >
                  {/* Meta Strip */}
                  <div className="flex items-center justify-between text-xs text-slate-700 mb-1.5">
                    <span className="font-semibold text-blue-600 flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5" />
                      {item.voiceName}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>

                  {/* Text Snippet */}
                  <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed mb-3 font-sans">
                    "{item.text}"
                  </p>

                  {/* Settings tags */}
                  <div className="flex items-center gap-2 mb-3 text-[11px] text-slate-700">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                      {item.settings.speakingRate}x
                    </span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                      {item.settings.pitch > 0 ? `+${item.settings.pitch}` : item.settings.pitch}st
                    </span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded">
                      {item.languageName}
                    </span>
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      {/* In-History Play button */}
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          isPlayingThis
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        }`}
                      >
                        {isPlayingThis ? (
                          <>
                            <Pause className="w-3 h-3" />
                            <span>Jeda</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3" />
                            <span>Putar</span>
                          </>
                        )}
                      </button>

                      {/* Instant Download MP3 */}
                      <button
                        type="button"
                        onClick={() => handleDownload(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                        title="Unduh file MP3"
                      >
                        <Download className="w-3 h-3" />
                        <span>MP3</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Load into editor */}
                      <button
                        type="button"
                        onClick={() => {
                          onLoadIntoEditor(item);
                          onClose();
                        }}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Muat teks & setelan ini ke editor utama"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Copy text */}
                      <button
                        type="button"
                        onClick={() => handleCopyText(item)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Salin teks naskah"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => onDeleteHistoryItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus dari riwayat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
