// Curated Word Banks, Multi-Language Code Snippets & Adaptive Drill Generator

// 1. Kamus Kata Bahasa Indonesia (Kaya, Alami, & Beragam)
export const INDONESIAN_WORDS = [
  "yang", "untuk", "pada", "ke", "para", "namun", "menurut", "antara", "dia", "dua",
  "ia", "seperti", "jika", "sehingga", "kembali", "dan", "tidak", "ini", "dengan", "akan",
  "dari", "ada", "dalam", "bisa", "mereka", "kita", "sudah", "saya", "tahu", "oleh",
  "hari", "lebih", "dapat", "orang", "saat", "juga", "hanya", "tentang", "tahun", "banyak",
  "harus", "bukan", "selalu", "waktu", "dunia", "kerja", "fokus", "belajar", "menulis", "kecepatan",
  "tangan", "pikiran", "hidup", "cara", "sangat", "karena", "menjadi", "tempat", "setiap", "semua",
  "buku", "kata", "baca", "buat", "paling", "tanpa", "masih", "belum", "jalan", "ruang",
  "baik", "baru", "lama", "besar", "kecil", "bawah", "atas", "luar", "depan", "tengah",
  "proses", "tujuan", "hasil", "makna", "karya", "cerita", "kawan", "teman", "langkah", "ritme",
  "latihan", "jemari", "ketukan", "tenang", "mudah", "nyata", "penting", "pasti", "ingat", "rasa",
  "cahaya", "udara", "harapan", "mimpi", "tumbuh", "kembang", "berani", "kuat", "semangat", "jiwa",
  "hati", "melihat", "mendengar", "berpikir", "bergerak", "bersama", "mandiri", "bangun", "tidur", "pagi",
  "siang", "malam", "terang", "gelap", "sunyi", "damai", "indah", "senang", "bahagia", "senyum",
  "karya", "seni", "musik", "suara", "irama", "nada", "senar", "papan", "tombol", "layar",
  "kaca", "mata", "wajah", "senja", "fajar", "bumi", "alam", "semesta", "pohon", "daun",
  "bunga", "angin", "hujan", "ombak", "laut", "gunung", "langit", "bintang", "bulan", "matahari",
  "panas", "dingin", "sejuk", "segar", "lembut", "keras", "cepat", "lambat", "tepat", "akurat",
  "bersih", "rapi", "sederhana", "sulit", "tantangan", "peluang", "sukses", "gagal", "bangkit", "berjuang",
  "mencoba", "meraih", "menggapai", "menatap", "menanti", "berharap", "percaya", "yakin", "tulus", "setia",
  "jujur", "adil", "bijak", "cerdas", "hebat", "unggul", "kreatif", "kritis", "solusi", "gagasan",
  "ide", "pesan", "maklumat", "ilmu", "pengetahuan", "teknologi", "komputer", "jaringan", "kode", "program",
  "aplikasi", "sistem", "data", "angka", "huruf", "kalimat", "paragraf", "catatan", "lembar", "kertas",
  "pena", "tinta", "meja", "kursi", "ruang", "waktu", "detik", "menit", "jam", "minggu",
  "bulan", "abad", "zaman", "masa", "kini", "nanti", "lalu", "besok", "lusa", "kemarin",
  "sekarang", "selamanya", "abadi", "harmoni", "keseimbangan", "daya", "energi", "getaran", "aliran", "gelombang"
];

// 2. Common English Words (Curated & Balanced Frequency)
export const ENGLISH_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "system", "flow", "focus", "speed", "rhythm", "keystroke", "minimal", "modern", "effort", "habit",
  "great", "change", "practice", "mind", "life", "world", "place", "part", "number", "point",
  "form", "home", "water", "room", "area", "money", "story", "fact", "month", "lot",
  "right", "study", "book", "eye", "job", "word", "business", "issue", "side", "kind",
  "head", "house", "service", "friend", "power", "hour", "game", "line", "end", "member",
  "city", "community", "name", "team", "minute", "idea", "body", "information", "face", "level",
  "office", "door", "health", "person", "art", "result", "morning", "reason", "research", "moment",
  "air", "teacher", "force", "sound", "light", "voice", "music", "road", "heart", "simple",
  "clean", "swift", "smooth", "steady", "rapid", "quiet", "bright", "clear", "calm", "sharp",
  "deep", "free", "pure", "true", "warm", "brave", "fresh", "still", "vital", "bold"
];

