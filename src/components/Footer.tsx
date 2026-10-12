import React from 'react';
import { Truck, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Truck className="w-4 h-4" />
              </div>
              <span className="font-black text-lg text-white">
                FAST<span className="text-orange-500">SHIP</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Hệ thống website quản lý và theo dõi dịch vụ chuyển phát nhanh, tiết kiệm và đối soát COD toàn diện tại Việt Nam.
            </p>
            <div className="text-[11px] text-emerald-400 font-semibold">
              Học phần: Đồ án Xây dựng và phát triển phần mềm
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">Mạng Lưới Vận Hành</h4>
            <ul className="space-y-1.5 text-xs">
              <li>Kho Tổng Miền Bắc: KCN Đài Tư, Long Biên, Hà Nội</li>
              <li>Kho Trung Chuyển Miền Trung: KCN Hòa Khánh, Đà Nẵng</li>
              <li>Kho Tổng Miền Nam: 102 Trường Chinh, Tân Bình, TP.HCM</li>
              <li>Bưu cục Tây Nam Bộ: 128 đường 30/4, Ninh Kiều, Cần Thơ</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">Hỗ Trợ & CSKH</h4>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-1.5 text-white font-bold">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> Hotline 24/7: 1900 6868
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" /> cskh@fastship.vn
              </li>
              <li>Chính sách bồi thường & giải quyết khiếu nại</li>
              <li>Quy định hàng cấm và kiểm tra đồng kiểm</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">Chứng Nhận & Công Nghệ</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kiến trúc chuẩn phân hệ Role-Based Access Control, quy trình khép kín 12 trạng thái, tích hợp mã vạch Barcode Code 128 và mã QR.
            </p>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-emerald-400 text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Hệ Thống Đạt Chuẩn Đồ Án
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © 2026 FastShip Logistics Vietnam. Báo cáo Đồ án Phát triển Phần mềm.
          </div>
          <div className="flex items-center gap-4">
            <span>Thiết kế & Triển khai thực tế</span>
            <span>Phiên bản v2.4.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
