import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './components/AuthContext'
import PrivateRoute from './components/PrivateRoute'

// Import route components
import Home from './routes/home'
import Calendar from './routes/calendar'
import TeacherDirectory from './routes/teacherDir'
import StudentDirectory from './routes/studentDir'
import Courses from './routes/courses'
import ClassPage from './routes/ClassPage'
import Login from './routes/login'
import SignUp from './routes/signUp'
import TeacherDashboardPage from './routes/teacherDash'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/calendar',
    element: <PrivateRoute><Calendar /></PrivateRoute>,
  },
  {
    path: '/teachers',
    element: <PrivateRoute><TeacherDirectory /></PrivateRoute>,
  },
  {
    path: '/students', 
    element: <PrivateRoute><StudentDirectory /></PrivateRoute>,
  },
  {
    path: '/courses',
    element: <PrivateRoute><Courses /></PrivateRoute>,
  },
  {
    path: '/courses/:id',
    element: <PrivateRoute><ClassPage /></PrivateRoute>,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/teacherDash/:id',
    element: <PrivateRoute><TeacherDashboardPage /></PrivateRoute>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
