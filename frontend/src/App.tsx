import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout/Layout';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { ChangePasswordPage } from './pages/ChangePasswordPage/ChangePasswordPage';
import { LibraryPage } from './pages/LibraryPage/LibraryPage';
import { GameDetailPage } from './pages/GameDetailPage/GameDetailPage';
import { DiaryPage } from './pages/DiaryPage/DiaryPage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { AdminPage } from './pages/AdminPage/AdminPage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { LoadingSpinner } from './components/common/LoadingSpinner';

function AppRoutes() {
  const { user, loading, mustChangePassword, isAdmin } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1b2838',
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (mustChangePassword) {
    return (
      <Routes>
        <Route path="*" element={<ChangePasswordPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/library" replace />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="library/:id" element={<GameDetailPage />} />
        <Route path="diary" element={<DiaryPage />} />
        <Route path="profile" element={<ProfilePage />} />
        {isAdmin && <Route path="settings" element={<SettingsPage />} />}
        {isAdmin && <Route path="admin" element={<AdminPage />} />}
      </Route>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
