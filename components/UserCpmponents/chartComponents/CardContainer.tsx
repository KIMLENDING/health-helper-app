import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import React from 'react'

const CardContainer = ({
    children,
    title,

}: Readonly<{
    children: React.ReactNode;
    title: string;

}>) => {

    return (
        <Card className='basis-full '>
            <CardHeader className='pb-0 px-0 flex items-center'>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className='flex'>
                {children}
            </CardContent>
        </Card>
    )
}

export default CardContainer