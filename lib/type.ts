export interface Order {
  id: string;
  amount: number;
  date: string; // أو Date إذا كنت ستقوم بتحويلها فور جلبها
  status?: "Paid" | "Pending" | "Cancelled"; // اختياري لزيادة التفاصيل
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;     // علامة ? و null لأنها اختيارية في Prisma
  company?: string | null;
  status: "Active" | "Inactive" | "Lead"; // تحديد القيم بدقة بدلاً من string عامة
  totalSpent: number;
  address?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  orders: Order[];           // علاقة العميل بطلباته
}

export const mockCustomers = [
  { id: 1, name: "شركة النور التجارية" },
  { id: 2, name: "مؤسسة الأمل للتقنية" },
  { id: 3, name: "متجر السعادة" }
];

export const mockProducts = [
  { id: 101, name: "شاشة سامسونج 24 بوصة", price: 150000 },
  { id: 102, name: "لوحة مفاتيح ميكانيكية", price: 45000 },
  { id: 103, name: "ماوس لاسلكي احترافي", price: 25000 },
  { id: 104, name: "سماعات رأس عازلة للصوت", price: 85000 }
];