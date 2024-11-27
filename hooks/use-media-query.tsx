import * as React from "react"

// 주어진 미디어 쿼리에 따라 상태를 반환하는 커스텀 훅
export function useMediaQuery(query: string) {
    // 미디어 쿼리의 일치 여부를 저장하는 상태 변수
    const [value, setValue] = React.useState(false)

    // 컴포넌트가 마운트될 때와 query가 변경될 때 실행되는 효과
    React.useEffect(() => {
        // 미디어 쿼리 상태가 변경될 때 호출되는 함수
        function onChange(event: MediaQueryListEvent) {
            // 상태를 미디어 쿼리의 일치 여부로 업데이트
            setValue(event.matches)
        }

        // 주어진 쿼리에 대한 MediaQueryList 객체 생성
        const result = matchMedia(query)
        // 미디어 쿼리 상태 변경 이벤트 리스너 등록
        result.addEventListener("change", onChange)
        // 초기 상태 설정
        setValue(result.matches)

        // 클린업 함수: 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => result.removeEventListener("change", onChange)
    }, [query]) // query가 변경될 때마다 이 효과를 다시 실행

    // 미디어 쿼리의 일치 여부를 반환
    return value
}