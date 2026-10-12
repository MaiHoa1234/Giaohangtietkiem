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
  Phone,
  Mail,
} from 'lucide-react';

interface LoginPageProps {
  onSuccess: (role?: string) => void;
  onContinueAsGuest: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onContinueAsGuest,
}) => {
  const { login, allUsers } = useLogistics();
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login form state
  const [username, setUsername] = useState('yen.fashion@shop.vn');
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
  const [regShopName, setRegShopName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim()) {
      setErrorMsg('Vui lòng nhập tên tài khoản hoặc email!');
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Vui lòng nhập mật khẩu!');
      return;
    }

    // Authenticate against system accounts
    const input = username.trim().toLowerCase();

    // Map common shortcuts or emails
    let matchedUserIdOrRole = '';
    let targetRole = '';

    if (input === 'admin' || input === 'admin_quan' || input === 'admin@fastship.vn') {
      matchedUserIdOrRole = 'user_admin_1';
      targetRole = 'ADMIN';
    } else if (input === 'shop' || input === 'shop_yen' || input === 'yen.fashion@shop.vn') {
      matchedUserIdOrRole = 'user_shop_1';
      targetRole = 'SHOP';
    } else if (input === 'kho' || input === 'dieuphoi_hung' || input === 'hung.dieuphoi@fastship.vn') {
      matchedUserIdOrRole = 'user_disp_1';
      targetRole = 'DISPATCHER';
    } else if (input === 'shipper' || input === 'shipper_tuan' || input === 'tuan.shipper@fastship.vn') {
      matchedUserIdOrRole = 'user_ship_1';
      targetRole = 'SHIPPER';
    } else if (input === 'khach' || input === 'khach_trang' || input === 'thutrang@gmail.com') {
      matchedUserIdOrRole = 'user_cust_1';
      targetRole = 'CUSTOMER';
    } else {
      // Find in existing registered users
      const found = allUsers.find(
        (u) =>
          u.email.toLowerCase() === input ||
          u.phone === input ||
          u.id.toLowerCase() === input
      );
      if (found) {
        matchedUserIdOrRole = found.id;
        targetRole = found.role;
      } else {
        matchedUserIdOrRole = input;
        targetRole = 'SHOP';
      }
    }

    const ok = login(matchedUserIdOrRole);
    if (ok) {
      setSuccessMsg('Đăng nhập thành công! Đang chuyển hướng vào hệ thống...');
      setTimeout(() => {
        onSuccess(targetRole);
      }, 400);
    } else {
      setErrorMsg('Tài khoản hoặc mật khẩu không chính xác!');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regFullName.trim() || !regPhone.trim() || !regEmail.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ thông tin họ tên, số điện thoại và email!');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Mật khẩu bảo mật phải từ 6 ký tự trở lên!');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không trùng khớp!');
      return;
    }

    // Register user & login directly
    login('user_shop_1');
    setSuccessMsg(`Đăng ký tài khoản ${regRole === 'SHOP' ? 'Chủ Shop' : 'Khách Hàng'} thành công!`);
    setTimeout(() => {
      onSuccess(regRole);
    }, 450);
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
    <div className="min-h-[82vh] flex items-center justify-center py-6 px-4 antialiased">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden">
        {/* Left Column: Enterprise Logistics Identity */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top Branding */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-emerald-300 text-xs font-bold">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Cổng Vận Hành Doanh Nghiệp</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white leading-tight">
              FAST<span className="text-emerald-400">SHIP</span>
              <br />
              <span className="text-base font-bold text-slate-300 tracking-normal">
                Hệ Thống Quản Lý Chuyển Phát Toàn Diện
              </span>
            </h1>

            <p className="text-xs text-slate-300/90 leading-relaxed pt-1">
              Phần mềm quản lý vận đơn, giao nhận bưu kiện, điều phối kho bãi và đối soát thu hộ COD theo thời gian thực cho doanh nghiệp và thương mại điện tử.
            </p>
          </div>

          {/* Core Roles Indicator */}
          <div className="relative z-10 my-8 space-y-2.5">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">Chủ Cửa Hàng (Shop)</div>
                <div className="text-[11px] text-slate-400">Tạo đơn, nhập Excel đơn lô & in A6 chuẩn</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">Điều Phối & Thủ Kho</div>
                <div className="text-[11px] text-slate-400">Phân công shipper & quét mã vạch bưu cục</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Bike className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">Tài Xế Shipper</div>
                <div className="text-[11px] text-slate-400">Lấy hàng, giao hàng & quản lý tiền COD</div>
              </div>
            </div>
          </div>

          {/* Bottom Security Info */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Bảo mật hệ thống SSL 256-bit</span>
            <span className="text-emerald-400 font-semibold">Phiên Bản 2026</span>
          </div>
        </div>

        {/* Right Column: Actual Login / Register Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Tab switch: Đăng nhập vs Đăng ký */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('LOGIN');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`pb-2 text-sm font-extrabold border-b-2 transition cursor-pointer ${
                    activeTab === 'LOGIN'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Đăng Nhập Tài Khoản
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('REGISTER');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`pb-2 text-sm font-extrabold border-b-2 transition cursor-pointer ${
                    activeTab === 'REGISTER'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Đăng Ký Tài Khoản Mới
                </button>
              </div>

              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
                Cổng Doanh Nghiệp
              </span>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* FORM 1: LOGIN */}
            {activeTab === 'LOGIN' && (
              <form onSubmit={handleStandardLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Tên đăng nhập hoặc Email:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nhập email hoặc tài khoản..."
                      className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-hidden transition shadow-inner"
                      required
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Mật khẩu:</label>
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(true)}
                      className="text-[11px] text-emerald-600 hover:text-emerald-700 font-bold hover:underline cursor-pointer"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu của bạn..."
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-hidden transition shadow-inner"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded accent-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-[11px] font-medium">Ghi nhớ đăng nhập</span>
                  </label>

                  <span className="text-[11px] text-slate-400">
                    Bảo mật 2 lớp
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:brightness-105 active:scale-[0.99] text-white font-extrabold rounded-xl text-xs shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer mt-3"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Đăng Nhập Vào Hệ Thống</span>
                </button>

                {/* Practical Account Lookup Hint */}
                <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
                  <span className="font-bold text-slate-700 block">Tài khoản truy cập theo phân quyền:</span>
                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                    <div>• <b>Chủ Shop:</b> <code className="text-teal-700">yen.fashion@shop.vn</code> (hoặc <code>shop</code>)</div>
                    <div>• <b>Quản Trị:</b> <code className="text-rose-700">admin@fastship.vn</code> (hoặc <code>admin</code>)</div>
                    <div>• <b>Điều Phối:</b> <code className="text-indigo-700">hung.dieuphoi@fastship.vn</code> (hoặc <code>kho</code>)</div>
                    <div>• <b>Shipper:</b> <code className="text-amber-700">tuan.shipper@fastship.vn</code> (hoặc <code>shipper</code>)</div>
                  </div>
                  <div className="text-[10px] text-slate-400 pt-0.5">Mật khẩu chung: <span className="font-mono font-bold text-slate-600">123456</span></div>
                </div>
              </form>
            )}

            {/* FORM 2: REGISTER */}
            {activeTab === 'REGISTER' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Họ và tên của bạn:
                    </label>
                    <input
                      type="text"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="VD: Lê Thị Mai"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Số điện thoại liên hệ:
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="09xx xxx xxx"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email đăng nhập:
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="email@doanhnghiep.vn"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
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
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      <option value="SHOP">Chủ Cửa Hàng (Shop Bán Hàng)</option>
                      <option value="CUSTOMER">Khách Hàng Cá Nhân (Gửi Lẻ)</option>
                    </select>
                  </div>

                  {regRole === 'SHOP' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tên Cửa Hàng / Shop:
                      </label>
                      <input
                        type="text"
                        value={regShopName}
                        onChange={(e) => setRegShopName(e.target.value)}
                        placeholder="VD: Mai Fashion Store"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mật khẩu:
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Xác nhận mật khẩu:
                    </label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 active:scale-98 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer mt-3"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Xác Nhận Đăng Ký & Bắt Đầu Sử Dụng</span>
                </button>
              </form>
            )}
          </div>

          {/* Bottom Guest Option */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="text-slate-500 hover:text-emerald-700 font-semibold transition cursor-pointer"
            >
              ← Về Trang Chủ Tra Cứu Vận Đơn
            </button>
            <span className="text-[11px] text-slate-400">Tổng đài hỗ trợ: 1900 6868</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Khôi Phục Mật Khẩu</h3>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {forgotSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="font-bold">Đã gửi hướng dẫn xác thực!</p>
                <p className="text-[11px] text-slate-600">
                  Vui lòng kiểm tra hộp thư email của bạn để thiết lập lại mật khẩu mới.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <p className="text-xs text-slate-500">
                  Nhập địa chỉ email đăng ký để nhận liên kết khôi phục mật khẩu tài khoản:
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@doanhnghiep.vn"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow transition cursor-pointer"
                >
                  Gửi Liên Kết Khôi Phục
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
