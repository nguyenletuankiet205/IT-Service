import { Service, Appointment, ChatSession, ChatMessage, Customer, ContactLead } from './types';

export const DEMO_SERVICES: Service[] = [
  {
    id: 'srv-001',
    name: 'Cài Windows & phần mềm',
    slug: 'cai-windows',
    description: 'Cài đặt hệ điều hành Windows 10/11, đầy đủ Driver, bộ Microsoft Office và các phần mềm văn phòng, đồ họa cơ bản.',
    price_min: 150000,
    price_max: 300000,
    duration: '1 - 2 giờ',
    category: 'computer',
    icon: 'Monitor',
    is_active: true
  },
  {
    id: 'srv-002',
    name: 'Sửa lỗi máy tính & Laptop',
    slug: 'sua-may-tinh',
    description: 'Khắc phục các sự cố phần cứng, phần mềm, máy chạy chậm, lỗi màn hình xanh, lỗi kết nối máy in, diệt virus và bảo dưỡng thiết bị.',
    price_min: 100000,
    price_max: 500000,
    duration: '1 - 3 giờ',
    category: 'computer',
    icon: 'Wrench',
    is_active: true
  },
  {
    id: 'srv-003',
    name: 'Lắp đặt camera giám sát',
    slug: 'lap-camera',
    description: 'Tư vấn giải pháp, thi công lắp đặt trọn gói hệ thống camera Wi-Fi thông minh hoặc camera IP đầu ghi, xem trực tiếp qua điện thoại.',
    price_min: 900000,
    price_max: 5900000,
    duration: '1 buổi - 1 ngày',
    category: 'camera',
    icon: 'Camera',
    is_active: true
  },
  {
    id: 'srv-004',
    name: 'Setup Wi-Fi & Hệ thống mạng',
    slug: 'setup-mang',
    description: 'Cấu hình Router, hệ thống Wi-Fi Mesh, thiết bị chia mạng Switch, chia sẻ máy in mạng nội bộ, tối ưu tốc độ đường truyền cho gia đình và văn phòng.',
    price_min: 150000,
    price_max: 800000,
    duration: '1 - 3 giờ',
    category: 'network',
    icon: 'Wifi',
    is_active: true
  },
  {
    id: 'srv-005',
    name: 'Thiết kế website doanh nghiệp',
    slug: 'thiet-ke-website',
    description: 'Thiết kế Landing Page bán hàng, website giới thiệu sản phẩm/doanh nghiệp chuẩn SEO, hiển thị tương thích tốt trên giao diện di động.',
    price_min: 2200000,
    price_max: 10000000,
    duration: '3 - 14 ngày',
    category: 'website',
    icon: 'Globe',
    is_active: true
  },
  {
    id: 'srv-006',
    name: 'Tư vấn Cloud VPS, Domain, Cloudflare',
    slug: 'tu-van-vps-domain',
    description: 'Hỗ trợ cấu hình tên miền, thiết lập bảo mật qua Cloudflare, SSL, thuê và triển khai ứng dụng lên Cloud VPS (Azure, AWS, Google Cloud).',
    price_min: 200000,
    price_max: 1000000,
    duration: '1 - 2 giờ',
    category: 'cloud',
    icon: 'Cloud',
    is_active: true
  },
  {
    id: 'srv-007',
    name: 'Bảo trì IT định kỳ doanh nghiệp',
    slug: 'bao-tri-it',
    description: 'Dịch vụ IT Outsource trọn gói bảo trì máy tính, mạng nội bộ, dọn dẹp hệ thống định kỳ hàng tháng cho văn phòng, cửa hàng và doanh nghiệp nhỏ.',
    price_min: 500000,
    price_max: 5000000,
    duration: 'Định kỳ hàng tháng',
    category: 'maintenance',
    icon: 'Shield',
    is_active: true
  }
];

