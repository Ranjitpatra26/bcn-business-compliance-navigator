import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with cross-site request forgery (CSRF) attacks.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                           request.nextUrl.pathname.startsWith('/onboarding') ||
                           request.nextUrl.pathname.startsWith('/business') ||
                           request.nextUrl.pathname.startsWith('/compliance') ||
                           request.nextUrl.pathname.startsWith('/regulations') ||
                           request.nextUrl.pathname.startsWith('/documents') ||
                           request.nextUrl.pathname.startsWith('/assistant') ||
                           request.nextUrl.pathname.startsWith('/notifications') ||
                           request.nextUrl.pathname.startsWith('/settings');

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
                      request.nextUrl.pathname.startsWith('/register');

  // Bypass auth checks entirely in mock mode
  if (process.env.NEXT_PUBLIC_API_MODE === "mock") {
    // Just allow all routing without redirects
    return supabaseResponse
  }

  if (!user && isProtectedRoute) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    // user is already logged in, redirect them away from auth pages
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard' // Could be onboarding based on business status, but /dashboard handles that check
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
