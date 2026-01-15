"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Users, PhoneCall, Handshake } from 'lucide-react';

interface Lead {
    id: number;
    name: string;
    status: string;
    phone: string;
}

export default function LeadsPage() {
    const [activeTab, setActiveTab] = useState('new');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    // الحالة الرئيسية للبيانات
    const [leads, setLeads] = useState<Lead[]>([
        { id: 1, name: "أحمد علي", status: "new", phone: "0501234567" },
        { id: 2, name: "سارة محمود", status: "contacted", phone: "0507654321" },
        { id: 3, name: "شركة الحلول", status: "agreed", phone: "0112233445" },
    ]);

    // الحالة الخاصة ببيانات الفورم
    const [formData, setFormData] = useState<Lead>({
        id: 0,
        name: "",
        status: "new",
        phone: ""
    });

    const filteredLeads = leads.filter(lead => lead.status === activeTab);

    // دالة فتح النافذة
    const handleOpenModal = (lead: Lead | null = null) => {
        if (lead) {
            setSelectedLead(lead);
            setFormData(lead); // تعبئة الفورم ببيانات العميل للتعديل
        } else {
            setSelectedLead(null);
            setFormData({
                id: Number(Date.now()), // إنشاء ID جديد
                name: "",
                status: activeTab, // تعيين الحالة بناءً على التاب النشط
                phone: ""
            });
        }
        setIsModalOpen(true);
    };

    // دالة معالجة التغيير في المدخلات
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // دالة الحفظ (إضافة أو تعديل)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (selectedLead) {
            // منطق التعديل
            setLeads(leads.map(l => l.id === formData.id ? formData : l));
        } else {
            // منطق الإضافة
            setLeads([...leads, formData]);
        }
        
        setIsModalOpen(false);
    };

    const handleDelete = (id: number) => {
        if (confirm("هل أنت متأكد من الحذف؟")) {
            setLeads(leads.filter(l => l.id !== id));
        }
    };

    return (
        <div className="p-8 bg-slate-50 dark:bg-slate-950 min-h-screen font-sans text-slate-900 dark:text-slate-100" dir="rtl">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">إدارة العملاء</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">تتبع وحول العملاء المحتملين إلى صفقات ناجحة.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                    <Plus size={20} /> إضافة عميل جديد
                </button>
            </div>

            {/* Tabs Layout */}
            <div className="flex p-1.5 space-x-reverse space-x-2 mb-8 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl w-fit">
                {[
                    { id: 'new', label: 'عميل محتمل', icon: <Users size={16} /> },
                    { id: 'contacted', label: 'تم التواصل', icon: <PhoneCall size={16} /> },
                    { id: 'agreed', label: 'تم الاتفاق', icon: <Handshake size={16} /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                            ? 'bg-white dark:bg-slate-900 shadow-md text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-300/50 dark:hover:bg-slate-700/50'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                <table className="w-full text-right border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <th className="p-5 font-semibold text-slate-600 dark:text-slate-400">اسم العميل</th>
                            <th className="p-5 font-semibold text-slate-600 dark:text-slate-400">رقم الهاتف</th>
                            <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-left">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredLeads.length > 0 ? (
                            filteredLeads.map(lead => (
                                <tr key={lead.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                                    <td className="p-5 font-medium">{lead.name}</td>
                                    <td className="p-5 text-slate-500 dark:text-slate-400">{lead.phone}</td>
                                    <td className="p-5">
                                        <div className="flex gap-4 justify-end">
                                            <button onClick={() => handleOpenModal(lead)} className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(lead.id)} className="p-2 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:scale-110 transition-transform">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="p-20 text-center text-slate-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <Users size={48} className="opacity-20" />
                                        <p>لا يوجد بيانات لعرضها في هذا القسم</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-8 relative animate-in zoom-in duration-200">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 left-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold mb-8">
                            {selectedLead ? 'تعديل البيانات' : 'إضافة عميل جديد'}
                        </h2>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">الاسم الكامل</label>
                                <input
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="مثال: خالد عبدالله"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">رقم الهاتف</label>
                                <input
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="05xxxxxxx"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">حالة المرحلة</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                                >
                                    <option value="new">عميل محتمل</option>
                                    <option value="contacted">تم التواصل معه</option>
                                    <option value="agreed">تم الاتفاق معه</option>
                                </select>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button type="submit" className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all active:scale-95">
                                    {selectedLead ? 'حفظ التعديلات' : 'إضافة الآن'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-4 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}