-- ==============================================================================
-- HỆ THỐNG QUẢN LÝ VẬN CHUYỂN & GIAO HÀNG TOÀN QUỐC (FASTSHIP LOGISTICS ERP)
-- CƠ SỞ DỮ LIỆU CHUẨN QUAN HỆ MYSQL - DÀNH CHO XAMPP (phpMyAdmin) HOẶC MYSQL SERVER
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS `fastship_db`;
CREATE DATABASE `fastship_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `fastship_db`;

-- ------------------------------------------------------------------------------
-- 1. BẢNG VAI TRÒ NGƯỜI DÙNG (roles)
-- ------------------------------------------------------------------------------
CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_code` VARCHAR(50) NOT NULL UNIQUE,
  `role_name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`role_code`, `role_name`, `description`) VALUES
('ADMIN', 'Quản trị viên hệ thống', 'Toàn quyền kiểm tra toàn hệ thống, tạo bưu cục, thêm trưởng bưu cục, nhân viên, shipper, cấu hình giá'),
('POST_OFFICE_MANAGER', 'Trưởng bưu cục / Chi nhánh', 'Quản lý toàn bộ hoạt động bưu cục, thêm nhân viên, thêm shipper, điều phối luồng xe tải và tuyến phát'),
('DISPATCHER', 'Điều phối viên bưu cục', 'Phân công đơn hàng cho shipper, xuất nhập kho luồng tuyến, xử lý sự cố hàng chậm'),
('STAFF', 'Nhân viên giao dịch & Kho', 'Tiếp nhận đơn tại quầy, kiểm hàng, phân loại bưu phẩm, đóng bao tải trung chuyển'),
('SHIPPER', 'Tài xế giao nhận', 'Nhận tuyến phát, đi lấy hàng tại shop, giao tận tay khách, thu COD và nộp tiền mặt về bưu cục'),
('SHOP', 'Chủ cửa hàng (Merchant)', 'Tạo đơn hàng loạt, tải mẫu Excel, in phiếu gửi A6 chuẩn mã vạch, theo dõi đối soát tiền COD'),
('CUSTOMER', 'Khách hàng cá nhân', 'Tạo đơn gửi lẻ, tra cứu hành trình vận đơn trực tuyến, quản lý sổ địa chỉ, gửi yêu cầu hỗ trợ');

-- ------------------------------------------------------------------------------
-- 2. BẢNG KHO BÃI & BƯU CỤC (warehouses)
-- ------------------------------------------------------------------------------
CREATE TABLE `warehouses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `type` ENUM('CENTRAL_HUB', 'BRANCH_OFFICE') DEFAULT 'BRANCH_OFFICE',
  `address` VARCHAR(255) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `province` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `manager_name` VARCHAR(100) NOT NULL,
  `capacity` INT DEFAULT 10000,
  `current_stock` INT DEFAULT 0,
  `status` ENUM('ACTIVE', 'MAINTENANCE') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `warehouses` (`code`, `name`, `type`, `address`, `district`, `province`, `phone`, `manager_name`, `capacity`, `current_stock`) VALUES
('HUB-TB-HCM', 'Kho Tổng Miền Nam Tân Bình', 'CENTRAL_HUB', '102 Trường Chinh, Phường 12', 'Quận Tân Bình', 'TP. Hồ Chí Minh', '028.3812.9999', 'Trần Hùng', 25000, 3420),
('HUB-Q7-HCM', 'Bưu cục Quận 7 - Nam Sài Gòn', 'BRANCH_OFFICE', '45 Nguyễn Thị Thập, Tân Phú', 'Quận 7', 'TP. Hồ Chí Minh', '028.3775.1234', 'Lê Minh Khôi', 8000, 1150),
('HUB-BT-HCM', 'Bưu cục Bình Thạnh & Gò Vấp', 'BRANCH_OFFICE', '215 Bạch Đằng, Phường 15', 'Quận Bình Thạnh', 'TP. Hồ Chí Minh', '028.3514.8888', 'Vũ Hữu Tài', 7500, 890),
('HUB-LB-HN', 'Kho Tổng Miền Bắc Long Biên', 'CENTRAL_HUB', 'KCN Đài Tư, 386 Nguyễn Văn Linh', 'Quận Long Biên', 'TP. Hà Nội', '024.3982.5555', 'Nguyễn Văn Định', 30000, 4850),
('HUB-CG-HN', 'Bưu cục Cầu Giấy & Từ Liêm', 'BRANCH_OFFICE', '89 Duy Tân, Dịch Vọng Hậu', 'Quận Cầu Giấy', 'TP. Hà Nội', '024.3795.6677', 'Phạm Thu Hương', 9000, 1420),
('HUB-DD-HN', 'Bưu cục Đống Đa & Hoàn Kiếm', 'BRANCH_OFFICE', '142 Xã Đàn, Nam Đồng', 'Quận Đống Đa', 'TP. Hà Nội', '024.3572.3333', 'Hoàng Tuấn Anh', 8500, 980),
('HUB-LC-DN', 'Kho Tổng Miền Trung Liên Chiểu', 'CENTRAL_HUB', 'Đường số 3, KCN Hòa Khánh', 'Quận Liên Chiểu', 'TP. Đà Nẵng', '0236.3888.111', 'Huỳnh Bá Cường', 15000, 1620),
('HUB-HC-DN', 'Bưu cục Trung Tâm Hải Châu', 'BRANCH_OFFICE', '224 Nguyễn Văn Linh, Thạc Gián', 'Quận Hải Châu', 'TP. Đà Nẵng', '0236.3655.222', 'Ngô Đình Trí', 6000, 640),
('HUB-NK-CT', 'Bưu cục Miền Tây Ninh Kiều', 'BRANCH_OFFICE', '128 Đường 30 Tháng 4, Xuân Khánh', 'Quận Ninh Kiều', 'TP. Cần Thơ', '0292.3838.222', 'Đặng Quốc Toàn', 7000, 710),
('HUB-NQ-HP', 'Bưu cục Duyên Hải Ngô Quyền', 'BRANCH_OFFICE', '56 Lê Thánh Tông, Máy Tơ', 'Quận Ngô Quyền', 'TP. Hải Phòng', '0225.3855.999', 'Đỗ Minh Trí', 7500, 830),
('HUB-TA-BD', 'Bưu cục KCN Thuận An', 'BRANCH_OFFICE', '78 Đại lộ Bình Dương, Lái Thiêu', 'TP. Thuận An', 'Tỉnh Bình Dương', '0274.3789.111', 'Phan Khắc Huy', 9000, 1200),
('HUB-BH-DN', 'Bưu cục Đồng Nai - Biên Hòa', 'BRANCH_OFFICE', '15 Đồng Khởi, Tân Hiệp', 'TP. Biên Hòa', 'Tỉnh Đồng Nai', '0251.3899.222', 'Bùi Ngọc Sơn', 8500, 940);

