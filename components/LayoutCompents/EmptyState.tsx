import React from 'react';
import Link from 'next/link';
import { LucideIcon, Dumbbell, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
    /** 상단에 표시될 아이콘 (기본값: Dumbbell) */
    icon?: LucideIcon;
    /** 메인 메시지 (기본값: '아직 운동 계획이 없습니다.') */
    title?: string;
    /** 상세 설명 (옵션) */
    description?: string;
    /** 수행할 동작 버튼 정보 (옵션) */
    action?: {
        label: string;
        href: string;
        icon?: LucideIcon;
    };
    /** 컨테이너 추가 클래스명 */
    className?: string;
}

/**
 * 데이터가 없을 때 표시하는 공통 빈 상태 컴포넌트입니다.
 */
const EmptyState = ({
    icon: Icon = Dumbbell,
    title = '아직 운동 계획이 없습니다.',
    description,
    action,
    className
}: EmptyStateProps) => {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center h-64 rounded-xl bg-zinc-50 dark:bg-zinc-800/30",
            className
        )}>
            <Icon size={40} className="text-zinc-300 mb-2" />
            <div className={cn(
                "text-zinc-500 text-lg font-medium",
                action || description ? "mb-6" : ""
            )}>
                {title}
            </div>
            
            {description && (
                <p className="text-zinc-400 text-sm mb-6 text-center max-w-xs">
                    {description}
                </p>
            )}
            
            {action && (
                <Link href={action.href}>
                    <button className="px-6 py-3 bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg flex items-center transition-colors font-medium">
                        {action.icon && <action.icon className="mr-2 h-5 w-5" />}
                        {action.label}
                    </button>
                </Link>
            )}
        </div>
    );
};

export default EmptyState;
