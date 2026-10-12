import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import {
  Menu,
  Search,
  Database,
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  Store,
  Bike,
  Compass,
} from 'lucide-react';

interface TopBarProps {
  currentView: string;
  onOpenMobileSidebar: () => void;
  onSearchTrack: (code: string) => void;
  onOpenCalculator: () => void;
  onOpenDatabaseModal: () => void;
  onNavigateLogin: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentView,
  onOpenMobileSidebar,
  onSearchTrack,
  onOpenDatabaseModal,
  onNavigateLogin,
}) => {
  const { currentUser, isAuthenticated, logout } = useLogistics();
  const [keyword, setKeyword] = useState('');

  const getPageInfo = () => {
    switch (currentView) {
      case 'LOGIN':
        return { title: 'Cổng Đăng Nhập Hệ Thống', breadcrumb: 'Xác thực tài khoản & Phân quyền vận hành' };
      case 'PUBLIC':
        return { title: 'Trang Chủ Dịch Vụ', breadcrumb: 'Tra cứu & Báo giá cước toàn quốc' };
      case 'TRACKING':
        return { title: 'Theo Dõi Vận Đơn', breadcrumb: 'Hành trình di chuyển & Trạng thái bưu kiện' };
      case 'CUSTOMER':
        return { title: 'Đơn Hàng Khách Hàng', breadcrumb: 'Quản lý đơn cá nhân & Sổ địa chỉ' };
      case 'SHOP':
        return { title: 'Quản Trị Bán Hàng & Đơn Lô', breadcrumb: 'Nhập Excel, In phiếu A6, Đối soát COD' };
      case 'SHIPPER':
        return { title: 'Ứng Dụng Shipper Di Động', breadcrumb: 'Nhiệm vụ lấy hàng, giao hàng & Ví COD' };
      case 'DISPATCHER':
        return { title: 'Điều Phối & Quản Lý Kho Bãi', breadcrumb: 'Phân công tài xế, Quét mã vạch kho' };
      case 'ADMIN':
        return { title: 'Bảng Điều Khiển Quản Trị', breadcrumb: 'KPI sản lượng, Cấu hình bảng giá cước' };
      default:
        return { title: 'Hệ Thống FastShip Logistics', breadcrumb: 'Quản lý vận chuyển' };
    }
  };

  const info = getPageInfo();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearchTrack(keyword.trim());
      setKeyword('');
    }
  };

  const getRoleIcon = () => {
    switch (currentUser.role) {
      case 'ADMIN': return ShieldCheck;
      case 'DISPATCHER': return Compass;
      case 'SHIPPER': return Bike;
      case 'SHOP': return Store;
      default: return User;
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile trigger & Titles */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 lg:hidden transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight leading-tight">
                {info.title}
              </h1>
              {isAuthenticated && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <RoleIcon className="w-3 h-3 text-emerald-600" />
                  <span>{currentUser.role}</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {info.breadcrumb}
            </p>
          </div>
        </div>

        {/* Center / Right: Global Search, Database trigger & Auth Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          <form
            onSubmit={handleSearch}
            className="relative hidden md:flex items-center w-52 lg:w-60"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Mã vận đơn (FS-...)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-8 pr-12 py-1.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-hidden transition"
            />
            <button
              type="submit"
              className="absolute right-1 px-2 py-0.5 bg-emerald-600 text-white font-bold text-[10px] rounded-lg hover:bg-emerald-700 transition"
            >
              Tra
            </button>
          </form>

          {/* MySQL Database Trigger in TopBar */}
          <button
            onClick={onOpenDatabaseModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition"
            title="Tải tệp database.sql để chạy trên XAMPP phpMyAdmin"
          >
            <Database className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="hidden sm:inline">CSDL MySQL (.sql)</span>
          </button>

          {/* Authentication State: User profile with Logout OR Login Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-400 leading-none">
                  {currentUser.email}
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser.name.charAt(0)}
              </div>

              <button
                onClick={() => {
                  logout();
                  onNavigateLogin();
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition"
                title="Đăng xuất khỏi tài khoản hiện tại"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đăng Xuất</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onNavigateLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-xs transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng Nhập</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
