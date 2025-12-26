import { Route, Routes } from 'react-router-dom'

// pages
import Home from './pages/Home'
import StartCourse from './pages/StartCourse'
import PhoneNUmber from './pages/PhoneNUmber'
import Faq2 from './pages/Faq2'
import AssessmentPage from './pages/AssessmentPage'
// import AssessmentFirstPopup from "./Pages/AssessmentFirstPopup"
import AssessmentPassedPopup from "./pages/AssessmentPassedPopup"
import AssessmentFailedPopup from "./pages/AssessmentFailedPopup"
import AssessmentTimeUpPopup from './pages/AssessmentTimeUpPopup'
import AssessmentTimeUpCongrats from './pages/AssessmentTimeupCongrats'



// admin components
import AdminDashboard from './admin/AdminDashboard'
import AddAdmin from './admin/AddAdmin'
import EditAdmin from "./admin/EditAdmin";
import DeleteAdminPopup from "./admin/DeleteAdminPopup";
import SuspendAdminPopup from "./admin/SuspendAdminPopup";
import AdminLoginPage from './admin/AdminLoginPage';
import AdminProtectedRoute from './components/AdminProtectedRoute';
// background layout
import LayoutA from './components/LayoutA'
import LayoutB from './components/LayoutB'
import LayoutC from './components/LayoutC'  // ✅ Ensure LayoutC is imported
import CourseSection from './pages/CourseSection'
import ShowSections from './components/ShowSections'
import SectionVideos from './pages/SectionVideos'
import AboutPage from './pages/Aboutpage'
import UserManagement from './admin/UserManagement'
import OAuthRedirectHandler from './pages/OAuthRedirectHandler'
import AdminManagement from './admin/AdminManagement'


function App() {
  return (
    <>
      <Routes>
        {/* Layout A */}
        <Route element={<LayoutA />}>
          <Route path='/' element={<Home />} />
          <Route path='/phone-number' element={<OAuthRedirectHandler />} />
          <Route path='/phone-number/enter' element={<PhoneNUmber />} />
          <Route path='/about' element={<AboutPage />} />
        </Route>

        {/* Layout B */}
        <Route element={<LayoutB />}>
          <Route path='/start-course' element={<OAuthRedirectHandler />} />
          <Route path='/start-course/dashboard' element={<StartCourse />} />
          <Route path='/faq' element={<Faq2 />} />

          {/* Assessment Flow */}
          {/* <Route path='/assessment/start' element={<AssessmentFirstPopup />} /> */}
          <Route path='/assessment/passed' element={<AssessmentPassedPopup />} />
          <Route path='/assessment/failed' element={<AssessmentFailedPopup />} />
          <Route path='/assessment/time-up' element={<AssessmentTimeUpPopup />} />
          <Route path='/assessment/congrats' element={<AssessmentTimeUpCongrats />} />
          <Route path='/assessment/:courseId/:sectionId' element={<AssessmentPage />} />


          {/* Course Routes */}
          <Route path='/course-section' element={<CourseSection />} />
          <Route path='/course-section/:courseId' element={<CourseSection />} />
          <Route path="/courses/:courseId/sections/:sectionId" element={<SectionVideos />} />

        </Route>

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Routes */}
        <Route element={<AdminProtectedRoute><LayoutC /></AdminProtectedRoute>}>

          <Route path='/admin/user-management' element={<UserManagement />} />
          <Route path='/admin/admin-management' element={<AdminManagement />} />


          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add" element={<AddAdmin />} />
          <Route path="/admin/edit" element={<EditAdmin />} />
          <Route path="/admin/delete" element={<DeleteAdminPopup />} />
          <Route path="/admin/suspend" element={<SuspendAdminPopup />} />
          {/* Layout C */}
        </Route>
      </Routes>

    </>
  )
}

export default App
