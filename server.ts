import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '5mb' }));

// Security & Anti-Tampering Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Lazy initialize Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// Helper to convert 16-bit PCM (e.g. 24kHz from Gemini TTS) to WAV buffer
function pcmToWavBuffer(pcmData: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmData.length;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;
  const buffer = Buffer.alloc(totalSize);

  // RIFF chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(totalSize - 8, 4);
  buffer.write('WAVE', 8);

  // fmt sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size for PCM
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  pcmData.copy(buffer, 44);
  return buffer;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    hasGoogleTtsKey: !!process.env.GOOGLE_TTS_API_KEY,
  });
});

// Text-to-Speech synthesis endpoint
app.post('/api/tts/synthesize', async (req, res) => {
  try {
    const {
      text,
      isSsml = false,
      languageCode = 'id-ID',
      voiceName = 'id-ID-Neural2-A',
      ssmlGender = 'FEMALE',
      speakingRate = 1.0,
      pitch = 0.0,
      volumeGainDb = 0.0,
      customApiKey,
    } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Teks tidak boleh kosong.' });
    }

    const cleanText = text.trim();
    const gcpApiKey = customApiKey || process.env.GOOGLE_TTS_API_KEY || process.env.GEMINI_API_KEY;

    let audioBase64: string | null = null;
    let mimeType = 'audio/mp3';
    let engineUsed = 'Google Cloud TTS';
    let usedFallback = false;

    // 1. First Attempt: Official Google Cloud Text-to-Speech API
    if (gcpApiKey) {
      try {
        const ttsUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${gcpApiKey}`;
        const ttsBody = {
          input: isSsml ? { ssml: cleanText } : { text: cleanText },
          voice: {
            languageCode,
            name: voiceName,
            ssmlGender,
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: Number(speakingRate) || 1.0,
            pitch: Number(pitch) || 0.0,
            volumeGainDb: Number(volumeGainDb) || 0.0,
          },
        };

        const ttsResponse = await fetch(ttsUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ttsBody),
        });

        if (ttsResponse.ok) {
          const ttsData = (await ttsResponse.json()) as { audioContent?: string };
          if (ttsData.audioContent) {
            audioBase64 = ttsData.audioContent;
            mimeType = 'audio/mp3';
            engineUsed = `Google Cloud TTS (${voiceName.includes('Neural2') ? 'Neural2 Natural' : voiceName.includes('Journey') ? 'Journey Natural' : 'WaveNet Natural'})`;
          }
        } else {
          const errText = await ttsResponse.text();
          console.warn('Google Cloud TTS REST error:', ttsResponse.status, errText);
        }
      } catch (cloudErr) {
        console.warn('Google Cloud TTS request failed:', cloudErr);
      }
    }

    // 2. Second Attempt: Gemini TTS (gemini-3.1-flash-tts-preview) if Cloud TTS unavailable or key lacks Cloud TTS scope
    if (!audioBase64) {
      const ai = getGeminiClient();
      if (ai) {
        try {
          // Map voice
          const geminiVoices = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'];
          let selectedGeminiVoice = 'Kore';
          if (ssmlGender === 'MALE') selectedGeminiVoice = 'Fenrir';
          if (geminiVoices.includes(voiceName)) selectedGeminiVoice = voiceName;

          const promptText = cleanText;
          const ttsResult = await ai.models.generateContent({
            model: 'gemini-3.1-flash-tts-preview',
            contents: [{ parts: [{ text: promptText }] }],
            config: {
              responseModalities: ['AUDIO' as any],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: selectedGeminiVoice },
                },
              },
            },
          });

          const inlineData = ttsResult.candidates?.[0]?.content?.parts?.[0]?.inlineData;
          if (inlineData?.data) {
            const rawBuffer = Buffer.from(inlineData.data, 'base64');
            // Check if it's already encoded or raw PCM
            const isWav = rawBuffer.subarray(0, 4).toString('ascii') === 'RIFF';
            if (isWav) {
              audioBase64 = inlineData.data;
              mimeType = 'audio/wav';
            } else {
              // Convert 24kHz raw PCM to WAV
              const wavBuf = pcmToWavBuffer(rawBuffer, 24000, 1, 16);
              audioBase64 = wavBuf.toString('base64');
              mimeType = 'audio/wav';
            }
            engineUsed = `Gemini Neural Speech (${selectedGeminiVoice})`;
            usedFallback = true;
          }
        } catch (geminiErr) {
          console.warn('Gemini TTS attempt failed:', geminiErr);
        }
      }
    }

    // 3. Third Attempt: Fast Google Neural Stream Proxy for guaranteed instant MP3 delivery
    if (!audioBase64) {
      try {
        const langShort = languageCode.split('-')[0] || 'id';
        // Split text into chunks if too long for standard query param
        const maxChunkLen = 190;
        const chunks: string[] = [];
        let remaining = cleanText;

        while (remaining.length > 0) {
          if (remaining.length <= maxChunkLen) {
            chunks.push(remaining);
            break;
          }
          let splitIdx = remaining.lastIndexOf(' ', maxChunkLen);
          if (splitIdx <= 0) splitIdx = maxChunkLen;
          chunks.push(remaining.substring(0, splitIdx).trim());
          remaining = remaining.substring(splitIdx).trim();
        }

        const audioBuffers: Buffer[] = [];
        for (const chunk of chunks) {
          if (!chunk) continue;
          const streamUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(
            langShort
          )}&client=tw-ob&q=${encodeURIComponent(chunk)}`;
          const gResponse = await fetch(streamUrl, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
          });
          if (gResponse.ok) {
            const arrayBuf = await gResponse.arrayBuffer();
            audioBuffers.push(Buffer.from(arrayBuf));
          }
        }

        if (audioBuffers.length > 0) {
          const mergedBuffer = Buffer.concat(audioBuffers);
          audioBase64 = mergedBuffer.toString('base64');
          mimeType = 'audio/mp3';
          engineUsed = 'Google Fast Audio Stream';
          usedFallback = true;
        }
      } catch (streamErr) {
        console.error('Google Fast Stream fallback failed:', streamErr);
      }
    }

    if (!audioBase64) {
      return res.status(500).json({
        error: 'Gagal menghasilkan audio. Pastikan teks valid atau periksa koneksi server.',
      });
    }

    return res.json({
      success: true,
      audioBase64,
      mimeType,
      engine: engineUsed,
      usedFallback,
      meta: {
        textLength: cleanText.length,
        languageCode,
        voiceName,
        speakingRate,
        pitch,
      },
    });
  } catch (error: any) {
    console.error('TTS Synthesis handler exception:', error);
    res.status(500).json({
      error: error?.message || 'Terjadi kesalahan sistem saat memproses konversi audio.',
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
