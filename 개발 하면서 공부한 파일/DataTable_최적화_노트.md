# DataTable 컴포넌트 최적화 노트

## 적용된 최적화: React.memo

DataTable 컴포넌트에 `React.memo`를 적용하여 불필요한 리렌더링을 방지했습니다.

### 최적화 내용
- `DataTable` 컴포넌트를 `DataTableComponent`로 리팩터링
- `React.memo`로 컴포넌트를 감싸 불필요한 리렌더링 방지
- 내부 상태 변경(정렬, 필터링, 선택 등)은 정상적으로 동작

### 최적화 전략
- 테이블의 `columns`와 `data` props가 변경되지 않는 한 리렌더링하지 않음
- 부모 컴포넌트의 리렌더링에도 테이블이 다시 그려지는 것을 방지하여 성능 개선
- 데이터는 초기 렌더링 이후 변경되지 않으므로 이상적인 `React.memo` 활용 사례

### 내부 상태 변경과 React.memo의 관계
- `select` 체크박스를 클릭하면 변경되는 상태(`rowSelection`)는 컴포넌트 **내부** 상태임
- 컴포넌트 내부 상태 변경은 `React.memo`의 영향을 받지 않음
- 내부 상태(`useState`, `useReducer` 등)가 변경되면 `React.memo`와 관계없이 컴포넌트는 리렌더링됨

### React.memo의 동작 방식
- `React.memo`는 **외부에서 전달되는 props가 변경될 때만** 리렌더링을 방지함
- 불필요한 리렌더링만 방지하고 필요한 리렌더링(내부 상태 변경)은 그대로 발생함

### 최적화 효과
- 부모 컴포넌트의 상태 변경으로 인한 불필요한 리렌더링 방지
- 전체 애플리케이션 성능 향상
- 사용자 경험 개선
