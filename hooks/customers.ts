'use client'
import { Customer } from "@/lib/type";
import { useState, useEffect, useMemo } from "react";

export function useCustomers() {
    // 1. مصفوفة العملاء (State)
    const [customers, setCustomers] = useState<Customer[]>([
    {
        id: "cly1",
        name: "عبد الرحمن الشاوي",
        email: "abdo@example.com",
        phone: "+966 50 123 4567",
        company: "تقنية المحدودة",
        status: "Active",
        totalSpent: 4500.50,
        address: "الرياض، حي النخيل",
        createdAt: "2024-01-10",
        updatedAt: "2024-01-10",
        orders: [
      { id: "inv-101", amount: 1500, date: "2024-01-15" },
      { id: "inv-102", amount: 2000, date: "2024-02-01" },
      { id: "inv-103", amount: 1000.50, date: "2024-02-20" },
    ]
    },
    {
        id: "cly2",
        name: "سارة أحمد",
        email: "sara.a@web.com",
        phone: "+966 55 987 6543",
        company: "مؤسسة الإبداع",
        status: "Lead",
        totalSpent: 1200.00,
        address: "جدة، حي الروضة",
        createdAt: "2024-03-05",
        updatedAt: "2024-03-05",
        orders: []
    },
    {
        id: "cly3",
        name: "محمد علي",
        email: "m.ali@business.com",
        phone: "+966 54 000 1111",
        company: "مجموعة العلي",
        status: "Active",
        totalSpent: 8900.00,
        address: "الدمام، شارع الملك فهد",
        createdAt: "2024-02-15",
        updatedAt: "2024-02-15",
        orders: []
    },
    {
        id: "cly4",
        name: "ليلى حسن",
        email: "laila@agency.com",
        phone: "+966 56 222 3333",
        company: "ليلى للدعاية",
        status: "Inactive",
        totalSpent: 0,
        address: "الخبر، حي العزيزية",
        createdAt: "2024-04-01",
        updatedAt: "2024-04-01",
        orders: []
    },
    {
        id: "cly5",
        name: "فهد العتيبي",
        email: "fahad@oil.sa",
        phone: "+966 50 444 5555",
        company: "الشركة الوطنية",
        status: "Active",
        totalSpent: 15600.75,
        address: "الرياض، حي العليا",
        createdAt: "2023-12-20",
        updatedAt: "2023-12-20",
        orders: []
    },
    {
        id: "cly6",
        name: "أحمد منصور",
        email: "ahmed.m@tech.com",
        phone: "+966 53 666 7777",
        company: "منصور للبرمجيات",
        status: "Lead",
        totalSpent: 300,
        address: "مكة المكرمة، الشوقية",
        createdAt: "2024-05-10",
        updatedAt: "2024-05-10",
        orders: []
    },
    {
        id: "cly7",
        name: "خالد الفيصل",
        email: "khaled@faisal.com",
        phone: "+966 55 888 9999",
        company: "الفصل العقارية",
        status: "Active",
        totalSpent: 25000,
        address: "جدة، أبحر الشمالية",
        createdAt: "2024-01-05",
        updatedAt: "2024-01-05",
        orders: []
    },
    {
        id: "cly8",
        name: "نورة القحطاني",
        email: "noura@design.com",
        phone: "+966 50 111 2222",
        company: "استوديو نورة",
        status: "Active",
        totalSpent: 4200,
        address: "الرياض، حي الياسمين",
        createdAt: "2024-02-28",
        updatedAt: "2024-02-28",
        orders: []
    },
    {
        id: "cly9",
        name: "عمر الفاروق",
        email: "omar@law.sa",
        phone: "+966 54 333 4444",
        company: "مكتب الفاروق للمحاماة",
        status: "Inactive",
        totalSpent: 0,
        address: "المدينة المنورة",
        createdAt: "2024-05-01",
        updatedAt: "2024-05-01",
        orders: []
    },
    {
        id: "cly10",
        name: "عبد العزيز الحربي",
        email: "azeez@trade.com",
        phone: "+966 56 555 6666",
        company: "تجارة الحربي",
        status: "Lead",
        totalSpent: 150,
        address: "تبوك، حي المروج",
        createdAt: "2024-06-15",
        updatedAt: "2024-06-15",
        orders: []
    },
    {
        id: "cly11",
        name: "ريم العبدالله",
        email: "reem@fashion.sa",
        phone: "+966 55 777 8888",
        company: "ريم للأزياء",
        status: "Active",
        totalSpent: 7800,
        address: "جدة، التحلية",
        createdAt: "2024-02-10",
        updatedAt: "2024-02-10",
        orders: []
    },
    {
        id: "cly12",
        name: "ياسر القحطاني",
        email: "yasser@sports.com",
        phone: "+966 50 999 0000",
        company: "نادي القوة",
        status: "Active",
        totalSpent: 12500,
        address: "الرياض، حي الصحافة",
        createdAt: "2024-01-20",
        updatedAt: "2024-01-20",
        orders: []
    },
    {
        id: "cly13",
        name: "منى الراشد",
        email: "mona@event.com",
        phone: "+966 53 222 1111",
        company: "الراشد لتنظيم المؤتمرات",
        status: "Lead",
        totalSpent: 0,
        address: "الطائف، حي الشفا",
        createdAt: "2024-04-12",
        updatedAt: "2024-04-12",
        orders: [
      { id: "inv-101", amount: 1500, date: "2024-01-15" },
      { id: "inv-102", amount: 2000, date: "2024-02-01" },
      { id: "inv-103", amount: 1000.50, date: "2024-02-20" },
    ]
    },
    {
        id: "cly14",
        name: "سلطان العتيبي",
        email: "sultan@const.com",
        phone: "+966 56 444 3333",
        company: "سلطان للمقاولات",
        status: "Active",
        totalSpent: 35000.50,
        address: "الظهران، حي الدوحة",
        createdAt: "2023-11-01",
        updatedAt: "2023-11-01",
        orders: []
    },
    {
        id: "cly15",
        name: "هند الباز",
        email: "hind@med.com",
        phone: "+966 55 123 9999",
        company: "مجمع الباز الطبي",
        status: "Active",
        totalSpent: 2200,
        address: "الرياض، حي السليمانية",
        createdAt: "2024-03-20",
        updatedAt: "2024-03-20",
        orders: []
    }
]);

    // 2. حالات التحكم (UI States)
    const [isModelOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
    const [toastType, setToastType] = useState<"add" | "delete" | "edit" | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    
    // 3. حالات الترقيم (Pagination States)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "Lead" as "Active" | "Inactive" | "Lead",
        address: "",
        totalSpent: 0
    });

    // --- دالة تنظيف النص العربي للبحث الذكي ---
    const cleanArabic = (str: string) => {
        return str
            .replace(/\s+/g, '') // حذف المسافات
            .replace(/[أإآا]/g, 'ا') // توحيد الألف
            .replace(/ة/g, 'ه') // توحيد التاء المربوطة
            .toLowerCase();
    };

    // --- منطق البحث والتصفية ---
    const filteredCustomers = useMemo(() => {
        const search = cleanArabic(searchQuery);
        return customers.filter(customer => 
            cleanArabic(customer.name).includes(search) ||
            cleanArabic(customer.company || "").includes(search) ||
            customer.phone?.includes(searchQuery) ||
            customer.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [customers, searchQuery]);

    // *** تصفير الصفحة عند البحث لضمان ظهور النتائج ***
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // --- حساب بيانات الترقيم (Pagination Logic) ---
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    // --- العمليات (Actions) ---
    const showToast = (type: "add" | "delete" | "edit") => {
        setToastType(type);
        setTimeout(() => setToastType(null), 3000);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: "", email: "", phone: "", company: "", status: "Lead", address: "", totalSpent: 0 });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            setCustomers(prev => prev.map(c => c.id === editingId ? { ...c, ...formData, updatedAt: new Date().toISOString() } : c));
            showToast("edit");
        } else {
            const newCustomer: Customer = {
                id: `cly-${Math.random().toString(36).substr(2, 9)}`,
                ...formData,
                totalSpent: Number(formData.totalSpent),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                orders: [],
            };
            setCustomers(prev => [newCustomer, ...prev]);
            showToast("add");
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        if (confirm("هل أنت متأكد من حذف هذا العميل؟")) {
            setCustomers(prev => prev.filter(c => c.id !== id));
            showToast("delete");
        }
    };

    const openEditModal = (customer: Customer) => {
        setEditingId(customer.id);
        setFormData({
            name: customer.name,
            email: customer.email,
            phone: customer.phone || "",
            company: customer.company || "",
            status: customer.status,
            address: customer.address || "",
            totalSpent: customer.totalSpent
        });
        setIsModalOpen(true);
    };
    const totalItems = filteredCustomers.length; // حساب إجمالي العناصر المصفاة

    return {
        // البيانات
        currentItems,         // الأسماء الـ 10 الحالية للعرض في الجدول
        filteredCustomers,    // القائمة الكاملة المصفاة (للمؤشرات)
        formData, setFormData,
        
        // البحث والترقيم
        searchQuery, setSearchQuery,
        currentPage, totalPages,
        goToNextPage, goToPrevPage,
        itemsPerPage,

        // التحكم
        isModelOpen, setIsModalOpen,
        editingId, handleSave,
        closeModal, handleDelete,
        openEditModal,
        viewingCustomer, setViewingCustomer,
        toastType, totalItems , setToastType
    };
}