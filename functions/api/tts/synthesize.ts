export async function onRequestPost(context: any) {
  try {
    const body = await context.request.json();
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
    } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Teks tidak boleh kosong.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cleanText = text.trim();
    const envKey = context.env?.GOOGLE_TTS_API_KEY || context.env?.GEMINI_API_KEY;
    const gcpApiKey = customApiKey || envKey;

    let audioBase64: string | null = null;
    let mimeType = 'audio/mp3';
    let engineUsed = 'Google Cloud TTS (Cloudflare Edge)';

    // 1. Google Cloud Text-to-Speech API
    if (gcpApiKey) {
      try {
        const ttsUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${gcpApiKey}`;
        const ttsRes = await fetch(ttsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: isSsml ? { ssml: cleanText } : { text: cleanText },
            voice: { languageCode, name: voiceName, ssmlGender },
            audioConfig: {
              audioEncoding: 'MP3',
              speakingRate: Number(speakingRate) || 1.0,
              pitch: Number(pitch) || 0.0,
              volumeGainDb: Number(volumeGainDb) || 0.0,
            },
          }),
        });

        if (ttsRes.ok) {
          const data = (await ttsRes.json()) as any;
          if (data.audioContent) {
            audioBase64 = data.audioContent;
            mimeType = 'audio/mp3';
          }
        }
      } catch (e) {
        console.warn('Cloudflare TTS API error:', e);
      }
    }

    // 2. High-speed Google TTS stream fallback on Cloudflare edge
    if (!audioBase64) {
      const langShort = languageCode.split('-')[0] || 'id';
      const streamUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(
        langShort
      )}&client=tw-ob&q=${encodeURIComponent(cleanText.slice(0, 200))}`;
      const gRes = await fetch(streamUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (gRes.ok) {
        const arrayBuf = await gRes.arrayBuffer();
        let binary = '';
        const bytes = new Uint8Array(arrayBuf);
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        audioBase64 = btoa(binary);
        mimeType = 'audio/mp3';
        engineUsed = 'Google Fast Audio Stream (Cloudflare Edge)';
      }
    }

    if (!audioBase64) {
      return new Response(
        JSON.stringify({ error: 'Gagal menghasilkan audio di Cloudflare.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        audioBase64,
        mimeType,
        engine: engineUsed,
        meta: { textLength: cleanText.length, languageCode, voiceName },
      }),
      { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
