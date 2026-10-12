export type ShipmentStatus =
  | 'PENDING'          // Đơn mới tạo, chờ xác nhận
  | 'CONFIRMED'        // Đơn đã được xác nhận
  | 'WAITING_PICKUP'   // Chờ lấy hàng
  | 'PICKED_UP'        // Đã lấy hàng
  | 'IN_TRANSIT'       // Đang vận chuyển liên tỉnh / liên trạm
  | 'AT_WAREHOUSE'     // Hàng đang ở kho / bưu cục
  | 'OUT_FOR_DELIVERY' // Đang giao cho người nhận
  | 'DELIVERY_FAILED'  // Giao hàng thất bại
  | 'DELIVERED'        // Giao hàng thành công
  | 'RETURNING'        // Đang chuyển hoàn
  | 'RETURNED'         // Đã hoàn hàng về người gửi
  | 'CANCELLED';       // Đơn đã hủy

export type ServiceType = 'STANDARD' | 'EXPRESS' | 'SUPER_FAST';

export type PayerType = 'SENDER_PAY' | 'RECEIVER_PAY';

export type UserRole = 'PUBLIC' | 'CUSTOMER' | 'SHOP' | 'SHIPPER' | 'DISPATCHER' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  shopName?: string;
  warehouseId?: string;
  vehiclePlate?: string;
}

export interface StatusHistoryRecord {
  id: string;
  status: ShipmentStatus;
  timestamp: string;
  location: string;
  note: string;
  actor: string;
  actorRole?: string;
}

export interface ShipmentAddress {
  name: string;
  phone: string;
  address: string;
  ward?: string;
  district: string;
  province: string;
}

export interface ShipmentItem {
  id: string;
  name: string;
  quantity: number;
  weightGrams: number;
  price: number;
}

export interface Shipment {
  id: string;
  trackingCode: string; // e.g. GHTK-VN89210
  sender: ShipmentAddress;
  receiver: ShipmentAddress;
  items: ShipmentItem[];
  itemDescription: string;
  weightKg: number;
  dimensions: {
    lengthCm: number;
    widthCm: number;
    heightCm: number;
  };
  serviceType: ServiceType;
  payer: PayerType;
  codAmount: number; // Tiền thu hộ COD
  shippingFee: number; // Cước vận chuyển
  insuranceFee: number; // Phí bảo hiểm hàng giá trị cao
  totalFee: number; // Tổng cước phí vận chuyển
  status: ShipmentStatus;
  statusHistory: StatusHistoryRecord[];
  
  // Logistics references
  currentWarehouseId?: string;
  currentWarehouseName?: string;
  assignedPickupShipperId?: string;
  assignedDeliveryShipperId?: string;
  
  // Failure / Re-delivery
  failureReason?: string;
  deliveryAttempts: number;
  nextDeliveryDate?: string;
  returnReason?: string;
  
  // Metadata & Customer feedback
  notesForShipper?: string; // Ghi chú: Cho xem hàng, không thử
  specialInstructions?: string;
  customerRating?: number; // 1-5 sao
  customerReview?: string;
  shopId?: string;
  createdAt: string;
  estimatedDelivery: string;
  deliveredAt?: string;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  address: string;
  province: string;
  phone: string;
  manager: string;
  capacity: number;
  currentStock: number;
}

export interface Shipper {
  id: string;
  name: string;
  phone: string;
  vehiclePlate: string;
  assignedArea: string;
  activeOrdersCount: number;
  completedOrdersCount: number;
  rating: number;
  avatarUrl: string;
  cashInHand: number; // Tiền COD đang giữ chưa nộp về bưu cục
}

export interface CustomerAddress {
  id: string;
  label: string; // "Nhà riêng", "Kho chính", "Văn phòng"
  contactName: string;
  phone: string;
  address: string;
  district: string;
  province: string;
  isDefault: boolean;
}

export interface ReconciliationBatch {
  id: string;
  code: string; // e.g. DS-202610-001
  shopId: string;
  shopName: string;
  date: string;
  totalOrders: number;
  totalCod: number;
  totalFees: number;
  netPayable: number; // COD thu hộ trừ đi Cước phí shop phải trả
  status: 'PENDING' | 'SETTLED';
  settledAt?: string;
  bankAccount: string;
  bankName: string;
}

export interface SupportTicket {
  id: string;
  trackingCode: string;
  customerName: string;
  customerPhone: string;
  category: 'DELAY' | 'DAMAGE' | 'COD_WRONG' | 'FEE_DISPUTE' | 'OTHER';
  description: string;
  status: 'OPEN' | 'PROCESSING' | 'RESOLVED';
  resolution?: string;
  assignedStaff?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PricingRule {
  standardBaseFee: number; // 22,000 đ cho < 1kg nội tỉnh
  standardPerKgExtra: number; // 5,000 đ mỗi kg tiếp theo
  expressMultiplier: number; // 1.5x
  superFastMultiplier: number; // 2.5x
  interProvinceSurcharge: number; // 15,000 đ nếu liên tỉnh
  insuranceRate: number; // 0.5% nếu giá trị khai báo > 1,000,000 đ
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  details: string;
  ip?: string;
}
