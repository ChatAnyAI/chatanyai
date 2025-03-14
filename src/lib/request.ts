import { toast } from 'sonner';

interface ResponseData<T> {
  code: number;
  msg: string;
  data: T;
}

export interface DataPage<T> {
  list: T;
  pagination: Pagination;
}

export interface Pagination {
  total?: number;
  currentPage: number;
  pageSize: number;
  sort?: string;
}

type RequestOptions = RequestInit & {
  skipErrorToast?: boolean;
  params?: Record<string, string | number | boolean>;
};

function appendQueryParams(url: string, params?: Record<string, string | number | boolean>): string {
  if (!params) return url;
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `${url}${url.includes('?') ? '&' : '?'}${queryString}` : url;
}

export async function request<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  try {
    const { params, headers, ...rest } = options;
    const finalUrl = appendQueryParams(url, params);
    const response = await fetch(finalUrl, {
      ...rest,
      headers: {
        ...(!(rest.body instanceof FormData) && { 'Content-Type': 'application/json' }),
        // 'Content-Type': 'application/json',
        ...headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        if (window.location.pathname !== '/login') window.location.href = '/login';
        throw new Error('Login expired, please login again');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json() as ResponseData<T>;

    if (result.code !== 0) {
      // When code is not 0, throw an error
      throw new Error(result.msg || 'Request failed');
    }

    return result.data;
  } catch (error) {
    if (!options.skipErrorToast) {
      // Show error toast
      toast.error(error instanceof Error ? error.message : 'Request failed');
    }
    throw error;
  }
}

// Export commonly used request methods
export const get = <T>(url: string, options?: RequestOptions) =>
  request<T>(url, { ...options, method: 'GET' });

export const post = <T>(url: string, data?: any, options?: RequestOptions) =>
  request<T>(url, {
    ...options,
    method: 'POST',
    body: data instanceof FormData ? data : JSON.stringify(data),
  });

export const put = <T>(url: string, data?: any, options?: RequestOptions) =>
  request<T>(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const del = <T>(url: string, options?: RequestOptions) =>
  request<T>(url, { ...options, method: 'DELETE' });

export default request;