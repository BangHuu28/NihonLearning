export default function Aside() {
    return (
        <div className="col-md-3">
            <div className="card shadow-sm mb-4">
                <div className="card-header fw-bold" style={{ fontSize: "14px", letterSpacing: "0.02em" }}>
                    Mẹo Học Tiếng Nhật
                </div>
                <div className="card-body">
                    <h6 className="card-title fw-bold" style={{ color: "var(--jp-accent)" }}>Học Bảng Chữ Cái</h6>
                    <p className="card-text text-muted" style={{ fontSize: "14px" }}>
                        Hãy liên tưởng hình ảnh để nhớ chữ Hiragana/Katakana nhanh hơn. Luyện viết 15 phút mỗi ngày!
                    </p>
                    <hr style={{ borderColor: "var(--jp-border)" }} />
                    <h6 className="card-title fw-bold" style={{ color: "var(--jp-accent)" }}>Bí quyết Kanji N5-N1</h6>
                    <p className="card-text text-muted" style={{ fontSize: "14px" }}>
                        Không học vẹt nét chữ, hãy học theo Bộ Thủ và ghép từ vựng thực tế để tăng phản xạ ghi nhớ.
                    </p>
                    <hr style={{ borderColor: "var(--jp-border)" }} />
                    <h6 className="card-title fw-bold" style={{ color: "var(--jp-accent)" }}>Luyện đề JLPT</h6>
                    <p className="card-text text-muted" style={{ fontSize: "14px" }}>
                        Phân bổ thời gian hợp lý: Đọc hiểu 50%, Nghe hiểu 30%, Từ vựng & Ngữ pháp 20%. Làm bài thi thử tính giờ để làm quen áp lực phòng thi.
                    </p>
                </div>
            </div>


        </div>
    );
}
