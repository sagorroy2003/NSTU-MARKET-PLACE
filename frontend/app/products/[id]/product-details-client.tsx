"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/api";

type Product = {
    id: number;
    userId: number;
    categoryId: number;
    title: string;
    description?: string;
    price: number | string;
    location?: string;
    imageUrl?: string;
    isSold: boolean;
    showEmail?: boolean;
    showWhatsapp?: boolean;
    showMessenger?: boolean;
};

export default function ProductDetailsClient({ id }: { id: string }) {
    const router = useRouter();
    const { user } = useAuth();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadProduct() {
            try {
                setLoading(true);
                setError(null);
                const data = await apiRequest<Product>(`/products/${id}`);
                setProduct(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load product");
            } finally {
                setLoading(false);
            }
        }

        void loadProduct();
    }, [id]);

    const isOwner = Boolean(user && product && user.userId === product.userId);

    async function markSold() {
        if (!product) return;

        try {
            const updated = await apiRequest<Product>(`/products/${product.id}/sold`, {
                method: "PATCH",
            });
            setProduct(updated);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to mark sold");
        }
    }

    async function deleteProduct() {
        if (!product) return;

        try {
            await apiRequest<void>(`/products/${product.id}`, { method: "DELETE" });
            router.push("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete product");
        }
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!product) return <p>Product not found.</p>;

    return (
        <section className="space-y-4 rounded border bg-white p-6">
            <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl font-semibold">{product.title}</h1>
                {product.isSold ? (
                    <span className="rounded bg-amber-100 px-2 py-1 text-xs">Sold</span>
                ) : null}
            </div>

            <p className="text-lg">৳ {product.price}</p>
            <p className="text-slate-600">{product.location || "No location"}</p>

            {product.description ? <p>{product.description}</p> : null}

            {product.imageUrl ? (
                <a
                    className="text-blue-600 underline"
                    href={product.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                >
                    View image URL
                </a>
            ) : null}

            {isOwner ? (
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="rounded bg-amber-500 px-3 py-2 text-white"
                        onClick={markSold}
                    >
                        Mark Sold
                    </button>
                    <button
                        type="button"
                        className="rounded bg-red-600 px-3 py-2 text-white"
                        onClick={deleteProduct}
                    >
                        Delete
                    </button>
                </div>
            ) : null}
        </section>
    );
}
