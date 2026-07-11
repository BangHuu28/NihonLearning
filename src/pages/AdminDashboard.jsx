import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Table, Form, Button } from "react-bootstrap";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("vocab"); // 'vocab', 'users', 'quizzes'
    const [lessons, setLessons] = useState([]);

    // --- VOCABULARY STATES ---
    const [vocabularies, setVocabularies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("N5");
    const [editingVocabId, setEditingVocabId] = useState(null);
    const [word, setWord] = useState("");
    const [kana, setKana] = useState("");
    const [meaning, setMeaning] = useState("");
    const [example, setExample] = useState("");
    const [vocabLevel, setVocabLevel] = useState("N5");
    const [vocabLessonId, setVocabLessonId] = useState("");

    // --- USER MANAGEMENT STATES ---
    const [usersList, setUsersList] = useState([]);
    const [userSearch, setUserSearch] = useState("");
    const [editingUserId, setEditingUserId] = useState(null);
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userFullname, setUserFullname] = useState("");
    const [userRole, setUserRole] = useState("customer");

    // --- QUIZ MANAGEMENT STATES ---
    const [quizzesList, setQuizzesList] = useState([]);
    const [quizSearch, setQuizSearch] = useState("");
    const [selectedQuizLevel, setSelectedQuizLevel] = useState("N5");
    const [editingQuizId, setEditingQuizId] = useState(null);
    const [quizQuestion, setQuizQuestion] = useState("");
    const [quizOptA, setQuizOptA] = useState("");
    const [quizOptB, setQuizOptB] = useState("");
    const [quizOptC, setQuizOptC] = useState("");
    const [quizOptD, setQuizOptD] = useState("");
    const [quizAnswer, setQuizAnswer] = useState("");
    const [quizLevel, setQuizLevel] = useState("N5");
    const [quizLessonId, setQuizLessonId] = useState("");

    useEffect(() => {
        // Xác thực quyền Admin
        const existAccount = localStorage.getItem("account");
        if (!existAccount) {
            navigate("/signin");
            return;
        }
        const account = JSON.parse(existAccount);
        if (account.role !== "admin") {
            navigate("/home");
            return;
        }

        fetchLessons();
        fetchUsers();
    }, [navigate]);

    // Tự động tải từ vựng & quizzes theo cấp độ đã chọn
    useEffect(() => {
        fetchVocabByLevel(selectedLevel);
    }, [selectedLevel]);

    useEffect(() => {
        fetchQuizzesByLevel(selectedQuizLevel);
    }, [selectedQuizLevel]);

    const fetchLessons = () => {
        axios.get("http://localhost:9998/lessons")
            .then(res => {
                setLessons(res.data);
                if (res.data.length > 0) {
                    setVocabLessonId(res.data[0].id);
                    setQuizLessonId(res.data[0].id);
                }
            })
            .catch(err => console.error("Lỗi lấy bài học:", err));
    };

    const fetchVocabByLevel = (lvl) => {
        axios.get(`/data/vocab/${lvl.toLowerCase()}.json`)
            .then(res => setVocabularies(res.data))
            .catch(err => console.error("Lỗi lấy từ vựng:", err));
    };

    const fetchUsers = () => {
        axios.get("http://localhost:9998/user")
            .then(res => setUsersList(res.data))
            .catch(err => console.error("Lỗi lấy danh sách user:", err));
    };

    const fetchQuizzesByLevel = (lvl) => {
        axios.get(`/data/quizzes/${lvl.toLowerCase()}.json`)
            .then(res => setQuizzesList(res.data))
            .catch(err => console.error("Lỗi lấy đề thi:", err));
    };

    // --- XỬ LÝ LƯU/SỬA/XÓA TỪ VỰNG ---
    const handleSaveVocab = (e) => {
        e.preventDefault();
        if (!word || !meaning) {
            alert("Vui lòng điền các trường bắt buộc!");
            return;
        }
        const meaningsArray = meaning.split(',').map(m => m.trim());
        const examplesArray = example ? [{ ja: word, en: example }] : [];

        const newVocab = {
            id: editingVocabId || `v_custom_${Date.now()}`,
            level: vocabLevel,
            lessonId: vocabLessonId,
            word,
            reading: kana,
            meanings: meaningsArray,
            examples: examplesArray
        };

        if (editingVocabId) {
            setVocabularies(prev => prev.map(v => v.id === editingVocabId ? newVocab : v));
            alert("Cập nhật từ vựng thành công (Lưu trên Local State)!");
        } else {
            setVocabularies(prev => [newVocab, ...prev]);
            alert("Thêm từ vựng mới thành công (Lưu trên Local State)!");
        }
        clearVocabForm();
    };

    const handleEditVocab = (v) => {
        setEditingVocabId(v.id);
        setWord(v.word);
        setKana(v.reading || v.kana || "");
        setMeaning(Array.isArray(v.meanings) ? v.meanings.join(', ') : (v.meaning || ""));
        let exText = "";
        if (v.examples && v.examples.length > 0) {
            exText = v.examples[0].en;
        } else {
            exText = v.example || "";
        }
        setExample(exText);
        setVocabLevel(v.level);
        setVocabLessonId(v.lessonId);
    };

    const handleDeleteVocab = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa từ vựng này không?")) {
            setVocabularies(prev => prev.filter(v => v.id !== id));
            alert("Xóa từ vựng thành công (Lưu trên Local State)!");
        }
    };

    const clearVocabForm = () => {
        setEditingVocabId(null);
        setWord("");
        setKana("");
        setMeaning("");
        setExample("");
        setVocabLevel("N5");
        if (lessons.length > 0) setVocabLessonId(lessons[0].id);
    };

    // --- XỬ LÝ LƯU/SỬA/XÓA USER ---
    const handleSaveUser = async (e) => {
        e.preventDefault();
        if (!userEmail || !userPassword || !userFullname) {
            alert("Vui lòng điền đầy đủ các thông tin bắt buộc!");
            return;
        }

        const userData = {
            email: userEmail,
            password: userPassword,
            fullname: userFullname,
            role: userRole
        };

        try {
            if (editingUserId) {
                // Cập nhật User qua API
                await axios.put(`http://localhost:9998/user/${editingUserId}`, userData);
                alert("Cập nhật thông tin người dùng thành công!");
            } else {
                // Kiểm tra email trùng
                const checkRes = await axios.get(`http://localhost:9998/user?email=${userEmail}`);
                if (checkRes.data.length > 0) {
                    alert("Email này đã tồn tại trong hệ thống!");
                    return;
                }
                // Thêm mới User
                await axios.post("http://localhost:9998/user", userData);
                alert("Tạo người dùng mới thành công!");
            }
            clearUserForm();
            fetchUsers();
        } catch (error) {
            console.error("Lỗi lưu người dùng:", error);
            alert("Đã xảy ra lỗi, vui lòng thử lại!");
        }
    };

    const handleEditUser = (u) => {
        setEditingUserId(u.id);
        setUserEmail(u.email);
        setUserPassword(u.password);
        setUserFullname(u.fullname);
        setUserRole(u.role);
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này không?")) {
            try {
                await axios.delete(`http://localhost:9998/user/${id}`);
                alert("Xóa tài khoản thành công!");
                fetchUsers();
            } catch (error) {
                console.error("Lỗi xóa người dùng:", error);
            }
        }
    };

    const clearUserForm = () => {
        setEditingUserId(null);
        setUserEmail("");
        setUserPassword("");
        setUserFullname("");
        setUserRole("customer");
    };

    // --- XỬ LÝ LƯU/SỬA/XÓA ĐỀ THI ---
    const handleSaveQuiz = (e) => {
        e.preventDefault();
        if (!quizQuestion || !quizOptA || !quizOptB || !quizOptC || !quizOptD || !quizAnswer) {
            alert("Vui lòng điền đầy đủ câu hỏi và các phương án trả lời!");
            return;
        }

        const newQuiz = {
            id: editingQuizId || `q_custom_${Date.now()}`,
            level: quizLevel,
            lessonId: quizLessonId,
            question: quizQuestion,
            options: [quizOptA, quizOptB, quizOptC, quizOptD],
            answer: quizAnswer
        };

        if (editingQuizId) {
            setQuizzesList(prev => prev.map(q => q.id === editingQuizId ? newQuiz : q));
            alert("Cập nhật câu hỏi thành công (Lưu trên Local State)!");
        } else {
            setQuizzesList(prev => [newQuiz, ...prev]);
            alert("Thêm câu hỏi mới thành công (Lưu trên Local State)!");
        }
        clearQuizForm();
    };

    const handleEditQuiz = (q) => {
        setEditingQuizId(q.id);
        setQuizQuestion(q.question);
        setQuizOptA(q.options[0] || "");
        setQuizOptB(q.options[1] || "");
        setQuizOptC(q.options[2] || "");
        setQuizOptD(q.options[3] || "");
        setQuizAnswer(q.answer);
        setQuizLevel(q.level);
        setQuizLessonId(q.lessonId);
    };

    const handleDeleteQuiz = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này không?")) {
            setQuizzesList(prev => prev.filter(q => q.id !== id));
            alert("Xóa câu hỏi thành công (Lưu trên Local State)!");
        }
    };

    const clearQuizForm = () => {
        setEditingQuizId(null);
        setQuizQuestion("");
        setQuizOptA("");
        setQuizOptB("");
        setQuizOptC("");
        setQuizOptD("");
        setQuizAnswer("");
        setQuizLevel("N5");
        if (lessons.length > 0) setQuizLessonId(lessons[0].id);
    };

    // --- BỘ LỌC DỮ LIỆU ---
    // Từ vựng
    let displayedVocabs = [...vocabularies];
    if (searchTerm) {
        displayedVocabs = displayedVocabs.filter(v => {
            const mStr = Array.isArray(v.meanings) ? v.meanings.join(', ') : (v.meaning || '');
            return v.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                mStr.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }

    // Người dùng
    let displayedUsers = [...usersList];
    if (userSearch) {
        displayedUsers = displayedUsers.filter(u =>
            u.fullname.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.email.toLowerCase().includes(userSearch.toLowerCase())
        );
    }

    // Đề thi
    let displayedQuizzes = [...quizzesList];
    if (quizSearch) {
        displayedQuizzes = displayedQuizzes.filter(q =>
            q.question.toLowerCase().includes(quizSearch.toLowerCase())
        );
    }

    return (
        <Container fluid className="mt-3">
            <Row className="py-2 mb-3 border-bottom align-items-center">
                <Col>
                    <h3 className="fw-bold text-danger"> Nihon CONTROL</h3>
                </Col>
                <Col className="text-end text-muted small">
                    Vai trò: <strong>Quản trị viên</strong>
                </Col>
            </Row>

            <Row>
                {/* Admin Menu Sidebar */}
                <Col md={3} className="border-end pt-3 bg-light rounded">
                    <h5 className="fw-bold mb-3 text-secondary">Danh mục quản lý</h5>
                    <ul className="nav flex-column mb-3" style={{ gap: "8px" }}>
                        <li className="nav-item">
                            <Button
                                variant={activeTab === "vocab" ? "danger" : "outline-secondary"}
                                className="w-100 text-start fw-bold text-white-hover"
                                onClick={() => setActiveTab("vocab")}
                            >
                                Quản Lý Từ Vựng
                            </Button>
                        </li>
                        <li className="nav-item">
                            <Button
                                variant={activeTab === "users" ? "danger" : "outline-secondary"}
                                className="w-100 text-start fw-bold text-white-hover"
                                onClick={() => setActiveTab("users")}
                            >
                                Quản Lý Người Dùng
                            </Button>
                        </li>
                        <li className="nav-item">
                            <Button
                                variant={activeTab === "quizzes" ? "danger" : "outline-secondary"}
                                className="w-100 text-start fw-bold text-white-hover"
                                onClick={() => setActiveTab("quizzes")}
                            >
                                Quản Lý Đề Thi JLPT
                            </Button>
                        </li>
                    </ul>
                    <hr />
                    <Link to="/home" className="btn btn-outline-secondary btn-sm w-100 fw-bold">
                        Quay lại Client
                    </Link>
                </Col>

                {/* Main Content Pane */}
                <Col md={9}>

                    {/* TAB 1: QUẢN LÝ TỪ VỰNG */}
                    {activeTab === "vocab" && (
                        <Row>
                            <Col lg={4} className="mb-4">
                                <div className="card shadow-sm border border-danger">
                                    <div className="card-header bg-danger text-white fw-bold">
                                        {editingVocabId ? "✏️ Sửa từ vựng" : "➕ Thêm từ vựng mới"}
                                    </div>
                                    <div className="card-body">
                                        <Form onSubmit={handleSaveVocab}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="small fw-bold">Từ vựng (Kanji) *</Form.Label>
                                                <Form.Control size="sm" type="text" value={word} onChange={e => setWord(e.target.value)} required placeholder="Vd: 私" />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="small fw-bold">Cách đọc (Kana) *</Form.Label>
                                                <Form.Control size="sm" type="text" value={kana} onChange={e => setKana(e.target.value)} placeholder="Vd: わたし" />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="small fw-bold">Nghĩa (Ngăn cách bằng dấu phẩy) *</Form.Label>
                                                <Form.Control size="sm" type="text" value={meaning} onChange={e => setMeaning(e.target.value)} required placeholder="Vd: Tôi, bản thân" />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="small fw-bold">Ví dụ dịch nghĩa</Form.Label>
                                                <Form.Control size="sm" as="textarea" rows={2} value={example} onChange={e => setExample(e.target.value)} placeholder="Vd: Tôi là học sinh" />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="small fw-bold">Trình độ</Form.Label>
                                                <Form.Select size="sm" value={vocabLevel} onChange={e => setVocabLevel(e.target.value)}>
                                                    <option value="N5">N5</option>
                                                    <option value="N4">N4</option>
                                                    <option value="N3">N3</option>
                                                    <option value="N2">N2</option>
                                                    <option value="N1">N1</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="small fw-bold">Bài học</Form.Label>
                                                <Form.Select size="sm" value={vocabLessonId} onChange={e => setVocabLessonId(e.target.value)}>
                                                    {lessons.filter(l => l.level === vocabLevel).map(l => (
                                                        <option key={l.id} value={l.id}>[{l.level}] {l.title}</option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                            <div className="d-flex gap-2">
                                                <Button type="submit" size="sm" variant="danger" className="fw-bold flex-grow-1 text-white">Lưu từ vựng</Button>
                                                {editingVocabId && <Button size="sm" variant="secondary" onClick={clearVocabForm}>Hủy</Button>}
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                            </Col>

                            <Col lg={8}>
                                <h4 className="fw-bold mb-3 text-secondary">Danh Sách Từ Vựng Hiện Tại</h4>
                                <div className="d-flex gap-3 mb-3">
                                    <Form.Control
                                        size="sm"
                                        type="text"
                                        placeholder="Tìm theo chữ hoặc Nghĩa..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        style={{ maxWidth: "250px" }}
                                    />
                                    <Form.Select
                                        size="sm"
                                        value={selectedLevel}
                                        onChange={e => setSelectedLevel(e.target.value)}
                                        style={{ maxWidth: "150px" }}
                                    >
                                        <option value="N5">Cấp độ N5</option>
                                        <option value="N4">Cấp độ N4</option>
                                        <option value="N3">Cấp độ N3</option>
                                        <option value="N2">Cấp độ N2</option>
                                        <option value="N1">Cấp độ N1</option>
                                    </Form.Select>
                                </div>

                                <div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto" }}>
                                    <Table bordered hover striped size="sm" className="align-middle bg-white">
                                        <thead className="table-dark text-center sticky-top">
                                            <tr>
                                                <th>Từ (Hán)</th>
                                                <th>Cách đọc</th>
                                                <th>Nghĩa</th>
                                                <th style={{ width: "120px" }}>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayedVocabs.map(v => (
                                                <tr key={v.id}>
                                                    <td className="fw-bold text-center" style={{ fontSize: "16px" }}>{v.word}</td>
                                                    <td className="text-danger text-center">{v.reading || v.kana}</td>
                                                    <td>{Array.isArray(v.meanings) ? v.meanings.join(', ') : v.meaning}</td>
                                                    <td className="text-center">
                                                        <Button size="sm" variant="outline-info" className="me-1 py-0 px-2" onClick={() => handleEditVocab(v)}>
                                                            Sửa
                                                        </Button>
                                                        <Button size="sm" variant="outline-danger" className="py-0 px-2" onClick={() => handleDeleteVocab(v.id)}>
                                                            Xóa
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {displayedVocabs.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="text-center text-muted py-3">Không có từ vựng nào khớp.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                    )}

                    {/* TAB 2: QUẢN LÝ NGƯỜI DÙNG */}
                    {activeTab === "users" && (
                        <Row>
                            <Col lg={4} className="mb-4">
                                <div className="card shadow-sm border border-danger">
                                    <div className="card-header bg-danger text-white fw-bold">
                                        {editingUserId ? "✏️ Sửa người dùng" : "➕ Tạo người dùng mới"}
                                    </div>
                                    <div className="card-body">
                                        <Form onSubmit={handleSaveUser}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="small fw-bold">Địa chỉ Email *</Form.Label>
                                                <Form.Control size="sm" type="email" value={userEmail} onChange={e => setUserEmail(e.target.value)} required placeholder="Vd: student@gmail.com" disabled={!!editingUserId} />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="small fw-bold">Mật khẩu *</Form.Label>
                                                <Form.Control size="sm" type="password" value={userPassword} onChange={e => setUserPassword(e.target.value)} required placeholder="Mật khẩu ít nhất 3 ký tự" />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="small fw-bold">Họ và tên *</Form.Label>
                                                <Form.Control size="sm" type="text" value={userFullname} onChange={e => setUserFullname(e.target.value)} required placeholder="Vd: Nguyễn Văn A" />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="small fw-bold">Vai trò trong hệ thống</Form.Label>
                                                <Form.Select size="sm" value={userRole} onChange={e => setUserRole(e.target.value)}>
                                                    <option value="customer">Học viên (Customer)</option>
                                                    <option value="admin">Quản trị viên (Admin)</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <div className="d-flex gap-2">
                                                <Button type="submit" size="sm" variant="danger" className="fw-bold flex-grow-1 text-white">Lưu thông tin</Button>
                                                {editingUserId && <Button size="sm" variant="secondary" onClick={clearUserForm}>Hủy</Button>}
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                            </Col>

                            <Col lg={8}>
                                <h4 className="fw-bold mb-3 text-secondary">Danh Sách Học Viên & Admin</h4>
                                <div className="mb-3">
                                    <Form.Control
                                        size="sm"
                                        type="text"
                                        placeholder="Tìm theo tên hoặc Email người dùng..."
                                        value={userSearch}
                                        onChange={e => setUserSearch(e.target.value)}
                                        style={{ maxWidth: "350px" }}
                                    />
                                </div>

                                <div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto" }}>
                                    <Table bordered hover striped size="sm" className="align-middle bg-white">
                                        <thead className="table-dark text-center sticky-top">
                                            <tr>
                                                <th>Họ và tên</th>
                                                <th>Email</th>
                                                <th>Vai trò</th>
                                                <th style={{ width: "120px" }}>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayedUsers.map(u => (
                                                <tr key={u.id}>
                                                    <td className="fw-semibold">{u.fullname}</td>
                                                    <td>{u.email}</td>
                                                    <td className="text-center">
                                                        <span className={`badge ${u.role === "admin" ? "bg-danger" : "bg-primary"}`}>
                                                            {u.role === "admin" ? "Admin" : "Học viên"}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <Button size="sm" variant="outline-primary" className="me-1 py-0 px-2" onClick={() => handleEditUser(u)}>
                                                            Sửa
                                                        </Button>
                                                        <Button size="sm" variant="outline-danger" className="py-0 px-2" onClick={() => handleDeleteUser(u.id)} disabled={u.email === "admin@gmail.com"}>
                                                            Xóa
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {displayedUsers.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="text-center text-muted py-3">Không có tài khoản nào khớp.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                    )}

                    {/* TAB 3: QUẢN LÝ ĐỀ THI JLPT */}
                    {activeTab === "quizzes" && (
                        <Row>
                            <Col lg={4} className="mb-4">
                                <div className="card shadow-sm border border-danger">
                                    <div className="card-header bg-danger text-white fw-bold">
                                        {editingQuizId ? "✏️ Sửa câu hỏi" : "➕ Thêm câu hỏi thi thử"}
                                    </div>
                                    <div className="card-body">
                                        <Form onSubmit={handleSaveQuiz}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="small fw-bold">Nội dung câu hỏi *</Form.Label>
                                                <Form.Control size="sm" as="textarea" rows={2} value={quizQuestion} onChange={e => setQuizQuestion(e.target.value)} required placeholder="Vd: Nghĩa của từ 「...」 là gì?" />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="small fw-bold">Đáp án A *</Form.Label>
                                                <Form.Control size="sm" type="text" value={quizOptA} onChange={e => setQuizOptA(e.target.value)} required placeholder="Nhập phương án A" />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="small fw-bold">Đáp án B *</Form.Label>
                                                <Form.Control size="sm" type="text" value={quizOptB} onChange={e => setQuizOptB(e.target.value)} required placeholder="Nhập phương án B" />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="small fw-bold">Đáp án C *</Form.Label>
                                                <Form.Control size="sm" type="text" value={quizOptC} onChange={e => setQuizOptC(e.target.value)} required placeholder="Nhập phương án C" />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="small fw-bold">Đáp án D *</Form.Label>
                                                <Form.Control size="sm" type="text" value={quizOptD} onChange={e => setQuizOptD(e.target.value)} required placeholder="Nhập phương án D" />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="small fw-bold">Đáp án đúng chính xác *</Form.Label>
                                                <Form.Control size="sm" type="text" value={quizAnswer} onChange={e => setQuizAnswer(e.target.value)} required placeholder="Phải khớp hoàn toàn với 1 trong 4 đáp án trên" />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="small fw-bold">Cấp độ thi thử</Form.Label>
                                                <Form.Select size="sm" value={quizLevel} onChange={e => setQuizLevel(e.target.value)}>
                                                    <option value="N5">N5</option>
                                                    <option value="N4">N4</option>
                                                    <option value="N3">N3</option>
                                                    <option value="N2">N2</option>
                                                    <option value="N1">N1</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="small fw-bold">Bài liên quan</Form.Label>
                                                <Form.Select size="sm" value={quizLessonId} onChange={e => setQuizLessonId(e.target.value)}>
                                                    {lessons.filter(l => l.level === quizLevel).map(l => (
                                                        <option key={l.id} value={l.id}>[{l.level}] {l.title}</option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                            <div className="d-flex gap-2">
                                                <Button type="submit" size="sm" variant="danger" className="fw-bold flex-grow-1 text-white">Lưu câu hỏi</Button>
                                                {editingQuizId && <Button size="sm" variant="secondary" onClick={clearQuizForm}>Hủy</Button>}
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                            </Col>

                            <Col lg={8}>
                                <h4 className="fw-bold mb-3 text-secondary">Kho Câu Hỏi Đang Sử Dụng</h4>
                                <div className="d-flex gap-3 mb-3">
                                    <Form.Control
                                        size="sm"
                                        type="text"
                                        placeholder="Tìm theo nội dung câu hỏi..."
                                        value={quizSearch}
                                        onChange={e => setQuizSearch(e.target.value)}
                                        style={{ maxWidth: "250px" }}
                                    />
                                    <Form.Select
                                        size="sm"
                                        value={selectedQuizLevel}
                                        onChange={e => setSelectedQuizLevel(e.target.value)}
                                        style={{ maxWidth: "150px" }}
                                    >
                                        <option value="N5">Cấp độ N5</option>
                                        <option value="N4">Cấp độ N4</option>
                                        <option value="N3">Cấp độ N3</option>
                                        <option value="N2">Cấp độ N2</option>
                                        <option value="N1">Cấp độ N1</option>
                                    </Form.Select>
                                </div>

                                <div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto" }}>
                                    <Table bordered hover striped size="sm" className="align-middle bg-white">
                                        <thead className="table-dark text-center sticky-top">
                                            <tr>
                                                <th>Nội dung câu hỏi</th>
                                                <th>Các tùy chọn</th>
                                                <th>Đáp án đúng</th>
                                                <th style={{ width: "120px" }}>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayedQuizzes.map(q => (
                                                <tr key={q.id}>
                                                    <td className="fw-semibold">{q.question}</td>
                                                    <td className="small">
                                                        <ol className="mb-0 ps-3">
                                                            {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
                                                        </ol>
                                                    </td>
                                                    <td className="text-success fw-bold text-center">{q.answer}</td>
                                                    <td className="text-center">
                                                        <Button size="sm" variant="outline-primary" className="me-1 py-0 px-2" onClick={() => handleEditQuiz(q)}>
                                                            Sửa
                                                        </Button>
                                                        <Button size="sm" variant="outline-danger" className="py-0 px-2" onClick={() => handleDeleteQuiz(q.id)}>
                                                            Xóa
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {displayedQuizzes.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="text-center text-muted py-3">Không có câu hỏi trắc nghiệm nào khớp.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>
        </Container>
    );
}
