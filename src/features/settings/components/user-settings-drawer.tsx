"use client";

import { LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function UserSettingsDrawer() {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full"
            aria-label="Open user settings"
          />
        }
      >
        <User className="size-5" aria-hidden="true" />
      </SheetTrigger>

      <SheetContent side="left" className="w-[min(100%,20rem)]">
        <SheetHeader>
          <SheetTitle>User settings</SheetTitle>
          <SheetDescription>
            Profile and app preferences will be available here.
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-4">
          <Button
            variant="ghost"
            className="justify-start gap-3 px-3"
            type="button"
          >
            <User className="size-4" aria-hidden="true" />
            Profile
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-3 px-3"
            type="button"
          >
            <Settings className="size-4" aria-hidden="true" />
            Preferences
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-3 px-3 text-destructive hover:text-destructive"
            type="button"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