// 3. Koleksi Kutipan Kaya Bahasa Indonesia (Quotes Mode)
export const INDONESIAN_QUOTES = [
  {
    id: "id-q1",
    author: "B.J. Habibie",
    text: "Keberhasilan bukanlah milik orang yang pintar, keberhasilan adalah kepunyaan mereka yang senantiasa berusaha dan tidak pernah menyerah.",
    length: "medium"
  },
  {
    id: "id-q2",
    author: "Pramoedya Ananta Toer",
    text: "Orang boleh pandai setinggi langit, tapi selama ia tidak menulis, ia akan hilang di dalam masyarakat dan dari sejarah.",
    length: "medium"
  },
  {
    id: "id-q3",
    author: "Soekarno",
    text: "Beri aku seribu orang tua niscaya akan kucabut Semeru dari akarnya. Beri aku sepuluh pemuda niscaya akan kuguncangkan dunia.",
    length: "medium"
  },
  {
    id: "id-q4",
    author: "Ki Hajar Dewantara",
    text: "Ing ngarsa sung tuladha, ing madya mangun karsa, tut wuri handayani.",
    length: "short"
  },
  {
    id: "id-q5",
    author: "Tan Malaka",
    text: "Ingatlah bahwa dari dalam kubur suara saya akan lebih keras daripada dari atas bumi.",
    length: "short"
  },
  {
    id: "id-q6",
    author: "Abdurrahman Wahid (Gus Dur)",
    text: "Menyesali nasib tidak akan mengubah keadaan. Terus berkarya dan bekerjalah yang membuat kita berharga di hadapan sesama.",
    length: "medium"
  },
  {
    id: "id-q7",
    author: "R.A. Kartini",
    text: "Tahukah engkau semboyanku? Aku mau! Dua patah kata yang ringkas itu sudah beberapa kali mendukung dan membawa aku melintasi gunung kesulitan.",
    length: "medium"
  },
  {
    id: "id-q8",
    author: "Chairil Anwar",
    text: "Aku ini binatang jalang dari kumpulannya terbuang. Biar peluru menembus kulitku aku tetap meradang menerjang.",
    length: "short"
  },
  {
    id: "id-q9",
    author: "Mohammad Hatta",
    text: "Kurang cerdas dapat diperbaiki dengan belajar, kurang cakap dapat dihilangkan dengan pengalaman, namun tidak jujur itu sulit diperbaiki.",
    length: "medium"
  },
  {
    id: "id-q10",
    author: "Sapardi Djoko Damono",
    text: "Aku ingin mencintaimu dengan sederhana, dengan kata yang tak sempat diucapkan kayu kepada api yang menjadikannya abu.",
    length: "medium"
  },
  {
    id: "id-q11",
    author: "Buya Hamka",
    text: "Jangan takut jatuh, karena yang tidak pernah memanjatlah yang tidak pernah jatuh.",
    length: "short"
  },
  {
    id: "id-q12",
    author: "Munir Said Thalib",
    text: "Kita harus bersikap tenang walau sedang gelisah, bingung dalam hening, dan tetap melangkah dengan teguh di tengah rintangan.",
    length: "medium"
  },
  {
    id: "id-q13",
    author: "Filosofi Mengetik",
    text: "Kecepatan sejati lahir dari ketenangan pikiran dan keteraturan ritme, bukan ketergesa-gesaan jemari di atas papan ketik.",
    length: "short"
  },
  {
    id: "id-q14",
    author: "Keebflow Philosophy",
    text: "Setiap ketukan kecil yang konsisten hari ini adalah fondasi dari keahlian luar biasa esok hari. Nikmati proses dan rasakan setiap aliran bunyi switch.",
    length: "medium"
  },
  {
    id: "id-q15",
    author: "Fokus & Ritme",
    text: "Fokus bukanlah tentang melakukan segalanya, melainkan ketenangan untuk menuntaskan satu hal dengan ketepatan sempurna.",
    length: "short"
  },
  {
    id: "id-q16",
    author: "Wiji Thukul",
    text: "Apabila usul ditolak tanpa ditimbang, suara dibungkam, kritik dilarang tanpa alasan, dituduh subversif dan mengganggu keamanan, maka hanya ada satu kata: lawan!",
    length: "long"
  },
  {
    id: "id-q17",
    author: "Mochtar Lubis",
    text: "Ketelitian dalam berpikir melahirkan kejujuran dalam bersikap dan keteguhan dalam memegang prinsip hidup.",
    length: "short"
  },
  {
    id: "id-q18",
    author: "Sutan Sjahrir",
    text: "Hidup yang tidak dipertaruhkan tidak akan pernah dimenangkan.",
    length: "short"
  },
  {
    id: "id-q19",
    author: "Pramoedya Ananta Toer",
    text: "Berterimakasihlah pada segala yang memberi kehidupan, bahkan pada rasa sakit yang mengajari kita arti ketahanan dan ketenangan batin.",
    length: "medium"
  },
  {
    id: "id-q20",
    author: "Filosofi Kode",
    text: "Dalam kesunyian setiap baris kode dan kata yang tertulis dengan rapi, tersimpan kekuatan besar untuk mengubah dunia nyata.",
    length: "short"
  }
];

