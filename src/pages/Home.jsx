import { Link } from "react-router-dom";
import Aside from "../templates/Aside";

export default function Home() {
    const existAccount = localStorage.getItem("account");
    const account = existAccount ? JSON.parse(existAccount) : null;

    const levels = [
        { key: "N5", name: "N5 — Sơ Cấp 1", lessons: "25 bài (Minna 1-25)", desc: "800 từ vựng, 100 chữ Kanji cơ bản. Phù hợp cho người mới bắt đầu." },
        { key: "N4", name: "N4 — Sơ Cấp 2", lessons: "25 bài (Minna 26-50)", desc: "1500 từ vựng, 300 chữ Kanji. Giao tiếp hàng ngày cơ bản." },
        { key: "N3", name: "N3 — Trung Cấp", lessons: "100 mẫu ngữ pháp", desc: "3700 từ vựng, 650 chữ Kanji. Đọc hiểu văn bản thông thường." },
        { key: "N2", name: "N2 — Thượng Cấp", lessons: "Chuyên ngành & Học thuật", desc: "6000 từ vựng, 1000 chữ Kanji. Đọc báo chí, tài liệu phức tạp." },
        { key: "N1", name: "N1 — Cao Cấp nhất", lessons: "Gần như người bản xứ", desc: "10000 từ vựng, 2000 chữ Kanji. Đọc hiểu văn bản học thuật sâu sắc." }
    ];

    return (
        <>
            <div className="col-md-9">
                {/* Hero — Japandi style with left accent bar */}
                <div className="japandi-hero mb-4">
                    <h1 className="fw-bold mb-2" style={{ fontSize: "28px", color: "var(--jp-text-primary)", letterSpacing: "-0.02em" }}>
                        Chào mừng đến với NihonLearning
                    </h1>
                    <p className="mb-3" style={{ fontSize: "16px", color: "var(--jp-text-secondary)", maxWidth: "65ch", lineHeight: "1.7" }}>
                        Học bảng chữ cái Hiragana/Katakana, trau dồi từ vựng & Kanji từ N5 đến N1 và thi thử JLPT miễn phí.
                    </p>
                    {account ? (
                        <div className="alert alert-success d-inline-block py-2 px-3 mb-0">
                            Chúc <strong>{account.name}</strong> học tập tốt hôm nay!
                        </div>
                    ) : (
                        <Link to="/signin" className="btn btn-danger btn-lg fw-bold">
                            Bắt đầu học ngay
                        </Link>
                    )}
                </div>

                {/* Section: Alphabet intro */}
                <h3 className="japandi-section-title">Nhập môn Tiếng Nhật</h3>
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card" style={{ borderLeft: "3px solid var(--jp-accent)" }}>
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="card-title fw-bold" style={{ color: "var(--jp-text-primary)" }}>Bảng Chữ Cái Hiragana & Katakana</h5>
                                    <p className="card-text text-muted mb-0">Học cách phát âm, nét viết và ví dụ thực tế cho toàn bộ bảng chữ cái.</p>
                                </div>
                                <Link to="/alphabet" className="btn btn-outline-danger fw-bold">Học Ngay</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: JLPT Levels */}
                <h3 className="japandi-section-title">JLPT Levels</h3>
                <div className="row">
                    {levels.map(level => (
                        <div className="col-md-6 mb-3" key={level.key}>
                            <div className="card h-100" style={{ borderLeft: "3px solid var(--jp-accent)" }}>
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <h5 className="card-title fw-bold" style={{ color: "var(--jp-text-primary)" }}>{level.name}</h5>
                                        <span className="badge bg-secondary mb-2">{level.lessons}</span>
                                        <p className="card-text text-muted" style={{ fontSize: "14px" }}>{level.desc}</p>
                                    </div>
                                    <Link to={`/levels/${level.key}`} className="btn btn-sm btn-outline-danger mt-2 fw-bold align-self-start">
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
