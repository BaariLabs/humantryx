"use client";

import Link from "next/link";
import { Search, Shield } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "@/components/user-menu";
import { CommandPalette } from "@/components/command-palette";
import { NotificationDropdown } from "@/components/notification-dropdown";

interface SuperAdminTopNavProps {
  children: React.ReactNode;
}

export function SuperAdminTopNav({ children }: SuperAdminTopNavProps) {
  return (
    <div className="flex h-full flex-col">
      <CommandPalette />
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="flex h-16 items-center px-4">
          <SidebarTrigger className="mr-4 lg:hidden" />

          <div className="mr-4 lg:hidden">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="relative">
                <Shield className="text-primary h-6 w-6" />
                <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-blue-400" />
              </div>
              <span className="text-foreground text-lg font-bold">
                Super Admin
              </span>
            </Link>
          </div>

          {/* Search Trigger */}
          <div className="flex flex-1 items-center space-x-4">
            <button
              onClick={() => {
                // Trigger the command palette by simulating Cmd+K
                const event = new KeyboardEvent("keydown", {
                  key: "k",
                  metaKey: true,
                  bubbles: true,
                });
                document.dispatchEvent(event);
              }}
              className="bg-card hover:bg-accent/10 border-primary/20 hover:border-primary/40 ring-offset-background focus-visible:ring-primary/20 relative flex h-9 w-full max-w-md flex-1 items-center gap-2 rounded-md border px-3 py-2 text-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <Search className="text-primary/60 h-4 w-4" />
              <span className="text-primary/70 flex-1 text-left">
                Search...
              </span>
              <kbd className="bg-primary/10 text-primary/80 border-primary/20 pointer-events-none hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <NotificationDropdown />

            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
