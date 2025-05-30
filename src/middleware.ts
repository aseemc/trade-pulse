import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => Array.from(request.cookies.getAll()),
        setAll: (cookies) => {
          cookies.forEach((cookie) => {
            response.cookies.set(cookie.name, cookie.value, cookie.options)
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // If user is not signed in and the current path is not /auth/*, redirect to /auth/login
  if (!session && !request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // If user is signed in and the current path is /auth/*, redirect to /dashboard
  if (session && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 