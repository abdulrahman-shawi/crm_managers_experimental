"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
    UserPlus, Search, MessageCircle, Phone, Mail, 
    MoreVertical, X, Send, Calendar, Building2, User, CheckCircle
} from "lucide-react";

// --- المكون الرئيسي ---
export default function CRMSystem() {
    // 1. حالة العملاء (بيانات وهمية أولية)
    const [customers, setCustomers] = useState([
        { 
            id: 1, name: "سارة الأحمد", company: "تكنو سوفت", email: "sara@techno.com", phone: "+963 933 111 222", 
            lastContact: "2026-01-10", source: "LinkedIn",
            chats: [
                { id: 101, sender: "me", text: "مرحباً سارة، هل وصلكم العرض الفني؟", time: "10:00 AM" },
                { id: 102, sender: "client", text: "أهلاً بك، نعم وصلنا ونحن بصدد مراجعته حالياً.", time: "10:15 AM" }
            ]
        },
        { 
            id: 2, name: "محمد العلي", company: "شركة النور", email: "m.ali@alnoor.com", phone: "+963 944 555 666", 
            lastContact: "2026-01-12", source: "Facebook Ads",
            chats: [
                { id: 201, sender: "client", text: "أريد الاستفسار عن باقات الصيانة السنوية.", time: "09:00 AM" }
            ]
        }
    ]);

    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // العميل المختار حالياً بناءً على الـ ID
    const activeClient = customers.find(c => c.id === selectedClientId);

    // --- 2. دالة إضافة عميل جديد ---
    const handleAddCustomer = (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newCustomer = {
            id: Date.now(),
            name: formData.get('name') as string,
            company: formData.get('company') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            lastContact: new Date().toISOString().split('T')[0],
            source: "إضافة يدوية",
            chats: []
        };
        setCustomers([newCustomer, ...customers]);
        setIsAddModalOpen(false);
    };

    // --- 3. دالة إرسال رسالة في السجل ---
    const handleSendMessage = (text: string) => {
        if (!text.trim() || !selectedClientId) return;

        const newMessage = {
            id: Date.now(),
            sender: "me",
            text: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setCustomers(prev => prev.map(c => {
            if (c.id === selectedClientId) {
                return {
                    ...c,
                    lastContact: new Date().toISOString().split('T')[0],
                    chats: [...c.chats, newMessage]
                };
            }
            return c;
        }));
    };

    const filteredCustomers = customers.filter(c => 
        c.name.includes(searchTerm) || c.company.includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 font-sans text-right" dir="rtl">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">نظام CRM التفاعلي</h1>
                        <p className="text-slate-500 mt-1">إدارة العملاء وتحديث سجلات التواصل لحظياً</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="بحث سريع..." 
                                className="w-full pr-10 pl-4 py-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm outline-none"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all">
                            <UserPlus size={20} /> إضافة عميل
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border dark:border-slate-800 overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold text-sm">
                            <tr>
                                <th className="px-6 py-5">العميل</th>
                                <th className="px-6 py-5 text-center">الشركة</th>
                                <th className="px-6 py-5 text-center">آخر تواصل</th>
                                <th className="px-6 py-5 text-center">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-slate-800">
                            {filteredCustomers.map((client) => (
                                <tr 
                                    key={client.id} 
                                    onClick={() => setSelectedClientId(client.id)}
                                    className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer transition-colors"
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">{client.name[0]}</div>
                                            <div>
                                                <p className="font-bold dark:text-white">{client.name}</p>
                                                <p className="text-xs text-slate-400">{client.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center font-medium dark:text-slate-300">{client.company}</td>
                                    <td className="px-6 py-5 text-center text-sm font-bold text-blue-600">{client.lastContact}</td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black">نشط</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Chat Drawer */}
                <AnimatePresence>
                    {activeClient && (
                        <ChatDrawer 
                            client={activeClient} 
                            onClose={() => setSelectedClientId(null)} 
                            onSend={handleSendMessage}
                        />
                    )}
                </AnimatePresence>

                {/* Add Modal */}
                <AnimatePresence>
                    {isAddModalOpen && (
                        <AddCustomerModal 
                            onClose={() => setIsAddModalOpen(false)} 
                            onSave={handleAddCustomer} 
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// --- مكون سجل المحادثات الجانبي ---
function ChatDrawer({ client, onClose, onSend }: any) {
    const [msg, setMsg] = useState("");
    const scrollRef = useRef<any>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [client.chats]);

    const submit = () => {
        onSend(msg);
        setMsg("");
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]" onClick={onClose} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed left-0 top-0 bottom-0 w-full md:w-[400px] bg-white dark:bg-slate-900 z-[200] shadow-2xl flex flex-col">
                <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">{client.name[0]}</div>
                        <h3 className="font-black dark:text-white">{client.name}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20}/></button>
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                    {client.chats.length === 0 && <p className="text-center text-slate-400 text-xs py-10 italic">لا توجد محادثات سابقة مع هذا العميل</p>}
                    {client.chats.map((chat: any) => (
                        <div key={chat.id} className={`flex ${chat.sender === 'me' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${chat.sender === 'me' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-tl-none'}`}>
                                {chat.text}
                                <p className="text-[8px] mt-1 opacity-50">{chat.time}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t dark:border-slate-800">
                    <div className="flex gap-2">
                        <input 
                            value={msg} 
                            onChange={(e) => setMsg(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && submit()}
                            placeholder="اكتب رسالة..." 
                            className="flex-1 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl outline-none text-sm"
                        />
                        <button onClick={submit} className="p-3 bg-blue-600 text-white rounded-xl active:scale-90 transition-all"><Send size={20}/></button>
                    </div>
                </div>
            </motion.div>
        </>
    );
}

// --- مكون مودال الإضافة ---
function AddCustomerModal({ onClose, onSave }: any) {
    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
                <h2 className="text-2xl font-black mb-6">إضافة عميل</h2>
                <form onSubmit={onSave} className="space-y-4">
                    <input name="name" required placeholder="الاسم الكامل" className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none font-bold" />
                    <input name="company" required placeholder="الشركة" className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none font-bold" />
                    <input name="email" type="email" required placeholder="البريد الإلكتروني" className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none font-bold" />
                    <input name="phone" required placeholder="رقم الهاتف" className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none font-bold" />
                    <div className="flex gap-2 pt-4">
                        <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg">حفظ</button>
                        <button type="button" onClick={onClose} className="px-6 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold">إلغاء</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}