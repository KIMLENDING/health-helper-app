'use client'
import React from 'react'
import { useSidebar } from '../ui/sidebar'
import { SidebarLeft } from "@/components/UserCpmponents/DynamicComponents"
// 동적 import로 SidebarLeft 컴포넌트를 불러오기위한 코드
const LeftSideBar = () => {
    const { openMobile, open } = useSidebar();
    return (
        <div>
            {openMobile || open && <SidebarLeft />}
        </div>
    )
}

export default LeftSideBar