-- ------------------------------------------------------------------------------
-- 3. BẢNG TÀI KHOẢN NGƯỜI DÙNG (users)
-- ------------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `role_code` VARCHAR(50) NOT NULL,
  `warehouse_id` INT NULL,
  `avatar_url` VARCHAR(255) NULL,
  `status` ENUM('ACTIVE', 'LOCKED') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_code`) REFERENCES `roles`(`role_code`) ON DELETE RESTRICT,
  FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`username`, `password_hash`, `full_name`, `phone`, `email`, `role_code`, `warehouse_id`, `avatar_url`) VALUES
-- Ban Giám Đốc & Admin Hệ Thống
('admin_quan', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Võ Minh Quân', '0909999999', 'admin@fastship.vn', 'ADMIN', NULL, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120'),
('admin_trang', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Trần Thị Mai Trang', '0908111222', 'trang.admin@fastship.vn', 'ADMIN', NULL, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120'),
('admin_long', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Lê Văn Long', '0903444555', 'long.admin@fastship.vn', 'ADMIN', NULL, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120'),

-- Trưởng Bưu Cục (POST_OFFICE_MANAGER)
('manager_hung', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Trần Hùng', '0903829102', 'hung.dieuphoi@fastship.vn', 'POST_OFFICE_MANAGER', 1, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120'),
('manager_khoi', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Lê Minh Khôi', '0918223344', 'khoi.manager@fastship.vn', 'POST_OFFICE_MANAGER', 2, 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120'),
('manager_dinh', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nguyễn Văn Định', '0933556677', 'dinh.manager@fastship.vn', 'POST_OFFICE_MANAGER', 4, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120'),
('manager_huong', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Phạm Thu Hương', '0944778899', 'huong.manager@fastship.vn', 'POST_OFFICE_MANAGER', 5, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120'),
('manager_cuong', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Huỳnh Bá Cường', '0988221100', 'cuong.manager@fastship.vn', 'POST_OFFICE_MANAGER', 7, 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120'),
('manager_toan', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Đặng Quốc Toàn', '0977334455', 'toan.manager@fastship.vn', 'POST_OFFICE_MANAGER', 9, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120'),
('manager_tri', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Đỗ Minh Trí', '0966443322', 'tri.manager@fastship.vn', 'POST_OFFICE_MANAGER', 10, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120'),

-- Điều Phối Viên & Nhân Viên Bưu Cục (STAFF & DISPATCHER)
('staff_tung', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nguyễn Thanh Tùng', '0901234111', 'tung.staff@fastship.vn', 'STAFF', 1, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'),
('staff_duyen', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Phan Mỹ Duyên', '0901234222', 'duyen.staff@fastship.vn', 'STAFF', 1, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120'),
('staff_kien', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Lê Văn Kiên', '0901234333', 'kien.staff@fastship.vn', 'STAFF', 5, 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120'),
('staff_lan', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Đặng Ngọc Lan', '0901234444', 'lan.staff@fastship.vn', 'STAFF', 2, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'),
('disp_nam', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Vũ Hoài Nam', '0901234555', 'nam.disp@fastship.vn', 'DISPATCHER', 4, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120'),

-- Đội Ngũ Shipper (Tài xế giao nhận)
('shipper_tuan', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nguyễn Văn Tuấn', '0971239845', 'tuan.shipper@fastship.vn', 'SHIPPER', 1, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120'),
('shipper_trong', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Trần Đình Trọng', '0938491029', 'trong.shipper@fastship.vn', 'SHIPPER', 1, 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120'),
('shipper_phuc', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Lê Hoàng Phúc', '0966451290', 'phuc.shipper@fastship.vn', 'SHIPPER', 5, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120'),
('shipper_nam', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Đoàn Nhật Nam', '0918736251', 'nam.shipper@fastship.vn', 'SHIPPER', 8, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120'),
('shipper_thang', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Phạm Đức Thắng', '0981122334', 'thang.shipper@fastship.vn', 'SHIPPER', 2, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120'),
('shipper_huy', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Đỗ Gia Huy', '0977889900', 'huy.shipper@fastship.vn', 'SHIPPER', 6, 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120'),
('shipper_phong', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Vũ Văn Phong', '0933445566', 'phong.shipper@fastship.vn', 'SHIPPER', 9, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'),
('shipper_dat', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bùi Tiến Đạt', '0966554433', 'dat.shipper@fastship.vn', 'SHIPPER', 10, 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120'),

-- Chủ Cửa Hàng (Shops / Merchants)
('shop_yen', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Lê Hoàng Yến', '0988776655', 'yen.fashion@shop.vn', 'SHOP', NULL, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'),
('shop_techzone', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Trần Quốc Anh', '0919283746', 'sales@techzone.vn', 'SHOP', NULL, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120'),
('shop_thaomoc', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nguyễn Thu Thảo', '0934567890', 'contact@thaomocorganic.com', 'SHOP', NULL, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120'),
('shop_hungphat', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Phạm Văn Hưng', '0978990011', 'giadung@hungphat.vn', 'SHOP', NULL, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120'),
('shop_babyangel', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Hoàng Bảo Ngọc', '0966123456', 'cskh@babyangel.com', 'SHOP', NULL, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120'),
('shop_sneakerking', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Vũ Đình Minh', '0912998877', 'owner@sneakerking.vn', 'SHOP', NULL, 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120'),

-- Khách Hàng Cá Nhân (Customers)
('khach_trang', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nguyễn Thu Trang', '0912345678', 'thutrang@gmail.com', 'CUSTOMER', NULL, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120'),
('khach_minhanh', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Vũ Minh Anh', '0943920192', 'minhanh.vu@gmail.com', 'CUSTOMER', NULL, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120'),
('khach_quocbao', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Hoàng Quốc Bảo', '0979888999', 'quocbao.hoang@gmail.com', 'CUSTOMER', NULL, 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120'),
('khach_thuydung', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Đặng Thùy Dung', '0908112233', 'thuydung.dang@gmail.com', 'CUSTOMER', NULL, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120'),
('khach_anhtuan', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Phan Anh Tuấn', '0966778899', 'anhtuan.phan@gmail.com', 'CUSTOMER', NULL, 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=120'),
('khach_thanhtruc', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ngô Thanh Trúc', '0933112244', 'thanhtruc.ngo@gmail.com', 'CUSTOMER', NULL, 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=120');

-- ------------------------------------------------------------------------------
-- 4. BẢNG THÔNG TIN SHOP (shops)
-- ------------------------------------------------------------------------------
CREATE TABLE `shops` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `shop_name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `pickup_address` VARCHAR(255) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `province` VARCHAR(100) NOT NULL,
  `bank_account` VARCHAR(50) NOT NULL,
  `bank_name` VARCHAR(100) NOT NULL,
  `tax_code` VARCHAR(50) NULL,
  `rating` DECIMAL(3, 2) DEFAULT 5.00,
  `total_orders` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `shops` (`user_id`, `shop_name`, `phone`, `pickup_address`, `district`, `province`, `bank_account`, `bank_name`, `tax_code`, `rating`, `total_orders`) VALUES
(24, 'Yến Fashion Official Store', '0988776655', '48/12 Cộng Hòa, Phường 4', 'Quận Tân Bình', 'TP. Hồ Chí Minh', '19038291029012', 'Techcombank - CN Tân Bình', '0315891234', 4.95, 1420),
(25, 'TechZone Phụ Kiện Chính Hãng', '0919283746', '18 Phạm Hùng, Mỹ Đình 2', 'Quận Nam Từ Liêm', 'TP. Hà Nội', '0011004829101', 'Vietcombank - Sở Giao Dịch', '0108923456', 4.90, 980),
(26, 'Thảo Mộc Organic Cosmetics', '0934567890', '152 Hai Bà Trưng, Đa Kao', 'Quận 1', 'TP. Hồ Chí Minh', '102839281928', 'MBBank - CN Sài Gòn', '0316789012', 4.85, 650),
(27, 'Gia Dụng Thông Minh Hưng Phát', '0978990011', '89 Duy Tân, Dịch Vọng Hậu', 'Quận Cầu Giấy', 'TP. Hà Nội', '19134567890123', 'Techcombank - CN Cầu Giấy', '0109123890', 4.80, 810),
(28, 'Baby Angel Quần Áo Trẻ Em', '0966123456', '320 Cách Mạng Tháng 8, Phường 10', 'Quận 3', 'TP. Hồ Chí Minh', '0441000678912', 'Vietcombank - CN Tân Định', '0317894561', 4.92, 540),
(29, 'Sneaker King Giày Thể Thao', '0912998877', '74 Nguyễn Văn Trỗi, Phường 8', 'Quận Phú Nhuận', 'TP. Hồ Chí Minh', '2221000123456', 'BIDV - CN Gia Định', '0318901234', 4.88, 730);

-- ------------------------------------------------------------------------------
-- 5. BẢNG TÀI XẾ SHIPPER (shippers)
-- ------------------------------------------------------------------------------
CREATE TABLE `shippers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `warehouse_id` INT NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `vehicle_plate` VARCHAR(20) NOT NULL,
  `assigned_area` VARCHAR(150) NOT NULL,
  `rating` DECIMAL(3, 2) DEFAULT 5.00,
  `cash_in_hand` DECIMAL(12, 2) DEFAULT 0,
  `active_orders_count` INT DEFAULT 0,
  `completed_orders_count` INT DEFAULT 0,
  `status` ENUM('ACTIVE', 'ON_DELIVERY', 'OFFLINE') DEFAULT 'ACTIVE',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `shippers` (`user_id`, `warehouse_id`, `full_name`, `phone`, `vehicle_plate`, `assigned_area`, `rating`, `cash_in_hand`, `active_orders_count`, `completed_orders_count`, `status`) VALUES
(16, 1, 'Nguyễn Văn Tuấn', '0971239845', '59P2-839.12', 'Quận Tân Bình & Phú Nhuận (HCM)', 4.90, 1350000.00, 4, 342, 'ON_DELIVERY'),
(17, 1, 'Trần Đình Trọng', '0938491029', '59T1-192.83', 'Quận 1 & Quận 3 (HCM)', 4.85, 2490000.00, 3, 418, 'ON_DELIVERY'),
(18, 5, 'Lê Hoàng Phúc', '0966451290', '29E2-441.90', 'Quận Cầu Giấy & Nam Từ Liêm (HN)', 4.95, 890000.00, 5, 276, 'ON_DELIVERY'),
(19, 8, 'Đoàn Nhật Nam', '0918736251', '43C1-901.22', 'Quận Hải Châu & Thanh Khê (Đà Nẵng)', 4.75, 450000.00, 2, 198, 'ACTIVE'),
(20, 2, 'Phạm Đức Thắng', '0981122334', '59V2-667.89', 'Quận 7 & Nhà Bè (HCM)', 4.88, 1720000.00, 4, 215, 'ON_DELIVERY'),
(21, 6, 'Đỗ Gia Huy', '0977889900', '29B1-889.34', 'Quận Đống Đa & Hoàn Kiếm (HN)', 4.82, 1100000.00, 3, 189, 'ACTIVE'),
(22, 9, 'Vũ Văn Phong', '0933445566', '65B2-334.56', 'Quận Ninh Kiều & Cái Răng (Cần Thơ)', 4.78, 620000.00, 2, 142, 'ACTIVE'),
(23, 10, 'Bùi Tiến Đạt', '0966554433', '15A1-998.12', 'Quận Ngô Quyền & Hồng Bàng (Hải Phòng)', 4.91, 950000.00, 3, 167, 'ON_DELIVERY');

-- ------------------------------------------------------------------------------
-- 6. BẢNG NHÂN VIÊN BƯU CỤC (post_office_staff)
-- ------------------------------------------------------------------------------
CREATE TABLE `post_office_staff` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `warehouse_id` INT NOT NULL,
  `staff_code` VARCHAR(50) NOT NULL UNIQUE,
  `position` VARCHAR(100) NOT NULL,
  `shift` ENUM('MORNING', 'AFTERNOON', 'NIGHT', 'FULLTIME') DEFAULT 'FULLTIME',
  `hire_date` DATE NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `post_office_staff` (`user_id`, `warehouse_id`, `staff_code`, `position`, `shift`, `hire_date`) VALUES
(11, 1, 'STF-TB-01', 'Nhân viên kiểm hàng & Nhập kho', 'MORNING', '2024-03-15'),
(12, 1, 'STF-TB-02', 'Giao dịch viên quầy & CSKH', 'FULLTIME', '2024-05-20'),
(13, 5, 'STF-CG-01', 'Nhân viên đóng gói & Phân tuyến', 'FULLTIME', '2023-11-10'),
(14, 2, 'STF-Q7-01', 'Giao dịch viên tiếp nhận đơn', 'AFTERNOON', '2024-08-01'),
(15, 4, 'STF-LB-01', 'Điều phối viên xe tải đường trục', 'NIGHT', '2023-06-01');

-- ------------------------------------------------------------------------------
-- 7. BẢNG GÓI CƯỚC DỊCH VỤ (shipping_services)
-- ------------------------------------------------------------------------------
CREATE TABLE `shipping_services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `base_fee` DECIMAL(10, 2) NOT NULL,
  `per_kg_extra` DECIMAL(10, 2) NOT NULL,
  `multiplier` DECIMAL(3, 2) DEFAULT 1.00,
  `estimated_hours` INT NOT NULL,
  `description` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `shipping_services` (`code`, `name`, `base_fee`, `per_kg_extra`, `multiplier`, `estimated_hours`, `description`) VALUES
('STANDARD', 'Giao Tiết Kiệm (48h)', 22000.00, 5000.00, 1.00, 48, 'Phù hợp hàng hóa thông thường, tối ưu chi phí cước'),
('EXPRESS', 'Giao Nhanh (24h)', 22000.00, 5000.00, 1.50, 24, 'Giao trong ngày hoặc sáng hôm sau, ưu tiên luồng tải'),
('SUPER_FAST', 'Hỏa Tốc (2-4h)', 22000.00, 5000.00, 2.30, 4, 'Giao ngay nội thành qua đội xe chuyên trách trực 24/7'),
('SAVING_ECONOMY', 'Đường Bộ Liên Tỉnh (72h)', 18000.00, 3500.00, 0.85, 72, 'Dành cho kiện hàng lớn chuyển Bắc - Trung - Nam'),
('BULK_CARGO', 'Hàng Nặng & Cồng Kềnh', 35000.00, 4000.00, 1.20, 60, 'Trọng lượng trên 20kg hoặc quy đổi thể tích lớn');

