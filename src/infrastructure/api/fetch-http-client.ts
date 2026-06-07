import type { HttpClientPort } from "@domain/ports/http-client-port";
import { NetworkError } from "@domain/errors";
import { env } from "@infrastructure/config/env";
import { logger } from "@infrastructure/logging/logger";

export class FetchHttpClient implements HttpClientPort {
  private readonly baseUrl: string;

  constructor(baseUrl: string = env.VITE_API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    logger.debug({ url, method: options?.method ?? "GET" }, "HTTP request");

    try {
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json", ...options?.headers },
        ...options,
      });

      if (!response.ok) {
        const body = await response.text();
        throw new NetworkError(`HTTP ${response.status}: ${body}`);
      }

      if (response.status === 204) return undefined as T;

      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof NetworkError) throw error;
      throw new NetworkError(`Request failed: ${String(error)}`);
    }
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "GET" });
  }

  post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  patch<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "DELETE" });
  }
}