export const DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    full_name: 'Nguyễn Văn An',
    phone: '0909123456',
    email: 'vanan.nguyen@gmail.com',
    service_id: 'srv-001',
    appointment_date: '2026-06-01',
    appointment_time: '09:00',
    address: '123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    budget_range: '200.000đ - 300.000đ',
    message: 'Máy bàn ở nhà bị chậm, cần cài lại Windows 11 và trọn bộ Office cơ bản.',
    status: 'pending',
    estimated_price: 250000,
    created_at: '2026-05-27T08:30:00Z',
    updated_at: '2026-05-27T08:30:00Z'
  },
  {
    id: 'apt-002',
    full_name: 'Trần Thị Bình',
    phone: '0918765432',
    email: 'binh.tran@yahoo.com',
    service_id: 'srv-003',
    appointment_date: '2026-06-02',
    appointment_time: '14:00',
    address: '456 Lê Lợi, Quận Gò Vấp, TP. Hồ Chí Minh',
    budget_range: '3.200.000đ - 5.900.000đ',
    message: 'Cần lắp đặt hệ thống 3 camera giám sát Wi-Fi cho cửa hàng quần áo mới khai trương.',
    status: 'confirmed',
    estimated_price: 3500000,
    created_at: '2026-05-26T10:15:00Z',
    updated_at: '2026-05-27T09:00:00Z'
  },
  {
    id: 'apt-003',
    full_name: 'Phạm Minh Cường',
    phone: '0988112233',
    email: 'cuongpm@techcorp.vn',
    service_id: 'srv-005',
    appointment_date: '2026-06-05',
    appointment_time: '10:00',
    address: 'Tòa nhà Landmark 81, Bình Thạnh, TP. Hồ Chí Minh',
    budget_range: '5.000.000đ - 10.000.000đ+',
    message: 'Cần tư vấn thiết kế Landing Page giới thiệu dịch vụ logistics của công ty, yêu cầu chuẩn SEO.',
    status: 'in_progress',
    estimated_price: 7500000,
    created_at: '2026-05-25T14:20:00Z',
    updated_at: '2026-05-26T16:00:00Z'
  },
  {
    id: 'apt-004',
    full_name: 'Lê Hoàng Dương',
    phone: '0977445566',
    email: 'duong.le@hotmail.com',
    service_id: 'srv-004',
    appointment_date: '2026-05-26',
    appointment_time: '08:30',
    address: '789 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
    budget_range: '500.000đ - 2.000.000đ',
    message: 'Wi-Fi ở văn phòng tầng 2 rất chập chờn, muốn lắp thêm router phụ và chạy dây mạng.',
    status: 'completed',
    estimated_price: 1200000,
    created_at: '2026-05-24T09:00:00Z',
    updated_at: '2026-05-26T11:30:00Z'
  },
  {
    id: 'apt-005',
    full_name: 'Nguyễn Thị Hoa',
    phone: '0933998877',
    email: 'hoanguyen@gmail.com',
    service_id: 'srv-002',
    appointment_date: '2026-05-25',
    appointment_time: '15:30',
    address: '12 Đường số 5, Tp. Thủ Đức, TP. Hồ Chí Minh',
    budget_range: '100.000đ - 300.000đ',
    message: 'Máy in bị lỗi kẹt giấy liên tục và không kết nối được với máy tính.',
    status: 'cancelled',
    estimated_price: 200000,
    created_at: '2026-05-24T16:00:00Z',
    updated_at: '2026-05-25T09:00:00Z'
  }
];

export const DEMO_CHAT_SESSIONS: ChatSession[] = [
  {
    id: 'session-001',
    session_id: 'test-session-001',
    customer_name: 'Nguyễn Văn An',
    customer_phone: '0909123456',
    interested_service: 'Cài Windows',
    created_at: '2026-05-27T08:00:00Z'
  },
  {
    id: 'session-002',
    session_id: 'test-session-002',
    customer_name: 'Trần Thị Bình',
    customer_phone: '0918765432',
    interested_service: 'Lắp camera',
    created_at: '2026-05-26T09:45:00Z'
  }
];

export const DEMO_CUSTOMERS: Customer[] = [
  {
    id: 'cust-001',
    full_name: 'Nguyễn Văn An',
    phone: '0909123456',
    email: 'vanan.nguyen@gmail.com',
    address: '123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    note: 'Khách hàng thường xuyên - dịch vụ cài Windows',
    created_at: '2026-05-20T10:00:00Z'
  },
  {
    id: 'cust-002',
    full_name: 'Trần Thị Bình',
    phone: '0918765432',
    email: 'binh.tran@yahoo.com',
    address: '456 Lê Lợi, Quận Gò Vấp, TP. Hồ Chí Minh',
    note: 'Cửa hàng quần áo - lắp camera giám sát',
    created_at: '2026-05-22T14:30:00Z'
  },
  {
    id: 'cust-003',
    full_name: 'Phạm Minh Cường',
    phone: '0988112233',
    email: 'cuongpm@techcorp.vn',
    address: 'Tòa nhà Landmark 81, Bình Thạnh, TP. Hồ Chí Minh',
    note: 'Doanh nghiệp logistics - cần website Landing Page',
    created_at: '2026-05-24T09:15:00Z'
  }
];

