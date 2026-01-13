import { useEffect, useMemo, useRef, useState } from "react";

// --- الأنواع الأساسية ---
export type ProductStatus = 'avilable' | 'unavilable' | 'instock';

export interface Category {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    image: string | null;
    categoryId: number;
    createdAt: string;
    priceLow: number;
    modelNumber: string;
    status: ProductStatus;
    userId: number;
    category?: Category;
}

interface ProductFormData {
    id: number;
    name: string;
    categoryId: string;
    price: string;
    stock: string;
    priceLow: string;
    modelNumber: string;
    status: ProductStatus;
    userid: number;
}

// --- بيانات وهمية ---
const MOCK_CATEGORIES: Category[] = [
    { id: 1, name: "إلكترونيات" },
    { id: 2, name: "مستلزمات مكتبية" },
    { id: 3, name: "برمجيات" }
];

const INITIAL_MOCK_PRODUCTS: Product[] = [
    {
        id: 1, name: "شاشة سامسونج 27", price: 300, stock: 15, image: null,
        categoryId: 1, createdAt: new Date().toISOString(), priceLow: 250,
        modelNumber: "SAM-27-X", status: 'avilable', userId: 1
    },
    {
        id: 2, name: "لوحة مفاتيح مكانيكية", price: 50, stock: 2, image: null,
        categoryId: 2, createdAt: new Date().toISOString(), priceLow: 40,
        modelNumber: "KBD-MECH", status: 'instock', userId: 1
    }
];

export function useProductForm(onSuccess: () => void) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    
    // حالات البيانات
    const [categories] = useState<Category[]>(MOCK_CATEGORIES);
    const [products, setProducts] = useState<Product[]>(INITIAL_MOCK_PRODUCTS);
    const [productslow, setProductslow] = useState<Product[]>([]);
    
    // حالات التحكم في الواجهة (UI States)
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [islowOpen, setIslowOpen] = useState(false); // تم استعادتها
    const [isEditing, setIsEditing] = useState(false);
    const [toastType, setToastType] = useState<"add" | "delete" | "edit" | null>(null); // تم استعادتها
    
    const [currentProductId, setCurrentProductId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const initialData: ProductFormData = {
        id: 0,
        name: "",
        categoryId: "1",
        price: "",
        stock: "",
        priceLow: "",
        modelNumber: "",
        status: "avilable",
        userid: 1
    };

    const [formData, setFormData] = useState<ProductFormData>(initialData);

    // ربط المنتجات بالأقسام للبحث والعرض
    const productsWithCategoryNames = useMemo(() => {
        return products.map(product => ({
            ...product,
            category: categories.find(cat => cat.id === product.categoryId)
        }));
    }, [products, categories]);

    // التصفية والبحث
    const filteredProducts = useMemo(() => {
        const userOwned = productsWithCategoryNames.filter(p => Number(p.userId) === 1);
        if (!searchTerm.trim()) return userOwned;
        const lowerTerm = searchTerm.toLowerCase();
        return userOwned.filter(p => 
            p.name.toLowerCase().includes(lowerTerm) || 
            p.modelNumber.toLowerCase().includes(lowerTerm) ||
            p.category?.name.toLowerCase().includes(lowerTerm)
        );
    }, [productsWithCategoryNames, searchTerm]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const currentItems = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // تحديث قائمة النواقص تلقائياً
    useEffect(() => {
        setProductslow(products.filter(p => p.stock <= 5));
    }, [products]);

    // دالة إظهار التنبيهات
    const showToast = (type: "add" | "delete" | "edit") => {
        setToastType(type);
        setTimeout(() => setToastType(null), 3000);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setSelectedImage(URL.createObjectURL(selectedFile));
        }
    };

    const resetForm = () => {
        setFormData(initialData);
        setFile(null);
        setSelectedImage(null);
        setIsEditing(false);
        setCurrentProductId(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const clickEdit = (product: Product) => {
        setIsEditing(true);
        setCurrentProductId(product.id);
        setFormData({
            id: product.id,
            name: product.name,
            categoryId: String(product.categoryId),
            price: String(product.price),
            stock: String(product.stock),
            priceLow: String(product.priceLow),
            modelNumber: product.modelNumber,
            status: product.status,
            userid: 1
        });
        setSelectedImage(product.image);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        const productData: Product = {
            id: isEditing ? currentProductId! : Math.floor(Math.random() * 10000),
            name: formData.name,
            price: Number(formData.price),
            stock: Number(formData.stock),
            priceLow: Number(formData.priceLow),
            modelNumber: formData.modelNumber,
            status: formData.status,
            categoryId: Number(formData.categoryId),
            image: selectedImage,
            createdAt: isEditing ? (products.find(p => p.id === currentProductId)?.createdAt || "") : new Date().toISOString(),
            userId: 1
        };

        if (isEditing) {
            setProducts(prev => prev.map(p => p.id === currentProductId ? productData : p));
            showToast("edit");
        } else {
            setProducts(prev => [productData, ...prev]);
            showToast("add");
        }

        setLoading(false);
        setIsModalOpen(false);
        resetForm();
        onSuccess();
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm("هل أنت متأكد؟")) return;
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 400));
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast("delete");
        setLoading(false);
    };

    return {
        // البيانات
        formData, setFormData, categories, products, currentItems, productslow,
        // حالات الواجهة
        fileInputRef, selectedImage, loading, isModalOpen, setIsModalOpen,
        islowOpen, setIslowOpen, toastType, setToastType,
        // البحث والترقيم
        searchTerm, setSearchTerm, currentPage, setCurrentPage, totalPages,
        // الوظائف
        handleFileChange, handleSubmit, resetForm, isEditing, clickEdit, filteredProducts,
        handleDeleteProduct, 
        handleViewProduct: (product: Product) => alert(`التفاصيل: ${product.name} - القسم: ${product.category?.name}`)
    };
}