-- ------------------------------------------------------------------------------
-- 8. BẢNG VẬN ĐƠN (shipments)
-- ------------------------------------------------------------------------------
CREATE TABLE `shipments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tracking_code` VARCHAR(50) NOT NULL UNIQUE,
  
  -- Thông tin người gửi
  `sender_name` VARCHAR(100) NOT NULL,
  `sender_phone` VARCHAR(20) NOT NULL,
  `sender_address` VARCHAR(255) NOT NULL,
  `sender_district` VARCHAR(100) NOT NULL,
  `sender_province` VARCHAR(100) NOT NULL,
  
  -- Thông tin người nhận
  `receiver_name` VARCHAR(100) NOT NULL,
  `receiver_phone` VARCHAR(20) NOT NULL,
  `receiver_address` VARCHAR(255) NOT NULL,
  `receiver_district` VARCHAR(100) NOT NULL,
  `receiver_province` VARCHAR(100) NOT NULL,
  
  -- Kiện hàng & Dịch vụ
  `item_description` VARCHAR(255) NOT NULL,
  `weight_kg` DECIMAL(6, 2) NOT NULL DEFAULT 0.50,
  `length_cm` INT DEFAULT 20,
  `width_cm` INT DEFAULT 15,
  `height_cm` INT DEFAULT 10,
  `service_type` VARCHAR(50) NOT NULL,
  `payer_type` ENUM('SENDER_PAY', 'RECEIVER_PAY') NOT NULL DEFAULT 'RECEIVER_PAY',
  
  -- Cước phí & Tiền thu hộ COD
  `cod_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  `shipping_fee` DECIMAL(10, 2) NOT NULL DEFAULT 22000,
  `insurance_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
  `total_fee` DECIMAL(10, 2) NOT NULL DEFAULT 22000,
  
  -- Vận hành bưu cục
  `status` ENUM(
    'PENDING', 'CONFIRMED', 'WAITING_PICKUP', 'PICKED_UP',
    'IN_TRANSIT', 'AT_WAREHOUSE', 'OUT_FOR_DELIVERY',
    'DELIVERY_FAILED', 'DELIVERED', 'RETURNING', 'RETURNED', 'CANCELLED'
  ) NOT NULL DEFAULT 'PENDING',
  
  `current_warehouse_id` INT NULL,
  `assigned_pickup_shipper_id` INT NULL,
  `assigned_delivery_shipper_id` INT NULL,
  `delivery_attempts` INT DEFAULT 0,
  `failure_reason` VARCHAR(255) NULL,
  `notes_for_shipper` VARCHAR(255) DEFAULT 'Cho xem hàng, không thử',
  `customer_rating` INT NULL,
  `customer_review` TEXT NULL,
  `shop_id` INT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estimated_delivery` DATETIME NULL,
  `delivered_at` DATETIME NULL,
  
  FOREIGN KEY (`current_warehouse_id`) REFERENCES `warehouses`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`assigned_pickup_shipper_id`) REFERENCES `shippers`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`assigned_delivery_shipper_id`) REFERENCES `shippers`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `shipments` (
  `tracking_code`, `sender_name`, `sender_phone`, `sender_address`, `sender_district`, `sender_province`,
  `receiver_name`, `receiver_phone`, `receiver_address`, `receiver_district`, `receiver_province`,
  `item_description`, `weight_kg`, `service_type`, `payer_type`, `cod_amount`, `shipping_fee`, `insurance_fee`, `total_fee`,
  `status`, `current_warehouse_id`, `assigned_delivery_shipper_id`, `delivery_attempts`, `notes_for_shipper`, `shop_id`, `created_at`, `delivered_at`
) VALUES
-- 1. Đã giao thành công
('FS-HCM-882910', 'Shop Yến Fashion', '0988776655', '48/12 Cộng Hòa', 'Quận Tân Bình', 'TP. Hồ Chí Minh', 'Vũ Minh Anh', '0943920192', '152 Hai Bà Trưng, Phường Đa Kao', 'Quận 1', 'TP. Hồ Chí Minh', 'Váy đầm hoa dáng dài phong cách Hàn Quốc', 0.50, 'EXPRESS', 'RECEIVER_PAY', 380000.00, 33000.00, 0, 33000.00, 'DELIVERED', 1, 2, 1, 'Cho khách xem hàng kỹ trước khi thanh toán', 1, '2026-10-09 08:30:00', '2026-10-10 10:45:00'),
('FS-HCM-942183', 'Shop Yến Fashion', '0988776655', '48/12 Cộng Hòa', 'Quận Tân Bình', 'TP. Hồ Chí Minh', 'Hoàng Quốc Bảo', '0979888999', '88 Phan Xích Long, Phường 2', 'Quận Phú Nhuận', 'TP. Hồ Chí Minh', 'Giày Sneaker Running Pro thể thao', 1.10, 'STANDARD', 'SENDER_PAY', 650000.00, 27000.00, 3250.00, 30250.00, 'DELIVERED', 1, 1, 1, 'Hàng dễ trầy xước, giao cẩn thận', 1, '2026-10-09 10:15:00', '2026-10-10 15:20:00'),
('FS-HN-552109', 'TechZone Phụ Kiện Chính Hãng', '0919283746', '18 Phạm Hùng, Mỹ Đình', 'Quận Nam Từ Liêm', 'TP. Hà Nội', 'Đặng Thùy Dung', '0908112233', '74 Nguyễn Văn Trỗi, Phường 8', 'Quận Phú Nhuận', 'TP. Hồ Chí Minh', 'Tai nghe Bluetooth True Wireless chống ồn ANC', 0.40, 'EXPRESS', 'RECEIVER_PAY', 1250000.00, 47000.00, 6250.00, 53250.00, 'DELIVERED', 1, 1, 1, 'Hàng điện tử giá trị cao, đồng kiểm cùng khách', 2, '2026-10-08 14:00:00', '2026-10-10 11:30:00'),
('FS-HCM-112233', 'Thảo Mộc Organic Cosmetics', '0934567890', '152 Hai Bà Trưng', 'Quận 1', 'TP. Hồ Chí Minh', 'Bùi Thu Hà', '0918223388', '45 Lê Duẩn, Bến Nghé', 'Quận 1', 'TP. Hồ Chí Minh', 'Bộ dưỡng ẩm serum trà xanh thiên nhiên', 0.60, 'SUPER_FAST', 'RECEIVER_PAY', 520000.00, 50600.00, 0, 50600.00, 'DELIVERED', 1, 2, 1, 'Giao trước 12h trưa', 3, '2026-10-11 08:00:00', '2026-10-11 11:15:00'),
('FS-HN-998877', 'Gia Dụng Thông Minh Hưng Phát', '0978990011', '89 Duy Tân', 'Quận Cầu Giấy', 'TP. Hà Nội', 'Đinh Khắc Huy', '0934556677', '180 Cầu Giấy, Quan Hoa', 'Quận Cầu Giấy', 'TP. Hà Nội', 'Nồi chiên không dầu điện tử 6.5 Lít', 4.50, 'STANDARD', 'RECEIVER_PAY', 1350000.00, 42000.00, 6750.00, 48750.00, 'DELIVERED', 5, 3, 1, 'Hàng nặng, có thang máy lên tầng 4', 4, '2026-10-09 11:00:00', '2026-10-10 16:30:00'),

-- 2. Đang đi phát tận tay khách (OUT_FOR_DELIVERY)
('FS-HCM-334455', 'Shop Yến Fashion', '0988776655', '48/12 Cộng Hòa', 'Quận Tân Bình', 'TP. Hồ Chí Minh', 'Trần Thị Thu Thảo', '0909123456', '258 Lê Văn Sỹ, Phường 14', 'Quận 3', 'TP. Hồ Chí Minh', 'Áo sơ mi lụa công sở cao cấp', 0.35, 'STANDARD', 'RECEIVER_PAY', 340000.00, 22000.00, 0, 22000.00, 'OUT_FOR_DELIVERY', 1, 2, 1, 'Gọi điện trước 15 phút khi đến', 1, '2026-10-11 08:30:00', NULL),
('FS-HCM-445566', 'Sneaker King Giày Thể Thao', '0912998877', '74 Nguyễn Văn Trỗi', 'Quận Phú Nhuận', 'TP. Hồ Chí Minh', 'Nguyễn Hữu Đạt', '0938221199', '12 Hoàng Hoa Thám, Phường 12', 'Quận Tân Bình', 'TP. Hồ Chí Minh', 'Giày Jordan Low Retro Panda', 1.20, 'EXPRESS', 'RECEIVER_PAY', 890000.00, 33000.00, 4450.00, 37450.00, 'OUT_FOR_DELIVERY', 1, 1, 1, 'Cho thử size giày tại chỗ', 6, '2026-10-11 09:15:00', NULL),
('FS-HN-771234', 'TechZone Phụ Kiện Chính Hãng', '0919283746', '18 Phạm Hùng', 'Quận Nam Từ Liêm', 'TP. Hà Nội', 'Phạm Minh Quang', '0977881122', '36 Hoàng Quốc Việt, Nghĩa Đô', 'Quận Cầu Giấy', 'TP. Hà Nội', 'Bàn phím cơ không dây Bluetooth RGB', 0.95, 'EXPRESS', 'RECEIVER_PAY', 980000.00, 33000.00, 4900.00, 37900.00, 'OUT_FOR_DELIVERY', 5, 3, 1, 'Cho cắm test cổng sạc', 2, '2026-10-11 08:45:00', NULL),
('FS-DN-883311', 'Baby Angel Quần Áo Trẻ Em', '0966123456', '320 CMT8', 'Quận 3', 'TP. Hồ Chí Minh', 'Lê Thị Mỹ Hạnh', '0905123789', '92 Hùng Vương, Hải Châu 1', 'Quận Hải Châu', 'TP. Đà Nẵng', 'Set đồ cotton sơ sinh cao cấp 5 món', 0.65, 'STANDARD', 'RECEIVER_PAY', 410000.00, 32000.00, 0, 32000.00, 'OUT_FOR_DELIVERY', 8, 4, 1, 'Giao giờ hành chính tại văn phòng', 5, '2026-10-10 10:00:00', NULL),

-- 3. Đang vận chuyển trung chuyển (IN_TRANSIT)
('FS-HN-667788', 'TechZone Phụ Kiện Chính Hãng', '0919283746', '18 Phạm Hùng', 'Quận Nam Từ Liêm', 'TP. Hà Nội', 'Mai Phương Thảo', '0945678123', '52 Nguyễn Thị Thập, Tân Hưng', 'Quận 7', 'TP. Hồ Chí Minh', 'Củ sạc nhanh GaN 65W Type-C 3 cổng', 0.40, 'EXPRESS', 'RECEIVER_PAY', 650000.00, 47000.00, 3250.00, 50250.00, 'IN_TRANSIT', 4, NULL, 0, 'Chuyển đường trục xe tải đêm HN-HCM', 2, '2026-10-11 11:30:00', NULL),
('FS-HCM-778899', 'Shop Yến Fashion', '0988776655', '48/12 Cộng Hòa', 'Quận Tân Bình', 'TP. Hồ Chí Minh', 'Ngô Quốc Khánh', '0913456789', '45 Lê Hồng Phong, Đông Khê', 'Quận Ngô Quyền', 'TP. Hải Phòng', 'Áo măng tô dạ dáng dài thu đông', 1.40, 'STANDARD', 'RECEIVER_PAY', 890000.00, 48000.00, 4450.00, 52450.00, 'IN_TRANSIT', 1, NULL, 0, 'Bọc nilon chống thấm nước cẩn thận', 1, '2026-10-11 10:00:00', NULL),
('FS-CT-440192', 'Gia Dụng Thông Minh Hưng Phát', '0978990011', '89 Duy Tân', 'Quận Cầu Giấy', 'TP. Hà Nội', 'Trịnh Bá Hưng', '0987654321', '68 Mậu Thân, An Hòa', 'Quận Ninh Kiều', 'TP. Cần Thơ', 'Máy hút bụi cầm tay không dây lực hút lớn', 1.80, 'SAVING_ECONOMY', 'RECEIVER_PAY', 790000.00, 42000.00, 3950.00, 45950.00, 'IN_TRANSIT', 4, NULL, 0, 'Giao trong 3 ngày tới', 4, '2026-10-10 15:45:00', NULL),

-- 4. Đang tại kho bưu cục phân luồng (AT_WAREHOUSE)
('FS-HCM-551920', 'Thảo Mộc Organic Cosmetics', '0934567890', '152 Hai Bà Trưng', 'Quận 1', 'TP. Hồ Chí Minh', 'Dương Thúy Nga', '0971234999', '18 Nguyễn Trãi, Phường 2', 'Quận 5', 'TP. Hồ Chí Minh', 'Kem chống nắng nâng tone kiềm dầu', 0.30, 'STANDARD', 'RECEIVER_PAY', 290000.00, 22000.00, 0, 22000.00, 'AT_WAREHOUSE', 1, NULL, 0, 'Chờ bưu cục Tân Bình bắn mã xuất luồng Q5', 3, '2026-10-11 14:00:00', NULL),
('FS-HN-334455', 'Baby Angel Quần Áo Trẻ Em', '0966123456', '320 CMT8', 'Quận 3', 'TP. Hồ Chí Minh', 'Vũ Quỳnh Chi', '0904556677', '12 Khâm Thiên, Thổ Quan', 'Quận Đống Đa', 'TP. Hà Nội', 'Váy công chúa voan cao cấp cho bé gái', 0.55, 'EXPRESS', 'RECEIVER_PAY', 450000.00, 47000.00, 0, 47000.00, 'AT_WAREHOUSE', 6, NULL, 0, 'Đã đến bưu cục Đống Đa, chuẩn bị chia shipper', 5, '2026-10-10 09:30:00', NULL),

-- 5. Đã lấy hàng thành công từ Shop (PICKED_UP)
('FS-HCM-201948', 'Shop Yến Fashion', '0988776655', '48/12 Cộng Hòa', 'Quận Tân Bình', 'TP. Hồ Chí Minh', 'Ngô Thanh Trúc', '0933112244', '12 Nguyễn Tri Phương, Phường 7', 'Quận 5', 'TP. Hồ Chí Minh', 'Áo khoác len Cardigan dệt kim mềm', 0.70, 'STANDARD', 'RECEIVER_PAY', 490000.00, 22000.00, 0, 22000.00, 'PICKED_UP', 1, NULL, 0, 'Shipper Tuấn đã lấy hàng, đang mang về kho Tân Bình', 1, '2026-10-11 15:20:00', NULL),
('FS-HN-112299', 'TechZone Phụ Kiện Chính Hãng', '0919283746', '18 Phạm Hùng', 'Quận Nam Từ Liêm', 'TP. Hà Nội', 'Lưu Quốc Toàn', '0912889911', '89 Nguyễn Trãi, Thượng Đình', 'Quận Thanh Xuân', 'TP. Hà Nội', 'Cáp sạc Type-C to Lightning chuẩn MFi', 0.15, 'STANDARD', 'RECEIVER_PAY', 180000.00, 22000.00, 0, 22000.00, 'PICKED_UP', 5, NULL, 0, 'Shipper Phúc đã lấy tại quầy Shop', 2, '2026-10-11 16:00:00', NULL),

-- 6. Chờ cử Shipper sang lấy hàng (WAITING_PICKUP)
('FS-HCM-667799', 'Sneaker King Giày Thể Thao', '0912998877', '74 Nguyễn Văn Trỗi', 'Quận Phú Nhuận', 'TP. Hồ Chí Minh', 'Chu Đình Trọng', '0979112233', '105 Nam Kỳ Khởi Nghĩa', 'Quận 1', 'TP. Hồ Chí Minh', 'Vớ tất thể thao cổ trang kháng khuẩn 5 đôi', 0.25, 'STANDARD', 'RECEIVER_PAY', 150000.00, 22000.00, 0, 22000.00, 'WAITING_PICKUP', 1, NULL, 0, 'Shop đóng gói xong, chờ shipper ghé lấy', 6, '2026-10-11 16:30:00', NULL),
('FS-HN-889900', 'Gia Dụng Thông Minh Hưng Phát', '0978990011', '89 Duy Tân', 'Quận Cầu Giấy', 'TP. Hà Nội', 'Phí Thùy Linh', '0983112244', '24 Nguyễn Chí Thanh', 'Quận Ba Đình', 'TP. Hà Nội', 'Bộ dao làm bếp inox 6 món phủ đá granite', 1.60, 'STANDARD', 'RECEIVER_PAY', 390000.00, 27000.00, 0, 27000.00, 'WAITING_PICKUP', 5, NULL, 0, 'Shop hẹn lấy trước 18h', 4, '2026-10-11 16:45:00', NULL),

-- 7. Giao hàng thất bại / Khách hẹn lại (DELIVERY_FAILED)
('FS-HCM-772819', 'Shop Yến Fashion', '0988776655', '48/12 Cộng Hòa', 'Quận Tân Bình', 'TP. Hồ Chí Minh', 'Phan Anh Tuấn', '0966778899', '320 Cách Mạng Tháng Tám, Phường 10', 'Quận 3', 'TP. Hồ Chí Minh', 'Set mỹ phẩm dưỡng da thiên nhiên trà xanh', 0.70, 'STANDARD', 'RECEIVER_PAY', 420000.00, 22000.00, 0, 22000.00, 'DELIVERY_FAILED', 1, 2, 1, 'Khách bận họp, hẹn shipper giao lại sau 18h', 1, '2026-10-11 11:00:00', NULL),
('FS-HN-443322', 'TechZone Phụ Kiện Chính Hãng', '0919283746', '18 Phạm Hùng', 'Quận Nam Từ Liêm', 'TP. Hà Nội', 'Trần Thu Ngân', '0936112255', '79 Láng Hạ, Thành Công', 'Quận Ba Đình', 'TP. Hà Nội', 'Đế sạc không dây nam châm MagSafe 15W', 0.35, 'EXPRESS', 'RECEIVER_PAY', 450000.00, 33000.00, 0, 33000.00, 'DELIVERY_FAILED', 6, 6, 1, 'Số máy bận 3 cuộc liên tiếp không nhấc máy', 2, '2026-10-11 13:40:00', NULL),

-- 8. Chuyển hoàn về cho Shop (RETURNING)
('FS-DN-119283', 'Shop Yến Fashion', '0988776655', '48/12 Cộng Hòa', 'Quận Tân Bình', 'TP. Hồ Chí Minh', 'Trương Bá Tùng', '0905998877', '182 Lê Duẩn, Thạch Thang', 'Quận Hải Châu', 'TP. Đà Nẵng', 'Quần Jean ống suông rách gối cá tính', 0.80, 'STANDARD', 'RECEIVER_PAY', 390000.00, 32000.00, 0, 32000.00, 'RETURNING', 8, 4, 3, 'Khách không đúng màu yêu cầu, từ chối nhận hàng', 1, '2026-10-07 10:00:00', NULL),

-- 9. Đơn hủy (CANCELLED)
('FS-HCM-990011', 'Thảo Mộc Organic Cosmetics', '0934567890', '152 Hai Bà Trưng', 'Quận 1', 'TP. Hồ Chí Minh', 'Đoàn Kim Oanh', '0917223344', '15 Trần Hưng Đạo', 'Quận 1', 'TP. Hồ Chí Minh', 'Tinh dầu xông phòng sả chanh nguyên chất', 0.20, 'STANDARD', 'RECEIVER_PAY', 160000.00, 22000.00, 0, 22000.00, 'CANCELLED', 1, NULL, 0, 'Người gửi chủ động bấm hủy đơn trước khi lấy', 3, '2026-10-11 14:10:00', NULL);

-- ------------------------------------------------------------------------------
-- 9. BẢNG NHẬT KÝ HÀNH TRÌNH VẬN ĐƠN (shipment_status_history)
-- ------------------------------------------------------------------------------
CREATE TABLE `shipment_status_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `shipment_id` INT NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `location` VARCHAR(150) NOT NULL,
  `note` TEXT NOT NULL,
  `actor` VARCHAR(100) NOT NULL,
  FOREIGN KEY (`shipment_id`) REFERENCES `shipments`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `shipment_status_history` (`shipment_id`, `status`, `timestamp`, `location`, `note`, `actor`) VALUES
