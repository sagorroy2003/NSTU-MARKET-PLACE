"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ProtectedRoute } from "@/components/protected-route";
import { apiRequest } from "@/lib/api";
import ImageUpload from "@/components/image-upload";

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

type ProductFormState = {
  categoryId: number;
  title: string;
  price: string; // string for input handling
  description: string;
  location: string;
  imageUrl: string;
  showEmail: boolean;
  showWhatsapp: boolean;
  showMessenger: boolean;
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

  const [form, setForm] = useState<ProductFormState>({
    categoryId: 0,
    title: "",
    price: "",
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
        setError(null);
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

    const parsedPrice = Number(form.price);

    if (!form.price || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setError("Price must be a valid positive number");
      setLoading(false);
      return;
    }

    try {
      const payload: ProductPayload = {
        categoryId: form.categoryId,
        title: form.title,
        price: parsedPrice,
        description: form.description || undefined,
        location: form.location || undefined,
        imageUrl: form.imageUrl || undefined,
        showEmail: form.showEmail,
        showWhatsapp: form.showWhatsapp,
        showMessenger: form.showMessenger,
      };

      const created = await apiRequest<Product>("/products", {
        method: "POST",
        body: payload,
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
          aria-label="Category"
          className="w-full rounded border px-3 py-2"
          value={form.categoryId}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              categoryId: Number(event.target.value),
            }))
          }
          required
        >
          {categories.length === 0 && (
            <option value={0} disabled>
              Loading categories...
            </option>
          )}

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
          onChange={(event) =>
            setForm((prev) => ({ ...prev, title: event.target.value }))
          }
          required
        />

        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Price"
          type="number"
          min={1}
          step={0.01}
          value={form.price}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              price: event.target.value,
            }))
          }
          required
        />

        <textarea
          className="w-full rounded border px-3 py-2"
          placeholder="Description (optional)"
          value={form.description}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, description: event.target.value }))
          }
        />

        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Location (optional)"
          value={form.location}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, location: event.target.value }))
          }
        />

        <div>
          <label className="block text-sm font-medium mb-2">
            Product Image
          </label>
          <ImageUpload
            value={form.imageUrl}
            onChange={(url) =>
              setForm((prev) => ({ ...prev, imageUrl: url }))
            }
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.showEmail}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, showEmail: event.target.checked }))
            }
          />
          Show Email
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.showWhatsapp}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                showWhatsapp: event.target.checked,
              }))
            }
          />
          Show Whatsapp
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.showMessenger}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                showMessenger: event.target.checked,
              }))
            }
          />
          Show Messenger
        </label>

        {error && <p className="text-red-600">{error}</p>}

        <button
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
          type="submit"
          disabled={loading || categories.length === 0}
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </section>
  );
}
