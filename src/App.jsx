// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ChatPage from './components/ChatPage';
import ProfilePage from './components/ProfilePage';
import HistoryPage from './components/HistoryPage';
import ProtectedRoute from './components/ProtectedRoute';
import AuthLayout from './components/AuthLayout';
import MainLayout from './components/MainLayout'; // Importă noul layout

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Routes with Sidebar Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<ChatPage />} />
          <Route path="/chat/:conversationId" element={<ChatPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Public Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;