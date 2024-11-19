'use client'

import CreatPlanUser from '@/components/UserCpmponents/creatPlanUser'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
const CreatPlan = () => {
    const router = useRouter();
    const { status: loading } = useSession();
    useEffect(() => {
        if (loading === 'unauthenticated') router.push('/login') // 로그인 안되어있으면 로그인 페이지로 이동
    }, [loading, router])

    return (
        <div className='flex flex-1 flex-col gap-4 p-4'>
            <CreatPlanUser />
        </div>
    )
}

export default CreatPlan