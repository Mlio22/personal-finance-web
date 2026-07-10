"use client";

import { useCallback, useRef } from "react";

const DEFAULT_LONG_PRESS_MS = 450;

interface UseLongPressOptions {
  onPress?: () => void;
  onLongPress?: () => void;
  delayMs?: number;
  disabled?: boolean;
}

export function useLongPress({
  onPress,
  onLongPress,
  delayMs = DEFAULT_LONG_PRESS_MS,
  disabled = false,
}: UseLongPressOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPressRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const onPointerDown = useCallback(() => {
    if (disabled || !onLongPress) {
      return;
    }

    didLongPressRef.current = false;
    clearTimer();
    timerRef.current = setTimeout(() => {
      didLongPressRef.current = true;
      onLongPress();
    }, delayMs);
  }, [clearTimer, delayMs, disabled, onLongPress]);

  const onPointerUp = useCallback(() => {
    clearTimer();
  }, [clearTimer]);

  const onClick = useCallback(() => {
    if (didLongPressRef.current) {
      didLongPressRef.current = false;
      return;
    }
    onPress?.();
  }, [onPress]);

  return {
    onClick,
    onPointerDown,
    onPointerUp,
    onPointerCancel: onPointerUp,
    onPointerLeave: onPointerUp,
    onContextMenu: (event: { preventDefault: () => void }) => {
      if (onLongPress) {
        event.preventDefault();
      }
    },
  };
}
