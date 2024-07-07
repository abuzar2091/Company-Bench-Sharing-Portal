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
import UpdateResource from "./admin/UpdateResource"
import MyProfile from "./components/MyProfile"
import PageNotFound from "./share/PageNotFound"
import BookedByUser from "./admin/BookedByUser"
import CompanyID from "./share/CompanyID"

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<RootLayout/>}>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/signup" element={<SignUpForm/>}/>
      <Route path="/login" element={<SignInForm/>}/>
      <Route path="/my-profile" element={<MyProfile/>}/>
      <Route path="/company-id" element={<CompanyID/>}/>
      <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } 
          />
           <Route 
            path="/admin/booked-resources-by-user" 
            element={
              <AdminRoute>
                <BookedByUser/>
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
            path="/admin/update-resource" 
            element={
              <AdminRoute>
                <UpdateResource/> 
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
      <Route path="*" element={<PageNotFound/>} />    
      </Route>
    </Routes>
    </>
  )
}

export default App
