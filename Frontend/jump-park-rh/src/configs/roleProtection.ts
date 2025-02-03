import { useRouter } from 'next/router'
import { useEffect } from 'react'
const useRoleProtection = (allowedRoles: any) => {
  const router = useRouter()
  useEffect(() => {
    // Check if user has any of the allowed roles
    const userData = window.localStorage.getItem('userData')!
    const role = JSON.parse(userData)['role']
    console.log('role test---', role)
    const userRoles = role /* logic to retrieve user roles */
    const hasAllowedRole = allowedRoles.includes(userRoles)
    // If user doesn't have any of the allowed roles, redirect to a fallback page
    if (!hasAllowedRole) {
      router.push('/401') // Replace with your fallback page
    }
  }, [allowedRoles])
  return null
}
export default useRoleProtection
