import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// pages
import Home from './pages/Home'
import StartCourse from './pages/StartCourse'
import PhoneNUmber from './pages/PhoneNUmber'
import Faq2 from './pages/Faq2'
import AssessmentPage from './pages/AssessmentPage'
import AssessmentFirstPopup from "./pages/AssessmentFirstPopup"
import AssessmentPassedPopup from "./pages/AssessmentPassedPopup"
import AssessmentFailedPopup from "./pages/AssessmentFailedPopup"
import AssessmentTimeUpPopup from './pages/AssessmentTimeUpPopup'
import AssessmentTimeUpCongrats from './pages/AssessmentTimeupCongrats'



// components
import ContactPage from './pages/ContactPage'
import Discoverus from './pages/Discoverus'
import HelpCentre from './pages/HelpCentre'
import FeedbackForm from './components/FeedbackForm'
import FeedbackPopup from './pages/FeedbackPopup'
import Assessment from './components/Assessment'


// admin components
import CourseProgressDetails from './admin/CourseProgressDetails'
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
import ScrollToTop from './components/ScrollToTop'
import UserManagement from './admin/UserManagement'
import OAuthRedirectHandler from './pages/OAuthRedirectHandler'
import AdminManagement from './admin/AdminManagement'
import CourseManagement from './admin/CourseManagement'
import ProgressTracking from './admin/ProgressTracking'
import AddCoursePage from './admin/AddCoursePage'
import Profile from './admin/Profile'
import UserDetails from './admin/UserDetails'
import FormManagement from './admin/FormManagement'
import AdminFeedback from './admin/AdminFeedback'


function App() {
  return (
    <>
      <ScrollToTop />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Routes>
        {/* Layout A */}
        <Route element={<LayoutA />}>
          <Route path='/' element={<Home />} />
          <Route path='/phone-number' element={<OAuthRedirectHandler />} />
          <Route path='/phone-number/enter' element={<PhoneNUmber />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/connect-us' element={<ContactPage />} />
        </Route>

        {/* Layout B */}
        <Route element={<LayoutB />}>
          <Route path='/start-course' element={<OAuthRedirectHandler />} />
          <Route path='/start-course/dashboard' element={<StartCourse />} />
          <Route path='/faq' element={<Faq2 />} />

          {/* Assessment Flow */}
          <Route path='/assessment/start' element={<AssessmentFirstPopup />} />
          <Route path='/assessment/passed' element={<AssessmentPassedPopup />} />
          <Route path='/assessment/failed' element={<AssessmentFailedPopup />} />
          <Route path='/assessment/time-up' element={<AssessmentTimeUpPopup />} />
          <Route path='/assessment/congrats' element={<AssessmentTimeUpCongrats />} />
          <Route path='/assessment/:courseId/:sectionId' element={<Assessment />} />
          <Route path="/assessment/main" element={<Assessment />} />



          {/* Course Routes */}
          <Route path='/course-section' element={<CourseSection />} />
          <Route path='/course-section/:courseId' element={<CourseSection />} />
          <Route path="/courses/:courseId/sections/:sectionId" element={<SectionVideos />} />
          <Route path='/discover-us' element={<Discoverus />} />
          <Route path='/help-centre' element={<HelpCentre />} />
          <Route path='/feedback-course' element={<FeedbackPopup />} />
          <Route path='/feedback-form' element={<FeedbackForm />} />

        </Route>

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Routes */}
        <Route element={<AdminProtectedRoute><LayoutC /></AdminProtectedRoute>}>

          <Route path='/admin/user-management' element={<UserManagement />} />
          <Route path='/admin/user-details/:userId' element={<UserDetails />} />
          <Route path='/admin/form-management' element={<FormManagement />} />

          <Route path='/admin/admin-management' element={<AdminManagement />} />
          <Route path='/admin/course-management' element={<CourseManagement />} />
          <Route path='/admin/progress-tracking' element={<ProgressTracking />} />
          <Route path='/admin/progress-tracking/details' element={<CourseProgressDetails />} />
          <Route path='/admin/add-course' element={<AddCoursePage />} />
          <Route path='/admin/edit-course/:courseId' element={<AddCoursePage />} />
          <Route path='/admin/profile' element={<Profile />} />
          <Route path='/admin/feedback' element={<AdminFeedback />} />


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
