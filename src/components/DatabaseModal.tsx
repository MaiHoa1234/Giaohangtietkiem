import React, { useState } from 'react';
import {
  Database,
  Download,
  Copy,
  Check,
  X,
  Server,
  Terminal,
  Table,
  Layers,
  FileText,
  ShieldCheck,
} from 'lucide-react';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'GUIDE' | 'PREVIEW' | 'TABLES'>('GUIDE');

  if (!isOpen) return null;

  const sqlSampleSnippet = `-- HỆ THỐNG FASTSHIP LOGISTICS ERP - CSDL MYSQL HOÀN CHỈNH CHO XAMPP
-- Đầy đủ 13 bảng quan hệ chuẩn, hơn 100+ bản ghi dữ liệu thực tế
CREATE DATABASE IF NOT EXISTS \`fastship_db\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`fastship_db\`;

-- 1. BẢNG ROLES (7 VAI TRÒ)
CREATE TABLE \`roles\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`role_code\` VARCHAR(50) NOT NULL UNIQUE,
  \`role_name\` VARCHAR(100) NOT NULL,
  \`description\` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. BẢNG BƯU CỤC & KHO TỔNG (12 BƯU CỤC TOÀN QUỐC)
CREATE TABLE \`warehouses\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`code\` VARCHAR(50) NOT NULL UNIQUE,
  \`name\` VARCHAR(150) NOT NULL,
  \`type\` ENUM('CENTRAL_HUB', 'BRANCH_OFFICE') DEFAULT 'BRANCH_OFFICE',
  \`address\` VARCHAR(255) NOT NULL,
  \`district\` VARCHAR(100) NOT NULL,
  \`province\` VARCHAR(100) NOT NULL,
  \`phone\` VARCHAR(20) NOT NULL,
  \`manager_name\` VARCHAR(100) NOT NULL,
  \`capacity\` INT DEFAULT 10000,
  \`current_stock\` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. BẢNG NGƯỜI DÙNG (28 TÀI KHOẢN: ADMIN, TRƯỞNG BƯU CỤC, NHÂN VIÊN, SHIPPER, SHOP, KHÁCH)
CREATE TABLE \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`full_name\` VARCHAR(100) NOT NULL,
  \`phone\` VARCHAR(20) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL,
  \`role_code\` VARCHAR(50) NOT NULL,
  \`warehouse_id\` INT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`role_code\`) REFERENCES \`roles\`(\`role_code\`),
  FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\`(\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. BẢNG TÀI XẾ SHIPPER (8 SHIPPER TUYẾN PHÁT, BIỂN SỐ XE, TIỀN MẶT COD)
CREATE TABLE \`shippers\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`warehouse_id\` INT NOT NULL,
  \`full_name\` VARCHAR(100) NOT NULL,
  \`phone\` VARCHAR(20) NOT NULL,
  \`vehicle_plate\` VARCHAR(20) NOT NULL,
  \`assigned_area\` VARCHAR(150) NOT NULL,
  \`cash_in_hand\` DECIMAL(12, 2) DEFAULT 0,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`),
  FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\`(\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. BẢNG VẬN ĐƠN (SHIPMENTS VỚI MÃ VẬN ĐƠN, TIỀN COD, CƯỚC, TRẠNG THÁI)
CREATE TABLE \`shipments\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`tracking_code\` VARCHAR(50) NOT NULL UNIQUE,
  \`sender_name\` VARCHAR(100) NOT NULL,
  \`receiver_name\` VARCHAR(100) NOT NULL,
  \`receiver_phone\` VARCHAR(20) NOT NULL,
  \`receiver_address\` VARCHAR(255) NOT NULL,
  \`cod_amount\` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  \`shipping_fee\` DECIMAL(10, 2) NOT NULL DEFAULT 22000,
  \`status\` ENUM('PENDING','CONFIRMED','WAITING_PICKUP','PICKED_UP','IN_TRANSIT','AT_WAREHOUSE','OUT_FOR_DELIVERY','DELIVERY_FAILED','DELIVERED','RETURNING','RETURNED','CANCELLED') DEFAULT 'PENDING'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- (Tải tệp .SQL để có đủ 13 bảng và hơn 100+ bản ghi đầy đủ!)`;

  const handleDownloadSql = async () => {
    try {
      // Fetch the full rich file directly
      const response = await fetch('/database/fastship_database.sql');
      if (response.ok) {
        const text = await response.text();
        const blob = new Blob([text], { type: 'application/sql;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fastship_database.sql';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
      }
    } catch {
      // Fallback
    }

    // Direct link trigger
    const a = document.createElement('a');
    a.href = '/database/fastship_database.sql';
    a.download = 'fastship_database.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSampleSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tableSummary = [
    { name: 'roles', count: '7 vai trò', desc: 'ADMIN, Trưởng bưu cục, Điều phối, Nhân viên, Shipper, Shop, Khách hàng' },
    { name: 'warehouses', count: '12 bưu cục & hub', desc: 'Kho tổng Tân Bình, Q7, Long Biên, Cầu Giấy, Liên Chiểu, Hải Châu, Cần Thơ, Hải Phòng...' },
    { name: 'users', count: '28 tài khoản', desc: 'Đầy đủ Admin tổng, 7 Trưởng bưu cục, 5 Nhân viên quầy/kho, 8 Shipper, 6 Shop, 6 Khách hàng' },
    { name: 'shops', count: '6 cửa hàng', desc: 'Yến Fashion, TechZone Phụ Kiện, Thảo Mộc Organic, Hưng Phát, Baby Angel, Sneaker King (kèm TK ngân hàng đối soát)' },
    { name: 'shippers', count: '8 tài xế', desc: 'Biển số xe máy, tuyến đường phụ trách, số dư tiền mặt COD trong tay, đơn hoàn thành' },
    { name: 'post_office_staff', count: '5 nhân viên', desc: 'Giao dịch viên quầy, nhân viên kiểm đếm nhập kho, phân luồng tuyến đường trục' },
    { name: 'shipping_services', count: '5 gói dịch vụ', desc: 'Giao tiết kiệm, Giao nhanh 24h, Hỏa tốc 2-4h, Đường bộ liên tỉnh, Hàng nặng cồng kềnh' },
    { name: 'shipments', count: '20+ vận đơn', desc: 'Mã vận đơn chuẩn (FS-HCM..., FS-HN...), tiền COD, cước phí, đủ trạng thái từ chờ lấy đến giao thành công' },
    { name: 'shipment_status_history', count: '30+ nhật ký', desc: 'Lịch sử di chuyển từng chặng với mốc thời gian, địa điểm bưu cục, người thực hiện' },
    { name: 'reconciliation_batches', count: '8 kỳ đối soát', desc: 'Các phiên thanh toán tiền thu hộ COD cho Shop, tiền thực nhận, mã giao dịch ngân hàng' },
    { name: 'shipper_cash_deposits', count: '5 phiếu nộp tiền', desc: 'Shipper bàn giao tiền mặt COD thu được về cho thủ quỹ bưu cục' },
    { name: 'support_tickets', count: '5 khiếu nại CSKH', desc: 'Khiếu nại chậm giao, móp méo hộp, sai tiền COD, khiếu nại thái độ shipper kèm hướng xử lý' },
    { name: 'customer_addresses', count: '5 địa chỉ', desc: 'Sổ địa chỉ lấy hàng của Shop và địa chỉ nhận hàng quen thuộc của khách' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-inner">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base">Cơ Sở Dữ Liệu MySQL Chuẩn (XAMPP)</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  13 Bảng • 100+ Dữ Liệu
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Tệp cài đặt CSDL quan hệ `fastship_database.sql` sẵn sàng Import vào phpMyAdmin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSql}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-105 active:scale-98 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Tải Tệp .SQL Đầy Đủ
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
        <div className="flex border-b border-slate-200 px-6 gap-6 text-xs font-bold text-slate-500 bg-slate-50">
          <button
            onClick={() => setActiveTab('GUIDE')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'GUIDE'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" /> Hướng Dẫn Chạy XAMPP (3 Bước)
          </button>
          <button
            onClick={() => setActiveTab('TABLES')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'TABLES'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" /> Danh Sách 13 Bảng & Dữ Liệu
          </button>
          <button
            onClick={() => setActiveTab('PREVIEW')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'PREVIEW'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> Đoạn Mã CSDL Mẫu
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
          {activeTab === 'GUIDE' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-2xl text-emerald-950">
                <div className="font-extrabold text-sm mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  CSDL Đã Mở Rộng Toàn Diện: <span className="font-mono text-emerald-800">/database/fastship_database.sql</span>
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-900">
                  Cơ sở dữ liệu đã được bổ sung đầy đủ hơn 100+ bản ghi thực tế: bao gồm toàn bộ hệ thống bưu cục 3 miền, phân quyền Admin toàn quyền kiểm tra hệ thống, Trưởng bưu cục quản lý và thêm nhân viên/shipper, các cửa hàng (Shop), đơn hàng luân chuyển qua các trạm, đối soát COD và khiếu nại CSKH.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="font-black text-slate-900 flex items-center gap-2 text-xs">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">1</span>
                    Bật XAMPP
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Mở <strong>XAMPP Control Panel</strong> trên máy bạn. Bấm <strong>Start</strong> cả 2 dịch vụ <strong>Apache</strong> và <strong>MySQL</strong>.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="font-black text-slate-900 flex items-center gap-2 text-xs">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">2</span>
                    Mở phpMyAdmin
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Mở trình duyệt vào link: <br />
                    <code className="bg-white px-2 py-0.5 rounded border border-slate-200 text-emerald-700 font-bold block mt-1">http://localhost/phpmyadmin</code>
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="font-black text-slate-900 flex items-center gap-2 text-xs">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">3</span>
                    Import tệp .SQL
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Nhấn vào thẻ <strong>"Import" (Nhập)</strong> trên menu $\rightarrow$ Chọn tệp <code>fastship_database.sql</code> $\rightarrow$ Bấm <strong>"Import / Thực hiện"</strong>.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl text-[11px] space-y-2 font-mono">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5" /> Thông Số Kết Nối MySQL (Node.js / PHP / Java / Python):
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>Host: <span className="text-white font-bold">localhost</span></div>
                  <div>Port: <span className="text-white font-bold">3306</span></div>
                  <div>User: <span className="text-white font-bold">root</span></div>
                  <div>Database: <span className="text-emerald-300 font-bold">fastship_db</span></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'TABLES' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-600 text-xs">
                <span>Cấu trúc 13 bảng dữ liệu quan hệ được tạo tự động:</span>
                <span className="font-bold text-emerald-600">Đã chèn hơn 100+ bản ghi mẫu</span>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                {tableSummary.map((t, idx) => (
                  <div key={idx} className="p-3.5 hover:bg-slate-50 transition flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-emerald-700 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs">
                        {t.name}
                      </span>
                      <span className="text-slate-600 text-[11px]">{t.desc}</span>
                    </div>
                    <span className="text-slate-900 font-bold text-xs shrink-0 bg-slate-100 px-2 py-0.5 rounded-md">
                      {t.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'PREVIEW' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700">Trích đoạn mã SQL mẫu khởi tạo:</span>
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
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500">Tệp tương thích 100% với XAMPP (phpMyAdmin) & MySQL 8.x / MariaDB 10.x</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSql}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Tải Tệp .SQL Ngay
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-white transition"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
