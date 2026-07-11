import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Aside from "../templates/Aside";

export default function LessonDetail() {
    const { level, lessonId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [vocabularies, setVocabularies] = useState([]);
    const [kanjis, setKanjis] = useState([]);
    const [activeTab, setActiveTab] = useState("vocab");
    const [searchVocab, setSearchVocab] = useState("");

    // --- TIẾN ĐỘ & USER STATES ---
    const [userKey, setUserKey] = useState(null);
    const [isLessonCompleted, setIsLessonCompleted] = useState(false);

    // --- LUYỆN TẬP QUIZ STATES ---
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
    const [selectedOptionIdx, setSelectedOptionIdx] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [quizScore, setQuizScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);

    useEffect(() => {
        // Lấy thông tin user đăng nhập
        const storedAccount = localStorage.getItem("account");
        if (storedAccount) {
            const account = JSON.parse(storedAccount);
            const key = account.email || account.uId;
            setUserKey(key);

            // Kiểm tra xem bài học này đã hoàn thành chưa
            const storedProgress = localStorage.getItem(`completed_lessons_${key}`);
            if (storedProgress) {
                const completedList = JSON.parse(storedProgress);
                setIsLessonCompleted(completedList.includes(lessonId));
            }
        }

        // Lấy thông tin bài học
        axios.get(`http://localhost:9998/lessons/${lessonId}`)
            .then(res => setLesson(res.data))
            .catch(err => console.error("Lỗi lấy thông tin bài học:", err));

        // Lấy danh sách từ vựng của bài học này từ file tĩnh
        axios.get(`/data/vocab/${level.toLowerCase()}.json`)
            .then(res => {
                const filtered = res.data.filter(v => v.lessonId === lessonId);
                setVocabularies(filtered);
            })
            .catch(err => console.error("Lỗi lấy danh sách từ vựng:", err));

        // Lấy danh sách hán tự của trình độ này từ file tĩnh
        axios.get(`/data/kanji/${level.toLowerCase()}.json`)
            .then(res => setKanjis(res.data))
            .catch(err => console.error("Lỗi lấy danh sách Hán tự:", err));
    }, [level, lessonId]);

    // Lọc từ vựng theo ô tìm kiếm
    const filteredVocab = vocabularies.filter(v => {
        const search = searchVocab.toLowerCase();
        const meaningStr = Array.isArray(v.meanings) ? v.meanings.join(', ') : (v.meaning || '');
        return v.word.toLowerCase().includes(search) ||
            (v.reading || v.kana || '').toLowerCase().includes(search) ||
            meaningStr.toLowerCase().includes(search);
    });

    // Mock danh sách ngữ pháp theo bài học
    const getGrammarData = () => {
        if (lessonId === "n5-1") {
            return [
                { pattern: "1. Danh từ 1 は Danh từ 2 です (N1 là N2)", explanation: "Trợ từ は biểu thị chủ ngữ trong câu. です đặt ở cuối câu khẳng định biểu thị sự lịch sự.", example: "わたしは学生です (Watashi wa gakusei desu - Tôi là học sinh.)" },
                { pattern: "2. Danh từ 1 は Danh từ 2 じゃありません (N1 không phải là N2)", explanation: "じゃありません là dạng phủ định của です trong văn nói giao tiếp hàng ngày.", example: "サントスさんは学生じゃありません (Santosu-san wa gakusei ja arimasen - Anh Santos không phải là học sinh.)" },
                { pattern: "3. Câu + か (Câu hỏi)", explanation: "Trợ từ か được đặt ở cuối câu để tạo thành câu hỏi nghi vấn.", example: "あなたは会社員ですか (Anata wa kaishain desu ka - Bạn là nhân viên công ty phải không?)" }
            ];
        }
        return [
            { pattern: "1. Cấu trúc câu bổ ngữ chủ thể", explanation: "Sử dụng các trợ từ biểu thị động từ hành động và hướng di chuyển trong đời sống thường nhật.", example: "日本語を勉強します (Nihongo o benkyou shimasu - Tôi học tiếng Nhật.)" },
            { pattern: "2. Cấu trúc câu trạng thái", explanation: "Diễn tả trạng thái tĩnh, sự tồn tại của đồ vật hoặc người tại một vị trí xác định.", example: "ここに本があります (Koko ni hon ga arimasu - Ở đây có cuốn sách.)" }
        ];
    };

    const handleSpeak = (text) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "ja-JP";
        window.speechSynthesis.speak(utterance);
    };

    // Helper hiển thị nghĩa
    const getMeaningDisplay = (v) => {
        if (Array.isArray(v.meanings) && v.meanings.length > 0) {
            return v.meanings[0]; // Lấy nghĩa chính đầu tiên để làm quiz trắc nghiệm ngắn gọn
        }
        return v.meaning || '';
    };

    // Helper hiển thị nghĩa đầy đủ trong bảng từ vựng
    const getFullMeaningDisplay = (v) => {
        if (Array.isArray(v.meanings) && v.meanings.length > 0) {
            return v.meanings.join(', ');
        }
        return v.meaning || '';
    };

    // Helper hiển thị reading
    const getReadingDisplay = (v) => {
        return v.reading || v.kana || '';
    };

    // Helper hiển thị examples
    const getExampleDisplay = (v) => {
        if (v.examples && Array.isArray(v.examples) && v.examples.length > 0) {
            return v.examples.map((ex, i) => (
                <div key={i} className="mb-1">
                    <span className="text-dark">{ex.ja}</span>
                    <br />
                    <small className="text-muted">{ex.en}</small>
                </div>
            ));
        }
        return v.example || '—';
    };

    // --- KHỞI TẠO QUIZ NGẪU NHIÊN 15 CÂU ---
    const startQuiz = () => {
        if (vocabularies.length === 0) {
            alert("Không có từ vựng nào trong bài này để tạo bài tập!");
            return;
        }

        // Trộn ngẫu nhiên từ vựng để lấy tối đa 15 câu hỏi
        const shuffledVocab = [...vocabularies].sort(() => 0.5 - Math.random());
        const targetVocabs = shuffledVocab.slice(0, Math.min(15, shuffledVocab.length));

        const generatedQuestions = targetVocabs.map(target => {
            const correctAnswerText = getMeaningDisplay(target);

            // Tìm các nghĩa sai (nhiễu) từ các từ vựng khác cùng bài học
            const otherMeanings = vocabularies
                .filter(v => v.id !== target.id)
                .map(v => getMeaningDisplay(v))
                .filter((val, idx, self) => val && self.indexOf(val) === idx); // độc nhất

            // Trộn ngẫu nhiên các nghĩa nhiễu và lấy ra 3 nghĩa
            const distractors = otherMeanings.sort(() => 0.5 - Math.random()).slice(0, 3);

            // Bổ sung các câu nhiễu mặc định nếu bài học quá ít từ vựng
            while (distractors.length < 3) {
                distractors.push(`Lựa chọn sai dự phòng ${distractors.length + 1}`);
            }

            // Trộn đáp án đúng vào danh sách 4 lựa chọn
            const options = [...distractors, correctAnswerText].sort(() => 0.5 - Math.random());
            const correctIndex = options.indexOf(correctAnswerText);

            return {
                word: target.word,
                reading: getReadingDisplay(target),
                options: options,
                correctAnswerIndex: correctIndex,
                correctAnswer: correctAnswerText
            };
        });

        setQuizQuestions(generatedQuestions);
        setCurrentQuizIdx(0);
        setSelectedOptionIdx(null);
        setShowFeedback(false);
        setQuizScore(0);
        setQuizStarted(true);
        setQuizFinished(false);
    };

    // --- XỬ LÝ CHỌN ĐÁP ÁN ---
    const handleSelectOption = useCallback((idx) => {
        if (showFeedback || quizFinished) return;
        setSelectedOptionIdx(idx);
        setShowFeedback(true);

        const currentQuestion = quizQuestions[currentQuizIdx];
        const isCorrect = idx === currentQuestion.correctAnswerIndex;
        if (isCorrect) {
            setQuizScore(prev => prev + 1);
        }

        // Chờ 1.2 giây rồi chuyển tiếp
        setTimeout(() => {
            if (currentQuizIdx < quizQuestions.length - 1) {
                setCurrentQuizIdx(prev => prev + 1);
                setSelectedOptionIdx(null);
                setShowFeedback(false);
            } else {
                // Hoàn thành toàn bộ Quiz
                setQuizFinished(true);
                setQuizStarted(false);

                // Lưu tiến độ vào LocalStorage của học viên
                if (userKey) {
                    const storedKey = `completed_lessons_${userKey}`;
                    const completedList = JSON.parse(localStorage.getItem(storedKey) || "[]");
                    if (!completedList.includes(lessonId)) {
                        completedList.push(lessonId);
                        localStorage.setItem(storedKey, JSON.stringify(completedList));
                    }
                    setIsLessonCompleted(true);
                }
            }
        }, 1200);
    }, [showFeedback, quizFinished, quizQuestions, currentQuizIdx, userKey, lessonId]);

    // --- LẮNG NGHE PHÍM 1, 2, 3, 4 ---
    useEffect(() => {
        if (activeTab !== "practice" || !quizStarted || quizFinished || showFeedback) return;

        const handleKeyDown = (e) => {
            if (e.key === "1") handleSelectOption(0);
            else if (e.key === "2") handleSelectOption(1);
            else if (e.key === "3") handleSelectOption(2);
            else if (e.key === "4") handleSelectOption(3);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [activeTab, quizStarted, quizFinished, showFeedback, currentQuizIdx, quizQuestions, handleSelectOption]);

    if (!lesson) {
        return (
            <div className="col-12 text-center py-5">
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="col-md-9">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/home">Trang chủ</Link></li>
                        <li className="breadcrumb-item"><Link to={`/levels/${level}`}>Trình độ {level}</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{lesson.title}</li>
                    </ol>
                </nav>

                <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-4">
                    <h2 className="fw-bold mb-0 text-dark">
                        {lesson.title}
                        {isLessonCompleted && (
                            <span className="badge bg-success ms-3 fs-6 align-middle">
                                ✓ Completed
                            </span>
                        )}
                    </h2>
                </div>

                {/* Tabs */}
                <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                        <button
                            className={`nav-link fw-bold ${activeTab === "vocab" ? "active text-danger" : "text-muted"}`}
                            onClick={() => setActiveTab("vocab")}
                        >
                            Từ Vựng ({vocabularies.length})
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link fw-bold ${activeTab === "kanji" ? "active text-danger" : "text-muted"}`}
                            onClick={() => setActiveTab("kanji")}
                        >
                            Hán Tự Kanji ({kanjis.length})
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link fw-bold ${activeTab === "grammar" ? "active text-danger" : "text-muted"}`}
                            onClick={() => setActiveTab("grammar")}
                        >
                            Ngữ Pháp Cốt Lõi
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link fw-bold ${activeTab === "practice" ? "active text-danger" : "text-muted"}`}
                            onClick={() => {
                                setActiveTab("practice");
                                setQuizStarted(false);
                                setQuizFinished(false);
                            }}
                        >
                            Quiz
                        </button>
                    </li>
                </ul>

                {/* Tab Contents */}
                {activeTab === "vocab" && (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold text-secondary">Danh sách từ vựng bài học</h5>
                            <input
                                type="text"
                                placeholder="Tìm từ vựng..."
                                className="form-control form-control-sm"
                                style={{ width: "200px" }}
                                value={searchVocab}
                                onChange={e => setSearchVocab(e.target.value)}
                            />
                        </div>
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped table-hover align-middle">
                                <thead className="table-danger text-center">
                                    <tr>
                                        <th>Từ vựng</th>
                                        <th>Cách đọc</th>
                                        <th>Nghĩa (VN)</th>
                                        <th>Ví dụ minh họa</th>
                                        <th>Phát âm</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredVocab.map(v => (
                                        <tr key={v.id}>
                                            <td className="fw-bold text-center" style={{ fontSize: "18px" }}>{v.word}</td>
                                            <td className="text-danger text-center">{getReadingDisplay(v)}</td>
                                            <td className="fw-semibold">{getFullMeaningDisplay(v)}</td>
                                            <td style={{ fontSize: "14px" }}>{getExampleDisplay(v)}</td>
                                            <td className="text-center">
                                                <button
                                                    onClick={() => handleSpeak(v.word)}
                                                    className="btn btn-outline-danger btn-sm rounded-circle py-1 px-2"
                                                    title="Nghe phát âm"
                                                >
                                                    🔊
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredVocab.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center text-muted py-3">
                                                Không tìm thấy từ vựng nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "kanji" && (
                    <div>
                        <h5 className="fw-bold text-secondary mb-3">Hán tự Kanji cấp độ {level}</h5>
                        <div className="row">
                            {kanjis.map(k => (
                                <div className="col-md-6 mb-3" key={k.id}>
                                    <div className="card shadow-sm border border-danger">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-danger text-white rounded p-3 fw-bold display-6 shadow-sm" style={{ width: "70px", height: "70px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    {k.character}
                                                </div>
                                                <div>
                                                    <h5 className="card-title fw-bold text-danger mb-1">
                                                        {Array.isArray(k.meanings) ? k.meanings.join(', ') : k.meaning}
                                                    </h5>
                                                    <span className="badge bg-secondary mb-1">Số nét: {k.strokes}</span>
                                                    {k.grade && <span className="badge bg-info ms-1">Grade: {k.grade}</span>}
                                                </div>
                                            </div>
                                            <div className="mt-3 text-muted small">
                                                <div><strong>Onyomi (Âm Hán):</strong> <span className="text-dark">
                                                    {Array.isArray(k.onyomi) ? k.onyomi.join(', ') : k.onyomi}
                                                </span></div>
                                                <div><strong>Kunyomi (Âm Nhật):</strong> <span className="text-dark">
                                                    {Array.isArray(k.kunyomi) ? k.kunyomi.join(', ') : k.kunyomi}
                                                </span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {kanjis.length === 0 && (
                                <div className="col-12 text-center py-4 text-muted border rounded bg-light">
                                    Dữ liệu Hán tự đang cập nhật.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "grammar" && (
                    <div>
                        <h5 className="fw-bold text-secondary mb-3">Các cấu trúc ngữ pháp mẫu</h5>
                        <div className="d-flex flex-column gap-3">
                            {getGrammarData().map((g, idx) => (
                                <div className="card shadow-sm border-start border-primary border-4" key={idx}>
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold text-primary">{g.pattern}</h5>
                                        <p className="card-text text-muted mb-2">{g.explanation}</p>
                                        <div className="p-2 bg-light border rounded font-monospace" style={{ fontSize: "15px" }}>
                                            <strong>Ví dụ: </strong> {g.example}
                                            <button
                                                onClick={() => handleSpeak(g.example.split(" (")[0])}
                                                className="btn btn-sm btn-link text-danger p-0 ms-2"
                                                style={{ textDecoration: "none" }}
                                            >
                                                🔊
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB LUYỆN TẬP QUIZ TRẮC NGHIỆM */}
                {activeTab === "practice" && (
                    <div className="py-3">
                        {/* 1. Màn hình bắt đầu */}
                        {!quizStarted && !quizFinished && (
                            <div className="text-center py-5 bg-light rounded shadow-sm border">
                                <h3 className="fw-bold text-danger mb-3">Bài tập trắc nghiệm</h3>
                                <p className="text-muted mb-4 px-3" style={{ maxWidth: "600px", margin: "0 auto" }}>
                                    Random 15 câu hỏi trắc nghiệm của từ vựng có trong bài {lesson.title}.
                                </p>
                                <button className="btn btn-danger fw-bold px-4 py-2" onClick={startQuiz}>
                                    Start
                                </button>
                            </div>
                        )}

                        {/* 2. Màn hình đang làm bài */}
                        {quizStarted && !quizFinished && quizQuestions.length > 0 && (
                            <div className="card shadow border-0 p-4" style={{ borderRadius: "16px" }}>
                                {/* Tiến độ câu hỏi */}
                                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                                    <span className="fw-bold text-muted">
                                        Câu hỏi: {currentQuizIdx + 1} / {quizQuestions.length}
                                    </span>
                                    <span className="badge bg-danger">
                                        Đang trả lời đúng: {quizScore}
                                    </span>
                                </div>

                                {/* Chữ tiếng Nhật câu hỏi */}
                                <div className="text-center my-4 py-3 bg-light rounded-3">
                                    <h1 className="display-2 fw-bold text-dark mb-2">
                                        {quizQuestions[currentQuizIdx].word}
                                    </h1>
                                    {quizQuestions[currentQuizIdx].reading && (
                                        <h4 className="text-muted">({quizQuestions[currentQuizIdx].reading})</h4>
                                    )}
                                </div>

                                {/* 4 lựa chọn hiển thị Grid 2x2 */}
                                <div className="row mt-3">
                                    {quizQuestions[currentQuizIdx].options.map((opt, idx) => {
                                        let btnClass = "bg-white text-dark border-secondary-subtle";
                                        if (showFeedback) {
                                            if (idx === quizQuestions[currentQuizIdx].correctAnswerIndex) {
                                                btnClass = "bg-success text-white border-success shadow";
                                            } else if (idx === selectedOptionIdx) {
                                                btnClass = "bg-danger text-white border-danger shadow";
                                            }
                                        } else if (idx === selectedOptionIdx) {
                                            btnClass = "bg-primary text-white border-primary shadow";
                                        }

                                        return (
                                            <div className="col-md-6 mb-3" key={idx}>
                                                <div
                                                    className={`card p-3 d-flex flex-row align-items-center rounded-3 cursor-pointer border ${btnClass}`}
                                                    onClick={() => handleSelectOption(idx)}
                                                    style={{
                                                        minHeight: "75px",
                                                        cursor: "pointer",
                                                        transition: "all 0.15s ease",
                                                        pointerEvents: showFeedback ? "none" : "auto"
                                                    }}
                                                >
                                                    {/* Vòng tròn số thứ tự */}
                                                    <div
                                                        className="rounded-circle d-flex align-items-center justify-content-center me-3 font-weight-bold shadow-sm"
                                                        style={{
                                                            width: "36px",
                                                            height: "36px",
                                                            backgroundColor: idx === selectedOptionIdx || (showFeedback && idx === quizQuestions[currentQuizIdx].correctAnswerIndex) ? "rgba(255,255,255,0.2)" : "#f1f3f5",
                                                            color: idx === selectedOptionIdx || (showFeedback && idx === quizQuestions[currentQuizIdx].correctAnswerIndex) ? "white" : "#495057",
                                                            fontSize: "15px",
                                                            flexShrink: 0
                                                        }}
                                                    >
                                                        {idx + 1}
                                                    </div>
                                                    <div className="fs-5 fw-semibold text-start">{opt}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Hướng dẫn sử dụng bàn phím nhanh */}
                                <div className="text-center text-muted small mt-4 pt-3 border-top">
                                    Trên máy tính, sử dụng phím <strong>1, 2, 3, 4</strong> để chọn nhanh
                                </div>
                            </div>
                        )}

                        {/* 3. Màn hình hoàn thành bài tập */}
                        {quizFinished && (
                            <div className="text-center py-5 bg-white rounded shadow-sm border">
                                <h2 className="fw-bold text-success mt-3 mb-2">Hoàn Thành Luyện Tập!</h2>
                                <h4 className="text-muted mb-4">
                                    Bạn đã trả lời đúng <strong>{quizScore} / {quizQuestions.length}</strong> câu hỏi.
                                </h4>

                                {isLessonCompleted ? (
                                    <div className="alert alert-success d-inline-block px-4 py-2 mb-4">
                                        ✓ Bạn đã hoàn thành bài học này!
                                    </div>
                                ) : (
                                    <p className="text-muted mb-4">Đăng nhập tài khoản để lưu trữ lại lịch sử hoạt động học tập.</p>
                                )}

                                <div className="d-flex justify-content-center gap-3">
                                    <button className="btn btn-outline-danger fw-bold" onClick={startQuiz}>
                                        Luyện tập lại
                                    </button>
                                    <Link to={`/levels/${level}`} className="btn btn-danger text-white fw-bold">
                                        Quay về bài học khác
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Aside />
        </>
    );
}
