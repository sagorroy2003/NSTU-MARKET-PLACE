"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/auth-context";
import { apiRequest, deleteProduct, getMyProducts, markProductSold } from "@/lib/api";

type Category = { id: number; name: string };

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
};

export default function HomePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const selectedCategoryId = searchParams.get("categoryId") || "";
  const view = searchParams.get("view") === "my" ? "my" : "all";

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const categoriesPromise = apiRequest<Category[]>("/categories");

      const productsPromise =
        view === "my"
          ? user
            ? getMyProducts()
            : Promise.resolve([])
          : apiRequest<Product[]>(
            selectedCategoryId
              ? `/products?categoryId=${encodeURIComponent(selectedCategoryId)}`
              : "/products",
          );

      const [categoriesData, productsData] = await Promise.all([categoriesPromise, productsPromise]);
      setCategories(categoriesData);
      setProducts(productsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId, view, user]);

  function onCategoryChange(categoryId: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) params.set("categoryId", categoryId);
    else params.delete("categoryId");
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/");
  }

  function onViewChange(nextView: "all" | "my") {
    const params = new URLSearchParams(searchParams.toString());

    if (nextView === "my") {
      params.set("view", "my");
      params.delete("categoryId");
    } else {
      params.delete("view");
    }

    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/");
  }

  async function onMarkSold(id: number) {
    if (!user) {
      setError("Please login first");
      return;
    }
    try {
      await markProductSold(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark as sold");
    }
  }

  async function onDelete(id: number) {
    if (!user) {
      setError("Please login first");
      return;
    }
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;

    try {
      await deleteProduct(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  }

  const emptyMessage =
    view === "my" ? "You have not created any products yet." : "No products found for the selected filter.";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Products</h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`rounded border px-3 py-2 text-sm ${view === "all" ? "bg-slate-900 text-white" : "bg-white"}`}
            onClick={() => onViewChange("all")}
          >
            All Products
          </button>
          <button
            type="button"
            className={`rounded border px-3 py-2 text-sm ${view === "my" ? "bg-slate-900 text-white" : "bg-white"}`}
            onClick={() => onViewChange("my")}
            disabled={!user}
            title={!user ? "Login to see your products" : undefined}
          >
            My Products
          </button>
        </div>
      </div>

      {view === "all" ? (
        <>
          <label className="sr-only" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className="rounded border px-3 py-2"
            value={selectedCategoryId}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
        </>
      ) : null}

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border bg-white p-4">
              <div className="h-44 w-full rounded bg-slate-200"></div>
              <div className="mt-3 h-4 w-3/4 rounded bg-slate-200"></div>
              <div className="mt-2 h-4 w-1/2 rounded bg-slate-200"></div>
            </div>
          ))}
        </div>
      )}

      {error ? <p className="text-red-600">{error}</p> : null}

      {!loading && !error ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.length === 0 ? (
            <p className="text-slate-500">{emptyMessage}</p>
          ) : (
            products.map((product) => {
              const isOwner = Boolean(user && user.userId === product.userId);

              return (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-xl border bg-white shadow-sm transition duration-200 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Image block */}
                  <div className="relative bg-slate-100">
                    <Link href={`/products/${product.id}`} className="block">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-44 items-center justify-center text-slate-500">
                          No image
                        </div>
                      )}

                      {/* Overlay — ALWAYS present */}
                      <div className="absolute inset-0 hidden items-center justify-center bg-black/40 text-white group-hover:flex">
                        <span className="rounded bg-white/90 px-3 py-1 text-sm text-black">
                          View Details
                        </span>
                      </div>
                    </Link>


                    {/* Hover icon button like Daraz */}
                    {product.imageUrl ? (
                      <button
                        type="button"
                        aria-label="Open image in new tab"
                        title="Open image"
                        onClick={() => window.open(product.imageUrl!, "_blank", "noopener,noreferrer")}
                        className="absolute right-3 top-3 hidden rounded-full border bg-white/90 p-2 shadow group-hover:block"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
                    ) : null}

                    {product.isSold ? (
                      <span className="absolute left-3 top-3 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                        Sold
                      </span>
                    ) : null}
                  </div>

                  {/* Content */}
                  <div className="flex min-h-[130px] flex-col gap-1 p-4">
                    <Link href={`/products/${product.id}`} className="block">
                      <h2 className="line-clamp-2 text-base font-semibold min-h-[48px]">
                        {product.title}</h2>
                      <p className="mt-1 text-lg font-bold">৳ {product.price}</p>
                      <p className="line-clamp-1 text-sm text-slate-500">{product.location || "No location"}</p>
                    </Link>

                    {/* Owner actions */}
                    {isOwner ? (
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          className="rounded bg-amber-500 px-3 py-1.5 text-sm text-white disabled:opacity-60"
                          onClick={() => void onMarkSold(product.id)}
                          disabled={product.isSold}
                          title={product.isSold ? "Already sold" : "Mark as sold"}
                        >
                          Sold
                        </button>
                        <button
                          type="button"
                          className="rounded bg-red-600 px-3 py-1.5 text-sm text-white"
                          onClick={() => void onDelete(product.id)}
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : null}
    </div>
  );
}
