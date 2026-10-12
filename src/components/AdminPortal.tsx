import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { SupportTicket, PricingRule } from '../types/logistics';
import {
  ShieldCheck,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  FileText,
  DollarSign,
  TrendingUp,
  Package,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Save,
  MessageSquare,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const {
    shipments,
    allUsers,
    pricingRule,
    updatePricingRule,
    tickets,
    updateTicketStatus,
    activityLogs,
    resetAllData,
  } = useLogistics();

  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'USERS' | 'PRICING' | 'CSKH' | 'AUDIT_LOGS'>('DASHBOARD');

  // Pricing form states
  const [standardBase, setStandardBase] = useState(pricingRule.standardBaseFee);
  const [perKgExtra, setPerKgExtra] = useState(pricingRule.standardPerKgExtra);
  const [expressMult, setExpressMult] = useState(pricingRule.expressMultiplier);
  const [superFastMult, setSuperFastMult] = useState(pricingRule.superFastMultiplier);
  const [interProvSurcharge, setInterProvSurcharge] = useState(pricingRule.interProvinceSurcharge);
  const [pricingSaved, setPricingSaved] = useState(false);

  // Ticket resolution state
  const [resolvingTicketId, setResolvingTicketId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  // Dashboard KPI Metrics calculations
  const totalShipments = shipments.length;
  const deliveredShipments = shipments.filter((s) => s.status === 'DELIVERED').length;
  const inTransitShipments = shipments.filter((s) =>
    ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'AT_WAREHOUSE'].includes(s.status)
  ).length;
  const failedShipments = shipments.filter((s) =>
    ['DELIVERY_FAILED', 'RETURNING', 'RETURNED'].includes(s.status)
  ).length;

  const successRate = totalShipments > 0 ? ((deliveredShipments / totalShipments) * 100).toFixed(1) : '100';

  const totalCodVolume = shipments.reduce((sum, s) => sum + s.codAmount, 0);
  const totalRevenue = shipments.reduce((sum, s) => sum + s.totalFee, 0);

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    updatePricingRule({
      standardBaseFee: standardBase,
      standardPerKgExtra: perKgExtra,
      expressMultiplier: expressMult,
      superFastMultiplier: superFastMult,
      interProvinceSurcharge: interProvSurcharge,
    });
    setPricingSaved(true);
    setTimeout(() => setPricingSaved(false), 3000);
  };

  const handleResolveTicket = (ticketId: string) => {
    updateTicketStatus(ticketId, 'RESOLVED', resolutionText || 'Đã giải quyết thỏa đáng khiếu nại của khách hàng.');
    setResolvingTicketId(null);
    setResolutionText('');
  };

  return (
    <div className="space-y-6">
      {/* Admin Top Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-bold text-emerald-400 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black">Bảng Điều Khiển Quản Trị Hệ Thống (Admin Portal)</h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 bg-emerald-400 text-slate-950 rounded-full">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Quản trị toàn diện vận đơn, bảng giá cước, người dùng và chất lượng dịch vụ CSKH.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={() => {
              if (window.confirm('Khôi phục toàn bộ cơ sở dữ liệu mẫu ban đầu của đồ án?')) {
                resetAllData();
              }
            }}
            className="px-4 py-2 bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/40 text-rose-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Đặt Lại Dữ Liệu Gốc
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs sm:text-sm font-bold text-slate-500 overflow-x-auto">
        <button
          onClick={() => setActiveTab('DASHBOARD')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'DASHBOARD'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Tổng Quan & KPI (AD12 - AD13)
        </button>

        <button
          onClick={() => setActiveTab('USERS')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'USERS'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" /> Tài Khoản & Phân Quyền (AD01 - AD02)
        </button>

        <button
          onClick={() => setActiveTab('PRICING')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'PRICING'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" /> Cấu Hình Bảng Giá (AD05)
        </button>

        <button
          onClick={() => setActiveTab('CSKH')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'CSKH'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" /> Khiếu Nại & CSKH (AD10)
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
            {tickets.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT_LOGS')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'AUDIT_LOGS'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" /> Nhật Ký Hoạt Động (AD14)
        </button>

        <button
          onClick={() => setActiveTab('DATABASE_SETUP' as any)}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            (activeTab as any) === 'DATABASE_SETUP'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-indigo-600 hover:text-indigo-800'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          CSDL MySQL (XAMPP .sql)
        </button>
      </div>

      {/* Quick MySQL banner on Dashboard */}
      {activeTab === 'DASHBOARD' && (
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <div className="font-extrabold text-sm flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 font-mono text-[10px] font-bold">MYSQL 5.7+</span>
              Cơ sở dữ liệu mẫu cho XAMPP: <code className="text-emerald-400">/database/fastship_database.sql</code>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Bao gồm 11 bảng quan hệ đã chèn sẵn dữ liệu mẫu thực tế, import trực tiếp vào <strong>phpMyAdmin</strong> chỉ trong 1 bước.
            </p>
          </div>
          <button
            onClick={() => {
              const fullSql = `-- ==============================================================================
-- FASTSHIP DATABASE MYSQL DUMP FOR XAMPP PHPMYADMIN
-- ==============================================================================
SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS \`fastship_db\`;
CREATE DATABASE \`fastship_db\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`fastship_db\`;
-- Tệp SQL hoàn chỉnh sẵn sàng chạy trên XAMPP`;
              const blob = new Blob([fullSql], { type: 'application/sql' });
              const a = document.createElement('a');
              a.href = '/database/fastship_database.sql';
              a.download = 'fastship_database.sql';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-xs rounded-xl transition shadow-xs shrink-0"
          >
            Tải Tệp fastship_database.sql
          </button>
        </div>
      )}

      {/* TAB 1: DASHBOARD & KPI */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-6">
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-gray-500 uppercase">Tổng Vận Đơn</span>
              <div className="text-3xl font-black text-gray-900">{totalShipments}</div>
              <p className="text-[11px] text-emerald-600 font-medium">
                Giao thành công: <strong>{deliveredShipments}</strong> đơn
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-gray-500 uppercase">Tỷ Lệ Giao Thành Công</span>
              <div className="text-3xl font-black text-emerald-700">{successRate}%</div>
              <p className="text-[11px] text-gray-500">
                Tồn đang xử lý: <strong>{inTransitShipments}</strong> đơn
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-gray-500 uppercase">Doanh Thu Cước Phí</span>
              <div className="text-2xl font-black text-indigo-700">
                {totalRevenue.toLocaleString('vi-VN')} <span className="text-xs font-semibold">đ</span>
              </div>
              <p className="text-[11px] text-gray-500">Cước vận tải đã tính toán</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-gray-500 uppercase">Tổng COD Luân Chuyển</span>
              <div className="text-2xl font-black text-red-600">
                {totalCodVolume.toLocaleString('vi-VN')} <span className="text-xs font-semibold">đ</span>
              </div>
              <p className="text-[11px] text-gray-500">Dòng tiền thu hộ các shop</p>
            </div>
          </div>

          {/* Operational Status Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-gray-900 text-sm">Phân Bổ Vận Đơn Theo Trạng Thái</h3>
              <div className="space-y-2 text-xs">
                {[
                  { label: 'Giao Thành Công (DELIVERED)', count: deliveredShipments, color: 'bg-emerald-500' },
                  { label: 'Đang Vận Chuyển / Giao (IN_TRANSIT & OUT)', count: inTransitShipments, color: 'bg-blue-500' },
                  { label: 'Thất Bại / Chuyển Hoàn (FAILED & RETURNING)', count: failedShipments, color: 'bg-amber-500' },
                  { label: 'Mới Tạo / Chờ Lấy (PENDING & WAITING)', count: totalShipments - deliveredShipments - inTransitShipments - failedShipments, color: 'bg-gray-400' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-gray-700">
                      <span>{item.label}</span>
                      <span className="font-bold">{item.count} đơn</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${item.color} h-2 rounded-full`}
                        style={{
                          width: `${totalShipments > 0 ? (item.count / totalShipments) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-gray-900 text-sm">Biểu Đồ Sản Lượng 7 Ngày Qua (Mô phỏng)</h3>
              <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2 border-b border-gray-200 text-center">
                {[
                  { day: 'T2', val: 45 },
                  { day: 'T3', val: 68 },
                  { day: 'T4', val: 55 },
                  { day: 'T5', val: 82 },
                  { day: 'T6', val: 94 },
                  { day: 'T7', val: 78 },
                  { day: 'CN', val: 62 },
                ].map((col, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[10px] font-bold text-emerald-800 opacity-0 group-hover:opacity-100 transition">
                      {col.val}
                    </span>
                    <div
                      className="w-full bg-emerald-500 group-hover:bg-emerald-600 rounded-t-md transition-all"
                      style={{ height: `${(col.val / 100) * 120}px` }}
                    />
                    <span className="text-[11px] font-semibold text-gray-500">{col.day}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 text-center">
                Sản lượng trung bình: <strong>69.1 đơn / ngày</strong> | Tăng trưởng 14% so với tuần trước
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS & ROLES */}
      {activeTab === 'USERS' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-bold text-gray-900 text-base">Quản Lý Danh Sách Người Dùng & Vai Trò (AD01 - AD02)</h3>
            <p className="text-xs text-gray-500">
              Kiểm soát tài khoản Khách hàng, Chủ shop, Shipper, Nhân viên điều phối kho và Quản trị viên.
            </p>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Họ Tên</th>
                  <th className="p-3">Số Điện Thoại</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Vai Trò Hệ Thống</th>
                  <th className="p-3">Thông Tin Chi Tiết</th>
                  <th className="p-3 text-center">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="p-3 font-semibold text-gray-900">{u.name}</td>
                    <td className="p-3 font-mono">{u.phone}</td>
                    <td className="p-3 text-gray-600">{u.email}</td>
                    <td className="p-3">
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500">
                      {u.shopName || u.vehiclePlate || u.warehouseId || '-'}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                        Đang hoạt động
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PRICING CONFIGURATION */}
      {activeTab === 'PRICING' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5 max-w-2xl">
          <div className="border-b pb-3">
            <h3 className="font-bold text-gray-900 text-base">Cấu Hình Bảng Giá Cước Vận Chuyển (AD05)</h3>
            <p className="text-xs text-gray-500">
              Quy tắc tính phí tự động áp dụng cho toàn bộ đơn hàng mới trên hệ thống.
            </p>
          </div>

          <form onSubmit={handleSavePricing} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Cước Cơ Bản Nội Tỉnh (&lt; 1kg):
              </label>
              <input
                type="number"
                step="1000"
                value={standardBase}
                onChange={(e) => setStandardBase(parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Phụ Phí Mỗi kg Tiếp Theo (đ/kg):
              </label>
              <input
                type="number"
                step="1000"
                value={perKgExtra}
                onChange={(e) => setPerKgExtra(parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Phụ Cước Tuyến Liên Tỉnh (đ):
              </label>
              <input
                type="number"
                step="1000"
                value={interProvSurcharge}
                onChange={(e) => setInterProvSurcharge(parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Hệ Số Giao Nhanh 24h:
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={expressMult}
                  onChange={(e) => setExpressMult(parseFloat(e.target.value) || 1)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Hệ Số Hỏa Tốc (2-4h):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={superFastMult}
                  onChange={(e) => setSuperFastMult(parseFloat(e.target.value) || 1)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm font-semibold"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {pricingSaved && (
                <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Đã lưu cấu hình bảng giá mới!
                </span>
              )}
              <button
                type="submit"
                className="ml-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Lưu Thay Đổi Bảng Giá
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: CSKH & COMPLAINTS */}
      {activeTab === 'CSKH' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-bold text-gray-900 text-base">Trung Tâm Tiếp Nhận & Xử Lý Khiếu Nại (AD10)</h3>
            <p className="text-xs text-gray-500">
              Giải quyết yêu cầu bồi thường, chậm trễ, sai lệch COD và phản ánh chất lượng giao nhận.
            </p>
          </div>

          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-gray-900">{t.id}</span>
                    <span className="font-mono text-gray-600">[{t.trackingCode}]</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        t.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.status === 'RESOLVED' ? 'Đã Xử Lý' : 'Đang Xử Lý'}
                    </span>
                  </div>
                  <span className="text-gray-400">{t.createdAt}</span>
                </div>

                <div className="text-gray-700">
                  <strong>Khách hàng:</strong> {t.customerName} ({t.customerPhone}) •{' '}
                  <span className="font-semibold text-rose-700">Loại: {t.category}</span>
                </div>

                <p className="text-gray-800 bg-white p-2.5 rounded-lg border">{t.description}</p>

                {t.resolution && (
                  <div className="text-emerald-900 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <strong>Kết quả xử lý:</strong> {t.resolution}
                  </div>
                )}

                {t.status !== 'RESOLVED' && (
                  <div className="pt-2 flex justify-end">
                    {resolvingTicketId === t.id ? (
                      <div className="w-full space-y-2">
                        <textarea
                          rows={2}
                          placeholder="Nhập nội dung phương án xử lý / bồi thường..."
                          value={resolutionText}
                          onChange={(e) => setResolutionText(e.target.value)}
                          className="w-full border rounded-lg p-2 text-xs"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setResolvingTicketId(null)}
                            className="px-3 py-1.5 border rounded-lg"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={() => handleResolveTicket(t.id)}
                            className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg"
                          >
                            Hoàn Tất Giải Quyết
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setResolvingTicketId(t.id)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                      >
                        Tiếp Nhận & Xử Lý Ticket
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT ACTIVITY LOGS */}
      {activeTab === 'AUDIT_LOGS' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-bold text-gray-900 text-base">Nhật Ký Hoạt Động Hệ Thống (Audit Logs - AD14)</h3>
            <p className="text-xs text-gray-500">
              Ghi lại mọi tác vụ tạo đơn, đổi trạng thái, thu tiền COD và can thiệp điều phối để truy vết bảo mật.
            </p>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Thời Gian</th>
                  <th className="p-3">Người Thao Tác</th>
                  <th className="p-3">Vai Trò</th>
                  <th className="p-3">Hành Động</th>
                  <th className="p-3">Chi Tiết Tác Vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="p-3 text-gray-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-3 font-semibold text-gray-900">{log.user}</td>
                    <td className="p-3">
                      <span className="font-bold text-[10px] px-2 py-0.5 bg-gray-100 rounded-sm">
                        {log.role}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-emerald-800">{log.action}</td>
                    <td className="p-3 text-gray-700">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: DATABASE SETUP FOR XAMPP */}
      {(activeTab as any) === 'DATABASE_SETUP' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5 text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base">Cơ Sở Dữ Liệu MySQL Chuẩn Cho XAMPP (phpMyAdmin)</h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Tệp SQL đầy đủ các bảng dữ liệu, khóa ngoại, ràng buộc và dữ liệu mẫu thực tế.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <div className="font-bold text-slate-900 text-sm">1. Khởi động MySQL</div>
              <p className="text-slate-500 text-[11px]">Bật Apache và MySQL trong ứng dụng XAMPP Control Panel.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <div className="font-bold text-slate-900 text-sm">2. Mở phpMyAdmin</div>
              <p className="text-slate-500 text-[11px]">Truy cập <code>http://localhost/phpmyadmin</code> trên trình duyệt.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <div className="font-bold text-slate-900 text-sm">3. Nhập tệp .sql</div>
              <p className="text-slate-500 text-[11px]">Vào mục <strong>Import (Nhập)</strong> chọn file và bấm Thực hiện.</p>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-bold text-indigo-950 text-sm">Đường dẫn tệp SQL trong dự án:</div>
              <code className="text-indigo-800 font-mono text-xs font-semibold">/database/fastship_database.sql</code>
            </div>
            <a
              href="/database/fastship_database.sql"
              download="fastship_database.sql"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs text-xs"
            >
              Tải Xuống Tệp fastship_database.sql
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
