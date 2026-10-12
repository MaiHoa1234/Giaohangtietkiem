import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Shipment,
  ShipmentStatus,
  ServiceType,
  PayerType,
  UserRole,
  UserProfile,
  Warehouse,
  Shipper,
  CustomerAddress,
  ReconciliationBatch,
  SupportTicket,
  PricingRule,
  ActivityLog,
} from '../types/logistics';
import {
  INITIAL_USERS,
  INITIAL_WAREHOUSES,
  INITIAL_SHIPPERS,
  INITIAL_CUSTOMER_ADDRESSES,
  INITIAL_PRICING_RULE,
  INITIAL_SHIPMENTS,
  INITIAL_RECONCILIATION_BATCHES,
  INITIAL_TICKETS,
} from '../data/mockData';

interface LogisticsContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  isAuthenticated: boolean;
  login: (userIdOrRole: string) => boolean;
  logout: () => void;
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  
  shipments: Shipment[];
  warehouses: Warehouse[];
  shippers: Shipper[];
  addresses: CustomerAddress[];
  reconciliations: ReconciliationBatch[];
  tickets: SupportTicket[];
  pricingRule: PricingRule;
  activityLogs: ActivityLog[];
  
  // Actions
  calculateFee: (params: {
    weightKg: number;
    lengthCm: number;
    widthCm: number;
    heightCm: number;
    serviceType: ServiceType;
    senderProvince: string;
    receiverProvince: string;
    codAmount: number;
    declareValue?: number;
  }) => {
    shippingFee: number;
    insuranceFee: number;
    totalFee: number;
    chargeableWeightKg: number;
  };
  
  createShipment: (data: Partial<Shipment>) => Shipment;
  createBatchShipments: (list: Partial<Shipment>[]) => number;
  updateShipmentStatus: (
    trackingCode: string,
    newStatus: ShipmentStatus,
    note: string,
    location: string,
    actorName?: string
  ) => boolean;
  
  assignShipper: (
    trackingCode: string,
    type: 'pickup' | 'delivery',
    shipperId: string
  ) => boolean;
  
  shipperConfirmPickup: (trackingCode: string, note?: string) => boolean;
  warehouseCheckIn: (trackingCode: string, warehouseId: string, note?: string) => boolean;
  warehouseDispatch: (trackingCode: string, nextLocation: string, note?: string) => boolean;
  shipperDeliverSuccess: (
    trackingCode: string,
    note?: string,
    collectedCod?: number
  ) => boolean;
  shipperDeliverFailed: (
    trackingCode: string,
    reason: string,
    rescheduleDate?: string
  ) => boolean;
  
  cancelShipment: (trackingCode: string, reason: string) => boolean;
  submitReview: (trackingCode: string, rating: number, comment: string) => boolean;
  
  createTicket: (data: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => SupportTicket;
  updateTicketStatus: (ticketId: string, status: 'OPEN' | 'PROCESSING' | 'RESOLVED', resolution?: string) => boolean;
  
  settleReconciliationBatch: (batchId: string) => boolean;
  createCustomerAddress: (address: Omit<CustomerAddress, 'id'>) => CustomerAddress;
  updatePricingRule: (newRules: Partial<PricingRule>) => void;
  resetAllData: () => void;
}

const STORAGE_KEY_PREFIX = 'fastship_app_v1_';

const LogisticsContext = createContext<LogisticsContextType | undefined>(undefined);

