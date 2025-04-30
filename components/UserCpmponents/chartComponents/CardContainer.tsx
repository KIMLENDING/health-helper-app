import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import React from 'react'

const CardContainer = ({
    children,
    title,
    icon
}: Readonly<{
    children: React.ReactNode;
    title: string;
    icon?: React.ReactNode;

}>) => {

    return (
        <Card className='basis-full '>
            <CardHeader className='pb-0 px-0 flex  items-center'  >
                <CardTitle className='flex flex-row  gap-2'>{icon} {title}</CardTitle>
            </CardHeader>
            <CardContent className='flex'>
                {children}
            </CardContent>
        </Card>
    )
}

export default CardContainer