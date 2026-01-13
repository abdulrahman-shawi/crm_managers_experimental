"use client";

import { OrdersTable } from '@/components/OrdersTable';
import { SalesChart } from '@/components/SalesChart';
import { StatCard } from '@/components/StatCard';
import { Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';
import { useMemo, useState } from 'react';

// --- بيانات وهمية تحاكي استجابة قاعدة البيانات ---
const MOCK_REVENUES = [
    { id: 1, date: '2024-01-15', totalAmount: 12000 },
    { id: 2, date: '2024-02-10', totalAmount: 15000 },
    { id: 3, date: '2024-02-25', totalAmount: 18000 },
    { id: 4, date: '2024-03-05', totalAmount: 22000 },
    { id: 5, date: '2024-04-12', totalAmount: 19000 },
    { id: 6, date: '2024-05-18', totalAmount: 31000 },
    { id: 7, date: '2024-06-20', totalAmount: 28000 },
    { id: 8, date: '2024-07-05', totalAmount: 35000 },
    { id: 9, date: '2024-08-15', totalAmount: 42000 },
    { id: 10, date: '2024-09-10', totalAmount: 38000 },
];

export default function Dashboard() {
    // نستخدم البيانات الوهمية هنا بدلاً من Fetch حالياً
    const [revenues] = useState(MOCK_REVENUES);

    /* 1. منطق حساب الإيرادات (Revenues) للرسم البياني */
    /* 1. منطق حساب الإيرادات (Revenues) للرسم البياني */
    const chartData = useMemo(() => {
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

        const monthlyTotals: { [key: string]: number } = {};
        months.forEach(m => monthlyTotals[m] = 0);

        // تحديث البيانات الوهمية لتناسب عام 2026 أو إهمال السنة للتمثيل فقط
        revenues.forEach((inv: any) => {
            const d = new Date(inv.date);
            if (!isNaN(d.getTime())) {
                const monthName = months[d.getMonth()];
                const amount = Number(inv.totalAmount || inv.amount || 0);
                monthlyTotals[monthName] += amount;
            }
        });

        return months.map(name => ({
            name,
            sales: monthlyTotals[name]
        }));
        // حذفنا الـ slice هنا ليظهر العام كاملاً حتى لو كانت القيم 0 للأشهر القادمة
    }, [revenues]);

    return (
        <div className="p-6 space-y-8 bg-slate-50 dark:bg-slate-900/20 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        لوحة التحكم العامة
                    </h1>
                    <p className="text-slate-500 text-sm">مرحباً بك مجدداً، إليك ملخص أعمالك اليوم.</p>
                </div>
                <div className="text-sm bg-white dark:bg-slate-900 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                    تحديث تلقائي: <span className="font-mono font-bold text-blue-600">{new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="إجمالي المستخدمين" value={1240} icon={Users} trend="+12%" />
                <StatCard
                    title="الأرباح"
                    value={`${(4350000).toLocaleString(undefined, { minimumFractionDigits: 2 })} $`}
                    icon={DollarSign}
                    trend="+8%"
                />
                <StatCard title="الفواتير" value={156} icon={ShoppingCart} trend="+5%" />
                <StatCard title="معدل النشاط" value="89%" icon={Activity} trend="+2%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* الرسم البياني يأخذ مساحة أكبر */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">نمو الإيرادات الشهرية</h3>
                        <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded">مباشر</span>
                    </div>
                    <SalesChart data={chartData} />
                </div>

                {/* مساحة إضافية لأي مكون آخر مثل "آخر التنبيهات" أو "الأهداف" */}
                <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">إحصائيات سريعة</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                            <span className="text-sm text-slate-500">أعلى شهر مبيعاً</span>
                            <span className="font-bold text-blue-600">أغسطس</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                            <span className="text-sm text-slate-500">متوسط الفاتورة</span>
                            <span className="font-bold text-blue-600">2,450 $</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">آخر الطلبات</h3>
                <OrdersTable />
            </div>
        </div>
    );
}