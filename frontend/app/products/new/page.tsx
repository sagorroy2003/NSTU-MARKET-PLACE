"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { ProtectedRoute } from "../../../components/protected-route";
import { apiRequest } from "../../../lib/api";

type Category = {
  id: number;
  name: string;
};

type ProductPayload = {
  categoryId: number;
  title: string;
  price: number;
  description?: string;
  location?: string;
  imageUrl?: string;
  showEmail?: boolean;
  showWhatsapp?: boolean;
  showMessenger?: boolean;
};

type Product = {
  id: number;
};

export default function NewProductPage() {
  return (
    <ProtectedRoute>
      <NewProductForm />
    </ProtectedRoute>
  );
}

function NewProductForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<ProductPayload>({
    categoryId: 0,
    title: "",
    price: 0,
    description: "",
    location: "",
    imageUrl: "",
    showEmail: true,
    showWhatsapp: false,
    showMessenger: false,
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await apiRequest<Category[]>("/categories");
        setCategories(data);
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, categoryId: data[0].id }));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load categories");
      }
    }

    void loadCategories();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const created = await apiRequest<Product>("/products", {
        method: "POST",
        body: {
          ...form,
          price: Number(form.price),
        },
      });
      router.push(`/products/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl rounded border bg-white p-6">
      <h1 className="mb-4 text-xl font-semibold">Create Product</h1>

      <form className="space-y-3" onSubmit={onSubmit}>
        <select
          className="w-full rounded border px-3 py-2"
          value={form.categoryId}
          onChange={(event) => setForm((prev) => ({ ...prev, categoryId: Number(event.target.value) }))}
          required
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Title"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          required
        />

        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Price"
          type="number"
          min="1"
          value={form.price}
          onChange={(event) => setForm((prev) => ({ ...prev, price: Number(event.target.value) }))}
          required
        />

        <textarea
          className="w-full rounded border px-3 py-2"
          placeholder="Description (optional)"
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        />

        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Location (optional)"
          value={form.location}
          onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
        />

        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Image URL (optional)"
          value={form.imageUrl}
          onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(form.showEmail)}
            onChange={(event) => setForm((prev) => ({ ...prev, showEmail: event.target.checked }))}
          />
          Show Email
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(form.showWhatsapp)}
            onChange={(event) => setForm((prev) => ({ ...prev, showWhatsapp: event.target.checked }))}
          />
          Show Whatsapp
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(form.showMessenger)}
            onChange={(event) => setForm((prev) => ({ ...prev, showMessenger: event.target.checked }))}
          />
          Show Messenger
        </label>

        {error ? <p className="text-red-600">{error}</p> : null}

        <button className="rounded bg-blue-600 px-4 py-2 text-white" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </section>
  );
}
