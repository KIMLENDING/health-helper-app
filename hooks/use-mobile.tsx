import * as React from "react"

// 모바일 장치의 최대 너비를 정의합니다.
const MOBILE_BREAKPOINT = 768

// useIsMobile 훅을 정의합니다.
export function useIsMobile() {
  // isMobile 상태를 정의합니다. 초기값은 undefined입니다.
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  // 컴포넌트가 마운트될 때와 언마운트될 때 실행되는 useEffect 훅입니다.
  React.useEffect(() => {
    // 미디어 쿼리를 사용하여 화면 너비가 MOBILE_BREAKPOINT보다 작은지 확인합니다.
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // 화면 너비가 변경될 때 호출되는 함수입니다.
    const onChange = () => {
      // 화면 너비가 MOBILE_BREAKPOINT보다 작은지 여부를 isMobile 상태에 설정합니다.
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // 미디어 쿼리에 변경 이벤트 리스너를 추가합니다.
    mql.addEventListener("change", onChange)

    // 초기 화면 너비를 기준으로 isMobile 상태를 설정합니다.
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // isMobile 상태를 불리언 값으로 반환합니다.
  return !!isMobile
}