/**
 * Script đọc dữ liệu từ OpenJLPT-main và chia tách thành các file dữ liệu theo cấp độ (N1-N5)
 * Hỗ trợ lưu trữ Vocab, Kanji và Quizzes ra các tệp JSON tĩnh theo cấp độ để giảm tải database.json tối đa.
 *
 * Chạy: node split_database.cjs
 */
const fs = require('fs');
const path = require('path');

const OPENJLPT_DIR = 'D:\\OpenJLPT-main\\data\\json';
const PROJECT_DIR = __dirname;

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const VOCAB_PER_LESSON = 30; // 30 từ vựng mỗi bài học

// Đảm bảo các thư mục đích tồn tại
const pathsToCreate = [
  path.join(PROJECT_DIR, 'data', 'vocab'),
  path.join(PROJECT_DIR, 'data', 'kanji'),
  path.join(PROJECT_DIR, 'data', 'quizzes'),
  path.join(PROJECT_DIR, 'public', 'data', 'vocab'),
  path.join(PROJECT_DIR, 'public', 'data', 'kanji'),
  path.join(PROJECT_DIR, 'public', 'data', 'quizzes'),
];

for (const p of pathsToCreate) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
    console.log(`Created directory: ${p}`);
  }
}

// 1. Dữ liệu tĩnh User (giữ nguyên)
const users = [
  { id: "1", email: "admin@gmail.com", password: "123", fullname: "Admin Học Tiếng Nhật", role: "admin" },
  { id: "2", email: "student@gmail.com", password: "123", fullname: "Nguyễn Văn Học Viên", role: "customer" }
];

// 2. Bảng chữ cái Alphabet (Hiragana + Katakana)
const hiraganaRowsFixed = [
  { chars: 'あいうえお', romaji: ['a','i','u','e','o'] },
  { chars: 'かきくけこ', romaji: ['ka','ki','ku','ke','ko'] },
  { chars: 'さしすせそ', romaji: ['sa','shi','su','se','so'] },
  { chars: 'たちつてと', romaji: ['ta','chi','tsu','te','to'] },
  { chars: 'なにぬねの', romaji: ['na','ni','nu','ne','no'] },
  { chars: 'はひふへほ', romaji: ['ha','hi','fu','he','ho'] },
  { chars: 'まみむめも', romaji: ['ma','mi','mu','me','mo'] },
  { chars: 'やゆよ', romaji: ['ya','yu','yo'] },
  { chars: 'らりるれろ', romaji: ['ra','ri','ru','re','ro'] },
  { chars: 'わをん', romaji: ['wa','wo','n'] }
];

const katakanaRows = [
  { chars: 'アイウエオ', romaji: ['a','i','u','e','o'] },
  { chars: 'カキクケコ', romaji: ['ka','ki','ku','ke','ko'] },
  { chars: 'サシスセソ', romaji: ['sa','shi','su','se','so'] },
  { chars: 'タチツテト', romaji: ['ta','chi','tsu','te','to'] },
  { chars: 'ナニヌネノ', romaji: ['na','ni','nu','ne','no'] },
  { chars: 'ハヒフヘホ', romaji: ['ha','hi','fu','he','ho'] },
  { chars: 'マミムメモ', romaji: ['ma','mi','mu','me','mo'] },
  { chars: 'ヤユヨ', romaji: ['ya','yu','yo'] },
  { chars: 'ラリルレロ', romaji: ['ra','ri','ru','re','ro'] },
  { chars: 'ワヲン', romaji: ['wa','wo','n'] }
];

let alphabets = [];
let alphaId = 1;
for (const row of hiraganaRowsFixed) {
  for (let i = 0; i < row.chars.length; i++) {
    alphabets.push({ id: alphaId++, character: row.chars[i], romaji: row.romaji[i], type: "hiragana" });
  }
}
for (const row of katakanaRows) {
  for (let i = 0; i < row.chars.length; i++) {
    alphabets.push({ id: alphaId++, character: row.chars[i], romaji: row.romaji[i], type: "katakana" });
  }
}

// 3. Đọc dữ liệu từ OpenJLPT, xử lý và chia tách
function readJSON(filepath) {
  const raw = fs.readFileSync(filepath, 'utf8');
  return JSON.parse(raw);
}

let allLessons = [];
let vocabGlobalId = 1;
let kanjiGlobalId = 1;
let quizGlobalId = 1;

