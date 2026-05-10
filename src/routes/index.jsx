import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FullPageSpinner } from '../components/ui/Spinner';

const LoginPage = lazy(() => import('../modules/auth/pages/LoginPage'));
const DashboardDGPage = lazy(() => import('../modules/dashboard/pages/DashboardDGPage'));
const DashboardDAFPage = lazy(() => import('../modules/dashboard/pages/DashboardDAFPage'));
const DashboardCDTPage = lazy(() => import('../modules/dashboard/pages/DashboardCDTPage'));
const ChantiersListPage = lazy(() => import('../modules/chantiers/pages/ChantiersListPage'));
const ChantierDetailPage = lazy(() => import('../modules/chantiers/pages/ChantierDetailPage'));
const ChantierCreatePage = lazy(() => import('../modules/chantiers/pages/ChantierCreatePage'));
const RapportsListPage = lazy(() => import('../modules/rapports/pages/RapportsListPage'));
const RapportNewPage = lazy(() => import('../modules/rapports/pages/RapportNewPage'));
const StockListPage = lazy(() => import('../modules/stock/pages/StockListPage'));
const MouvementsPage = lazy(() => import('../modules/stock/pages/MouvementsPage'));
const AlertesStockPage = lazy(() => import('../modules/stock/pages/AlertesStockPage'));
const DemandesPage = lazy(() => import('../modules/achats/pages/DemandesPage'));
const CommandesPage = lazy(() => import('../modules/achats/pages/CommandesPage'));
const FournisseursPage = lazy(() => import('../modules/achats/pages/FournisseursPage'));
const FinanceDashboardPage = lazy(() => import('../modules/finance/pages/FinanceDashboardPage'));
const DepensesPage = lazy(() => import('../modules/finance/pages/DepensesPage'));
const BudgetsPage = lazy(() => import('../modules/finance/pages/BudgetsPage'));
const FacturesPage = lazy(() => import('../modules/finance/pages/FacturesPage'));
const IncidentsPage = lazy(() => import('../modules/hse/pages/IncidentsPage'));
const InspectionsPage = lazy(() => import('../modules/hse/pages/InspectionsPage'));
const EnginsListPage = lazy(() => import('../modules/engins/pages/EnginsListPage'));
const MaintenancePage = lazy(() => import('../modules/engins/pages/MaintenancePage'));

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

function Guard({ children }) {
  return (
    <ProtectedRoute>
      <Suspense fallback={<FullPageSpinner />}>
        {children}
      </Suspense>
    </ProtectedRoute>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/dashboard/dg" element={<Guard><DashboardDGPage /></Guard>} />
        <Route path="/dashboard/daf" element={<Guard><DashboardDAFPage /></Guard>} />
        <Route path="/dashboard/cdt" element={<Guard><DashboardCDTPage /></Guard>} />

        <Route path="/chantiers" element={<Guard><ChantiersListPage /></Guard>} />
        <Route path="/chantiers/nouveau" element={<Guard><ChantierCreatePage /></Guard>} />
        <Route path="/chantiers/:id" element={<Guard><ChantierDetailPage /></Guard>} />

        <Route path="/rapports" element={<Guard><RapportsListPage /></Guard>} />
        <Route path="/rapports/nouveau" element={<Guard><RapportNewPage /></Guard>} />

        <Route path="/stock" element={<Guard><StockListPage /></Guard>} />
        <Route path="/stock/mouvements" element={<Guard><MouvementsPage /></Guard>} />
        <Route path="/stock/alertes" element={<Guard><AlertesStockPage /></Guard>} />

        <Route path="/achats/demandes" element={<Guard><DemandesPage /></Guard>} />
        <Route path="/achats/commandes" element={<Guard><CommandesPage /></Guard>} />
        <Route path="/achats/fournisseurs" element={<Guard><FournisseursPage /></Guard>} />

        <Route path="/finance" element={<Guard><FinanceDashboardPage /></Guard>} />
        <Route path="/finance/depenses" element={<Guard><DepensesPage /></Guard>} />
        <Route path="/finance/budgets" element={<Guard><BudgetsPage /></Guard>} />
        <Route path="/finance/factures" element={<Guard><FacturesPage /></Guard>} />

        <Route path="/hse/incidents" element={<Guard><IncidentsPage /></Guard>} />
        <Route path="/hse/inspections" element={<Guard><InspectionsPage /></Guard>} />

        <Route path="/engins" element={<Guard><EnginsListPage /></Guard>} />
        <Route path="/engins/maintenance" element={<Guard><MaintenancePage /></Guard>} />

        <Route path="*" element={<Navigate to="/dashboard/dg" replace />} />
      </Routes>
    </Suspense>
  );
}
