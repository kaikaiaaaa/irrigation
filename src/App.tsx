import type { FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/Home';
import { DeviceDetailPage } from '@/pages/DeviceDetail';
import { AddDevicePage } from '@/pages/AddDevice';
import { SettingsPage } from '@/pages/Settings';

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/device/:id" element={<DeviceDetailPage />} />
          <Route path="/add" element={<AddDevicePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
