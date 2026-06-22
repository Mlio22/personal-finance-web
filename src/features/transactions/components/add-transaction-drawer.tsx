"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface AddTransactionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTransactionDrawer({
  open,
  onOpenChange,
}: AddTransactionDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="px-4 pb-8">
        <DrawerHeader className="px-0">
          <DrawerTitle>Add transaction</DrawerTitle>
          <DrawerDescription>
            Transaction form coming soon. This drawer confirms the add flow is
            wired from the FAB.
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
