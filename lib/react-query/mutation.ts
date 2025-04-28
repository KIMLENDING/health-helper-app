import { toast } from "@/hooks/use-toast";

// 공통 fetch 요청 핸들러
export async function fetcher<TResponse>(url: string, method: 'POST' | 'PATCH' | 'DELETE' | 'GET', data?: unknown): Promise<TResponse> {
    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

// 공통 에러 핸들러
export function handleMutationError(error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Mutation Error:", message);
    toast({ variant: "destructive", title: message });
}