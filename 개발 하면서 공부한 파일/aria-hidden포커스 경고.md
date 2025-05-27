🧠 Next.js + Radix Dialog/Drawer에서 aria-hidden 포커스 경고 해결하기
🤔 어떤 경고인가요?
Radix 기반의 Dialog나 Drawer를 사용할 때 다음과 같은 콘솔 경고를 본 적 있나요?

Blocked aria-hidden on an element because its descendant retained focus.
The focus must not be hidden from assistive technology users.
이 경고는 접근성(Accessibility, a11y) 측면에서 중요한 의미를 담고 있습니다. 하지만 원인과 해결책을 이해하지 못하면 꽤 당황스럽죠.

🧪 언제 발생하나요?
이 경고는 다음 조건이 동시에 발생할 때 뜹니다:

모달(Dialog/Drawer)을 열었는데

이전에 포커스되어 있던 요소(예: 트리거 버튼)가

aria-hidden="true" 처리된 DOM 안에 여전히 포커스를 유지할 경우

즉, 포커스가 "보이지 않고, 접근할 수 없는 영역에 남아 있는 것처럼 보일 때" 경고가 발생합니다.

🧨 예시 코드 (문제 발생)

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <div>
      <Button>모달 열기</Button>
    </div>
  </DialogTrigger>
  <DialogContent>
    ...
  </DialogContent>
</Dialog>
이런 구조에서 모달이 열릴 때, 트리거 버튼에 포커스가 남아 있고 해당 DOM이 aria-hidden 처리되면 브라우저는 "접근성 문제!" 라고 경고를 띄웁니다.

✅ 해결 방법: autoFocus 추가하기
Radix의 Dialog / Drawer 컴포넌트에는 autoFocus라는 prop이 존재합니다.
이걸 활성화하면, 모달이 열릴 때 내부의 포커스 가능한 요소로 자동으로 focus가 이동하게 됩니다.

<Dialog autoFocus open={open} onOpenChange={setOpen}>
  ...
</Dialog>
또는 Drawer 사용 시도 동일합니다:

<Drawer autoFocus open={open} onOpenChange={setOpen}>
  ...
</Drawer>
이렇게 하면 모달이 열릴 때 포커스가 내부로 안전하게 이동하고, 경고도 사라집니다.
게다가 접근성 측면에서도 스크린 리더 사용자에게 현재 포커스 컨텍스트를 명확히 전달할 수 있어 UX가 좋아집니다.

💡 보너스: 특정 버튼에 자동 포커스 주고 싶다면?
autoFocus 외에도 initialFocusRef를 사용할 수 있어요:

const confirmButtonRef = React.useRef(null)

<Dialog open={open} onOpenChange={setOpen} initialFocusRef={confirmButtonRef}>
  <DialogContent>
    <Button ref={confirmButtonRef}>예</Button>
  </DialogContent>
</Dialog>
이렇게 하면 모달이 열릴 때 포커스가 지정한 버튼에 바로 갑니다.

✨ 결론
aria-hidden 경고는 모달 전환 시 포커스가 비정상적으로 남아있을 때 발생합니다

autoFocus={true}를 Dialog/Drawer에 설정하면 문제는 사라지고, 접근성도 향상됩니다

필요 시 initialFocusRef로 포커스 위치를 명확하게 컨트롤할 수 있습니다

## DropDown 컴포넌트와 모달을 동시에 사용할 때

- 모달을 오픈하는 버튼이 드롭다운 컴포넌트 안에 있을 때
- 처음 모달을 열고 닫으면 aria-hidden 경고가 발생함
- 원인
- 드롭다운에서 버튼을 누르게 되면 드롭다운이 사라지고 모달로 포커스가 이동 해야 하는데
- 이동하지 못하고 사라진 드롭다운에 포커스가 남아있음 이게 문제가 됨
- 해결 방법
- 모달을 열기 전 포커스가 이동할 시간을 주면됨 setTimeOut을 사용하면 됨

```ts
   <DropdownMenuItem
          disabled={isPending || isEditing}
          className="flex items-center cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-focus:bg-red-50 dark:focus:bg-red-950/50"
          onSelect={() => {
              // setOpenDelete(true);// 다이얼로그가 열리기 전에 상태 업데이트
              setTimeout(() => { handleOpenDialog(); }, 30); //포커스가 이동할 시간을 줘야함 그렇지 않으면
              //Blocked aria-hidden on an element because its descendant retained focus. 오류 발생함
          }}
      >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>플랜 삭제</span>
      </DropdownMenuItem>
  </DropdownMenuContent>
```

🙋‍♂️ 참고한 기술 스택
✅ Next.js 15 (App Router)
✅ Radix UI 기반 Shadcn UI
✅ React 18
✅ TailwindCSS
✅ Vercel 배포 환경
