import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { Shipment, ShipmentStatus } from '../types/logistics';
import { SvgBarcode, SvgQrCode } from '../utils/barcode';
import {
  Search,
  Truck,
  Package,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Printer,
  Star,
  Send,
  MessageSquareWarning,
  Navigation,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface TrackingViewProps {
  initialCode?: string;
  onOpenWaybill: (shipment: Shipment) => void;
  onOpenTicketModal: (code: string) => void;
}

export const TrackingView: React.FC<TrackingViewProps> = ({
  initialCode = '',
  onOpenWaybill,
  onOpenTicketModal,
}) => {
  const { shipments, submitReview } = useLogistics();
  const [searchCode, setSearchCode] = useState(initialCode || 'FS-HCM-942183');
  const [activeTrackingCode, setActiveTrackingCode] = useState(initialCode || 'FS-HCM-942183');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const shipment = shipments.find(
    (s) => s.trackingCode.toLowerCase().trim() === activeTrackingCode.toLowerCase().trim()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim()) {
      setActiveTrackingCode(searchCode.trim());
      setReviewSubmitted(false);
      setComment('');
    }
  };

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Giao thành công
          </span>
        );
      case 'OUT_FOR_DELIVERY':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 animate-pulse">
            <Truck className="w-3.5 h-3.5" /> Đang phát hàng
          </span>
        );
      case 'IN_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Navigation className="w-3.5 h-3.5" /> Đang luân chuyển
          </span>
        );
      case 'AT_WAREHOUSE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <Package className="w-3.5 h-3.5" /> Đang tại kho
          </span>
        );
      case 'DELIVERY_FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5" /> Giao chưa thành công
          </span>
        );
      case 'RETURNING':
      case 'RETURNED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Đang hoàn hàng
          </span>
        );
      case 'WAITING_PICKUP':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
            <Clock className="w-3.5 h-3.5" /> Chờ shipper lấy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
            <Clock className="w-3.5 h-3.5" /> Đã tiếp nhận
          </span>
        );
    }
  };

  const getProgressStepIndex = (status: ShipmentStatus) => {
    switch (status) {
      case 'PENDING':
      case 'CONFIRMED':
        return 0;
      case 'WAITING_PICKUP':
        return 1;
      case 'PICKED_UP':
        return 2;
      case 'AT_WAREHOUSE':
      case 'IN_TRANSIT':
        return 3;
      case 'OUT_FOR_DELIVERY':
        return 4;
      case 'DELIVERED':
        return 5;
      case 'DELIVERY_FAILED':
        return 4;
      case 'RETURNING':
      case 'RETURNED':
        return 4;
      default:
        return 0;
    }
  };

  const steps = [
    { title: 'Tạo đơn', sub: 'Chờ lấy' },
    { title: 'Điều phối', sub: 'Chỉ định' },
    { title: 'Đã lấy', sub: 'Từ Shop' },
    { title: 'Nhập kho', sub: 'Luân chuyển' },
    { title: 'Đang giao', sub: 'Tới tay khách' },
    { title: 'Hoàn tất', sub: 'Đã giao' },
  ];

  const currentStep = shipment ? getProgressStepIndex(shipment.status) : 0;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipment) return;
    submitReview(shipment.trackingCode, rating, comment);
    setReviewSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Search Header Banner (Compact & Elegant) */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/10 text-emerald-300 rounded-full text-[11px] font-bold mb-2">
            <Search className="w-3 h-3" /> Tra cứu hành trình bưu kiện
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-3">
            Theo Dõi Vận Đơn Trực Tuyến
          </h2>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Nhập mã vận đơn (VD: FS-HCM-942183)..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 font-mono font-bold text-xs sm:text-sm px-4 py-3 pl-10 rounded-xl shadow-inner focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-black text-xs rounded-xl transition shadow-md shrink-0 flex items-center gap-1.5"
            >
              Tra Cứu
            </button>
          </form>

          {/* Quick Click Sample Codes */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-emerald-200/80 text-[11px]">Mã mẫu:</span>
            {shipments.slice(0, 5).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSearchCode(s.trackingCode);
                  setActiveTrackingCode(s.trackingCode);
                }}
                className={`font-mono text-[11px] px-2 py-0.5 rounded-md transition ${
                  activeTrackingCode === s.trackingCode
                    ? 'bg-emerald-400 text-slate-950 font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {s.trackingCode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Tracking Details */}
      {shipment ? (
        <div className="space-y-6">
          {/* Status & Overview Bar */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    {shipment.trackingCode}
                  </span>
                  {getStatusBadge(shipment.status)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Khởi tạo lúc: <span className="font-medium text-gray-700">{shipment.createdAt}</span> | Dự kiến giao: <span className="font-medium text-emerald-700">{shipment.estimatedDelivery}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenWaybill(shipment)}
                  className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 text-xs font-semibold rounded-lg bg-gray-50 hover:bg-gray-100 transition shadow-2xs"
                >
                  <Printer className="w-4 h-4" /> In Phiếu A6
                </button>
                <button
                  onClick={() => onOpenTicketModal(shipment.trackingCode)}
                  className="flex items-center gap-1.5 px-3.5 py-2 border border-amber-300 hover:border-amber-400 text-amber-800 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 transition shadow-2xs"
                >
                  <MessageSquareWarning className="w-4 h-4 text-amber-600" /> Khiếu nại / Hỗ trợ
                </button>
              </div>
            </div>

            {/* Interactive Journey Route Step Progress */}
            <div className="py-6">
              <div className="relative">
                {/* Background Line */}
                <div className="absolute top-4 left-6 right-6 h-1 bg-gray-200 rounded-full" />
                {/* Active Progress Line */}
                <div
                  className="absolute top-4 left-6 h-1 bg-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (currentStep / (steps.length - 1)) * 100)}%`,
                  }}
                />

                {/* Steps Nodes */}
                <div className="relative flex justify-between">
                  {steps.map((st, idx) => {
                    const isDone = idx <= currentStep;
                    const isCurrent = idx === currentStep;
                    return (
                      <div key={idx} className="flex flex-col items-center text-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isDone
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-4 ring-emerald-100'
                              : 'bg-gray-200 text-gray-500'
                          } ${isCurrent ? 'scale-110' : ''}`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div className="mt-2">
                          <span
                            className={`block text-xs font-bold ${
                              isDone ? 'text-gray-900' : 'text-gray-400'
                            }`}
                          >
                            {st.title}
                          </span>
                          <span className="hidden sm:block text-[11px] text-gray-500">{st.sub}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Simulated Live Route Illustration */}
            <div className="mt-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-4 text-white overflow-hidden relative">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 text-xs">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Điểm gửi</span>
                    <span className="font-semibold">{shipment.sender.district}, {shipment.sender.province}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-emerald-400">
                  <div className="h-0.5 w-12 bg-emerald-500/40 hidden sm:block" />
                  <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-xs font-mono font-medium">
                    <Truck className="w-3.5 h-3.5 animate-bounce" />
                    <span>
                      {shipment.currentWarehouseName || 'Trung tâm khai thác & điều phối FastShip'}
                    </span>
                  </div>
                  <div className="h-0.5 w-12 bg-emerald-500/40 hidden sm:block" />
                </div>

                <div className="flex items-center gap-2 text-right">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Điểm nhận</span>
                    <span className="font-semibold">{shipment.receiver.district}, {shipment.receiver.province}</span>
                  </div>
                  <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2-Column: Timeline on left, Details on right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Timeline Left (2 Cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
              <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                Lịch Sử Di Chuyển & Trạng Thái Chi Tiết
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {shipment.statusHistory.slice().reverse().map((hist, idx) => {
                  const isLatest = idx === 0;
                  return (
                    <div key={hist.id} className="relative group">
                      {/* Node Dot */}
                      <div
                        className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white transition ${
                          isLatest ? 'bg-emerald-600 ring-4 ring-emerald-100 scale-110' : 'bg-gray-300'
                        }`}
                      />
                      <div>
                        <div className="flex flex-wrap items-baseline gap-2 mb-1">
                          <span
                            className={`text-xs font-bold ${
                              isLatest ? 'text-emerald-700 font-extrabold' : 'text-gray-700'
                            }`}
                          >
                            {hist.timestamp}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 bg-gray-100 text-gray-600 font-medium rounded-sm">
                            {hist.location}
                          </span>
                          {hist.actor && (
                            <span className="text-[11px] text-gray-400 italic">
                              Bởi: {hist.actor}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs leading-relaxed ${
                            isLatest ? 'text-gray-900 font-semibold' : 'text-gray-600'
                          }`}
                        >
                          {hist.note}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Failure notice if failed */}
              {shipment.failureReason && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
                    <AlertCircle className="w-4 h-4" /> Lý do chưa giao thành công:
                  </div>
                  <p>{shipment.failureReason}</p>
                  {shipment.nextDeliveryDate && (
                    <p className="mt-1 font-semibold text-emerald-800">
                      Lịch hẹn giao lại dự kiến: {shipment.nextDeliveryDate}
                    </p>
                  )}
                </div>
              )}

              {/* Review section if delivered */}
              {shipment.status === 'DELIVERED' && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    Đánh Giá Chất Lượng Dịch Vụ
                  </h4>

                  {shipment.customerRating && !reviewSubmitted ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs">
                      <div className="flex items-center gap-1 mb-1">
                        {Array.from({ length: shipment.customerRating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        ))}
                        <span className="font-bold text-emerald-900 ml-1">
                          {shipment.customerRating} / 5 sao
                        </span>
                      </div>
                      <p className="text-gray-700 italic">"{shipment.customerReview}"</p>
                    </div>
                  ) : reviewSubmitted ? (
                    <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold">
                      Cảm ơn bạn! Đánh giá đã được ghi nhận vào hồ sơ chất lượng dịch vụ của Shipper.
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-3 bg-gray-50 p-4 rounded-xl border">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 font-medium">Mức độ hài lòng:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setRating(star)}
                              className="focus:outline-hidden"
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  star <= rating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        rows={2}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Nhận xét về thái độ shipper, tốc độ giao hàng hoặc tình trạng đóng gói..."
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" /> Gửi Đánh Giá
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Details Right (1 Col) */}
            <div className="space-y-6">
              {/* Receiver Card */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs text-xs space-y-4">
                <h4 className="font-bold text-gray-900 text-sm border-b pb-2 flex items-center justify-between">
                  <span>Thông Tin Giao Nhận</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </h4>

                {/* Sender */}
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase block">Người Gửi</span>
                  <div className="font-bold text-gray-800 text-sm">{shipment.sender.name}</div>
                  <div className="text-gray-500">{shipment.sender.phone}</div>
                  <div className="text-gray-600 mt-0.5">
                    {shipment.sender.address}, {shipment.sender.district}, {shipment.sender.province}
                  </div>
                </div>

                {/* Receiver */}
                <div className="border-t pt-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase block">Người Nhận</span>
                  <div className="font-bold text-emerald-900 text-sm">{shipment.receiver.name}</div>
                  <div className="text-gray-500 font-mono font-medium">{shipment.receiver.phone}</div>
                  <div className="text-gray-600 mt-0.5">
                    {shipment.receiver.address}, {shipment.receiver.district}, {shipment.receiver.province}
                  </div>
                </div>

                {/* Package spec */}
                <div className="border-t pt-3 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mô tả hàng:</span>
                    <span className="font-semibold text-gray-800">{shipment.itemDescription}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Trọng lượng:</span>
                    <span className="font-semibold text-gray-800">{shipment.weightKg} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Kích thước:</span>
                    <span className="font-mono text-gray-800">
                      {shipment.dimensions.lengthCm}x{shipment.dimensions.widthCm}x{shipment.dimensions.heightCm} cm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gói dịch vụ:</span>
                    <span className="font-bold text-emerald-700">
                      {shipment.serviceType === 'SUPER_FAST'
                        ? 'Hỏa Tốc'
                        : shipment.serviceType === 'EXPRESS'
                        ? 'Giao Nhanh'
                        : 'Tiêu Chuẩn'}
                    </span>
                  </div>
                </div>

                {/* COD and fees */}
                <div className="border-t pt-3 space-y-2 bg-gray-50 p-3 rounded-xl">
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-600 font-medium">Tiền thu hộ COD:</span>
                    <span className="text-base font-black text-red-600">
                      {shipment.codAmount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Cước phí vận chuyển:</span>
                    <span className="font-bold">{shipment.totalFee.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Người chịu cước:</span>
                    <span className="font-medium text-blue-700">
                      {shipment.payer === 'RECEIVER_PAY' ? 'Người nhận trả' : 'Shop gửi trả'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-gray-800 text-lg mb-1">Không tìm thấy mã vận đơn</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
            Mã <strong>"{activeTrackingCode}"</strong> chưa có trên hệ thống. Vui lòng kiểm tra lại tính chính xác hoặc chọn một trong các mã mẫu có sẵn.
          </p>
        </div>
      )}
    </div>
  );
};
