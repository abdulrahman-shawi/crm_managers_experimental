'use client'
import AddCustomers from "@/components/customers/addCustomer";
import { CustomersTable } from "@/components/customers/customerstable";
import ViewCustomerInvoices from "@/components/customers/invoicesCustomer";
import { ToastAdd, ToastDELETE, ToastEdit } from "@/components/system/tost";
import { useCustomers } from "@/hooks/customers";
import { AnimatePresence } from "framer-motion";
import { Plus, Users } from "lucide-react";

export default function CustomerPage() {
    const usecustomer = useCustomers()
    const { isModelOpen, setIsModalOpen , viewingCustomer , toastType , setToastType} = usecustomer

    return (
        <div className="p-8 bg-slate-50 dark:bg-slate-900/20 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                    <Users className="text-blue-600" /> إدارة العملاء
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg active:scale-95 font-bold"
                >
                    <Plus size={18} /> إضافة عميل
                </button>
                
            </div>

            <CustomersTable data={usecustomer} />
            <AnimatePresence>
                {/* مودال الإضافة / التعديل */}
                {isModelOpen && (
                    <AddCustomers customerdata={usecustomer} />
                )}

                {/* مودال تفاصيل الفواتير */}
                {viewingCustomer && (
                    <ViewCustomerInvoices customerdata={usecustomer} />
                )}

                {/* التنبيهات */}
                {toastType === "add" && <ToastAdd message="تمت الإضافة بنجاح" onClose={() => setToastType(null)} />}
        {toastType === "delete" && <ToastDELETE message="تم الحذف بنجاح" onClose={() => setToastType(null)} />}
        {toastType === "edit" && <ToastEdit message="تم التحديث بنجاح" onClose={() => setToastType(null)} />}
            </AnimatePresence>
        </div>
    );
}