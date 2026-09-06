import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { locales, defaultLocale } from "@/lib/i18n";

export const runtime = "experimental-edge";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow access to robots.txt so crawlers can read the rules
  if (pathname === '/robots.txt') {
    return NextResponse.next();
  }

  // 2. Detect and block Search Engines, AI Bots, and Scrapers
  const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";
  const blockedAgents = [
    // AI Bots
    "gptbot",
    "chatgpt-user",
    "claudebot",
    "google-extended",
    "anthropic-ai",
    "commoncrawl",
    "cohere-ai",
    "perplexitybot",
    "youbot",
    "imagesiftbot",
    "diffbot",
    // Search Engines
    "googlebot",
    "bingbot",
    "yeti",
    "naverbot",
    "daumoa",
    "baiduspider",
    "yandexbot",
    "sogou",
    "exabot",
    "slurp",
    "duckduckbot",
    // Scrapers & Libraries
    "scrapy",
    "python",
    "axios",
    "httpclient",
    "curl",
    "wget",
    "selenium",
    "playwright",
    "headlesschrome",
    "node-fetch",
    "go-http-client",
    "libwww-perl"
  ];

  const isBlocked = blockedAgents.some(agent => userAgent.includes(agent));
  if (isBlocked) {
    return new NextResponse(
      JSON.stringify({ error: "Access Denied: Bots, AI crawlers, and scrapers are not allowed on this site." }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" }
      }
    );
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

  // i18n: redirect to default locale if no locale in path
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  return response;
}

export const config = {
  matcher: [
    // Exclude Next internals and static assets (served from CDN, X-Robots-Tag
    // header covers them). /api stays in so the UA block applies to endpoints too.
    "/((?!_next|assets|favicon.ico).*)",
  ],
};
