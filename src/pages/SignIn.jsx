import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Aside from "../templates/Aside";

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msgError, setMsgError] = useState('');
    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            const response = await axios.get(`http://localhost:9998/user?email=${email}`);
            const users = response.data;
            if (users.length === 0 || users[0].password !== password) {
                setMsgError("Email hoặc mật khẩu không chính xác!");
            } else {
                const existUser = users[0];
                // Lưu dữ liệu đăng nhập
                localStorage.setItem(
                    'account',
                    JSON.stringify({
                        uId: existUser.id,
                        role: existUser.role,
                        name: existUser.fullname
                    })
                );
                // Điều hướng dựa trên vai trò
                if (existUser.role === "admin") {
                    navigate('/admin');
                } else {
                    navigate('/home');
                }
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            setMsgError("Kết nối server thất bại. Vui lòng thử lại!");
        }
    };

    return (
        <>
            <div className="col-md-9">
                <div className="card shadow-sm border p-4 m-auto" style={{ maxWidth: "500px" }}>
                    <h3 className="text-center fw-bold text-danger mb-4">🔑 ĐĂNG NHẬP HỌC VIÊN</h3>
                    {msgError && <div className='alert alert-danger'>{msgError}</div>}
                    <Form onSubmit={e => { e.preventDefault(); handleSignIn(); }}>
                        <Form.Group className='mb-3'>
                            <Form.Label className="fw-bold">Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Nhập email của bạn..."
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label className="fw-bold">Mật khẩu</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder="Nhập mật khẩu..."
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button
                            type="submit"
                            className='btn btn-danger w-100 fw-bold py-2 mt-3 text-white'
                        >
                            Đăng Nhập
                        </Button>
                    </Form>
                </div>
            </div>
            <Aside />
        </>
    );
}
