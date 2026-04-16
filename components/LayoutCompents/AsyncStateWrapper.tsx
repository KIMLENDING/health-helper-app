import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AsyncStateWrapperProps<T> {
    isLoading: boolean;
    isError: boolean;
    data: T | undefined | null;
    /** 로딩 중 보여줄 스켈레톤 UI (미지정 시 기본 스피너) */
    loadingSkeleton?: React.ReactNode;
    /** 에러 메시지 (미지정 시 기본 메시지) */
    errorMessage?: string;
    /** 커스텀 에러 UI (미지정 시 기본 에러 렌더링) */
    errorState?: React.ReactNode;
    /** 다시 시도하기 버튼 클릭 핸들러 (미지정 시 버튼 숨김) */
    onRetry?: () => void;
    /** 데이터가 없을 때 보여줄 UI */
    emptyState?: React.ReactNode;
    /** 데이터가 있을 때 렌더링 함수 */
    children: (data: T) => React.ReactNode;
}

/**
 * 비동기 데이터(로딩·에러·빈 상태)를 제네릭으로 처리하는 공통 래퍼 컴포넌트.
 *
 * @example
 * <AsyncStateWrapper
 *   isLoading={isLoading}
 *   isError={isError}
 *   data={data}
 *   loadingSkeleton={<MySkeleton />}
 *   emptyState={<EmptyUI />}
 * >
 *   {(items) => items.map(item => <Item key={item._id} {...item} />)}
 * </AsyncStateWrapper>
 */
function AsyncStateWrapper<T>({
    isLoading,
    isError,
    data,
    loadingSkeleton,
    errorMessage = '데이터를 불러오는 중 오류가 발생했습니다.',
    errorState,
    onRetry,
    emptyState,
    children,
}: AsyncStateWrapperProps<T>) {
    if (isLoading) {
        return (
            <>
                {loadingSkeleton ?? (
                    <div className="flex flex-col gap-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-20 bg-gray-200 dark:bg-zinc-700 animate-pulse rounded-lg"
                            />
                        ))}
                    </div>
                )}
            </>
        );
    }

    if (isError) {
        return (
            <>
                {errorState ?? (
                    <div className="flex flex-col items-center justify-center p-8 mt-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-center">
                        <AlertCircle className="h-10 w-10 text-red-500 mb-4 shrink-0" />
                        <div className="text-red-500 dark:text-red-400 text-lg font-medium mb-2">
                            {errorMessage}
                        </div>
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className="mt-4 px-6 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg transition-colors font-medium"
                            >
                                다시 시도하기
                            </button>
                        )}
                    </div>
                )}
            </>
        );
    }

    // 배열이면 length 기준, 아니면 null/undefined 기준으로 빈 상태 판단
    const isEmpty = Array.isArray(data) ? data.length === 0 : data == null;

    if (isEmpty) {
        return <>{emptyState ?? null}</>;
    }

    return <>{children(data as T)}</>;
}

export default AsyncStateWrapper;
