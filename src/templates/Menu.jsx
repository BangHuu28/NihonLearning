import { Link } from 'react-router-dom';

export default function Menu() {
    return (
        <nav className="site-nav">
            <div className="d-flex align-items-center" style={{ maxWidth: "1400px", margin: "0 auto" }}>
                <ul className="nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/home">Trang chủ</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/alphabet">Bảng chữ cái</Link>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link dropdown-toggle" style={{ cursor: "pointer" }}>
                            Học cấp độ
                        </span>
                        <div className="dropdown-menu-custom d-flex gap-2 px-2">
                            <Link className="badge bg-primary text-decoration-none text-white" to="/levels/N5">N5</Link>
                            <Link className="badge bg-success text-decoration-none text-white" to="/levels/N4">N4</Link>
                            <Link className="badge bg-info text-decoration-none text-white" to="/levels/N3">N3</Link>
                            <Link className="badge bg-warning text-decoration-none text-dark" to="/levels/N2">N2</Link>
                            <Link className="badge bg-danger text-decoration-none text-white" to="/levels/N1">N1</Link>
                        </div>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/flashcard">Flashcard</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/jlpt">Luyện thi JLPT</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
