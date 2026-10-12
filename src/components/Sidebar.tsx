import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { UserRole } from '../types/logistics';
import {
  Truck,
  Store,
  User,
  Bike,
  Compass,
  ShieldCheck,
  MapPin,
  Calculator,
  ChevronDown,
  BarChart3,
  LogOut,
  LogIn,
  X,
  Database,
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
  const { currentUser, switchRole, shipments, isAuthenticated, logout } = useLogistics();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const pendingCount = shipments.filter(
    (s) => s.status === 'PENDING' || s.status === 'WAITING_PICKUP'
  ).length;

  const roles = [
    { role: 'SHOP' as UserRole, label: 'Shop Yến Fashion', icon: Store, desc: 'Bán hàng & Đơn lô' },
    { role: 'ADMIN' as UserRole, label: 'Quản Trị Viên (Quân)', icon: ShieldCheck, desc: 'Super Admin hệ thống' },
    { role: 'DISPATCHER' as UserRole, label: 'Điều Phối (Tân Bình)', icon: Compass, desc: 'Quản lý kho & tuyến' },
    { role: 'SHIPPER' as UserRole, label: 'Shipper Văn Tuấn', icon: Bike, desc: 'Tài xế giao nhận 59P2' },
    { role: 'CUSTOMER' as UserRole, label: 'Khách Hàng (Trang)', icon: User, desc: 'Tạo đơn & Sổ địa chỉ' },
  ];

  const currentRoleObj = roles.find((r) => r.role === currentUser.role) || roles[0];

  const handleSwitch = (r: UserRole) => {
    switchRole(r);
    setRoleMenuOpen(false);
    if (r === 'CUSTOMER') onNavigate('CUSTOMER');
    else if (r === 'SHOP') onNavigate('SHOP');
    else if (r === 'SHIPPER') onNavigate('SHIPPER');
    else if (r === 'DISPATCHER') onNavigate('DISPATCHER');
    else if (r === 'ADMIN') onNavigate('ADMIN');
    onCloseMobile();
  };

  const navItem = (
    view: string,
    label: string,
    Icon: React.ComponentType<{ className?: string }>,
    badge?: number | string
  ) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => {
          onNavigate(view);
          onCloseMobile();
        }}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
          isActive
            ? 'bg-emerald-600 text-white font-bold shadow-xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
          <span>{label}</span>
        </div>
        {badge !== undefined && (
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
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
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div
              onClick={() => {
                onNavigate('PUBLIC');
                onCloseMobile();
              }}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-black text-lg tracking-tight text-slate-900 leading-none block">
                  FAST<span className="text-emerald-600">SHIP</span>
                </span>
                <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                  Giao Nhanh • Tiết Kiệm
                </span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Account / Role Switcher Card */}
          {isAuthenticated ? (
            <div className="mt-3 relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="w-full flex items-center justify-between p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition text-left text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                    <currentRoleObj.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-slate-900 text-[11px] truncate leading-tight">
                      {currentRoleObj.label}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate leading-none mt-0.5">
                      {currentRoleObj.desc}
                    </div>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {roleMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-50 space-y-0.5 text-xs animate-in fade-in duration-100">
                  <div className="px-2 py-1 text-[9px] font-bold text-slate-400 uppercase">
                    Đổi tài khoản đăng nhập:
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => handleSwitch(r.role)}
                      className={`w-full flex items-center gap-2 p-1.5 rounded-lg text-left transition ${
                        currentUser.role === r.role
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <r.icon className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate text-[11px]">{r.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-3">
              <button
                onClick={() => {
                  onNavigate('LOGIN');
                  onCloseMobile();
                }}
                className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-xs hover:from-emerald-700 hover:to-teal-700 transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập Tài Khoản</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Dịch Vụ & Tra Cứu
            </span>
            {navItem('PUBLIC', 'Trang Chủ', Truck)}
            {navItem('TRACKING', 'Tra Cứu Vận Đơn', MapPin)}
            {!isAuthenticated && navItem('LOGIN', 'Cổng Đăng Nhập', LogIn)}
          </div>

          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Bán Hàng & Khách Hàng
            </span>
            {navItem('SHOP', 'Quản Trị Shop & Đơn Lô', Store)}
            {navItem('CUSTOMER', 'Đơn Hàng Của Tôi', User)}
          </div>

          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Vận Hành & Kho Bãi
            </span>
            {navItem('SHIPPER', 'Shipper Giao Nhận', Bike, 'App')}
            {navItem('DISPATCHER', 'Điều Phối & Quét Kho', Compass, pendingCount > 0 ? pendingCount : undefined)}
          </div>

          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Quản Trị & Cơ Sở Dữ Liệu
            </span>
            {navItem('ADMIN', 'Admin Dashboard', BarChart3)}

            {/* Direct MySQL Database Trigger */}
            <button
              onClick={() => {
                onOpenDatabaseModal();
                onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/60 transition"
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-indigo-600" />
                <span>CSDL MySQL (XAMPP)</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-indigo-200 text-indigo-800 rounded">
                .sql
              </span>
            </button>
          </div>
        </div>

        {/* Clean Footer with Actions */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-1.5">
          <button
            onClick={() => {
              onOpenCalculator();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-2xs"
          >
            <Calculator className="w-3.5 h-3.5" /> Tính Cước Nhanh
          </button>

          {isAuthenticated && (
            <button
              onClick={() => {
                logout();
                onNavigate('LOGIN');
                onCloseMobile();
              }}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold border border-rose-200 transition"
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