// 4. English Curated Quotes (Quotes Mode)
export const ENGLISH_QUOTES = [
  {
    id: "en-q1",
    author: "Steve Jobs",
    text: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
    length: "medium"
  },
  {
    id: "en-q2",
    author: "Linus Torvalds",
    text: "Talk is cheap. Show me the code.",
    length: "short"
  },
  {
    id: "en-q3",
    author: "Alan Turing",
    text: "Sometimes it is the people no one can imagine anything of who do the things that no one can imagine.",
    length: "medium"
  },
  {
    id: "en-q4",
    author: "Marcus Aurelius",
    text: "You have power over your mind, not outside events. Realize this, and you will find strength and peace.",
    length: "short"
  },
  {
    id: "en-q5",
    author: "Carl Sagan",
    text: "Somewhere, something incredible is waiting to be known in the quiet expanse of the cosmos.",
    length: "short"
  },
  {
    id: "en-q6",
    author: "Edsger W. Dijkstra",
    text: "Simplicity is prerequisite for reliability. Write code that feels like poetry and moves with purpose.",
    length: "short"
  },
  {
    id: "en-q7",
    author: "Antoine de Saint-Exupery",
    text: "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.",
    length: "medium"
  },
  {
    id: "en-q8",
    author: "James Clear",
    text: "You do not rise to the level of your goals. You fall to the level of your systems.",
    length: "short"
  },
  {
    id: "en-q9",
    author: "Grace Hopper",
    text: "The most dangerous phrase in the language is, we have always done it this way.",
    length: "short"
  },
  {
    id: "en-q10",
    author: "Albert Einstein",
    text: "Strive not to be a success, but rather to be of value to those around you and to the craft you pursue.",
    length: "medium"
  },
  {
    id: "en-q11",
    author: "Seneca",
    text: "Luck is what happens when preparation meets opportunity. Every deliberate keystroke builds your foundation.",
    length: "short"
  },
  {
    id: "en-q12",
    author: "Ada Lovelace",
    text: "The Analytical Engine weaves algebraical patterns just as the Jacquard loom weaves flowers and leaves.",
    length: "short"
  },
  {
    id: "en-q13",
    author: "Kent Beck",
    text: "First make it work, then make it right, then make it fast. Flow follows precision.",
    length: "short"
  },
  {
    id: "en-q14",
    author: "Lao Tzu",
    text: "The journey of a thousand miles begins with a single step. Do your work, then step back.",
    length: "short"
  },
  {
    id: "en-q15",
    author: "Martin Fowler",
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    length: "medium"
  },
  {
    id: "en-q16",
    author: "Epictetus",
    text: "Wealth consists not in having great possessions, but in having few wants. Freedom is the only worthy goal in life.",
    length: "medium"
  },
  {
    id: "en-q17",
    author: "Robert C. Martin",
    text: "Truth can only be found in one place: the code. Clean code always looks like it was written by someone who cares.",
    length: "medium"
  },
  {
    id: "en-q18",
    author: "Alan Kay",
    text: "The best way to predict the future is to invent it with your own hands and unwavering determination.",
    length: "short"
  },
  {
    id: "en-q19",
    author: "Keebflow Practice",
    text: "Consistency is the playground of mastery. Small deliberate keystrokes compound into extraordinary speed and fluid muscle memory.",
    length: "medium"
  },
  {
    id: "en-q20",
    author: "Brian Kernighan",
    text: "Controlling complexity is the essence of computer programming. Make the solution as simple as possible, but no simpler.",
    length: "medium"
  }
];

