import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingOverlay = ({ isLoading, text }: { isLoading: boolean, text?: string }) => {
    if (!isLoading) return null;

    return (
        <div className="absolute inset-0  z-[100] flex items-center justify-center bg-black/40">
            <div className="flex flex-col items-center space-y-4">
                <Loader2
                    className="animate-spin text-white"
                    size={64}
                    strokeWidth={2}
                />
                <p className="text-white text-lg">{text ? text : '삭제 진행 중...'}</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;