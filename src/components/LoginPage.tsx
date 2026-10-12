import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import {
  Truck,
  Lock,
  User,
  ShieldCheck,
  Store,
  Bike,
  Compass,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  AlertCircle,
  HelpCircle,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';

interface LoginPageProps {
  onSuccess: (role?: string) => void;
  onContinueAsGuest: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onContinueAsGuest,
}) => {
  const { login } = useLogistics();
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'DEMO_ROLES' | 'REGISTER'>('LOGIN');

  // Login form state
  const [username, setUsername] = useState('shop_yen');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<'SHOP' | 'CUSTOMER'>('SHOP');
  const [regPassword, setRegPassword] = useState('');

  const demoAccounts = [
    {
      role: 'SHOP',
      label: 'Chủ Cửa Hàng (Shop Yến Fashion)',
      email: 'yen.fashion@shop.vn',
      userKey: 'user_shop_1',
      icon: Store,
      badge: 'Bán Hàng & Đơn Lô',
      desc: 'Quản lý 50+ đơn/ngày, in phiếu A6 chuẩn, đối soát COD T+1',
      theme: 'border-teal-200 bg-teal-50/50 hover:bg-teal-50 text-teal-900',
    },
    {
      role: 'ADMIN',
      label: 'Giám Đốc / Super Admin Hệ Thống',
      email: 'admin@fastship.vn',
      userKey: 'user_admin_1',
      icon: ShieldCheck,
      badge: 'Toàn Quyền Quản Trị',
      desc: 'Theo dõi KPI toàn quốc, doanh thu, phân quyền & bảng giá cước',
      theme: 'border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-900',
    },
    {
      role: 'DISPATCHER',
      label: 'Trưởng Kho / Điều Phối Viên (Tân Bình)',
      email: 'hung.dieuphoi@fastship.vn',
      userKey: 'user_disp_1',
      icon: Compass,
      badge: 'Vận Hành Kho',
      desc: 'Phân bổ tuyến shipper, quét mã vạch nhập/xuất kho trung chuyển',
      theme: 'border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-900',
    },
    {
      role: 'SHIPPER',
      label: 'Tài Xế Giao Nhận (Nguyễn Văn Tuấn)',
      email: 'tuan.shipper@fastship.vn',
      userKey: 'user_ship_1',
      icon: Bike,
      badge: 'Shipper Giao Hàng',
      desc: 'Nhận đơn app di động, cập nhật giao thành công & nộp tiền COD',
      theme: 'border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-900',
    },
    {
      role: 'CUSTOMER',
      label: 'Khách Hàng Cá Nhân (Nguyễn Thu Trang)',
      email: 'thutrang@gmail.com',
      userKey: 'user_cust_1',
      icon: User,
      badge: 'Người Gửi / Nhận',
      desc: 'Tạo đơn lẻ, lưu sổ địa chỉ, định vị lộ trình bưu kiện trực quan',
      theme: 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-900',
    },
  ];

  const handleQuickLogin = (account: typeof demoAccounts[0]) => {
    login(account.userKey);
    setSuccessMsg(`Đăng nhập thành công với vai trò ${account.label}!`);
    setTimeout(() => {
      onSuccess(account.role);
    }, 300);
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!username.trim()) {
      setErrorMsg('Vui lòng nhập email hoặc tài khoản đăng nhập!');
      return;
    }

    const matchedAccount = demoAccounts.find(
      (a) =>
        a.email.toLowerCase() === username.trim().toLowerCase() ||
        a.userKey === username.trim() ||
        username.trim().toLowerCase().includes(a.role.toLowerCase())
    );

    const userKeyToUse = matchedAccount ? matchedAccount.userKey : username.trim();
    const roleTarget = matchedAccount ? matchedAccount.role : 'SHOP';

    login(userKeyToUse);
    setSuccessMsg('Đăng nhập thành công! Đang chuyển hướng...');
    setTimeout(() => {
      onSuccess(roleTarget);
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regPhone.trim() || !regEmail.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc!');
      return;
    }

    login('user_shop_1');
    setSuccessMsg(`Đăng ký tài khoản thành công! Chào mừng ${regFullName}`);
    setTimeout(() => {
      onSuccess(regRole);
    }, 400);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSent(true);
    setTimeout(() => {
      setForgotModalOpen(false);
      setForgotSent(false);
      setForgotEmail('');
    }, 2000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4 sm:px-6 antialiased">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Left Column: Visual Brand Banner */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none" />

          {/* Top Brand */}
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-emerald-300 text-xs font-bold">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Cổng Đăng Nhập Vận Hành Thực Tế</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              FAST<span className="text-emerald-400">SHIP</span> LOGISTICS
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hệ thống quản lý dịch vụ giao nhận bưu kiện, đối soát tiền thu hộ COD và điều phối kho vận tiêu chuẩn toàn quốc.
            </p>
          </div>

          {/* Center Features */}
          <div className="relative z-10 my-8 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">Chủ Shop & Doanh Nghiệp</div>
                <div className="text-slate-400 text-[11px]">Nhập Excel đơn lô, in phiếu A6 tức thì</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">Điều Phối & Phân Tuyến Kho</div>
                <div className="text-slate-400 text-[11px]">Quét mã vạch nhập xuất kho, chỉ định shipper</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Bike className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">Tài Xế Giao Nhận (Shipper)</div>
                <div className="text-slate-400 text-[11px]">Nhận đơn app di động, quản lý ví COD</div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Bảo mật dữ liệu 256-bit</span>
            <span className="text-emerald-400 font-medium">Phiên bản ERP 2026</span>
          </div>
        </div>

        {/* Right Column: Authentication Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white">
          <div>
            {/* Tabs Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-6">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('LOGIN');
                    setErrorMsg('');
                  }}
                  className={`pb-1 text-xs font-bold border-b-2 transition ${
                    activeTab === 'LOGIN'
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Đăng Nhập
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('DEMO_ROLES');
                    setErrorMsg('');
                  }}
                  className={`pb-1 text-xs font-bold border-b-2 transition ${
                    activeTab === 'DEMO_ROLES'
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Tài Khoản Theo Vai Trò (1-Click)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('REGISTER');
                    setErrorMsg('');
                  }}
                  className={`pb-1 text-xs font-bold border-b-2 transition ${
                    activeTab === 'REGISTER'
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Đăng Ký Mới
                </button>
              </div>

              <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
                FastShip Portal
              </span>
            </div>

            {/* Error / Success Feedback */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* TAB 1: STANDARD LOGIN */}
            {activeTab === 'LOGIN' && (
              <form onSubmit={handleStandardLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên đăng nhập hoặc Email:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="VD: yen.fashion@shop.vn hoặc shop_yen"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition"
                      required
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Gợi ý: Dùng tài khoản <span className="font-semibold text-slate-600">shop_yen</span> hoặc chuyển sang tab "Tài Khoản Theo Vai Trò"
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">Mật khẩu:</label>
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(true)}
                      className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu (Mặc định: 123456)..."
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded accent-emerald-600 w-3.5 h-3.5"
                    />
                    <span className="text-[11px]">Ghi nhớ tài khoản này</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('DEMO_ROLES')}
                    className="text-[11px] text-indigo-600 hover:underline font-bold"
                  >
                    Xem tài khoản mẫu →
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Đăng Nhập Vào Hệ Thống FastShip</span>
                </button>
              </form>
            )}

            {/* TAB 2: 1-CLICK DEMO ROLES */}
            {activeTab === 'DEMO_ROLES' && (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-500 mb-2 font-medium">
                  Bấm trực tiếp vào vai trò mong muốn để đăng nhập ngay mà không cần nhập mật khẩu:
                </p>

                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {demoAccounts.map((account) => {
                    const Icon = account.icon;
                    return (
                      <button
                        key={account.role}
                        type="button"
                        onClick={() => handleQuickLogin(account)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition hover:scale-[1.01] ${account.theme}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-white shadow-2xs flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-slate-900">
                                {account.label}
                              </span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-white/80 rounded-md border border-slate-200/60">
                                {account.badge}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 truncate mt-0.5">
                              {account.desc}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 pl-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white px-2 py-1 rounded-lg border border-slate-200/80 shadow-2xs hover:bg-slate-50">
                            Vào <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: REGISTER */}
            {activeTab === 'REGISTER' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Họ và tên / Tên Shop:
                    </label>
                    <input
                      type="text"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="VD: Shop Đầm Xinh hoặc Nguyễn Văn A"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Số điện thoại:
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="09xx xxx xxx"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email đăng ký:
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="email@cuahang.vn"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Loại tài khoản:
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as 'SHOP' | 'CUSTOMER')}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      <option value="SHOP">Chủ Cửa Hàng / Doanh Nghiệp (Shop)</option>
                      <option value="CUSTOMER">Khách Hàng Cá Nhân</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mật khẩu:
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5 cursor-pointer mt-3"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Tạo Tài Khoản & Bắt Đầu Sử Dụng</span>
                </button>
              </form>
            )}
          </div>

          {/* Bottom Guest Option */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="text-slate-500 hover:text-emerald-700 font-semibold transition"
            >
              ← Tiếp tục tra cứu với tư cách Khách vãng lai
            </button>
            <span className="text-[11px] text-slate-400">FastShip • 1900 6868</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Khôi Phục Mật Khẩu</h3>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            {forgotSent ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="font-bold">Đã gửi mã xác nhận!</p>
                <p className="text-[11px] text-slate-600">
                  Vui lòng kiểm tra email của bạn để thiết lập lại mật khẩu mới.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <p className="text-xs text-slate-500">
                  Nhập email đăng ký tài khoản của bạn để nhận liên kết đặt lại mật khẩu:
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow transition"
                >
                  Gửi Liên Kết Đặt Lại
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
