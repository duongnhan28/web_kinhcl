'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { ImageUpload } from './image-upload';
import { ChevronDown, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProductFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit }: ProductFormProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        sku: initialData?.sku || '',
        images: (initialData?.images && initialData.images.length > 0)
            ? initialData.images.map((img: any) => img.imageUrl)
            : (initialData?.thumbnail ? [initialData.thumbnail] : []),
        models: initialData?.models?.map((m: any) => m.modelName).join('/') || ''
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.images || formData.images.length === 0) {
            alert('Vui lòng tải lên ít nhất 1 ảnh cho kính cường lực!');
            return;
        }

        setLoading(true);

        const parsedModels = formData.models.split(/[\/,]+/).map((s: string) => s.trim()).filter(Boolean);
        const firstModel = parsedModels[0] || 'Chưa rõ dòng máy';

        // Generate a random ID for slug to ensure uniqueness if name is the same
        const uniqueId = Math.random().toString(36).substring(2, 8);
        const baseSlug = formData.sku ? formData.sku.toLowerCase().replace(/[^a-z0-9]+/g, '-') : firstModel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const generatedSlug = `${baseSlug}-${uniqueId}`;

        const payload = {
            sku: formData.sku.trim(),
            name: `Kính cường lực cho ${firstModel}`,
            slug: formData.sku ? `${formData.sku.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${uniqueId}` : generatedSlug,
            description: `Kính cường lực dùng chung hỗ trợ các dòng máy: ${parsedModels.join(', ')}`,
            isFeatured: false,
            thumbnail: formData.images[0] || '',
            models: parsedModels,
            images: formData.images
        };

        try {
            if (isEdit && initialData?.id) {
                await apiClient.patch(`/products/${initialData.id}`, payload);
            } else {
                await apiClient.post('/products', payload);
            }
            
            // Xóa toàn bộ cache để đảm bảo dữ liệu mới nhất được tải lại
            await queryClient.invalidateQueries();
            
            setShowSuccess(true);
            setTimeout(() => {
                router.push('/admin/products');
                router.refresh();
            }, 1500);
        } catch (error: any) {
            console.error(error);
            const serverMessage = error.response?.data?.message;
            if (serverMessage) {
                if (typeof serverMessage === 'string') {
                    alert(serverMessage);
                } else if (Array.isArray(serverMessage)) {
                    alert(serverMessage.join('\n'));
                } else if (typeof serverMessage === 'object' && serverMessage !== null) {
                    const msg = (serverMessage as any).message || (serverMessage as any).error;
                    if (Array.isArray(msg)) {
                        alert(msg.join('\n'));
                    } else if (typeof msg === 'string') {
                        alert(msg);
                    } else {
                        alert(JSON.stringify(serverMessage));
                    }
                } else {
                    alert(JSON.stringify(serverMessage));
                }
            } else {
                alert('Có lỗi xảy ra khi lưu sản phẩm!');
            }
        } finally {
            setLoading(false);
        }
    };

    if (showSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Thành công!</h2>
                <p className="text-slate-500">Sản phẩm đã được lưu lại hệ thống.</p>
                <p className="text-xs text-slate-400 mt-4 italic">Đang chuyển hướng...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-orange-50 text-orange-800 p-4 rounded-2xl flex items-start gap-3 border border-orange-100 mb-8">
                <Sparkles className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                    <p className="font-semibold mb-1">Chế độ nhập liệu siêu tốc</p>
                    <p className="opacity-90">Bạn chỉ cần paste một danh sách các máy dùng chung (ngăn cách bởi dấu /).</p>
                </div>
            </div>

            <div className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Mã SKU <span className="text-red-500">*</span></label>
                    <input type="text" name="sku" value={formData.sku} onChange={handleChange} required placeholder="VD: GNS-T054" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-lg font-bold uppercase outline-none transition focus:border-orange-500" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Các model tương thích (Paste thẳng từ Excel) <span className="text-red-500">*</span></label>
                <textarea
                    name="models"
                    value={formData.models}
                    onChange={handleChange}
                    rows={4}
                    required
                    placeholder="VD: OP RENO 2/F11 pro/VO V15/NEX/S1..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-50 font-mono leading-relaxed resize-none"
                />
            </div>

            <div className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Hình ảnh kính cường lực (Tải lên tối đa 2 ảnh)</label>
                    <ImageUpload
                        value={formData.images}
                        onChange={(urls) => setFormData({ ...formData, images: urls })}
                        maxFiles={2}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => router.back()} className="rounded-full px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
                    Hủy bỏ
                </button>
                <button type="submit" disabled={loading} className="rounded-full bg-[#f05a28] px-8 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2 shadow-md shadow-orange-500/20">
                    {loading ? 'Đang lưu...' : isEdit ? 'Cập Nhật Sản Phẩm' : 'Tạo Sản Phẩm Mới'}
                </button>
            </div>
        </form>
    );
}
