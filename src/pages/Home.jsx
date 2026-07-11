import { Link } from "react-router-dom";
import Aside from "../templates/Aside";

export default function Home() {
    const existAccount = localStorage.getItem("account");
    const account = existAccount ? JSON.parse(existAccount) : null;

    const levels = [
        { key: "N5", name: "N5 - Sơ Cấp 1 (Cơ bản nhất)", lessons: "25 bài (Minna 1-25)", desc: "800 từ vựng, 100 chữ Kanji cơ bản. Phù hợp cho người mới bắt đầu.", color: "primary" },
        { key: "N4", name: "N4 - Sơ Cấp 2 (Nâng cao)", lessons: "25 bài (Minna 26-50)", desc: "1500 từ vựng, 300 chữ Kanji. Giao tiếp hàng ngày cơ bản.", color: "success" },
        { key: "N3", name: "N3 - Trung Cấp", lessons: "100 mẫu ngữ pháp", desc: "3700 từ vựng, 650 chữ Kanji. Đọc hiểu văn bản thông thường.", color: "info" },
        { key: "N2", name: "N2 - Thượng Cấp", lessons: "Chuyên ngành & Học thuật", desc: "6000 từ vựng, 1000 chữ Kanji. Đọc báo chí, tài liệu phức tạp.", color: "warning" },
        { key: "N1", name: "N1 - Cao Cấp nhất", lessons: "Gần như người bản xứ", desc: "10000 từ vựng, 2000 chữ Kanji. Đọc hiểu văn bản học thuật sâu sắc.", color: "danger" }
    ];

    return (
        <>
            <div className="col-md-9">
                <div className="p-5 mb-4 bg-light rounded-3 shadow-sm border border-danger border-2">
                    <div className="container-fluid py-2">
                        <h1 className="display-6 fw-bold text-danger">Chào mừng đến với NihonLearning</h1>
                        <p className="col-md-12 fs-5 text-muted">
                            Học bảng chữ cái Hiragana/Katakana, trau dồi từ vựng & Kanji từ N5 đến N1 và thi thử JLPT miễn phí.
                        </p>
                        {account ? (
                            <div className="alert alert-success d-inline-block py-2 px-3">
                                Chúc <strong>{account.name}</strong> học tập tốt hôm nay!
                            </div>
                        ) : (
                            <Link to="/signin" className="btn btn-danger btn-lg font-weight-bold">
                                Bắt đầu học ngay
                            </Link>
                        )}
                    </div>
                </div>

                <h3 className="fw-bold mb-3 border-bottom pb-2"> Nhập môn Tiếng Nhật</h3>
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card shadow-sm border-start border-danger border-4">
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="card-title fw-bold text-danger">Bảng Chữ Cái Hiragana & Katakana</h5>
                                    <p className="card-text text-muted mb-0">Học cách phát âm, nét viết và ví dụ thực tế cho toàn bộ bảng chữ cái.</p>
                                </div>
                                <Link to="/alphabet" className="btn btn-outline-danger font-weight-bold">Học Ngay</Link>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className="fw-bold mb-3 border-bottom pb-2">JLPT Levels</h3>
                <div className="row">
                    {levels.map(level => (
                        <div className="col-md-6 mb-3" key={level.key}>
                            <div className={`card h-100 shadow-sm border-start border-${level.color} border-4`}>
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <h5 className={`card-title fw-bold text-${level.color}`}>{level.name}</h5>
                                        <span className="badge bg-secondary mb-2">{level.lessons}</span>
                                        <p className="card-text text-muted" style={{ fontSize: "14px" }}>{level.desc}</p>
                                    </div>
                                    <Link to={`/levels/${level.key}`} className={`btn btn-sm btn-outline-${level.color} mt-2 fw-bold align-self-start`}>
                                        Vào học {level.key}
                                    </Link>
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
