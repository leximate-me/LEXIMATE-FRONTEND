import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '../src/context/AuthContext'; // Asegúrate de importar correctamente
import { WebSocketProvider } from './context/WebSocketContext';
import { ChatProvider } from './context/ChatContext';
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
import { ToolProvider } from './context/ToolContext';
import ModalVerification from './components/ui/ModalVerification';
import ChatWindow from './components/chat/ChatWindow';

function AppContent() {
  const { user } = useAuth();

  return (
    <div>
      <NavBar />
      <main className="w-full min-h-screen bg-[#fff9d8] dark:bg-[#1a1a1a]">
        <div className="pt-[80px]">
          {/* {user && !user.verify && <ModalVerification />} */}
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
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <ChatProvider>
          <ClassProvider>
            <PostProvider>
              <TaskProvider>
                <ToolProvider>
                  <HashRouter>
                    <AppContent />
                  </HashRouter>
                </ToolProvider>
              </TaskProvider>
            </PostProvider>
          </ClassProvider>
        </ChatProvider>
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;

