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

Backend: cd backend && npm start

Frontend: cd frontend && npm start

Mặc định:

Backend: http://localhost:5000

Frontend: http://localhost:3000

⚙️ File môi trường

Tạo file .env trong thư mục backend (dựa theo .env.example nếu có):

PORT=5000
MONGODB_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_secret_key

📂 Cấu trúc thư mục
SevenStore/
│── backend/ # Node.js API
│── frontend/ # React UI
│── .gitignore
│── package.json
│── README.md

💻 Công nghệ sử dụng

Frontend: React, React Router, SCSS

Backend: Node.js, Express, MongoDB

Tool: concurrently, nodemon

✍️ Tác giả: Tuan Bui

---

✅ Khi bạn push file này lên GitHub, nó sẽ tự động hiển thị đẹp như một **trang hướng dẫn chạy dự án**, có định dạng rõ ràng, code màu xanh, liên kết nhấp được.

Bạn muốn mình giúp tạo luôn **file `.env.example` mẫu** để thêm vào thư mục `backend/` cho người khác dễ dùng
