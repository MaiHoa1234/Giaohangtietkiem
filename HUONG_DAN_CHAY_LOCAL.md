# HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY DỰ ÁN TRÊN MÁY LOCAL (XAMPP & NODE.JS)

Hệ thống Quản lý Vận chuyển & Giao nhận FastShip Logistics ERP.

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
7. Hệ thống sẽ tự động tạo Database `fastship_db` gồm đầy đủ **13 bảng chuẩn quan hệ** và **hơn 100+ bản ghi dữ liệu thực tế** (bao gồm: `roles`, `warehouses`, `users`, `shops`, `shippers`, `post_office_staff`, `shipping_services`, `shipments`, `shipment_status_history`, `reconciliation_batches`, `shipper_cash_deposits`, `support_tickets`, `customer_addresses`).

---

## 💻 BƯỚC 2: CHẠY WEBSITE BẰNG NODE.JS TRÊN MÁY BẠN

1. Mở thư mục dự án này bằng **Terminal** (CMD, Git Bash hoặc PowerShell trên Windows, Terminal trên macOS/Linux):
   ```bash
   cd <duong_dan_thu_muc_du_an>
   ```

2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install --legacy-peer-deps
   ```
   *(Lưu ý: Thêm cờ `--legacy-peer-deps` để tránh lỗi xung đột phiên bản trên npm 11+).*

3. Khởi động máy chủ chạy web:
   ```bash
   npm run dev
   ```

4. Mở trình duyệt và truy cập vào địa chỉ:
   ```
   http://localhost:3000
   ```
   *(Nếu cổng 3000 bị bận, Vite sẽ hiển thị cổng thay thế trên Terminal, ví dụ http://localhost:5173).*

---

## 🔑 BƯỚC 3: TÀI KHOẢN ĐĂNG NHẬP THỰC TẾ TRONG HỆ THỐNG

Tất cả tài khoản đều đã được tạo sẵn trong CSDL MySQL và hệ thống với mật khẩu mặc định: `123456`

1. **Quản Trị Viên Hệ Thống (Admin Toàn Quyền):**
   - Tài khoản / Email: `admin@fastship.vn` (hoặc `admin_quan`)
   - Mật khẩu: `123456`
   - Quyền hạn: Xem báo cáo toàn quốc, cấu hình cước phí, quản lý bưu cục, thêm trưởng bưu cục, nhân viên và shipper.

2. **Trưởng Bưu Cục Tân Bình (Quản lý chi nhánh):**
   - Tài khoản / Email: `hung.dieuphoi@fastship.vn` (hoặc `manager_hung`)
   - Mật khẩu: `123456`
   - Quyền hạn: Quản lý hoạt động bưu cục, thêm nhân viên, thêm shipper, điều phối hàng tồn và kiểm tra quỹ COD.

3. **Nhân Viên Giao Dịch & Quầy Kho:**
   - Tài khoản / Email: `duyen.staff@fastship.vn` (hoặc `staff_duyen`)
   - Mật khẩu: `123456`
   - Quyền hạn: Tiếp nhận đơn tại quầy, kiểm đếm hàng hóa, thu tiền nộp từ shipper.

4. **Tài Xế Giao Hàng Shipper:**
   - Tài khoản / Email: `tuan.shipper@fastship.vn` (hoặc `shipper_tuan`)
   - Mật khẩu: `123456`
   - Quyền hạn: Nhận đơn giao, cập nhật trạng thái phát hàng thành công/thất bại, nộp tiền mặt COD.

5. **Chủ Cửa Hàng (Shop Yến Fashion):**
   - Tài khoản / Email: `yen.fashion@shop.vn` (hoặc `shop_yen`)
   - Mật khẩu: `123456`
   - Quyền hạn: Tạo đơn hàng loạt qua Excel, in phiếu A6 mã vạch, theo dõi đối soát và rút tiền COD.

6. **Khách Hàng Cá Nhân:**
   - Tài khoản / Email: `thutrang@gmail.com` (hoặc `khach_trang`)
   - Mật khẩu: `123456`
   - Quyền hạn: Gửi hàng lẻ, tra cứu vận đơn trực tiếp, gửi khiếu nại.
