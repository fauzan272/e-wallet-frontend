import { Navigate } from "react-router-dom"

function ProtectedRoute({ children }) {
    const savedUser = localStorage.getItem('user')
    
    let harusLoginLagi = false

    if (!savedUser) {
        harusLoginLagi = true
    } else {
        try {
            const userData = JSON.parse(savedUser)
            if (!userData || !userData.token) {
                harusLoginLagi = true
            }
        } catch {
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            harusLoginLagi = true
        }
    }

    if (harusLoginLagi) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute
