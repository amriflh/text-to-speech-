import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Volume2, History, AlertCircle, ArrowRight, Check } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { TextInputCard } from './components/TextInputCard';
import { VoiceSelector } from './components/VoiceSelector';
import { VoiceCustomization } from './components/VoiceCustomization';
import { AudioPlayerSection } from './components/AudioPlayerSection';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SsmlHelperModal } from './components/SsmlHelperModal';
import { AboutModal } from './components/AboutModal';
import { VoiceOption, AudioSettings, ConversionHistoryItem, PresetStyle } from './types/tts';
import { VOICE_CATALOG } from './data/voices';
import { SAMPLE_TEMPLATES, TextTemplate } from './data/templates';
import {
  saveHistoryItem,
  getHistoryItems,
  deleteHistoryItem,
  clearAllHistory,
} from './utils/audioStorage';

export default function App() {
  // Default text in Indonesian
  const [text, setText] = useState(
    'Selamat datang di aplikasi Google Cloud Text to Audio! Anda dapat mengubah teks apa saja menjadi suara alami berstandar studio. Coba sesuaikan kecepatan bicara serta nada suara agar intonasinya terdengar semakin ekspresif dan hidup.'
  );
  const [isSsml, setIsSsml] = useState(false);

  // Selected language and voice (Default to Indonesian Neural2)
  const [selectedLanguageCode, setSelectedLanguageCode] = useState('id-ID');
  const defaultVoice =
    VOICE_CATALOG.find((v) => v.id === 'id-ID-Neural2-A') || VOICE_CATALOG[0];
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(defaultVoice);

  // Audio customization settings
  const [settings, setSettings] = useState<AudioSettings>({
    speakingRate: 1.0,
    pitch: 0.0,
    volumeGainDb: 0.0,
    audioEncoding: 'MP3',
  });

  // State
  const [isConverting, setIsConverting] = useState(false);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<ConversionHistoryItem | null>(null);
  const [historyItems, setHistoryItems] = useState<ConversionHistoryItem[]>([]);

  // Modals / Drawers
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSsmlHelperOpen, setIsSsmlHelperOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Load history from IndexedDB on initial mount
  useEffect(() => {
    async function loadHistory() {
      try {
        const items = await getHistoryItems();
        setHistoryItems(items);
        if (items.length > 0 && !currentAudio) {
          setCurrentAudio(items[0]);
        }
      } catch (err) {
        console.warn('Failed to load history:', err);
      }
    }
    loadHistory();
  }, []);

  // Main Conversion Handler
  const handleConvert = async () => {
    if (!text.trim()) {
      setConversionError('Silakan masukkan teks terlebih dahulu sebelum melakukan konversi.');
      return;
    }

    setConversionError(null);
    setIsConverting(true);

    try {
      const response = await fetch('/api/tts/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          isSsml,
          languageCode: selectedVoice.languageCode,
          voiceName: selectedVoice.id,
          ssmlGender: selectedVoice.gender,
          speakingRate: settings.speakingRate,
          pitch: settings.pitch,
          volumeGainDb: settings.volumeGainDb,
          audioEncoding: 'MP3',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Gagal memproses audio dari server.');
      }

      const newItem: ConversionHistoryItem = {
        id: `tts_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        text: text.trim(),
        languageCode: selectedVoice.languageCode,
        languageName: selectedVoice.languageName,
        voiceId: selectedVoice.id,
        voiceName: selectedVoice.name,
        voiceTier: selectedVoice.tier,
        gender: selectedVoice.gender,
        settings: { ...settings },
        createdAt: Date.now(),
        audioBase64: data.audioBase64,
        mimeType: data.mimeType || 'audio/mp3',
        engineUsed: data.engine || 'Google Cloud TTS',
      };

      // Save to IndexedDB
      await saveHistoryItem(newItem);

      // Update state
      setCurrentAudio(newItem);
      setHistoryItems((prev) => [newItem, ...prev]);

      // Smooth scroll to audio player on mobile if needed
      const playerEl = document.getElementById('card-audio-player-active');
      if (playerEl && window.innerWidth < 768) {
        playerEl.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error('Conversion error:', err);
      setConversionError(
        err.message || 'Terjadi gangguan saat menghubungkan ke layanan sintesis audio.'
      );
    } finally {
      setIsConverting(false);
    }
  };

  const handleSelectTemplate = (template: TextTemplate) => {
    setText(template.text);
    if (template.languageCode !== selectedLanguageCode) {
      setSelectedLanguageCode(template.languageCode);
      const matchedVoice = VOICE_CATALOG.find((v) => v.languageCode === template.languageCode);
      if (matchedVoice) setSelectedVoice(matchedVoice);
    }
  };

  const handleApplyPreset = (preset: PresetStyle) => {
    setSettings((prev) => ({
      ...prev,
      speakingRate: preset.speakingRate,
      pitch: preset.pitch,
      volumeGainDb: preset.volumeGainDb,
    }));
  };

  const handleInsertSsmlTag = (tag: string) => {
    setIsSsml(true);
    setText((prev) => `${prev} ${tag}`);
  };

  const handleDeleteHistory = async (id: string) => {
    await deleteHistoryItem(id);
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
    if (currentAudio?.id === id) {
      setCurrentAudio(null);
    }
  };

  const handleClearAllHistory = async () => {
    await clearAllHistory();
    setHistoryItems([]);
    setCurrentAudio(null);
  };

  const handleLoadIntoEditor = (item: ConversionHistoryItem) => {
    setText(item.text);
    setSelectedLanguageCode(item.languageCode);
    const voice = VOICE_CATALOG.find((v) => v.id === item.voiceId);
    if (voice) setSelectedVoice(voice);
    setSettings({ ...item.settings });
    setCurrentAudio(item);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        historyCount={historyItems.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsAboutOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Error notification if any */}
        {conversionError && (
          <div
            id="alert-conversion-error"
            className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start justify-between gap-3 animate-in fade-in"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Konversi Belum Berhasil</p>
                <p className="mt-0.5 text-red-700">{conversionError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setConversionError(null)}
              className="text-red-500 hover:text-red-800 text-xs font-semibold"
            >
              Tutup
            </button>
          </div>
        )}

        {/* 2-Column Responsive Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Input & Customization (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Text Input Card */}
            <TextInputCard
              text={text}
              onChange={setText}
              selectedLangCode={selectedLanguageCode}
              onSelectTemplate={handleSelectTemplate}
              onOpenSsmlHelper={() => setIsSsmlHelperOpen(true)}
              isSsml={isSsml}
              onToggleSsml={setIsSsml}
            />

            {/* Customization Sliders (Speed, Pitch, Presets) */}
            <VoiceCustomization
              settings={settings}
              onChangeSettings={setSettings}
              onApplyPreset={handleApplyPreset}
            />

            {/* Conversion CTA Action for desktop */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-xs font-semibold text-slate-700 block">
                  Siap menghasilkan audio berkualitas tinggi?
                </span>
                <span className="text-[11px] text-slate-700">
                  Model: <strong className="text-slate-800">{selectedVoice.name}</strong> • Format MP3 (320kbps)
                </span>
              </div>

              <button
                id="btn-convert-speech"
                type="button"
                onClick={handleConvert}
                disabled={isConverting || !text.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:shadow-none transition-all cursor-pointer active:scale-98 disabled:cursor-not-allowed"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mensintesis Audio...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Konversi ke Audio</span>
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Player & Voice Catalog (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Audio Player Component */}
            <AudioPlayerSection
              currentAudio={currentAudio}
              onReplay={() => {
                if (currentAudio) {
                  // Trigger reload in player
                  setCurrentAudio({ ...currentAudio });
                }
              }}
            />

            {/* Voice Catalog Selector */}
            <VoiceSelector
              selectedVoiceId={selectedVoice.id}
              onSelectVoice={setSelectedVoice}
              selectedLanguageCode={selectedLanguageCode}
              onSelectLanguage={(lang) => {
                setSelectedLanguageCode(lang);
              }}
            />
          </div>
        </div>
      </main>

      {/* Conversion History Slide-Over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyItems={historyItems}
        onSelectHistoryItem={(item) => setCurrentAudio(item)}
        onDeleteHistoryItem={handleDeleteHistory}
        onClearAll={handleClearAllHistory}
        onLoadIntoEditor={handleLoadIntoEditor}
      />

      {/* SSML Assistant Modal */}
      <SsmlHelperModal
        isOpen={isSsmlHelperOpen}
        onClose={() => setIsSsmlHelperOpen(false)}
        onInsertTag={handleInsertSsmlTag}
      />

      {/* About & Guide Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Subtle Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-700">
          <p>
            Google Cloud Text to Audio • Sintesis Suara Neural2 & WaveNet
          </p>
          <div className="flex items-center gap-3 text-slate-700">
            <span>Ekspor MP3 24kHz</span>
            <span>•</span>
            <span>Penyimpanan Lokal Aman</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
