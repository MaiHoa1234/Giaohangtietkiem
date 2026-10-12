import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { SupportTicket, PricingRule, Shipment, Warehouse, UserRole } from '../types/logistics';
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
  UserPlus,
  Bike,
  Compass,
  Warehouse as WarehouseIcon,
  Store,
  Phone,
  Mail,
  MapPin,
  X,
  Search,
  Filter,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const {
    shipments,
    allUsers,
    warehouses,
    shippers,
    pricingRule,
    updatePricingRule,
    tickets,
    updateTicketStatus,
    activityLogs,
    addShipper,
    addStaffUser,
    addWarehouse,
    resetAllData,
  } = useLogistics();

  const [activeTab, setActiveTab] = useState<
    'DASHBOARD' | 'ALL_SHIPMENTS' | 'STAFF' | 'WAREHOUSES' | 'PRICING' | 'CSKH' | 'AUDIT_LOGS'
  >('DASHBOARD');

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

  // Search & Filter for All Shipments Tab
  const [shipmentFilterStatus, setShipmentFilterStatus] = useState<string>('ALL');
  const [shipmentSearchQuery, setShipmentSearchQuery] = useState<string>('');

  // Modal: Thêm Nhân Sự Mới (Trưởng bưu cục, Nhân viên bưu cục, Shipper)
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [newStaffRole, setNewStaffRole] = useState<'DISPATCHER_MANAGER' | 'DISPATCHER_STAFF' | 'SHIPPER'>('DISPATCHER_MANAGER');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffWarehouseId, setNewStaffWarehouseId] = useState(warehouses[0]?.id || 'WH_HCM_01');
  const [newStaffVehiclePlate, setNewStaffVehiclePlate] = useState('');
  const [newStaffArea, setNewStaffArea] = useState('Quận Tân Bình');
  const [staffModalSuccess, setStaffModalSuccess] = useState('');

  // Modal: Thêm Bưu Cục / Kho Mới
  const [isAddWarehouseModalOpen, setIsAddWarehouseModalOpen] = useState(false);
  const [newWhCode, setNewWhCode] = useState('');
  const [newWhName, setNewWhName] = useState('');
  const [newWhAddress, setNewWhAddress] = useState('');
  const [newWhProvince, setNewWhProvince] = useState('TP. Hồ Chí Minh');
  const [newWhPhone, setNewWhPhone] = useState('');
  const [newWhManager, setNewWhManager] = useState('');
  const [newWhCapacity, setNewWhCapacity] = useState(15000);
  const [whModalSuccess, setWhModalSuccess] = useState('');

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

  // Filtered shipments
  const filteredAllShipments = shipments.filter((s) => {
    const matchStatus = shipmentFilterStatus === 'ALL' || s.status === shipmentFilterStatus;
    const matchQuery =
      !shipmentSearchQuery ||
      s.trackingCode.toLowerCase().includes(shipmentSearchQuery.toLowerCase()) ||
      s.sender.name.toLowerCase().includes(shipmentSearchQuery.toLowerCase()) ||
      s.receiver.name.toLowerCase().includes(shipmentSearchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

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

  // Submit create staff / shipper
  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffPhone.trim()) return;

    if (newStaffRole === 'SHIPPER') {
      addShipper({
        name: newStaffName.trim(),
        phone: newStaffPhone.trim(),
        vehiclePlate: newStaffVehiclePlate.trim() || '59P2-888.88',
        assignedArea: newStaffArea.trim() || 'Khu vực nội thành',
        warehouseId: newStaffWarehouseId,
        email: newStaffEmail.trim() || `shipper_${newStaffPhone.trim()}@fastship.vn`,
      });
      setStaffModalSuccess(`Đã thêm thành công Tài xế Shipper ${newStaffName}!`);
    } else {
      const isManager = newStaffRole === 'DISPATCHER_MANAGER';
      addStaffUser({
        name: newStaffName.trim(),
        phone: newStaffPhone.trim(),
        email: newStaffEmail.trim() || `staff_${newStaffPhone.trim()}@fastship.vn`,
        role: 'DISPATCHER',
        warehouseId: newStaffWarehouseId,
        position: isManager ? 'Trưởng bưu cục' : 'Nhân viên bưu cục / Thủ kho',
      });
      setStaffModalSuccess(
        `Đã tạo thành công tài khoản ${isManager ? 'Trưởng Bưu Cục' : 'Nhân Viên Bưu Cục'} cho ${newStaffName}!`
      );
    }

    setTimeout(() => {
      setIsAddStaffModalOpen(false);
      setStaffModalSuccess('');
      setNewStaffName('');
      setNewStaffPhone('');
      setNewStaffEmail('');
      setNewStaffVehiclePlate('');
    }, 1200);
  };

  // Submit create warehouse
  const handleCreateWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWhCode.trim() || !newWhName.trim()) return;

    addWarehouse({
      code: newWhCode.trim().toUpperCase(),
      name: newWhName.trim(),
      address: newWhAddress.trim(),
      province: newWhProvince.trim(),
      phone: newWhPhone.trim() || '028.3888.9999',
      manager: newWhManager.trim() || 'Chờ bổ nhiệm',
      capacity: Number(newWhCapacity) || 15000,
    });

    setWhModalSuccess(`Đã thêm mới Bưu cục ${newWhName} (${newWhCode}) thành công!`);
    setTimeout(() => {
      setIsAddWarehouseModalOpen(false);
      setWhModalSuccess('');
      setNewWhCode('');
      setNewWhName('');
      setNewWhAddress('');
      setNewWhManager('');
    }, 1200);
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
              Toàn quyền giám sát vận đơn toàn quốc, quản lý nhân sự bưu cục, bổ nhiệm trưởng kho & cấu hình giá cước.
            </p>
          </div>
        </div>

        {/* Action Buttons: Add Staff & Add Warehouse */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            type="button"
            onClick={() => setIsAddStaffModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-105 active:scale-98 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Thêm Nhân Sự / Shipper</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddWarehouseModalOpen(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <WarehouseIcon className="w-4 h-4" />
            <span>+ Thêm Bưu Cục Kho</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs sm:text-sm font-bold text-slate-500 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('DASHBOARD')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'DASHBOARD'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Tổng Quan KPI Toàn Quốc
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ALL_SHIPMENTS')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'ALL_SHIPMENTS'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" /> Kiểm Soát Toàn Bộ Vận Đơn ({shipments.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('STAFF')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'STAFF'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" /> Quản Lý Nhân Sự & Phân Quyền ({allUsers.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('WAREHOUSES')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'WAREHOUSES'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <WarehouseIcon className="w-4 h-4" /> Mạng Lưới Bưu Cục ({warehouses.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PRICING')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'PRICING'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" /> Bảng Giá & Phụ Phí
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('CSKH')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'CSKH'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" /> Khiếu Nại CSKH
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
            {tickets.filter((t) => t.status === 'OPEN').length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('AUDIT_LOGS')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'AUDIT_LOGS'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" /> Nhật Ký Hoạt Động
        </button>
      </div>

      {/* TAB 1: KPI DASHBOARD */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Tổng Sản Lượng Đơn</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{totalShipments}</div>
                <div className="text-[10px] text-emerald-600 font-medium mt-1">
                  Đã giao: <b>{deliveredShipments}</b> ({successRate}%)
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Doanh Thu Cước Phí</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {totalRevenue.toLocaleString('vi-VN')} <span className="text-xs font-normal">đ</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Cước thu từ shop & khách</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Tiền Thu Hộ (COD)</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {totalCodVolume.toLocaleString('vi-VN')} <span className="text-xs font-normal">đ</span>
                </div>
                <div className="text-[10px] text-indigo-600 mt-1">Đối soát an toàn T+1</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Đang Luân Chuyển</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{inTransitShipments}</div>
                <div className="text-[10px] text-amber-600 mt-1">Lỗi/Hoàn: {failedShipments} đơn</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Operational Network Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900">
                Sản Lượng Vận Hành Theo Từng Bưu Cục Trung Chuyển
              </h3>
              <div className="space-y-3 text-xs">
                {warehouses.map((wh) => (
                  <div key={wh.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{wh.name}</div>
                      <div className="text-[11px] text-slate-500">Trưởng bưu cục: {wh.manager} • SĐT: {wh.phone}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-indigo-700">{wh.currentStock} kiện tồn kho</div>
                      <div className="text-[10px] text-slate-400">Sức chứa: {wh.capacity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
              <h3 className="font-extrabold text-sm text-slate-900">Lực Lượng Vận Hành</h3>
              <div className="space-y-2.5">
                <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-600">Trưởng Bưu Cục:</span>
                  <strong className="text-indigo-700">
                    {allUsers.filter((u) => u.role === 'DISPATCHER').length} người
                  </strong>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-600">Tài Xế Shipper Giao Nhận:</span>
                  <strong className="text-amber-700">{shippers.length} tài xế</strong>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-600">Cửa Hàng (Shop Đối Tác):</span>
                  <strong className="text-teal-700">
                    {allUsers.filter((u) => u.role === 'SHOP').length} cửa hàng
                  </strong>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-600">Mạng Lưới Bưu Cục:</span>
                  <strong className="text-slate-900">{warehouses.length} điểm</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL SHIPMENTS INSPECTION (Admin kiểm tra toàn bộ đơn hàng) */}
      {activeTab === 'ALL_SHIPMENTS' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Toàn Bộ Danh Sách Vận Đơn Hệ Thống FastShip
              </h3>
              <p className="text-xs text-slate-500">
                Admin có quyền tra cứu, kiểm tra tình trạng hàng hóa và lịch trình của bất kỳ đơn nào trên toàn quốc.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm mã vận đơn, người gửi..."
                  value={shipmentSearchQuery}
                  onChange={(e) => setShipmentSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                />
              </div>

              <select
                value={shipmentFilterStatus}
                onChange={(e) => setShipmentFilterStatus(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="PENDING">Chờ xác nhận</option>
                <option value="WAITING_PICKUP">Chờ lấy hàng</option>
                <option value="IN_TRANSIT">Đang luân chuyển</option>
                <option value="OUT_FOR_DELIVERY">Đang giao hàng</option>
                <option value="DELIVERED">Đã giao thành công</option>
                <option value="DELIVERY_FAILED">Giao thất bại</option>
                <option value="RETURNING">Đang hoàn hàng</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Mã Vận Đơn</th>
                    <th className="py-3 px-4">Người Gửi (Shop)</th>
                    <th className="py-3 px-4">Người Nhận & Địa Chỉ</th>
                    <th className="py-3 px-4">Hàng Hóa & TL</th>
                    <th className="py-3 px-4">Tiền COD</th>
                    <th className="py-3 px-4">Cước Phí</th>
                    <th className="py-3 px-4">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAllShipments.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-black text-slate-900">
                        {s.trackingCode}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{s.sender.name}</div>
                        <div className="text-[10px] text-slate-400">{s.sender.province}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{s.receiver.name}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                          {s.receiver.address}, {s.receiver.province}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>{s.itemDescription}</div>
                        <span className="text-[10px] text-slate-400">{s.weightKg} kg</span>
                      </td>
                      <td className="py-3 px-4 font-extrabold text-slate-900">
                        {s.codAmount > 0 ? `${s.codAmount.toLocaleString('vi-VN')} đ` : '0 đ'}
                      </td>
                      <td className="py-3 px-4 font-bold text-teal-700">
                        {s.totalFee.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.status === 'DELIVERED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.status === 'DELIVERY_FAILED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STAFF & SHIPPERS MANAGEMENT (Admin thêm Trưởng bưu cục, Nhân viên bưu cục, Shipper) */}
      {activeTab === 'STAFF' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Danh Sách Nhân Sự & Tài Khoản Phân Quyền Toàn Hệ Thống
              </h3>
              <p className="text-xs text-slate-500">
                Admin có quyền bổ nhiệm Trưởng bưu cục mới, thêm Nhân viên bưu cục và thêm Tài xế Shipper cho bất kỳ bưu cục nào.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddStaffModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 active:scale-98 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Thêm Nhân Sự / Shipper Mới</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Nhân Sự</th>
                    <th className="py-3 px-4">Số Điện Thoại</th>
                    <th className="py-3 px-4">Email Đăng Nhập</th>
                    <th className="py-3 px-4">Vai Trò Hệ Thống</th>
                    <th className="py-3 px-4">Bưu Cục Trực Thuộc</th>
                    <th className="py-3 px-4">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allUsers.map((u) => {
                    const assignedWh = warehouses.find((w) => w.id === u.warehouseId);
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={u.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120'}
                            alt={u.name}
                            className="w-8 h-8 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{u.name}</div>
                            {u.vehiclePlate && (
                              <span className="font-mono text-[10px] text-slate-400">Xe: {u.vehiclePlate}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-slate-700">{u.phone}</td>
                        <td className="py-3 px-4 text-slate-600 font-medium">{u.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                              u.role === 'ADMIN'
                                ? 'bg-rose-100 text-rose-800'
                                : u.role === 'DISPATCHER'
                                ? 'bg-indigo-100 text-indigo-800'
                                : u.role === 'SHIPPER'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-teal-100 text-teal-800'
                            }`}
                          >
                            {u.role === 'DISPATCHER' ? 'Trưởng / NV Bưu Cục' : u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {assignedWh ? assignedWh.name : 'Tổng Công Ty'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Hoạt động
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WAREHOUSES MANAGEMENT */}
      {activeTab === 'WAREHOUSES' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Danh Sách Mạng Lưới Bưu Cục & Kho Bãi Toàn Quốc
              </h3>
              <p className="text-xs text-slate-500">
                Quản lý các điểm bưu cục trung chuyển, phân bổ sức chứa và chỉ định Trưởng bưu cục phụ trách.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddWarehouseModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <WarehouseIcon className="w-4 h-4" />
              <span>+ Thêm Bưu Cục Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {warehouses.map((wh) => (
              <div
                key={wh.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{wh.name}</h4>
                    <span className="font-mono text-slate-500 text-[11px]">{wh.code}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Bưu Cục Chuẩn
                  </span>
                </div>

                <div className="space-y-1.5 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>Địa chỉ: <strong className="text-slate-900">{wh.address}</strong></div>
                  <div>Tỉnh/TP: <strong>{wh.province}</strong></div>
                  <div>Trưởng bưu cục: <strong className="text-indigo-700">{wh.manager}</strong></div>
                  <div>Hotline: <strong className="font-mono">{wh.phone}</strong></div>
                  <div>Tồn kho: <strong className="text-emerald-700">{wh.currentStock} / {wh.capacity} kiện</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PRICING CONFIGURATION */}
      {activeTab === 'PRICING' && (
        <form onSubmit={handleSavePricing} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 max-w-2xl text-xs">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Cấu Hình Bảng Giá Cước Vận Chuyển Toàn Quốc</h3>
            <p className="text-xs text-slate-500">
              Quy tắc tính cước tự động áp dụng khi khách hàng và shop tạo đơn.
            </p>
          </div>

          {pricingSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã lưu thành công bảng giá cước mới vào hệ thống!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Cước cơ bản tiêu chuẩn (&lt; 1kg nội tỉnh):</label>
              <div className="relative">
                <input
                  type="number"
                  value={standardBase}
                  onChange={(e) => setStandardBase(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
                <span className="absolute right-3 top-2 text-slate-400">VNĐ</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Cước mỗi kg tiếp theo:</label>
              <div className="relative">
                <input
                  type="number"
                  value={perKgExtra}
                  onChange={(e) => setPerKgExtra(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
                <span className="absolute right-3 top-2 text-slate-400">VNĐ</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Hệ số Giao Nhanh (Express):</label>
              <input
                type="number"
                step="0.1"
                value={expressMult}
                onChange={(e) => setExpressMult(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Phụ phí liên tỉnh (khác tỉnh/thành):</label>
              <div className="relative">
                <input
                  type="number"
                  value={interProvSurcharge}
                  onChange={(e) => setInterProvSurcharge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
                <span className="absolute right-3 top-2 text-slate-400">VNĐ</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Thay Đổi Bảng Giá Cước</span>
          </button>
        </form>
      )}

      {/* TAB 6: CSKH TICKETS */}
      {activeTab === 'CSKH' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <h3 className="font-extrabold text-sm text-slate-900">Xử Lý Khiếu Nại & Hỗ Trợ Khách Hàng (CSKH)</h3>

          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{t.customerName}</span>
                    <span className="text-slate-400">({t.customerPhone})</span>
                    <span className="font-mono text-indigo-700 font-bold">Mã: {t.trackingCode}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {t.status === 'RESOLVED' ? 'Đã giải quyết' : 'Đang chờ xử lý'}
                  </span>
                </div>

                <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                  {t.description}
                </p>

                {t.status !== 'RESOLVED' && (
                  <div className="pt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Nhập nội dung giải quyết cho khách..."
                      value={resolvingTicketId === t.id ? resolutionText : ''}
                      onChange={(e) => {
                        setResolvingTicketId(t.id);
                        setResolutionText(e.target.value);
                      }}
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleResolveTicket(t.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer shrink-0"
                    >
                      Duyệt Xong
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: AUDIT LOGS */}
      {activeTab === 'AUDIT_LOGS' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-xs text-slate-700">
            Lịch Sử Thao Tác Nghiệp Vụ Toàn Hệ Thống (Audit Trail)
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {activityLogs.map((log) => (
              <div key={log.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <span className="font-bold text-slate-900">{log.action}: </span>
                  <span className="text-slate-600">{log.details}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">{log.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL THÊM NHÂN SỰ MỚI (Admin thêm Trưởng bưu cục, Nhân viên bưu cục, Shipper) */}
      {isAddStaffModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-sm text-slate-900">Thêm Nhân Sự Mới Vào Hệ Thống</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddStaffModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {staffModalSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="font-bold">{staffModalSuccess}</p>
                <p className="text-[11px] text-slate-500">Tài khoản đã được tạo và kích hoạt thành công!</p>
              </div>
            ) : (
              <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chọn vai trò bổ nhiệm:</label>
                  <select
                    value={newStaffRole}
                    onChange={(e) =>
                      setNewStaffRole(e.target.value as 'DISPATCHER_MANAGER' | 'DISPATCHER_STAFF' | 'SHIPPER')
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
                  >
                    <option value="DISPATCHER_MANAGER">Trưởng Bưu Cục / Trưởng Kho (Điều Phối Viên Cấp Cao)</option>
                    <option value="DISPATCHER_STAFF">Nhân Viên Bưu Cục (Thủ Kho / Quét Mã Vạch)</option>
                    <option value="SHIPPER">Tài Xế Shipper (Nhận Đơn & Giao Nhận Hàng)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Họ và tên nhân sự:</label>
                    <input
                      type="text"
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      placeholder="VD: Trần Văn Hùng"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số điện thoại:</label>
                    <input
                      type="tel"
                      value={newStaffPhone}
                      onChange={(e) => setNewStaffPhone(e.target.value)}
                      placeholder="09xx xxx xxx"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email đăng nhập:</label>
                  <input
                    type="email"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    placeholder="email@fastship.vn"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Nếu để trống, hệ thống sẽ tự sinh email theo SĐT. Mật khẩu mặc định: <b>123456</b>
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bưu cục / Kho công tác:</label>
                  <select
                    value={newStaffWarehouseId}
                    onChange={(e) => setNewStaffWarehouseId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
                  >
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.id}>
                        {wh.name} ({wh.code}) - {wh.province}
                      </option>
                    ))}
                  </select>
                </div>

                {newStaffRole === 'SHIPPER' && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Biển số xe máy:</label>
                      <input
                        type="text"
                        value={newStaffVehiclePlate}
                        onChange={(e) => setNewStaffVehiclePlate(e.target.value)}
                        placeholder="59P2-999.88"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tuyến đường phụ trách:</label>
                      <input
                        type="text"
                        value={newStaffArea}
                        onChange={(e) => setNewStaffArea(e.target.value)}
                        placeholder="Quận Tân Bình, Phú Nhuận..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 active:scale-98 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
                  >
                    Tạo Tài Khoản & Bổ Nhiệm Nhân Sự
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL THÊM BƯU CỤC MỚI */}
      {isAddWarehouseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <WarehouseIcon className="w-5 h-5 text-indigo-600" />
                <h3 className="font-black text-sm text-slate-900">Thêm Mới Bưu Cục Trung Chuyển</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddWarehouseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {whModalSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="font-bold">{whModalSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleCreateWarehouse} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mã bưu cục (Code):</label>
                    <input
                      type="text"
                      value={newWhCode}
                      onChange={(e) => setNewWhCode(e.target.value)}
                      placeholder="VD: HUB-Q1-HCM"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tỉnh / Thành Phố:</label>
                    <input
                      type="text"
                      value={newWhProvince}
                      onChange={(e) => setNewWhProvince(e.target.value)}
                      placeholder="TP. Hồ Chí Minh"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên Bưu Cục / Kho:</label>
                  <input
                    type="text"
                    value={newWhName}
                    onChange={(e) => setNewWhName(e.target.value)}
                    placeholder="VD: Bưu Cục Quận 1 - Hai Bà Trưng"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Địa chỉ chi tiết:</label>
                  <input
                    type="text"
                    value={newWhAddress}
                    onChange={(e) => setNewWhAddress(e.target.value)}
                    placeholder="VD: Số 18 Hai Bà Trưng, P. Bến Nghé, Quận 1"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Trưởng bưu cục quản lý:</label>
                    <input
                      type="text"
                      value={newWhManager}
                      onChange={(e) => setNewWhManager(e.target.value)}
                      placeholder="VD: Nguyễn Văn Nam"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sức chứa (Kiện):</label>
                    <input
                      type="number"
                      value={newWhCapacity}
                      onChange={(e) => setNewWhCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
                  >
                    Xác Nhận Tạo Bưu Cục Mới
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
