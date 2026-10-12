-- ==============================================================================
-- HỆ THỐNG QUẢN LÝ VẬN CHUYỂN GIAO HÀNG NHANH - TIẾT KIỆM (FASTSHIP LOGISTICS)
-- ĐỒ ÁN MÔN HỌC: XÂY DỰNG VÀ PHÁT TRIỂN PHẦN MỀM
-- Hướng dẫn: Import trực tiếp qua phpMyAdmin (XAMPP) hoặc MySQL Workbench
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS `fastship_db`;
CREATE DATABASE `fastship_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `fastship_db`;

-- 1. BẢNG VAI TRÒ NGƯỜI DÙNG (roles)
CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_code` VARCHAR(50) NOT NULL UNIQUE,
  `role_name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`role_code`, `role_name`, `description`) VALUES
('ADMIN', 'Quản trị viên hệ thống', 'Toàn quyền cấu hình, quản lý người dùng, bảng giá, báo cáo'),
('DISPATCHER', 'Nhân viên điều phối / Kho', 'Phân công shipper, quản lý nhập/xuất kho bưu cục, xử lý đơn tồn'),
('SHIPPER', 'Tài xế giao nhận', 'Nhận đơn, lấy hàng, giao hàng, thu COD, nộp tiền mặt'),
('SHOP', 'Chủ cửa hàng (Merchant)', 'Tạo đơn hàng loạt, in phiếu A6, đối soát COD, quản lý kho gửi'),
('CUSTOMER', 'Khách hàng cá nhân', 'Tạo đơn lẻ, theo dõi vận đơn, quản lý địa chỉ, gửi khiếu nại');

-- 2. BẢNG TÀI KHOẢN NGƯỜI DÙNG (users)
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `role_code` VARCHAR(50) NOT NULL,
  `avatar_url` VARCHAR(255) NULL,
  `status` ENUM('ACTIVE', 'LOCKED') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_code`) REFERENCES `roles`(`role_code`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`username`, `password_hash`, `full_name`, `phone`, `email`, `role_code`, `avatar_url`) VALUES
('admin_quan', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Võ Minh Quân', '0909999999', 'admin@fastship.vn', 'ADMIN', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120'),
('dieuphoi_hung', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Trần Hùng', '0903829102', 'hung.dieuphoi@fastship.vn', 'DISPATCHER', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120'),
('shipper_tuan', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nguyễn Văn Tuấn', '0971239845', 'tuan.shipper@fastship.vn', 'SHIPPER', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120'),
('shop_yen', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Lê Hoàng Yến', '0988776655', 'yen.fashion@shop.vn', 'SHOP', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'),
('khach_trang', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nguyễn Thu Trang', '0912345678', 'thutrang@gmail.com', 'CUSTOMER', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120');

-- 3. BẢNG THÔNG TIN SHOP (shops)
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
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `shops` (`user_id`, `shop_name`, `phone`, `pickup_address`, `district`, `province`, `bank_account`, `bank_name`) VALUES
(4, 'Yến Fashion Official Store', '0988776655', '48/12 Cộng Hòa, Phường 4', 'Quận Tân Bình', 'TP. Hồ Chí Minh', '19038291029012', 'Techcombank - CN Tân Bình');

-- 4. BẢNG KHO BÃI & BƯU CỤC (warehouses)
CREATE TABLE `warehouses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `province` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `manager_name` VARCHAR(100) NOT NULL,
  `capacity` INT DEFAULT 10000,
  `current_stock` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `warehouses` (`code`, `name`, `address`, `province`, `phone`, `manager_name`, `capacity`, `current_stock`) VALUES
('HUB-TB-HCM', 'Kho Trung chuyển Tân Bình (TP.HCM)', '102 Trường Chinh, Phường 12, Quận Tân Bình', 'TP. Hồ Chí Minh', '028.3812.9999', 'Trần Hùng', 10000, 1420),
('HUB-Q7-HCM', 'Bưu cục Quận 7 - Nam Sài Gòn', '45 Nguyễn Thị Thập, Tân Phú, Quận 7', 'TP. Hồ Chí Minh', '028.3775.1234', 'Lê Minh Khôi', 5000, 680),
('HUB-LB-HN', 'Kho Tổng Miền Bắc Long Biên (Hà Nội)', 'KCN Đài Tư, 386 Nguyễn Văn Linh, Long Biên', 'TP. Hà Nội', '024.3982.5555', 'Nguyễn Văn Định', 15000, 2850),
('HUB-CG-HN', 'Bưu cục Cầu Giấy (Hà Nội)', '89 Duy Tân, Dịch Vọng Hậu, Cầu Giấy', 'TP. Hà Nội', '024.3795.6677', 'Phạm Thu Hương', 6000, 910),
('HUB-LC-DN', 'Kho Trung chuyển Miền Trung Liên Chiểu (Đà Nẵng)', 'Đường số 3, KCN Hòa Khánh, Liên Chiểu', 'TP. Đà Nẵng', '0236.3888.111', 'Huỳnh Bá Cường', 8000, 520);

-- 5. BẢNG TÀI XẾ SHIPPER (shippers)
CREATE TABLE `shippers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `vehicle_plate` VARCHAR(20) NOT NULL,
  `assigned_area` VARCHAR(150) NOT NULL,
  `rating` DECIMAL(3, 2) DEFAULT 5.00,
  `cash_in_hand` DECIMAL(12, 2) DEFAULT 0,
  `active_orders_count` INT DEFAULT 0,
  `completed_orders_count` INT DEFAULT 0,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `shippers` (`user_id`, `full_name`, `phone`, `vehicle_plate`, `assigned_area`, `rating`, `cash_in_hand`, `active_orders_count`, `completed_orders_count`) VALUES
