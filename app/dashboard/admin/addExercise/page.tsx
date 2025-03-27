'use client'
import { AddExercise } from '@/components/AdminComponents/addExercise'
import GetExercise from '@/components/AdminComponents/getExercise'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

declare module "next-auth" {
    interface Session {
        user: {
            _id: string;
            name: string | null;
            email: string | null;
            image: string | null;
            role: string | null; // 역할 추가

        };
    }
}

const AddExercisePage = () => {
    const router = useRouter();
    const { data: session, status: loading } = useSession();
    useEffect(() => {

        if (session && session?.user?.role !== 'admin') {
            router.push('/dashboard')
        }
    }, [session, loading, router])
    if (loading === 'loading') return null;
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <GetExercise />
            <AddExercise />
            {/* 여기에  지금까지 추가된 운동 리스트 보여줄까?*/}
        </div>
    )
}

export default AddExercisePage