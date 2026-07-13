"use client";

import * as React from "react";
import { Button, type ButtonProps } from "./Button";
import { useToggleButtonGroup } from "./ToggleButtonGroup";

export interface ToggleButtonProps
  extends Omit<
    ButtonProps,
    "tone" | "impact" | "clickAction" | "endContent" | "value" | "onClick"
  > {
  /**
   * 접근성 라벨. iconOnly일 때 aria-label, children 없으면 보이는 텍스트.
   */
  label?: string;
  /** 눌림 상태 (제어형). 그룹 안에서는 value 기준으로 그룹이 제어 */
  pressed?: boolean;
  /** 눌림 상태 변경 콜백 (동기) */
  onPressedChange?: (
    pressed: boolean,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
  /**
   * 비동기 토글 액션 — pending 동안 낙관적으로 다음 상태를 먼저 표시하고,
   * 실패(reject) 시 원래 상태로 되돌린다.
   */
  pressedChangeAction?: (pressed: boolean) => void | Promise<void>;
  /** 눌림 상태에서 교체 표시할 아이콘 (없으면 icon 유지) */
  pressedIcon?: React.ReactNode;
  /** ToggleButtonGroup 안에서의 식별 값 (그룹 모드 필수) */
  value?: string;
}

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

/**
 * 눌림/해제 상태를 오가는 토글 버튼. 기존 Button의 tertiary 톤 기반이며,
 * 눌림 상태에서 fill-soft 배경 + semibold 강조가 적용된다.
 *
 * 툴바 액션, 뷰 모드 전환, 서식(굵게/기울임) 컨트롤에 사용.
 * 단순 on/off 설정에는 Switch를 사용할 것.
 *
 * 단독 사용(pressed/onPressedChange) 또는 ToggleButtonGroup 안에서
 * value로 선택 관리 — 그룹 컨텍스트를 자동 감지한다.
 * 스펙: root/components/web/ui/toggle-button.md
 *
 * @example
 * const [isBold, setIsBold] = useState(false);
 * <ToggleButton label="굵게" icon={<BoldIcon />} pressed={isBold} onPressedChange={setIsBold} />
 */
export function ToggleButton({
  label,
  pressed: pressedProp,
  onPressedChange,
  pressedChangeAction,
  pressedIcon,
  value,
  size: sizeProp,
  disabled: disabledProp,
  icon,
  iconOnly,
  children,
  className,
  ...rest
}: ToggleButtonProps) {
  const group = useToggleButtonGroup();

  const committedPressed =
    group && value != null
      ? group.selectedValues.has(value)
      : (pressedProp ?? false);
  const size = sizeProp ?? group?.size;
  const disabled = group?.disabled || disabledProp;

  // 낙관적 눌림 상태 — pressedChangeAction pending 동안 다음 상태를 먼저 표시
  const [optimisticPressed, setOptimisticPressed] = React.useState<
    boolean | null
  >(null);
  const isPressed = optimisticPressed ?? committedPressed;
  const nextPressed = !isPressed;

  const resolvedIcon = isPressed && pressedIcon ? pressedIcon : icon;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (group && value != null) {
      // 그룹 모드 — 선택 관리를 그룹에 위임
      group.toggle(value);
      e.preventDefault();
      return;
    }
    onPressedChange?.(nextPressed, e);
  };

  // 비동기 토글 — Button의 clickAction 파이프라인 재사용 (자동 로딩 없음, 낙관적 표시)
  const clickAction =
    group && value != null || !pressedChangeAction
      ? undefined
      : async () => {
          setOptimisticPressed(nextPressed);
          try {
            await pressedChangeAction(nextPressed);
            setOptimisticPressed(null); // 커밋된 값으로 복귀
          } catch (err) {
            setOptimisticPressed(null); // 실패 → 원래 상태로 롤백
            throw err;
          }
        };

  /* 라벨 — semibold 전환 시 레이아웃 밀림 방지를 위해 bold 폭 미리 예약 */
  const visibleLabel = children ?? label;
  const labelContent =
    !iconOnly && visibleLabel != null ? (
      <span className="inline-grid text-center">
        <span
          className={cn(
            "col-start-1 row-start-1",
            isPressed && "font-semibold"
          )}
        >
          {visibleLabel}
        </span>
        <span
          className="col-start-1 row-start-1 font-semibold invisible"
          aria-hidden="true"
        >
          {visibleLabel}
        </span>
      </span>
    ) : undefined;

  return (
    <Button
      tone="tertiary"
      size={size}
      disabled={disabled}
      icon={resolvedIcon}
      iconOnly={iconOnly}
      label={label}
      aria-pressed={isPressed}
      onClick={handleClick}
      clickAction={clickAction}
      className={cn(
        // 눌림 상태 — fill-soft 배경 + primary 텍스트 (foundation 토큰)
        isPressed &&
          "!bg-fill-soft !text-primary !border-border-subtle",
        className
      )}
      {...rest}
    >
      {labelContent}
    </Button>
  );
}

export default ToggleButton;
