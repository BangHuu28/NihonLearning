import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Aside from "../templates/Aside";

export default function LessonDetail() {
    const { level, lessonId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [vocabularies, setVocabularies] = useState([]);
    const [kanjis, setKanjis] = useState([]);
    const [activeTab, setActiveTab] = useState("vocab");
    const [searchVocab, setSearchVocab] = useState("");

    useEffect(() => {
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

    // Lọc từ vựng theo ô tìm kiếm (hỗ trợ cả meanings array)
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
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "ja-JP";
        window.speechSynthesis.speak(utterance);
    };

    // Helper: hiển thị meanings (hỗ trợ cả array và string)
    const getMeaningDisplay = (v) => {
        if (Array.isArray(v.meanings) && v.meanings.length > 0) {
            return v.meanings.join(', ');
        }
        return v.meaning || '';
    };

    // Helper: hiển thị reading
    const getReadingDisplay = (v) => {
        return v.reading || v.kana || '';
    };

    // Helper: hiển thị examples
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

                <h2 className="fw-bold mb-4 text-dark border-bottom pb-2"> {lesson.title}</h2>

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
                                        <th>Nghĩa (EN)</th>
                                        <th>Ví dụ minh họa</th>
                                        <th>Phát âm</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredVocab.map(v => (
                                        <tr key={v.id}>
                                            <td className="fw-bold text-center" style={{ fontSize: "18px" }}>{v.word}</td>
                                            <td className="text-danger text-center">{getReadingDisplay(v)}</td>
                                            <td className="fw-semibold">{getMeaningDisplay(v)}</td>
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
            </div>
            <Aside />
        </>
    );
}
