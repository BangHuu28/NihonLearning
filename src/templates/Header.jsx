import { Link, useNavigate } from "react-router-dom";

export default function Header() {
    const existAccount = localStorage.getItem("account");
    const account = existAccount ? JSON.parse(existAccount) : null;
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem("account");
        navigate('/home');
    };

    return (
        <header className="site-header">
            <div className="d-flex align-items-center justify-content-between" style={{ maxWidth: "1400px", margin: "0 auto" }}>
                <Link to="/home" className="text-decoration-none d-flex align-items-center gap-2">
                    <span className="fs-4 fw-bold" style={{ color: "#faf9f6", letterSpacing: "-0.02em" }}>NihonLearning</span>
                    <span className="badge fw-medium" style={{ fontSize: "11px", background: "rgba(107,130,116,0.85)", color: "white" }}>N5-N1</span>
                </Link>
                <div>
                    {account ? (
                        <div className="d-flex align-items-center gap-2">
                            <span className="small" style={{ color: "rgba(248,247,244,0.7)" }}>Chào, <strong style={{ color: "#faf9f6" }}>{account.name}</strong></span>
                            {account.role === "admin" && (
                                <Link to="/admin" className="btn btn-warning btn-sm">Admin</Link>
                            )}
                            <button onClick={handleSignOut} className="btn btn-outline-light btn-sm">
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <div className="d-flex gap-2">
                            <Link to="/signin" className="btn btn-outline-light btn-sm">Đăng nhập</Link>
                            <Link to="/signup" className="btn btn-light btn-sm fw-bold">Đăng ký</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
