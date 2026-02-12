<<<<<<< codex/add-step-by-step-feature
import { Suspense } from "react";

import HomePageClient from "./home-page-client";

export default function HomePage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <HomePageClient />
    </Suspense>
=======
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { apiRequest } from "../lib/api";

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

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategoryId = searchParams.get("categoryId") || "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [categoriesData, productsData] = await Promise.all([
          apiRequest<Category[]>("/categories"),
          apiRequest<Product[]>(
            selectedCategoryId ? `/products?categoryId=${encodeURIComponent(selectedCategoryId)}` : "/products",
          ),
        ]);

        setCategories(categoriesData);
        setProducts(productsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [selectedCategoryId]);

  function onCategoryChange(categoryId: string) {
    if (categoryId) {
      router.push(`/?categoryId=${categoryId}`);
      return;
    }

    router.push("/");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Products</h1>

        <select
          className="rounded border px-3 py-2"
          value={selectedCategoryId}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? <p>Loading...</p> : null}
      {error ? <p className="text-red-600">{error}</p> : null}

      {!loading && !error && (
        <div className="grid gap-3 md:grid-cols-2">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="rounded border bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-medium">{product.title}</h2>
                {product.isSold ? <span className="rounded bg-amber-100 px-2 py-1 text-xs">Sold</span> : null}
              </div>
              <p className="mt-2 text-slate-700">৳ {product.price}</p>
              <p className="text-sm text-slate-500">{product.location || "No location"}</p>
            </Link>
          ))}

          {products.length === 0 ? <p className="text-slate-500">No products found.</p> : null}
        </div>
      )}
    </div>
>>>>>>> main
  );
}
