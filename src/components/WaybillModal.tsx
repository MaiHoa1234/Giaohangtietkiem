import React, { useRef } from 'react';
import { Shipment } from '../types/logistics';
import { SvgBarcode, SvgQrCode } from '../utils/barcode';
import { Printer, X, Download, ShieldCheck, Box, Phone, MapPin } from 'lucide-react';

interface WaybillModalProps {
  shipment: Shipment | null;
  onClose: () => void;
}

export const WaybillModal: React.FC<WaybillModalProps> = ({ shipment, onClose }) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!shipment) return null;

  const handlePrint = () => {
    window.print();
  };

  const getServiceLabel = (srv: string) => {
    switch (srv) {
      case 'SUPER_FAST':
        return 'HỎA TỐC (2-4H)';
      case 'EXPRESS':
        return 'GIAO NHANH (24H)';
      default:
        return 'TIÊU CHUẨN';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <h2 className="font-semibold text-lg">In Phiếu Gửi Hàng (Vận Đơn A6)</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              In Vận Đơn (Ctrl + P)
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Waybill Paper (Standard A6 thermal bill format) */}
        <div className="p-6 overflow-y-auto bg-gray-100 flex justify-center">
          <div
            ref={printAreaRef}
            id="printable-waybill"
            className="w-full max-w-[440px] bg-white border-2 border-dashed border-gray-400 p-5 rounded-sm text-gray-900 font-sans shadow-md text-[13px] leading-tight select-all"
            style={{ minHeight: '620px' }}
          >
            {/* Top Bar with Brand & Routing Sort Code */}
            <div className="border-b-2 border-black pb-3 mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-black text-xl tracking-tight text-emerald-700 flex items-center gap-1">
                    FAST<span className="text-orange-500">SHIP</span>
                  </span>
                  <div className="text-[10px] text-gray-600 uppercase font-bold tracking-wider">
                    Giao Nhanh - Tiết Kiệm
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-block bg-black text-white font-black text-lg px-2.5 py-0.5 rounded-xs tracking-wider">
                    {shipment.receiver.province.includes('Hà Nội')
                      ? 'HN-HUB'
                      : shipment.receiver.province.includes('Đà Nẵng')
                      ? 'DN-HUB'
                      : 'HCM-HUB'}
                  </div>
                  <div className="text-[11px] font-bold text-gray-700 mt-0.5">
                    Tuyến: {shipment.receiver.district}
                  </div>
                </div>
              </div>

              {/* Barcode & Tracking Code */}
              <div className="mt-3 text-center">
                <SvgBarcode value={shipment.trackingCode} height={44} showText={true} />
              </div>
            </div>

            {/* Sender & Receiver Grid */}
            <div className="grid grid-cols-2 gap-3 border-b-2 border-black pb-3 mb-3 text-[12px]">
              {/* Sender */}
              <div className="border-r border-gray-300 pr-2">
                <div className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                  1. Người Gửi (Shop):
                </div>
                <div className="font-bold text-gray-900 truncate mt-0.5">{shipment.sender.name}</div>
                <div className="text-gray-700 font-mono text-[11px] font-semibold">{shipment.sender.phone}</div>
                <div className="text-gray-600 text-[11px] line-clamp-3 mt-0.5">
                  {shipment.sender.address}, {shipment.sender.district}, {shipment.sender.province}
                </div>
              </div>

              {/* Receiver */}
              <div className="pl-1">
                <div className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                  2. Người Nhận:
                </div>
                <div className="font-bold text-[13px] text-black mt-0.5">{shipment.receiver.name}</div>
                <div className="font-black text-emerald-800 text-[13px] font-mono tracking-wide">
                  {shipment.receiver.phone}
                </div>
                <div className="font-medium text-gray-900 text-[11px] line-clamp-3 mt-0.5">
                  {shipment.receiver.address}, {shipment.receiver.district}, {shipment.receiver.province}
                </div>
              </div>
            </div>

            {/* Package Contents & Weight */}
            <div className="border-b-2 border-black pb-3 mb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-2">
                  <div className="text-[10px] font-bold uppercase text-gray-500">Nội Dung Hàng Hóa:</div>
                  <div className="font-semibold text-gray-800 text-[12px] mt-0.5">
                    {shipment.itemDescription}
                  </div>
                  <div className="text-[11px] text-gray-600">
                    {shipment.items.map((it) => `${it.name} (x${it.quantity})`).join(', ')}
                  </div>
                </div>
                <div className="text-right text-[11px] border-l border-gray-300 pl-2 min-w-[100px]">
                  <div>
                    Trọng lượng: <span className="font-bold">{shipment.weightKg} kg</span>
                  </div>
                  <div>
                    Kích thước:{' '}
                    <span className="font-mono text-[10px]">
                      {shipment.dimensions.lengthCm}x{shipment.dimensions.widthCm}x{shipment.dimensions.heightCm}cm
                    </span>
                  </div>
                  <div className="text-emerald-700 font-bold uppercase text-[10px] mt-0.5">
                    {getServiceLabel(shipment.serviceType)}
                  </div>
                </div>
              </div>
            </div>

            {/* Shipper Instruction Note */}
            <div className="bg-amber-50 border border-amber-300 p-2 rounded-xs mb-3 text-[11px]">
              <span className="font-bold text-amber-900 uppercase">Chỉ dẫn giao hàng: </span>
              <span className="text-amber-950 font-medium">{shipment.notesForShipper}</span>
            </div>

            {/* COD & Payment Matrix */}
            <div className="grid grid-cols-2 gap-2 border-2 border-black p-2.5 rounded-xs mb-3 bg-gray-50">
              {/* COD Box */}
              <div>
                <div className="text-[10px] font-bold uppercase text-gray-600">Tiền Thu Hộ (COD):</div>
                <div className="text-xl font-black text-red-600 tracking-tight mt-0.5">
                  {shipment.codAmount.toLocaleString('vi-VN')}{' '}
                  <span className="text-xs font-bold text-red-500">VNĐ</span>
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">
                  {shipment.codAmount === 0 ? 'Không thu tiền hàng' : 'Thu tiền trước khi bóc gói'}
                </div>
              </div>

              {/* Shipping Fee Box */}
              <div className="border-l border-gray-300 pl-2">
                <div className="text-[10px] font-bold uppercase text-gray-600">Cước Vận Chuyển:</div>
                <div className="text-base font-bold text-gray-900 mt-0.5">
                  {shipment.totalFee.toLocaleString('vi-VN')} đ
                </div>
                <div className="text-[10px] font-bold mt-0.5">
                  Người trả cước:{' '}
                  <span className="text-blue-700 uppercase">
                    {shipment.payer === 'RECEIVER_PAY' ? 'Người nhận' : 'Shop gửi'}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code & Signature Box */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <SvgQrCode value={`https://fastship.vn/track?code=${shipment.trackingCode}`} size={76} />
                <div className="text-[10px] text-gray-500 max-w-[120px] leading-tight">
                  Quét mã QR để tra cứu hành trình hoặc xác nhận nhận hàng
                </div>
              </div>

              <div className="border border-gray-400 p-2 text-center rounded-xs w-[150px] min-h-[76px] flex flex-col justify-between">
                <div className="text-[10px] font-bold uppercase text-gray-600">Chữ Ký Người Nhận</div>
                <div className="text-[9px] text-gray-400 italic">Xác nhận nguyên vẹn tem</div>
              </div>
            </div>

            {/* Footer footnote */}
            <div className="mt-3 pt-2 border-t border-gray-200 text-center text-[9px] text-gray-500 flex justify-between">
              <span>Ngày in: {new Date().toLocaleDateString('vi-VN')}</span>
              <span>Tổng đài hỗ trợ: 1900 6868</span>
              <span>fastship.vn</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t flex items-center justify-between text-xs text-gray-500 print:hidden">
          <span>* Mẹo: Hỗ trợ in trực tiếp trên giấy in nhiệt tem dán decal nhiệt A6 (100x150mm).</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
