import React, { useState, useRef } from 'react';
import { Mic, Volume2, Globe, Check, Sparkles, User, Play, Pause, Search } from 'lucide-react';
import { VoiceOption, VoiceGender, VoiceTier } from '../types/tts';
import { SUPPORTED_LANGUAGES, VOICE_CATALOG } from '../data/voices';

interface VoiceSelectorProps {
  selectedVoiceId: string;
  onSelectVoice: (voice: VoiceOption) => void;
  selectedLanguageCode: string;
  onSelectLanguage: (langCode: string) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoiceId,
  onSelectVoice,
  selectedLanguageCode,
  onSelectLanguage,
}) => {
  const [genderFilter, setGenderFilter] = useState<'ALL' | VoiceGender>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Filter voices by language, gender, search query
  const availableVoices = VOICE_CATALOG.filter((voice) => {
    const matchLang = voice.languageCode === selectedLanguageCode;
    const matchGender = genderFilter === 'ALL' || voice.gender === genderFilter;
    const matchSearch =
      searchQuery.trim() === '' ||
      voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchLang && matchGender && matchSearch;
  });

  // Handle sample audio preview using web speech or synthesized audio
  const handlePreviewVoice = (voice: VoiceOption, e: React.MouseEvent) => {
    e.stopPropagation();

    // If already playing this voice, stop
    if (playingVoiceId === voice.id) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingVoiceId(null);
      return;
    }

    // Stop existing audio
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setPlayingVoiceId(voice.id);

    // Try web speech synthesis preview or audio element
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(voice.sampleText);
      utterance.lang = voice.languageCode;
      utterance.rate = 1.0;
      utterance.pitch = voice.gender === 'FEMALE' ? 1.1 : 0.9;

      // Find best matching voice if available in browser
      const sysVoices = window.speechSynthesis.getVoices();
      const match = sysVoices.find((v) => v.lang === voice.languageCode);
      if (match) utterance.voice = match;

      utterance.onend = () => setPlayingVoiceId(null);
      utterance.onerror = () => setPlayingVoiceId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingVoiceId(null), 2500);
    }
  };

  const getTierBadge = (tier: VoiceTier) => {
    switch (tier) {
      case 'Journey':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Sparkles className="w-2.5 h-2.5 text-amber-600" />
            Journey Natural
          </span>
        );
      case 'Neural2':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <Sparkles className="w-2.5 h-2.5 text-blue-600" />
            Neural2 HD
          </span>
        );
      case 'Studio':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">
            Studio Booth
          </span>
        );
      case 'WaveNet':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-900 border border-teal-300">
            WaveNet DeepMind
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            Standard
          </span>
        );
    }
  };

  return (
    <div id="card-voice-selector" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Pilihan Suara & Bahasa Natural</h2>
            <p className="text-xs text-slate-700">Didukung model Google Cloud Neural2, Journey, dan WaveNet</p>
          </div>
        </div>

        {/* Language dropdown */}
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-slate-400" />
          <select
            id="select-language"
            value={selectedLanguageCode}
            onChange={(e) => {
              onSelectLanguage(e.target.value);
              // Auto-select first voice in new language
              const firstVoice = VOICE_CATALOG.find((v) => v.languageCode === e.target.value);
              if (firstVoice) onSelectVoice(firstVoice);
            }}
            aria-label="Pilih Bahasa Suara"
            className="text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Gender Filter Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setGenderFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              genderFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({VOICE_CATALOG.filter((v) => v.languageCode === selectedLanguageCode).length})
          </button>
          <button
            type="button"
            onClick={() => setGenderFilter('FEMALE')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
              genderFilter === 'FEMALE'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Wanita
          </button>
          <button
            type="button"
            onClick={() => setGenderFilter('MALE')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
              genderFilter === 'MALE'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pria
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative flex-1 max-w-xs min-w-40">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari karakter suara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Voice Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
        {availableVoices.length === 0 ? (
          <div className="col-span-2 py-8 text-center text-slate-700 text-xs">
            Tidak ada suara yang cocok dengan filter yang dipilih.
          </div>
        ) : (
          availableVoices.map((voice) => {
            const isSelected = voice.id === selectedVoiceId;
            const isPlayingThis = playingVoiceId === voice.id;

            return (
              <div
                key={voice.id}
                onClick={() => onSelectVoice(voice)}
                className={`group relative p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        voice.gender === 'FEMALE'
                          ? 'bg-pink-100 text-pink-700 border border-pink-200'
                          : 'bg-sky-100 text-sky-700 border border-sky-200'
                      }`}
                    >
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-slate-900 leading-none">
                          {voice.name}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-700">
                        {voice.gender === 'FEMALE' ? 'Wanita' : 'Pria'} • {voice.languageName}
                      </span>
                    </div>
                  </div>

                  {getTierBadge(voice.tier)}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {voice.description}
                </p>

                {/* Sample Preview button */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[11px] font-mono text-slate-700 truncate max-w-44">
                    {voice.id}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handlePreviewVoice(voice, e)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-medium text-[11px] transition-colors ${
                      isPlayingThis
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isPlayingThis ? (
                      <>
                        <Pause className="w-3 h-3 animate-pulse" />
                        <span>Berhenti</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        <span>Dengarkan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
