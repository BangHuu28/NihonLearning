import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Aside from "../templates/Aside";

export default function LevelDashboard() {
    const { level } = useParams();
    const [lessons, setLessons] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:9998/lessons?level=${level}`)
            .then(res => {
                // Sắp xếp bài học theo lessonNumber tăng dần
                const sorted = res.data.sort((a, b) => a.lessonNumber - b.lessonNumber);
                setLessons(sorted);
            })
            .catch(err => console.error("Lỗi lấy danh sách bài học:", err));
    }, [level]);

    const filteredLessons = lessons.filter(l =>
        l.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const levelDetails = {
        N5: { desc: "Sơ cấp 1 - Bắt đầu với giáo trình Minna no Nihongo (Bài 1 - 25). Đích đến là 800 từ và 100 chữ Kanji cơ bản.", color: "primary" },
        N4: { desc: "Sơ cấp 2 - Tiếp tục hoàn thiện 50 bài giáo trình Minna (Bài 26 - 50). Đích đến là 1500 từ và 300 chữ Kanji.", color: "success" },
        N3: { desc: "Trung cấp - Chuyển giao lên giao tiếp tự nhiên và cấu trúc ngữ pháp nâng cao. 3700 từ vựng và 650 Kanji.", color: "info" },
        N2: { desc: "Thượng cấp - Học thuật và báo chí chuyên ngành. Đọc hiểu tin tức, truyền hình Nhật Bản. 6000 từ vựng và 1000 Kanji.", color: "warning" },
        N1: { desc: "Cao cấp nhất - Thành thạo gần như người bản xứ. Sử dụng tốt trong nghiên cứu học thuật, doanh nghiệp. 10000 từ vựng và 2000 Kanji.", color: "danger" }
    };

    const details = levelDetails[level] || { desc: "Trình độ tiếng Nhật tương đương tiêu chuẩn JLPT.", color: "secondary" };

    return (
        <>
            <div className="col-md-9">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/home">Trang chủ</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Trình độ {level}</li>
                    </ol>
                </nav>

                <div className={`p-4 mb-4 bg-light rounded-3 border-start border-${details.color} border-4 shadow-sm`}>
                    <h2 className={`fw-bold text-${details.color}`}>Khóa học Tiếng Nhật Trình độ {level}</h2>
                    <p className="lead mb-0 text-muted" style={{ fontSize: "16px" }}>{details.desc}</p>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="fw-bold m-0"> Danh sách bài học ({filteredLessons.length})</h4>
                    <input
                        type="text"
                        placeholder="Tìm bài học..."
                        className="form-control form-control-sm"
                        style={{ width: "200px" }}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="row">
                    {filteredLessons.map(lesson => (
                        <div className="col-md-6 mb-3" key={lesson.id}>
                            <div className="card shadow-sm h-100 hover-shadow border">
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <h5 className="card-title fw-bold text-dark">{lesson.title}</h5>
                                        <p className="card-text text-muted small mb-2">Học từ vựng, chữ Hán và các cấu trúc ngữ pháp tiêu chuẩn JLPT {level}.</p>
                                    </div>
                                    <Link to={`/levels/${level}/lessons/${lesson.id}`} className={`btn btn-sm btn-${details.color} mt-2 text-white fw-bold align-self-start`}>
                                        Vào học ngay →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredLessons.length === 0 && (
                        <div className="col-12 text-center py-4 text-muted border rounded bg-light">
                            Không tìm thấy bài học phù hợp.
                        </div>
                    )}
                </div>
            </div>
            <Aside />
        </>
    );
}
