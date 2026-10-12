import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { Shipment, ReconciliationBatch } from '../types/logistics';
import {
  Store,
  Layers,
  FileSpreadsheet,
  Download,
  Upload,
  Printer,
  DollarSign,
  TrendingUp,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface ShopPortalProps {
  onOpenWaybill: (shipment: Shipment) => void;
  onTrackCode: (code: string) => void;
}

export const ShopPortal: React.FC<ShopPortalProps> = ({ onOpenWaybill, onTrackCode }) => {
  const {
    currentUser,
    shipments,
    createBatchShipments,
    reconciliations,
  } = useLogistics();

  const [activeTab, setActiveTab] = useState<'ORDERS' | 'BATCH_IMPORT' | 'RECONCILIATION' | 'MANIFEST'>('ORDERS');
  const [selectedShipmentIds, setSelectedShipmentIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Excel / CSV batch draft rows
  const [batchDraftRows, setBatchDraftRows] = useState([
    {
      receiverName: 'Phạm Thị Thúy',
      receiverPhone: '0978112233',
      receiverAddress: '120 Bạch Đằng, P.24, Bình Thạnh',
      receiverDistrict: 'Bình Thạnh',
      receiverProvince: 'TP. Hồ Chí Minh',
      itemDescription: 'Váy công sở dáng A đính nơ',
      codAmount: 380000,
      weightKg: 0.4,
    },
    {
      receiverName: 'Nguyễn Tiến Dũng',
      receiverPhone: '0903445566',
      receiverAddress: '55 Trần Hưng Đạo, Hoàn Kiếm',
      receiverDistrict: 'Hoàn Kiếm',
      receiverProvince: 'TP. Hà Nội',
      itemDescription: 'Set bộ đồ ngủ lụa satin cao cấp',
      codAmount: 520000,
      weightKg: 0.5,
    },
    {
      receiverName: 'Lê Mai Chi',
      receiverPhone: '0912998877',
      receiverAddress: '88 Lê Lợi, P. Thạch Thang',
      receiverDistrict: 'Hải Châu',
      receiverProvince: 'TP. Đà Nẵng',
      itemDescription: 'Chân váy xếp ly vintage',
      codAmount: 290000,
      weightKg: 0.3,
    },
  ]);

  const [importNotification, setImportNotification] = useState<string | null>(null);

  const shopOrders = shipments.filter((s) => {
    const matchesSearch =
      s.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.receiver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.receiver.phone.includes(searchQuery);
    if (!matchesSearch) return false;
    if (statusFilter === 'ALL') return true;
    return s.status === statusFilter;
  });

  const toggleSelectAll = () => {
    if (selectedShipmentIds.length === shopOrders.length) {
      setSelectedShipmentIds([]);
    } else {
      setSelectedShipmentIds(shopOrders.map((s) => s.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedShipmentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddDraftRow = () => {
    setBatchDraftRows((prev) => [
      ...prev,
      {
        receiverName: '',
        receiverPhone: '',
        receiverAddress: '',
        receiverDistrict: 'Quận 1',
        receiverProvince: 'TP. Hồ Chí Minh',
        itemDescription: 'Sản phẩm thời trang',
        codAmount: 350000,
        weightKg: 0.5,
      },
    ]);
  };

  const handleRemoveDraftRow = (index: number) => {
    setBatchDraftRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleDraftChange = (index: number, field: string, value: any) => {
    setBatchDraftRows((prev) =>
      prev.map((row, idx) => (idx === index ? { ...row, [field]: value } : row))
    );
  };

  const handleExecuteBatch = () => {
    const validRows = batchDraftRows.filter(
      (r) => r.receiverName.trim() && r.receiverPhone.trim() && r.receiverAddress.trim()
    );

    if (validRows.length === 0) {
      alert('Vui lòng điền thông tin tối thiểu người nhận cho các dòng đơn!');
      return;
    }

    const shipmentsToCreate: Partial<Shipment>[] = validRows.map((r) => ({
      sender: {
        name: currentUser.shopName || currentUser.name,
        phone: currentUser.phone,
        address: '48/12 Cộng Hòa, Phường 4',
        district: 'Quận Tân Bình',
        province: 'TP. Hồ Chí Minh',
      },
      receiver: {
        name: r.receiverName,
        phone: r.receiverPhone,
        address: r.receiverAddress,
        district: r.receiverDistrict,
        province: r.receiverProvince,
      },
      itemDescription: r.itemDescription,
      weightKg: r.weightKg,
      dimensions: { lengthCm: 25, widthCm: 18, heightCm: 5 },
      serviceType: 'STANDARD',
      payer: 'RECEIVER_PAY',
      codAmount: r.codAmount,
      shippingFee: 22000,
      totalFee: 22000,
      notesForShipper: 'Cho xem hàng, không thử',
    }));

    const count = createBatchShipments(shipmentsToCreate);
    setImportNotification(`Đã tạo thành công ${count} vận đơn vào hệ thống!`);
    setActiveTab('ORDERS');
  };

  const handleExportCSV = () => {
    const headers = 'Mã Vận Đơn,Người Nhận,Số Điện Thoại,Địa Chỉ,Tiền Thu Hộ COD,Cước Vận Chuyển,Trạng Thái,Ngày Tạo\n';
    const rows = shopOrders
      .map(
        (s) =>
          `"${s.trackingCode}","${s.receiver.name}","${s.receiver.phone}","${s.receiver.address}, ${s.receiver.province}",${s.codAmount},${s.totalFee},"${s.status}","${s.createdAt}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `FastShip_Danh_Sach_Don_Shop_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSampleTemplate = () => {
    const sample =
      'Họ Tên Người Nhận,Số Điện Thoại,Địa Chỉ Chi Tiết,Quận Huyện,Tỉnh Thành,Mô Tả Hàng Hóa,Tiền COD,Khối Lượng(Kg)\n' +
      'Trần Thị Mai,0987654321,123 Lê Lợi,Quận 1,TP. Hồ Chí Minh,Đầm xòe hoa nhí,450000,0.5\n' +
      'Hoàng Văn Thắng,0912334455,45 Bà Triệu,Hoàn Kiếm,TP. Hà Nội,Áo sơ mi oxford trắng,320000,0.4\n';

    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'FastShip_Mau_Nhap_Don_Hang_Loat.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBatchPrint = () => {
    if (selectedShipmentIds.length === 0) {
      alert('Vui lòng tích chọn ít nhất 1 đơn hàng để in phiếu!');
      return;
    }
    const target = shipments.find((s) => s.id === selectedShipmentIds[0]);
    if (target) {
      onOpenWaybill(target);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Shop Banner with Rich Gradient */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-emerald-300 text-2xl backdrop-blur-md shadow-inner">
              <Store className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black">
                  {currentUser.shopName || 'Shop Yến Fashion Official'}
                </h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 bg-emerald-400 text-slate-950 rounded-full">
                  Đối Tác Doanh Nghiệp
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-1">
                Kho lấy hàng mặc định: 48/12 Cộng Hòa, Q.Tân Bình, TP.HCM | SĐT: 0988.776.655
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/15 backdrop-blur-md">
              <span className="text-emerald-200/80 block text-[10px] font-medium">COD Đã Quyết Toán</span>
              <span className="text-xl font-black text-emerald-400">17.920.000 đ</span>
            </div>
            <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/15 backdrop-blur-md">
              <span className="text-amber-200/80 block text-[10px] font-medium">COD Đang Chờ Phiên</span>
              <span className="text-xl font-black text-amber-300">3.705.000 đ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs sm:text-sm font-bold text-slate-500 overflow-x-auto">
        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ORDERS'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" /> Danh Sách Đơn Hàng ({shopOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('BATCH_IMPORT')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'BATCH_IMPORT'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" /> Tạo Đơn Hàng Loạt & Excel (SH02 - SH03)
        </button>

        <button
          onClick={() => setActiveTab('MANIFEST')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'MANIFEST'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" /> Bảng Kê Gửi Hàng (SH07)
        </button>

        <button
          onClick={() => setActiveTab('RECONCILIATION')}
          className={`pb-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'RECONCILIATION'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" /> Bảng Đối Soát COD (SH08 - SH09)
        </button>
      </div>

      {importNotification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <span>{importNotification}</span>
          <button onClick={() => setImportNotification(null)} className="underline">
            Đóng
          </button>
        </div>
      )}

      {/* TAB 1: ORDERS */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm mã vận đơn, người nhận, SĐT..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={handleBatchPrint}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-98"
              >
                <Printer className="w-4 h-4" /> In Vận Đơn Đã Chọn ({selectedShipmentIds.length})
              </button>

              <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-slate-200"
              >
                <Download className="w-4 h-4" /> Xuất File Excel (SH10)
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5 w-8">
                      <input
                        type="checkbox"
                        checked={selectedShipmentIds.length === shopOrders.length && shopOrders.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded accent-emerald-600 cursor-pointer"
                      />
                    </th>
                    <th className="p-3.5">Mã Vận Đơn</th>
                    <th className="p-3.5">Người Nhận & Địa Chỉ</th>
                    <th className="p-3.5">Hàng Hóa / Trọng Lượng</th>
                    <th className="p-3.5 text-right">Thu Hộ COD</th>
                    <th className="p-3.5 text-right">Cước Phí</th>
                    <th className="p-3.5 text-center">Trạng Thái</th>
                    <th className="p-3.5 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shopOrders.map((order) => {
                    const isSelected = selectedShipmentIds.includes(order.id);
                    return (
                      <tr
                        key={order.id}
                        className={`hover:bg-slate-50 transition ${isSelected ? 'bg-emerald-50/50' : ''}`}
                      >
                        <td className="p-3.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(order.id)}
                            className="rounded accent-emerald-600 cursor-pointer"
                          />
                        </td>
                        <td className="p-3.5 font-mono font-bold text-slate-900">
                          {order.trackingCode}
                          <div className="text-[10px] text-slate-400 font-normal">{order.createdAt}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{order.receiver.name}</div>
                          <div className="text-slate-500 font-mono text-[11px] font-semibold">{order.receiver.phone}</div>
                          <div className="text-slate-600 truncate max-w-xs">
                            {order.receiver.address}, {order.receiver.district}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-800">{order.itemDescription}</div>
                          <div className="text-slate-400 text-[11px]">{order.weightKg} kg • {order.serviceType}</div>
                        </td>
                        <td className="p-3.5 text-right font-black text-rose-600 text-sm">
                          {order.codAmount.toLocaleString('vi-VN')} đ
                        </td>
                        <td className="p-3.5 text-right font-bold text-slate-700">
                          {order.totalFee.toLocaleString('vi-VN')} đ
                        </td>
                        <td className="p-3.5 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              order.status === 'DELIVERED'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : order.status === 'OUT_FOR_DELIVERY'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : order.status === 'DELIVERY_FAILED'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : order.status === 'CANCELLED'
                                ? 'bg-slate-200 text-slate-600'
                                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => onOpenWaybill(order)}
                              title="In phiếu gửi A6"
                              className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onTrackCode(order.trackingCode)}
                              title="Xem hành trình"
                              className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BATCH IMPORT & EXCEL */}
      {activeTab === 'BATCH_IMPORT' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Tạo Đơn Hàng Loạt & Nhập Excel (SH02 - SH03)</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Nhập danh sách nhanh hoặc tải file CSV mẫu để lập đơn hàng số lượng lớn cho shop.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadSampleTemplate}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition"
                >
                  <Download className="w-4 h-4 text-emerald-600" /> Tải File Mẫu (.CSV)
                </button>
                <button
                  onClick={handleAddDraftRow}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Thêm Dòng Đơn
                </button>
              </div>
            </div>

            {/* Grid Editor */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">STT</th>
                    <th className="p-3">Họ Tên Người Nhận</th>
                    <th className="p-3">Số Điện Thoại</th>
                    <th className="p-3">Địa Chỉ Chi Tiết</th>
                    <th className="p-3">Tỉnh / Thành</th>
                    <th className="p-3">Mô Tả Hàng Hóa</th>
                    <th className="p-3">Tiền COD (đ)</th>
                    <th className="p-3 text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {batchDraftRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.receiverName}
                          onChange={(e) => handleDraftChange(idx, 'receiverName', e.target.value)}
                          placeholder="Họ tên"
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.receiverPhone}
                          onChange={(e) => handleDraftChange(idx, 'receiverPhone', e.target.value)}
                          placeholder="Số điện thoại"
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.receiverAddress}
                          onChange={(e) => handleDraftChange(idx, 'receiverAddress', e.target.value)}
                          placeholder="Số nhà, đường"
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.receiverProvince}
                          onChange={(e) => handleDraftChange(idx, 'receiverProvince', e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.itemDescription}
                          onChange={(e) => handleDraftChange(idx, 'itemDescription', e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          step="10000"
                          value={row.codAmount}
                          onChange={(e) => handleDraftChange(idx, 'codAmount', parseInt(e.target.value) || 0)}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-black text-rose-600 text-right"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveDraftRow(idx)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleExecuteBatch}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Xác Nhận Khởi Tạo Hàng Loạt ({batchDraftRows.length} Đơn)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HANDOVER MANIFEST */}
      {activeTab === 'MANIFEST' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Bảng Kê Bàn Giao Hàng Cho Shipper (SH07)</h3>
              <p className="text-xs text-slate-400">
                In phiếu ký nhận bàn giao số lượng kiện hàng cho tài xế lấy hàng.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" /> In Bảng Kê Bàn Giao
            </button>
          </div>

          <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/60 text-xs space-y-4">
            <div className="flex justify-between border-b border-slate-200 pb-3">
              <div>
                <strong>Đơn vị giao:</strong> Shop Yến Fashion (0988.776.655)
              </div>
              <div>
                <strong>Ngày bàn giao:</strong> {new Date().toLocaleDateString('vi-VN')}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-slate-700">Danh sách kiện hàng bàn giao:</div>
              {shopOrders.slice(0, 5).map((o, idx) => (
                <div key={o.id} className="flex justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-[11px]">
                  <span>
                    {idx + 1}. <strong className="font-mono text-slate-900">{o.trackingCode}</strong> - {o.receiver.name} ({o.receiver.district})
                  </span>
                  <span>COD: <strong className="text-rose-600">{o.codAmount.toLocaleString('vi-VN')} đ</strong> | Cước: {o.totalFee.toLocaleString('vi-VN')} đ</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
              <div>
                <p className="font-bold">Đại diện Shop gửi</p>
                <p className="text-slate-400 italic mt-10">(Ký và ghi rõ họ tên)</p>
              </div>
              <div>
                <p className="font-bold">Shipper tiếp nhận bàn giao</p>
                <p className="text-slate-400 italic mt-10">(Ký và ghi rõ họ tên)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COD RECONCILIATION */}
      {activeTab === 'RECONCILIATION' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-slate-900 text-base">Bảng Đối Soát Tiền Thu Hộ COD (SH08 - SH09)</h3>
            <p className="text-xs text-slate-400">
              Tổng hợp đối soát tiền COD theo từng phiên chuyển khoản vào tài khoản ngân hàng của Shop.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Mã Kỳ Đối Soát</th>
                  <th className="p-3.5">Ngày Lập</th>
                  <th className="p-3.5 text-center">Số Lượng Đơn</th>
                  <th className="p-3.5 text-right">Tổng Tiền COD Thu</th>
                  <th className="p-3.5 text-right">Khấu Trừ Cước Phí</th>
                  <th className="p-3.5 text-right font-black">Thực Chuyển (Net)</th>
                  <th className="p-3.5 text-center">Trạng Thái</th>
                  <th className="p-3.5">Tài Khoản Thụ Hưởng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reconciliations.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-mono font-bold text-slate-900">{batch.code}</td>
                    <td className="p-3.5 text-slate-600">{batch.date}</td>
                    <td className="p-3.5 text-center font-bold">{batch.totalOrders} đơn</td>
                    <td className="p-3.5 text-right font-semibold text-slate-800">
                      {batch.totalCod.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="p-3.5 text-right text-rose-600">
                      -{batch.totalFees.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="p-3.5 text-right font-black text-emerald-700 text-sm">
                      {batch.netPayable.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${
                          batch.status === 'SETTLED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {batch.status === 'SETTLED' ? 'Đã Quyết Toán' : 'Chờ Đối Soát'}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600 text-[11px]">
                      <div className="font-mono font-bold text-slate-800">{batch.bankAccount}</div>
                      <div className="text-slate-400">{batch.bankName}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
