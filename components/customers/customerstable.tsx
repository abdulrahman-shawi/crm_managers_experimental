"use client";
import { Edit3, Trash2, Building2, ChevronRight, ChevronLeft, Search } from 'lucide-react';

export const CustomersTable = ({ data }: { data: any }) => {
  const {
    currentItems,       // الأسماء الـ 10 للملف الحالي
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    totalItems,
    itemsPerPage,
    handleDelete,
    openEditModal,
    searchQuery,
    setSearchQuery,
    setViewingCustomer
  } = data;

  return (
    <div className="space-y-4">
      {/* شريط البحث المدمج */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="ابحث بالاسم، الشركة، أو الهاتف..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-10 pl-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 text-right text-sm"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-right border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-bold uppercase">
            <tr>
              <th className="px-4 py-4 w-12 text-center">#</th>
              <th className="px-6 py-4">العميل والشركة</th>
              <th className="px-6 py-4">الحالة</th>
              <th className="px-6 py-4">إجمالي الإنفاق</th>
              <th className="px-6 py-4 text-left">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {currentItems.length > 0 ? (
              currentItems.map((customer: any, index: number) => (
                <tr onClick={() => setViewingCustomer(customer)} key={customer.id} className="cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  {/* الترقيم التسلسلي الذكي عبر الصفحات */}
                  <td className="cursor-pointer px-4 py-4 text-center text-xs text-slate-400 font-medium">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-sm dark:text-white">{customer.name}</div>
                        <div className="text-xs text-slate-400">{customer.company || "فردي"}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${
                      customer.status === 'Active' 
                      ? 'bg-green-50 border-green-100 text-green-600 dark:bg-green-900/20' 
                      : 'bg-orange-50 border-orange-100 text-orange-600 dark:bg-orange-900/20'
                    }`}>
                      {customer.status === 'Active' ? 'نشط' : 'محتمل'}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-bold text-sm text-blue-600 dark:text-blue-400">
                    {customer.totalSpent.toLocaleString()} $
                  </td>

                  <td className="px-6 py-4 text-left">
                    <div className="flex justify-end gap-1">
                      <button onClick={(e) => { e.stopPropagation() ; openEditModal(customer)}} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={(e) => {e.stopPropagation() ; handleDelete(customer.id)}} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-10 text-center text-slate-400 text-sm">لا توجد بيانات تطابق بحثك</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* أزرار التحكم في الصفحات (Pagination) */}
        <div className="bg-slate-50 dark:bg-slate-800/20 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <button 
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-all font-bold text-xs"
          >
            <ChevronRight size={16} /> التالي
          </button>

          <div className="text-xs font-medium text-slate-500">
            صفحة <span className="text-blue-600 dark:text-blue-400">{currentPage}</span> من <span className="dark:text-white">{totalPages || 1}</span>
            <span className="mx-2 text-slate-300">|</span>
            إجمالي العملاء: {totalItems}
          </div>

          <button 
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-all font-bold text-xs"
          >
            السابق <ChevronLeft size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};