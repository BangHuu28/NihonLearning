import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Aside from "../templates/Aside";

export default function Flashcard() {
    const [selectedLevel, setSelectedLevel] = useState(null); // 'N5', 'N4', ...
    const [lessons, setLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null); // lesson object
    const [vocabularies, setVocabularies] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const levels = [
        { key: "N5", title: "N5 - Sơ cấp 1", vocabCount: "662 từ vựng", lessonCount: "23 bài học", color: "primary" },
        { key: "N4", title: "N4 - Sơ cấp 2", vocabCount: "632 từ vựng", lessonCount: "22 bài học", color: "success" },
        { key: "N3", title: "N3 - Trung cấp", vocabCount: "1784 từ vựng", lessonCount: "60 bài học", color: "info" },
        { key: "N2", title: "N2 - Thượng cấp", vocabCount: "1793 từ vựng", lessonCount: "60 bài học", color: "warning" },
        { key: "N1", title: "N1 - Cao cấp", vocabCount: "3463 từ vựng", lessonCount: "116 bài học", color: "danger" }
    ];

    // Lấy danh sách bài học khi chọn level
    useEffect(() => {
        if (!selectedLevel) return;
        setIsLoading(true);
        axios.get(`http://localhost:9998/lessons?level=${selectedLevel}`)
            .then(res => {
                const sorted = res.data.sort((a, b) => a.lessonNumber - b.lessonNumber);
                setLessons(sorted);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Lỗi tải bài học:", err);
                setIsLoading(false);
            });
    }, [selectedLevel]);

    // Lấy danh sách từ vựng khi chọn bài học
    useEffect(() => {
        if (!selectedLesson) return;
        setIsLoading(true);
        axios.get(`/data/vocab/${selectedLevel.toLowerCase()}.json`)
            .then(res => {
                const filtered = res.data.filter(v => v.lessonId === selectedLesson.id);
                setVocabularies(filtered);
                setCurrentIdx(0);
                setIsFlipped(false);
                setIsLoading(false);
                // Phát âm từ đầu tiên
                if (filtered.length > 0) {
                    setTimeout(() => handleSpeak(filtered[0].word), 500);
                }
            })
            .catch(err => {
                console.error("Lỗi tải từ vựng:", err);
                setIsLoading(false);
            });
    }, [selectedLesson, selectedLevel]);

    const handleSpeak = (text) => {
        if (!text) return;
        window.speechSynthesis.cancel(); // Dừng phát âm cũ
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "ja-JP";
        utterance.rate = 0.85; // Phát âm hơi chậm chút để nghe rõ
        window.speechSynthesis.speak(utterance);
    };

    const handleNext = () => {
        if (currentIdx < vocabularies.length - 1) {
            const nextIdx = currentIdx + 1;
            setCurrentIdx(nextIdx);
            setIsFlipped(false);
            handleSpeak(vocabularies[nextIdx].word);
        }
    };

    const handlePrev = () => {
        if (currentIdx > 0) {
            const prevIdx = currentIdx - 1;
            setCurrentIdx(prevIdx);
            setIsFlipped(false);
            handleSpeak(vocabularies[prevIdx].word);
        }
    };

    // Chọn cách hiển thị nghĩa (array sang string)
    const getMeaningText = (v) => {
        if (Array.isArray(v.meanings)) {
            return v.meanings.join(", ");
        }
        return v.meaning || "";
    };

    // Hiển thị ví dụ
    const renderExamples = (v) => {
        if (v.examples && v.examples.length > 0) {
            return v.examples.map((ex, i) => (
                <div key={i} className="mt-2 text-start p-2 bg-light border rounded" style={{ fontSize: "14px" }}>
                    <div><strong>Ví dụ:</strong> {ex.ja}</div>
                    <div className="text-muted small">{ex.en}</div>
                </div>
            ));
        }
        return null;
    };

    return (
        <>
            <div className="col-md-9">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/home">Trang chủ</Link></li>
                        <li className="breadcrumb-item active">Học qua Flashcard</li>
                    </ol>
                </nav>

                {/* GIAO DIỆN 1: CHỌN CẤP ĐỘ N */}
                {!selectedLevel && (
                    <div className="text-center py-4">
                        <h2 className="fw-bold text-danger mb-2">Flashcard </h2>
                        <p className="text-muted mb-4">Chọn cấp độ JLPT để bắt đầu ôn luyện từ vựng qua thẻ nhớ sinh động</p>

                        <div className="row">
                            {levels.map((lvl) => (
                                <div className="col-md-6 mb-4" key={lvl.key}>
                                    <div
                                        className="card shadow-sm hover-shadow border border-2 h-100"
                                        onClick={() => setSelectedLevel(lvl.key)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <div className="card-body py-4 d-flex align-items-center justify-content-between">
                                            <div className="text-start">
                                                <h4 className={`fw-bold text-${lvl.color}`}>{lvl.title}</h4>
                                                <div className="text-muted small">{lvl.vocabCount} | {lvl.lessonCount}</div>
                                            </div>
                                            <span className={`badge bg-${lvl.color} fs-6`}>{lvl.key}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* GIAO DIỆN 2: CHỌN BÀI HỌC CỦA LEVEL */}
                {selectedLevel && !selectedLesson && (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                            <h3 className="fw-bold text-danger m-0">Level {selectedLevel}</h3>
                            <button className="btn btn-outline-secondary btn-sm fw-bold" onClick={() => setSelectedLevel(null)}>
                                ← Chọn Cấp Độ Khác
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-danger" role="status">
                                    <span className="visually-hidden">Đang tải bài học...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="row">
                                {lessons.map((lesson) => (
                                    <div className="col-md-6 mb-3" key={lesson.id}>
                                        <div
                                            className="card shadow-sm hover-shadow border h-100"
                                            onClick={() => setSelectedLesson(lesson)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="card-body d-flex flex-column justify-content-between">
                                                <h5 className="card-title fw-bold text-dark">{lesson.title}</h5>
                                                <p className="card-text text-muted small mb-2">Chứa {lesson.vocabCount} từ vựng JLPT {selectedLevel}.</p>
                                                <button className="btn btn-sm btn-outline-danger align-self-start fw-bold mt-2">
                                                    Học từ vựng →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* GIAO DIỆN 3: XEM THẺ NHỚ FLASHCARD */}
                {selectedLesson && (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                            <h4 className="fw-bold text-danger m-0"> Flashcard: {selectedLesson.title}</h4>
                            <button className="btn btn-outline-secondary btn-sm fw-bold" onClick={() => setSelectedLesson(null)}>
                                ← Trở Lại Danh Sách Bài
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-danger" role="status">
                                    <span className="visually-hidden">Đang nạp từ vựng...</span>
                                </div>
                            </div>
                        ) : vocabularies.length === 0 ? (
                            <div className="alert alert-warning text-center">
                                Bài học này hiện chưa có dữ liệu từ vựng.
                            </div>
                        ) : (
                            <div className="text-center">
                                {/* Flashcard Card Container */}
                                <div
                                    className={`flashcard-container ${isFlipped ? "flipped" : ""}`}
                                    onClick={() => setIsFlipped(!isFlipped)}
                                >
                                    <div className="flashcard-inner">
                                        {/* Mặt trước: Từ vựng & cách đọc */}
                                        <div className="flashcard-front">
                                            <span className="badge bg-danger mb-3" style={{ fontSize: "12px" }}>MẶT TRƯỚC</span>
                                            <h1 className="display-3 fw-bold mb-2 text-dark">{vocabularies[currentIdx].word}</h1>
                                            {vocabularies[currentIdx].reading && (
                                                <h4 className="text-danger mb-4">({vocabularies[currentIdx].reading})</h4>
                                            )}
                                            <button
                                                className="btn btn-link p-0 border-0 bg-transparent text-primary hover-scale"
                                                style={{ outline: "none", transition: "transform 0.15s ease" }}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Không cho lật thẻ khi bấm loa
                                                    handleSpeak(vocabularies[currentIdx].word);
                                                }}
                                                title="Nghe phát âm"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#0d6efd" className="bi bi-volume-up-fill" viewBox="0 0 16 16">
                                                    <path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z"/>
                                                    <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z"/>
                                                    <path d="M8.707 11.182A4.5 4.5 0 0 0 10.025 8a4.5 4.5 0 0 0-1.318-3.182L8 5.525A3.5 3.5 0 0 1 9.025 8 3.5 3.5 0 0 1 8 10.475z"/>
                                                    <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
                                                </svg>
                                            </button>
                                            <small className="text-muted mt-3 d-block">Nhấn vào thẻ để xem nghĩa tiếng Việt</small>
                                        </div>

                                        {/* Mặt sau: Nghĩa & ví dụ */}
                                        <div className="flashcard-back">
                                            <span className="badge bg-secondary mb-3" style={{ fontSize: "12px" }}>MẶT SAU</span>
                                            <h3 className="fw-bold mb-3 text-dark">{getMeaningText(vocabularies[currentIdx])}</h3>
                                            <div className="w-100">
                                                {renderExamples(vocabularies[currentIdx])}
                                            </div>
                                            <small className="text-muted mt-auto pt-3 d-block">Nhấn vào thẻ để lật lại mặt trước</small>
                                        </div>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="d-flex justify-content-center align-items-center gap-4 mt-4">
                                    <button
                                        className="btn btn-outline-danger fw-bold px-3 py-2"
                                        onClick={handlePrev}
                                        disabled={currentIdx === 0}
                                    >
                                        ← Từ Trước
                                    </button>
                                    <span className="fw-bold fs-5 text-muted">{currentIdx + 1} / {vocabularies.length}</span>
                                    <button
                                        className="btn btn-danger text-white fw-bold px-3 py-2"
                                        onClick={handleNext}
                                        disabled={currentIdx === vocabularies.length - 1}
                                    >
                                        Từ Tiếp Theo →
                                    </button>
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
