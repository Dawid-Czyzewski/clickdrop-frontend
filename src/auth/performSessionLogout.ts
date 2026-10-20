import { authApi } from '../api/authApi'
import { authService } from './authService'

export async function performSessionLogout(
  navigate: (path: string) => void,
  redirectTo = '/',
): Promise<void> {
  const refreshToken = authService.getRefreshToken()

  try {
    if (refreshToken) {
      await authApi.logout({ refreshToken })
    }
  } catch {
    
  }

  authService.logout()
  navigate(redirectTo)
}
