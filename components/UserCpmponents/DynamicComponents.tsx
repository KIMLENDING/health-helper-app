'use client';

// import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

export const ShowWeek = dynamic(() => import('./showWeek'), { ssr: false });
export const ShowChart = dynamic(() => import('./showChart'), { ssr: false });
export const ShowPlans = dynamic(() => import('./showPlans'), { ssr: false });

export const TotalTitleBySession = dynamic(() => import('@/components/UserCpmponents/chartComponents/session/totalTitleBySession'), { ssr: false });
export const TotalTitleByWeight = dynamic(() => import('@/components/UserCpmponents/chartComponents/session/totalTitleByWeight'), { ssr: false });