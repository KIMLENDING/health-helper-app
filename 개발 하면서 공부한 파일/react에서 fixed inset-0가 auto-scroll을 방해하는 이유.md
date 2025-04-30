알겠습니다! 아래는 해당 문제에 대해 블로그 스타일로 작성한 마크다운 문서입니다.

---

# React에서 `fixed inset-0`가 auto-scroll을 방해하는 이유

## 🔎 문제 발생

**오류 메시지:**

> Skipping auto-scroll behavior due to `position: sticky` or `position: fixed` on element

React 페이지 전환, 앵커 태그 이동, 혹은 `.focus()` 같은 자동 스크롤 트리거를 사용할 때 위와 같은 오류가 발생합니다. 문제는 브라우저가 자동으로 스크롤을 시도하는데, 그 과정에서 `position: fixed`나 `position: sticky` 속성을 가진 요소가 **스크롤을 방해**하기 때문에 발생합니다.

## 🤔 원인

### 1. `position: fixed`와 자동 스크롤의 충돌

`position: fixed`는 **브라우저의 viewport**에 기준을 두고 요소를 **고정시키는 스타일**입니다. 이러한 스타일이 적용된 요소는 **스크롤을 방해**할 수 있습니다. 브라우저가 특정 요소로 자동 스크롤을 이동할 때, `fixed` 요소가 **스크롤을 가리게** 되어 제대로 동작하지 않게 됩니다.

이 문제는 특히 **전체 화면을 덮는 오버레이 UI**에서 자주 발생합니다. `position: fixed`가 화면 상에서 고정되기 때문에 자동 스크롤 동작을 방해하게 되고, 그로 인해 위와 같은 경고가 출력되면서 자동 스크롤이 제대로 적용되지 않습니다.

### 2. 오류 메시지 예시

```bash
Skipping auto-scroll behavior due to position: sticky or position: fixed on element
```

이 메시지는 브라우저가 스크롤 동작을 건너뛰었다는 의미로, `position: fixed`가 적용된 요소가 화면에 존재할 때 발생할 수 있습니다.

## ⚙️ 해결 방법

### 1. `fixed` → `absolute`로 변경하기

가장 간단한 해결책은 `position: fixed`를 `position: absolute`로 변경하는 것입니다. `absolute`는 **부모 요소의 상대적인 위치**를 기준으로 동작하므로, `fixed`처럼 화면 상에서 고정되지 않아서 자동 스크롤을 방해하지 않습니다.

#### 변경 전:

```html
<div
  className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40"
></div>
```

#### 변경 후:

```html
<div
  className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40"
></div>
```

### 2. `absolute` 사용 시 주의사항

`absolute`는 **부모 요소가 `relative`나 `absolute`로 지정되어 있어야** 제대로 동작합니다. 즉, 해당 요소가 `absolute`로 지정되면 **부모 요소의 위치에 맞춰 레이아웃이 조정**되므로, 부모 요소가 `relative`로 지정되어 있지 않다면 `absolute` 요소는 기본적으로 문서의 최상위 요소인 body 태그를 기준으로 배치됨

예시:

```html
<div className="relative">
  <div
    className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40"
  >
    ...
  </div>
</div>
```

### 3. `fixed`는 꼭 필요한 경우에만 사용하기

`position: fixed`는 화면 상에서 고정되는 요소가 필요할 때만 사용하는 것이 좋습니다. 예를 들어, **헤더**나 **고정된 버튼** 등의 UI 요소에 적합합니다. 화면 전체를 덮는 오버레이 UI에는 **`absolute`**를 사용하는 것이 더 적합합니다.

## 🧠 결론

`position: fixed`는 화면에서 요소를 고정시킬 때 유용하지만, 자동 스크롤과 충돌을 일으킬 수 있습니다. 이 문제를 해결하기 위해서는 `fixed`를 `absolute`로 바꾸거나, `fixed`를 제한적으로 사용하여 문제를 피할 수 있습니다.

---