(3, 'Nguyễn Văn Tuấn', '0971239845', '59P2-839.12', 'Quận Tân Bình & Phú Nhuận (HCM)', 4.90, 1350000.00, 3, 142);

-- 6. BẢNG GÓI CƯỚC DỊCH VỤ (shipping_services)
CREATE TABLE `shipping_services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `base_fee` DECIMAL(10, 2) NOT NULL,
  `per_kg_extra` DECIMAL(10, 2) NOT NULL,
  `multiplier` DECIMAL(3, 2) DEFAULT 1.00,
  `estimated_hours` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `shipping_services` (`code`, `name`, `base_fee`, `per_kg_extra`, `multiplier`, `estimated_hours`) VALUES
('STANDARD', 'Giao Tiết Kiệm', 22000.00, 5000.00, 1.00, 48),
('EXPRESS', 'Giao Nhanh (24h)', 22000.00, 5000.00, 1.50, 24),
('SUPER_FAST', 'Hỏa Tốc (2-4h)', 22000.00, 5000.00, 2.30, 4);

-- 7. BẢNG VẬN ĐƠN (shipments)
CREATE TABLE `shipments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tracking_code` VARCHAR(50) NOT NULL UNIQUE,
  `sender_name` VARCHAR(100) NOT NULL,
  `sender_phone` VARCHAR(20) NOT NULL,
  `sender_address` VARCHAR(255) NOT NULL,
  `sender_district` VARCHAR(100) NOT NULL,
  `sender_province` VARCHAR(100) NOT NULL,
  `receiver_name` VARCHAR(100) NOT NULL,
  `receiver_phone` VARCHAR(20) NOT NULL,
  `receiver_address` VARCHAR(255) NOT NULL,
  `receiver_district` VARCHAR(100) NOT NULL,
  `receiver_province` VARCHAR(100) NOT NULL,
  `item_description` VARCHAR(255) NOT NULL,
  `weight_kg` DECIMAL(6, 2) NOT NULL DEFAULT 0.50,
  `length_cm` INT DEFAULT 20,
  `width_cm` INT DEFAULT 15,
  `height_cm` INT DEFAULT 10,
  `service_type` VARCHAR(50) NOT NULL,
  `payer_type` ENUM('SENDER_PAY', 'RECEIVER_PAY') NOT NULL DEFAULT 'RECEIVER_PAY',
  `cod_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  `shipping_fee` DECIMAL(10, 2) NOT NULL DEFAULT 22000,
  `insurance_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
  `total_fee` DECIMAL(10, 2) NOT NULL DEFAULT 22000,
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
  `item_description`, `weight_kg`, `service_type`, `payer_type`, `cod_amount`, `shipping_fee`, `total_fee`, `status`, `delivery_attempts`
) VALUES
('FS-HCM-882910', 'Shop Yến Fashion', '0988776655', '48/12 Cộng Hòa', 'Quận Tân Bình', 'TP. Hồ Chí Minh', 'Vũ Minh Anh', '0943920192', '152 Hai Bà Trưng', 'Quận 1', 'TP. Hồ Chí Minh', 'Váy đầm hoa dáng dài', 0.50, 'EXPRESS', 'RECEIVER_PAY', 380000.00, 33000.00, 33000.00, 'DELIVERED', 1),
('FS-HCM-942183', 'Shop Yến Fashion', '0988776655', '48/12 Cộng Hòa', 'Quận Tân Bình', 'TP. Hồ Chí Minh', 'Hoàng Quốc Bảo', '0979888999', '88 Phan Xích Long', 'Quận Phú Nhuận', 'TP. Hồ Chí Minh', 'Giày Sneaker Running Pro', 1.10, 'STANDARD', 'SENDER_PAY', 650000.00, 27000.00, 30250.00, 'OUT_FOR_DELIVERY', 1),
('FS-HN-552109', 'Kho Công Nghệ HN', '0919283746', '18 Phạm Hùng', 'Quận Nam Từ Liêm', 'TP. Hà Nội', 'Đặng Thùy Dung', '0908112233', '74 Nguyễn Văn Trỗi', 'Quận Phú Nhuận', 'TP. Hồ Chí Minh', 'Tai nghe Bluetooth True Wireless', 0.40, 'EXPRESS', 'RECEIVER_PAY', 1250000.00, 47000.00, 53250.00, 'IN_TRANSIT', 0),
('FS-HCM-772819', 'Shop Yến Fashion', '0988776655', '48/12 Cộng Hòa', 'Quận Tân Bình', 'TP. Hồ Chí Minh', 'Phan Anh Tuấn', '0966778899', '320 Cách Mạng Tháng Tám', 'Quận 3', 'TP. Hồ Chí Minh', 'Set mỹ phẩm dưỡng da thiên nhiên', 0.70, 'STANDARD', 'RECEIVER_PAY', 420000.00, 22000.00, 22000.00, 'DELIVERY_FAILED', 1),
('FS-HCM-201948', 'Shop Yến Fashion', '0988776655', '48/12 Cộng Hòa', 'Quận Tân Bình', 'TP. Hồ Chí Minh', 'Ngô Thanh Trúc', '0933112244', '12 Nguyễn Tri Phương', 'Quận 5', 'TP. Hồ Chí Minh', 'Áo khoác len Cardigan', 0.70, 'STANDARD', 'RECEIVER_PAY', 490000.00, 22000.00, 22000.00, 'WAITING_PICKUP', 0);

-- 8. BẢNG NHẬT KÝ HÀNH TRÌNH VẬN ĐƠN (shipment_status_history)
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
(1, 'PENDING', '2026-10-09 09:15:00', 'Hệ thống FastShip', 'Đơn hàng được khởi tạo thành công', 'Shop Yến'),
(1, 'PICKED_UP', '2026-10-09 11:20:00', '48/12 Cộng Hòa', 'Shipper đã lấy hàng thành công', 'Nguyễn Văn Tuấn'),
(1, 'AT_WAREHOUSE', '2026-10-09 14:10:00', 'Kho Tân Bình', 'Nhập kho Tân Bình phân luồng', 'Kho Tân Bình'),
(1, 'DELIVERED', '2026-10-10 10:45:00', '152 Hai Bà Trưng, Q.1', 'Giao hàng thành công! Thu hộ COD 380.000đ', 'Trần Đình Trọng');

-- 9. BẢNG ĐỐI SOÁT COD (reconciliation_batches)
CREATE TABLE `reconciliation_batches` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `batch_code` VARCHAR(50) NOT NULL UNIQUE,
  `shop_id` INT NOT NULL,
  `date` DATE NOT NULL,
  `total_orders` INT NOT NULL,
  `total_cod` DECIMAL(12, 2) NOT NULL,
  `total_fees` DECIMAL(12, 2) NOT NULL,
  `net_payable` DECIMAL(12, 2) NOT NULL,
  `status` ENUM('PENDING', 'SETTLED') DEFAULT 'PENDING',
  `settled_at` DATETIME NULL,
  `bank_account` VARCHAR(50) NOT NULL,
  `bank_name` VARCHAR(100) NOT NULL,
  FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `reconciliation_batches` (`batch_code`, `shop_id`, `date`, `total_orders`, `total_cod`, `total_fees`, `net_payable`, `status`, `bank_account`, `bank_name`) VALUES
('DS-202610-001', 1, '2026-10-08', 18, 7850000.00, 485000.00, 7365000.00, 'SETTLED', '19038291029012', 'Techcombank - CN Tân Bình'),
('DS-202610-002', 1, '2026-10-10', 14, 6120000.00, 390000.00, 5730000.00, 'SETTLED', '19038291029012', 'Techcombank - CN Tân Bình'),
('DS-202610-003', 1, '2026-10-11', 9, 3950000.00, 245000.00, 3705000.00, 'PENDING', '19038291029012', 'Techcombank - CN Tân Bình');

-- 10. BẢNG KHIẾU NẠI & HỖ TRỢ CSKH (support_tickets)
CREATE TABLE `support_tickets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ticket_code` VARCHAR(50) NOT NULL UNIQUE,
  `tracking_code` VARCHAR(50) NOT NULL,
  `customer_name` VARCHAR(100) NOT NULL,
  `customer_phone` VARCHAR(20) NOT NULL,
  `category` ENUM('DELAY', 'DAMAGE', 'COD_WRONG', 'FEE_DISPUTE', 'OTHER') NOT NULL,
  `description` TEXT NOT NULL,
  `status` ENUM('OPEN', 'PROCESSING', 'RESOLVED') DEFAULT 'OPEN',
  `resolution` TEXT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `support_tickets` (`ticket_code`, `tracking_code`, `customer_name`, `customer_phone`, `category`, `description`, `status`, `resolution`) VALUES
('TICK_1021', 'FS-HCM-772819', 'Phan Anh Tuấn', '0966778899', 'DELAY', 'Hôm nay bận họp cả ngày không nhận được, nhờ bưu cục giao vào 18h ngày mai.', 'PROCESSING', 'Đã hẹn lại shipper phụ trách giao lúc 18h ngày mai'),
('TICK_1022', 'FS-DN-119283', 'Shop Yến Fashion', '0988776655', 'DAMAGE', 'Hàng bị móp hộp ngoài khi trung chuyển, yêu cầu kiểm tra bồi thường bảo hiểm.', 'OPEN', NULL);

SET FOREIGN_KEY_CHECKS = 1;
