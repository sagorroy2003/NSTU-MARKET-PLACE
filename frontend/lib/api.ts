const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export class ApiClientError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getToken();

  if (!headers.has("Content-Type") && options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const errorData = (await response.json()) as { message?: string };
      if (errorData?.message) message = errorData.message;
    } catch {
      // ignore non-JSON errors
    }

    throw new ApiClientError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

/** ---- Optional typed helpers (good DX) ---- */

export type Product = {
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

export function getMyProducts(): Promise<Product[]> {
  return apiRequest<Product[]>("/products/me");
}

export function markProductSold(id: number): Promise<Product> {
  return apiRequest<Product>(`/products/${id}/sold`, { method: "PATCH" });
}

export function deleteProduct(id: number): Promise<void> {
  return apiRequest<void>(`/products/${id}`, { method: "DELETE" });
}
