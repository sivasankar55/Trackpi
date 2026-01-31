import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from './components/LoadingSpinner';
import ScrollToTop from './components/ScrollToTop';

// pages
const Home = lazy(() => import('./pages/Home'));
const StartCourse = lazy(() => import('./pages/StartCourse'));
const PhoneNUmber = lazy(() => import('./pages/PhoneNUmber'));
const Faq2 = lazy(() => import('./pages/Faq2'));
const AssessmentPage = lazy(() => import('./pages/AssessmentPage'));
const AssessmentFirstPopup = lazy(() => import('./pages/AssessmentFirstPopup'));
const AssessmentPassedPopup = lazy(() => import('./pages/AssessmentPassedPopup'));
const AssessmentFailedPopup = lazy(() => import('./pages/AssessmentFailedPopup'));
const AssessmentTimeUpPopup = lazy(() => import('./pages/AssessmentTimeUpPopup'));
const AssessmentTimeUpCongrats = lazy(() => import('./pages/AssessmentTimeUpCongrats'));

// components
const ContactPage = lazy(() => import('./pages/ContactPage'));
const Discoverus = lazy(() => import('./pages/Discoverus'));
const HelpCentre = lazy(() => import('./pages/HelpCentre'));
const FeedbackForm = lazy(() => import('./components/FeedbackForm'));
const FeedbackPopup = lazy(() => import('./pages/FeedbackPopup'));
const Assessment = lazy(() => import('./components/Assessment'));
const CourseCompletionPopup = lazy(() => import('./components/CourseCompletionPopup'));

// admin components
const CourseProgressDetails = lazy(() => import('./admin/CourseProgressDetails'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AddAdmin = lazy(() => import('./admin/AddAdmin'));
const EditAdmin = lazy(() => import('./admin/EditAdmin'));
const DeleteAdminPopup = lazy(() => import('./admin/DeleteAdminPopup'));
const SuspendAdminPopup = lazy(() => import('./admin/SuspendAdminPopup'));
const AdminLoginPage = lazy(() => import('./admin/AdminLoginPage'));
const AdminProtectedRoute = lazy(() => import('./components/AdminProtectedRoute'));

// background layout
const LayoutA = lazy(() => import('./components/LayoutA'));
const LayoutB = lazy(() => import('./components/LayoutB'));
const LayoutC = lazy(() => import('./components/LayoutC'));
const CourseSection = lazy(() => import('./pages/CourseSection'));
const SectionVideos = lazy(() => import('./pages/SectionVideos'));
const AboutPage = lazy(() => import('./pages/Aboutpage'));
const UserManagement = lazy(() => import('./admin/UserManagement'));
const OAuthRedirectHandler = lazy(() => import('./pages/OAuthRedirectHandler'));
const AdminManagement = lazy(() => import('./admin/AdminManagement'));
const CourseManagement = lazy(() => import('./admin/CourseManagement'));
const ProgressTracking = lazy(() => import('./admin/ProgressTracking'));
const AddCoursePage = lazy(() => import('./admin/AddCoursePage'));
const Profile = lazy(() => import('./admin/Profile'));
const UserDetails = lazy(() => import('./admin/UserDetails'));
const FormManagement = lazy(() => import('./admin/FormManagement'));
const AdminFeedback = lazy(() => import('./admin/AdminFeedback'));

function App() {
  return (
    <>
      <ScrollToTop />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Suspense fallback={<LoadingSpinner />}>
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
            <Route path='/test-popup' element={<CourseCompletionPopup />} />

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
      </Suspense>
    </>
  )
}

export default App
