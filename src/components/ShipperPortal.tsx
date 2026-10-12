import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { Shipment } from '../types/logistics';
import {
  Bike,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Package,
  Calendar,
  Smartphone,
  Navigation,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface ShipperPortalProps {
  onTrackCode: (code: string) => void;
  onOpenWaybill: (shipment: Shipment) => void;
}

export const ShipperPortal: React.FC<ShipperPortalProps> = ({
  onTrackCode,
  onOpenWaybill,
}) => {
  const {
    currentUser,
    shipments,
    shippers,
    shipperConfirmPickup,
    shipperDeliverSuccess,
    shipperDeliverFailed,
  } = useLogistics();

  const currentShipper = shippers.find((s) => s.id === 'SHIP_001') || shippers[0];

  const [activeTab, setActiveTab] = useState<'DELIVERY' | 'PICKUP' | 'COMPLETED' | 'WALLET'>('DELIVERY');
  
  // Delivery success modal
  const [successModalOrder, setSuccessModalOrder] = useState<Shipment | null>(null);
  const [collectedAmount, setCollectedAmount] = useState<number>(0);
  const [successNote, setSuccessNote] = useState('Đã giao tận tay người nhận, hàng nguyên vẹn');

  // Delivery failure modal
  const [failModalOrder, setFailModalOrder] = useState<Shipment | null>(null);
  const [failureReason, setFailureReason] = useState('Khách không nghe máy (Gọi 3 cuộc)');
  const [rescheduleDate, setRescheduleDate] = useState('2026-10-12 10:00');

  // Filter orders for this shipper
  const pickupOrders = shipments.filter(
    (s) => s.status === 'WAITING_PICKUP'
  );

  const deliveryOrders = shipments.filter(
    (s) => s.status === 'OUT_FOR_DELIVERY' || s.status === 'DELIVERY_FAILED'
  );

  const completedOrders = shipments.filter(
    (s) => s.status === 'DELIVERED'
  );

  const handleOpenSuccessModal = (order: Shipment) => {
    setSuccessModalOrder(order);
    setCollectedAmount(order.codAmount + (order.payer === 'RECEIVER_PAY' ? order.totalFee : 0));
  };

  const handleConfirmSuccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!successModalOrder) return;
    shipperDeliverSuccess(successModalOrder.trackingCode, successNote, collectedAmount);
    setSuccessModalOrder(null);
  };

  const handleOpenFailModal = (order: Shipment) => {
    setFailModalOrder(order);
  };

  const handleConfirmFail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!failModalOrder) return;
    shipperDeliverFailed(failModalOrder.trackingCode, failureReason, rescheduleDate);
    setFailModalOrder(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Driver Mobile Profile Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl border-2 border-emerald-400/40 overflow-hidden bg-white/20 shrink-0 shadow-md">
              <img
                src={currentShipper.avatarUrl}
                alt={currentShipper.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-xl">{currentShipper.name}</h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 bg-emerald-400 text-slate-950 rounded-full">
                  Shipper Cấp 5 ⭐ {currentShipper.rating}
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-1">
                Biển số: <span className="font-mono font-bold text-white">{currentShipper.vehiclePlate}</span> | Tuyến: {currentShipper.assignedArea}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-emerald-200 uppercase font-semibold block">Ví tiền COD đang giữ</span>
            <span className="text-2xl font-black text-amber-300">
              {currentShipper.cashInHand.toLocaleString('vi-VN')} đ
            </span>
          </div>
        </div>

        {/* Quick Shift Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/10 text-center text-xs relative z-10">
          <div className="bg-white/10 p-2.5 rounded-2xl border border-white/10">
            <div className="text-lg font-black text-white">{deliveryOrders.length}</div>
            <div className="text-[10px] text-emerald-200">Đơn cần giao</div>
          </div>
          <div className="bg-white/10 p-2.5 rounded-2xl border border-white/10">
            <div className="text-lg font-black text-white">{pickupOrders.length}</div>
            <div className="text-[10px] text-emerald-200">Đơn cần lấy</div>
          </div>
          <div className="bg-white/10 p-2.5 rounded-2xl border border-white/10">
            <div className="text-lg font-black text-emerald-300">{completedOrders.length}</div>
            <div className="text-[10px] text-emerald-200">Đã giao ca này</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold text-slate-600">
        <button
          onClick={() => setActiveTab('DELIVERY')}
          className={`py-2.5 rounded-xl transition text-center ${
            activeTab === 'DELIVERY'
              ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
              : 'hover:text-slate-900'
          }`}
        >
          Giao Hàng ({deliveryOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('PICKUP')}
          className={`py-2.5 rounded-xl transition text-center ${
            activeTab === 'PICKUP'
              ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
              : 'hover:text-slate-900'
          }`}
        >
          Lấy Hàng ({pickupOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`py-2.5 rounded-xl transition text-center ${
            activeTab === 'COMPLETED'
              ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
              : 'hover:text-slate-900'
          }`}
        >
          Đã Giao ({completedOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('WALLET')}
          className={`py-2.5 rounded-xl transition text-center ${
            activeTab === 'WALLET'
              ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
              : 'hover:text-slate-900'
          }`}
        >
          Ví Tiền COD
        </button>
      </div>

      {/* TAB 1: DELIVERY ORDERS */}
      {activeTab === 'DELIVERY' && (
        <div className="space-y-3">
          {deliveryOrders.map((order) => {
            const totalToCollect = order.codAmount + (order.payer === 'RECEIVER_PAY' ? order.totalFee : 0);
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border-2 border-gray-200 p-4 shadow-xs space-y-3 hover:border-emerald-500 transition"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-gray-900">
                      {order.trackingCode}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        order.status === 'DELIVERY_FAILED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.status === 'DELIVERY_FAILED' ? `Thử lại lần ${order.deliveryAttempts}` : 'Đang giao'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 uppercase block">Cần thu khách:</span>
                    <span className="font-black text-red-600 text-base">
                      {totalToCollect.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>

                {/* Receiver Info with direct Call & Map actions */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-sm text-gray-900">{order.receiver.name}</div>
                      <div className="text-gray-600 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{order.receiver.address}, {order.receiver.district}</span>
                      </div>
                    </div>

                    <a
                      href={`tel:${order.receiver.phone}`}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-xs shrink-0"
                    >
                      <Phone className="w-3.5 h-3.5" /> Gọi Ngay
                    </a>
                  </div>

                  {/* Shipper Instruction Note */}
                  <div className="bg-amber-50 border border-amber-200 p-2 rounded-lg text-amber-900 text-[11px]">
                    <span className="font-bold">Lưu ý: </span>
                    {order.notesForShipper}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t text-xs">
                  <button
                    onClick={() => handleOpenSuccessModal(order)}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Giao Thành Công
                  </button>

                  <button
                    onClick={() => handleOpenFailModal(order)}
                    className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 transition flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> Báo Giao Thất Bại
                  </button>
                </div>
              </div>
            );
          })}

          {deliveryOrders.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-500 text-xs border">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              Bạn đã hoàn thành tất cả đơn cần giao trong ca!
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PICKUP ORDERS */}
      {activeTab === 'PICKUP' && (
        <div className="space-y-3">
          {pickupOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3"
            >
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-mono font-bold text-sm text-gray-900">{order.trackingCode}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                  Chờ lấy từ Shop
                </span>
              </div>

              <div className="text-xs space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-gray-900">{order.sender.name}</div>
                    <div className="text-gray-500">{order.sender.address}, {order.sender.district}</div>
                    <div className="text-gray-700 font-semibold mt-1">
                      Hàng: {order.itemDescription} ({order.weightKg}kg)
                    </div>
                  </div>

                  <a
                    href={`tel:${order.sender.phone}`}
                    className="px-3 py-1 bg-gray-100 text-gray-800 font-bold rounded-lg border text-xs flex items-center gap-1 shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5 text-gray-600" /> Gọi Shop
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t">
                <button
                  onClick={() => shipperConfirmPickup(order.trackingCode)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Package className="w-4 h-4" /> Xác Nhận Đã Lấy Hàng Thành Công (SP04)
                </button>
              </div>
            </div>
          ))}

          {pickupOrders.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-500 text-xs border">
              Hiện tại không có đơn nào cần lấy hàng tại shop.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COMPLETED ORDERS */}
      {activeTab === 'COMPLETED' && (
        <div className="space-y-3">
          {completedOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-3.5 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-gray-900">{order.trackingCode}</span>
                <span className="font-bold text-emerald-700 text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Giao thành công: {order.deliveredAt}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Người nhận: {order.receiver.name}</span>
                <span className="font-bold text-red-600">COD: {order.codAmount.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: WALLET & CASH HANDOVER */}
      {activeTab === 'WALLET' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4 text-xs">
          <div className="border-b pb-4">
            <h3 className="font-bold text-base text-gray-900">Ví Tiền Mặt COD & Bàn Giao Cuối Ca (SP11 - SP12)</h3>
            <p className="text-gray-500 text-xs mt-0.5">
              Toàn bộ số tiền thu hộ từ khách hàng cần được nộp về thủ quỹ bưu cục trước 18:30 hàng ngày.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-800 font-semibold block">Tiền mặt COD đang giữ:</span>
              <span className="text-3xl font-black text-emerald-900">
                {currentShipper.cashInHand.toLocaleString('vi-VN')} VNĐ
              </span>
            </div>
            <button
              onClick={() => {
                alert('Đã gửi yêu cầu xác nhận nộp tiền mặt 1.350.000đ về Thủ quỹ Bưu cục Tân Bình!');
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
            >
              Nộp Tiền Mặt Về Bưu Cục
            </button>
          </div>

          <div className="space-y-2 pt-2">
            <span className="font-bold text-gray-800 block">Lịch sử thu tiền COD hôm nay:</span>
            {completedOrders.slice(0, 4).map((o) => (
              <div key={o.id} className="flex justify-between p-2.5 bg-gray-50 rounded-lg border text-[11px]">
                <span>
                  <strong className="font-mono">{o.trackingCode}</strong> - {o.receiver.name}
                </span>
                <span className="font-bold text-emerald-700">+{o.codAmount.toLocaleString('vi-VN')} đ</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {successModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmSuccess}
            className="bg-white rounded-2xl p-6 max-w-md w-full text-xs space-y-4 shadow-2xl animate-in zoom-in-95"
          >
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-base border-b pb-2">
              <CheckCircle2 className="w-5 h-5" /> Xác Nhận Giao Hàng Thành Công (SP08)
            </div>

            <div>
              <span className="text-gray-500">Mã vận đơn:</span>{' '}
              <strong className="font-mono text-gray-900">{successModalOrder.trackingCode}</strong>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Số tiền mặt thực thu từ khách (COD + Cước nếu có):
              </label>
              <input
                type="number"
                value={collectedAmount}
                onChange={(e) => setCollectedAmount(parseInt(e.target.value) || 0)}
                className="w-full text-base font-black text-red-600 border border-gray-300 rounded-xl px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Ghi chú xác nhận:</label>
              <textarea
                rows={2}
                value={successNote}
                onChange={(e) => setSuccessNote(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-2.5"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setSuccessModalOrder(null)}
                className="px-4 py-2 border rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
              >
                Hoàn Tất Giao Đơn
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FAIL MODAL */}
      {failModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmFail}
            className="bg-white rounded-2xl p-6 max-w-md w-full text-xs space-y-4 shadow-2xl"
          >
            <div className="flex items-center gap-2 text-rose-700 font-bold text-base border-b pb-2">
              <AlertTriangle className="w-5 h-5" /> Ghi Nhận Giao Thất Bại (SP09 - SP10)
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Lý do giao không thành công:</label>
              <select
                value={failureReason}
                onChange={(e) => setFailureReason(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-2.5 font-medium"
              >
                <option value="Khách không nghe máy (Gọi 3 cuộc)">Khách không nghe máy (Gọi 3 cuộc)</option>
                <option value="Khách hẹn giao lại ngày mai">Khách hẹn giao lại ngày mai</option>
                <option value="Khách từ chối nhận do đổi ý">Khách từ chối nhận do đổi ý</option>
                <option value="Khách không mang đủ tiền mặt COD">Khách không mang đủ tiền mặt COD</option>
                <option value="Sai địa chỉ / Không tìm thấy số nhà">Sai địa chỉ / Không tìm thấy số nhà</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Lên lịch hẹn phát lại lần tiếp theo:</label>
              <input
                type="text"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-2"
                placeholder="VD: 2026-10-12 10:00"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setFailModalOrder(null)}
                className="px-4 py-2 border rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs"
              >
                Lưu Báo Cáo Thất Bại
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
