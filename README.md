## 🎯 프로젝트 개요

H-Helper는 사용자가 운동 계획을 체계적으로 관리하고, 기록하며, 분석할 수 있도록 돕는 웹 애플리케이션입니다. 운동 루틴 생성부터 수행 기록, 데이터 기반 분석까지 한 곳에서 관리할 수 있습니다.

- 운동 계획 생성 → 수행 → 기록까지의 전 과정을 관리
- 세트별 수행 기록, 중량, 시간 등 데이터 기반 분석 지원
- 실제 서비스를 염두에 두고 설계된 CRUD 및 인증 흐름 구현
- **React Query Hydration**을 활용한 SSR로 빠른 로딩 제공
- **동적 임포트**를 통해 초기 번들 크기 최적화

## 개발 기간

- v1 2024/11/06 - 2024/12/19 전체적인 설계 및 구현
- v2 2025/03/25 - 2025/04/30 코드 리팩토링 및 디자인 수정

## ✨ 주요 기능

### 운동 계획 관리

- **운동 계획 생성 및 수정**: 사용자가 원하는 운동 계획을 손쉽게 생성하고 수정할 수 있습니다.
- **세부 설정**: 운동별 세트, 반복 횟수, 중량을 세부적으로 설정 가능.
- **운동 목록 관리**: 운동 계획에 포함된 운동들을 체계적으로 관리.

---

### 주간 운동 히스토리

- **운동 기록 확인**: 주간 운동 세션 기록을 한눈에 확인.
- **분석 차트 제공**: 완료된 세션 비율 및 분석 차트를 통해 진행 상황을 시각적으로 파악.

---

### 운동 데이터 분석

- **데이터 시각화**: 주간 운동 시간, 중량, 부위별 데이터를 그래프로 시각화.
- **수행 빈도 분석**: 운동 종목별 수행 빈도를 분석하여 효율적인 운동 계획 수립 지원.

---

## 🔧 기술적 도전과 해결

### 1. **React Query Hydration을 활용한 SSR**

- 서버에서 데이터를 미리 가져와 React Query의 상태를 직렬화(`dehydrate`)하여 클라이언트로 전달.
- 클라이언트에서 하이드레이션(`HydrationBoundary`)을 통해 초기 로딩 시간을 단축.
- 이를 통해 사용자 경험을 개선하고, 서버와 클라이언트 간 데이터 일관성을 유지.

### 2. **동적 임포트를 통한 초기 번들 크기 최적화**

- `LeftSidebar`와 같은 비동기적으로 로드 가능한 컴포넌트를 동적 임포트(`next/dynamic`)로 처리.
- 초기 번들 크기를 줄이고, 필요한 시점에만 컴포넌트를 로드하여 성능 최적화.

### 3. **반응형 Drawer / Dialog 통합 구조 구현**

- 모바일 UX를 고려한 반응형 UI 설계.
- TailwindCSS와 Shadcn UI를 활용하여 일관된 스타일링 제공.

### 4. **회원 탈퇴 시 연관 데이터 정리**

- MongoDB 트랜잭션을 사용하여 계정 삭제와 연관 데이터 삭제를 원자적으로 처리
- ExercisePlan과 ExerciseSession 데이터를 계정 삭제 요청과 함께 안전하게 삭제
- 삭제 중 문제가 발생하면 트랜잭션을 롤백하여 데이터 무결성을 유지.

---

## 📦 MongoDB 스키마 개요

이 프로젝트는 Mongoose를 사용하여 피트니스 관련 핵심 데이터를 스키마 형태로 정의합니다.

---

### 🧑‍💼 User

