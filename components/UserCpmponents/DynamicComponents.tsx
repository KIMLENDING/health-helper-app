'use client';

import dynamic from 'next/dynamic';
export const ShowWeek = dynamic(() => import('./showWeek'));
export const ShowChart = dynamic(() => import('./showChart'));
export const ShowPlans = dynamic(() => import('./showPlans'));
export const TotalTitleBySession = dynamic(() => import('@/components/UserCpmponents/chartComponents/session/totalTitleBySession'));
export const TotalTitleByWeight = dynamic(() => import('@/components/UserCpmponents/chartComponents/session/totalTitleByWeight'));
export const SidebarLeft = dynamic(() => import('@/components/sidebar-left'), { loading: () => null, });