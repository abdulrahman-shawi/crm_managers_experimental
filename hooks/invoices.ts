import { useState } from "react";

// إضافة activeTab كبارامتر للـ Hook لتعيين نوع الفاتورة تلقائياً
export const useInvoiceManager = (onSuccess: (invoice: any) => void, activeTab: string) => {
  const [client, setClient] = useState("");
  const [status, setStatus] = useState("مدفوعة");
  const [items, setItems] = useState([{ productId: "", name: "", quantity: 1, price: 0, discount: 0, note: "", total: 0 }]);
  const [overallDiscount, setOverallDiscount] = useState(0);
  const [searchQueries, setSearchQueries] = useState<{ [key: number]: string }>({});
  const [showDropdown, setShowDropdown] = useState<{ [key: number]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateItem = (index: number, field: string, value: any, products: any[]) => {
    const newItems = [...items];
    if (field === "productId") {
      const product = products.find(p => p.id.toString() === value);
      if (product) {
        newItems[index] = { ...newItems[index], productId: value, name: product.name, price: product.price };
        setSearchQueries({ ...searchQueries, [index]: product.name });
        setShowDropdown({ ...showDropdown, [index]: false });
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }

    const itemTotal = (newItems[index].price * newItems[index].quantity) - (Number(newItems[index].discount) || 0);
    newItems[index].total = itemTotal > 0 ? itemTotal : 0;
    setItems(newItems);
  };

  const addNewItem = () => setItems([...items, { productId: "", name: "", quantity: 1, price: 0, discount: 0, note: "", total: 0 }]);

  const subTotal = items.reduce((acc, item) => acc + item.total, 0);
  const grandTotal = subTotal - overallDiscount;

  const handleSubmit = async () => {
    if (!client) return alert("يرجى اختيار العميل أو المورد");
    setIsSubmitting(true);
    
    // تحديد النوع بناءً على التبويب: إذا كان 'all' نجعلها revenue كافتراضي
    const finalType = activeTab === 'expense' ? 'expense' : 'revenue';

    const finalInvoice = {
      invoice_number: `${finalType === 'revenue' ? 'INV' : 'EXP'}-${Date.now().toString().slice(-4)}`,
      customer: { name: client, email: "client@example.com", address: "Local Market" },
      status: status === "مدفوعة" ? "Paid" : "Pending",
      total: grandTotal,
      issue_date: new Date().toISOString().split('T')[0],
      line_items: items.map(i => ({ desc: i.name, qty: i.quantity, price: i.price })),
      type: finalType 
    };

    setTimeout(() => {
      onSuccess(finalInvoice);
      setIsSubmitting(false);
      // Reset Hook
      setClient(""); 
      setItems([{ productId: "", name: "", quantity: 1, price: 0, discount: 0, note: "", total: 0 }]);
      setOverallDiscount(0);
      setSearchQueries({});
    }, 1000);
  };

  return {
    client, setClient, status, setStatus, items, setItems, addNewItem, updateItem,
    overallDiscount, setOverallDiscount, grandTotal, handleSubmit, isSubmitting,
    searchQueries, setSearchQueries, showDropdown, setShowDropdown
  };
};