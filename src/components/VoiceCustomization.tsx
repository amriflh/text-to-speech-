import React from 'react';
import { Sliders, RotateCcw, Gauge, Music, Volume2, Sparkles, Smile, BookOpen, Newspaper, Briefcase, Zap, Feather } from 'lucide-react';
import { AudioSettings, PresetStyle } from '../types/tts';
import { EXPRESSIVE_PRESETS } from '../data/voices';

interface VoiceCustomizationProps {
  settings: AudioSettings;
  onChangeSettings: (newSettings: AudioSettings) => void;
  onApplyPreset: (preset: PresetStyle) => void;
}

export const VoiceCustomization: React.FC<VoiceCustomizationProps> = ({
  settings,
  onChangeSettings,
  onApplyPreset,
}) => {
  const handleReset = () => {
    onChangeSettings({
      speakingRate: 1.0,
      pitch: 0.0,
      volumeGainDb: 0.0,
      audioEncoding: 'MP3',
    });
  };

  const renderPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smile':
        return <Smile className="w-3.5 h-3.5 text-blue-500" />;
      case 'BookOpen':
        return <BookOpen className="w-3.5 h-3.5 text-amber-500" />;
      case 'Newspaper':
        return <Newspaper className="w-3.5 h-3.5 text-indigo-500" />;
      case 'Briefcase':
        return <Briefcase className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Zap':
        return <Zap className="w-3.5 h-3.5 text-orange-500" />;
      case 'Feather':
        return <Feather className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  return (
    <div id="card-voice-customization" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Kustomisasi Nada & Kecepatan Bicara</h2>
            <p className="text-xs text-slate-700">Atur ekspresi audio agar lebih hidup, santai, atau berwibawa</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
          title="Kembalikan Pengaturan ke Default"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Default</span>
        </button>
      </div>

      {/* Expressive Presets Quick Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-1.5 mb-2.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Gaya Bicara Cepat (Presets)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 sm:hidden">Geser samping →</span>
        </div>
        <div className="flex overflow-x-auto pb-2 sm:pb-0 gap-2 sm:grid sm:grid-cols-3 lg:grid-cols-6 scrollbar-thin">
          {EXPRESSIVE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyPreset(preset)}
              className="flex-shrink-0 w-36 sm:w-auto flex flex-col items-start p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-left transition-all group active:scale-95 cursor-pointer"
            >
              <div className="flex items-center gap-1.5 mb-1 w-full">
                {renderPresetIcon(preset.iconName)}
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 truncate">
                  {preset.name}
                </span>
              </div>
              <span className="text-[11px] text-slate-600 font-mono">
                {preset.speakingRate}x • {preset.pitch > 0 ? `+${preset.pitch}` : preset.pitch}st
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* 1. Speaking Rate Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="input-speaking-rate" className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Gauge className="w-4 h-4 text-blue-600" />
              Kecepatan Bicara (Speed)
            </label>
            <div className="flex items-center gap-1">
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                {settings.speakingRate.toFixed(2)}x
              </span>
              <span className="text-[11px] text-slate-600">
                {settings.speakingRate < 0.85
                  ? '(Lambat)'
                  : settings.speakingRate > 1.2
                  ? '(Cepat)'
                  : '(Normal)'}
              </span>
            </div>
          </div>

          <input
            id="input-speaking-rate"
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={settings.speakingRate}
            onChange={(e) =>
              onChangeSettings({
                ...settings,
                speakingRate: parseFloat(e.target.value),
              })
            }
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />

          <div className="flex justify-between text-[11px] text-slate-600 px-0.5">
            <button
              type="button"
              onClick={() => onChangeSettings({ ...settings, speakingRate: 0.75 })}
              className="hover:text-slate-900"
            >
              0.75x Lambat
            </button>
            <button
              type="button"
              onClick={() => onChangeSettings({ ...settings, speakingRate: 1.0 })}
              className="font-bold text-blue-600 hover:text-blue-800"
            >
              1.0x Normal
            </button>
            <button
              type="button"
              onClick={() => onChangeSettings({ ...settings, speakingRate: 1.25 })}
              className="hover:text-slate-900"
            >
              1.25x Cepat
            </button>
            <button
              type="button"
              onClick={() => onChangeSettings({ ...settings, speakingRate: 1.5 })}
              className="hover:text-slate-900"
            >
              1.5x Kilat
            </button>
          </div>
        </div>

        {/* 2. Pitch Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="input-pitch" className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Music className="w-4 h-4 text-purple-600" />
              Nada Suara (Pitch)
            </label>
            <div className="flex items-center gap-1">
              <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                {settings.pitch > 0 ? `+${settings.pitch.toFixed(1)}` : settings.pitch.toFixed(1)} st
              </span>
              <span className="text-[11px] text-slate-600">
                {settings.pitch < -2
                  ? '(Berat/Dalam)'
                  : settings.pitch > 2
                  ? '(Tinggi/Ceria)'
                  : '(Standar)'}
              </span>
            </div>
          </div>

          <input
            id="input-pitch"
            type="range"
            min="-12.0"
            max="12.0"
            step="0.5"
            value={settings.pitch}
            onChange={(e) =>
              onChangeSettings({
                ...settings,
                pitch: parseFloat(e.target.value),
              })
            }
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />

          <div className="flex justify-between text-[11px] text-slate-600 px-0.5">
            <button
              type="button"
              onClick={() => onChangeSettings({ ...settings, pitch: -6.0 })}
              className="hover:text-slate-900"
            >
              -6st Berat
            </button>
            <button
              type="button"
              onClick={() => onChangeSettings({ ...settings, pitch: 0.0 })}
              className="font-bold text-purple-600 hover:text-purple-800"
            >
              0st Standar
            </button>
            <button
              type="button"
              onClick={() => onChangeSettings({ ...settings, pitch: 6.0 })}
              className="hover:text-slate-900"
            >
              +6st Tinggi
            </button>
          </div>
        </div>
      </div>

      {/* Audio Format / Volume Info Strip */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <Volume2 className="w-3.5 h-3.5 text-slate-500" />
            Format Output: <strong className="text-slate-900">MPEG-3 (.mp3)</strong> High Fidelity
          </span>
          <span className="hidden sm:inline-block text-slate-300">•</span>
          <span className="hidden sm:inline-block">
            Sample Rate: <strong className="text-slate-800">24,000 Hz / 320 kbps</strong>
          </span>
        </div>

        <div className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
          ✓ Optimasi Kompresi Kilat
        </div>
      </div>
    </div>
  );
};
