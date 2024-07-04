import { Route, Routes } from "react-router-dom"
import HomePage from "./components/HomePage"
import SignUpForm from "./auth/UserRegister"
import SignInForm from "./auth/SignInForm"
import AdminPanel from "./admin/AdminPanel"
import RootLayout from "./layout/RootLayout"
import VerifyEmployee from "./admin/VerifyEmployee"
import AdminRoute from "./admin/AdminRoute.jsx"
import AddResource from "./admin/AddResource"
import SeeAllResource from "./admin/SeeAllResource"

function App() {
 
  return (
    <>
    <Routes>
      <Route path="/" element={<RootLayout/>}>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/signup" element={<SignUpForm/>}/>
      <Route path="/login" element={<SignInForm/>}/>
      <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/verifyemployee" 
            element={
              <AdminRoute>
                <VerifyEmployee />
              </AdminRoute>
            } 
          />
           <Route 
            path="/admin/add-resource" 
            element={
              <AdminRoute>
                <AddResource/> 
              </AdminRoute>
            } 
          />
           <Route 
            path="/admin/allresources" 
            element={
              <AdminRoute>
                <SeeAllResource/> 
              </AdminRoute>
            } 
          />
      </Route>
    </Routes>
    </>
   
  )
}

export default App
