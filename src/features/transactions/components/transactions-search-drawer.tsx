"use client";

import { Search, X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface TransactionsSearchDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (query: string) => void;
}

export function TransactionsSearchDrawer({
  open,
  onOpenChange,
  query,
  onQueryChange,
}: TransactionsSearchDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="px-4 pb-8">
        <DrawerHeader className="px-0">
          <DrawerTitle>Search transactions</DrawerTitle>
        </DrawerHeader>

        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by note, category, or account"
            className="h-10 w-full rounded-lg border border-border bg-background pr-10 pl-9 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            autoFocus
          />
          {query ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute top-1/2 right-1 -translate-y-1/2 rounded-full"
              aria-label="Clear search"
              onClick={() => onQueryChange("")}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          ) : null}
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Filter the list by transaction note, category name, or account.
        </p>

        <DrawerClose asChild>
          <Button type="button" variant="secondary" className="mt-4 w-full">
            Done
          </Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
}
