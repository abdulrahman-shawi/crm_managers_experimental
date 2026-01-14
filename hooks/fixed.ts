import { useState, useEffect } from "react";
import axios from "axios";

// تعريف النوع لضمان تناسق البيانات
export interface FixedExpense {
  id: number;
  name: string;
  amount: number;
  date: string;
}

export const useFixedExpenses = () => {
  const [expenses, setExpenses] = useState<FixedExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    amount: "",  
    date: "" 
  });

  // حساب الإجمالي
  const totalFixed = expenses.reduce((sum, item) => sum + item.amount, 0);

  // جلب البيانات
  

  // حفظ (إضافة أو تعديل)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.name,
      amount: parseFloat(formData.amount),
      date: formData.date || "01 كل شهر"
    };

    try {
      if (editingId) {
        // حالة التعديل

          setExpenses(prev => 
            prev.map(item => item.id === editingId ? { ...item, ...formData, amount: payload.amount } : item)
          );
      } else {
        // حالة الإضافة

          const newf:FixedExpense ={ 
            id: Date.now(),
            amount:Number(formData.amount),
            date:`${Date.now()}`,
            name:formData.name
          } 
          // يفضل استخدام res.data العائد من السيرفر للحصول على الـ ID الحقيقي
          setExpenses(prev => [...prev, newf]);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("حدث خطأ أثناء حفظ البيانات");
    }
  };

  // الحذف
  const deleteExpense = async (id: number) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا المصروف؟")) return;

    try {
      setExpenses(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
      alert("فشل الحذف، يرجى المحاولة لاحقاً");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", amount: "", date: "" });
  };

  const openEditModal = (item: FixedExpense) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      amount: item.amount.toString(),
      date: item.date
    });
    setIsModalOpen(true);
  };

  return {
    expenses,
    totalFixed,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    formData,
    setFormData,
    editingId,
    handleSave,
    deleteExpense,
    closeModal,
    openEditModal
  };
};