-- Lịch sử cho đơn 1 (FS-HCM-882910)
(1, 'PENDING', '2026-10-09 08:30:00', 'Cổng Khách Hàng Online', 'Shop Yến Fashion khởi tạo đơn hàng qua cổng Web ERP', 'Shop Yến Fashion'),
(1, 'CONFIRMED', '2026-10-09 09:00:00', 'Bưu cục Tân Bình (TP.HCM)', 'Bưu cục tiếp nhận và duyệt đơn trên hệ thống', 'Phan Mỹ Duyên'),
(1, 'PICKED_UP', '2026-10-09 11:20:00', '48/12 Cộng Hòa, Q.Tân Bình', 'Shipper đã đến shop lấy hàng thành công', 'Nguyễn Văn Tuấn'),
(1, 'AT_WAREHOUSE', '2026-10-09 14:10:00', 'Kho Tổng Tân Bình', 'Kiện hàng nhập kho, quét mã Barcode phân tuyến phát Quận 1', 'Nguyễn Thanh Tùng'),
(1, 'OUT_FOR_DELIVERY', '2026-10-10 08:30:00', 'Bưu cục Quận 1 - Sài Gòn', 'Shipper nhận tuyến phát giao tận tay người nhận', 'Trần Đình Trọng'),
(1, 'DELIVERED', '2026-10-10 10:45:00', '152 Hai Bà Trưng, Quận 1', 'Giao hàng thành công! Thu tiền mặt COD 380.000đ từ khách Vũ Minh Anh', 'Trần Đình Trọng'),

