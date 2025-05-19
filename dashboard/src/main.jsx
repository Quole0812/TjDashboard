import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

// Import route components
import Home from './routes/home'
import Calendar from './routes/calendar'
import TeacherDirectory from './routes/teacherDir'
import StudentDirectory from './routes/studentDir'
import Courses from './routes/courses'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/calendar',
    element: <Calendar />,
  },
  {
    path: '/teachers',
    element: <TeacherDirectory />,
  },
  {
    path: '/students',
    element: <StudentDirectory />,
  },
  {
    path: '/courses',
    element: <Courses />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
