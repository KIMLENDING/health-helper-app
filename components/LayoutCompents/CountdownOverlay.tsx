'use client'
import React, { useState, useEffect } from 'react';

interface CountdownOverlayProps {
    onComplete: () => void;
}

const CountdownOverlay = ({ onComplete }: CountdownOverlayProps) => {
    const [countdown, setCountdown] = useState<number>(3);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCountdown((prevCount) => {
                if (prevCount === 1) {
                    clearInterval(intervalId);
                    return prevCount - 1;
                }
                return prevCount - 1;
            });
        }, 1000);

        const timeoutId = setTimeout(() => {
            onComplete();
        }, 3000);

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="text-white text-9xl font-bold">
                {countdown}
            </div>
        </div>
    );
};

export default CountdownOverlay;