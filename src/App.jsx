import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import TaskPage from './pages/TaskPage';
import ClassPage from './pages/ClassPage';
import TaskFormPage from './pages/TaskFormPage';
import ProfilePage from './pages/ProfilePage';
import ProtetedRoutes from './components/ProtetedRoutes';
import { TaskProvider } from './context/TasksContext';
import { ClassProvider } from './context/ClassContext';
import NavBar from './components/Navbar';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <AuthProvider>
      <ClassProvider>
        <TaskProvider>
          <BrowserRouter>
            <main className="container min-w-full">
              <NavBar />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route element={<ProtetedRoutes />}>
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/tasks" element={<TaskPage />} />
                  <Route path="/classes" element={<ClassPage />} />
                  <Route path="/tasks/new" element={<TaskFormPage />} />
                  <Route path="/tasks/:id" element={<TaskFormPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
              </Routes>
            </main>
          </BrowserRouter>
        </TaskProvider>
      </ClassProvider>
    </AuthProvider>
  );
}

export default App;
