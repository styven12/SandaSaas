import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from '../components/layout/DashboardLayout';

// Public & Portal Pages
import LandingPage from '../features/landing/pages/LandingPage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import CaptivePortalPage from '../features/portal/pages/CaptivePortalPage';

// Protected Dashboard Pages
import OverviewPage from '../features/dashboard/pages/OverviewPage';
import ZonesPage from '../features/zones/pages/ZonesPage';
import StockPage from '../features/stock/pages/StockPage';
import FinancePage from '../features/finance/pages/FinancePage';
import SmsStorePage from '../features/sms/pages/SmsStorePage';
import LegalLogsPage from '../features/logs/pages/LegalLogsPage';
import SupportPage from '../features/support/pages/SupportPage';
import SettingsPage from '../features/settings/pages/SettingsPage';

// Guard
import ProtectedRoute from '../components/common/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Routes Publics */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Portail Captif Client (Mobile First) */}
      <Route path="/portal/:slug" element={<CaptivePortalPage />} />

      {/* Routes Privées du Dashboard Gérant */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="zones" element={<ZonesPage />} />
          <Route path="stock" element={<StockPage />} />
          <Route path="finance" element={<FinancePage />} />
          <Route path="sms" element={<SmsStorePage />} />
          <Route path="logs" element={<LegalLogsPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Redirection 404 par défaut */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}