/**
 * Mengambil kutipan secara acak berdasarkan bahasa dan filter panjang kutipan
 */
export function getRandomQuote(language = 'id', lengthFilter = 'all') {
  const pool = language === 'id' ? INDONESIAN_QUOTES : ENGLISH_QUOTES;
  const filtered =
    lengthFilter === 'all'
      ? pool
      : pool.filter((q) => q.length === lengthFilter);

  const selected =
    filtered.length > 0
      ? filtered[Math.floor(Math.random() * filtered.length)]
      : pool[Math.floor(Math.random() * pool.length)];

  const text = typeof selected === 'string' ? selected : selected.text;
  const author = typeof selected === 'object' ? selected.author : 'Anonim';
  const id = typeof selected === 'object' ? selected.id : 'quote';

  return {
    id,
    author,
    text,
    words: text.split(' ').filter(Boolean),
    length: typeof selected === 'object' ? selected.length : 'medium'
  };
}

// Rich Multi-Language Code Snippets for IDE Mode
export const CODE_SNIPPETS = {
  javascript: [
    {
      id: "js-async",
      title: "fetchUser.js",
      breadcrumb: "src > services > fetchUser.js",
      language: "javascript",
      code: [
        "const fetchUser = async (userId) => {",
        "  try {",
        "    const res = await fetch(`/api/users/${userId}`);",
        "    if (!res.ok) throw new Error('Failed to load');",
        "    const data = await res.json();",
        "    return data.user;",
        "  } catch (err) {",
        "    console.error(err.message);",
        "  }",
        "};"
      ]
    },
    {
      id: "js-hook",
      title: "useDebounce.js",
      breadcrumb: "src > hooks > useDebounce.js",
      language: "javascript",
      code: [
        "export function useDebounce(value, delay = 300) {",
        "  const [debounced, setDebounced] = useState(value);",
        "  useEffect(() => {",
        "    const handler = setTimeout(() => {",
        "      setDebounced(value);",
        "    }, delay);",
        "    return () => clearTimeout(handler);",
        "  }, [value, delay]);",
        "  return debounced;",
        "}"
      ]
    },
    {
      id: "js-calc",
      title: "calculateTotal.js",
      breadcrumb: "src > utils > calculateTotal.js",
      language: "javascript",
      code: [
        "export const calculateTotal = (cartItems, taxRate = 0.11) => {",
        "  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);",
        "  const taxAmount = subtotal * taxRate;",
        "  return { subtotal, total: subtotal + taxAmount };",
        "};"
      ]
    }
  ],
  python: [
    {
      id: "py-cleaner",
      title: "data_cleaner.py",
      breadcrumb: "pipelines > data_cleaner.py",
      language: "python",
      code: [
        "def clean_dataset(records: list[dict]) -> list[dict]:",
        "    cleaned = []",
        "    for item in records:",
        "        if item.get('status') == 'active' and item.get('score', 0) > 50:",
        "            clean_name = item['name'].strip().title()",
        "            cleaned.append({'id': item['id'], 'name': clean_name})",
        "    return cleaned"
      ]
    },
    {
      id: "py-search",
      title: "binary_search.py",
      breadcrumb: "algorithms > binary_search.py",
      language: "python",
      code: [
        "def binary_search(arr: list[int], target: int) -> int:",
        "    low, high = 0, len(arr) - 1",
        "    while low <= high:",
        "        mid = (low + high) // 2",
        "        if arr[mid] == target:",
        "            return mid",
        "        elif arr[mid] < target:",
        "            low = mid + 1",
        "        else:",
        "            high = mid - 1",
        "    return -1"
      ]
    },
    {
      id: "py-class",
      title: "auth_guard.py",
      breadcrumb: "security > auth_guard.py",
      language: "python",
      code: [
        "class AuthGuard:",
        "    def __init__(self, secret: str, ttl_hours: int = 24):",
        "        self.secret = secret",
        "        self.ttl = ttl_hours",
        "    def verify_token(self, token: str) -> bool:",
        "        return len(token) > 32 and token.startswith('sec_')"
      ]
    }
  ],
  mysql: [
    {
      id: "sql-sales",
      title: "sales_report.sql",
      breadcrumb: "database > queries > sales_report.sql",
      language: "mysql",
      code: [
        "SELECT u.id, u.username, COUNT(o.id) AS total_orders, SUM(o.total_amount) AS revenue",
        "FROM users u",
        "LEFT JOIN orders o ON u.id = o.user_id",
        "WHERE o.status = 'completed' AND o.created_at >= '2026-01-01'",
        "GROUP BY u.id, u.username",
        "HAVING revenue > 1000",
        "ORDER BY revenue DESC",
        "LIMIT 20;"
      ]
    },
    {
      id: "sql-table",
      title: "create_orders.sql",
      breadcrumb: "database > migrations > create_orders.sql",
      language: "mysql",
      code: [
        "CREATE TABLE orders (",
        "  id INT AUTO_INCREMENT PRIMARY KEY,",
        "  user_id INT NOT NULL,",
        "  order_code VARCHAR(32) UNIQUE NOT NULL,",
        "  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,",
        "  status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',",
        "  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        ");"
      ]
    },
    {
      id: "sql-cte",
      title: "monthly_growth.sql",
      breadcrumb: "database > analytics > monthly_growth.sql",
      language: "mysql",
      code: [
        "WITH monthly_sales AS (",
        "  SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(total_amount) AS revenue",
        "  FROM orders",
        "  WHERE status = 'completed'",
        "  GROUP BY month",
        ")",
        "SELECT month, revenue, LAG(revenue) OVER (ORDER BY month) AS prev_month",
        "FROM monthly_sales;"
      ]
    }
  ]
};

