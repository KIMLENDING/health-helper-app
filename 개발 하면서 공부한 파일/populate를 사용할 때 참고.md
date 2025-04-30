# Mongoose에서 populate 시 모델을 명시적으로 import 해야 하는 이유

Mongoose를 사용하여 MongoDB와 상호작용할 때 `populate()` 메서드를 통해 참조된 객체를 자동으로 불러올 수 있습니다. 그러나 이를 사용할 때 흔히 겪는 오류 중 하나는 다음과 같습니다:

> "Cannot read properties of undefined (reading 'path')"

이 문제는 `ref`로 지정된 모델을 명시적으로 `import`하지 않았을 때 종종 발생합니다. 이번 글에서는 왜 `populate()` 전에 참조 모델을 명시적으로 `import` 해야 하는지 설명하겠습니다.

---

## 문제 상황 예시

```ts
// ExercisePlan.ts
const exercisePlanSchema = new Schema({
  exercises: [
    {
      exerciseId: { type: Schema.Types.ObjectId, ref: "Exercise" },
      sets: Number,
      reps: Number,
      weight: Number,
    },
  ],
});

export default mongoose.models.ExercisePlan ||
  mongoose.model("ExercisePlan", exercisePlanSchema);
```

이 경우 `populate('exerciseId')`를 사용할 때 다음 오류가 발생할 수 있습니다:

```
Error: Cannot read properties of undefined (reading 'path')
```

---

## 원인: Mongoose 내부 모델 레지스트리에 미등록

Mongoose는 `populate`할 때 문자열로 지정된 모델명을 내부 전역 레지스트리에서 검색합니다.

```ts
ref: "Exercise";
```

이렇게 작성해도, 해당 `Exercise` 모델이 메모리에 등록되지 않았다면 Mongoose는 해당 모델을 찾지 못하고 undefined 오류가 발생합니다.

> ✅ **Mongoose는 `mongoose.model('Exercise')`가 먼저 호출되어 있어야 populate가 정상 동작합니다.**

---

## 해결 방법: 참조 모델을 명시적으로 import

```ts
// 꼭 필요합니다!
import Exercise from "./Exercise";
```

```ts
const exercisePlanSchema = new Schema({
  exercises: [
    {
      exerciseId: { type: Schema.Types.ObjectId, ref: Exercise },
      // 혹은 ref: 'Exercise' 로 두되, 반드시 Exercise가 먼저 import되어야 함
      sets: Number,
      reps: Number,
      weight: Number,
    },
  ],
});
```

이렇게 하면 해당 모델이 Mongoose에 등록되고, populate 시 오류가 사라집니다.

---

## 왜 "가끔은 되고, 가끔은 안 되는가?"

개발 중에는 hot reload와 dynamic import로 인해 실행 순서가 불규칙해집니다.

- 어떤 파일에서는 `Exercise`가 먼저 import되어 작동이 잘되지만,
- 다른 상황에서는 아직 등록되지 않은 모델을 참조하면서 오류가 발생합니다.

결국 이것은 **모듈의 실행 순서와 Mongoose 내부 모델 등록 시점 문제**입니다.

---

## 결론

- `populate()`를 사용할 때는 **ref 대상 모델을 반드시 import**하세요.
- 이는 Mongoose가 내부에서 참조 모델을 전역 모델 목록에서 검색하기 때문입니다.
- 안정적인 앱 동작을 위해서 `populate`를 사용하는 모든 스키마에서 참조 대상 모델을 import하는 습관을 들이세요.

> 💡 작은 습관 하나로 디버깅 시간을 아낄 수 있습니다.

---

## 참고

- [Mongoose Populate 공식 문서](https://mongoosejs.com/docs/populate.html)

---

작성자: [당신의 이름]
날짜: 2025-04-30
