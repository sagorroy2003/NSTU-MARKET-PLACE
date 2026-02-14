"use client";

import React from "react";

interface ProductCardProps {
    product: {
        id: number;
        title: string;
        price: number | string;
        imageUrl?: string;
        location?: string;
        isSold: boolean;
        userId: number;
    };
    currentUserId?: number; // Pass the logged-in user's ID
    onDelete?: (id: number) => void;
    onMarkSold?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    currentUserId,
    onDelete,
    onMarkSold
}) => {
    const isOwner = currentUserId === product.userId;

    return (
        <div className={`group flex flex-col h-full border rounded-xl bg-white shadow-sm overflow-hidden transition hover:shadow-md ${product.isSold ? 'opacity-80' : ''}`}>

            {/* --- 1. FIXED ASPECT RATIO IMAGE AREA --- */}
            <div className="relative aspect-[4/3] w-full bg-gray-50 flex items-center justify-center border-b overflow-hidden">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.title}
                        className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${product.isSold ? 'grayscale' : ''}`}
                    />
                ) : (
                    /* Professional Graphical Placeholder */
                    <div className="flex flex-col items-center justify-center text-gray-300">
                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[10px] font-bold uppercase tracking-widest">No Photo Available</span>
                    </div>
                )}

                {/* Sold Badge Overlay */}
                {product.isSold && (
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                        SOLD
                    </div>
                )}
            </div>

            {/* --- 2. CONTENT AREA --- */}
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-900 line-clamp-1 mb-1" title={product.title}>
                    {product.title}
                </h3>

                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-sm font-medium text-gray-500">৳</span>
                    <span className="text-lg font-extrabold text-blue-600">{product.price}</span>
                </div>

                <div className="flex items-center text-gray-400 text-[11px] mb-4">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{product.location || "On Campus"}</span>
                </div>

                {/* --- 3. DYNAMIC ACTIONS --- */}
                <div className="mt-auto flex gap-2">
                    {isOwner ? (
                        <>
                            <button
                                onClick={() => onMarkSold?.(product.id)}
                                className="flex-1 py-2 text-xs font-bold bg-yellow-400 text-yellow-900 rounded-lg hover:bg-yellow-500 transition"
                            >
                                {product.isSold ? 'Relist' : 'Sold'}
                            </button>
                            <button
                                onClick={() => onDelete?.(product.id)}
                                className="flex-1 py-2 text-xs font-bold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                            >
                                Delete
                            </button>
                        </>
                    ) : (
                        <button className="w-full py-2 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-black transition">
                            View Details
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;