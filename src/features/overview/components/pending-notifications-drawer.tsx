"use client";

import { Bell } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface PendingNotificationsDrawerProps {
  count: number;
}

export function PendingNotificationsDrawer({
  count,
}: PendingNotificationsDrawerProps) {
  if (count <= 0) {
    return null;
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative size-10 shrink-0 rounded-full bg-secondary"
          aria-label={`${count} pending notifications`}
        >
          <Bell className="size-4 text-foreground" aria-hidden="true" />
          <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-expense text-[10px] font-semibold text-background">
            {count}
          </span>
        </Button>
      </DrawerTrigger>

      <DrawerContent className="px-4 pb-8">
        <DrawerHeader className="px-0">
          <DrawerTitle>Pending items</DrawerTitle>
        </DrawerHeader>

        <p className="text-sm text-muted-foreground">
          {count} items need your attention. Full pending-items list coming soon.
        </p>

        <DrawerClose asChild>
          <Button type="button" variant="outline" className="mt-6 w-full">
            Close
          </Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
}