-- Lịch sử cho đơn 2 (FS-HCM-942183)
(2, 'PENDING', '2026-10-09 10:15:00', 'Cổng Shop Yến', 'Tạo vận đơn từ tệp danh sách Excel', 'Shop Yến Fashion'),
(2, 'PICKED_UP', '2026-10-09 14:00:00', '48/12 Cộng Hòa, Q.Tân Bình', 'Lấy hàng thành công', 'Nguyễn Văn Tuấn'),
(2, 'AT_WAREHOUSE', '2026-10-09 16:30:00', 'Kho Tổng Tân Bình', 'Nhập kho, đóng túi vận chuyển Phú Nhuận', 'Trần Hùng'),
(2, 'OUT_FOR_DELIVERY', '2026-10-10 09:00:00', 'Bưu cục Phú Nhuận', 'Shipper đang trên đường giao hàng', 'Nguyễn Văn Tuấn'),
(2, 'DELIVERED', '2026-10-10 15:20:00', '88 Phan Xích Long, Q.Phú Nhuận', 'Khách Hoàng Quốc Bảo đã nhận và ký nhận hàng', 'Nguyễn Văn Tuấn'),

-- Lịch sử cho đơn 3 (FS-HN-552109)
(3, 'PENDING', '2026-10-08 14:00:00', 'TechZone HN', 'Đơn hàng tạo thành công trên hệ thống', 'TechZone'),
(3, 'PICKED_UP', '2026-10-08 16:30:00', '18 Phạm Hùng, Q.Nam Từ Liêm', 'Shipper đã nhận kiện tai nghe từ cửa hàng', 'Lê Hoàng Phúc'),
(3, 'AT_WAREHOUSE', '2026-10-08 18:45:00', 'Kho Tổng Long Biên (Hà Nội)', 'Nhập kho tổng miền Bắc, lập niêm phong bao tải liên tỉnh', 'Vũ Hoài Nam'),
(3, 'IN_TRANSIT', '2026-10-08 21:00:00', 'Đường trục QL1A', 'Xe container số hiệu 29C-881.23 xuất phát đi miền Nam', 'Điều Phối Xe Trục'),
(3, 'AT_WAREHOUSE', '2026-10-10 06:15:00', 'Kho Tổng Tân Bình (TP.HCM)', 'Xe cập bến miền Nam, bốc dỡ và chia chọn luồng phát Phú Nhuận', 'Nguyễn Thanh Tùng'),
(3, 'OUT_FOR_DELIVERY', '2026-10-10 09:30:00', 'Bưu cục Phú Nhuận (HCM)', 'Shipper Tuấn nhận hàng đi phát ca sáng', 'Nguyễn Văn Tuấn'),
(3, 'DELIVERED', '2026-10-10 11:30:00', '74 Nguyễn Văn Trỗi, Q.Phú Nhuận', 'Giao thành công! Khách Đặng Thùy Dung thanh toán COD 1.250.000đ', 'Nguyễn Văn Tuấn'),

