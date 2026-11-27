import {BrowserRouter, Route, Routes} from "react-router"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import Feed from "./features/post/pages/Feed"
import CreatePost from "./features/post/components/CreatePost"
import ProtectedRoute from "./features/auth/components/ProtectedRoute"
import PublicOnlyRoute from "./features/auth/components/PublicOnlyRoute"

function AppRoutes(){
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<ProtectedRoute><Feed/></ProtectedRoute>}/>
            <Route path="/login" element={<PublicOnlyRoute><Login/></PublicOnlyRoute>}/>
            <Route path="/register" element={<PublicOnlyRoute><Register/></PublicOnlyRoute>}/>
            <Route path="create-post" element={<ProtectedRoute><CreatePost/></ProtectedRoute>}/>
        </Routes>

        </BrowserRouter>
    )
}

export default AppRoutes