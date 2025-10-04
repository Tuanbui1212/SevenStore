# 🛍️ SevenStore

Dự án **SevenStore** gồm **frontend (React)** và **backend (Node.js + Express)**, được chạy đồng thời bằng `concurrently`.

---

## 🚀 Cách cài đặt

Clone repo về:

```bash
git clone https://github.com/Tuanbui1212/SevenStore.git
cd SevenStore
```

Cài đặt dependencies cho toàn dự án:

```bash
npm install
```

Nếu cần, cài riêng cho từng phần:

```bash
cd backend && npm install
cd ../frontend && npm install
```

Cách chạy dự án

```bash
npm start
```

👉 Lệnh này sẽ chạy đồng thời:

- Backend: cd backend && npm start
- Frontend: cd frontend && npm start

Mặc định:

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

📦 Các thư viện chính sử dụng
🖥️ Frontend

React – Xây dựng giao diện người dùng

React Router DOM – Điều hướng giữa các trang

SCSS – Quản lý CSS có cấu trúc, dễ mở rộng

clsx – Gộp className động

Fetch API / Axios – Gửi request đến server

⚙️ Backend

Express.js – Xây dựng API server

Mongoose – Làm việc với MongoDB

Cors – Cho phép truy cập từ frontend

Dotenv – Đọc biến môi trường từ .env

Nodemon – Tự động reload server khi code thay đổi

Concurrently – Chạy backend & frontend cùng lúc

Morgan – Ghi log request HTTP phục vụ debug

📂 Cấu trúc thư mục

```bash
SevenStore/
│── backend/ # Node.js API
│── frontend/ # React UI
│── .gitignore
│── package.json
│── README.md
```

💻 Công nghệ sử dụng

Frontend: React, React Router, SCSS

Backend: Node.js, Express, MongoDB

Tool: concurrently, nodemon

✍️ Tác giả: Tuan Bui