export const LogisticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state or use initial mock data
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[1]; // default Shop Yến
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'auth');
    return saved !== null ? saved === 'true' : true;
  });

  const login = (userIdOrRole: string): boolean => {
    const match =
      INITIAL_USERS.find((u) => u.id === userIdOrRole || u.role === userIdOrRole) ||
      INITIAL_USERS.find((u) => u.email.toLowerCase().includes(userIdOrRole.toLowerCase())) ||
      INITIAL_USERS[1];
    
    setCurrentUser(match);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY_PREFIX + 'auth', 'true');
    localStorage.setItem(STORAGE_KEY_PREFIX + 'user', JSON.stringify(match));
    addLog('Đăng nhập', `Người dùng ${match.name} (${match.role}) đăng nhập thành công`);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem(STORAGE_KEY_PREFIX + 'auth', 'false');
    addLog('Đăng xuất', `Người dùng ${currentUser.name} đăng xuất khỏi hệ thống`);
  };

  const [shipments, setShipments] = useState<Shipment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'shipments');
    return saved ? JSON.parse(saved) : INITIAL_SHIPMENTS;
  });

  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'warehouses');
    return saved ? JSON.parse(saved) : INITIAL_WAREHOUSES;
  });

  const [shippers, setShippers] = useState<Shipper[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'shippers');
    return saved ? JSON.parse(saved) : INITIAL_SHIPPERS;
  });

  const [addresses, setAddresses] = useState<CustomerAddress[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'addresses');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMER_ADDRESSES;
  });

  const [reconciliations, setReconciliations] = useState<ReconciliationBatch[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'reconciliations');
    return saved ? JSON.parse(saved) : INITIAL_RECONCILIATION_BATCHES;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [pricingRule, setPricingRule] = useState<PricingRule>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'pricing');
    return saved ? JSON.parse(saved) : INITIAL_PRICING_RULE;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'logs');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'log_init',
            timestamp: new Date().toLocaleString('vi-VN'),
            user: 'Hệ thống FastShip',
            role: 'SYSTEM',
            action: 'Khởi động phiên làm việc',
            details: 'Hệ thống sẵn sàng xử lý luồng vận đơn đa phân hệ',
          },
        ];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'shipments', JSON.stringify(shipments));
  }, [shipments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'warehouses', JSON.stringify(warehouses));
  }, [warehouses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'shippers', JSON.stringify(shippers));
  }, [shippers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'reconciliations', JSON.stringify(reconciliations));
  }, [reconciliations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'pricing', JSON.stringify(pricingRule));
  }, [pricingRule]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  const addLog = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: 'log_' + Date.now() + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toLocaleString('vi-VN'),
      user: currentUser.name,
      role: currentUser.role,
      action,
      details,
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 99)]);
  };

  const switchUser = (userId: string) => {
    const target = INITIAL_USERS.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      addLog('Chuyển tài khoản', `Người dùng chuyển sang: ${target.name} (${target.role})`);
    }
  };

  const switchRole = (role: UserRole) => {
    if (role === 'PUBLIC') {
      setCurrentUser({
        id: 'user_public',
        name: 'Khách vãng lai (Chưa đăng nhập)',
        phone: '',
        email: '',
        role: 'PUBLIC',
      });
      addLog('Đổi phân hệ', 'Chuyển sang giao diện Tra cứu công khai');
      return;
    }
    const match = INITIAL_USERS.find((u) => u.role === role);
    if (match) {
      setCurrentUser(match);
      addLog('Đổi phân hệ', `Chuyển quyền truy cập: ${role}`);
    }
  };

  const calculateFee = ({
    weightKg,
    lengthCm,
    widthCm,
    heightCm,
    serviceType,
    senderProvince,
    receiverProvince,
    codAmount,
    declareValue = 0,
  }: {
    weightKg: number;
    lengthCm: number;
    widthCm: number;
    heightCm: number;
    serviceType: ServiceType;
    senderProvince: string;
    receiverProvince: string;
    codAmount: number;
    declareValue?: number;
  }) => {
    // Volumetric weight conversion: (L * W * H) / 5000
    const volumetricWeight = (lengthCm * widthCm * heightCm) / 5000;
    const chargeableWeight = Math.max(weightKg, volumetricWeight, 0.1);

    const isInterProvince = senderProvince.trim().toLowerCase() !== receiverProvince.trim().toLowerCase();

    // Base fee
    let base = pricingRule.standardBaseFee;
    if (chargeableWeight > 1) {
      const extraKg = Math.ceil(chargeableWeight - 1);
      base += extraKg * pricingRule.standardPerKgExtra;
    }

    if (isInterProvince) {
      base += pricingRule.interProvinceSurcharge;
    }

    // Multiplier by service
    let serviceMultiplier = 1;
    if (serviceType === 'EXPRESS') {
      serviceMultiplier = pricingRule.expressMultiplier;
    } else if (serviceType === 'SUPER_FAST') {
      serviceMultiplier = pricingRule.superFastMultiplier;
    }

    const calculatedShippingFee = Math.round((base * serviceMultiplier) / 1000) * 1000;

    // Insurance fee if declared value or COD is high (> 1,000,000 VND)
    const insuranceTarget = Math.max(codAmount, declareValue);
    const insuranceFee = insuranceTarget > 1000000 ? Math.round(insuranceTarget * pricingRule.insuranceRate) : 0;

    return {
      shippingFee: calculatedShippingFee,
      insuranceFee,
      totalFee: calculatedShippingFee + insuranceFee,
      chargeableWeightKg: Number(chargeableWeight.toFixed(2)),
    };
  };

  const createShipment = (data: Partial<Shipment>): Shipment => {
    const provCode = data.receiver?.province?.includes('Hà Nội')
      ? 'HN'
      : data.receiver?.province?.includes('Đà Nẵng')
      ? 'DN'
      : 'HCM';
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const trackingCode = `FS-${provCode}-${randomDigits}`;

    const now = new Date();
    const createdStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Estimated delivery: 1 to 3 days
    const estDate = new Date(now.getTime() + (data.serviceType === 'SUPER_FAST' ? 4 : data.serviceType === 'EXPRESS' ? 24 : 48) * 3600000);
    const estStr = `${estDate.getFullYear()}-${String(estDate.getMonth() + 1).padStart(2, '0')}-${String(
      estDate.getDate()
    ).padStart(2, '0')} ${String(estDate.getHours()).padStart(2, '0')}:00`;

    const newShipment: Shipment = {
      id: 'ship_' + Date.now() + Math.random().toString(36).substring(2, 6),
      trackingCode,
      sender: data.sender || {
        name: currentUser.name,
        phone: currentUser.phone,
        address: '48/12 Cộng Hòa, Phường 4',
        district: 'Quận Tân Bình',
        province: 'TP. Hồ Chí Minh',
      },
      receiver: data.receiver || {
        name: 'Người nhận hàng',
        phone: '0900000000',
        address: '100 Nguyễn Huệ',
        district: 'Quận 1',
        province: 'TP. Hồ Chí Minh',
      },
      items: data.items || [{ id: 'it_1', name: data.itemDescription || 'Hàng tiêu dùng', quantity: 1, weightGrams: 500, price: 100000 }],
      itemDescription: data.itemDescription || 'Hàng tiêu dùng',
      weightKg: data.weightKg || 0.5,
      dimensions: data.dimensions || { lengthCm: 20, widthCm: 15, heightCm: 5 },
      serviceType: data.serviceType || 'STANDARD',
      payer: data.payer || 'RECEIVER_PAY',
      codAmount: data.codAmount || 0,
      shippingFee: data.shippingFee || 22000,
      insuranceFee: data.insuranceFee || 0,
      totalFee: data.totalFee || (data.shippingFee || 22000) + (data.insuranceFee || 0),
      status: 'PENDING',
      deliveryAttempts: 0,
      notesForShipper: data.notesForShipper || 'Cho xem hàng, không thử',
      shopId: currentUser.role === 'SHOP' ? currentUser.id : undefined,
      createdAt: createdStr,
      estimatedDelivery: estStr,
      statusHistory: [
        {
          id: 'hist_' + Date.now(),
          status: 'PENDING',
          timestamp: createdStr,
          location: 'Hệ thống trực tuyến FastShip',
          note: `Đơn hàng được khởi tạo thành công bởi ${currentUser.name}`,
          actor: currentUser.name,
          actorRole: currentUser.role,
        },
      ],
    };

    setShipments((prev) => [newShipment, ...prev]);
    addLog('Tạo đơn hàng mới', `Vận đơn ${trackingCode} từ ${newShipment.sender.name} tới ${newShipment.receiver.name}`);
    return newShipment;
  };

  const createBatchShipments = (list: Partial<Shipment>[]): number => {
    const created: Shipment[] = list.map((item) => {
      const provCode = item.receiver?.province?.includes('Hà Nội')
        ? 'HN'
        : item.receiver?.province?.includes('Đà Nẵng')
        ? 'DN'
        : 'HCM';
      const randomDigits = Math.floor(100000 + Math.random() * 900000);
      const trackingCode = `FS-${provCode}-${randomDigits}`;
      const now = new Date();
      const createdStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
        now.getDate()
      ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const estDate = new Date(now.getTime() + 48 * 3600000);
      const estStr = `${estDate.getFullYear()}-${String(estDate.getMonth() + 1).padStart(2, '0')}-${String(
        estDate.getDate()
      ).padStart(2, '0')} 18:00`;

      return {
        id: 'ship_' + Date.now() + Math.random().toString(36).substring(2, 6),
        trackingCode,
        sender: item.sender || {
          name: currentUser.name,
          phone: currentUser.phone,
          address: '48/12 Cộng Hòa, Phường 4',
          district: 'Quận Tân Bình',
          province: 'TP. Hồ Chí Minh',
        },
        receiver: item.receiver || {
          name: 'Khách hàng',
          phone: '0901234567',
          address: 'Địa chỉ nhận hàng',
          district: 'Quận 1',
          province: 'TP. Hồ Chí Minh',
        },
        items: item.items || [{ id: 'it_b', name: item.itemDescription || 'Sản phẩm', quantity: 1, weightGrams: 500, price: 100000 }],
        itemDescription: item.itemDescription || 'Hàng hóa thời trang',
        weightKg: item.weightKg || 0.5,
        dimensions: item.dimensions || { lengthCm: 20, widthCm: 15, heightCm: 5 },
        serviceType: item.serviceType || 'STANDARD',
        payer: item.payer || 'RECEIVER_PAY',
        codAmount: item.codAmount || 0,
        shippingFee: item.shippingFee || 22000,
        insuranceFee: item.insuranceFee || 0,
        totalFee: item.totalFee || 22000,
        status: 'PENDING',
        deliveryAttempts: 0,
        notesForShipper: item.notesForShipper || 'Cho xem hàng',
        shopId: currentUser.role === 'SHOP' ? currentUser.id : undefined,
        createdAt: createdStr,
        estimatedDelivery: estStr,
        statusHistory: [
          {
            id: 'hist_' + Date.now() + Math.random(),
            status: 'PENDING',
            timestamp: createdStr,
            location: 'Nhập file Excel/Lô FastShip',
            note: 'Tạo đơn hàng loạt thành công',
            actor: currentUser.name,
          },
        ],
      };
    });

    setShipments((prev) => [...created, ...prev]);
    addLog('Nhập đơn hàng loạt', `Đã tạo ${created.length} đơn hàng thành công từ tệp dữ liệu`);
    return created.length;
  };

  const updateShipmentStatus = (
    trackingCode: string,
    newStatus: ShipmentStatus,
    note: string,
    location: string,
    actorName?: string
  ): boolean => {
    let success = false;
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setShipments((prev) =>
      prev.map((s) => {
        if (s.trackingCode !== trackingCode) return s;

        // Validation: cannot change already delivered or cancelled orders
        if (s.status === 'DELIVERED' && newStatus !== 'DELIVERED') {
          return s;
        }

        success = true;
        const newHist = {
          id: 'hist_' + Date.now(),
          status: newStatus,
          timestamp: timeStr,
          location,
          note,
          actor: actorName || currentUser.name,
          actorRole: currentUser.role,
        };

        return {
          ...s,
          status: newStatus,
          deliveredAt: newStatus === 'DELIVERED' ? timeStr : s.deliveredAt,
          statusHistory: [...s.statusHistory, newHist],
        };
      })
    );

    if (success) {
      addLog('Cập nhật trạng thái', `Đơn ${trackingCode} chuyển sang ${newStatus}: ${note}`);
    }
    return success;
  };

  const assignShipper = (
    trackingCode: string,
    type: 'pickup' | 'delivery',
    shipperId: string
  ): boolean => {
    const shipper = shippers.find((s) => s.id === shipperId);
    if (!shipper) return false;

    const targetStatus = type === 'pickup' ? 'WAITING_PICKUP' : 'OUT_FOR_DELIVERY';
    const note =
      type === 'pickup'
        ? `Đã phân công Shipper ${shipper.name} (${shipper.phone}) lấy hàng từ người gửi`
        : `Đã phân công Shipper ${shipper.name} (${shipper.phone}) giao hàng tới người nhận`;

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setShipments((prev) =>
      prev.map((s) => {
        if (s.trackingCode !== trackingCode) return s;
        return {
          ...s,
          status: targetStatus,
          assignedPickupShipperId: type === 'pickup' ? shipperId : s.assignedPickupShipperId,
          assignedDeliveryShipperId: type === 'delivery' ? shipperId : s.assignedDeliveryShipperId,
          statusHistory: [
            ...s.statusHistory,
            {
              id: 'hist_' + Date.now(),
              status: targetStatus,
              timestamp: timeStr,
              location: shipper.assignedArea,
              note,
              actor: currentUser.name,
              actorRole: currentUser.role,
            },
          ],
        };
      })
    );

    // Increase shipper active orders count
    setShippers((prev) =>
      prev.map((sp) => (sp.id === shipperId ? { ...sp, activeOrdersCount: sp.activeOrdersCount + 1 } : sp))
    );

    addLog('Phân công Shipper', `Giao đơn ${trackingCode} cho tài xế ${shipper.name}`);
    return true;
  };

  const shipperConfirmPickup = (trackingCode: string, note?: string): boolean => {
    return updateShipmentStatus(
      trackingCode,
      'PICKED_UP',
      note || 'Shipper đã kiểm tra ngoại quan kiện hàng và lấy hàng thành công từ người gửi',
      'Điểm gửi hàng'
    );
  };

  const warehouseCheckIn = (trackingCode: string, warehouseId: string, note?: string): boolean => {
    const wh = warehouses.find((w) => w.id === warehouseId);
    const whName = wh ? wh.name : 'Kho Trung chuyển';

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setShipments((prev) =>
      prev.map((s) => {
        if (s.trackingCode !== trackingCode) return s;
        return {
          ...s,
          status: 'AT_WAREHOUSE',
          currentWarehouseId: warehouseId,
          currentWarehouseName: whName,
          statusHistory: [
            ...s.statusHistory,
            {
              id: 'hist_' + Date.now(),
              status: 'AT_WAREHOUSE',
              timestamp: timeStr,
              location: whName,
              note: note || `Nhập kho ${whName}, đã quét mã vạch và kiểm tra cân nặng`,
              actor: currentUser.name,
              actorRole: currentUser.role,
            },
          ],
        };
      })
    );

    // Update warehouse stock
    setWarehouses((prev) =>
      prev.map((w) => (w.id === warehouseId ? { ...w, currentStock: w.currentStock + 1 } : w))
    );

    addLog('Nhập kho', `Kiện ${trackingCode} nhập thành công vào ${whName}`);
    return true;
  };

  const warehouseDispatch = (trackingCode: string, nextLocation: string, note?: string): boolean => {
    return updateShipmentStatus(
      trackingCode,
      'IN_TRANSIT',
      note || `Đã xuất kho, hàng đang trên xe điều chuyển tuyến trung chuyển tới ${nextLocation}`,
      nextLocation
    );
  };

  const shipperDeliverSuccess = (
    trackingCode: string,
    note?: string,
    collectedCod?: number
  ): boolean => {
    const shipment = shipments.find((s) => s.trackingCode === trackingCode);
    if (!shipment) return false;

    const actualCod = collectedCod !== undefined ? collectedCod : shipment.codAmount;
    const noteMsg = note
      ? `${note}. Đã thu COD: ${actualCod.toLocaleString('vi-VN')} đ`
      : `Giao hàng thành công tới tay người nhận! Đã thu COD: ${actualCod.toLocaleString('vi-VN')} đ`;

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setShipments((prev) =>
      prev.map((s) => {
        if (s.trackingCode !== trackingCode) return s;
        return {
          ...s,
          status: 'DELIVERED',
          deliveredAt: timeStr,
          deliveryAttempts: s.deliveryAttempts + 1,
          statusHistory: [
            ...s.statusHistory,
            {
              id: 'hist_' + Date.now(),
              status: 'DELIVERED',
              timestamp: timeStr,
              location: `${s.receiver.address}, ${s.receiver.district}`,
              note: noteMsg,
              actor: currentUser.name,
              actorRole: currentUser.role,
            },
          ],
        };
      })
    );

    // Update shipper cash in hand and completed count
    if (shipment.assignedDeliveryShipperId) {
      setShippers((prev) =>
        prev.map((sp) =>
          sp.id === shipment.assignedDeliveryShipperId
            ? {
                ...sp,
                cashInHand: sp.cashInHand + actualCod,
                completedOrdersCount: sp.completedOrdersCount + 1,
                activeOrdersCount: Math.max(0, sp.activeOrdersCount - 1),
              }
            : sp
        )
      );
    }

    addLog('Giao hàng thành công', `Đơn ${trackingCode} đã hoàn tất. Thu tiền: ${actualCod.toLocaleString('vi-VN')} đ`);
    return true;
  };

  const shipperDeliverFailed = (
    trackingCode: string,
    reason: string,
    rescheduleDate?: string
  ): boolean => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let updatedAttempts = 1;

    setShipments((prev) =>
      prev.map((s) => {
        if (s.trackingCode !== trackingCode) return s;
        updatedAttempts = s.deliveryAttempts + 1;
        const willReturn = updatedAttempts >= 3;
        const newStatus: ShipmentStatus = willReturn ? 'RETURNING' : 'DELIVERY_FAILED';
        const note = willReturn
          ? `Giao thất bại lần 3 (${reason}). Hệ thống tự động kích hoạt chuyển hoàn kiện hàng về người gửi!`
          : `Giao thất bại lần ${updatedAttempts}. Lý do: ${reason}. Hẹn giao lại: ${rescheduleDate || 'Ngày làm việc tiếp theo'}`;

        return {
          ...s,
          status: newStatus,
          deliveryAttempts: updatedAttempts,
          failureReason: reason,
          nextDeliveryDate: rescheduleDate,
          returnReason: willReturn ? reason : undefined,
          statusHistory: [
            ...s.statusHistory,
            {
              id: 'hist_' + Date.now(),
              status: newStatus,
              timestamp: timeStr,
              location: `${s.receiver.district}, ${s.receiver.province}`,
              note,
              actor: currentUser.name,
              actorRole: currentUser.role,
            },
          ],
        };
      })
    );

    addLog('Báo cáo giao thất bại', `Đơn ${trackingCode}: ${reason}`);
    return true;
  };

  const cancelShipment = (trackingCode: string, reason: string): boolean => {
    const target = shipments.find((s) => s.trackingCode === trackingCode);
    if (!target) return false;

    // Only allow cancelling if still PENDING or WAITING_PICKUP
    if (target.status !== 'PENDING' && target.status !== 'CONFIRMED' && target.status !== 'WAITING_PICKUP') {
      return false;
    }

    return updateShipmentStatus(
      trackingCode,
      'CANCELLED',
      `Đơn hàng đã bị hủy. Lý do: ${reason}`,
      'Hệ thống FastShip'
    );
  };

  const submitReview = (trackingCode: string, rating: number, comment: string): boolean => {
    setShipments((prev) =>
      prev.map((s) => {
        if (s.trackingCode !== trackingCode) return s;
        return {
          ...s,
          customerRating: rating,
          customerReview: comment,
        };
      })
    );
    addLog('Đánh giá dịch vụ', `Đơn ${trackingCode} được đánh giá ${rating} sao: "${comment}"`);
    return true;
  };

  const createTicket = (data: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'status'>): SupportTicket => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newTicket: SupportTicket = {
      id: 'TICK_' + Math.floor(1000 + Math.random() * 9000),
      ...data,
      status: 'OPEN',
      createdAt: timeStr,
      updatedAt: timeStr,
    };

    setTickets((prev) => [newTicket, ...prev]);
    addLog('Tạo khiếu nại CSKH', `Mã yêu cầu ${newTicket.id} cho vận đơn ${newTicket.trackingCode}`);
    return newTicket;
  };

  const updateTicketStatus = (
    ticketId: string,
    status: 'OPEN' | 'PROCESSING' | 'RESOLVED',
    resolution?: string
  ): boolean => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          status,
          resolution: resolution || t.resolution,
          assignedStaff: currentUser.name,
          updatedAt: timeStr,
        };
      })
    );
    addLog('Xử lý khiếu nại', `Cập nhật ticket ${ticketId} sang ${status}`);
    return true;
  };

  const settleReconciliationBatch = (batchId: string): boolean => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setReconciliations((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status: 'SETTLED', settledAt: timeStr } : b))
    );
    addLog('Quyết toán COD', `Đã xác nhận chuyển tiền đối soát cho phiên ${batchId}`);
    return true;
  };

  const createCustomerAddress = (data: Omit<CustomerAddress, 'id'>): CustomerAddress => {
    const newAddr: CustomerAddress = {
      id: 'addr_' + Date.now(),
      ...data,
    };
    setAddresses((prev) => [...prev, newAddr]);
    addLog('Thêm địa chỉ', `Đã lưu địa chỉ mới: ${newAddr.label}`);
    return newAddr;
  };

  const updatePricingRule = (newRules: Partial<PricingRule>) => {
    setPricingRule((prev) => ({ ...prev, ...newRules }));
    addLog('Cập nhật bảng giá', 'Quản trị viên đã thay đổi quy tắc tính cước hệ thống');
  };

  const resetAllData = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    setCurrentUser(INITIAL_USERS[1]);
    setShipments(INITIAL_SHIPMENTS);
    setWarehouses(INITIAL_WAREHOUSES);
    setShippers(INITIAL_SHIPPERS);
    setAddresses(INITIAL_CUSTOMER_ADDRESSES);
    setReconciliations(INITIAL_RECONCILIATION_BATCHES);
    setTickets(INITIAL_TICKETS);
    setPricingRule(INITIAL_PRICING_RULE);
    setActivityLogs([
      {
        id: 'log_reset',
        timestamp: new Date().toLocaleString('vi-VN'),
        user: 'Quản trị viên',
        role: 'SYSTEM',
        action: 'Khôi phục dữ liệu mẫu',
        details: 'Đã hoàn nguyên toàn bộ cơ sở dữ liệu mẫu ban đầu của đồ án',
      },
    ]);
  };

  return (
    <LogisticsContext.Provider
      value={{
        currentUser,
        allUsers: INITIAL_USERS,
        isAuthenticated,
        login,
        logout,
        switchUser,
        switchRole,
        shipments,
        warehouses,
        shippers,
        addresses,
        reconciliations,
        tickets,
        pricingRule,
        activityLogs,
        calculateFee,
        createShipment,
        createBatchShipments,
        updateShipmentStatus,
        assignShipper,
        shipperConfirmPickup,
        warehouseCheckIn,
        warehouseDispatch,
        shipperDeliverSuccess,
        shipperDeliverFailed,
        cancelShipment,
        submitReview,
        createTicket,
        updateTicketStatus,
        settleReconciliationBatch,
        createCustomerAddress,
        updatePricingRule,
        resetAllData,
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
};

export const useLogistics = () => {
  const ctx = useContext(LogisticsContext);
  if (!ctx) throw new Error('useLogistics must be used within LogisticsProvider');
  return ctx;
};
