import type { ReactNode } from 'react'
import { beforeEach, vi } from 'vitest'

const navigationState = {
  pathname: '/',
  searchParams: new URLSearchParams(),
  replace: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  prefetch: vi.fn(),
}

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: navigationState.replace,
    push: navigationState.push,
    refresh: navigationState.refresh,
    back: navigationState.back,
    prefetch: navigationState.prefetch,
  }),
  usePathname: () => navigationState.pathname,
  useSearchParams: () => navigationState.searchParams,
  redirect: (url: string) => {
    navigationState.replace(url)
  },
}))

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string
    children: ReactNode
    className?: string
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

export function setMockPathname(pathname: string) {
  navigationState.pathname = pathname
}

export function setMockSearchParams(params: Record<string, string>) {
  navigationState.searchParams = new URLSearchParams(params)
}

export function getMockRouter() {
  return navigationState
}

beforeEach(() => {
  navigationState.pathname = '/'
  navigationState.searchParams = new URLSearchParams()
  navigationState.replace.mockClear()
  navigationState.push.mockClear()
})
