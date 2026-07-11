import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Aside from "../templates/Aside";

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [msgError, setMsgError] = useState([]);
    const navigate = useNavigate();

    const isValidData = () => {
        const errors = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.length === 0) {
            errors.push("Email không được để trống");
        } else if (!emailRegex.test(email)) {
            errors.push("Định dạng Email không hợp lệ");
        }

        if (password.length === 0) {
            errors.push("Mật khẩu không được để trống");
        } else if (password.length < 3) {
            errors.push("Mật khẩu phải dài tối thiểu 3 ký tự");
        }

        if (fullname.length === 0) {
            errors.push("Họ tên không được để trống");
        }

        setMsgError(errors);
        return errors.length === 0;
    };

    const handleSignUp = async () => {
        if (isValidData()) {
            try {
                // Kiểm tra email trùng trước
                const checkRes = await axios.get(`http://localhost:9998/user?email=${email}`);
                if (checkRes.data.length > 0) {
                    setMsgError(["Email đã được đăng ký trong hệ thống!"]);
                    return;
                }

                // Gửi dữ liệu đăng ký lên server
                await axios.post(`http://localhost:9998/user`, {
                    email,
                    password,
                    fullname,
                    role: "customer"
                });

                // Đi tới trang đăng nhập
                navigate('/signin');
            } catch (error) {
                console.error("Lỗi đăng ký:", error);
                setMsgError(["Kết nối server thất bại. Vui lòng thử lại!"]);
            }
        }
    };

    return (
        <>
            <div className="col-md-9">
                <div className="card p-4 m-auto" style={{ maxWidth: "460px", borderTop: "3px solid var(--jp-accent)" }}>
                    <h3 className="text-center fw-bold mb-4" style={{ color: "var(--jp-text-primary)", letterSpacing: "-0.02em" }}>Đăng Ký Học Viên Mới</h3>
                    {msgError.length > 0 && (
                        <div className="alert alert-danger py-2">
                            <ul className="mb-0 ps-3">
                                {msgError.map((err, idx) => <li key={idx}>{err}</li>)}
                            </ul>
                        </div>
                    )}
                    <Form onSubmit={e => { e.preventDefault(); handleSignUp(); }}>
                        <Form.Group className='mb-3'>
                            <Form.Label className="fw-bold" style={{ fontSize: "14px", color: "var(--jp-text-secondary)" }}>Email *</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Nhập địa chỉ email..."
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label className="fw-bold" style={{ fontSize: "14px", color: "var(--jp-text-secondary)" }}>Mật khẩu *</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder="Nhập mật khẩu của bạn..."
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label className="fw-bold" style={{ fontSize: "14px", color: "var(--jp-text-secondary)" }}>Họ và tên *</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập họ tên đầy đủ..."
                                value={fullname}
                                onChange={e => setFullname(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button
                            type="submit"
                            className='btn btn-danger w-100 fw-bold py-2 mt-3 text-white'
                        >
                            Đăng Ký Tài Khoản
                        </Button>
                    </Form>
                </div>
            </div>
            <Aside />
        </>
    );
}
