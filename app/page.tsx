import { GiftIcon, Link2Icon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <div>
            <Link href={'login'}>
                <Link2Icon />
            </Link>
            <Link href={'register'}>
                <GiftIcon />
            </Link>
        </div>
    )
}

export default page