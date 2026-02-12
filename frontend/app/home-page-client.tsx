"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/auth-context";
import {
  apiRequest,
  deleteProduct,
  getMyProducts,
  markProductSold,
} from "@/lib/api";

type Category = {
  id: number;
  name: string;
};

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
                ? `/products?categoryId=${encodeURIComponent(
                    selectedCategoryId
                  )}`
                : "/products"
            );

      const [categoriesData, productsData] = await Promise.all([
        categoriesPromise,
        productsPromise,
      ]);

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
    view === "my"
      ? "You have not created any products yet."
      : "No products found for the selected filter.";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Products</h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`rounded border px-3 py-2 text-sm ${
              view === "all" ? "bg-slate-900 text-white" : "bg-white"
            }`}
            onClick={() => onViewChange("all")}
          >
            All Products
          </button>
          <button
            type="button"
            className={`rounded border px-3 py-2 text-sm ${
              view === "my" ? "bg-slate-900 text-white" : "bg-white"
            }`}
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
            {categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </select>
        </>
      ) : null}

      {loading ? <p>Loading...</p> : null}
      {error ? <p className="text-red-600">{error}</p> : null}

      {!loading && !error ? (
        <div className="grid gap-3 md:grid-cols-2">
          {products.length === 0 ? (
            <p className="text-slate-500">{emptyMessage}</p>
          ) : (
            products.map((product) => {
              const isOwner = Boolean(user && user.userId === product.userId);

              return (
                <div key={product.id} className="rounded border bg-white p-4">
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-medium">{product.title}</h2>
                      {product.isSold ? (
                        <span className="rounded bg-amber-100 px-2 py-1 text-xs">
                          Sold
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-slate-700">৳ {product.price}</p>
                    <p className="text-sm text-slate-500">
                      {product.location || "No location"}
                    </p>
                  </Link>

                  {isOwner ? (
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        className="rounded bg-amber-500 px-2 py-1 text-sm text-white"
                        onClick={() => void onMarkSold(product.id)}
                        disabled={product.isSold}
                        title={
                          product.isSold ? "Already sold" : "Mark as sold"
                        }
                      >
                        Sold
                      </button>
                      <button
                        type="button"
                        className="rounded bg-red-600 px-2 py-1 text-sm text-white"
                        onClick={() => void onDelete(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      ) : null}
    </div>
  );
}