// Parses a code snippet into individual tokens/words with line numbers and indentation
export function parseCodeSnippet(snippet) {
  const wordsWithMeta = [];
  snippet.code.forEach((lineStr, lineIdx) => {
    const leadingSpaces = (lineStr.match(/^\s*/) || [''])[0].length;
    const trimmed = lineStr.trim();
    if (trimmed.length === 0) return;

    const tokens = trimmed.split(' ').filter(t => t.length > 0);
    tokens.forEach((token, tIdx) => {
      wordsWithMeta.push({
        text: token,
        lineNum: lineIdx + 1,
        isFirstInLine: tIdx === 0,
        isLastInLine: tIdx === tokens.length - 1,
        indentSpaces: tIdx === 0 ? leadingSpaces : 0,
        rawLine: lineStr
      });
    });
  });
  return wordsWithMeta;
}

// Adaptive drill generator targeting specific weak keys
export function generateWeaknessDrill(weakKeys = [], wordCount = 30, language = 'id') {
  const pool = language === 'id' ? INDONESIAN_WORDS : ENGLISH_WORDS;

  if (!weakKeys || weakKeys.length === 0) {
    return getRandomWords(wordCount, 'common', language);
  }

  const targets = weakKeys.map(k => k.toLowerCase());

  const scoredWords = pool.map(word => {
    let score = 0;
    const lower = word.toLowerCase();
    for (const key of targets) {
      if (lower.includes(key)) score += 1;
    }
    return { word, score };
  });

  const prioritized = scoredWords
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.word);

  if (prioritized.length < wordCount) {
    const filler = pool.slice().sort(() => 0.5 - Math.random());
    prioritized.push(...filler);
  }

  return prioritized.slice(0, wordCount).sort(() => 0.5 - Math.random());
}

