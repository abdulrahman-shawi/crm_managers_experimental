"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
    ShieldCheck, Lock, Users, Save, Trash2, 
    CheckCircle2, X, Info, ShieldPlus, Plus
} from "lucide-react";

// --- الهيكل الأولي للبيانات ---
const initialRoles = [
    { 
        id: 1, 
        name: "مدير النظام (Admin)", 
        description: "وصول كامل لكافة أقسام النظام والتقارير المالية",
        permissions: { crm: ["read", "write", "delete"], invoices: ["read", "write", "delete"], settings: ["read", "write"] }
    }
];

export default function PermissionsPage() {
    const [roles, setRoles] = useState(initialRoles);
    const [selectedRole, setSelectedRole] = useState(roles[0]);
    const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);

    // 1. دالة إضافة دور جديد
    const handleAddNewRole = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const newRole = {
            id: Date.now(),
            name: formData.get('roleName') as string,
            description: formData.get('roleDesc') as string,
            permissions: { crm: [], invoices: [], settings: [] }
        };

        setRoles([...roles, newRole]);
        setSelectedRole(newRole);
        setIsAddRoleModalOpen(false);
    };

    // 2. دالة تعديل الصلاحيات داخل الدور
    const togglePermission = (category: string, action: string) => {
        const updatedRoles = roles.map(role => {
            if (role.id === selectedRole.id) {
                const currentPerms = role.permissions[category as keyof typeof role.permissions] || [];
                const newPerms = currentPerms.includes(action) 
                    ? currentPerms.filter(a => a !== action) 
                    : [...currentPerms, action];
                
                const updatedRole = { ...role, permissions: { ...role.permissions, [category]: newPerms } };
                setSelectedRole(updatedRole);
                return updatedRole;
            }
            return role;
        });
        setRoles(updatedRoles);
    };

    
    // 3. دالة الحفظ ومعاينة البيانات المخطط إرسالها للـ Prisma
    const handleSave = () => {
        // تجميع الصلاحيات بشكل منظم للعرض
        const summary = Object.entries(selectedRole.permissions)
            .filter(([_, actions]) => (actions as string[]).length > 0) // تجاهل الأقسام الفارغة
            .map(([category, actions]) => {
                const categoryName = 
                    category === 'crm' ? 'إدارة العملاء' :
                    category === 'invoices' ? 'الفواتير' : 'إعدادات النظام';
                return `📂 ${categoryName}: [${(actions as string[]).join(", ")}]`;
            });

        const message = `
        📝 تفاصيل الدور المختار:
        ----------------------------------
        الاسم: ${selectedRole.name}
        الوصف: ${selectedRole.description}
        
        ✅ الصلاحيات المفعلة لهذا الدور:
        ${summary.length > 0 ? summary.join("\n") : "⚠️ لم يتم اختيار أي صلاحية بعد!"}
        
        ----------------------------------
        ملاحظة: سيتم تحديث هذه البيانات في قاعدة البيانات لهذا الدور فقط.
        `;

        alert(message);
        
        // البيانات التي ستذهب فعلياً للـ Backend
        console.log("Saving for Role ID:", selectedRole.id, "Permissions:", selectedRole.permissions);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-12 font-sans text-right" dir="rtl">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-indigo-600 text-white rounded-3xl shadow-xl shadow-indigo-500/20">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white">إدارة الصلاحيات</h1>
                            <p className="text-slate-500">تحكم في مستويات الوصول والأدوار الوظيفية</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Sidebar: Roles List */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="flex justify-between items-center px-2">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">الأدوار الحالية</h3>
                            <span className="bg-slate-200 dark:bg-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md">{roles.length}</span>
                        </div>
                        
                        <div className="space-y-3">
                            {roles.map((role) => (
                                <motion.div 
                                    layoutId={role.id.toString()}
                                    key={role.id}
                                    onClick={() => setSelectedRole(role)}
                                    className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${
                                        selectedRole.id === role.id 
                                        ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-xl' 
                                        : 'bg-slate-100/50 dark:bg-slate-900/50 border-transparent hover:border-slate-200'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <h4 className={`font-black ${selectedRole.id === role.id ? 'text-indigo-600' : ''}`}>{role.name}</h4>
                                        {selectedRole.id === role.id && <CheckCircle2 size={18} className="text-indigo-600"/>}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{role.description}</p>
                                </motion.div>
                            ))}
                        </div>

                        <button 
                            onClick={() => setIsAddRoleModalOpen(true)}
                            className="w-full py-5 border-2 border-dashed border-indigo-200 dark:border-slate-800 rounded-[2rem] text-indigo-500 font-black hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all flex items-center justify-center gap-2 group"
                        >
                            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                            إضافة دور وظيفي جديد
                        </button>
                    </div>

                    {/* Main Section */}
                    <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border dark:border-slate-800 overflow-hidden">
                        <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/30">
                            <div>
                                <h2 className="text-xl font-black dark:text-white">تخصيص صلاحيات: {selectedRole.name}</h2>
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Lock size={12}/> حدد الإجراءات المسموح بها لهذا الدور</p>
                            </div>
                            {/* تم ربط زر الحفظ هنا */}
                            <button 
                                onClick={handleSave}
                                className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                            >
                                <Save size={18}/> حفظ التغييرات
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            <PermissionRow title="إدارة العملاء (CRM)" category="crm" activePermissions={selectedRole.permissions.crm} onToggle={togglePermission} />
                            <PermissionRow title="نظام الفواتير (Invoices)" category="invoices" activePermissions={selectedRole.permissions.invoices} onToggle={togglePermission} />
                            <PermissionRow title="إعدادات النظام (Settings)" category="settings" activePermissions={selectedRole.permissions.settings} onToggle={togglePermission} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isAddRoleModalOpen && (
                    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl text-right">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg"><ShieldPlus size={20}/></div>
                                    <h2 className="text-2xl font-black">دور جديد</h2>
                                </div>
                                <button onClick={() => setIsAddRoleModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X size={20}/></button>
                            </div>
                            
                            <form onSubmit={handleAddNewRole} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 mr-2">اسم الدور الوظيفي</label>
                                    <input name="roleName" required placeholder="مثلاً: محاسب..." className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-indigo-500 transition-all text-right" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 mr-2">وصف مختصر</label>
                                    <textarea name="roleDesc" rows={3} placeholder="وصف الصلاحيات..." className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-indigo-500 transition-all resize-none text-right" />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">إنشاء الدور</button>
                                    <button type="button" onClick={() => setIsAddRoleModalOpen(false)} className="px-6 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold">إلغاء</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function PermissionRow({ title, category, activePermissions, onToggle }: any) {
    const actions = [
        { id: 'read', label: 'عرض' },
        { id: 'write', label: 'إضافة/تعديل' },
        { id: 'delete', label: 'حذف نهائي' }
    ];

    return (
        <div className="group border-b dark:border-slate-800 last:border-0 pb-8">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-indigo-500"/>
                <h4 className="font-black text-slate-800 dark:text-slate-200">{title}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {actions.map((action) => {
                    const isActive = activePermissions?.includes(action.id);
                    return (
                        <div 
                            key={action.id}
                            onClick={() => onToggle(category, action.id)}
                            className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                                isActive ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500' : 'border-slate-100 dark:border-slate-800 opacity-60'
                            }`}
                        >
                            <span className={`text-sm font-black ${isActive ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-500'}`}>{action.label}</span>
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 ${isActive ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 dark:border-slate-700'}`}>
                                {isActive && <CheckCircle2 size={14}/>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}