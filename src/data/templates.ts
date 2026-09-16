export interface TextTemplate {
  id: string;
  title: string;
  category: string;
  languageCode: string;
  text: string;
}

export const SAMPLE_TEMPLATES: TextTemplate[] = [
  {
    id: 'intro_id',
    title: 'Sambutan Selamat Datang',
    category: 'Umum',
    languageCode: 'id-ID',
    text: 'Selamat datang di aplikasi Google Cloud Text to Audio! Anda dapat mengubah teks apa saja menjadi rekaman audio natural berstandar studio. Coba sesuaikan kecepatan bicara serta nada suara agar intonasinya terdengar semakin hidup dan ekspresif.',
  },
  {
    id: 'news_id',
    title: 'Warta Berita Terkini',
    category: 'Berita',
    languageCode: 'id-ID',
    text: 'Jakarta — Perkembangan teknologi kecerdasan buatan dalam bidang pemrosesan bahasa alami kini memungkinkan sintesis suara manusia yang nyaris tak terbedakan dari suara aslinya. Model Neural2 dari Google Cloud menghadirkan intonasi yang begitu presisi dan dinamis.',
  },
  {
    id: 'story_id',
    title: 'Dongeng & Kisah Fabel',
    category: 'Cerita',
    languageCode: 'id-ID',
    text: 'Di sebuah lembah hijau yang dinaungi pepohonan rindang, mengalir sungai berair bening tempat para satwa berkumpul setiap pagi. Angin sejuk berhembus lembut membawakan aroma bunga liar, menyapa fajar dengan ketenangan yang menyejukkan hati.',
  },
  {
    id: 'promo_id',
    title: 'Promosi Produk & Iklan',
    category: 'Pemasaran',
    languageCode: 'id-ID',
    text: 'Kabar gembira untuk Anda! Dapatkan penawaran spesial potongan hingga 50 persen untuk setiap langganan paket audio premium hari ini. Klik tautan di bawah dan rasakan kemudahan membuat konten tanpa batas!',
  },
  {
    id: 'tech_en',
    title: 'Technology Narrative',
    category: 'English',
    languageCode: 'en-US',
    text: 'Next-generation speech synthesis bridges the gap between written communication and human emotion. With neural audio rendering, synthetic voices now exhibit natural breathing rhythm and conversational nuances.',
  },
  {
    id: 'japan_short',
    title: 'Salam Bahasa Jepang',
    category: 'Jepang',
    languageCode: 'ja-JP',
    text: 'みなさん、こんにちは。人工知能による最新の音声合成テクノロジーを体験してみましょう。クリアで聞き取りやすい高品質なMP3ファイルを瞬時に作成できます。',
  },
];