-- Lịch sử cho đơn 6 (FS-HCM-334455)
(6, 'PENDING', '2026-10-11 08:30:00', 'Cổng Khách Hàng', 'Đơn hàng được khởi tạo thành công', 'Shop Yến'),
(6, 'PICKED_UP', '2026-10-11 10:00:00', '48/12 Cộng Hòa, Q.Tân Bình', 'Shipper đã lấy áo sơ mi tại shop', 'Trần Đình Trọng'),
(6, 'AT_WAREHOUSE', '2026-10-11 11:30:00', 'Bưu cục Quận 3', 'Bưu cục phân tuyến phát đường Lê Văn Sỹ', 'Vũ Hữu Tài'),
(6, 'OUT_FOR_DELIVERY', '2026-10-11 14:00:00', 'Đường Lê Văn Sỹ, Q.3', 'Shipper Trọng đang giao tận nơi, dự kiến đến trước 16h', 'Trần Đình Trọng'),

-- Lịch sử cho đơn 19 (FS-HCM-772819 - Giao thất bại)
(19, 'PENDING', '2026-10-10 09:00:00', 'Shop Yến', 'Khởi tạo đơn hàng', 'Shop Yến'),
(19, 'PICKED_UP', '2026-10-10 11:30:00', 'Shop Yến Tân Bình', 'Lấy hàng thành công', 'Trần Đình Trọng'),
(19, 'OUT_FOR_DELIVERY', '2026-10-11 10:15:00', '320 CMT8, Q.3', 'Shipper liên hệ giao hàng', 'Trần Đình Trọng'),
(19, 'DELIVERY_FAILED', '2026-10-11 11:00:00', '320 CMT8, Q.3', 'Khách bận họp không ra nhận được, hẹn giao lại lúc 18h tối nay', 'Trần Đình Trọng');

-- ------------------------------------------------------------------------------
-- 10. BẢNG ĐỐI SOÁT COD (reconciliation_batches)
-- ------------------------------------------------------------------------------
CREATE TABLE `reconciliation_batches` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `batch_code` VARCHAR(50) NOT NULL UNIQUE,
  `shop_id` INT NOT NULL,
  `date` DATE NOT NULL,
  `total_orders` INT NOT NULL,
  `total_cod` DECIMAL(12, 2) NOT NULL,
  `total_fees` DECIMAL(12, 2) NOT NULL,
  `net_payable` DECIMAL(12, 2) NOT NULL,
  `status` ENUM('PENDING', 'PROCESSING', 'SETTLED') DEFAULT 'PENDING',
  `settled_at` DATETIME NULL,
  `bank_account` VARCHAR(50) NOT NULL,
  `bank_name` VARCHAR(100) NOT NULL,
  `transaction_ref` VARCHAR(100) NULL,
  FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `reconciliation_batches` (`batch_code`, `shop_id`, `date`, `total_orders`, `total_cod`, `total_fees`, `net_payable`, `status`, `settled_at`, `bank_account`, `bank_name`, `transaction_ref`) VALUES
('DS-202610-001', 1, '2026-10-08', 18, 7850000.00, 485000.00, 7365000.00, 'SETTLED', '2026-10-08 17:30:00', '19038291029012', 'Techcombank - CN Tân Bình', 'FT261008779912'),
('DS-202610-002', 1, '2026-10-10', 14, 6120000.00, 390000.00, 5730000.00, 'SETTLED', '2026-10-10 17:15:00', '19038291029012', 'Techcombank - CN Tân Bình', 'FT261010332219'),
('DS-202610-003', 1, '2026-10-11', 9, 3950000.00, 245000.00, 3705000.00, 'PENDING', NULL, '19038291029012', 'Techcombank - CN Tân Bình', NULL),
('DS-202610-004', 2, '2026-10-09', 22, 14200000.00, 890000.00, 13310000.00, 'SETTLED', '2026-10-09 18:00:00', '0011004829101', 'Vietcombank - Sở Giao Dịch', 'FT261009881122'),
('DS-202610-005', 2, '2026-10-11', 12, 7800000.00, 480000.00, 7320000.00, 'PROCESSING', NULL, '0011004829101', 'Vietcombank - Sở Giao Dịch', NULL),
('DS-202610-006', 3, '2026-10-10', 11, 4650000.00, 290000.00, 4360000.00, 'SETTLED', '2026-10-10 16:45:00', '102839281928', 'MBBank - CN Sài Gòn', 'FT261010665544'),
('DS-202610-007', 4, '2026-10-10', 16, 9200000.00, 560000.00, 8640000.00, 'SETTLED', '2026-10-10 17:00:00', '19134567890123', 'Techcombank - CN Cầu Giấy', 'FT261010998877'),
('DS-202610-008', 6, '2026-10-11', 8, 5400000.00, 280000.00, 5120000.00, 'PENDING', NULL, '2221000123456', 'BIDV - CN Gia Định', NULL);

