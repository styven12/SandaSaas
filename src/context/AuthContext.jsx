import { createContext, useContext } from 'react'

export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)
export function AuthProvider({ children }) { return <AuthContext.Provider value={null}>{children}</AuthContext.Provider> }
