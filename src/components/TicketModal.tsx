import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { MessageSquareWarning, X, Send, CheckCircle2 } from 'lucide-react';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTrackingCode?: string;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  defaultTrackingCode = '',
}) => {
  const { createTicket, currentUser } = useLogistics();

  const [trackingCode, setTrackingCode] = useState(defaultTrackingCode);
  const [customerName, setCustomerName] = useState(currentUser.name);
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '0912345678');
  const [category, setCategory] = useState<'DELAY' | 'DAMAGE' | 'COD_WRONG' | 'FEE_DISPUTE' | 'OTHER'>('DELAY');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim() || !description.trim()) {
      alert('Vui lòng nhập mã vận đơn và nội dung khiếu nại!');
      return;
    }

    createTicket({
      trackingCode: trackingCode.trim(),
      customerName,
      customerPhone,
      category,
      description,
    });

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
        <div className="px-6 py-4 bg-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquareWarning className="w-5 h-5" />
            <h3 className="font-bold text-base">Gửi Yêu Cầu Hỗ Trợ / Khiếu Nại (CS01 - CS02)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-gray-900 text-base">Đã tiếp nhận yêu cầu hỗ trợ!</h4>
            <p className="text-xs text-gray-600">
              Mã yêu cầu khiếu nại cho vận đơn <strong>{trackingCode}</strong> đã được chuyển tới bộ phận Chăm sóc khách hàng. Nhân viên sẽ liên hệ lại qua SĐT {customerPhone} trong vòng 2-4 giờ làm việc.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setDescription('');
                onClose();
              }}
              className="px-5 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl"
            >
              Đóng cửa sổ
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Mã Vận Đơn *:</label>
              <input
                type="text"
                placeholder="VD: FS-HCM-942183"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                className="w-full font-mono font-bold border border-gray-300 rounded-lg p-2.5 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Người liên hệ:</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Số điện thoại:</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Phân loại khiếu nại:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-medium"
              >
                <option value="DELAY">Giao chậm hơn cam kết</option>
                <option value="DAMAGE">Hàng hóa bị hư hỏng / móp méo</option>
                <option value="COD_WRONG">Sai lệch số tiền COD thu hộ</option>
                <option value="FEE_DISPUTE">Thắc mắc về cước phí vận chuyển</option>
                <option value="OTHER">Vấn đề khác</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Mô tả chi tiết vấn đề *:</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Vui lòng cung cấp chi tiết sự việc, thời gian xảy ra, thiệt hại để bưu cục hỗ trợ kiểm tra nhanh nhất..."
                className="w-full border border-gray-300 rounded-lg p-2.5 text-xs"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg text-gray-700"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Gửi Yêu Cầu Hỗ Trợ
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