-- ------------------------------------------------------------------------------
-- 11. BẢNG PHIẾU NỘP TIỀN COD SHIPPER (shipper_cash_deposits)
-- ------------------------------------------------------------------------------
CREATE TABLE `shipper_cash_deposits` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `deposit_code` VARCHAR(50) NOT NULL UNIQUE,
  `shipper_id` INT NOT NULL,
  `warehouse_id` INT NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `collected_orders_count` INT NOT NULL,
  `receiver_staff_name` VARCHAR(100) NOT NULL,
  `status` ENUM('CONFIRMED', 'PENDING') DEFAULT 'CONFIRMED',
  `notes` VARCHAR(255) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`shipper_id`) REFERENCES `shippers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `shipper_cash_deposits` (`deposit_code`, `shipper_id`, `warehouse_id`, `amount`, `collected_orders_count`, `receiver_staff_name`, `status`, `notes`) VALUES
('NOP-202610-01', 1, 1, 4850000.00, 8, 'Phan Mỹ Duyên', 'CONFIRMED', 'Nộp tiền ca chiều các đơn khu vực Tân Bình'),
('NOP-202610-02', 2, 1, 6200000.00, 11, 'Phan Mỹ Duyên', 'CONFIRMED', 'Nộp tiền ca sáng tuyến Quận 1 & Quận 3'),
('NOP-202610-03', 3, 5, 5100000.00, 9, 'Lê Văn Kiên', 'CONFIRMED', 'Nộp tiền ca phát Cầu Giấy'),
('NOP-202610-04', 4, 8, 2350000.00, 5, 'Ngô Đình Trí', 'CONFIRMED', 'Nộp tiền Hải Châu ca trưa'),
('NOP-202610-05', 1, 1, 3150000.00, 6, 'Phan Mỹ Duyên', 'CONFIRMED', 'Nộp tiền bổ sung ca tối');

-- ------------------------------------------------------------------------------
-- 12. BẢNG KHIẾU NẠI & HỖ TRỢ CSKH (support_tickets)
-- ------------------------------------------------------------------------------
CREATE TABLE `support_tickets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ticket_code` VARCHAR(50) NOT NULL UNIQUE,
  `tracking_code` VARCHAR(50) NOT NULL,
  `customer_name` VARCHAR(100) NOT NULL,
  `customer_phone` VARCHAR(20) NOT NULL,
  `category` ENUM('DELAY', 'DAMAGE', 'COD_WRONG', 'FEE_DISPUTE', 'SHIPPER_ATTITUDE', 'OTHER') NOT NULL,
  `description` TEXT NOT NULL,
  `status` ENUM('OPEN', 'PROCESSING', 'RESOLVED') DEFAULT 'OPEN',
  `resolution` TEXT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `support_tickets` (`ticket_code`, `tracking_code`, `customer_name`, `customer_phone`, `category`, `description`, `status`, `resolution`) VALUES
('TICK_1021', 'FS-HCM-772819', 'Phan Anh Tuấn', '0966778899', 'DELAY', 'Hôm nay bận họp cả ngày không nhận được, nhờ bưu cục giao vào 18h chiều nay.', 'RESOLVED', 'Đã hẹn lại shipper phụ trách giao đúng 18h cho khách'),
('TICK_1022', 'FS-DN-119283', 'Shop Yến Fashion', '0988776655', 'DAMAGE', 'Hàng bị móp hộp ngoài khi trung chuyển, yêu cầu kiểm tra và hoàn về nguyên vẹn.', 'PROCESSING', 'Bưu cục Liên Chiểu đang đóng gói chống sốc lại để gửi hoàn về Tân Bình'),
('TICK_1023', 'FS-HN-552109', 'TechZone Phụ Kiện', '0919283746', 'COD_WRONG', 'Kiểm tra tiền thu hộ COD đơn FS-HN-552109 trong phiên đối soát hôm nay.', 'RESOLVED', 'Đã đối chiếu thu đủ 1.250.000đ và cộng vào phiên đối soát DS-202610-004'),
('TICK_1024', 'FS-HCM-942183', 'Hoàng Quốc Bảo', '0979888999', 'FEE_DISPUTE', 'Hỏi về việc người gửi đã trả cước thì người nhận không phải trả cước nữa đúng không.', 'RESOLVED', 'Đã giải thích cước SENDER_PAY và shipper chỉ thu tiền hàng COD 650.000đ'),
('TICK_1025', 'FS-HCM-445566', 'Nguyễn Hữu Đạt', '0938221199', 'DELAY', 'Cần nhận gấp trước 16h để mang đi công tác Đà Lạt, nhờ điều phối hỗ trợ giao sớm.', 'PROCESSING', 'Đã báo shipper Tuấn ưu tiên giao đơn này đầu tiên trong buổi chiều');

-- ------------------------------------------------------------------------------
-- 13. BẢNG SỔ ĐỊA CHỈ KHÁCH HÀNG (customer_addresses)
-- ------------------------------------------------------------------------------
CREATE TABLE `customer_addresses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `label` VARCHAR(100) NOT NULL,
  `contact_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `province` VARCHAR(100) NOT NULL,
  `is_default` BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `customer_addresses` (`user_id`, `label`, `contact_name`, `phone`, `address`, `district`, `province`, `is_default`) VALUES
(24, 'Kho Hàng Chính (Shop Yến)', 'Lê Hoàng Yến', '0988776655', '48/12 Cộng Hòa, Phường 4', 'Quận Tân Bình', 'TP. Hồ Chí Minh', 1),
(24, 'Chi nhánh 2 Phú Nhuận', 'Nguyễn Văn Minh', '0981234567', '74 Nguyễn Văn Trỗi, Phường 8', 'Quận Phú Nhuận', 'TP. Hồ Chí Minh', 0),
(25, 'Kho Tổng Hà Nội (TechZone)', 'Trần Quốc Anh', '0919283746', '18 Phạm Hùng, Mỹ Đình', 'Quận Nam Từ Liêm', 'TP. Hà Nội', 1),
(30, 'Nhà Riêng (Khách Thu Trang)', 'Nguyễn Thu Trang', '0912345678', '152 Hai Bà Trưng, Phường Đa Kao', 'Quận 1', 'TP. Hồ Chí Minh', 1),
(31, 'Văn Phòng Công Ty', 'Vũ Minh Anh', '0943920192', '88 Phan Xích Long, Phường 2', 'Quận Phú Nhuận', 'TP. Hồ Chí Minh', 1);

SET FOREIGN_KEY_CHECKS = 1;
-- ==============================================================================
-- HOÀN TẤT THIẾT LẬP CƠ SỞ DỮ LIỆU FASTSHIP LOGISTICS ERP (MYSQL)
-- TỔNG CỘNG: 13 BẢNG QUAN HỆ CHUẨN HOÁ, HƠN 100+ BẢN GHI DỮ LIỆU THỰC TẾ
-- PHÂN QUYỀN ĐẦY ĐỦ: ADMIN, TRƯỞNG BƯU CỤC, ĐIỀU PHỐI, NHÂN VIÊN, SHIPPER, SHOP, CUSTOMER
-- ==============================================================================
