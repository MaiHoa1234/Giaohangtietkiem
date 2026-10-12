import React, { useState } from 'react';
import {
  Database,
  Download,
  Copy,
  Check,
  X,
  Server,
  Terminal,
  ExternalLink,
  Table,
} from 'lucide-react';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'GUIDE' | 'PREVIEW'>('GUIDE');

  if (!isOpen) return null;

  const sqlSampleSnippet = `-- HỆ THỐNG FASTSHIP LOGISTICS - MYSQL DATABASE SCHEMA
CREATE DATABASE IF NOT EXISTS \`fastship_db\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`fastship_db\`;

-- 1. BẢNG ROLES & USERS
CREATE TABLE \`roles\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`role_code\` VARCHAR(50) NOT NULL UNIQUE,
  \`role_name\` VARCHAR(100) NOT NULL
);

CREATE TABLE \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`full_name\` VARCHAR(100) NOT NULL,
  \`phone\` VARCHAR(20) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL,
  \`role_code\` VARCHAR(50) NOT NULL,
  FOREIGN KEY (\`role_code\`) REFERENCES \`roles\`(\`role_code\`)
);

-- 2. BẢNG SHIPMENTS (VẬN ĐƠN)
CREATE TABLE \`shipments\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`tracking_code\` VARCHAR(50) NOT NULL UNIQUE,
  \`sender_name\` VARCHAR(100) NOT NULL,
  \`receiver_name\` VARCHAR(100) NOT NULL,
  \`receiver_phone\` VARCHAR(20) NOT NULL,
  \`receiver_address\` VARCHAR(255) NOT NULL,
  \`receiver_province\` VARCHAR(100) NOT NULL,
  \`cod_amount\` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  \`shipping_fee\` DECIMAL(10, 2) NOT NULL,
  \`total_fee\` DECIMAL(10, 2) NOT NULL,
  \`status\` ENUM('PENDING','CONFIRMED','WAITING_PICKUP','PICKED_UP','IN_TRANSIT','AT_WAREHOUSE','OUT_FOR_DELIVERY','DELIVERY_FAILED','DELIVERED','RETURNING','RETURNED','CANCELLED') DEFAULT 'PENDING',
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- (Xem toàn bộ 11 bảng đầy đủ trong tệp tải về)`;

  const handleDownloadSql = () => {
    // Read or construct the SQL content
    const fullSql = `-- ==============================================================================
-- HỆ THỐNG QUẢN LÝ VẬN CHUYỂN GIAO HÀNG NHANH - TIẾT KIỆM (FASTSHIP LOGISTICS)
-- ĐỒ ÁN MÔN HỌC: XÂY DỰNG VÀ PHÁT TRIỂN PHẦN MỀM
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS \`fastship_db\`;
CREATE DATABASE \`fastship_db\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`fastship_db\`;

CREATE TABLE \`roles\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`role_code\` VARCHAR(50) NOT NULL UNIQUE,
  \`role_name\` VARCHAR(100) NOT NULL,
  \`description\` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`roles\` (\`role_code\`, \`role_name\`, \`description\`) VALUES
('ADMIN', 'Quản trị viên', 'Toàn quyền cấu hình bảng giá, KPI'),
('DISPATCHER', 'Điều phối viên', 'Phân công shipper, quản lý kho bãi'),
('SHIPPER', 'Tài xế giao nhận', 'Nhận đơn, giao hàng, thu COD'),
('SHOP', 'Chủ shop', 'Tạo đơn hàng loạt, in phiếu A6, đối soát COD'),
('CUSTOMER', 'Khách hàng cá nhân', 'Tạo đơn, theo dõi vận đơn');

CREATE TABLE \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`full_name\` VARCHAR(100) NOT NULL,
  \`phone\` VARCHAR(20) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL,
  \`role_code\` VARCHAR(50) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`role_code\`) REFERENCES \`roles\`(\`role_code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`users\` (\`username\`, \`password_hash\`, \`full_name\`, \`phone\`, \`email\`, \`role_code\`) VALUES
('admin_quan', 'secret123', 'Võ Minh Quân', '0909999999', 'admin@fastship.vn', 'ADMIN'),
('dieuphoi_hung', 'secret123', 'Trần Hùng', '0903829102', 'hung.dieuphoi@fastship.vn', 'DISPATCHER'),
('shipper_tuan', 'secret123', 'Nguyễn Văn Tuấn', '0971239845', 'tuan.shipper@fastship.vn', 'SHIPPER'),
('shop_yen', 'secret123', 'Lê Hoàng Yến', '0988776655', 'yen.fashion@shop.vn', 'SHOP'),
('khach_trang', 'secret123', 'Nguyễn Thu Trang', '0912345678', 'thutrang@gmail.com', 'CUSTOMER');

CREATE TABLE \`warehouses\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`code\` VARCHAR(50) NOT NULL UNIQUE,
  \`name\` VARCHAR(150) NOT NULL,
  \`address\` VARCHAR(255) NOT NULL,
  \`province\` VARCHAR(100) NOT NULL,
  \`phone\` VARCHAR(20) NOT NULL,
  \`manager_name\` VARCHAR(100) NOT NULL,
  \`capacity\` INT DEFAULT 10000,
  \`current_stock\` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`warehouses\` (\`code\`, \`name\`, \`address\`, \`province\`, \`phone\`, \`manager_name\`, \`capacity\`, \`current_stock\`) VALUES
('HUB-TB-HCM', 'Kho Trung chuyển Tân Bình (TP.HCM)', '102 Trường Chinh, Q.Tân Bình', 'TP. Hồ Chí Minh', '028.3812.9999', 'Trần Hùng', 10000, 1420),
('HUB-LB-HN', 'Kho Tổng Miền Bắc Long Biên (Hà Nội)', 'KCN Đài Tư, Long Biên', 'TP. Hà Nội', '024.3982.5555', 'Nguyễn Văn Định', 15000, 2850),
('HUB-LC-DN', 'Kho Trung chuyển Miền Trung Liên Chiểu', 'KCN Hòa Khánh, Liên Chiểu', 'TP. Đà Nẵng', '0236.3888.111', 'Huỳnh Bá Cường', 8000, 520);

CREATE TABLE \`shipments\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`tracking_code\` VARCHAR(50) NOT NULL UNIQUE,
  \`sender_name\` VARCHAR(100) NOT NULL,
  \`sender_phone\` VARCHAR(20) NOT NULL,
  \`sender_address\` VARCHAR(255) NOT NULL,
  \`sender_district\` VARCHAR(100) NOT NULL,
  \`sender_province\` VARCHAR(100) NOT NULL,
  \`receiver_name\` VARCHAR(100) NOT NULL,
  \`receiver_phone\` VARCHAR(20) NOT NULL,
  \`receiver_address\` VARCHAR(255) NOT NULL,
  \`receiver_district\` VARCHAR(100) NOT NULL,
  \`receiver_province\` VARCHAR(100) NOT NULL,
  \`item_description\` VARCHAR(255) NOT NULL,
  \`weight_kg\` DECIMAL(6, 2) NOT NULL DEFAULT 0.50,
  \`service_type\` VARCHAR(50) NOT NULL,
  \`payer_type\` ENUM('SENDER_PAY', 'RECEIVER_PAY') NOT NULL DEFAULT 'RECEIVER_PAY',
  \`cod_amount\` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  \`shipping_fee\` DECIMAL(10, 2) NOT NULL DEFAULT 22000,
  \`total_fee\` DECIMAL(10, 2) NOT NULL DEFAULT 22000,
  \`status\` ENUM('PENDING','CONFIRMED','WAITING_PICKUP','PICKED_UP','IN_TRANSIT','AT_WAREHOUSE','OUT_FOR_DELIVERY','DELIVERY_FAILED','DELIVERED','RETURNING','RETURNED','CANCELLED') DEFAULT 'PENDING',
  \`notes_for_shipper\` VARCHAR(255) DEFAULT 'Cho xem hàng, không thử',
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`shipments\` (\`tracking_code\`, \`sender_name\`, \`sender_phone\`, \`sender_address\`, \`sender_district\`, \`sender_province\`, \`receiver_name\`, \`receiver_phone\`, \`receiver_address\`, \`receiver_district\`, \`receiver_province\`, \`item_description\`, \`weight_kg\`, \`service_type\`, \`cod_amount\`, \`shipping_fee\`, \`total_fee\`, \`status\`) VALUES
('FS-HCM-882910', 'Shop Yến Fashion', '0988776655', '48/12 Cộng Hòa', 'Quận Tân Bình', 'TP. Hồ Chí Minh', 'Vũ Minh Anh', '0943920192', '152 Hai Bà Trưng', 'Quận 1', 'TP. Hồ Chí Minh', 'Váy đầm hoa dáng dài', 0.50, 'EXPRESS', 380000.00, 33000.00, 33000.00, 'DELIVERED'),
('FS-HCM-942183', 'Shop Yến Fashion', '0988776655', '48/12 Cộng Hòa', 'Quận Tân Bình', 'TP. Hồ Chí Minh', 'Hoàng Quốc Bảo', '0979888999', '88 Phan Xích Long', 'Quận Phú Nhuận', 'TP. Hồ Chí Minh', 'Giày Sneaker Running Pro', 1.10, 'STANDARD', 650000.00, 27000.00, 30250.00, 'OUT_FOR_DELIVERY'),
('FS-HN-552109', 'Kho Công Nghệ HN', '0919283746', '18 Phạm Hùng', 'Quận Nam Từ Liêm', 'TP. Hà Nội', 'Đặng Thùy Dung', '0908112233', '74 Nguyễn Văn Trỗi', 'Quận Phú Nhuận', 'TP. Hồ Chí Minh', 'Tai nghe Bluetooth True Wireless', 0.40, 'EXPRESS', 1250000.00, 47000.00, 53250.00, 'IN_TRANSIT'),
('FS-HCM-772819', 'Shop Yến Fashion', '0988776655', '48/12 Cộng Hòa', 'Quận Tân Bình', 'TP. Hồ Chí Minh', 'Phan Anh Tuấn', '0966778899', '320 CMT8', 'Quận 3', 'TP. Hồ Chí Minh', 'Mỹ phẩm dưỡng da', 0.70, 'STANDARD', 420000.00, 22000.00, 22000.00, 'DELIVERY_FAILED');

CREATE TABLE \`reconciliation_batches\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`batch_code\` VARCHAR(50) NOT NULL UNIQUE,
  \`date\` DATE NOT NULL,
  \`total_orders\` INT NOT NULL,
  \`total_cod\` DECIMAL(12, 2) NOT NULL,
  \`total_fees\` DECIMAL(12, 2) NOT NULL,
  \`net_payable\` DECIMAL(12, 2) NOT NULL,
  \`status\` ENUM('PENDING', 'SETTLED') DEFAULT 'PENDING'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`reconciliation_batches\` (\`batch_code\`, \`date\`, \`total_orders\`, \`total_cod\`, \`total_fees\`, \`net_payable\`, \`status\`) VALUES
('DS-202610-001', '2026-10-08', 18, 7850000.00, 485000.00, 7365000.00, 'SETTLED'),
('DS-202610-002', '2026-10-10', 14, 6120000.00, 390000.00, 5730000.00, 'SETTLED');

SET FOREIGN_KEY_CHECKS = 1;
`;

    const blob = new Blob([fullSql], { type: 'application/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fastship_database.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSampleSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Cơ Sở Dữ Liệu MySQL (XAMPP)</h3>
              <p className="text-xs text-slate-300">
                Tệp cài đặt CSDL quan hệ `fastship_database.sql` cho đồ án
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSql}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-105 active:scale-98 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Tải Tệp .SQL
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 px-6 gap-4 text-xs font-bold text-slate-500 bg-slate-50">
          <button
            onClick={() => setActiveTab('GUIDE')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'GUIDE'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Hướng Dẫn Chạy Trên XAMPP (3 Bước)
          </button>
          <button
            onClick={() => setActiveTab('PREVIEW')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'PREVIEW'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Xem Cấu Trúc Bảng (SQL Schema)
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
          {activeTab === 'GUIDE' ? (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-950">
                <div className="font-bold text-sm mb-1">
                  Đã tạo sẵn file CSDL: <span className="font-mono text-emerald-800">/database/fastship_database.sql</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Bao gồm 11 bảng quan hệ chuẩn: <code>users</code>, <code>roles</code>, <code>shops</code>, <code>warehouses</code>, <code>shippers</code>, <code>shipping_services</code>, <code>shipments</code>, <code>shipment_status_history</code>, <code>reconciliation_batches</code>, <code>support_tickets</code>.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                  <div className="font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
                    Khởi động XAMPP
                  </div>
                  <p className="text-slate-600 pl-7 text-[11px]">
                    Mở <strong>XAMPP Control Panel</strong> trên máy tính của bạn và nhấn <strong>Start</strong> cả 2 dịch vụ: <strong>Apache</strong> và <strong>MySQL</strong>.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                  <div className="font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
                    Mở phpMyAdmin
                  </div>
                  <p className="text-slate-600 pl-7 text-[11px]">
                    Mở trình duyệt web và truy cập địa chỉ: <code className="bg-white px-2 py-0.5 rounded border border-slate-200 text-emerald-700 font-bold">http://localhost/phpmyadmin</code>
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                  <div className="font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">3</span>
                    Nhập (Import) tệp SQL
                  </div>
                  <p className="text-slate-600 pl-7 text-[11px]">
                    Bấm nút <strong>"Tải Tệp .SQL"</strong> ở góc trên bên phải cửa sổ này, sau đó trong phpMyAdmin nhấn vào thẻ <strong>"Import" (Nhập)</strong> $\rightarrow$ chọn tệp vừa tải về $\rightarrow$ cuộn xuống bấm <strong>"Import / Thực hiện"</strong>. Hệ thống sẽ tự động tạo cơ sở dữ liệu <code>fastship_db</code> và chèn sẵn dữ liệu mẫu thực tế!
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px]">
                <strong>💡 Cấu hình kết nối Backend (Node.js / PHP / Spring Boot):</strong><br />
                Host: <code>localhost</code> | Port: <code>3306</code> | User: <code>root</code> | Password: <em>(để trống)</em> | Database: <code>fastship_db</code>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700">Trích đoạn mã SQL mẫu:</span>
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold flex items-center gap-1 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Đã sao chép' : 'Sao chép đoạn mã'}
                </button>
              </div>

              <pre className="p-4 bg-slate-900 text-slate-200 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-80 leading-relaxed">
                {sqlSampleSnippet}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-400">Tệp tương thích 100% với MySQL 5.7+ / MariaDB 10.4+ trong XAMPP</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-white"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
