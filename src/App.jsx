import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import TaskByClassPage from './pages/TaskByClassPage';
import ClassPage from './pages/ClassPage';
import ProtetedRoutes from './components/ProtetedRoutes';
import { TaskProvider } from './context/TasksContext';
import { ClassProvider } from './context/ClassContext';
import { PostProvider } from './context/PostContext';
import NavBar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import GamesPage from './pages/GamesPage';
import MemoryGame from './games/MemoryGame';
import ProfilePage from './pages/AccountSettingsPage';
import TaskPage from './pages/TaskPage';
import CommentsPage from './pages/CommentsPage';

function App() {
  return (
    <AuthProvider>
      <ClassProvider>
        <PostProvider>
          <TaskProvider>
            <BrowserRouter>
              <main className="container min-w-full min-h-[100vh] dark:bg-[#1a1a1a]">
                <NavBar />
                <div className='pt-[65px]'>
                  <Routes>
                    <Route path="/games" element={<GamesPage />} />
                    <Route path="/games/memory" element={<MemoryGame />} />
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route element={<ProtetedRoutes />}>
                      <Route path="/home" element={<HomePage />} />
                      <Route path="/:classId/tasks" element={<TaskByClassPage />} />
                      <Route path="/classes" element={<ClassPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/:classId/task/:taskId" element={<TaskPage />} />
                      <Route path="/:classId/task/post/:commentId" element={<CommentsPage />} />
                    </Route>
                  </Routes>
                </div>
              </main>
            </BrowserRouter>
          </TaskProvider>
        </PostProvider>
      </ClassProvider>
    </AuthProvider>
  );
}

export default App;
