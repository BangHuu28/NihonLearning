import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function JLPTExam() {
    const { level } = useParams();
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: selectedOptionValue }
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(900); // 15 phút = 900 giây
    const [score, setScore] = useState(0);

    useEffect(() => {
        axios.get(`/data/quizzes/${level.toLowerCase()}.json`)
            .then(res => setQuestions(res.data))
            .catch(err => console.error("Lỗi lấy danh sách câu hỏi:", err));
    }, [level]);

    // Đếm ngược thời gian
    useEffect(() => {
        if (isSubmitted || timeLeft <= 0) return;
        const timer = setTimeout(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, isSubmitted]);

    // Tự động nộp bài khi hết giờ
    useEffect(() => {
        if (timeLeft === 0 && !isSubmitted) {
            handleSubmit();
        }
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleOptionSelect = (qId, option) => {
        if (isSubmitted) return;
        setSelectedAnswers({
            ...selectedAnswers,
            [qId]: option
        });
    };

    const handleSubmit = () => {
        if (isSubmitted) return;
        setIsSubmitted(true);
        let correctCount = 0;
        questions.forEach(q => {
            if (selectedAnswers[q.id] === q.answer) {
                correctCount++;
            }
        });
        setScore(correctCount);
    };

    if (questions.length === 0) {
        return (
            <div className="col-12 text-center py-5">
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIdx];

    return (
        <div className="col-12">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/home">Trang chủ</Link></li>
                    <li className="breadcrumb-item"><Link to="/jlpt">Luyện thi JLPT</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Đề thi {level}</li>
                </ol>
            </nav>

            <div className="row">
                {/* Main Quiz Section */}
                <div className="col-md-8">
                    {!isSubmitted ? (
                        <div className="card shadow-sm mb-4 border border-primary">
                            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3">
                                <h5 className="m-0 fw-bold">Câu hỏi {currentIdx + 1} / {questions.length}</h5>
                                <div className="badge bg-light text-primary fs-6 fw-bold">{formatTime(timeLeft)}</div>
                            </div>
                            <div className="card-body p-4">
                                <h4 className="fw-bold mb-4 text-dark" style={{ lineHeight: "1.6" }}>{currentQuestion.question}</h4>
                                <div className="d-flex flex-column gap-3">
                                    {currentQuestion.options.map((opt, i) => {
                                        const isSelected = selectedAnswers[currentQuestion.id] === opt;
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => handleOptionSelect(currentQuestion.id, opt)}
                                                className={`btn text-start p-3 border rounded shadow-sm hover-bg-light ${isSelected ? "btn-primary text-white" : "bg-white text-dark"}`}
                                                style={{ fontSize: "16px", transition: "all 0.15s ease" }}
                                            >
                                                <strong>{String.fromCharCode(65 + i)}.</strong> {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="card-footer bg-light d-flex justify-content-between p-3">
                                <button
                                    onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                                    className="btn btn-outline-secondary fw-bold"
                                    disabled={currentIdx === 0}
                                >
                                    ← Câu Trước
                                </button>
                                {currentIdx < questions.length - 1 ? (
                                    <button
                                        onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                                        className="btn btn-primary text-white fw-bold"
                                    >
                                        Câu Tiếp →
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        className="btn btn-success fw-bold px-4"
                                    >
                                        Nộp Bài Thi
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="card shadow-sm mb-4 border border-success">
                            <div className="card-header bg-success text-white py-3 text-center">
                                <h3 className="m-0 fw-bold">Kết Quả Bài Thi JLPT {level}</h3>
                            </div>
                            <div className="card-body p-5 text-center">
                                <span className="display-3 fw-bold text-success mb-2 d-block">{score} / {questions.length}</span>
                                <h4 className="fw-bold mb-4">Điểm số chính xác của bạn</h4>
                                <div className="alert alert-info py-2 px-3 d-inline-block">
                                    Tỷ lệ đúng: {Math.round((score / questions.length) * 100)}% | Thời gian nộp bài: Còn {formatTime(timeLeft)}
                                </div>
                                <hr />
                                <div className="text-start mt-4">
                                    <h4 className="fw-bold mb-3 border-bottom pb-2"> Giải thích đáp án chi tiết:</h4>
                                    {questions.map((q, idx) => {
                                        const userAns = selectedAnswers[q.id];
                                        const isCorrect = userAns === q.answer;
                                        return (
                                            <div className={`p-3 mb-3 border rounded ${isCorrect ? "border-success bg-success-subtle" : "border-danger bg-danger-subtle"}`} style={{ backgroundColor: isCorrect ? "#f4fcf6" : "#fdf5f5" }} key={q.id}>
                                                <h6 className="fw-bold text-dark">Câu {idx + 1}: {q.question}</h6>
                                                <div className="small mb-1">
                                                    <strong>Đáp án của bạn:</strong> <span className={isCorrect ? "text-success fw-bold" : "text-danger fw-bold"}>{userAns || "(Chưa chọn)"}</span>
                                                </div>
                                                <div className="small mb-2">
                                                    <strong>Đáp án đúng:</strong> <span className="text-success fw-bold">{q.answer}</span>
                                                </div>
                                                <div className="alert alert-secondary py-2 px-3 m-0 small">
                                                    <strong>Giải thích:</strong> {q.explanation}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <Link to="/jlpt" className="btn btn-primary fw-bold mt-3">Quay lại danh sách đề thi</Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Question Nav */}
                <div className="col-md-4">
                    <div className="card shadow-sm border mb-4">
                        <div className="card-header bg-light fw-bold text-dark text-center py-2">
                            Bảng câu hỏi
                        </div>
                        <div className="card-body p-3">
                            <div className="d-flex flex-wrap gap-2 justify-content-center mb-3">
                                {questions.map((q, idx) => {
                                    const isAnswered = selectedAnswers[q.id] !== undefined;
                                    const isActive = currentIdx === idx;
                                    
                                    let btnClass = "btn-outline-secondary";
                                    if (isSubmitted) {
                                        btnClass = selectedAnswers[q.id] === q.answer ? "btn-success text-white" : "btn-danger text-white";
                                    } else if (isActive) {
                                        btnClass = "btn-danger text-white"; // Tông đỏ đồng bộ
                                    } else if (isAnswered) {
                                        btnClass = "btn-outline-danger"; // Trả lời rồi viền đỏ
                                    }
                                    
                                    return (
                                        <button
                                            key={q.id}
                                            onClick={() => !isSubmitted && setCurrentIdx(idx)}
                                            className={`btn ${btnClass} rounded-circle d-flex align-items-center justify-content-center p-0`}
                                            style={{ width: "40px", height: "40px", fontWeight: "bold", fontSize: "14px" }}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>
                            <hr />
                            <div className="small text-muted">
                                <div className="d-flex align-items-center gap-2"><span className="badge bg-danger text-white rounded-circle d-inline-block p-0 text-center" style={{ width: "20px", height: "20px", fontSize: "10px", lineHeight: "20px" }}>1</span> Đang làm</div>
                                <div className="mt-1 d-flex align-items-center gap-2"><span className="btn btn-outline-danger btn-sm rounded-circle d-inline-block p-0 text-center fw-bold" style={{ width: "20px", height: "20px", fontSize: "10px", lineHeight: "18px" }}>2</span> Đã chọn đáp án</div>
                                <div className="mt-1 d-flex align-items-center gap-2"><span className="btn btn-outline-secondary btn-sm rounded-circle d-inline-block p-0 text-center fw-bold" style={{ width: "20px", height: "20px", fontSize: "10px", lineHeight: "18px" }}>3</span> Chưa làm</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
