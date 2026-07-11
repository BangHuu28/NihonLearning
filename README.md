# NihonLearning 🇯🇵
> **NihonLearning** là hệ thống học tiếng Nhật trực tuyến từ cấp độ N5 đến N1. Dự án tích hợp các công nghệ Front-End hiện đại, cung cấp phương pháp học từ vựng qua thẻ nhớ 3D sống động và hệ thống thi thử trắc nghiệm JLPT tính giờ thực tế.

---

## 🌟 Các Tính Năng Nổi Bật

### 1. Học Tập Phân Cấp (N5 - N1)
* Quản lý lộ trình học tập chia nhỏ theo từng bài học (Lesson) chuẩn JLPT.
* Tích hợp học Từ vựng, Hán tự chữ Kanji và Ngữ pháp chi tiết.

### 2. Thẻ Nhớ Từ Vựng Thông Minh (Flashcard 3D)
* Hiển thị thẻ từ vựng với hiệu ứng lật 3D mượt mà để tra cứu nghĩa.
* Tích hợp **Web Speech Synthesis API** tự động phát âm tiếng Nhật chuẩn bản xứ trực tiếp trên trình duyệt mà không cần tải dữ liệu âm thanh nặng.

### 3. Phòng Thi Thử JLPT Trực Tuyến
* Đề thi thử JLPT từ N5 đến N1 với cấu trúc 10 câu hỏi trắc nghiệm tính giờ.
* Nộp bài trực tuyến, hiển thị bảng kết quả và lời giải thích đáp án chi tiết.

### 4. Bảng Điều Khiển Quản Trị Viên (Admin Dashboard)
* Giao diện quản lý độc lập dành cho Admin chia tab sidebar hiện đại.
* **Quản lý Học viên (User CRUD)**: Thêm mới học viên, cập nhật thông tin, thay đổi mật khẩu và cấp quyền Admin/Customer kết nối database.
* **Quản lý Từ vựng (Vocab CRUD)**: Quản lý ngân hàng từ vựng theo cấp độ và bài học.
* **Quản lý Đề thi (Quiz CRUD)**: Cập nhật nội dung câu hỏi, các phương án lựa chọn và đáp án đúng.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)
* **Core**: ReactJS (v19), JavaScript (ES6+).
* **Build tool**: Vite (v8) — Biên dịch và chạy Hot Module Replacement siêu nhanh.
* **Styling**: Vanilla CSS, Bootstrap (v5), React Bootstrap.
* **Mock Backend / API**: JSON Server (cổng `9998`).
* **Kiểm lỗi tĩnh**: Oxlint (Kiểm lỗi siêu tốc viết bằng Rust).

---

## 📦 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Lập trình viên yêu cầu:
* Đã cài đặt [Node.js](https://nodejs.org/) (Khuyến nghị bản LTS).

### Các bước khởi chạy cục bộ:
1. Di chuyển vào thư mục dự án:
   ```bash
   cd Project/japanese_learning
   ```
2. Khởi chạy **Cơ sở dữ liệu (JSON Server)**:
   ```bash
   npm run server
   ```
   *(Server chạy tại địa chỉ: `http://localhost:9998`)*
3. Khởi chạy **Giao diện Web (Vite Dev Server)** ở một terminal khác:
   ```bash
   npm run dev
   ```
   *(Truy cập trình duyệt tại địa chỉ mặc định: `http://localhost:5173`)*

---

## 🔑 Tài Khoản Kiểm Thử Mặc Định
* **Tài khoản Admin**: `admin@gmail.com` / Mật khẩu: `123`
* **Tài khoản Học viên**: `student@gmail.com` / Mật khẩu: `123`
* **Tài khoản Thi thử**: `test@gmail.com` / Mật khẩu: `abc`
