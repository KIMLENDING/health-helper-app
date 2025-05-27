'use client';
import dynamic from 'next/dynamic';
import LoadingSpinner from '../LayoutCompents/LoadingSpinner';
export const ShowWeek = dynamic(() => import('./showWeek'), { ssr: false });
export const ShowChart = dynamic(() => import('./showChart'), { ssr: false });
export const ShowPlans = dynamic(() => import('./showPlans'), { ssr: false });
export const TotalTitleBySession = dynamic(() => import('@/components/UserCpmponents/chartComponents/session/totalTitleBySession'), { ssr: false });
export const TotalTitleByWeight = dynamic(() => import('@/components/UserCpmponents/chartComponents/session/totalTitleByWeight'), { ssr: false });
export const SidebarLeft = dynamic(() => import('@/components/sidebar-left'), { loading: () => null, });
export const DrawerDialogDemo = dynamic(() => import('@/components/LayoutCompents/DrawerDialogDemo'), {
    loading: () => <LoadingSpinner />, ssr: false
});
export const DrawerDialogActionWithStore = dynamic(() => import('@/components/LayoutCompents/DrawerDialogActionWithStore'), {
    loading: () => null, ssr: false
});