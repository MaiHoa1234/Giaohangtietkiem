import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { Shipment } from '../types/logistics';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  ArrowRight,
  ExternalLink,
  X,
  Calendar,
  Building,
  Check,
} from 'lucide-react';

interface WorkDeskDashboardProps {
  onOpenOrder: (trackingCode: string) => void;
  onOpenCreateOrder: () => void;
}

export const WorkDeskDashboard: React.FC<WorkDeskDashboardProps> = ({
  onOpenOrder,
  onOpenCreateOrder,
}) => {
  const { shipments, shippers } = useLogistics();
  const [showAlertCard, setShowAlertCard] = useState(true);

  const totalOrders = shipments.length;
  const inProgressOrders = shipments.filter((s) =>
    ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'AT_WAREHOUSE'].includes(s.status)
  ).length;
  const failedOrders = shipments.filter((s) =>
    ['DELIVERY_FAILED', 'RETURNING'].includes(s.status)
  ).length;
  const deliveredOrders = shipments.filter((s) => s.status === 'DELIVERED').length;
  const successRate = totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 94;

  return (
    <div className="space-y-6 antialiased">
      {/* =========================================================================
          ROW 1: 4 METRIC CARDS (Exact styling from the reference image)
      ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: VẬN ĐƠN MỚI CẦN LẤY */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
              VẬN ĐƠN ĐẾN (30 NGÀY)
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
              +{inProgressOrders} Đang xử lý
            </span>
          </div>

          <div className="text-4xl font-black text-slate-900 tracking-tight">
            17
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '70%' }} />
          </div>

          <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
            <span>Đã giao xử lý: 15</span>
            <span className="text-rose-600 font-bold">8 vận đơn khẩn</span>
          </div>
        </div>

        {/* Card 2: VẬN ĐƠN ĐI */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
              VẬN ĐƠN ĐI (30 NGÀY)
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
              Đã phát hành
            </span>
          </div>

          <div className="text-4xl font-black text-slate-900 tracking-tight">
            5
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '45%' }} />
          </div>

          <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
            <span>Đã ban hành: 3</span>
            <span>Dự thảo: 2</span>
          </div>
        </div>

        {/* Card 3: VIỆC QUÁ HẠN / GIAO THẤT BẠI (Red Highlight) */}
        <div className="bg-white rounded-2xl p-5 border-l-4 border-l-rose-500 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
              VIỆC QUÁ HẠN TRONG KỲ
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700">
              Cần xử lý gấp
            </span>
          </div>

          <div className="text-4xl font-black text-rose-600 tracking-tight">
            02
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: '85%' }} />
          </div>

          <div className="text-[11px] text-rose-600 font-semibold pt-0.5">
            Đôn đốc cán bộ phụ trách ngay
          </div>
        </div>

        {/* Card 4: TỶ LỆ HOÀN THÀNH */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
              TỶ LỆ HOÀN THÀNH (30 NGÀY)
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800">
              4/7 Việc
            </span>
          </div>

          <div className="text-4xl font-black text-slate-900 tracking-tight">
            {successRate}%
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${successRate}%` }} />
          </div>

          <div className="text-[11px] text-slate-500 pt-0.5 truncate">
            Tổng 7 nhiệm vụ phát sinh trong khoảng thời gian này
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 2: BIỂU ĐỒ PHÂN PHỐI KHỐI LƯỢNG VẬN ĐƠN & TIẾN ĐỘ (As in image)
      ========================================================================= */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
              📊
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Biểu đồ Phân Phối Khối Lượng Vận Bản & Tiến Độ Xử Lý
            </h3>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span>VB Đến</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>VB Đi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Nhiệm vụ</span>
            </div>
          </div>
        </div>

        {/* 4 Weekly grouped bar clusters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          {[
            { label: 'Tuần 1', sub: '9 mục', bars: [85, 25, 45] },
            { label: 'Tuần 2', sub: '7 mục', bars: [70, 30, 48] },
            { label: 'Tuần 3', sub: '7 mục', bars: [68, 28, 55] },
            { label: 'Tuần 4', sub: '6 mục', bars: [75, 22, 35] },
          ].map((col, idx) => (
            <div key={idx} className="bg-slate-50/70 p-4 rounded-xl flex flex-col items-center justify-between">
              <div className="h-32 w-full flex items-end justify-center gap-2 pb-2 border-b border-slate-200">
                {/* Bar 1: Indigo */}
                <div
                  className="w-4 bg-indigo-600 rounded-t-sm transition-all"
                  style={{ height: `${col.bars[0]}%` }}
                />
                {/* Bar 2: Emerald */}
                <div
                  className="w-4 bg-emerald-500 rounded-t-sm transition-all"
                  style={{ height: `${col.bars[1]}%` }}
                />
                {/* Bar 3: Amber */}
                <div
                  className="w-4 bg-amber-500 rounded-t-sm transition-all"
                  style={{ height: `${col.bars[2]}%` }}
                />
              </div>

              <div className="mt-2 text-center">
                <span className="font-extrabold text-xs text-slate-900 block">{col.label}</span>
                <span className="text-[11px] text-slate-400 font-medium">{col.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          ROW 3: 2-COLUMN SPLIT (Table on Left, Task Alert Card on Right)
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 Cols): Task Tracking Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  Theo dõi Tiến độ Công việc & Vận đơn (30 ngày qua)
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                7 nhiệm vụ thuộc phạm vi lọc hiện tại
              </p>
            </div>

            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              Xem tất cả →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Nội dung công việc / Đơn</th>
                  <th className="p-3">Người xử lý</th>
                  <th className="p-3">Hạn xử lý</th>
                  <th className="p-3">Tiến độ</th>
                  <th className="p-3 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Row 1 */}
                <tr className="hover:bg-slate-50 transition cursor-pointer" onClick={() => onOpenOrder('FS-HCM-882910')}>
                  <td className="p-3">
                    <div className="font-bold text-slate-900">Tích hợp giải pháp giao hàng một lần...</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">#FS-HCM-882910 • HS-2026-DVCTT-13</div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                        D
                      </div>
                      <span className="font-semibold text-slate-800">Nguyễn Tiến Dũng</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-500 font-mono">25/9/2026</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '100%' }} />
                      </div>
                      <span className="font-bold text-[10px]">100%</span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                      HOÀN THÀNH
                    </span>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-slate-50 transition cursor-pointer" onClick={() => onOpenOrder('FS-HCM-942183')}>
                  <td className="p-3">
                    <div className="font-bold text-slate-900">Vận chuyển giao hàng giày thể thao...</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">#FS-HCM-942183 • Tuyến Phú Nhuận</div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[10px]">
                        T
                      </div>
                      <span className="font-semibold text-slate-800">Nguyễn Văn Tuấn</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-500 font-mono">12/10/2026</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '75%' }} />
                      </div>
                      <span className="font-bold text-[10px]">75%</span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-blue-50 text-blue-700 border border-blue-200">
                      ĐANG PHÁT
                    </span>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-slate-50 transition cursor-pointer" onClick={() => onOpenOrder('FS-HCM-772819')}>
                  <td className="p-3">
                    <div className="font-bold text-slate-900">Xử lý khiếu nại dời lịch giao đơn mỹ phẩm...</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">#FS-HCM-772819 • Khiếu nại giao lại</div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-[10px]">
                        H
                      </div>
                      <span className="font-semibold text-slate-800">Trần Hùng (Điều phối)</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-500 font-mono">11/10/2026</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '40%' }} />
                      </div>
                      <span className="font-bold text-[10px]">40%</span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-amber-50 text-amber-700 border border-amber-200">
                      HẸN GIAO LẠI
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (1 Col): Alert Card (Like the "TRÌNH NGHIỆM THU" in the image) */}
        {showAlertCard && (
          <div className="bg-white rounded-2xl border-2 border-indigo-200 p-5 shadow-sm space-y-3 relative">
            <button
              onClick={() => setShowAlertCard(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="font-black text-indigo-900 uppercase text-[11px] tracking-wider">
                TRÌNH XỬ LÝ ĐƠN HÀNG
              </span>
              <span className="text-slate-400 text-[10px]">21:25 • 06/10/2026</span>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <span>📋</span>
                Yêu cầu xử lý nghiệm thu đơn: FS-HCM-882910
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Shipper Trần Đình Trọng đã giao thành công và thu đủ 380.000đ tiền mặt COD. Đề nghị Kế toán kiểm tra xác nhận đối soát phiên chuyển tiền cho Shop.
              </p>
            </div>

            <div className="pt-1 text-[11px] text-slate-500">
              Từ: <strong className="text-slate-800">Hoàng Bích Ngọc (Điều phối tổng)</strong>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => onOpenOrder('FS-HCM-882910')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
              >
                <span>Bấm vào để mở xem chi tiết</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
