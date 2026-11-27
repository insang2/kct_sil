import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { locales, defaultLocale } from "@/lib/i18n";

export const runtime = "experimental-edge";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 정규화: www → apex, http → https (301). 로컬 개발 제외.
  const host = request.headers.get('host') ?? '';
  if (host.endsWith('kconstrade.com')) {
    const proto = request.headers.get('x-forwarded-proto') ?? request.nextUrl.protocol.replace(':', '');
    if (host.startsWith('www.') || proto === 'http') {
      return NextResponse.redirect(`https://kconstrade.com${pathname}${request.nextUrl.search}`, 301);
    }
  }

  // 정적 에셋에 없는 *.html 은 404 (Next로 넘어가 500 나는 것 방지)
  if (pathname.endsWith('.html')) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Exclude static files, Next.js internals, and admin routes
  if (
    pathname.includes('.') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin')
  ) {
    return NextResponse.next();
  }

  // i18n: 로케일 없는 경로는 영구 리다이렉트 (Supabase 호출 전에 처리)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (!pathnameHasLocale) {
    request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(request.nextUrl, 308);
  }

  // 세션 쿠키가 없는 요청(크롤러 등)은 Supabase 호출 생략 → CPU 절약
  if (!request.cookies.getAll().some((c) => c.name.startsWith('sb-'))) {
    return NextResponse.next();
  }

  // Refresh Supabase session so Server Components can read it
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — keep alive on the server
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next|assets|favicon.ico).*)",
  ],
};
