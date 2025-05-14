
import { Loader2 } from 'lucide-react'
import React from 'react'

const LoadingSpinner = ({ className }: { className?: string }) => {
    return (
        <div className="absolute inset-0  z-[100] flex items-center justify-center bg-black/40">
            <div className="flex flex-col items-center space-y-4">
                <Loader2
                    className="animate-spin text-white"
                    size={64}
                    strokeWidth={2}
                />
                <p className="text-white text-lg">로딩중...</p>
            </div>
        </div>
    )
}

export default LoadingSpinner
