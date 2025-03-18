'use client'

import { usePathname } from "next/navigation";
import DashboardWrapper from "./dashboard/dashboardWrapper";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/sign-in";

  return isAuthPage ? children : <DashboardWrapper>{children}</DashboardWrapper>;
}
