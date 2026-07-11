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
                <h3 className="fw-bold mb-3">Học Bảng Chữ Cái Tiếng Nhật</h3>

                {/* Tab switch */}
                <div className="btn-group w-100 mb-4 shadow-sm" role="group">
                    <button
                        type="button"
                        className={`btn py-2 fw-bold ${activeTab === "hiragana" ? "btn-danger" : "btn-outline-danger"}`}
                        onClick={() => { setActiveTab("hiragana"); setSelectedChar(alphabetList.find(c => c.type === "hiragana")); }}
                    >
                        Bảng chữ mềm Hiragana
                    </button>
                    <button
                        type="button"
                        className={`btn py-2 fw-bold ${activeTab === "katakana" ? "btn-danger" : "btn-outline-danger"}`}
                        onClick={() => { setActiveTab("katakana"); setSelectedChar(alphabetList.find(c => c.type === "katakana")); }}
                    >
                        Bảng chữ cứng Katakana
                    </button>
                </div>

                <div className="row">
                    {/* Character Grid */}
                    <div className="col-md-7">
                        <div className="card shadow-sm p-3 bg-white">
                            <div className="d-flex flex-wrap gap-2 justify-content-start">
                                {filteredList.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleCharClick(item)}
                                        className={`btn flex-grow-0 d-flex flex-column align-items-center justify-content-center border`}
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            fontSize: "20px",
                                            backgroundColor: selectedChar?.id === item.id ? "#dc3545" : "#f8f9fa",
                                            color: selectedChar?.id === item.id ? "white" : "black",
                                            transition: "all 0.15s ease"
                                        }}
                                    >
                                        <span className="fw-bold">{item.character}</span>
                                        <span style={{ fontSize: "10px", opacity: 0.8 }}>{item.romaji}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Character Detail Card */}
                    <div className="col-md-5">
                        {selectedChar && (
                            <div className="card shadow-sm border border-danger border-2 text-center h-100">
                                <div className="card-header bg-danger text-white fw-bold">
                                    Chi tiết chữ cái
                                </div>
                                <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                                    <span className="display-1 fw-bold text-danger mb-3">{selectedChar.character}</span>
                                    <h4 className="fw-bold text-dark mb-2">Phiên âm Romaji: <span className="text-primary">{selectedChar.romaji}</span></h4>
                                    <p className="text-muted mb-3" style={{ fontSize: "16px" }}>
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
                                        🔊
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
