import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { VIETNAM_PROVINCES } from '../data/vietnamProvinces';
import { Shipment, ShipmentStatus, ServiceType, PayerType } from '../types/logistics';
import {
  PackagePlus,
  Package,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MapPin,
  Phone,
  Printer,
  ChevronRight,
  BookOpen,
  DollarSign,
  Plus,
  Send,
  Eye,
  MessageSquareWarning,
  Star,
  Zap,
  Sparkles,
  ShieldCheck,
  User,
  ArrowRight,
  Trash2,
} from 'lucide-react';

interface CustomerPortalProps {
  onTrackCode: (code: string) => void;
  onOpenWaybill: (shipment: Shipment) => void;
  onOpenTicketModal: (code: string) => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  onTrackCode,
  onOpenWaybill,
  onOpenTicketModal,
}) => {
  const {
    currentUser,
    shipments,
    addresses,
    createShipment,
    cancelShipment,
    calculateFee,
    createCustomerAddress,
    deleteCustomerAddress,
  } = useLogistics();

  const [activeTab, setActiveTab] = useState<'MY_ORDERS' | 'CREATE_ORDER' | 'ADDRESS_BOOK' | 'COD_WALLET'>('MY_ORDERS');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Form states for creating a new shipment
  const [senderName, setSenderName] = useState(currentUser.name);
  const [senderPhone, setSenderPhone] = useState(currentUser.phone || '0912345678');
  const [senderAddress, setSenderAddress] = useState('220 Lê Văn Sỹ, Phường 14');
  const [senderDistrict, setSenderDistrict] = useState('Quận 3');
  const [senderProvince, setSenderProvince] = useState('TP. Hồ Chí Minh');

  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [receiverDistrict, setReceiverDistrict] = useState('Quận 1');
  const [receiverProvince, setReceiverProvince] = useState('TP. Hồ Chí Minh');

  const [itemDescription, setItemDescription] = useState('Quần áo thời trang');
  const [weightKg, setWeightKg] = useState(0.5);
  const [lengthCm, setLengthCm] = useState(25);
  const [widthCm, setWidthCm] = useState(15);
  const [heightCm, setHeightCm] = useState(8);
  const [serviceType, setServiceType] = useState<ServiceType>('STANDARD');
  const [payer, setPayer] = useState<PayerType>('RECEIVER_PAY');
  const [codAmount, setCodAmount] = useState(0);
  const [notesForShipper, setNotesForShipper] = useState('Cho xem hàng, không thử');
  const [orderCreatedSuccess, setOrderCreatedSuccess] = useState<Shipment | null>(null);

  // New address modal
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState('');
  const [newAddrContact, setNewAddrContact] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrDistrict, setNewAddrDistrict] = useState('Quận 1');
  const [newAddrProvince, setNewAddrProvince] = useState('TP. Hồ Chí Minh');

  // Filter shipments
  const myShipments = shipments.filter((s) => {
    const matchesKeyword =
      s.trackingCode.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      s.receiver.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      s.receiver.phone.includes(searchKeyword);

    if (!matchesKeyword) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'IN_PROGRESS') {
      return ['PENDING', 'CONFIRMED', 'WAITING_PICKUP', 'PICKED_UP', 'IN_TRANSIT', 'AT_WAREHOUSE', 'OUT_FOR_DELIVERY'].includes(s.status);
    }
    if (statusFilter === 'DELIVERED') return s.status === 'DELIVERED';
    if (statusFilter === 'FAILED') return s.status === 'DELIVERY_FAILED' || s.status === 'RETURNING';
    if (statusFilter === 'CANCELLED') return s.status === 'CANCELLED';
    return true;
  });

  // Calculate live fee for the form
  const feeCalculation = calculateFee({
    weightKg,
    lengthCm,
    widthCm,
    heightCm,
    serviceType,
    senderProvince,
    receiverProvince,
    codAmount,
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverName.trim() || !receiverPhone.trim() || !receiverAddress.trim()) {
      alert('Vui lòng điền đầy đủ thông tin người nhận (Họ tên, SĐT, Địa chỉ)!');
      return;
    }

    const newShipment = createShipment({
      sender: {
        name: senderName,
        phone: senderPhone,
        address: senderAddress,
        district: senderDistrict,
        province: senderProvince,
      },
      receiver: {
        name: receiverName,
        phone: receiverPhone,
        address: receiverAddress,
        district: receiverDistrict,
        province: receiverProvince,
      },
      itemDescription,
      weightKg,
      dimensions: { lengthCm, widthCm, heightCm },
      serviceType,
      payer,
      codAmount,
      shippingFee: feeCalculation.shippingFee,
      insuranceFee: feeCalculation.insuranceFee,
      totalFee: feeCalculation.totalFee,
      notesForShipper,
    });

    setOrderCreatedSuccess(newShipment);
    setReceiverName('');
    setReceiverPhone('');
    setReceiverAddress('');
    setCodAmount(0);
  };

  const handleCancelOrder = (code: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${code}?`)) {
      cancelShipment(code, 'Người gửi chủ động yêu cầu hủy trên hệ thống');
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLabel || !newAddrContact || !newAddrStreet) return;
    createCustomerAddress({
      label: newAddrLabel,
      contactName: newAddrContact,
      phone: newAddrPhone,
      address: newAddrStreet,
      district: newAddrDistrict,
      province: newAddrProvince,
      isDefault: false,
    });
    setShowAddAddress(false);
    setNewAddrLabel('');
    setNewAddrContact('');
    setNewAddrStreet('');
  };

  const totalDeliveredCod = myShipments
    .filter((s) => s.status === 'DELIVERED')
    .reduce((sum, s) => sum + s.codAmount, 0);

  const pendingCod = myShipments
    .filter((s) => s.status !== 'DELIVERED' && s.status !== 'CANCELLED')
    .reduce((sum, s) => sum + s.codAmount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner with soft gradient */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center text-white font-bold text-2xl backdrop-blur-md shadow-inner">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                currentUser.name.charAt(0)
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black">{currentUser.name}</h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 bg-emerald-400 text-slate-950 rounded-full">
                  Khách Hàng Cá Nhân
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-1">
                SĐT: <span className="font-mono font-bold text-white">{currentUser.phone || '0912345678'}</span> | Email: {currentUser.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('CREATE_ORDER')}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg hover:brightness-105 active:scale-98 transition"
            >
              <PackagePlus className="w-4 h-4" /> Tạo Đơn Giao Hàng Mới
            </button>
          </div>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs sm:text-sm font-bold text-slate-500 overflow-x-auto">
        <button
          onClick={() => setActiveTab('MY_ORDERS')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'MY_ORDERS'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" /> Danh Sách Đơn Hàng ({myShipments.length})
        </button>

        <button
          onClick={() => setActiveTab('CREATE_ORDER')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'CREATE_ORDER'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <PackagePlus className="w-4 h-4" /> Tạo Đơn Vận Chuyển (KH05 - KH08)
        </button>

        <button
          onClick={() => setActiveTab('ADDRESS_BOOK')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ADDRESS_BOOK'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Sổ Địa Chỉ (KH04)
        </button>

        <button
          onClick={() => setActiveTab('COD_WALLET')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'COD_WALLET'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" /> Quản Lý COD & Tiền Thu Hộ (KH11)
        </button>
      </div>

      {/* TAB 1: MY ORDERS */}
      {activeTab === 'MY_ORDERS' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm mã vận đơn, người nhận, số điện thoại..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
              {[
                { key: 'ALL', label: 'Tất cả' },
                { key: 'IN_PROGRESS', label: 'Đang vận chuyển' },
                { key: 'DELIVERED', label: 'Đã giao' },
                { key: 'FAILED', label: 'Thất bại / Hoàn' },
                { key: 'CANCELLED', label: 'Đã hủy' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    statusFilter === f.key
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Shipment Cards Grid */}
          <div className="space-y-3">
            {myShipments.map((shipment) => {
              const canCancel = ['PENDING', 'CONFIRMED', 'WAITING_PICKUP'].includes(shipment.status);
              return (
                <div
                  key={shipment.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-emerald-300 hover:shadow-md transition text-xs space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {shipment.trackingCode}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          shipment.status === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : shipment.status === 'OUT_FOR_DELIVERY'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : shipment.status === 'DELIVERY_FAILED'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : shipment.status === 'CANCELLED'
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}
                      >
                        {shipment.status}
                      </span>
                    </div>

                    <div className="text-slate-400 text-[11px]">
                      Tạo lúc: <strong className="text-slate-700">{shipment.createdAt}</strong>
                    </div>
                  </div>

                  {/* Sender & Receiver Info 3-Cols */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-extrabold block">
                        Người gửi
                      </span>
                      <div className="font-bold text-slate-900 mt-0.5">{shipment.sender.name}</div>
                      <div className="text-slate-500 font-mono text-[11px]">{shipment.sender.phone}</div>
                      <div className="text-slate-600 line-clamp-1 mt-0.5">
                        {shipment.sender.address}, {shipment.sender.district}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-extrabold block">
                        Người nhận
                      </span>
                      <div className="font-bold text-emerald-900 mt-0.5">{shipment.receiver.name}</div>
                      <div className="text-slate-500 font-mono text-[11px] font-bold">{shipment.receiver.phone}</div>
                      <div className="text-slate-600 line-clamp-1 mt-0.5">
                        {shipment.receiver.address}, {shipment.receiver.district}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 p-3 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                      <div className="flex justify-between items-baseline">
                        <span className="text-slate-500 font-medium">Tiền thu COD:</span>
                        <span className="text-sm font-black text-rose-600">
                          {shipment.codAmount.toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline mt-1">
                        <span className="text-slate-500 font-medium">Cước vận chuyển:</span>
                        <span className="font-bold text-slate-800">
                          {shipment.totalFee.toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Gói: <strong className="text-emerald-700">{shipment.serviceType}</strong> ({shipment.weightKg} kg)
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-[11px]">
                    <div className="text-slate-500">
                      <strong>Hàng hóa:</strong> {shipment.itemDescription}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onTrackCode(shipment.trackingCode)}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-xs hover:brightness-105 transition flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" /> Xem Hành Trình (KH10)
                      </button>

                      <button
                        onClick={() => onOpenWaybill(shipment)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl border border-slate-200 transition flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" /> In Vận Đơn A6
                      </button>

                      {canCancel && (
                        <button
                          onClick={() => handleCancelOrder(shipment.trackingCode)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 transition"
                        >
                          Hủy Đơn
                        </button>
                      )}

                      <button
                        onClick={() => onOpenTicketModal(shipment.trackingCode)}
                        className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg transition"
                        title="Khiếu nại / CSKH"
                      >
                        <MessageSquareWarning className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {myShipments.length === 0 && (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 text-xs">
                Không tìm thấy đơn hàng nào trong phân hệ này.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CREATE ORDER (Clean Corporate Form - "Chuẩn Form") */}
      {activeTab === 'CREATE_ORDER' && (
        <div className="space-y-6">
          {orderCreatedSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="font-bold text-base flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Tạo đơn hàng thành công!
                </div>
                <p className="text-xs text-emerald-700 mt-1">
                  Mã vận đơn:{' '}
                  <span className="font-mono font-black text-sm text-slate-900">
                    {orderCreatedSuccess.trackingCode}
                  </span>
                  . Kiện hàng đã được đưa vào luồng điều phối lấy hàng.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onOpenWaybill(orderCreatedSuccess)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> In Phiếu Gửi A6
                </button>
                <button
                  onClick={() => setOrderCreatedSuccess(null)}
                  className="px-3 py-2 bg-white border border-slate-300 text-slate-700 text-xs rounded-xl hover:bg-slate-50 font-medium"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleCreateOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Structured Standard Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Section 1: Người gửi */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs">
                      1
                    </div>
                    Thông Tin Người Gửi (Lấy Hàng)
                  </h3>
                  <span className="text-[11px] text-slate-400">Sổ địa chỉ người gửi</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Họ tên người gửi <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Số điện thoại <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-mono font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Tỉnh / Thành phố <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={senderProvince}
                      onChange={(e) => setSenderProvince(e.target.value)}
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition"
                    >
                      {VIETNAM_PROVINCES.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Quận / Huyện <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={senderDistrict}
                      onChange={(e) => setSenderDistrict(e.target.value)}
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">
                      Địa chỉ chi tiết (Số nhà, ngõ/ngách, tên đường) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={senderAddress}
                      onChange={(e) => setSenderAddress(e.target.value)}
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Người nhận */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-black text-xs">
                      2
                    </div>
                    Thông Tin Người Nhận Hàng
                  </h3>
                  <span className="text-[11px] text-rose-500 font-semibold">* Bắt buộc</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Họ tên người nhận <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Nguyễn Văn Anh"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Số điện thoại nhận hàng <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="VD: 0987112233"
                      value={receiverPhone}
                      onChange={(e) => setReceiverPhone(e.target.value)}
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-mono font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Tỉnh / Thành phố nhận <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={receiverProvince}
                      onChange={(e) => setReceiverProvince(e.target.value)}
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition"
                    >
                      {VIETNAM_PROVINCES.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Quận / Huyện nhận <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Quận 1"
                      value={receiverDistrict}
                      onChange={(e) => setReceiverDistrict(e.target.value)}
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">
                      Địa chỉ nhận hàng chi tiết <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: 152 Hai Bà Trưng, Phường Đa Kao"
                      value={receiverAddress}
                      onChange={(e) => setReceiverAddress(e.target.value)}
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Hàng hóa & Dịch vụ */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs">
                      3
                    </div>
                    Thông Tin Kiện Hàng & Gói Dịch Vụ
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Tên mặt hàng / Mô tả:</label>
                    <input
                      type="text"
                      value={itemDescription}
                      onChange={(e) => setItemDescription(e.target.value)}
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Khối lượng thực tế (kg):</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={weightKg}
                      onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0.1)}
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-emerald-800"
                    />
                  </div>
                </div>

                {/* Dimensions */}
                <div className="text-xs">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Kích thước DxRxC (cm):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      placeholder="Dài"
                      value={lengthCm}
                      onChange={(e) => setLengthCm(parseInt(e.target.value) || 10)}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-center"
                    />
                    <input
                      type="number"
                      placeholder="Rộng"
                      value={widthCm}
                      onChange={(e) => setWidthCm(parseInt(e.target.value) || 10)}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-center"
                    />
                    <input
                      type="number"
                      placeholder="Cao"
                      value={heightCm}
                      onChange={(e) => setHeightCm(parseInt(e.target.value) || 5)}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-center"
                    />
                  </div>
                </div>

                {/* Service Tiers */}
                <div className="text-xs space-y-1.5 pt-1">
                  <label className="block text-slate-700 font-semibold">Gói dịch vụ vận chuyển:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { type: 'STANDARD', title: 'Tiết Kiệm', sub: '2-3 ngày' },
                      { type: 'EXPRESS', title: 'Giao Nhanh', sub: '24 giờ' },
                      { type: 'SUPER_FAST', title: 'Hỏa Tốc', sub: '2-4 giờ' },
                    ].map((s) => (
                      <button
                        type="button"
                        key={s.type}
                        onClick={() => setServiceType(s.type as ServiceType)}
                        className={`p-2.5 rounded-xl border text-left transition ${
                          serviceType === s.type
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="font-bold text-xs">{s.title}</div>
                        <div className="text-[10px] text-slate-400">{s.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes for Shipper */}
                <div className="text-xs">
                  <label className="block text-slate-700 font-semibold mb-1">Chỉ dẫn cho Shipper:</label>
                  <input
                    type="text"
                    value={notesForShipper}
                    onChange={(e) => setNotesForShipper(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Pricing Summary & Confirmation Sticky Card */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-xl sticky top-20 space-y-5 border border-slate-800">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block mb-1">
                    Hóa Đơn Cước Tự Động
                  </span>
                  <h4 className="text-lg font-bold text-white">Tổng Quan Chi Phí</h4>
                </div>

                {/* COD amount input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Tiền Thu Hộ COD (VNĐ):
                  </label>
                  <input
                    type="number"
                    step="10000"
                    min="0"
                    value={codAmount}
                    onChange={(e) => setCodAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-base font-black text-rose-400 focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Nhập 0 nếu không thu COD</span>
                </div>

                {/* Payer radio */}
                <div className="text-xs space-y-1.5 pt-1 border-t border-slate-800">
                  <span className="text-slate-300 font-semibold block text-[11px]">Người thanh toán cước:</span>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={payer === 'RECEIVER_PAY'}
                        onChange={() => setPayer('RECEIVER_PAY')}
                        className="accent-emerald-400"
                      />
                      <span className="text-slate-300">Người nhận trả cước</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={payer === 'SENDER_PAY'}
                        onChange={() => setPayer('SENDER_PAY')}
                        className="accent-emerald-400"
                      />
                      <span className="text-slate-300">Người gửi trả cước</span>
                    </label>
                  </div>
                </div>

                {/* Fee Breakdown */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Cước vận chuyển:</span>
                    <span className="font-bold">{feeCalculation.shippingFee.toLocaleString('vi-VN')} đ</span>
                  </div>
                  {feeCalculation.insuranceFee > 0 && (
                    <div className="flex justify-between text-amber-300">
                      <span>Bảo hiểm khai giá:</span>
                      <span className="font-bold">+{feeCalculation.insuranceFee.toLocaleString('vi-VN')} đ</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Trọng lượng tính cước:</span>
                    <span>{feeCalculation.chargeableWeightKg} kg</span>
                  </div>
                </div>

                {/* Total Big Banner */}
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                  <span className="text-[11px] text-emerald-300 block">Tổng cước thanh toán:</span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight mt-0.5">
                    {feeCalculation.totalFee.toLocaleString('vi-VN')}{' '}
                    <span className="text-xs font-bold text-white">VNĐ</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-105 active:scale-98 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Xác Nhận Tạo Đơn Hàng
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: ADDRESS BOOK */}
      {activeTab === 'ADDRESS_BOOK' && (
        <div className="space-y-4 max-w-3xl">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Danh Sách Địa Chỉ Của Tôi</h3>
            <button
              onClick={() => setShowAddAddress(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow-xs hover:brightness-105 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm Địa Chỉ Mới
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteCustomerAddress(addr.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Xóa địa chỉ này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-slate-700 font-semibold">{addr.contactName} - {addr.phone}</div>
                <div className="text-slate-500">{addr.address}, {addr.district}, {addr.province}</div>
              </div>
            ))}
          </div>

          {showAddAddress && (
            <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
              <form onSubmit={handleSaveAddress} className="bg-white rounded-2xl p-6 max-w-md w-full text-xs space-y-3 shadow-2xl">
                <h4 className="font-bold text-sm text-slate-900">Thêm Địa Chỉ Mới</h4>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Tên gợi nhớ:</label>
                  <input
                    type="text"
                    placeholder="VD: Nhà riêng, Văn phòng"
                    value={newAddrLabel}
                    onChange={(e) => setNewAddrLabel(e.target.value)}
                    className="w-full border rounded-xl p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Người liên hệ:</label>
                  <input
                    type="text"
                    value={newAddrContact}
                    onChange={(e) => setNewAddrContact(e.target.value)}
                    className="w-full border rounded-xl p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Số điện thoại:</label>
                  <input
                    type="text"
                    value={newAddrPhone}
                    onChange={(e) => setNewAddrPhone(e.target.value)}
                    className="w-full border rounded-xl p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Địa chỉ chi tiết:</label>
                  <input
                    type="text"
                    value={newAddrStreet}
                    onChange={(e) => setNewAddrStreet(e.target.value)}
                    className="w-full border rounded-xl p-2.5"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="px-3.5 py-2 border rounded-xl"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl"
                  >
                    Lưu Địa Chỉ
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: COD WALLET */}
      {activeTab === 'COD_WALLET' && (
        <div className="space-y-4 max-w-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 rounded-3xl shadow-md">
              <span className="text-xs text-emerald-100 font-medium block">Tổng tiền COD đã hoàn tất</span>
              <div className="text-3xl font-black mt-1">
                {totalDeliveredCod.toLocaleString('vi-VN')} <span className="text-sm font-normal">VNĐ</span>
              </div>
              <p className="text-[11px] text-emerald-200 mt-2">
                Tiền thu hộ đã qua đối soát và bàn giao thành công.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 rounded-3xl shadow-md">
              <span className="text-xs text-amber-100 font-medium block">COD Đang Trong Hành Trình Giao</span>
              <div className="text-3xl font-black mt-1">
                {pendingCod.toLocaleString('vi-VN')} <span className="text-sm font-normal">VNĐ</span>
              </div>
              <p className="text-[11px] text-amber-100 mt-2">
                Dự kiến thu từ người nhận khi shipper giao hàng xong.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
