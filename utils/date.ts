// utils/date.ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * UTC ISODate를 한국시간(KST)으로 변환하여 포맷된 문자열로 반환
 * @param dateString ISODate 문자열 or Date 객체
 * @param format 출력 포맷 (기본값: 'YYYY-MM-DD HH:mm')
 */
export const formatToKST = (dateString: string | Date, format = "YYYY-MM-DD HH:mm") => {
    return dayjs(dateString).tz("Asia/Seoul").format(format);
};
