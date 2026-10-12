# HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY DỰ ÁN TRÊN MÁY LOCAL (XAMPP & NODE.JS)

Hệ thống Quản lý Vận chuyển & Giao nhận FastShip Logistics.

---

## 🛠 PHẦN MỀM CẦN CÓ
1. **Node.js**: Phiên bản 18.x, 20.x hoặc mới hơn ([Tải tại nodejs.org](https://nodejs.org/))
2. **XAMPP**: Chạy dịch vụ Apache & MySQL ([Tải tại apachefriends.org](https://www.apachefriends.org/))
3. **Trình soạn thảo mã nguồn**: Visual Studio Code (khuyên dùng)

---

## 🗄️ BƯỚC 1: CÀI ĐẶT CƠ SỞ DỮ LIỆU MYSQL TRÊN XAMPP

1. Mở ứng dụng **XAMPP Control Panel**.
2. Nhấn nút **Start** ở cả 2 module:
   - ✅ **Apache** (Cổng 80, 443)
   - ✅ **MySQL** (Cổng 3306)
3. Mở trình duyệt web và truy cập vào: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
4. Trên thanh menu trên cùng của phpMyAdmin, chọn thẻ **Import** (Nhập).
5. Nhấn **Choose File** (Chọn tệp) và tìm đến tệp:
   ```
   database/fastship_database.sql
   ```
   *(Hoặc tệp `fastship_database.sql` bạn tải từ nút "CSDL MySQL (.sql)" trên thanh công cụ của web).*
6. Cuộn xuống dưới cùng và nhấn nút **Import** (Thực hiện).
7. Hệ thống sẽ tự động tạo Database `fastship_db` gồm đầy đủ 11 bảng chuẩn quan hệ và dữ liệu mẫu thực tế.

---

## 💻 BƯỚC 2: CHẠY WEBSITE BẰNG NODE.JS TRÊN MÁY BẠN

1. Mở thư mục dự án này bằng **Terminal** (CMD hoặc PowerShell trên Windows, Terminal trên macOS/Linux):
   ```bash
   cd <duong_dan_thu_muc_du_an>
   ```

2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```

3. Khởi động máy chủ chạy web:
   ```bash
   npm run dev
   ```

4. Mở trình duyệt và truy cập vào địa chỉ:
   ```
   http://localhost:3000
   ```
   *(Nếu cổng 3000 bị bận, Vite sẽ hiển thị địa chỉ cổng thay thế trên Terminal, ví dụ http://localhost:5173).*

---

## 🔑 BƯỚC 3: TÀI KHOẢN ĐĂNG NHẬP MẪU

Khi màn hình Đăng Nhập hiển thị, bạn có thể:
- **Cách 1 (Nhanh nhất):** Chọn tab **"Tài Khoản Theo Vai Trò (1-Click)"** và bấm trực tiếp vào vai trò mong muốn để vào ngay.
- **Cách 2:** Nhập tài khoản và mật khẩu:
  - **Shop Yến Fashion:** `yen.fashion@shop.vn` / Mật khẩu: `123456`
  - **Quản Trị Viên (Admin):** `admin@fastship.vn` / Mật khẩu: `123456`
  - **Điều Phối Kho Tân Bình:** `hung.dieuphoi@fastship.vn` / Mật khẩu: `123456`
  - **Tài Xế Shipper:** `tuan.shipper@fastship.vn` / Mật khẩu: `123456`
  - **Khách Hàng:** `thutrang@gmail.com` / Mật khẩu: `123456`
