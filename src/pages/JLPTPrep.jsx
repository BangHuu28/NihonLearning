import { Link } from "react-router-dom";
import Aside from "../templates/Aside";

export default function JLPTPrep() {
    const exams = [
        { level: "N5", title: " JLPT N5", questions: "10 câu hỏi trắc nghiệm", time: "15 phút", desc: "Kiểm tra kiến thức bảng chữ cái, từ vựng cơ bản và trợ từ.", color: "primary" },
        { level: "N4", title: " JLPT N4", questions: "10 câu hỏi trắc nghiệm", time: "15 phút", desc: "Đánh giá ngữ pháp sơ cấp nâng cao, từ vựng và hán tự thông dụng.", color: "success" },
        { level: "N3", title: " JLPT N3", questions: "10 câu hỏi nâng cao", time: "20 phút", desc: "Thử sức với các đoạn đọc ngắn, từ vựng và Kanji trung cấp.", color: "info" },
        { level: "N2", title: " JLPT N2", questions: "Tính năng đang cập nhật", time: "25 phút", desc: "Luyện đọc hiểu báo chí, ngữ pháp và từ vựng học thuật.", color: "warning", disabled: true },
        { level: "N1", title: " JLPT N1", questions: "Tính năng đang cập nhật", time: "30 phút", desc: "Thách thức trình độ cao cấp, Kanji phức tạp, nghe hiểu tốc độ cao.", color: "danger", disabled: true }
    ];

    return (
        <>
            <div className="col-md-9">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/home">Trang chủ</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Luyện thi JLPT</li>
                    </ol>
                </nav>

                <div className="p-4 mb-4 bg-light rounded-3 border-start border-danger border-4 shadow-sm">
                    <h2 className="fw-bold text-danger"> Thi Thử JLPT </h2>
                    <p className="lead mb-0 text-muted" style={{ fontSize: "16px" }}>
                        Hệ thống thi thử trắc nghiệm tính giờ. Nhận kết quả và đáp án giải thích chi tiết ngay sau khi nộp bài.
                    </p>
                </div>

                <h4 className="fw-bold mb-3">Chọn cấp độ:</h4>
                <div className="row">
                    {exams.map((ex, idx) => (
                        <div className="col-md-6 mb-3" key={idx}>
                            <div className={`card h-100 shadow-sm border-start border-${ex.color} border-4`}>
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h5 className={`card-title fw-bold m-0 text-${ex.color}`}>{ex.title}</h5>
                                            <span className="badge bg-secondary">{ex.level}</span>
                                        </div>
                                        <div className="mb-2 text-muted small">
                                            <span> Thời gian: {ex.time}</span> | <span> Số lượng: {ex.questions}</span>
                                        </div>
                                        <p className="card-text text-muted" style={{ fontSize: "14px" }}>{ex.desc}</p>
                                    </div>
                                    {ex.disabled ? (
                                        <button className="btn btn-sm btn-secondary mt-2 disabled text-white fw-bold align-self-start">
                                            Sắp ra mắt
                                        </button>
                                    ) : (
                                        <Link to={`/jlpt/exam/${ex.level}`} className={`btn btn-sm btn-${ex.color} mt-2 text-white fw-bold align-self-start`}>
                                            Bắt đầu làm bài
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Aside />
        </>
    );
}
