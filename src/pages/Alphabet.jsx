import { useState, useEffect } from "react";
import axios from "axios";
import Aside from "../templates/Aside";

export default function Alphabet() {
    const [alphabetList, setAlphabetList] = useState([]);
    const [activeTab, setActiveTab] = useState("hiragana");
    const [selectedChar, setSelectedChar] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:9998/alphabets")
            .then(res => {
                setAlphabetList(res.data);
                // Set default character
                const defaults = res.data.filter(c => c.type === "hiragana");
                if (defaults.length > 0) {
                    setSelectedChar(defaults[0]);
                }
            })
            .catch(err => console.error("Lỗi lấy bảng chữ cái:", err));
    }, []);

    const filteredList = alphabetList.filter(c => c.type === activeTab);

    const handleCharClick = (char) => {
        setSelectedChar(char);
    };

    return (
        <>
            <div className="col-md-9">
                <h3 className="japandi-section-title">Học Bảng Chữ Cái Tiếng Nhật</h3>

                {/* Tab switch — Japandi styled */}
                <div className="btn-group w-100 mb-4" role="group" style={{ borderRadius: "var(--jp-radius-sm)", overflow: "hidden", border: "1px solid var(--jp-border)" }}>
                    <button
                        type="button"
                        className="btn py-2 fw-bold"
                        style={{
                            background: activeTab === "hiragana" ? "var(--jp-accent)" : "var(--jp-bg-surface)",
                            color: activeTab === "hiragana" ? "white" : "var(--jp-text-secondary)",
                            border: "none",
                            borderRadius: 0,
                            transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)"
                        }}
                        onClick={() => { setActiveTab("hiragana"); setSelectedChar(alphabetList.find(c => c.type === "hiragana")); }}
                    >
                        Bảng chữ mềm Hiragana
                    </button>
                    <button
                        type="button"
                        className="btn py-2 fw-bold"
                        style={{
                            background: activeTab === "katakana" ? "var(--jp-accent)" : "var(--jp-bg-surface)",
                            color: activeTab === "katakana" ? "white" : "var(--jp-text-secondary)",
                            border: "none",
                            borderLeft: "1px solid var(--jp-border)",
                            borderRadius: 0,
                            transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)"
                        }}
                        onClick={() => { setActiveTab("katakana"); setSelectedChar(alphabetList.find(c => c.type === "katakana")); }}
                    >
                        Bảng chữ cứng Katakana
                    </button>
                </div>

                <div className="row">
                    {/* Character Grid */}
                    <div className="col-md-7">
                        <div className="card p-3">
                            <div className="d-flex flex-wrap gap-2 justify-content-start">
                                {filteredList.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleCharClick(item)}
                                        className="btn flex-grow-0 d-flex flex-column align-items-center justify-content-center"
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            fontSize: "20px",
                                            fontFamily: "var(--jp-font-serif)",
                                            backgroundColor: selectedChar?.id === item.id ? "var(--jp-accent)" : "var(--jp-bg-surface-alt)",
                                            color: selectedChar?.id === item.id ? "white" : "var(--jp-text-primary)",
                                            border: selectedChar?.id === item.id ? "1px solid var(--jp-accent)" : "1px solid var(--jp-border)",
                                            borderRadius: "var(--jp-radius-sm)",
                                            transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)"
                                        }}
                                    >
                                        <span className="fw-bold">{item.character}</span>
                                        <span style={{ fontSize: "10px", opacity: 0.7 }}>{item.romaji}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Character Detail Card */}
                    <div className="col-md-5">
                        {selectedChar && (
                            <div className="card text-center h-100" style={{ borderTop: "3px solid var(--jp-accent)" }}>
                                <div className="card-header fw-bold" style={{ fontSize: "14px" }}>
                                    Chi tiết chữ cái
                                </div>
                                <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                                    <span className="display-1 fw-bold mb-3" style={{ color: "var(--jp-accent)", fontFamily: "var(--jp-font-serif)" }}>{selectedChar.character}</span>
                                    <h4 className="fw-bold mb-2" style={{ color: "var(--jp-text-primary)" }}>
                                        Phiên âm Romaji: <span style={{ color: "var(--jp-accent)" }}>{selectedChar.romaji}</span>
                                    </h4>
                                    <p className="text-muted mb-3" style={{ fontSize: "15px" }}>
                                        Cách viết và phát âm chuẩn giọng bản xứ.
                                    </p>
                                    <div className="alert alert-secondary w-100 py-2">
                                        <strong>Ví dụ từ vựng: </strong> <br />
                                        {selectedChar.example}
                                    </div>
                                    <button
                                        className="btn btn-outline-danger btn-sm mt-2"
                                        onClick={() => {
                                            const utterance = new SpeechSynthesisUtterance(selectedChar.character);
                                            utterance.lang = "ja-JP";
                                            window.speechSynthesis.speak(utterance);
                                        }}
                                    >
                                        Nghe phát âm
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Aside />
        </>
    );
}
