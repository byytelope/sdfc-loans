"use client";

import { LogOutIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions";

export const HomeHeader = ({ userName }: { userName: string }) => {
  return (
    <div className="flex justify-between">
      <div>
        <h1 className="font-medium text-xl">Loan Facilities Dashboard</h1>
        <span className="text-muted-foreground">{userName}</span>
      </div>
      <div>
        <Button
          variant="outline"
          onClick={async () => {
            await logout();
          }}
        >
          <LogOutIcon />
          Log Out
        </Button>
      </div>
    </div>
  );
};
