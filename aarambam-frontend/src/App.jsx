import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';

// Layout & Security
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register'; // <--- Ensure this file exists

// App Pages
import Dashboard from './pages/Dashboard';
import OfflineWallet from './pages/OfflineWallet';
import ScamShield from './pages/ScamShield';
import FormFiller from './pages/FormFiller';
import CibilScore from './pages/CibilScore';
import PaymentSuccess from './pages/PaymentSuccess';
import ScanPay from './pages/ScanPay';
import SendToMobile from './pages/SendToMobile';
import SendToBank from './pages/SendToBank';
import History from './pages/History';
import BillPayments from './pages/BillPayments';
import Recharge from './pages/Recharge';
import Electricity from './pages/Electricity';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTES (No Login Required) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* <--- Must be here */}

          {/* PROTECTED ROUTES (Login Required) */}
          <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="scan" element={<ScanPay />} />
                <Route path="send-mobile" element={<SendToMobile />} />
                <Route path="send-bank" element={<SendToBank />} />
                <Route path="payment-success" element={<PaymentSuccess />} />
                <Route path="recharge" element={<Recharge />} />
                <Route path="electricity" element={<Electricity />} />
                <Route path="bills" element={<BillPayments />} />
                <Route path="history" element={<History />} />
                <Route path="cibil" element={<CibilScore />} />
                <Route path="wallet" element={<OfflineWallet />} />
                <Route path="shield" element={<ScamShield />} />
                <Route path="form-filler" element={<FormFiller />} />
              </Route>
          </Route>

          {/* Redirects */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;