import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react'

const CardContainer = ({
    children,
    title
}: Readonly<{
    children: React.ReactNode;
    title: string;
}>) => {
    return (
        <Card >
            <CardHeader className='pb-0'>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}

export default CardContainer