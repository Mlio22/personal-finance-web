"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import type { MainTabId } from "@/lib/navigation";

interface HeaderActionContextValue {
  registerAction: (tabId: MainTabId, handler: () => void) => () => void;
  invokeAction: (tabId: MainTabId) => void;
}

const HeaderActionContext = createContext<HeaderActionContextValue | null>(
  null,
);

export function HeaderActionProvider({ children }: { children: ReactNode }) {
  const handlersRef = useRef(new Map<MainTabId, () => void>());

  const registerAction = useCallback(
    (tabId: MainTabId, handler: () => void) => {
      handlersRef.current.set(tabId, handler);
      return () => {
        const current = handlersRef.current.get(tabId);
        if (current === handler) {
          handlersRef.current.delete(tabId);
        }
      };
    },
    [],
  );

  const invokeAction = useCallback((tabId: MainTabId) => {
    handlersRef.current.get(tabId)?.();
  }, []);

  const value = useMemo(
    () => ({ registerAction, invokeAction }),
    [registerAction, invokeAction],
  );

  return (
    <HeaderActionContext.Provider value={value}>
      {children}
    </HeaderActionContext.Provider>
  );
}

export function useHeaderAction() {
  const context = useContext(HeaderActionContext);

  if (!context) {
    throw new Error("useHeaderAction must be used within HeaderActionProvider");
  }

  return context;
}

export function useRegisterHeaderAction(
  tabId: MainTabId,
  handler: (() => void) | undefined,
) {
  const { registerAction } = useHeaderAction();

  useEffect(() => {
    if (!handler) return;
    return registerAction(tabId, handler);
  }, [tabId, handler, registerAction]);
}