for (const level of LEVELS) {
  const levelLower = level.toLowerCase();
  
  // --- Xử lý VOCAB ---
  console.log(`Processing Vocabulary for ${level}...`);
  const vocabPath = path.join(OPENJLPT_DIR, 'vocab', `${levelLower}.json`);
  const rawVocab = readJSON(vocabPath);
  
  const totalLessons = Math.ceil(rawVocab.length / VOCAB_PER_LESSON);
  let levelVocabs = [];
  let levelQuizzes = [];
  
  for (let lessonIdx = 0; lessonIdx < totalLessons; lessonIdx++) {
    const lessonId = `${levelLower}-${lessonIdx + 1}`;
    const startIdx = lessonIdx * VOCAB_PER_LESSON;
    const endIdx = Math.min(startIdx + VOCAB_PER_LESSON, rawVocab.length);
    const lessonVocab = rawVocab.slice(startIdx, endIdx);
    
    const firstWord = lessonVocab[0]?.word || '';
    const lastWord = lessonVocab[lessonVocab.length - 1]?.word || '';
    
    // Thêm bài học vào danh sách bài học chung
    allLessons.push({
      id: lessonId,
      level: level,
      lessonNumber: lessonIdx + 1,
      title: `Bài ${lessonIdx + 1}: ${firstWord} ~ ${lastWord}`,
      vocabCount: lessonVocab.length
    });
    
    // Xử lý từng từ vựng và gán ID, lessonId
    for (const v of lessonVocab) {
      const vocabItem = {
        id: `v${vocabGlobalId++}`,
        level: level,
        lessonId: lessonId,
        word: v.word,
        reading: v.reading || '',
        meanings: v.meanings || []
      };
      if (v.examples && v.examples.length > 0) {
        vocabItem.examples = v.examples.slice(0, 2);
      }
      levelVocabs.push(vocabItem);
    }
    
    // Sinh quiz cho bài học này (3 câu)
    const quizCandidates = lessonVocab.filter(v => v.meanings && v.meanings.length > 0);
    const quizCount = Math.min(3, quizCandidates.length);
    
    for (let qi = 0; qi < quizCount; qi++) {
      const qVocab = quizCandidates[qi];
      const correctAnswer = qVocab.meanings[0];
      
      const wrongOptions = quizCandidates
        .filter(wv => wv.word !== qVocab.word && wv.meanings && wv.meanings.length > 0)
        .slice(0, 3)
        .map(wv => wv.meanings[0]);
      
      while (wrongOptions.length < 3) {
        wrongOptions.push('N/A');
      }
      
      const options = [correctAnswer, ...wrongOptions];
      // Shuffle options
      for (let si = options.length - 1; si > 0; si--) {
        const sj = (si * 7 + qi * 3) % (si + 1);
        [options[si], options[sj]] = [options[sj], options[si]];
      }
      
      levelQuizzes.push({
        id: `q${quizGlobalId++}`,
        level: level,
        lessonId: lessonId,
        question: `Nghĩa của từ 「${qVocab.word}」 là gì?`,
        options: options,
        answer: correctAnswer
      });
    }
  }
  
  // Ghi file từ vựng của cấp độ này ra data/ và public/data/
  const vocabJSON = JSON.stringify(levelVocabs, null, 2);
  fs.writeFileSync(path.join(PROJECT_DIR, 'data', 'vocab', `${levelLower}.json`), vocabJSON, 'utf8');
  fs.writeFileSync(path.join(PROJECT_DIR, 'public', 'data', 'vocab', `${levelLower}.json`), vocabJSON, 'utf8');
  console.log(`Saved vocab for ${level} (${levelVocabs.length} items)`);

  // Ghi file quizzes của cấp độ này ra data/ và public/data/
  const quizzesJSON = JSON.stringify(levelQuizzes, null, 2);
  fs.writeFileSync(path.join(PROJECT_DIR, 'data', 'quizzes', `${levelLower}.json`), quizzesJSON, 'utf8');
  fs.writeFileSync(path.join(PROJECT_DIR, 'public', 'data', 'quizzes', `${levelLower}.json`), quizzesJSON, 'utf8');
  console.log(`Saved quizzes for ${level} (${levelQuizzes.length} items)`);

  // --- Xử lý KANJI ---
  console.log(`Processing Kanji for ${level}...`);
  const kanjiPath = path.join(OPENJLPT_DIR, 'kanji', `${levelLower}.json`);
  const rawKanji = readJSON(kanjiPath);
  let levelKanjis = [];
  
  for (const k of rawKanji) {
    levelKanjis.push({
      id: `k${kanjiGlobalId++}`,
      level: level,
      character: k.character,
      strokes: k.strokes || 0,
      grade: k.grade || null,
      freq: k.freq || null,
      onyomi: k.onyomi || [],
      kunyomi: k.kunyomi || [],
      meanings: k.meanings || []
    });
  }
  
  // Ghi file kanji của cấp độ này ra data/ và public/data/
  const kanjiJSON = JSON.stringify(levelKanjis, null, 2);
  fs.writeFileSync(path.join(PROJECT_DIR, 'data', 'kanji', `${levelLower}.json`), kanjiJSON, 'utf8');
  fs.writeFileSync(path.join(PROJECT_DIR, 'public', 'data', 'kanji', `${levelLower}.json`), kanjiJSON, 'utf8');
  console.log(`Saved kanji for ${level} (${levelKanjis.length} items)`);
}

// 4. Tạo database.json siêu gọn nhẹ
const database = {
  user: users,
  alphabets: alphabets,
  lessons: allLessons
};

fs.writeFileSync(path.join(PROJECT_DIR, 'database.json'), JSON.stringify(database, null, 2), 'utf8');
console.log('\n=== Splitting & Building Complete ===');
console.log(`Lightweight database.json written successfully! Size is around: ${Math.round(fs.statSync(path.join(PROJECT_DIR, 'database.json')).size / 1024)} KB`);
