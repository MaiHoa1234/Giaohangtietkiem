import React from 'react';
import { useLogistics } from '../context/LogisticsContext';
import {
  Truck,
  Store,
  User,
  Bike,
  Compass,
  ShieldCheck,
  MapPin,
  Calculator,
  BarChart3,
  LogOut,
  LogIn,
  X,
  Database,
  Layers,
  FileSpreadsheet,
  PackageCheck,
  Building2,
  CheckCircle2,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenCalculator: () => void;
  onOpenDatabaseModal: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onOpenCalculator,
  onOpenDatabaseModal,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { currentUser, shipments, isAuthenticated, logout } = useLogistics();

  const pendingCount = shipments.filter(
    (s) => s.status === 'PENDING' || s.status === 'WAITING_PICKUP'
  ).length;

  const getRoleDetails = () => {
    switch (currentUser.role) {
      case 'ADMIN':
        return {
          label: 'Quản Trị Viên (Admin)',
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
          Icon: ShieldCheck,
        };
      case 'DISPATCHER':
        return {
          label: 'Điều Phối Viên Kho',
          badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          Icon: Compass,
        };
      case 'SHIPPER':
        return {
          label: 'Tài Xế Shipper Giao Nhận',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
          Icon: Bike,
        };
      case 'SHOP':
        return {
          label: 'Chủ Cửa Hàng (Shop)',
          badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
          Icon: Store,
        };
      default:
        return {
          label: 'Khách Hàng Cá Nhân',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          Icon: User,
        };
    }
  };

  const roleInfo = getRoleDetails();

  const navItem = (
    view: string,
    label: string,
    Icon: React.ComponentType<{ className?: string }>,
    badge?: number | string
  ) => {
    const isActive = currentView === view;
    return (
      <button
        type="button"
        onClick={() => {
          onNavigate(view);
          onCloseMobile();
        }}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          isActive
            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
          <span className="truncate">{label}</span>
        </div>
        {badge !== undefined && (
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              isActive ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
            }`}
          >
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header & Authenticated Profile Card */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div
              onClick={() => {
                onNavigate('PUBLIC');
                onCloseMobile();
              }}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center font-black shadow-md shadow-emerald-600/20">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-xl tracking-tight text-slate-900 leading-none block">
                  FAST<span className="text-emerald-600">SHIP</span>
                </span>
                <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                  Vận Chuyển Chuyên Nghiệp
                </span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg lg:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Genuine User Profile Card (No magic switcher - True Production Identity) */}
          {isAuthenticated ? (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-xl object-cover border border-white shadow-xs shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-slate-900 truncate leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {currentUser.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${roleInfo.badgeColor}`}>
                  <roleInfo.Icon className="w-3 h-3" />
                  <span>{roleInfo.label}</span>
                </span>
                <span className="text-[9px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                onNavigate('LOGIN');
                onCloseMobile();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng Nhập Tài Khoản</span>
            </button>
          )}
        </div>

        {/* Dynamic Navigation Menu STRICTLY Filtered By User Role */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4">
          {/* 1. SHOP ROLE NAVIGATION */}
          {isAuthenticated && currentUser.role === 'SHOP' && (
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">
                Phân Hệ Chủ Shop
              </span>
              {navItem('SHOP', 'Quản Trị Bán Hàng & Đơn Lô', Store)}
              {navItem('TRACKING', 'Tra Cứu Vận Đơn', MapPin)}
              {navItem('PUBLIC', 'Trang Chủ Dịch Vụ', Truck)}
            </div>
          )}

          {/* 2. SHIPPER ROLE NAVIGATION */}
          {isAuthenticated && currentUser.role === 'SHIPPER' && (
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">
                Nhiệm Vụ Tài Xế (Shipper)
              </span>
              {navItem('SHIPPER', 'Lộ Trình & Giao Nhận', Bike, 'Hôm nay')}
              {navItem('TRACKING', 'Tra Cứu Vận Đơn', MapPin)}
            </div>
          )}

          {/* 3. DISPATCHER ROLE NAVIGATION */}
          {isAuthenticated && currentUser.role === 'DISPATCHER' && (
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">
                Vận Hành & Bưu Cục Kho
              </span>
              {navItem('DISPATCHER', 'Điều Phối & Quét Mã Kho', Compass, pendingCount > 0 ? pendingCount : undefined)}
              {navItem('TRACKING', 'Tra Cứu Vận Đơn', MapPin)}
            </div>
          )}

          {/* 4. ADMIN ROLE NAVIGATION */}
          {isAuthenticated && currentUser.role === 'ADMIN' && (
            <>
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Tổng Quản Trị Hệ Thống
                </span>
                {navItem('ADMIN', 'Bảng Điều Khiển KPI Toàn Quốc', BarChart3)}
                {navItem('TRACKING', 'Tra Cứu Vận Đơn', MapPin)}
              </div>

              <div className="space-y-1 pt-2">
                <span className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Giám Sát Nghiệp Vụ
                </span>
                {navItem('SHOP', 'Cổng Doanh Nghiệp Shop', Store)}
                {navItem('DISPATCHER', 'Cổng Điều Phối Kho', Compass)}
                {navItem('SHIPPER', 'Cổng Tài Xế Shipper', Bike)}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onOpenDatabaseModal();
                    onCloseMobile();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100/90 border border-indigo-200 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Database className="w-4 h-4 text-indigo-600" />
                    <span>CSDL MySQL (XAMPP)</span>
                  </div>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-indigo-200 text-indigo-900 rounded">
                    .sql
                  </span>
                </button>
              </div>
            </>
          )}

          {/* 5. CUSTOMER ROLE NAVIGATION */}
          {isAuthenticated && currentUser.role === 'CUSTOMER' && (
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">
                Khách Hàng Cá Nhân
              </span>
              {navItem('CUSTOMER', 'Đơn Hàng Của Tôi', User)}
              {navItem('TRACKING', 'Tra Cứu Vận Đơn', MapPin)}
              {navItem('PUBLIC', 'Trang Chủ Dịch Vụ', Truck)}
            </div>
          )}

          {/* 6. GUEST NAVIGATION (NOT LOGGED IN) */}
          {!isAuthenticated && (
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">
                Khách Vãng Lai
              </span>
              {navItem('PUBLIC', 'Trang Chủ Dịch Vụ', Truck)}
              {navItem('TRACKING', 'Tra Cứu Vận Đơn', MapPin)}
              {navItem('LOGIN', 'Cổng Đăng Nhập', LogIn)}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 space-y-2">
          <button
            type="button"
            onClick={() => {
              onOpenCalculator();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl text-xs transition shadow-sm cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Tính Cước Nhanh</span>
          </button>

          {isAuthenticated && (
            <button
              type="button"
              onClick={() => {
                logout();
                onNavigate('LOGIN');
                onCloseMobile();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng Xuất Khỏi Hệ Thống</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
