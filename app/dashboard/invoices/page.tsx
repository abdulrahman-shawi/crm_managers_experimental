"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Receipt, Trash2, Save, Sun, Moon, Plus,
    ArrowUpRight, ArrowDownLeft, Printer,
    MessageSquare, Calendar, User, Tag, Search, CheckCircle2, Clock,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

// --- بيانات النظام ---
const mockCustomers = ["شركة النور", "مؤسسة الأمل", "محلات العلي", "تكنو ستور"];
const mockProducts = [
    { id: 1, name: "شاشة 24 بوصة", price: 150000 },
    { id: 2, name: "لوحة مفاتيح", price: 45000 },
    { id: 3, name: "ماوس لاسلكي", price: 25000 },
    { id: 4, name: "كابل HDMI", price: 12000 }
];

export default function InvoiceSystem() {
    const [darkMode, setDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'revenue' | 'expense'>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // عدد الفواتير في كل صفحة
    const { displayInvoices, totalPages } = useMemo(() => {
        // أولاً: نفلتر حسب النوع (الكل، مقبوضات، مدفوعات)
        const filtered = activeTab === 'all'
            ? invoices
            : invoices.filter(inv => inv.type === activeTab);

        // ثانياً: نحسب إجمالي الصفحات
        const pages = Math.ceil(filtered.length / itemsPerPage);

        // ثالثاً: نقتطع البيانات للصفحة الحالية فقط
        const startIndex = (currentPage - 1) * itemsPerPage;
        const sliced = filtered.slice(startIndex, startIndex + itemsPerPage);

        return { displayInvoices: sliced, totalPages: pages };
    }, [activeTab, invoices, currentPage]);

    // إعادة تعيين الصفحة إلى 1 عند تغيير التبويب
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);
    const deleteInvoice = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm("هل أنت متأكد من حذف هذه الفاتورة؟")) {
            setInvoices(invoices.filter(inv => inv.invoice_number !== id));
        }
    };

    const filteredInvoices = useMemo(() => {
        if (activeTab === 'all') return invoices;
        return invoices.filter(inv => inv.type === activeTab);
    }, [activeTab, invoices]);

    return (
        <div className={`${darkMode ? 'dark' : ''} transition-colors duration-500`} dir="rtl">
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-12 font-sans text-slate-900 dark:text-slate-100">

                {/* Header */}
                <div className="max-w-7xl mx-auto flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-black">نظام الفواتير الشامل</h1>
                        <p className="text-slate-500 text-sm mt-1">البحث، الحالات، الخصومات والملاحظات</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800">
                            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
                        </button>
                        <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg">
                            <Plus size={20} /> فاتورة جديدة
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="max-w-7xl mx-auto mb-8 flex gap-2 p-1.5 bg-slate-200/50 dark:bg-slate-900/50 rounded-2xl w-fit">
                    <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')} label="الكل" count={invoices.length} />
                    <TabButton active={activeTab === 'revenue'} onClick={() => setActiveTab('revenue')} label="المقبوضات" count={invoices.filter(i => i.type === 'revenue').length} color="text-emerald-500" />
                    <TabButton active={activeTab === 'expense'} onClick={() => setActiveTab('expense')} label="المدفوعات" count={invoices.filter(i => i.type === 'expense').length} color="text-rose-500" />
                </div>

                {/* Table */}
                <div className="max-w-7xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border dark:border-slate-800 overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold text-sm">
                            <tr>
                                <th className="px-8 py-6">الحالة</th>
                                <th className="px-8 py-6">الرقم</th>
                                <th className="px-8 py-6">الجهة</th>
                                <th className="px-8 py-6 text-left">الإجمالي</th>
                                <th className="px-8 py-6 text-center">حذف</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-slate-800">
                            {displayInvoices.length > 0 ? (
                                displayInvoices.map((inv) => (
                                    <tr key={inv.invoice_number} onClick={() => setSelectedInvoice(inv)} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group">
                                        <td className="px-8 py-5"><StatusBadge status={inv.status} /></td>
                                        <td className="px-8 py-5 font-black">#{inv.invoice_number}</td>
                                        <td className="px-8 py-5 font-bold">{inv.customer}</td>
                                        <td className={`px-8 py-5 text-left font-black text-lg ${inv.type === 'revenue' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {inv.total.toLocaleString()} ل.س
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <button onClick={(e) => deleteInvoice(e, inv.invoice_number)} className="p-2 text-slate-300 hover:text-red-500 transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-slate-400 font-bold">لا يوجد فواتير لعرضها</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center px-8 py-4 bg-slate-50/50 dark:bg-slate-800/20 border-t dark:border-slate-800">
                            <button 
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="flex items-center gap-1 px-4 py-2 rounded-xl font-bold text-sm disabled:opacity-30 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm"
                            >
                                <ChevronRight size={18} /> السابق
                            </button>
                            
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-slate-400">الصفحة {currentPage} من {totalPages}</span>
                            </div>

                            <button 
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="flex items-center gap-1 px-4 py-2 rounded-xl font-bold text-sm disabled:opacity-30 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm"
                            >
                                التالي <ChevronLeft size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Modals */}
                <AnimatePresence>
                    {selectedInvoice && <InvoiceDetailsModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}
                    {isAddModalOpen && <AddInvoiceModal onClose={() => setIsAddModalOpen(false)} onSave={(n: any) => setInvoices([n, ...invoices])} type={activeTab === 'expense' ? 'expense' : 'revenue'} />}
                </AnimatePresence>
            </div>
        </div>
    );
}

// --- مكون إضافة فاتورة (مع البحث والاختيار والحالة) ---
function AddInvoiceModal({ onClose, onSave, type }: any) {
    const [customer, setCustomer] = useState("");
    const [status, setStatus] = useState("Paid");
    const [discount, setDiscount] = useState(0);
    const [items, setItems] = useState([{ name: "", quantity: 1, price: 0, note: "", search: "" }]);
    const [showProductList, setShowProductList] = useState<number | null>(null);

    const subtotal = items.reduce((s, i) => s + (i.quantity * i.price), 0);
    const total = subtotal - discount;

    const handleSave = () => {
        if (!customer || items[0].name === "") return alert("يرجى إكمال البيانات");
        onSave({
            invoice_number: Math.floor(1000 + Math.random() * 9000),
            type, customer, status, items, subtotal, discount, total,
            date: new Date().toLocaleDateString('ar-SY')
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-[3rem] p-8 shadow-2xl overflow-visible">
                <div className="flex justify-between items-center mb-8 border-b dark:border-slate-800 pb-4">
                    <h2 className="text-2xl font-black">إصدار فاتورة {type === 'revenue' ? 'مقبوضات' : 'مدفوعات'}</h2>
                    <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* اختيار العميل */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400">العميل / الجهة</label>
                        <select value={customer} onChange={(e) => setCustomer(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold">
                            <option value="">اختر من القائمة...</option>
                            {mockCustomers.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    {/* حالة الفاتورة */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400">حالة الفاتورة</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold">
                            <option value="Paid">مدفوعة بالكامل</option>
                            <option value="Pending">معلقة / ذمم</option>
                            <option value="Draft">مسودة</option>
                        </select>
                    </div>
                    {/* الخصم الكلي */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-rose-400">خصم كلي للفاتورة</label>
                        <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-full p-4 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 rounded-2xl outline-none font-black" />
                    </div>
                </div>

                {/* Items Section */}
                <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-12 gap-4 px-4 text-[10px] font-black text-slate-400 uppercase">
                        <div className="col-span-5">البحث عن منتج / الملاحظة</div>
                        <div className="col-span-2 text-center">الكمية</div>
                        <div className="col-span-2 text-center">السعر</div>
                        <div className="col-span-2 text-center">الإجمالي</div>
                        <div className="col-span-1"></div>
                    </div>

                    {items.map((item, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border dark:border-slate-800 space-y-3">
                            <div className="grid grid-cols-12 gap-4 items-center relative">
                                {/* البحث عن منتج */}
                                <div className="col-span-5 relative">
                                    <div className="relative flex items-center">
                                        <Search size={16} className="absolute right-3 text-slate-400" />
                                        <input
                                            placeholder="ابحث عن منتج..."
                                            className="w-full p-3 pr-10 rounded-xl dark:bg-slate-900 font-bold text-sm"
                                            value={item.search || item.name}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const newItems = [...items];
                                                newItems[idx].search = val;
                                                setItems(newItems);
                                                setShowProductList(idx);
                                            }}
                                        />
                                    </div>
                                    {showProductList === idx && (
                                        <div className="absolute z-[600] w-full mt-1 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border dark:border-slate-700 max-h-40 overflow-y-auto">
                                            {mockProducts.filter(p => p.name.includes(item.search)).map(p => (
                                                <div key={p.id} onClick={() => {
                                                    const newItems = [...items];
                                                    newItems[idx].name = p.name;
                                                    newItems[idx].price = p.price;
                                                    newItems[idx].search = p.name;
                                                    setItems(newItems);
                                                    setShowProductList(null);
                                                }} className="p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer font-bold text-xs border-b dark:border-slate-700 last:border-0">
                                                    {p.name} - <span className="text-blue-500">{p.price.toLocaleString()} ل.س</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-2 text-center font-bold">
                                    <input type="number" value={item.quantity} onChange={(e) => { const n = [...items]; n[idx].quantity = Number(e.target.value); setItems(n); }} className="w-full p-3 rounded-xl dark:bg-slate-900 text-center" />
                                </div>
                                <div className="col-span-2 text-center font-bold">
                                    <input type="number" value={item.price} onChange={(e) => { const n = [...items]; n[idx].price = Number(e.target.value); setItems(n); }} className="w-full p-3 rounded-xl dark:bg-slate-900 text-center" />
                                </div>
                                <div className="col-span-2 text-center font-black text-blue-600">{(item.quantity * item.price).toLocaleString()}</div>
                                <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="col-span-1 text-red-400"><Trash2 size={18} /></button>
                            </div>
                            <input placeholder="أضف ملاحظة لهذا الصنف..." value={item.note} onChange={(e) => { const n = [...items]; n[idx].note = e.target.value; setItems(n); }} className="w-full p-2 bg-white dark:bg-slate-900 rounded-lg text-xs outline-none border dark:border-slate-800" />
                        </div>
                    ))}
                </div>

                <button onClick={() => setItems([...items, { name: "", quantity: 1, price: 0, note: "", search: "" }])} className="w-full py-4 border-2 border-dashed rounded-3xl text-slate-400 font-bold mb-8 hover:bg-slate-50">+ صنف جديد</button>

                <div className="flex justify-between items-end">
                    <div className="bg-slate-900 text-white p-6 rounded-[2rem]">
                        <p className="text-[10px] opacity-60 font-black">صافي الفاتورة للدفع</p>
                        <h3 className="text-3xl font-black text-emerald-400">{total.toLocaleString()} ل.س</h3>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleSave} className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black shadow-lg">حفظ الفاتورة</button>
                        <button onClick={onClose} className="px-8 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold">إلغاء</button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// --- المكونات المساعدة ---

function InvoiceDetailsModal({ invoice, onClose }: any) {
    return (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] p-8 overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <StatusBadge status={invoice.status} />
                        <h2 className="text-4xl font-black mt-2">#{invoice.invoice_number}</h2>
                        <p className="font-bold text-slate-400 mt-2">{invoice.customer} - {invoice.date}</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full"><X /></button>
                </div>

                <div className="space-y-3 mb-8 max-h-60 overflow-y-auto px-2">
                    {invoice.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                            <div>
                                <p className="font-black">{item.name}</p>
                                <p className="text-xs text-slate-500 font-bold">{item.quantity} وحدة × {item.price.toLocaleString()} ل.س</p>
                                {item.note && <p className="text-[10px] text-blue-500 mt-1 italic font-medium">ملاحظة: {item.note}</p>}
                            </div>
                            <p className="font-black text-lg">{(item.quantity * item.price).toLocaleString()}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] space-y-2">
                    <div className="flex justify-between text-xs opacity-60"><span>المجموع: {invoice.subtotal.toLocaleString()}</span><span>الخصم: -{invoice.discount.toLocaleString()}</span></div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                        <span className="text-xl font-bold">الصافي:</span>
                        <span className="text-3xl font-black text-emerald-400">{invoice.total.toLocaleString()} ل.س</span>
                    </div>
                </div>
                <button className="w-full mt-6 py-4 bg-blue-600 text-white rounded-2xl font-black flex justify-center items-center gap-2"><Printer size={18} /> طباعة</button>
            </motion.div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: any = {
        Paid: { label: "مدفوعة", color: "bg-emerald-500/10 text-emerald-500", icon: <CheckCircle2 size={12} /> },
        Pending: { label: "معلقة", color: "bg-amber-500/10 text-amber-500", icon: <Clock size={12} /> },
        Draft: { label: "مسودة", color: "bg-slate-500/10 text-slate-500", icon: <Tag size={12} /> }
    };
    const s = config[status] || config.Draft;
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 w-fit ${s.color}`}>
            {s.icon} {s.label}
        </span>
    );
}

function TabButton({ active, onClick, label, count, color = "" }: any) {
    return (
        <button onClick={onClick} className={`px-6 py-2.5 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${active ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            {label}
            <span className={`text-[10px] px-2 py-0.5 rounded-md ${active ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 dark:bg-slate-700/50 ' + color}`}>
                {count}
            </span>
        </button>
    );
}