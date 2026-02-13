"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

    const isValidId = useMemo(() => /^\d+$/.test(id), [id]);

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadProduct() {
            if (!isValidId) {
                setError("Invalid product id");
                setLoading(false);
                return;
            }

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
    }, [id, isValidId]);

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

        const confirmed = window.confirm("Delete this product?");
        if (!confirmed) return;

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
        <section className="mx-auto max-w-5xl">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Left: Image */}
                <div className="rounded-xl border bg-white p-4">
                    <div className="group relative overflow-hidden rounded-lg border bg-slate-100">
                        {product.imageUrl ? (
                            <>
                                <img
                                    src={product.imageUrl}
                                    alt={product.title}
                                    className="h-[360px] w-full object-cover"
                                />

                                {/* Hover icon button (professional) */}
                                <button
                                    type="button"
                                    aria-label="Open image in new tab"
                                    title="Open image"
                                    onClick={() =>
                                        window.open(product.imageUrl!, "_blank", "noopener,noreferrer")
                                    }
                                    className="absolute right-3 top-3 hidden rounded-full border bg-white/90 p-2 shadow group-hover:block"
                                >
                                    {/* simple external-link icon */}
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M14 3h7v7"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M21 3l-9 9"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M10 7H7a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-3"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <div className="flex h-[360px] items-center justify-center text-slate-500">
                                No image
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Details */}
                <div className="rounded-xl border bg-white p-6">
                    <div className="flex items-start justify-between gap-4">
                        <h1 className="text-2xl font-semibold">{product.title}</h1>
                        {product.isSold ? (
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                                Sold
                            </span>
                        ) : null}
                    </div>

                    <p className="mt-3 text-2xl font-bold">৳ {product.price}</p>
                    <p className="mt-1 text-slate-600">{product.location || "No location"}</p>

                    {product.description ? (
                        <p className="mt-4 text-slate-800">{product.description}</p>
                    ) : null}

                    {error ? <p className="mt-3 text-red-600">{error}</p> : null}

                    {isOwner ? (
                        <div className="mt-6 flex gap-2">
                            <button
                                type="button"
                                className="rounded bg-amber-500 px-4 py-2 text-white disabled:opacity-60"
                                onClick={markSold}
                                disabled={product.isSold}
                            >
                                Mark Sold
                            </button>
                            <button
                                type="button"
                                className="rounded bg-red-600 px-4 py-2 text-white"
                                onClick={deleteProduct}
                            >
                                Delete
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
