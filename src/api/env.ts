export function getApiBaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_API_BASE_URL
  if (!value || value.trim() === '') {
    return ''
  }
  return value.replace(/\/$/, '')
}