/**
 * Memasukkan tanda baca dan huruf kapital ke dalam daftar kata (Monkeytype Punctuation Mode)
 */
export function applyPunctuation(wordsList = []) {
  if (!wordsList || wordsList.length === 0) return [];
  const punctuationMarks = [',', '.', '.', '!', '?', ';', '"'];
  let capitalizeNext = true;

  return wordsList.map((word, idx) => {
    let modified = word;

    // Kapitalisasi huruf pertama jika awal kalimat
    if (capitalizeNext && modified.length > 0) {
      modified = modified.charAt(0).toUpperCase() + modified.slice(1);
      capitalizeNext = false;
    }

    // Setiap ~4-7 kata, tambahkan tanda baca
    const isLast = idx === wordsList.length - 1;
    if (isLast) {
      modified = `${modified}.`;
    } else if (idx > 0 && idx % Math.floor(4 + (idx % 4)) === 0) {
      const mark = punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)];
      if (mark === '"') {
        modified = `"${modified}"`;
      } else {
        modified = `${modified}${mark}`;
        if (['.', '!', '?'].includes(mark)) {
          capitalizeNext = true;
        }
      }
    }

    return modified;
  });
}

/**
 * Menyisipkan angka secara acak ke dalam daftar kata (Monkeytype Numbers Mode)
 */
export function applyNumbers(wordsList = []) {
  if (!wordsList || wordsList.length === 0) return [];
  const numberGenerators = [
    () => Math.floor(Math.random() * 90 + 10).toString(), // 10-99
    () => Math.floor(Math.random() * 900 + 100).toString(), // 100-999
    () => (1980 + Math.floor(Math.random() * 50)).toString(), // Tahun (1980-2030)
    () => `${Math.floor(Math.random() * 9 + 1)}` // 1-9
  ];

  const result = [...wordsList];
  // Sisipkan angka di sekitar 12-15% dari total kata
  const countToInsert = Math.max(1, Math.floor(wordsList.length * 0.14));
  const step = Math.max(3, Math.floor(wordsList.length / countToInsert));

  for (let i = 2; i < result.length && i < wordsList.length; i += step) {
    const gen = numberGenerators[Math.floor(Math.random() * numberGenerators.length)];
    result[i] = gen();
  }

  return result;
}

/**
 * Mengurai teks masukan kustom menjadi daftar kata yang siap diketik
 */
export function parseCustomText(rawText = '', shuffle = false) {
  if (!rawText || !rawText.trim()) return [];
  const words = rawText
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (shuffle) {
    return [...words].sort(() => 0.5 - Math.random());
  }
  return words;
}

export function getRandomWords(count = 35, mode = 'common', language = 'id', options = {}) {
  const { punctuation = false, numbers = false } = options;
  const source = language === 'id' ? INDONESIAN_WORDS : ENGLISH_WORDS;
  const shuffled = [...source].sort(() => 0.5 - Math.random());
  let result = [];
  while (result.length < count) {
    result.push(...shuffled);
  }
  result = result.slice(0, count);

  if (numbers) {
    result = applyNumbers(result);
  }
  if (punctuation) {
    result = applyPunctuation(result);
  }

  return result;
}
