## 사이드바 컴포넌트를 동적으로 분리하여 초기 HTML 크기 1KB 감소한 경험

### 개요

- **목표**: 모바일 UX 개선 및 불필요한 초기 렌더 제거
- **기술 스택**: Next.js 15 (App Router), dynamic import, Tailwind 4, Zustand
- **결과**: HTML 초기 번들 크기 19.6KB → 18.6KB 개선

---

### 배경

- `SidebarLeft` 컴포넌트는 대부분 **모바일에서만 사용**
- 데스크톱 환경이나 첫 진입 시 **사용되지 않는데도 HTML에 포함**
- 초기 렌더 타임과 JS 번들 크기에 불필요한 부담을 줌

#### 개선 전 구조

```tsx
// layout.tsx
<SidebarProvider>
  <SidebarLeft /> // 항상 렌더링됨 ...
</SidebarProvider>
```

- 초기 진입 시 false 상태라 보이지 않지만 **HTML에 포함됨**

---

### 개선 작업: `next/dynamic` 적용

```tsx
// DynamicComponents.tsx
export const SidebarLeft = dynamic(() => import("@/components/sidebar-left"), {
  loading: () => null, // 로딩 시 깜빡임 방지
});
```

```tsx
// LeftSideBar.tsx
const LeftSideBar = () => {
  const { openMobile, open, isMobile } = useSidebar();

  return (
    <div>
      {isMobile ? (
        <> {openMobile && <SidebarLeft />}</>
      ) : (
        <> {open && <SidebarLeft />}</>
      )}
    </div>
  );
};
```

- 조건부 렌더링으로 **사용자가 실제로 사이드바를 여는 시점에만 로드**
- `layout.tsx`에는 `LeftSideBar`만 포함되므로 서버 렌더 시 사이드바가 제외됨

---

### 성능 개선 전후 비교

| 항목               | 개선 전        | 개선 후          |
| ------------------ | -------------- | ---------------- |
| 초기 HTML 크기     | **19.6KB**     | **18.6KB**       |
| 사이드바 로드 시점 | 페이지 진입 시 | 사용자 트리거 시 |

> 측정 도구: `Chrome DevTools > Performance > Size of initial HTML`

### 인사이트

- \*\*지연 로딩(lazy loading)\*\*은 단순한 퍼포먼스 최적화를 넘어서 **사용자 중심의 렌더링 전략**
- **조건부 로딩**을 활용해 불필요한 UI를 지연시킬수록 **SSR / hydration 최적화**에 효과적

---

### 나의 정리

이번 최적화는 단순히 1KB 줄이기 위한 작업이 아니었습니다.
\*\*사용자 중심 렌더링(UX 기반 조건부 로딩)\*\*을 어떻게 코드 레벨에서 실현할 수 있는지를 고민한 결과였고,
이러한 작은 개선들이 **결국 퍼포먼스와 사용자 만족도 모두에 긍정적 영향을 줄 수 있다는 점**을 체감했습니다.

---

### 📎 관련 파일

- [`LeftSideBar.tsx`](https://github.com/KIMLENDING/health-helper-app/blob/master/components/LayoutCompents/LeftSideBar.tsx)
- [`layout.tsx`](https://github.com/KIMLENDING/health-helper-app/blob/master/app/dashboard/layout.tsx):

---
