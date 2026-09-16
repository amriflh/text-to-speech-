import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Download, Volume2, VolumeX, FastForward, Rewind, Check, Music2, Share2, Sparkles } from 'lucide-react';
import { triggerAudioDownload } from '../utils/audioStorage';
import { ConversionHistoryItem } from '../types/tts';

interface AudioPlayerSectionProps {
  currentAudio: ConversionHistoryItem | null;
  onReplay: () => void;
}

export const AudioPlayerSection: React.FC<AudioPlayerSectionProps> = ({
  currentAudio,
  onReplay,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!currentAudio) return;

    // Reset player state for new audio
    setIsPlaying(false);
    setCurrentTime(0);

    if (audioRef.current) {
      audioRef.current.pause();
      const mime = currentAudio.mimeType || 'audio/mp3';
      audioRef.current.src = `data:${mime};base64,${currentAudio.audioBase64}`;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.load();

      // Auto-play when new audio is converted
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay may be restricted before user interaction
            setIsPlaying(false);
          });
      }
    }
  }, [currentAudio]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        Math.max(0, audioRef.current.currentTime + seconds),
        duration
      );
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const cyclePlaybackRate = () => {
    const rates = [0.75, 1.0, 1.25, 1.5, 2.0];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const handleDownloadMp3 = () => {
    if (!currentAudio) return;

    const dateStr = new Date(currentAudio.createdAt).toISOString().slice(0, 10);
    const safeTitle = currentAudio.text.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `TTS_${currentAudio.voiceName.replace(/[^a-zA-Z0-9]/g, '_')}_${safeTitle}_${dateStr}.mp3`;

    triggerAudioDownload(
      currentAudio.audioBase64,
      currentAudio.mimeType || 'audio/mp3',
      filename
    );

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Approximate file size calculation from base64
  const approximateFileSizeKb = currentAudio
    ? Math.round((currentAudio.audioBase64.length * 0.75) / 1024)
    : 0;

  if (!currentAudio) {
    return (
      <div id="card-audio-player-empty" className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-200/60 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <Music2 className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-700 mb-1">Pemutar Audio Belum Aktif</h3>
        <p className="text-xs text-slate-700 max-w-md mx-auto">
          Tulis teks Anda di atas dan klik tombol <strong>"Konversi ke Audio"</strong> untuk mendengarkan hasil sintesis dan mengunduh file MP3 secara instan.
        </p>
      </div>
    );
  }

  return (
    <div id="card-audio-player-active" className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800 transition-all">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Top Details Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700/60 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Hasil Sintesis Audio
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {currentAudio.engineUsed || 'Google Cloud TTS'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Suara: <strong className="text-slate-200">{currentAudio.voiceName}</strong> ({currentAudio.languageName}) • Kecepatan: {currentAudio.settings.speakingRate}x • Nada: {currentAudio.settings.pitch}st
          </p>
        </div>

        {/* Action button: Instant MP3 Download */}
        <button
          id="btn-download-mp3"
          type="button"
          onClick={handleDownloadMp3}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-900/30 hover:shadow-emerald-900/50 transition-all active:scale-95 cursor-pointer"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-4 h-4 text-white stroke-[3]" />
              <span>Berhasil Diunduh!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-white" />
              <span>Unduh File MP3</span>
              <span className="text-[10px] bg-emerald-700 px-1.5 py-0.5 rounded">
                ~{approximateFileSizeKb} KB
              </span>
            </>
          )}
        </button>
      </div>

      {/* Animated Sound Equalizer Waves */}
      <div className="flex items-center justify-center gap-1.5 h-12 mb-4 bg-slate-950/40 rounded-xl px-4">
        {Array.from({ length: 28 }).map((_, i) => {
          const heightPercent = isPlaying
            ? Math.max(15, (Math.sin((i + currentTime * 8) * 0.6) * 0.5 + 0.5) * 90)
            : 15;
          return (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-100 ${
                isPlaying ? 'bg-blue-400' : 'bg-slate-600'
              }`}
              style={{ height: `${heightPercent}%` }}
            />
          );
        })}
      </div>

      {/* Seek Scrubber Bar */}
      <div className="space-y-1 mb-5">
        <input
          id="input-audio-scrubber"
          type="range"
          min="0"
          max={duration || 1}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          aria-label="Navigasi waktu pemutaran audio"
          className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:h-2 transition-all"
        />
        <div className="flex justify-between text-xs font-mono text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback Controls & Utility */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Core Media Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => handleSkip(-5)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors"
            title="Mundur 5 detik"
          >
            <Rewind className="w-4 h-4" />
          </button>

          <button
            id="btn-toggle-play"
            type="button"
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 transition-transform active:scale-95 cursor-pointer"
            title={isPlaying ? 'Jeda' : 'Putar'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSkip(5)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors"
            title="Maju 5 detik"
          >
            <FastForward className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
                setIsPlaying(true);
              }
            }}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors"
            title="Ulangi dari awal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed & Volume Controls */}
        <div className="flex items-center gap-2">
          {/* Playback rate cycle button */}
          <button
            type="button"
            onClick={cyclePlaybackRate}
            className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
            title="Ubah kecepatan pemutaran"
          >
            {playbackRate}x
          </button>

          {/* Mute toggle button */}
          <button
            type="button"
            onClick={toggleMute}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title={isMuted ? 'Bunyikan' : 'Senyapkan'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
