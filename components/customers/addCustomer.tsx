import { motion } from 'framer-motion';
import { Save, X, Building2, UserCircle, MapPin, DollarSign } from 'lucide-react';
import * as React from 'react';

interface IAddCustomersProps {
    customerdata: any
}

const AddCustomers: React.FunctionComponent<IAddCustomersProps> = (props) => {
    const {
        editingId, formData, setFormData, closeModal,
        handleSave
    } = props.customerdata;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                        {editingId ? "تحديث بيانات العميل" : "إضافة عميل جديد"}
                    </h3>
                    <button onClick={closeModal} className="text-slate-400 hover:text-red-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="space-y-5 text-right" dir="rtl">
                    {/* الحقل: الاسم بالكامل */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 flex items-center gap-1 uppercase">
                            <UserCircle size={14} /> الاسم بالكامل
                        </label>
                        <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-right" placeholder="مثال: عبد الرحمن الشاوي" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* الحقل: البريد الإلكتروني */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">البريد الإلكتروني</label>
                            <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:border-blue-500 transition-all text-left" placeholder="mail@example.com" />
                        </div>
                        {/* الحقل: رقم الهاتف */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">رقم الهاتف</label>
                            <input required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:border-blue-500 transition-all text-left" placeholder="05xxxxxxxx" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* الحقل المضاف: اسم الشركة */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 flex items-center gap-1 uppercase">
                                <Building2 size={14} /> الشركة
                            </label>
                            <input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:border-blue-500 transition-all text-right" placeholder="اسم الشركة أو المؤسسة" />
                        </div>
                        {/* الحقل المضاف: الحالة (Status) */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">حالة العميل</label>
                            <select 
                                value={formData.status} 
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer text-right"
                            >
                                <option value="Lead">عميل محتمل (Lead)</option>
                                <option value="Active">نشط (Active)</option>
                                <option value="Inactive">غير نشط (Inactive)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* الحقل المضاف: إجمالي الإنفاق */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 flex items-center gap-1 uppercase">
                                <DollarSign size={14} /> إجمالي المشتريات
                            </label>
                            <input 
                                type="number" 
                                value={formData.totalSpent} 
                                onChange={(e) => setFormData({ ...formData, totalSpent: Number(e.target.value) })} 
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:border-blue-500 transition-all text-right" 
                                placeholder="0.00" 
                            />
                        </div>
                        {/* الحقل: العنوان (يأخذ مساحة أكبر) */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-slate-500 flex items-center gap-1 uppercase">
                                <MapPin size={14} /> العنوان
                            </label>
                            <input required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:border-blue-500 transition-all text-right" placeholder="المدينة، الحي، الشارع" />
                        </div>
                    </div>

                    <button type="submit" className="w-full mt-4 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex justify-center items-center gap-2">
                        <Save size={20} /> {editingId ? "حفظ التغييرات" : "تأكيد الإضافة"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AddCustomers;