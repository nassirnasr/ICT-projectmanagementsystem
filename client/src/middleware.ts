import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Extend Clerk's session claims type
declare module "@clerk/nextjs/server" {
  interface SessionClaims {
    publicMetadata?: {
      role?: "admin" | "team_leader" | "team_member";
    };
  }
}

// 2. Define role routes with type safety
const roleRoutes = {
  admin: /^\/dashboard\/admin/,
  team_leader: /^\/dashboard\/team_leader/,
  team_member: /^\/dashboard\/team_member/,
} as const;

type ValidRole = keyof typeof roleRoutes;

// 3. Type guard for valid session claims
const hasValidRole = (
  claims: unknown
): claims is { publicMetadata: { role: ValidRole } } => {
  return (
    typeof claims === "object" &&
    claims !== null &&
    "publicMetadata" in claims &&
    typeof (claims as any).publicMetadata === "object" &&
    (claims as any).publicMetadata !== null &&
    "role" in (claims as any).publicMetadata &&
    Object.keys(roleRoutes).includes((claims as any).publicMetadata.role)
  );
};

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims, userId } = await auth();
  const pathname = req.nextUrl.pathname;

  // Public routes
  const publicRoutes = ["/", "/sign-in", "/api(.*)"];
  if (publicRoutes.some(route => new RegExp(route).test(pathname))) {
    return NextResponse.next();
  }

  // Validate session and role
  if (!userId || !hasValidRole(sessionClaims)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Now TypeScript knows the role is valid
  const role = sessionClaims.publicMetadata.role;

  // Check route access
  if (!pathname.match(roleRoutes[role])) {
    return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next|sign-in|sign-up|forgot-password).*)", // Exclude auth routes
    "/",
    "/(api|trpc)(.*)",
  ],
};
