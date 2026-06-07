import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = [
    "/",
    "/about",
    "/services",
    "/workers",
    "/insights",
    "/contact",
    "/login",
    "/register",
  ];
  const isPublicRoute = publicRoutes.includes(pathname);

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (isPublicRoute) {
    if (token && (pathname === "/login" || pathname === "/register")) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "secret-key");
        const { payload } = await jwtVerify(token, secret);
        const roleRoutes: Record<string, string> = {
          admin: "/admin",
          manager: "/dashboard",
          worker: "/worker",
          client: "/client",
          architect: "/architect",
        };
        const role = payload.role as string;
        return NextResponse.redirect(new URL(roleRoutes[role] || "/dashboard", request.url));
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "secret-key");
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as string;

    const roleRoutes: Record<string, string> = {
      admin: "/admin",
      manager: "/dashboard",
      worker: "/worker",
      client: "/client",
      architect: "/architect",
    };

    const adminRoutes = ["/admin"];
    const isAdminRoute = adminRoutes.some((r) => pathname === r || pathname.startsWith(r + "/"));
    if (isAdminRoute && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const clientRoutes = ["/client"];
    const isClientRoute = clientRoutes.some((r) => pathname === r || pathname.startsWith(r + "/"));
    if (isClientRoute && role !== "client") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const architectRoutes = ["/architect"];
    const isArchitectRoute = architectRoutes.some((r) => pathname === r || pathname.startsWith(r + "/"));
    if (isArchitectRoute && role !== "architect") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const roleDashboardRoutes = ["/dashboard", "/admin", "/worker", "/client", "/architect"];
    const isDashboardRoute = roleDashboardRoutes.some((r) => pathname === r || pathname.startsWith(r + "/"));
    if (isDashboardRoute && role) {
      const allowedRoute = roleRoutes[role];
      const isAccessingOwnDashboard = pathname === allowedRoute || pathname.startsWith(allowedRoute + "/");
      if (allowedRoute && !isAccessingOwnDashboard) {
        return NextResponse.redirect(new URL(allowedRoute, request.url));
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
