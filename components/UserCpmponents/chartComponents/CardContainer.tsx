import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react'

interface CardContainerProps {
    children: React.ReactNode;
    title: string;
    icon?: React.ReactNode;
    /** Card 루트 요소에 추가할 className */
    className?: string;
    /** CardHeader에 추가할 className */
    headerClassName?: string;
    /** CardContent에 추가할 className */
    contentClassName?: string;
}

const CardContainer = ({
    children,
    title,
    icon,
    className,
    headerClassName,
    contentClassName,
}: CardContainerProps) => {
    return (
        <Card className={cn('basis-full', className)}>
            <CardHeader className={cn('pb-0 px-0 flex items-center', headerClassName)}>
                <CardTitle className='flex flex-row gap-2'>{icon} {title}</CardTitle>
            </CardHeader>
            <CardContent className={cn('flex', contentClassName)}>
                {children}
            </CardContent>
        </Card>
    )
}

export default CardContainer