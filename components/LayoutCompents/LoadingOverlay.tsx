import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingOverlay = ({ isLoading }: { isLoading: boolean }) => {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
            <div className="flex flex-col items-center space-y-4">
                <Loader2
                    className="animate-spin text-white"
                    size={64}
                    strokeWidth={2}
                />
                <p className="text-white text-lg">삭제 진행 중...</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;