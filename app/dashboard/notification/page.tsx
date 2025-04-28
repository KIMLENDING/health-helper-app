'use client'
import LoadingOverlay from '@/components/LayoutCompents/LoadingOverlay';
import { Button } from '@/components/ui/button'
import { useDeleteAccount } from '@/server/mutations';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import React from 'react'

const page = () => {
    const { mutateAsync, isPending } = useDeleteAccount();
    const route = useRouter();
    const handleDeleteAccount = async () => {
        try {
            await mutateAsync();
            alert("계정이 삭제되었습니다.");
            await signOut({ redirect: false });
            route.push('/');
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("계정 삭제에 실패했습니다.");
        }
    }

    if (isPending) return <LoadingOverlay isLoading={isPending} text={'계정 삭제제 중...'} />;
    return (
        <div>
            <Button variant="destructive" onClick={handleDeleteAccount} >
                탈퇴하기
            </Button>
        </div>
    )
}

export default page