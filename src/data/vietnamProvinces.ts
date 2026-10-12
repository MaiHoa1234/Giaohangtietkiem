export interface ProvinceData {
  id: string;
  name: string;
  region: 'BẮC' | 'TRUNG' | 'NAM';
  districts: string[];
}

export const VIETNAM_PROVINCES: ProvinceData[] = [
  {
    id: 'HCM',
    name: 'TP. Hồ Chí Minh',
    region: 'NAM',
    districts: [
      'Quận 1',
      'Quận 3',
      'Quận 4',
      'Quận 5',
      'Quận 7',
      'Quận 10',
      'Quận Bình Thạnh',
      'Quận Tân Bình',
      'Quận Phú Nhuận',
      'Quận Gò Vấp',
      'TP. Thủ Đức',
      'Huyện Bình Chánh',
      'Huyện Hóc Môn',
    ],
  },
  {
    id: 'HN',
    name: 'TP. Hà Nội',
    region: 'BẮC',
    districts: [
      'Quận Ba Đình',
      'Quận Hoàn Kiếm',
      'Quận Hai Bà Trưng',
      'Quận Đống Đa',
      'Quận Cầu Giấy',
      'Quận Thanh Xuân',
      'Quận Tây Hồ',
      'Quận Long Biên',
      'Quận Nam Từ Liêm',
      'Quận Bắc Từ Liêm',
      'Huyện Đông Anh',
      'Huyện Gia Lâm',
    ],
  },
  {
    id: 'DN',
    name: 'TP. Đà Nẵng',
    region: 'TRUNG',
    districts: [
      'Quận Hải Châu',
      'Quận Thanh Khê',
      'Quận Sơn Trà',
      'Quận Ngũ Hành Sơn',
      'Quận Liên Chiểu',
      'Quận Cẩm Lệ',
      'Huyện Hòa Vang',
    ],
  },
  {
    id: 'HP',
    name: 'TP. Hải Phòng',
    region: 'BẮC',
    districts: [
      'Quận Hồng Bàng',
      'Quận Ngô Quyền',
      'Quận Lê Chân',
      'Quận Hải An',
      'Quận Kiến An',
      'Huyện An Dương',
    ],
  },
  {
    id: 'CT',
    name: 'TP. Cần Thơ',
    region: 'NAM',
    districts: [
      'Quận Ninh Kiều',
      'Quận Bình Thủy',
      'Quận Cái Răng',
      'Quận Ô Môn',
      'Huyện Phong Điền',
    ],
  },
  {
    id: 'BD',
    name: 'Bình Dương',
    region: 'NAM',
    districts: ['TP. Thủ Dầu Một', 'TP. Thuận An', 'TP. Dĩ An', 'TP. Tân Uyên', 'Thị xã Bến Cát'],
  },
  {
    id: 'DNA',
    name: 'Đồng Nai',
    region: 'NAM',
    districts: ['TP. Biên Hòa', 'TP. Long Khánh', 'Huyện Long Thành', 'Huyện Nhơn Trạch'],
  },
  {
    id: 'QN',
    name: 'Quảng Ninh',
    region: 'BẮC',
    districts: ['TP. Hạ Long', 'TP. Cẩm Phả', 'TP. Uông Bí', 'TP. Móng Cái'],
  },
  {
    id: 'KH',
    name: 'Khánh Hòa',
    region: 'TRUNG',
    districts: ['TP. Nha Trang', 'TP. Cam Ranh', 'Huyện Diên Khánh', 'Thị xã Ninh Hòa'],
  },
  {
    id: 'LD',
    name: 'Lâm Đồng',
    region: 'TRUNG',
    districts: ['TP. Đà Lạt', 'TP. Bảo Lộc', 'Huyện Đức Trọng', 'Huyện Di Linh'],
  },
];
