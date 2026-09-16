export type VoiceTier = 'Neural2' | 'Journey' | 'Studio' | 'WaveNet' | 'Standard' | 'Gemini';

export type VoiceGender = 'FEMALE' | 'MALE' | 'NEUTRAL';

export interface VoiceOption {
  id: string; // e.g. 'id-ID-Neural2-A'
  name: string; // Display label
  languageCode: string; // 'id-ID', 'en-US', etc.
  languageName: string; // 'Indonesia', 'English (US)'
  gender: VoiceGender;
  tier: VoiceTier;
  description: string;
  sampleText: string;
  isPopular?: boolean;
}

export interface LanguageGroup {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

export interface AudioSettings {
  speakingRate: number; // 0.25 to 4.0 (standard default 1.0)
  pitch: number; // -20.0 to 20.0 (semitones, default 0.0)
  volumeGainDb: number; // -10.0 to 10.0 (default 0.0)
  audioEncoding: 'MP3' | 'WAV';
}

export interface ConversionHistoryItem {
  id: string;
  text: string;
  languageCode: string;
  languageName: string;
  voiceId: string;
  voiceName: string;
  voiceTier: VoiceTier;
  gender: VoiceGender;
  settings: AudioSettings;
  createdAt: number; // timestamp
  audioBase64: string;
  mimeType: string;
  durationSeconds?: number;
  fileSizeBytes?: number;
  engineUsed: string;
}

export interface PresetStyle {
  id: string;
  name: string;
  description: string;
  speakingRate: number;
  pitch: number;
  volumeGainDb: number;
  iconName: string;
}
