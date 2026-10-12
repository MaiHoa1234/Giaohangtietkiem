import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { Shipment, Warehouse, Shipper } from '../types/logistics';
import {
  Compass,
  Warehouse as WarehouseIcon,
  Truck,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowRight,
  Package,
  Barcode,
  Search,
  Filter,
  UserCheck,
  AlertTriangle,
  UserPlus,
  Bike,
  Phone,
  MapPin,
  Star,
  DollarSign,
  X,
  Pencil,
  Trash2,
  Edit3,
} from 'lucide-react';

interface DispatcherPortalProps {
  onTrackCode: (code: string) => void;
  onOpenWaybill: (shipment: Shipment) => void;
}

export const DispatcherPortal: React.FC<DispatcherPortalProps> = ({
  onTrackCode,
  onOpenWaybill,
}) => {
  const {
    currentUser,
    shipments,
    warehouses,
    shippers,
    assignShipper,
    warehouseCheckIn,
    warehouseDispatch,
    updateShipmentStatus,
    addShipper,
    updateShipper,
    deleteShipper,
  } = useLogistics();

  const [activeTab, setActiveTab] = useState<
    'DISPATCH_QUEUE' | 'WAREHOUSE_SCAN' | 'SHIPPERS' | 'FAILED_HANDLING' | 'INVENTORY'
  >('DISPATCH_QUEUE');

  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('WH_HCM_01');
  const [quickScanCode, setQuickScanCode] = useState('');
  const [scanMessage, setScanMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Modal Thêm Shipper
  const [isAddShipperOpen, setIsAddShipperOpen] = useState(false);
  const [shipperName, setShipperName] = useState('');
  const [shipperPhone, setShipperPhone] = useState('');
  const [shipperPlate, setShipperPlate] = useState('');
  const [shipperArea, setShipperArea] = useState('Quận Tân Bình');
  const [shipperEmail, setShipperEmail] = useState('');
  const [addShipperSuccessMsg, setAddShipperSuccessMsg] = useState('');

  // Search & Filter Shippers
  const [shipperSearchQuery, setShipperSearchQuery] = useState('');

  // Modal Chỉnh Sửa Shipper
  const [editingShipper, setEditingShipper] = useState<Shipper | null>(null);
  const [editShipperName, setEditShipperName] = useState('');
  const [editShipperPhone, setEditShipperPhone] = useState('');
  const [editShipperPlate, setEditShipperPlate] = useState('');
  const [editShipperArea, setEditShipperArea] = useState('');
  const [editShipperWarehouseId, setEditShipperWarehouseId] = useState('');
  const [editShipperSuccessMsg, setEditShipperSuccessMsg] = useState('');

  // Modal Xác Nhận Xóa Shipper
  const [deletingShipper, setDeletingShipper] = useState<Shipper | null>(null);

  // Filter pending assignments
  const unassignedPickupOrders = shipments.filter(
    (s) => s.status === 'PENDING' || s.status === 'CONFIRMED'
  );

  const failedOrReturningOrders = shipments.filter(
    (s) => s.status === 'DELIVERY_FAILED' || s.status === 'RETURNING'
  );

  const handleAssignPickup = (trackingCode: string, shipperId: string) => {
    assignShipper(trackingCode, 'pickup', shipperId);
  };

  const handleAssignDelivery = (trackingCode: string, shipperId: string) => {
    assignShipper(trackingCode, 'delivery', shipperId);
  };

  const handleScanCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickScanCode.trim()) return;

    const code = quickScanCode.trim();
    const match = shipments.find((s) => s.trackingCode.toLowerCase() === code.toLowerCase());

    if (!match) {
      setScanMessage({ text: `Không tìm thấy mã vận đơn: ${code}`, success: false });
      return;
    }

    warehouseCheckIn(match.trackingCode, selectedWarehouseId);
    setScanMessage({ text: `Nhập kho thành công bưu kiện ${match.trackingCode}`, success: true });
    setQuickScanCode('');
  };

  const handleCreateShipper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipperName.trim() || !shipperPhone.trim() || !shipperPlate.trim()) return;

    const emailToUse = shipperEmail.trim() || `shipper_${shipperPhone.trim()}@fastship.vn`;

    addShipper({
      name: shipperName.trim(),
      phone: shipperPhone.trim(),
      vehiclePlate: shipperPlate.trim(),
      assignedArea: shipperArea.trim(),
      warehouseId: selectedWarehouseId,
      email: emailToUse,
    });

    setAddShipperSuccessMsg(`Đã thêm thành công tài xế ${shipperName} vào bưu cục!`);
    setTimeout(() => {
      setIsAddShipperOpen(false);
      setAddShipperSuccessMsg('');
      setShipperName('');
      setShipperPhone('');
      setShipperPlate('');
      setShipperEmail('');
    }, 1200);
  };

  const handleOpenEditShipper = (sp: Shipper) => {
    setEditingShipper(sp);
    setEditShipperName(sp.name);
    setEditShipperPhone(sp.phone);
    setEditShipperPlate(sp.vehiclePlate);
    setEditShipperArea(sp.assignedArea);
    setEditShipperWarehouseId(sp.warehouseId || selectedWarehouseId);
    setEditShipperSuccessMsg('');
  };

  const handleSaveEditShipper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShipper) return;
    updateShipper(editingShipper.id, {
      name: editShipperName.trim(),
      phone: editShipperPhone.trim(),
      vehiclePlate: editShipperPlate.trim(),
      assignedArea: editShipperArea.trim(),
      warehouseId: editShipperWarehouseId,
    });
    setEditShipperSuccessMsg(`Đã cập nhật thông tin tài xế ${editShipperName}!`);
    setTimeout(() => {
      setEditingShipper(null);
      setEditShipperSuccessMsg('');
    }, 1000);
  };

  const handleConfirmDeleteShipper = () => {
    if (!deletingShipper) return;
    deleteShipper(deletingShipper.id);
    setDeletingShipper(null);
  };

  const filteredShippers = shippers.filter((sp) => {
    if (!shipperSearchQuery) return true;
    const q = shipperSearchQuery.toLowerCase();
    return (
      sp.name.toLowerCase().includes(q) ||
      sp.phone.includes(q) ||
      sp.vehiclePlate.toLowerCase().includes(q) ||
      sp.assignedArea.toLowerCase().includes(q)
    );
  });

  const currentWarehouse = warehouses.find((w) => w.id === selectedWarehouseId) || warehouses[0];

  return (
    <div className="space-y-6">
      {/* Top Dispatcher Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center font-bold text-indigo-300 shadow-inner">
            <Compass className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black">Trung Tâm Điều Phối & Quản Lý Kho Bãi</h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 bg-indigo-400 text-slate-950 rounded-full">
                Trực Vận Hành
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Trưởng bưu cục: <strong className="text-white">{currentUser.name}</strong> | Đang quản trị:{' '}
              <strong className="text-indigo-300">{currentWarehouse.name}</strong>
            </p>
          </div>
        </div>

        {/* Warehouse Selector & Quick Add Shipper Trigger */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            type="button"
            onClick={() => setIsAddShipperOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-105 active:scale-98 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Thêm Shipper Mới</span>
          </button>

          <div className="bg-white/10 p-2.5 rounded-2xl border border-white/10 text-xs backdrop-blur-md">
            <label className="text-indigo-200 block text-[10px] uppercase font-bold mb-1">
              Bưu Cục Đang Chọn:
            </label>
            <select
              value={selectedWarehouseId}
              onChange={(e) => setSelectedWarehouseId(e.target.value)}
              className="bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-1.5 font-semibold text-xs focus:ring-2 focus:ring-indigo-400 cursor-pointer"
            >
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.name} ({wh.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs sm:text-sm font-bold text-slate-500 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('DISPATCH_QUEUE')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'DISPATCH_QUEUE'
              ? 'border-indigo-600 text-indigo-700 font-extrabold'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <Compass className="w-4 h-4" /> Phân Công Shipper
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-800 font-bold">
            {unassignedPickupOrders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SHIPPERS')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'SHIPPERS'
              ? 'border-indigo-600 text-indigo-700 font-extrabold'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <Bike className="w-4 h-4" /> Đội Ngũ Shipper ({shippers.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('WAREHOUSE_SCAN')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'WAREHOUSE_SCAN'
              ? 'border-indigo-600 text-indigo-700 font-extrabold'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <Barcode className="w-4 h-4" /> Quét Mã Nhập / Xuất Kho
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('FAILED_HANDLING')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'FAILED_HANDLING'
              ? 'border-indigo-600 text-indigo-700 font-extrabold'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <RotateCcw className="w-4 h-4" /> Đơn Giao Thất Bại & Chuyển Hoàn
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
            {failedOrReturningOrders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('INVENTORY')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'INVENTORY'
              ? 'border-indigo-600 text-indigo-700 font-extrabold'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <WarehouseIcon className="w-4 h-4" /> Tồn Kho Bưu Cục
        </button>
      </div>

      {/* TAB 1: DISPATCH QUEUE */}
      {activeTab === 'DISPATCH_QUEUE' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Đơn Mới Chờ Phân Công Shipper Lấy Hàng
                </h3>
                <p className="text-xs text-slate-500">
                  Gán shipper phụ trách từng tuyến để kịp thời lấy hàng từ shop trong vòng 2 giờ.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {unassignedPickupOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-slate-900">
                        {order.trackingCode}
                      </span>
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 font-bold rounded-full text-[10px]">
                        Chờ gán shipper
                      </span>
                      <span className="text-slate-500 text-[11px] font-medium">{order.createdAt}</span>
                    </div>

                    <div className="text-slate-700 font-medium">
                      <strong>Điểm lấy:</strong> {order.sender.name} ({order.sender.address}, {order.sender.district})
                    </div>
                    <div className="text-slate-500">
                      <strong>Giao đến:</strong> {order.receiver.name} ({order.receiver.province}) • {order.itemDescription} ({order.weightKg}kg)
                    </div>
                  </div>

                  {/* Assign Shipper Dropdown */}
                  <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shrink-0">
                    <span className="text-[11px] font-bold text-slate-500">Phân công:</span>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAssignPickup(order.trackingCode, e.target.value);
                        }
                      }}
                      defaultValue=""
                      className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="" disabled>
                        Chọn Shipper phụ trách...
                      </option>
                      {shippers.map((sp) => (
                        <option key={sp.id} value={sp.id}>
                          {sp.name} - {sp.assignedArea} (Đang giữ {sp.activeOrdersCount} đơn)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              {unassignedPickupOrders.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  Tuyệt vời! Hiện tại không còn đơn hàng nào tồn đọng chờ phân công.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SHIPPERS MANAGEMENT (Trưởng bưu cục quản lý và thêm shipper) */}
      {activeTab === 'SHIPPERS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Đội Ngũ Shipper Trực Thuộc Bưu Cục ({currentWarehouse.name})
              </h3>
              <p className="text-xs text-slate-500">
                Trưởng bưu cục có quyền thêm shipper mới, chỉnh sửa thông tin, phân tuyến hoặc xóa tài xế khỏi hệ thống.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddShipperOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Thêm Shipper Mới Vào Tuyến</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={shipperSearchQuery}
              onChange={(e) => setShipperSearchQuery(e.target.value)}
              placeholder="Tìm tài xế theo họ tên, số điện thoại, biển số xe, tuyến đường phụ trách..."
              className="w-full bg-transparent text-xs font-medium focus:outline-hidden"
            />
            {shipperSearchQuery && (
              <button
                type="button"
                onClick={() => setShipperSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 text-xs px-2 cursor-pointer font-bold"
              >
                Xóa tìm
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredShippers.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
                Không tìm thấy tài xế shipper nào phù hợp.
              </div>
            ) : (
              filteredShippers.map((sp) => (
                <div
                  key={sp.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition space-y-3 text-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={sp.avatarUrl}
                          alt={sp.name}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-2xs"
                        />
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm leading-tight">{sp.name}</h4>
                          <span className="font-mono text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" /> {sp.phone}
                          </span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Đang trực
                      </span>
                    </div>

                    <div className="space-y-1.5 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex justify-between">
                        <span>Biển số xe máy:</span>
                        <strong className="font-mono text-slate-900">{sp.vehiclePlate}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Tuyến đường phụ trách:</span>
                        <strong className="text-indigo-700">{sp.assignedArea}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Đơn hàng đang giữ:</span>
                        <strong className="text-amber-700">{sp.activeOrdersCount} đơn</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Giao thành công hôm nay:</span>
                        <strong className="text-emerald-700">{sp.completedOrdersCount} đơn</strong>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-200">
                        <span>Tiền COD đang giữ:</span>
                        <strong className="text-slate-900 font-bold">
                          {sp.cashInHand.toLocaleString('vi-VN')} đ
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {sp.rating.toFixed(1)} / 5.0
                      </span>
                      <span className="text-slate-400">ID: {sp.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleOpenEditShipper(sp)}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer text-xs"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Sửa Shipper</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingShipper(sp)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 flex items-center justify-center gap-1.5 transition cursor-pointer text-xs"
                      title="Xóa tài xế"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: WAREHOUSE SCAN (QUÉT NHẬP / XUẤT KHO) */}
      {activeTab === 'WAREHOUSE_SCAN' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Barcode className="w-5 h-5 text-indigo-600" />
              <span>Quét Barcode / Mã Vận Đơn Nhập Kho Bưu Cục</span>
            </h3>

            <form onSubmit={handleScanCheckIn} className="flex gap-2 max-w-xl">
              <input
                type="text"
                value={quickScanCode}
                onChange={(e) => setQuickScanCode(e.target.value)}
                placeholder="Quét hoặc nhập mã vận đơn (VD: FS-HCM-942183)..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                Nhập Kho
              </button>
            </form>

            {scanMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  scanMessage.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {scanMessage.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{scanMessage.text}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: FAILED & RETURNING HANDLING */}
      {activeTab === 'FAILED_HANDLING' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900">
              Danh Sách Đơn Giao Thất Bại & Đơn Chờ Xử Lý Chuyển Hoàn
            </h3>

            {failedOrReturningOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 text-xs space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono font-black text-slate-900 text-sm">
                    {order.trackingCode}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                    {order.status}
                  </span>
                </div>

                <div className="text-slate-700">
                  <strong>Lý do shipper ghi nhận:</strong>{' '}
                  <span className="text-rose-700 font-semibold">
                    {order.failureReason || order.returnReason || 'Không liên lạc được người nhận'}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-amber-200/80">
                  <span className="text-slate-500">
                    Người nhận: {order.receiver.name} ({order.receiver.phone})
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAssignDelivery(order.trackingCode, shippers[0]?.id || 'SHIP_001')}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                    >
                      Đổi Shipper Phát Lại Lần 2
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateShipmentStatus(
                          order.trackingCode,
                          'RETURNING',
                          'Điều phối duyệt yêu cầu chuyển hoàn về Shop người gửi',
                          'Kho Trung chuyển'
                        )
                      }
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                    >
                      Duyệt Chuyển Hoàn Về Shop
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {failedOrReturningOrders.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs">
                Không có đơn hàng nào thất bại cần can thiệp xử lý.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: INVENTORY */}
      {activeTab === 'INVENTORY' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {warehouses.map((wh) => (
            <div
              key={wh.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{wh.name}</h4>
                  <span className="font-mono text-slate-500">{wh.code}</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                  Hoạt động
                </span>
              </div>

              <div className="space-y-1 text-slate-600">
                <div>
                  Sức chứa tối đa: <strong className="text-slate-900">{wh.capacity} kiện</strong>
                </div>
                <div>
                  Tồn kho thực tế: <strong className="text-indigo-700">{wh.currentStock} kiện</strong>
                </div>
                <div>
                  Trưởng bưu cục: <strong>{wh.manager}</strong> ({wh.phone})
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>Tải trọng bưu cục:</span>
                  <span className="font-bold">{((wh.currentStock / wh.capacity) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${(wh.currentStock / wh.capacity) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL THÊM SHIPPER MỚI VÀO BƯU CỤC */}
      {isAddShipperOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bike className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-sm text-slate-900">Thêm Shipper Mới Vào Bưu Cục</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddShipperOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addShipperSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="font-bold">{addShipperSuccessMsg}</p>
                <p className="text-[11px] text-slate-500">Tài khoản đã sẵn sàng để đăng nhập vào app!</p>
              </div>
            ) : (
              <form onSubmit={handleCreateShipper} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Họ và tên tài xế:</label>
                  <input
                    type="text"
                    value={shipperName}
                    onChange={(e) => setShipperName(e.target.value)}
                    placeholder="VD: Trần Văn Bình"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số điện thoại:</label>
                    <input
                      type="tel"
                      value={shipperPhone}
                      onChange={(e) => setShipperPhone(e.target.value)}
                      placeholder="09xx xxx xxx"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Biển số xe máy:</label>
                    <input
                      type="text"
                      value={shipperPlate}
                      onChange={(e) => setShipperPlate(e.target.value)}
                      placeholder="59P2-998.12"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Khu vực / Tuyến phụ trách:</label>
                  <input
                    type="text"
                    value={shipperArea}
                    onChange={(e) => setShipperArea(e.target.value)}
                    placeholder="VD: Quận Tân Bình (Phường 1, 2, 3)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email đăng nhập (Tùy chọn):</label>
                  <input
                    type="email"
                    value={shipperEmail}
                    onChange={(e) => setShipperEmail(e.target.value)}
                    placeholder={`shipper_${shipperPhone || 'xxx'}@fastship.vn`}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Mật khẩu đăng nhập mặc định: <b>123456</b>
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 active:scale-98 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
                  >
                    Xác Nhận Thêm Shipper Vào Hệ Thống
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL CHỈNH SỬA SHIPPER */}
      {editingShipper && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-sm text-slate-900">
                  Chỉnh Sửa Tài Xế: {editingShipper.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingShipper(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editShipperSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="font-bold">{editShipperSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSaveEditShipper} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Họ và tên tài xế:</label>
                  <input
                    type="text"
                    value={editShipperName}
                    onChange={(e) => setEditShipperName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số điện thoại:</label>
                    <input
                      type="tel"
                      value={editShipperPhone}
                      onChange={(e) => setEditShipperPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Biển số xe máy:</label>
                    <input
                      type="text"
                      value={editShipperPlate}
                      onChange={(e) => setEditShipperPlate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Khu vực / Tuyến phụ trách:</label>
                  <input
                    type="text"
                    value={editShipperArea}
                    onChange={(e) => setEditShipperArea(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bưu cục trực thuộc:</label>
                  <select
                    value={editShipperWarehouseId}
                    onChange={(e) => setEditShipperWarehouseId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
                  >
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.id}>
                        {wh.name} ({wh.code}) - {wh.province}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingShipper(null)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
                  >
                    Lưu Thay Đổi
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN XÓA SHIPPER */}
      {deletingShipper && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900">Xóa Tài Xế Shipper</h3>
                <p className="text-[11px] text-slate-500">Xác nhận thu hồi quyền giao nhận</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <img
                  src={deletingShipper.avatarUrl}
                  alt={deletingShipper.name}
                  className="w-8 h-8 rounded-xl object-cover"
                />
                <div>
                  <div className="font-bold text-slate-900">{deletingShipper.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">Xe: {deletingShipper.vehiclePlate}</div>
                </div>
              </div>
              <div className="text-slate-600 pt-1 border-t border-slate-200 text-[11px]">
                SĐT: <strong className="font-mono">{deletingShipper.phone}</strong>
                <br />
                Tuyến: <span>{deletingShipper.assignedArea}</span>
              </div>
            </div>

            <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100 font-medium">
              ⚠️ Cảnh báo: Tài xế này sẽ bị xóa khỏi bưu cục và không thể nhận đơn hoặc đăng nhập nữa.
            </p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeletingShipper(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteShipper}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