export const DEMO_CONTACT_LEADS: ContactLead[] = [
  {
    id: 'lead-001',
    full_name: 'Hoàng Văn Đức',
    phone: '0933556677',
    email: 'duc.hoang@gmail.com',
    content: 'Máy laptop Dell bị màn hình xanh liên tục, cần tư vấn sửa hoặc cài lại Windows.',
    type: 'contact',
    source: 'website',
    status: 'new',
    created_at: '2026-05-27T07:00:00Z'
  },
  {
    id: 'lead-002',
    full_name: 'Lê Thị Mai',
    phone: '0977889900',
    content: 'Cửa hàng tạp hóa cần báo giá lắp 4 camera Wi-Fi và cấu hình xem trên điện thoại.',
    type: 'lead',
    source: 'homepage',
    status: 'contacted',
    created_at: '2026-05-26T15:30:00Z'
  },
  {
    id: 'lead-003',
    full_name: 'Võ Quốc Huy',
    phone: '0905112233',
    email: 'huy.vo@company.vn',
    content: 'Doanh nghiệp 15 máy tính cần gói bảo trì IT định kỳ hàng tháng. Xin báo giá chi tiết.',
    type: 'lead',
    source: 'pricing',
    status: 'new',
    created_at: '2026-05-25T11:00:00Z'
  }
];

export const DEMO_CHAT_MESSAGES: ChatMessage[] = [
  // Session 001 messages
  {
    id: 'msg-001',
    session_id: 'test-session-001',
    role: 'user',
    content: 'Tôi muốn cài Windows',
    created_at: '2026-05-27T08:00:10Z'
  },
  {
    id: 'msg-002',
    session_id: 'test-session-001',
    role: 'assistant',
    content: 'Chào anh/chị! Dịch vụ cài Windows tận nơi có giá khoảng 150.000đ - 300.000đ. Bên mình hỗ trợ cài Windows 10/11, cập nhật Driver đầy đủ, bộ Microsoft Office và các phần mềm văn phòng cơ bản. Anh/chị đang sử dụng máy tính bàn hay Laptop ạ?',
    created_at: '2026-05-27T08:00:12Z'
  },
  {
    id: 'msg-003',
    session_id: 'test-session-001',
    role: 'user',
    content: 'Mình xài máy tính bàn, máy bị chậm lắm',
    created_at: '2026-05-27T08:01:00Z'
  },
  {
    id: 'msg-004',
    session_id: 'test-session-001',
    role: 'assistant',
    content: 'Dạ với máy tính bàn bị chậm, việc cài lại Windows sạch sẽ và tối ưu hóa hệ thống sẽ giúp máy chạy mượt mà như mới. Gói trọn gói (Win + Office + PM văn phòng cơ bản) cho PC là 250.000đ ạ. Anh/chị có muốn đặt lịch hẹn kỹ thuật viên đến tận nơi kiểm tra và cài đặt cho mình không?',
    created_at: '2026-05-27T08:01:05Z'
  },
  
  // Session 002 messages
  {
    id: 'msg-005',
    session_id: 'test-session-002',
    role: 'user',
    content: 'Tôi muốn lắp camera',
    created_at: '2026-05-26T09:45:10Z'
  },
  {
    id: 'msg-006',
    session_id: 'test-session-002',
    role: 'assistant',
    content: 'Chào anh/chị! TechCare cung cấp dịch vụ tư vấn và lắp đặt camera giám sát trọn gói. Giá dao động tùy thuộc vào số lượng và loại camera. Gói camera Wi-Fi không dây thông minh từ 900.000đ/mắt, còn hệ thống camera IP có đầu ghi chất lượng cao từ 1.800.000đ/mắt. Anh/chị muốn lắp đặt cho gia đình, cửa hàng hay văn phòng công ty ạ?',
    created_at: '2026-05-26T09:45:15Z'
  }
];
