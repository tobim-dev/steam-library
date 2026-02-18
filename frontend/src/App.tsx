import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { LibraryPage } from './pages/LibraryPage/LibraryPage';
import { GameDetailPage } from './pages/GameDetailPage/GameDetailPage';
import { DiaryPage } from './pages/DiaryPage/DiaryPage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/library" replace />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="library/:id" element={<GameDetailPage />} />
          <Route path="diary" element={<DiaryPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
