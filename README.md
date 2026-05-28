# SevenStore

Nền tảng thương mại điện tử full-stack xây dựng bằng **React**, **Node.js/Express** và **MongoDB**. Hỗ trợ mua hàng, thanh toán qua VNPay, quản lý đơn hàng và dashboard quản trị dành cho nhân viên.

**Demo:** [seven-store-steel.vercel.app](https://seven-store-steel.vercel.app)

---

## Tính năng

- Duyệt và tìm kiếm sản phẩm theo thương hiệu, màu sắc, giá
- Giỏ hàng và đặt hàng trực tuyến
- Thanh toán qua **VNPay**
- Xác thực người dùng bằng **JWT** (phân quyền customer / employee)
- Quản lý mã khuyến mãi (giảm theo số tiền hoặc phần trăm)
- Dashboard quản trị: đơn hàng, sản phẩm, khách hàng, nhân viên
- Upload ảnh sản phẩm qua **ImageKit**

---

## Tech Stack

| Phần | Công nghệ |
|---|---|
| Frontend | React 19, React Router DOM 7, Sass/SCSS, Axios, jwt-decode, clsx |
| Backend | Node.js, Express 5, Mongoose 8, JWT, Multer, ImageKit, Morgan |
| Database | MongoDB Atlas |
| Deploy | Vercel (frontend + backend) |
| Dev tools | Nodemon, Concurrently, Dotenv |

---

## Cấu trúc thư mục

```
SevenStore/
├── backend/
│   ├── src/
│   │   ├── app/          # Models & Controllers
│   │   ├── config/       # Kết nối database
│   │   ├── routes/       # Định nghĩa API routes
│   │   └── util/         # Tiện ích (VNPay service, ...)
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # UI components dùng chung
│   │   ├── pages/        # Các trang
│   │   ├── routes/       # Cấu hình route (public / private)
│   │   └── util/         # Tiện ích frontend
│   ├── .env.development
│   ├── .env.production
│   └── package.json
├── package.json           # Root script chạy cả hai
└── README.md
```

---

## Cài đặt & Chạy dự án

### Yêu cầu

- Node.js >= 18
- Tài khoản MongoDB Atlas
- Tài khoản ImageKit (cho upload ảnh)

### 1. Clone repo

```bash
git clone https://github.com/Tuanbui1212/SevenStore.git
cd SevenStore
```

### 2. Cài đặt dependencies

```bash
# Cài dependencies gốc
npm install

# Cài cho backend
cd backend && npm install

# Cài cho frontend
cd ../frontend && npm install
```

### 3. Cấu hình biến môi trường

Tạo file `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
```

Tạo file `frontend/.env.development`:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_IMGBB_API_KEY=your_imgbb_api_key
REACT_APP_PUBLIC_KEY=your_imagekit_public_key
```

### 4. Chạy dự án

```bash
# Từ thư mục gốc — chạy đồng thời frontend & backend
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |

---

## API Routes

| Prefix | Mô tả |
|---|---|
| `GET/POST /product/*` | Danh sách và chi tiết sản phẩm |
| `POST /account/*` | Đăng ký, đăng nhập |
| `GET/POST /cart/*` | Giỏ hàng |
| `POST /payment/*` | Tạo link thanh toán VNPay |
| `GET /my-orders/*` | Lịch sử đơn hàng |
| `/dashboard/*` | Quản trị (yêu cầu quyền employee) |

---

## Database Models

| Model | Mô tả |
|---|---|
| `Account` | Tài khoản người dùng, chứa giỏ hàng nhúng |
| `Product` | Sản phẩm, thương hiệu, giá, ảnh, slug |
| `Order` | Đơn hàng, thông tin giao hàng, trạng thái |
| `Customer` | Hồ sơ khách hàng |
| `Employee` | Hồ sơ nhân viên, phân quyền |
| `Promotion` | Mã khuyến mãi, điều kiện áp dụng |
| `PromotionUsage` | Lịch sử sử dụng mã khuyến mãi |

---

## Tác giả

**Tuan Bui** — [github.com/Tuanbui1212](https://github.com/Tuanbui1212)
