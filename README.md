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

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

⚙️ File môi trường

```bash
📂 Cấu trúc thư mục
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
