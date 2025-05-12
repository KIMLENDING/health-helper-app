# AddExercise 컴포넌트

## 개요

`AddExercise` 컴포넌트는 헬스 헬퍼 애플리케이션에서 관리자가 새로운 운동을 데이터베이스에 추가할 수 있는 폼을 제공합니다. 이 컴포넌트는 `/dashboard/admin/addExercise` 경로에서 접근할 수 있으며, 관리자 권한을 가진 사용자만 사용할 수 있습니다.

## 핵심 기능

- 운동 이름, 설명, URL, 태그 등의 정보를 입력하는 폼 제공
- Zod를 사용한 폼 유효성 검사 구현
- 운동 부위 태그 선택을 위한 계층적 태그 선택기 연동
- React-Query를 사용한 서버 연동 및 상태 관리

## 주요 코드 구조

### 임포트 및 의존성

```tsx
"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import TagSelector from "./addTag";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { addExercise } from "@/server/admin/mutations";
import {
  Dumbbell,
  Link as LinkIcon,
  Info,
  Tag,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
```

### 폼 스키마 정의

Zod를 사용하여 폼 필드의 유효성 검사 규칙을 정의합니다.

```tsx
const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "운동 이름은 최소 2자 이상이어야 합니다.",
    })
    .max(50, {
      message: "운동 이름은 최대 50자까지 입력 가능합니다.",
    }),
  description: z
    .string()
    .min(2, {
      message: "설명은 최소 2자 이상이어야 합니다.",
    })
    .max(200, {
      message: "설명은 최대 200자까지 입력 가능합니다.",
    }),
  url: z.string().url({
    message: "유효한 URL 형식이 아닙니다.",
  }),
});
```

### 상태 관리

컴포넌트 내부 상태를 관리하기 위한 useState 훅과 React-Query를 사용합니다.

```tsx
export const AddExercise = () => {
    const [dbTags, setDbTags] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const addExerciseMutation = addExercise();

    // React Hook Form 설정
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            url: "",
        },
    })
```

### 폼 제출 핸들러

폼 제출 시 실행되는 함수로, 유효성 검사 후 서버에 데이터를 전송합니다.

```tsx
async function onSubmit(values: z.infer<typeof formSchema>) {
  if (dbTags.length === 0) {
    toast({
      title: "태그를 선택해주세요",
      description: "최소 한 개 이상의 태그가 필요합니다.",
      variant: "destructive",
    });
    return;
  }

  setIsSubmitting(true);

  try {
    const postData = {
      title: values.title,
      description: values.description,
      url: values.url,
      tags: dbTags,
    };

    await addExerciseMutation.mutateAsync(postData);

    toast({
      title: "운동 추가 성공!",
      description: `"${values.title}" 운동이 성공적으로 추가되었습니다.`,
      variant: "default",
    });

    form.reset();
    setDbTags([]);
  } catch (error) {
    console.error("Error submitting form:", error);
    toast({
      title: "오류가 발생했습니다.",
      description: "이름이 중복될 수 있습니다. ",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
}
```

## 관련 컴포넌트

### TagSelector 컴포넌트

`addTag.tsx` 파일에 정의된 `TagSelector` 컴포넌트는 운동 부위 태그를 계층적으로 선택할 수 있는 UI를 제공합니다. 이 컴포넌트는 `dbTags`와 `setDbTags` props를 통해 AddExercise 컴포넌트와 상태를 공유합니다.

```tsx
interface TagSelectorProps {
  dbTags: string[];
  setDbTags: React.Dispatch<React.SetStateAction<string[]>>;
}
```

### 태그 구조

태그는 `utils/util.ts` 파일에 정의된 계층적 구조를 따릅니다.

```ts
export const tags = {
  상체: {
    // 대분류
    팔: ["이두", "삼두"], // 중분류 - [소분류]
    어깨: ["전면", "측면", "후면"],
    가슴: ["대흉근", "소흉근"],
    등: ["광배근", "승모근"],
    배: ["복직근", "복사근"],
  },
  하체: {
    엉덩이: ["대둔근", "중둔근", "소둔근"],
    허벅지: ["대퇴사두근", "대퇴이두근"],
    종아리: ["비복근", "가자미근"],
  },
};
```

## 서버 통신

### addExercise 뮤테이션

`server/admin/mutations.ts` 파일에 정의된 `addExercise` 함수는 React-Query의 `useMutation` 훅을 사용하여 서버 API와 통신합니다.

```typescript
export const addExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postData: Partial<Exercise>) => {
      const response = await fetch(
        `${process.env.NEXTAUTH_URL}/api/admin/exercise`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        }
      );
      // 응답 처리 로직
    },
    onSuccess: async (data) => {
      toast({ variant: "default2", title: `${data.message}` });
      await queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
    onError: (error) => {
      // 에러 처리 로직
    },
  });
};
```

### API 엔드포인트

`app/api/admin/exercise/route.ts` 파일에는 운동을 추가하는 API 엔드포인트가 정의되어 있습니다.

```typescript
export const POST = async (req: NextRequest) => {
  const { title, description, url, tags } = await req.json();
  // 권한 검증 및 데이터베이스 저장 로직
};
```

## 데이터베이스 모델

운동 정보는 MongoDB의 `Exercise` 모델에 저장됩니다. 모델 스키마는 `models/Exercise.js` 파일에 정의되어 있습니다.

```javascript
const exerciseSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);
```

## UI 컴포넌트

컴포넌트는 Shadcn UI 라이브러리의 컴포넌트를 사용하여 스타일링되어 있으며, 테일윈드 CSS 클래스를 통해 추가적인 스타일을 적용합니다. 주요 UI 컴포넌트로는 Card, Form, Input, Textarea, Button 등이 있습니다.

## 사용 방법

1. 관리자 권한이 있는 사용자로 로그인합니다.
2. `/dashboard/admin/addExercise` 페이지로 이동합니다.
3. 폼에 운동 정보를 입력합니다.
   - 운동 이름 (2~50자)
   - 운동 설명 (2~200자)
   - 참고 영상 URL (유효한 URL 형식)
   - 운동 태그 (최소 1개 이상)
4. "운동 추가하기" 버튼을 클릭하여 폼을 제출합니다.
5. 성공 또는 실패 메시지를 확인합니다.

## 결론

`AddExercise` 컴포넌트는 관리자가 새로운 운동을 데이터베이스에 추가할 수 있는 폼 인터페이스를 제공합니다. React Hook Form과 Zod를 사용한 폼 유효성 검사, React-Query를 통한 서버 상태 관리, 그리고 계층적 태그 선택 기능을 포함하고 있습니다. 이 컴포넌트는 사용자 친화적인 UI를 제공하면서도 데이터의 유효성과 일관성을 유지하는 데 중점을 두고 있습니다.
