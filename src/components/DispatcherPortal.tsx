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
  } = useLogistics();

  const [activeTab, setActiveTab] = useState<'DISPATCH_QUEUE' | 'WAREHOUSE_SCAN' | 'FAILED_HANDLING' | 'INVENTORY'>('DISPATCH_QUEUE');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('WH_HCM_01');
  const [quickScanCode, setQuickScanCode] = useState('');
  const [scanMessage, setScanMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Filter pending assignments
  const unassignedPickupOrders = shipments.filter(
    (s) => s.status === 'PENDING' || s.status === 'CONFIRMED'
  );

  const warehouseOrders = shipments.filter(
    (s) => s.status === 'AT_WAREHOUSE' || s.status === 'PICKED_UP'
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
    setScanMessage({ text: `Nhập kho thành công vận đơn ${match.trackingCode}`, success: true });
    setQuickScanCode('');
  };

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
              Điều phối viên: <strong className="text-white">{currentUser.name}</strong> | Đang phụ trách:{' '}
              <strong className="text-indigo-300">{currentWarehouse.name}</strong>
            </p>
          </div>
        </div>

        {/* Warehouse Selector */}
        <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-xs backdrop-blur-md relative z-10">
          <label className="text-indigo-200 block text-[10px] uppercase font-bold mb-1">
            Chọn Kho Vận Hành:
          </label>
          <select
            value={selectedWarehouseId}
            onChange={(e) => setSelectedWarehouseId(e.target.value)}
            className="bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-2 font-semibold text-xs focus:ring-2 focus:ring-indigo-400"
          >
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name} ({wh.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs sm:text-sm font-bold text-slate-500 overflow-x-auto">
        <button
          onClick={() => setActiveTab('DISPATCH_QUEUE')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'DISPATCH_QUEUE'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <Compass className="w-4 h-4" /> Phân Công Shipper (ĐP01 - ĐP03)
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-800 font-bold">
            {unassignedPickupOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('WAREHOUSE_SCAN')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'WAREHOUSE_SCAN'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <Barcode className="w-4 h-4" /> Quét Nhập / Xuất Kho (ĐP05 - ĐP07)
        </button>

        <button
          onClick={() => setActiveTab('FAILED_HANDLING')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'FAILED_HANDLING'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <RotateCcw className="w-4 h-4" /> Xử Lý Giao Thất Bại & Hoàn (ĐP09 - ĐP10)
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
            {failedOrReturningOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('INVENTORY')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'INVENTORY'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <WarehouseIcon className="w-4 h-4" /> Thống Kê Tồn Kho Bưu Cục (ĐP12)
        </button>
      </div>

      {/* TAB 1: DISPATCH QUEUE */}
      {activeTab === 'DISPATCH_QUEUE' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">
                  Đơn Mới Chờ Phân Công Shipper Lấy Hàng (ĐP02)
                </h3>
                <p className="text-xs text-gray-500">
                  Gán shipper phù hợp theo khu vực để qua shop nhận hàng kịp giờ cam kết.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {unassignedPickupOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-gray-900">
                        {order.trackingCode}
                      </span>
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 font-bold rounded-full text-[10px]">
                        Chờ gán shipper
                      </span>
                      <span className="text-gray-500 text-[11px] font-medium">{order.createdAt}</span>
                    </div>

                    <div className="text-gray-700 font-medium">
                      <strong>Điểm lấy:</strong> {order.sender.name} ({order.sender.address}, {order.sender.district})
                    </div>
                    <div className="text-gray-500">
                      <strong>Giao đến:</strong> {order.receiver.name} ({order.receiver.province}) • {order.itemDescription} ({order.weightKg}kg)
                    </div>
                  </div>

                  {/* Assign Shipper Form */}
                  <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-200 shrink-0">
                    <span className="text-[11px] font-bold text-gray-500">Giao cho:</span>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAssignPickup(order.trackingCode, e.target.value);
                        }
                      }}
                      defaultValue=""
                      className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
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
                <div className="p-8 text-center text-gray-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  Tuyệt vời! Hiện tại không còn đơn hàng nào tồn đọng chờ phân công.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WAREHOUSE SCANNING */}
      {activeTab === 'WAREHOUSE_SCAN' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scan In / Out input box */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Barcode className="w-4 h-4 text-indigo-600" /> Quét Nhập Kho / Xuất Kho
            </h3>
            <p className="text-xs text-gray-500">
              Nhập mã vận đơn hoặc quét bằng máy đọc mã vạch để ghi nhận kiện hàng vào {currentWarehouse.name}.
            </p>

            <form onSubmit={handleScanCheckIn} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mã Vận Đơn (Barcode):
                </label>
                <input
                  type="text"
                  placeholder="VD: FS-HCM-942183"
                  value={quickScanCode}
                  onChange={(e) => setQuickScanCode(e.target.value)}
                  className="w-full font-mono font-bold text-sm border-2 border-indigo-200 rounded-xl px-3 py-2.5 focus:border-indigo-600 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Xác Nhận Quét Nhập Kho (ĐP05)
              </button>
            </form>

            {scanMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold ${
                  scanMessage.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {scanMessage.text}
              </div>
            )}
          </div>

          {/* Current Warehouse Inventory List */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-sm">
              Kiện Hàng Đang Tại Kho / Bưu Cục ({warehouseOrders.length})
            </h3>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {warehouseOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs flex items-center justify-between gap-3 hover:bg-gray-100 transition"
                >
                  <div>
                    <div className="font-mono font-bold text-gray-900">{order.trackingCode}</div>
                    <div className="text-gray-600">
                      Đích: <strong>{order.receiver.district}, {order.receiver.province}</strong> ({order.weightKg}kg)
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => warehouseDispatch(order.trackingCode, 'Tuyến liên tỉnh Bắc - Nam')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[11px] transition"
                    >
                      Xuất Điều Chuyển
                    </button>

                    <button
                      onClick={() => handleAssignDelivery(order.trackingCode, 'SHIP_001')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] transition"
                    >
                      Bàn Giao Shipper Giao
                    </button>
                  </div>
                </div>
              ))}

              {warehouseOrders.length === 0 && (
                <div className="p-8 text-center text-gray-500 text-xs">
                  Hiện không có kiện hàng nào đang lưu tại kho này.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FAILED ORDERS HANDLING */}
      {activeTab === 'FAILED_HANDLING' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Xử Lý Đơn Giao Thất Bại & Chuyển Hoàn (ĐP09 - ĐP10)
            </h3>
            <p className="text-xs text-gray-500">
              Kiểm soát các đơn giao thất bại, đưa ra chỉ đạo phát lại hoặc kích hoạt quy trình hoàn hàng trả Shop.
            </p>
          </div>

          <div className="space-y-3">
            {failedOrReturningOrders.map((order) => (
              <div
                key={order.id}
                className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 text-xs space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-900 text-sm">{order.trackingCode}</span>
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-900 font-bold rounded-full text-[10px]">
                      {order.status}
                    </span>
                  </div>
                  <span className="text-amber-800 font-semibold">
                    Đã thử phát: {order.deliveryAttempts}/3 lần
                  </span>
                </div>

                <div className="text-gray-700">
                  <strong>Lý do shipper báo cáo:</strong>{' '}
                  <span className="text-rose-700 font-medium">
                    {order.failureReason || order.returnReason || 'Chưa ghi nhận'}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-amber-200">
                  <span className="text-gray-500">
                    Người nhận: {order.receiver.name} ({order.receiver.phone})
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAssignDelivery(order.trackingCode, 'SHIP_002')}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[11px]"
                    >
                      Đổi Shipper Phát Lại
                    </button>

                    <button
                      onClick={() =>
                        updateShipmentStatus(
                          order.trackingCode,
                          'RETURNING',
                          'Điều phối duyệt yêu cầu chuyển hoàn về Shop người gửi',
                          'Kho Trung chuyển'
                        )
                      }
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[11px]"
                    >
                      Xác Nhận Chuyển Hoàn (Shop)
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {failedOrReturningOrders.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-xs">
                Không có đơn giao thất bại nào cần can thiệp xử lý.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: INVENTORY MONITORING */}
      {activeTab === 'INVENTORY' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {warehouses.map((wh) => (
            <div key={wh.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{wh.name}</h4>
                  <span className="font-mono text-gray-500">{wh.code}</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                  Hoạt động
                </span>
              </div>

              <div className="space-y-1.5 text-gray-600">
                <div>
                  Sức chứa tối đa: <strong className="text-gray-900">{wh.capacity} kiện</strong>
                </div>
                <div>
                  Tồn kho thực tế: <strong className="text-indigo-700">{wh.currentStock} kiện</strong>
                </div>
                <div>
                  Quản lý kho: <strong>{wh.manager}</strong> ({wh.phone})
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>Tải trọng kho:</span>
                  <span className="font-bold">{((wh.currentStock / wh.capacity) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
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
    </div>
  );
};
