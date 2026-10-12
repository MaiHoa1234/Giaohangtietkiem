import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { VIETNAM_PROVINCES } from '../data/vietnamProvinces';
import { ServiceType } from '../types/logistics';
import { Calculator, X, ArrowRight, Zap, Shield, Sparkles } from 'lucide-react';

interface PriceCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PriceCalculatorModal: React.FC<PriceCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { calculateFee, pricingRule } = useLogistics();

  const [fromProvince, setFromProvince] = useState('TP. Hồ Chí Minh');
  const [toProvince, setToProvince] = useState('TP. Hà Nội');
  const [weightKg, setWeightKg] = useState(0.8);
  const [lengthCm, setLengthCm] = useState(25);
  const [widthCm, setWidthCm] = useState(15);
  const [heightCm, setHeightCm] = useState(10);
  const [serviceType, setServiceType] = useState<ServiceType>('STANDARD');
  const [codAmount, setCodAmount] = useState(500000);

  if (!isOpen) return null;

  const feeResult = calculateFee({
    weightKg,
    lengthCm,
    widthCm,
    heightCm,
    serviceType,
    senderProvince: fromProvince,
    receiverProvince: toProvince,
    codAmount,
  });

  const isInterProvince = fromProvince !== toProvince;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-snug">Ước Tính Cước Phí Vận Chuyển</h3>
              <p className="text-xs text-emerald-100">Tính toán tức thì theo kích thước, khoảng cách & dịch vụ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm">
          {/* Origin & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tỉnh / Thành gửi:</label>
              <select
                value={fromProvince}
                onChange={(e) => setFromProvince(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {VIETNAM_PROVINCES.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tỉnh / Thành nhận:</label>
              <select
                value={toProvince}
                onChange={(e) => setToProvince(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {VIETNAM_PROVINCES.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Weight & Dimension */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-700">Trọng lượng kiện hàng (kg):</label>
                <span className="font-bold text-emerald-700">{weightKg} kg</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="20"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Kích thước (Dài x Rộng x Cao cm):
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    type="number"
                    min="1"
                    max="150"
                    value={lengthCm}
                    onChange={(e) => setLengthCm(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-center text-sm"
                    placeholder="Dài"
                  />
                  <span className="text-[10px] text-gray-400 block text-center mt-0.5">Dài (cm)</span>
                </div>
                <div>
                  <input
                    type="number"
                    min="1"
                    max="150"
                    value={widthCm}
                    onChange={(e) => setWidthCm(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-center text-sm"
                    placeholder="Rộng"
                  />
                  <span className="text-[10px] text-gray-400 block text-center mt-0.5">Rộng (cm)</span>
                </div>
                <div>
                  <input
                    type="number"
                    min="1"
                    max="150"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-center text-sm"
                    placeholder="Cao"
                  />
                  <span className="text-[10px] text-gray-400 block text-center mt-0.5">Cao (cm)</span>
                </div>
              </div>
              <div className="text-[11px] text-gray-500 mt-1 italic">
                Khối lượng quy đổi thể tích (DxRxC/5000):{' '}
                <span className="font-semibold text-gray-700">
                  {((lengthCm * widthCm * heightCm) / 5000).toFixed(2)} kg
                </span>
                {' → '}Tính cước theo:{' '}
                <span className="font-bold text-emerald-700">{feeResult.chargeableWeightKg} kg</span>
              </div>
            </div>

            {/* Service speed buttons */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Gói dịch vụ vận chuyển:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setServiceType('STANDARD')}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    serviceType === 'STANDARD'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <div className="font-bold text-xs">Tiết Kiệm</div>
                  <div className="text-[11px] text-gray-500">2 - 3 ngày</div>
                </button>

                <button
                  type="button"
                  onClick={() => setServiceType('EXPRESS')}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    serviceType === 'EXPRESS'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1">
                    Giao Nhanh <Zap className="w-3 h-3 text-amber-500" />
                  </div>
                  <div className="text-[11px] text-gray-500">24 giờ</div>
                </button>

                <button
                  type="button"
                  onClick={() => setServiceType('SUPER_FAST')}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    serviceType === 'SUPER_FAST'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1">
                    Hỏa Tốc <Sparkles className="w-3 h-3 text-orange-500" />
                  </div>
                  <div className="text-[11px] text-gray-500">2 - 4 giờ</div>
                </button>
              </div>
            </div>

            {/* COD Amount */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tiền thu hộ COD dự kiến (VNĐ):
              </label>
              <input
                type="number"
                step="50000"
                value={codAmount}
                onChange={(e) => setCodAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium"
              />
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-xl">
            <div className="flex items-baseline justify-between border-b border-emerald-200/70 pb-2 mb-2">
              <span className="text-gray-700 font-medium">Tổng cước phí dự kiến:</span>
              <span className="text-2xl font-black text-emerald-700">
                {feeResult.totalFee.toLocaleString('vi-VN')} <span className="text-sm font-bold">VNĐ</span>
              </span>
            </div>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Cước vận chuyển chính:</span>
                <span className="font-semibold text-gray-800">{feeResult.shippingFee.toLocaleString('vi-VN')} đ</span>
              </div>
              {feeResult.insuranceFee > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>Phí bảo hiểm hàng giá trị cao (0.5%):</span>
                  <span className="font-semibold">+{feeResult.insuranceFee.toLocaleString('vi-VN')} đ</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Khoảng cách tuyến:</span>
                <span className="font-medium text-gray-700">
                  {isInterProvince ? 'Liên tỉnh (Có phụ cước liên miền)' : 'Nội tỉnh'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
