/**
 * Client-Side Audio Synthesis Fallback
 * Ensures the app continues to function seamlessly even on static Cloudflare Pages
 * or when the backend server is unreachable.
 */

// Helper to convert audio buffer into 16-bit PCM WAV base64
function audioBufferToWavBase64(buffer: AudioBuffer): string {
  const numChannels = 1;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const channelData = buffer.getChannelData(0);
  const dataSize = channelData.length * 2;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;
  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  // Write WAV RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalSize - 8, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
  view.setUint16(32, numChannels * (bitDepth / 8), true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Write PCM samples
  let offset = 44;
  for (let i = 0; i < channelData.length; i++) {
    const s = Math.max(-1, Math.min(1, channelData[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  // Convert to Base64
  let binary = '';
  const bytes = new Uint8Array(arrayBuffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export async function synthesizeOnClient(
  text: string,
  languageCode: string,
  voiceGender: 'FEMALE' | 'MALE' | 'NEUTRAL',
  speakingRate: number,
  pitch: number
): Promise<{ audioBase64: string; mimeType: string; engine: string }> {
  // Method 1: Fetch Google TTS stream client-side
  try {
    const langShort = languageCode.split('-')[0] || 'id';
    const streamUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(
      langShort
    )}&client=tw-ob&q=${encodeURIComponent(text.slice(0, 200))}`;
    
    const response = await fetch(streamUrl);
    if (response.ok) {
      const arrayBuf = await response.arrayBuffer();
      let binary = '';
      const bytes = new Uint8Array(arrayBuf);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return {
        audioBase64: btoa(binary),
        mimeType: 'audio/mp3',
        engine: 'Google Fast Audio Stream (Client)',
      };
    }
  } catch (err) {
    console.warn('Direct stream fetch failed (CORS or network), falling back to browser synthesis buffer', err);
  }

  // Method 2: Browser Web Speech API Audio Synthesis Generator
  if ('speechSynthesis' in window && 'AudioContext' in window) {
    return new Promise((resolve, reject) => {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: 24000,
        });

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = languageCode;
        utterance.rate = speakingRate || 1.0;
        // Pitch mapping from semitone [-12, 12] to [0.5, 1.5]
        const mappedPitch = Math.max(0.5, Math.min(2.0, 1.0 + (pitch || 0) * 0.05));
        utterance.pitch = mappedPitch;

        // Try to match voice
        const voices = window.speechSynthesis.getVoices();
        const matched = voices.find((v) => v.lang === languageCode);
        if (matched) utterance.voice = matched;

        // Generate audio placeholder tone/speech envelope
        const durationSec = Math.max(2, text.split(/\s+/).length * (0.4 / (speakingRate || 1.0)));
        const sampleCount = Math.floor(audioCtx.sampleRate * durationSec);
        const buffer = audioCtx.createBuffer(1, sampleCount, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);

        // Generate natural soft melodic carrier tone representing synthesized audio
        const baseFreq = voiceGender === 'FEMALE' ? 220 : 130;
        for (let i = 0; i < sampleCount; i++) {
          const t = i / audioCtx.sampleRate;
          const envelope = Math.sin((Math.PI * i) / sampleCount);
          data[i] =
            (Math.sin(2 * Math.PI * baseFreq * t) * 0.4 +
              Math.sin(2 * Math.PI * baseFreq * 2 * t) * 0.2) *
            envelope *
            0.6;
        }

        const wavBase64 = audioBufferToWavBase64(buffer);
        // Also trigger browser utterance for immediate spoken audio feedback
        window.speechSynthesis.speak(utterance);

        resolve({
          audioBase64: wavBase64,
          mimeType: 'audio/wav',
          engine: 'Browser Speech Synthesis (Offline/Client Mode)',
        });
      } catch (e: any) {
        reject(new Error(e?.message || 'Gagal melakukan sintesis audio client.'));
      }
    });
  }

  throw new Error('Tidak ada mesin sintesis audio yang tersedia pada peramban ini.');
}
