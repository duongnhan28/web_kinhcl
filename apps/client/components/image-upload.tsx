'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { apiClient } from '../lib/api';

interface ImageUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
    maxFiles?: number;
}

export function ImageUpload({ value, onChange, maxFiles = 6 }: ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        if (value.length + files.length > maxFiles) {
            alert(`Bạn chỉ được tải lên tối đa ${maxFiles} ảnh.`);
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append('files', file);
        });

        try {
            const response = await apiClient.post('/upload/images', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const newUrls = response.data.data.urls;
            onChange([...value, ...newUrls]);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Có lỗi xảy ra khi tải ảnh lên.');
        } finally {
            setIsUploading(false);
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }
    };

    const handleRemove = (urlToRemove: string) => {
        onChange(value.filter((url) => url !== urlToRemove));
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                {value.map((url, index) => (
                    <div key={index} className="relative h-24 w-24 overflow-hidden rounded-xl border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Upload ${index}`} className="h-full w-full object-cover" />
                        <button
                            type="button"
                            onClick={() => handleRemove(url)}
                            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/50 text-white transition hover:bg-red-500"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
                
                {value.length < maxFiles && (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={isUploading}
                        className="flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                    >
                        {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                        <span className="text-xs font-medium">{isUploading ? 'Đang tải...' : 'Tải ảnh'}</span>
                    </button>
                )}
            </div>
            
            <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
            />
            <p className="text-xs text-slate-500">
                Tải lên tối đa {maxFiles} ảnh. Định dạng JPG, PNG, WEBP.
            </p>
        </div>
    );
}
