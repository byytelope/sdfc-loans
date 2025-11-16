"use client";

import { LogOutIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions";

export const LogoutButton = () => {
  return (
    <Button
      variant="outline"
      onClick={async () => {
        await logout();
      }}
    >
      <LogOutIcon />
      Log Out
    </Button>
  );
};
