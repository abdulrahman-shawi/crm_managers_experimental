import { useState, useMemo, useEffect } from "react";

// --- الأنواع الأساسية ---
export type InvoiceType = 'all' | 'revenue' | 'expense';

export interface InvoiceItem {
    name: string;
    quantity: number;
    price: number;
    note: string;
}

export interface Invoice {
    invoice_number: string;
    customer: string;
    total: number;
    subtotal: number;
    discount: number;
    date: string;
    type: 'revenue' | 'expense';
    status: 'paid' | 'pending' | 'overdue' | string;
    items: InvoiceItem[];
}

const MOCK_INVOICES: Invoice[] = [
    { 
        invoice_number: "INV-001", customer: "شركة التقنية العربية", subtotal: 1500, discount: 0, total: 1500, 
        date: "2024-01-10", type: "revenue", status: "paid", items: [] 
    },
    { 
        invoice_number: "INV-002", customer: "مورد قطع الغيار", subtotal: 800, discount: 0, total: 800, 
        date: "2024-01-12", type: "expense", status: "pending", items: [] 
    }
];

export function useInvoices() {
    // --- حالات التحكم في القائمة والترقيم ---
    const [activeTab, setActiveTab] = useState<InvoiceType>('all');
    const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
    const [currentPage, setCurrentPage] = useState(1);
    const [toastType, setToastType] = useState<"add" | "delete" | "edit" | null>(null);
    const itemsPerPage = 3;

    // --- حالات المودال والنموذج (Form States) ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [customer, setCustomer] = useState("");
    const [status, setStatus] = useState("paid");
    const [discount, setDiscount] = useState(0);
    const [items, setItems] = useState([{ name: "", quantity: 1, price: 0, note: "", search: "" }]);
    const [showProductList, setShowProductList] = useState<number | null>(null);

    // --- حسابات تلقائية للنموذج ---
    const subtotal = useMemo(() => items.reduce((s, i) => s + (i.quantity * i.price), 0), [items]);
    const total = useMemo(() => subtotal - discount, [subtotal, discount]);

    // --- التصفية والترقيم ---
    const filteredInvoices = useMemo(() => {
        if (activeTab === 'all') return invoices;
        return invoices.filter(inv => inv.type === activeTab);
    }, [activeTab, invoices]);

    const { displayInvoices, totalPages } = useMemo(() => {
        const pages = Math.ceil(filteredInvoices.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        return { displayInvoices: filteredInvoices.slice(startIndex, startIndex + itemsPerPage), totalPages: pages };
    }, [filteredInvoices, currentPage]);

    useEffect(() => { setCurrentPage(1); }, [activeTab]);

    // --- الوظائف (Actions) ---
    const showToast = (type: "add" | "delete" | "edit") => {
        setToastType(type);
        setTimeout(() => setToastType(null), 3000);
    };

    const resetForm = () => {
        setCustomer("");
        setStatus("paid");
        setDiscount(0);
        setItems([{ name: "", quantity: 1, price: 0, note: "", search: "" }]);
        setSelectedInvoice(null);
    };

    const handleSave = (type: 'revenue' | 'expense') => {
        if (!customer || items.some(item => !item.name)) {
            alert("يرجى إكمال بيانات العميل وإضافة صنف واحد على الأقل");
            return;
        }

        const newInvoice: Invoice = {
            invoice_number: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
            customer,
            status,
            items: items.map(({ search, ...rest }) => rest), // تنظيف البيانات من حقل البحث
            subtotal,
            discount,
            total,
            type,
            date: new Date().toLocaleDateString('ar-SY')
        };

        setInvoices(prev => [newInvoice, ...prev]);
        showToast("add");
        setIsAddModalOpen(false);
        resetForm();
    };

    const deleteInvoice = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm("هل أنت متأكد من حذف هذه الفاتورة؟")) {
            setInvoices(prev => prev.filter(inv => inv.invoice_number !== id));
            showToast("delete");
        }
    };

    const totalAmount = useMemo(() => filteredInvoices.reduce((sum, inv) => sum + inv.total, 0), [filteredInvoices]);

    return {
        // البيانات والحالات
        activeTab, setActiveTab,
        invoices, setInvoices,
        displayInvoices, totalPages,
        currentPage, setCurrentPage,
        toastType, totalAmount,
        filteredInvoices,
        
        // حالات النموذج (لربطها بمدخلات الـ Modal)
        isAddModalOpen, setIsAddModalOpen,
        customer, setCustomer,
        status, setStatus,
        items, setItems,
        discount, setDiscount,
        subtotal, total,
        showProductList, setShowProductList,
        selectedInvoice, setSelectedInvoice,

        // الوظائف
        handleSave,
        deleteInvoice,
        resetForm,
        handleViewInvoice: (inv: Invoice) => setSelectedInvoice(inv)
    };
}