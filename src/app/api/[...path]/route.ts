import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function authOrigin(): string {
  return (
    process.env.API_BACKEND_URL?.replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ||
    'http://localhost:8081'
  )
}

function economyOrigin(): string {
  return process.env.API_ECONOMY_URL?.replace(/\/$/, '') || 'http://localhost:8082'
}

function inventoryOrigin(): string {
  return process.env.API_INVENTORY_URL?.replace(/\/$/, '') || 'http://localhost:8083'
}

function resolveUpstream(path: string[]): string {
  const joined = path.join('/')
  if (path[0] === 'economy' && (path[1] === 'inventory' || path[1] === 'trade-up')) {
    return `${inventoryOrigin()}/api/${joined}`
  }
  if (path[0] === 'economy') {
    return `${economyOrigin()}/api/${joined}`
  }
  return `${authOrigin()}/api/${joined}`
}

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'host',
  'origin',
  'referer',
  'content-length',
])

async function proxy(request: NextRequest, path: string[]): Promise<NextResponse> {
  const target = `${resolveUpstream(path)}${request.nextUrl.search}`
  const headers = new Headers()

  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      headers.set(key, value)
    }
  })
  headers.set('accept', 'application/json')

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: 'manual',
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.arrayBuffer()
  }

  const upstream = await fetch(target, init)
  const responseHeaders = new Headers(upstream.headers)
  responseHeaders.delete('www-authenticate')
  responseHeaders.delete('transfer-encoding')

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  })
}

type RouteContext = { params: Promise<{ path: string[] }> }

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxy(request, path)
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxy(request, path)
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxy(request, path)
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxy(request, path)
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxy(request, path)
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}
