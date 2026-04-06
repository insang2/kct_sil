import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const locales = ["ko", "en", "ja", "zh-TW"];
export const defaultLocale = "ko";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Exclude static files and Next.js internal requests
  if (
    pathname.includes('.') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect gracefully to the default locale
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!_next|api|assets|favicon.ico).*)",
  ],
};
