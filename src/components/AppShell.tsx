import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <main className="flex-1 pb-28">{children}</main>
      <BottomNav />
    </div>
  );
};
