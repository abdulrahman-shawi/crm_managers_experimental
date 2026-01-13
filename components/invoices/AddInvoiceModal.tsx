"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Receipt, Trash2, Save } from "lucide-react";

export const AddInvoiceModal = ({ isOpen, onClose, manager, customers, products, type }: any) => {
    const {
        client, setClient, status, setStatus,
        items, setItems, addNewItem, updateItem,
        overallDiscount, setOverallDiscount,
        grandTotal, handleSubmit, isSubmitting,
        searchQueries, showDropdown, setShowDropdown, setSearchQueries
    } = manager;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="bg-white dark:bg-slate-900 w-full max-w-6xl rounded-[2.5rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-800 my-8" 
                dir="rtl"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b dark:border-slate-800 pb-4">
                    <h2 className="text-2xl font-black flex items-center gap-3 dark:text-white">
                        <Receipt className={type === 'revenue' ? 'text-emerald-500' : 'text-red-500'} size={32} />
                        إصدار فاتورة جديدة
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full dark:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 px-1 italic">العميل / المورد</label>
                        <select 
                            value={client} 
                            onChange={(e) => setClient(e.target.value)} 
                            className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold dark:text-white"
                        >
                            <option value="">اختر من القائمة...</option>
                            {customers?.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 px-1 italic">حالة الدفع</label>
                        <select 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)} 
                            className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold dark:text-white"
                        >
                            <option value="مدفوعة">مدفوعة</option>
                            <option value="معلقة">معلقة</option>
                        </select>
                    </div>
                </div>

                {/* Items Section */}
                <div className="space-y-4">
                    {items.map((item: any, index: number) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 items-center">
                            
                            {/* Product Search Input */}
                            <div className="md:col-span-3 relative">
                                <label className="text-[10px] font-bold text-slate-400 mb-1">المنتج</label>
                                <input
                                    type="text"
                                    value={searchQueries[index] !== undefined ? searchQueries[index] : item.name}
                                    placeholder="ابحث عن منتج..."
                                    onFocus={() => setShowDropdown({ ...showDropdown, [index]: true })}
                                    onChange={(e) => {
                                        setSearchQueries({ ...searchQueries, [index]: e.target.value });
                                        setShowDropdown({ ...showDropdown, [index]: true });
                                    }}
                                    className="w-full bg-white dark:bg-slate-900 p-3 rounded-xl border-none outline-none font-bold text-sm shadow-sm dark:text-white"
                                />
                                <AnimatePresence>
                                    {showDropdown[index] && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -10 }} 
                                            animate={{ opacity: 1, y: 0 }} 
                                            exit={{ opacity: 0 }} 
                                            className="absolute z-[210] w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto"
                                        >
                                            {products?.filter((p: any) => p.name.toLowerCase().includes((searchQueries[index] || "").toLowerCase())).map((product: any) => (
                                                <div 
                                                    key={product.id} 
                                                    onClick={() => updateItem(index, "productId", product.id.toString(), products)} 
                                                    className="px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/40 cursor-pointer text-sm font-bold border-b border-slate-50 dark:border-slate-700 last:border-0 dark:text-white"
                                                >
                                                    {product.name} 
                                                    <span className="text-blue-500 mr-2 text-xs">ل.س {product.price.toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Quantity */}
                            <div className="md:col-span-1 text-center">
                                <label className="text-[10px] font-bold text-slate-400 mb-1">الكمية</label>
                                <input 
                                    type="number" 
                                    value={item.quantity} 
                                    onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0, products)} 
                                    className="w-full bg-white dark:bg-slate-900 p-3 rounded-xl text-center font-bold outline-none text-sm shadow-sm dark:text-white" 
                                />
                            </div>

                            {/* Price (Read Only) */}
                            <div className="md:col-span-1 text-center">
                                <label className="text-[10px] font-bold text-slate-400 mb-1">السعر</label>
                                <div className="p-3 text-xs font-black dark:text-white italic">{item.price.toLocaleString()}</div>
                            </div>

                            {/* Item Discount */}
                            <div className="md:col-span-1">
                                <label className="text-[10px] font-bold text-red-400 mb-1">الخصم</label>
                                <input 
                                    type="number" 
                                    value={item.discount} 
                                    onChange={(e) => updateItem(index, "discount", e.target.value, products)} 
                                    className="w-full bg-red-50 dark:bg-red-900/10 p-3 rounded-xl text-center font-bold text-red-600 outline-none text-sm border border-red-100 dark:border-red-900/20 shadow-inner" 
                                />
                            </div>

                            {/* Notes */}
                            <div className="md:col-span-4">
                                <label className="text-[10px] font-bold text-slate-400 mb-1">ملاحظات المنتج</label>
                                <input 
                                    type="text" 
                                    value={item.note} 
                                    onChange={(e) => updateItem(index, "note", e.target.value, products)} 
                                    className="w-full bg-white dark:bg-slate-900 p-3 rounded-xl outline-none text-xs shadow-sm dark:text-white" 
                                    placeholder="ملاحظة خاصة بهذا الصنف..." 
                                />
                            </div>

                            {/* Item Total */}
                            <div className="md:col-span-1 text-center font-black text-blue-600 italic text-sm">
                                {item.total.toLocaleString()}
                            </div>

                            {/* Delete Button */}
                            <div className="md:col-span-1 flex justify-center">
                                <button 
                                    onClick={() => setItems(items.filter((_: any, i: number) => i !== index))} 
                                    className="text-red-400 hover:text-red-600 transition"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={addNewItem} 
                        className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 font-black text-xs hover:border-blue-500 hover:text-blue-500 transition-all uppercase tracking-widest"
                    >
                        + إضافة بند جديد للفاتورة
                    </button>
                </div>

                {/* Footer Calculations */}
                <div className="mt-10 pt-6 border-t dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex gap-6 items-center">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-red-500 uppercase px-1">خصم كلي على الفاتورة</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={overallDiscount} 
                                    onChange={(e) => setOverallDiscount(Number(e.target.value))} 
                                    className="w-40 bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-100 dark:border-red-900/20 outline-none font-black text-red-600 text-center" 
                                    placeholder="0" 
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400 text-xs font-bold">ل.س</span>
                            </div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-600/10 px-10 py-5 rounded-[2rem] border border-blue-100 dark:border-blue-500/20">
                            <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase mb-1">الإجمالي النهائي المستحق</p>
                            <h3 className="text-4xl font-black font-sans text-blue-600 dark:text-blue-400">
                                {grandTotal.toLocaleString()} <span className="text-sm italic">ل.س</span>
                            </h3>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 w-full md:w-auto">
                        <button 
                            onClick={handleSubmit} 
                            disabled={isSubmitting} 
                            className={`flex-1 md:flex-none px-12 py-5 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {isSubmitting ? "جاري المعالجة..." : <><Save size={22} /> حفظ وإصدار</>}
                        </button>
                        <button 
                            onClick={onClose} 
                            className="px-10 py-5 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        >
                            إلغاء
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}