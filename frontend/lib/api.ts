const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

<<<<<<< codex/add-step-by-step-feature
type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string;
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
=======
type RequestOptions = RequestInit & {
  body?: unknown;
>>>>>>> main
};

export class ApiClientError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

<<<<<<< codex/add-step-by-step-feature
function getStoredToken(): string | null {
=======
function getToken(): string | null {
>>>>>>> main
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
<<<<<<< codex/add-step-by-step-feature
  const token = options.token || getStoredToken();
=======
  const token = getToken();
>>>>>>> main

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
      if (errorData.message) {
        message = errorData.message;
      }
    } catch (_error) {
      // ignore JSON parse errors for non-JSON responses
    }

    throw new ApiClientError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
<<<<<<< codex/add-step-by-step-feature

export function getMyProducts(token: string): Promise<Product[]> {
  return apiRequest<Product[]>("/products/me", { token });
}

export function markProductSold(id: number, token: string): Promise<Product> {
  return apiRequest<Product>(`/products/${id}/sold`, { method: "PATCH", token });
}

export function deleteProduct(id: number, token: string): Promise<void> {
  return apiRequest<void>(`/products/${id}`, { method: "DELETE", token });
}
=======
>>>>>>> main
