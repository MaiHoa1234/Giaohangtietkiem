import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { VIETNAM_PROVINCES } from '../data/vietnamProvinces';
import { ServiceType } from '../types/logistics';
import {
  Search,
  Truck,
  ShieldCheck,
  Clock,
  Sparkles,
  Calculator,
  ArrowRight,
  Zap,
  MapPin,
  CheckCircle2,
  ChevronDown,
  PhoneCall,
  FileSpreadsheet,
  Users,
  Building2,
} from 'lucide-react';

interface PublicHomeProps {
  onSearchTrack: (code: string) => void;
  onOpenCalculator: () => void;
  onNavigateRole: (role: string) => void;
  onNavigateLogin?: (role?: string) => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({
  onSearchTrack,
  onOpenCalculator,
  onNavigateRole,
  onNavigateLogin,
}) => {
  const { calculateFee, pricingRule, warehouses, shippers } = useLogistics();
  const [quickCode, setQuickCode] = useState('');

  // Mini calculator state
  const [fromProv, setFromProv] = useState('TP. Hồ Chí Minh');
  const [toProv, setToProv] = useState('TP. Hà Nội');
  const [weightKg, setWeightKg] = useState(1);
  const [service, setService] = useState<ServiceType>('STANDARD');

  const miniFee = calculateFee({
    weightKg,
    lengthCm: 25,
    widthCm: 15,
    heightCm: 10,
    serviceType: service,
    senderProvince: fromProv,
    receiverProvince: toProv,
    codAmount: 300000,
  });

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickCode.trim()) {
      onSearchTrack(quickCode.trim());
    }
  };

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Thời gian giao hàng tiêu chuẩn và giao nhanh mất bao lâu?',
      a: 'Tuyến nội tỉnh: Giao trong 6-24 giờ. Tuyến liên tỉnh kết nối các thành phố lớn (Hà Nội, TP.HCM, Đà Nẵng): Giao trong 24-48 giờ với dịch vụ Nhanh, và 2-3 ngày với dịch vụ Tiết Kiệm.',
    },
    {
      q: 'Chính sách thu hộ COD và lịch đối soát chuyển khoản cho Shop ra sao?',
      a: 'FastShip miễn phí thu hộ COD cho đơn hàng dưới 3.000.000đ. Tiền COD được đối soát tự động định kỳ vào Thứ 2 - Thứ 4 - Thứ 6 hàng tuần và chuyển khoản trực tiếp vào tài khoản ngân hàng của chủ shop.',
    },
    {
      q: 'Nếu người nhận hẹn lại hoặc không liên lạc được, đơn hàng xử lý thế nào?',
      a: 'Shipper sẽ liên hệ tối thiểu 3 cuộc gọi ở các khung giờ khác nhau. Nếu chưa thành công, đơn hàng lưu tại bưu cục và giao lại tối đa 3 lần miễn phí trước khi tiến hành chuyển hoàn về cho người gửi.',
    },
    {
      q: 'Hàng hóa bị hư hỏng hoặc thất lạc được bồi thường như thế nào?',
      a: 'Hệ thống áp dụng chính sách bồi thường 100% giá trị khai báo có đóng bảo hiểm hàng hóa, hoặc tối đa 4 lần cước vận chuyển đối với kiện hàng thông thường theo đúng quy định bưu chính.',
    },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 rounded-3xl text-white p-6 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-emerald-300 rounded-full text-xs font-semibold backdrop-blur-md mb-4 border border-white/10">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            Hệ Thống Giao Nhận & Quản Lý Vận Chuyển Toàn Diện
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            Giao Nhanh - Tiết Kiệm <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              Chính Xác Từng Điểm Đến
            </span>
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
            Giải pháp giao nhận trọn gói tối ưu cho khách hàng cá nhân và chủ shop thương mại điện tử. Kết nối liên tỉnh xuyên suốt 63 tỉnh thành với quy trình quản lý bưu cục, đối soát COD tự động và giám sát shipper theo thời gian thực.
          </p>

          {/* Direct CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <button
              type="button"
              onClick={() => onNavigateLogin ? onNavigateLogin('SHOP') : onNavigateRole('SHOP')}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4" /> Đăng Nhập Cổng Chủ Shop
            </button>
            <button
              type="button"
              onClick={() => onNavigateLogin ? onNavigateLogin() : onNavigateRole('LOGIN')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl transition border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Vào Cổng Đăng Nhập Hệ Thống</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Tracking Search Form */}
          <form onSubmit={handleTrackSubmit} className="bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20 max-w-2xl shadow-xl flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-emerald-200 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={quickCode}
                onChange={(e) => setQuickCode(e.target.value)}
                placeholder="Nhập mã vận đơn (VD: FS-HCM-942183)..."
                className="w-full bg-white text-gray-900 placeholder:text-gray-400 font-mono font-bold text-sm sm:text-base px-4 py-3.5 pl-11 rounded-xl shadow-inner focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <button
              type="submit"
              className="px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-sm rounded-xl transition shadow-lg shrink-0 flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" /> Tra Cứu Vận Đơn
            </button>
          </form>

          {/* Popular sample track chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-emerald-200">
            <span>Tra cứu nhanh mã mẫu:</span>
            {['FS-HCM-882910', 'FS-HCM-942183', 'FS-HN-552109', 'FS-HCM-772819'].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => onSearchTrack(code)}
                className="font-mono bg-white/10 hover:bg-white/25 px-2 py-0.5 rounded-md text-white transition underline underline-offset-2"
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10 text-white">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">63</div>
            <div className="text-xs text-emerald-200/80">Tỉnh thành phủ sóng</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">99.2%</div>
            <div className="text-xs text-emerald-200/80">Tỷ lệ giao đúng hạn</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">&lt; 24h</div>
            <div className="text-xs text-emerald-200/80">Đối soát chuyển khoản COD</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">12 Trạng thái</div>
            <div className="text-xs text-emerald-200/80">Chu trình vận hành khép kín</div>
          </div>
        </div>
      </section>

      {/* Interactive Quick Fee Calculator Widget */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
              <Calculator className="w-4 h-4" /> Bảng tính nhanh cước phí
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
              Dự Tính Chi Phí Trước Khi Gửi Hàng
            </h2>
          </div>
          <button
            onClick={onOpenCalculator}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start md:self-auto"
          >
            Mở bảng tính chi tiết có kích thước kiện <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-200">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Gửi từ:</label>
            <select
              value={fromProv}
              onChange={(e) => setFromProv(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800"
            >
              {VIETNAM_PROVINCES.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Giao đến:</label>
            <select
              value={toProv}
              onChange={(e) => setToProv(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800"
            >
              {VIETNAM_PROVINCES.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Khối lượng: <span className="font-bold text-emerald-700">{weightKg} kg</span>
            </label>
            <input
              type="range"
              min="0.2"
              max="15"
              step="0.2"
              value={weightKg}
              onChange={(e) => setWeightKg(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 mt-2 cursor-pointer"
            />
          </div>

          <div className="bg-emerald-600 text-white p-3.5 rounded-xl flex flex-col justify-between">
            <div className="text-[11px] text-emerald-100 font-medium">Cước ước tính:</div>
            <div className="text-xl sm:text-2xl font-black">
              {miniFee.totalFee.toLocaleString('vi-VN')} <span className="text-xs font-semibold">VNĐ</span>
            </div>
            <div className="text-[10px] text-emerald-200">
              {fromProv === toProv ? 'Nội tỉnh • 12-24h' : 'Liên tỉnh • 24-48h'}
            </div>
          </div>
        </div>
      </section>

      {/* 3 Shipping Services Tiers */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Gói Dịch Vụ</span>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">Đa Dạng Giải Pháp Giao Hàng</h2>
          <p className="text-xs text-gray-500 mt-1">
            Lựa chọn theo tốc độ và ngân sách phù hợp cho từng mặt hàng của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Standard */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs hover:border-emerald-300 transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center font-bold mb-4">
                <Truck className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Giao Tiết Kiệm</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                Tối ưu chi phí cho các đơn hàng thương mại điện tử không gấp gáp.
              </p>
              <div className="text-2xl font-black text-gray-900 mb-4">
                Từ 22.000 <span className="text-xs font-normal text-gray-500">đ/đơn</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Thời gian 2 - 3 ngày làm việc
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Miễn phí giao lại 3 lần
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Thu hộ COD an toàn
                </li>
              </ul>
            </div>
          </div>

          {/* Express */}
          <div className="bg-gradient-to-b from-emerald-50/50 to-white rounded-2xl p-6 border-2 border-emerald-500 shadow-md relative flex flex-col justify-between">
            <div className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              Phổ biến nhất
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Giao Nhanh (Express)</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                Giao trong vòng 24 giờ cho các thành phố lớn và nội vùng.
              </p>
              <div className="text-2xl font-black text-emerald-700 mb-4">
                Từ 33.000 <span className="text-xs font-normal text-gray-500">đ/đơn</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Cam kết giao chuẩn trong 24h
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ưu tiên lấy hàng trong 2h
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Theo dõi lộ trình thời gian thực
                </li>
              </ul>
            </div>
          </div>

          {/* Super Fast */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs hover:border-orange-300 transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Hỏa Tốc 2 - 4 Giờ</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                Giao gấp tài liệu, đồ ăn, quà tặng hoặc hàng hóa khẩn cấp trong nội thành.
              </p>
              <div className="text-2xl font-black text-gray-900 mb-4">
                Từ 45.000 <span className="text-xs font-normal text-gray-500">đ/đơn</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Shipper chuyên trách nhận và giao ngay
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Giao nhận tận tay trực tiếp
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Bảo hiểm hàng hóa đầy đủ
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Network Hubs & Warehouses Showcase */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Hạ Tầng Vận Hành</span>
            <h2 className="text-2xl font-bold mt-1">Mạng Lưới Kho Bãi & Bưu Cục Trung Chuyển</h2>
            <p className="text-xs text-slate-400 mt-1">
              Đảm bảo lưu thoát hàng hóa liên tục không nghẽn mạch
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 bg-white/10 rounded-lg text-emerald-300 self-start md:self-auto">
            Hệ thống phân luồng tự động
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {warehouses.map((wh) => (
            <div key={wh.id} className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">{wh.name}</span>
                <span className="font-mono text-[11px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-sm font-semibold">
                  {wh.code}
                </span>
              </div>
              <p className="text-slate-400 leading-snug">{wh.address}</p>
              <div className="flex justify-between pt-2 border-t border-slate-700/60 text-[11px]">
                <span className="text-slate-400">Quản lý: {wh.manager}</span>
                <span className="text-emerald-400 font-medium">Hiện có: {wh.currentStock} kiện</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Hỏi & Đáp</span>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">Câu Hỏi Thường Gặp</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((f, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 py-4 text-left font-bold text-sm text-gray-900 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition"
              >
                <span>{f.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 py-4 text-xs text-gray-600 leading-relaxed bg-white border-t border-gray-200">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