[🔗 GitHub Repository - Exercise](https://github.com/KIMLENDING/health-helper-app/blob/master/models/User.js)
앱 사용자에 대한 정보를 저장하는 스키마입니다.

| 필드       | 타입   | 필수 여부 | 설명                                            |
| ---------- | ------ | --------- | ----------------------------------------------- |
| `email`    | String | ✅        | 이메일 주소                                     |
| `password` | String | ❌        | 비밀번호 (소셜 로그인 사용 시 비어있을 수 있음) |
| `name`     | String | ✅        | 사용자 이름                                     |
| `image`    | String | ❌        | 프로필 이미지 URL                               |
| `role`     | String | ✅        | 사용자 권한 (기본값: `"user"`)                  |
| `provider` | String | ✅        | 로그인 제공자 (`google`, `github` 등)           |

> 🔐 `email + provider` 조합으로 고유한 사용자 식별을 보장하기 위해 복합 인덱스가 설정되어 있습니다.

---

### 🏋️ Exercise

[🔗 GitHub Repository - Exercise](https://github.com/KIMLENDING/health-helper-app/blob/master/models/Exercise.js)
운동 항목을 정의하는 스키마입니다.

| 필드          | 타입   | 필수 여부 | 설명                           |
| ------------- | ------ | --------- | ------------------------------ |
| `title`       | String | ✅        | 운동 이름 (고유)               |
| `description` | String | ✅        | 운동 설명                      |
| `url`         | String | ✅        | 참고 영상 또는 설명 링크       |
| `tags`        | String | ✅        | 태그 목록 (예: 상체, 하체, 등) |

---

### 📋 ExercisePlan

[🔗 GitHub Repository - ExercisePlan](https://github.com/KIMLENDING/health-helper-app/blob/master/models/ExercisePlan.js)
사용자가 미리 설정한 운동 계획(루틴)을 저장하는 스키마입니다.

| 필드        | 타입     | 필수 여부 | 설명                                |
| ----------- | -------- | --------- | ----------------------------------- |
| `userId`    | ObjectId | ✅        | 계획을 생성한 사용자 ID 참조:`User` |
| `title`     | String   | ✅        | 계획 제목                           |
| `exercises` | [객체]   | ✅        | 포함된 운동 목록                    |

**exercises 배열의 내부 구조:**

| 필드         | 타입     | 필수 여부 | 설명             |
| ------------ | -------- | --------- | ---------------- |
| `exerciseId` | ObjectId | ✅        | 참조: `Exercise` |
| `sets`       | Number   | ✅        | 세트 수          |
| `reps`       | Number   | ✅        | 반복 횟수        |
| `weight`     | Number   | ✅        | 초기 중량 (kg)   |

| > **(제거됨)**: | `title` | String | ✅ | 운동 이름 |
`title` 필드는 `exerciseId`를 통해 populate하여 조회합니다. (2024-04 기준)

---

### 🧪 ExerciseSession

[🔗 GitHub Repository - ExerciseSession](https://github.com/KIMLENDING/health-helper-app/blob/master/models/ExerciseSession.js)
실제 수행된 운동 세션을 기록하는 스키마입니다.

| 필드             | 타입     | 필수 여부 | 설명                                    |
| ---------------- | -------- | --------- | --------------------------------------- |
| `userId`         | ObjectId | ✅        | 세션 수행자 ID 참조:`User`              |
| `exercisePlanId` | ObjectId | ✅        | 기반이 된 운동 계획 참조:`ExercisePlan` |
| `exercises`      | [객체]   | ✅        | 세션 동안 수행된 운동들                 |
| `state`          | String   | ✅        | 세션 상태 (`"inProgress"`, `"done"`)    |

**exercises 배열의 내부 구조:**

| 필드         | 타입     | 필수 여부 | 설명                                  |
| ------------ | -------- | --------- | ------------------------------------- |
| `exerciseId` | ObjectId | ✅        | 참조: `Exercise`                      |
| `repTime`    | Number   | ❌        | 전체 세트 수행 시간 (초 단위 등)      |
| `sets`       | Number   | ✅        | 세트 수                               |
| `state`      | String   | ✅        | `"pending"`, `"inProgress"`, `"done"` |
| `session`    | [객체]   | ✅        | 실제 수행한 각 세트 정보              |

| > **(제거됨)**: | `title` | String | ✅ | 운동 이름 |
`title` 필드는 `exerciseId`를 통해 populate하여 조회합니다. (2024-04 기준)

**session 배열의 내부 구조 (개별 세트):**

| 필드      | 타입   | 필수 여부 | 설명           |
| --------- | ------ | --------- | -------------- |
| `set`     | Number | ✅        | 세트 번호      |
| `reps`    | Number | ✅        | 실제 반복 횟수 |
| `weight`  | Number | ✅        | 사용 중량      |
| `endTime` | Date   | ❌        | 세트 종료 시각 |

---

### ✅ 설계 의도

- 미리 정의된 운동 계획과 실제 수행 데이터를 분리하여 유연한 기록 구조 제공
- 세트 단위의 정밀 기록을 통해 운동 통계 및 분석 가능

# 📚 API Routes

Next.js 15 App Router + TypeScript 기반 API 경로 문서입니다.

---

## 🛡️ 인증 (Auth)

[🔗 GitHub Repository - Auth](https://github.com/KIMLENDING/health-helper-app/tree/master/app/api)

| Method |         Endpoint          | 설명                 |
| :----: | :-----------------------: | :------------------- |
|  POST  | `/api/auth/[...nextauth]` | NextAuth 인증 핸들러 |
|  POST  |      `/api/register`      | 사용자 회원가입      |
|  POST  |   `/api/registerAdmin`    | 관리자 회원가입      |

---

## 🏋️‍♂️ 관리자 - 운동 관리 (Admin / Exercise)

[🔗 GitHub Repository - Admin](https://github.com/KIMLENDING/health-helper-app/tree/master/server/admin)

| Method |              Endpoint              | 설명                |     TanstackQuery     |
| :----: | :--------------------------------: | :------------------ | :-------------------: |
|  GET   |       `/api/admin/exercise`        | 모든 운동 목록 조회 |   `useEexercises()`   |
|  POST  |       `/api/admin/exercise`        | 새로운 운동 등록    |    `addExercise()`    |
| PATCH  | `/api/admin/exercise/[exerciseId]` | 운동 정보 수정      | `useUpdateExercise()` |
| DELETE | `/api/admin/exercise/[exerciseId]` | 운동 삭제           | `useDeleteExercise()` |

---

## 👤 사용자 (User)

[🔗 GitHub Repository - server](https://github.com/KIMLENDING/health-helper-app/tree/master/server/mutations.ts)

| Method |          Endpoint          | 설명             |    TanstackQuery     |
| :----: | :------------------------: | :--------------- | :------------------: |
| DELETE | `/api/user/delete-account` | 사용자 계정 삭제 | `useDeleteAccount()` |

---

## 📝 운동 플랜 (Exercise Plan)

[🔗 GitHub Repository - Exercise Plan](https://github.com/KIMLENDING/health-helper-app/tree/master/server/user/exercisePlan)

| Method |             Endpoint              | 설명                  |      TanstackQuery      |
| :----: | :-------------------------------: | :-------------------- | :---------------------: |
|  GET   |     `/api/user/exercisePlan`      | 운동 플랜 전체 조회   |   `useExercisePlan()`   |
|  POST  |     `/api/user/exercisePlan`      | 새로운 운동 플랜 생성 |    `useCreatePlan()`    |
| PATCH  |     `/api/user/exercisePlan`      | 운동 플랜 운동 추가   |    `useUpdatePlan()`    |
|  GET   | `/api/user/exercisePlan/[planId]` | 특정 운동 상세 조회   | `useExercisePlanById()` |
| PATCH  | `/api/user/exercisePlan/[planId]` | 개별 운동 수정        |     `useEditPlan()`     |
| DELETE | `/api/user/exercisePlan/[planId]` | 플랜 삭제             |    `useDeletePlan()`    |

---

## 🏃 운동 세션 (Exercise Session)

[🔗 GitHub Repository - Exercise Session](https://github.com/KIMLENDING/health-helper-app/tree/master/server/user/exerciseSession)

| Method |                       Endpoint                       | 설명                       |        TanstackQuery         |
| :----: | :--------------------------------------------------: | :------------------------- | :--------------------------: |
|  GET   |             `/api/user/exerciseSession`              | 가장 최근 세션조회         |      `useInProgress()`       |
|  POST  |             `/api/user/exerciseSession`              | 새로운 운동 세션 생성      | `useCreateExerciseSession()` |
|  GET   |       `/api/user/exerciseSession/[sessionId]`        | 운동 세션 상세 조회        |  `useGetExerciseSession()`   |
| PATCH  |       `/api/user/exerciseSession/[sessionId]`        | 운동 세션 상태 수정        |  `useDoneExerciseSession()`  |
|  POST  | `/api/user/exerciseSession/[sessionId]/[exerciseId]` | 운동 세션 세트 추가        | `useActionExerciseSession()` |
| PATCH  | `/api/user/exerciseSession/[sessionId]/[exerciseId]` | 운동 세션 세트 데이터 수정 |  `useEditExerciseSession()`  |
|  GET   |           `/api/user/exerciseSession/all`            | 모든 세션 기록 조회        |      `useAllSessions()`      |

---

## 📅 주간 세션 (Session Week)

[🔗 GitHub Repository - Session Week](https://github.com/KIMLENDING/health-helper-app/tree/master/server/queries.ts)

| Method |                Endpoint                 | 설명                |    TanstackQuery    |
| :----: | :-------------------------------------: | :------------------ | :-----------------: |
|  GET   | `/api/user/exerciseSession/SessionWeek` | 주간 운동 세션 조회 | `useWeekSessions()` |

---

## 🔐 인증 처리 방식 (Authentication)

- 인증이 필요한 API는 내부적으로 `requireUser(req)` 유틸을 사용하여 다음을 검사합니다:
  - `next-auth` 세션 유효성 (`getServerSession`)
  - JWT 토큰 검증 (`getToken`)
- MongoDB에 존재하는 유저 확인 (`User.findOne`)
- 인증 실패 시, 다음과 같은 JSON 응답이 반환됩니다:
  ```json
  { "error": "Unauthorized", "status": 401 }
  ```

# 🛠️ Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **MongoDB**
- **React Query**
- **TailwindCSS 4.0**
- **Shadcn-UI**
- **Vercel Deploy**
