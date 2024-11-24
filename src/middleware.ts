import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: Request) {
  console.log("Middleware is Running!");

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const protectedRoutes = [
    "/chat",
    "/notice-file-upload",
    "/profile",
    "/notice-response",
    "/summon-reasons",
    "/qnas",
  ];

  // Get the current path the user is navigating to
  const currentPath = new URL(request.url).pathname;
  console.log(`User is navigating to: ${currentPath}`);

  // If the route is protected and no token exists, redirect to home page
  if (protectedRoutes.includes(currentPath) && !token) {
    console.log("Protected route accessed without token. Redirecting to home.");
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  // If token exists or the route is unprotected, allow the request to proceed
  console.log("Access allowed.");

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/chat",
    "/notice-file-upload",
    "/profile",
    "/notice-response",
    "/summon-reasons",
    "/qnas"
  ],
};
