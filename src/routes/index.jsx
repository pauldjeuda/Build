import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShieldOff, ArrowLeft } from 'lucide-react';
import { FullPageSpinner } from '../components/ui/Spinner';
import { can, getDashboardPath } from '../utils/permissions';

// ─── Pages ─────────────────────────────────────────────────────────────────
const LoginPage           = lazy(() => import('../modules/auth/pages/LoginPage'));
const DashboardDGPage     = lazy(() => import('../modules/dashboard/pages/DashboardDGPage'));
const DashboardDAFPage    = lazy(() => import('../modules/dashboard/pages/DashboardDAFPage'));
const DashboardCDTPage    = lazy(() => import('../modules/dashboard/pages/DashboardCDTPage'));
const DashboardCDCPage    = lazy(() => import('../modules/dashboard/pages/DashboardCDCPage'));
const DashboardGSTPage    = lazy(() => import('../modules/dashboard/pages/DashboardGSTPage'));
const DashboardLOGPage    = lazy(() => import('../modules/dashboard/pages/DashboardLOGPage'));
const DashboardHSEPage    = lazy(() => import('../modules/dashboard/pages/DashboardHSEPage'));
const ChantiersListPage   = lazy(() => import('../modules/chantiers/pages/ChantiersListPage'));
const ChantierDetailPage  = lazy(() => import('../modules/chantiers/pages/ChantierDetailPage'));
const ChantierCreatePage  = lazy(() => import('../modules/chantiers/pages/ChantierCreatePage'));
const RapportsListPage    = lazy(() => import('../modules/rapports/pages/RapportsListPage'));
const RapportNewPage      = lazy(() => import('../modules/rapports/pages/RapportNewPage'));
const StockListPage       = lazy(() => import('../modules/stock/pages/StockListPage'));
const MouvementsPage      = lazy(() => import('../modules/stock/pages/MouvementsPage'));
const AlertesStockPage    = lazy(() => import('../modules/stock/pages/AlertesStockPage'));
const DemandesPage        = lazy(() => import('../modules/achats/pages/DemandesPage'));
const CommandesPage       = lazy(() => import('../modules/achats/pages/CommandesPage'));
const FournisseursPage    = lazy(() => import('../modules/achats/pages/FournisseursPage'));
const FinanceDashboardPage= lazy(() => import('../modules/finance/pages/FinanceDashboardPage'));
const DepensesPage        = lazy(() => import('../modules/finance/pages/DepensesPage'));
const BudgetsPage         = lazy(() => import('../modules/finance/pages/BudgetsPage'));
const FacturesPage        = lazy(() => import('../modules/finance/pages/FacturesPage'));
const IncidentsPage       = lazy(() => import('../modules/hse/pages/IncidentsPage'));
const InspectionsPage     = lazy(() => import('../modules/hse/pages/InspectionsPage'));
const EnginsListPage      = lazy(() => import('../modules/engins/pages/EnginsListPage'));
const MaintenancePage     = lazy(() => import('../modules/engins/pages/MaintenancePage'));

// ─── Page accès refusé (§36 états frontend : "accès refusé") ───────────────
function AccessDenied() {
  const navigate = useNavigate();
  const role = useSelector((s) => s.auth.user?.role);
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <ShieldOff size={28} className="text-red-500" />
        </div>
        <h2 className="font-display text-xl font-bold text-obsidian-900 mb-2">Accès refusé</h2>
        <p className="font-sans text-sm text-obsidian-500 mb-6">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <button
          onClick={() => navigate(getDashboardPath(role))}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-display font-semibold text-sm rounded-xl hover:bg-primary-700 transition-colors"
        >
          <ArrowLeft size={15} /> Retour à mon tableau de bord
        </button>
      </div>
    </div>
  );
}

// ─── Redirect intelligent vers le dashboard du rôle ────────────────────────
function SmartRedirect() {
  const role = useSelector((s) => s.auth.user?.role);
  return <Navigate to={getDashboardPath(role)} replace />;
}

// ─── Guard : vérifie auth + permission ─────────────────────────────────────
function Guard({ children, permission }) {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (permission && !can(user?.role, permission)) return <AccessDenied />;
  return (
    <Suspense fallback={<FullPageSpinner />}>
      {children}
    </Suspense>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<LoginPage />} />

        {/* ── Dashboards — chaque rôle a le sien (§13-19) ── */}
        <Route path="/dashboard/dg"  element={<Guard permission="view_dashboard_dg"><DashboardDGPage /></Guard>} />
        <Route path="/dashboard/daf" element={<Guard permission="view_dashboard_daf"><DashboardDAFPage /></Guard>} />
        <Route path="/dashboard/cdt" element={<Guard permission="view_dashboard_cdt"><DashboardCDTPage /></Guard>} />
        <Route path="/dashboard/cdc" element={<Guard permission="view_dashboard_cdc"><DashboardCDCPage /></Guard>} />
        <Route path="/dashboard/gst" element={<Guard permission="view_dashboard_gst"><DashboardGSTPage /></Guard>} />
        <Route path="/dashboard/log" element={<Guard permission="view_dashboard_log"><DashboardLOGPage /></Guard>} />
        <Route path="/dashboard/hse" element={<Guard permission="view_dashboard_hse"><DashboardHSEPage /></Guard>} />

        {/* ── Chantiers (§42 : DG✓ DAF✓ CDT(ses) CDC(ses) GST(partiel) LOG(partiel) HSE✓) ── */}
        <Route path="/chantiers"
          element={<Guard permission="view_all_chantiers"><ChantiersListPage /></Guard>}
        />
        {/* CDC/CDT/GST/LOG voient leur liste via le même composant mais avec filtrage interne */}
        <Route path="/chantiers/mes"
          element={<Guard permission="view_own_chantiers"><ChantiersListPage /></Guard>}
        />
        <Route path="/chantiers/nouveau"
          element={<Guard permission="create_chantier"><ChantierCreatePage /></Guard>}
        />
        <Route path="/chantiers/:id"
          element={<Guard><ChantierDetailPage /></Guard>}
        />

        {/* ── Rapports (CDC crée, CDT valide) ── */}
        <Route path="/rapports"
          element={<Guard permission="view_rapports"><RapportsListPage /></Guard>}
        />
        <Route path="/rapports/nouveau"
          element={<Guard permission="create_rapport"><RapportNewPage /></Guard>}
        />

        {/* ── Stock ── */}
        <Route path="/stock"          element={<Guard permission="view_stock"><StockListPage /></Guard>} />
        <Route path="/stock/mouvements" element={<Guard permission="view_stock"><MouvementsPage /></Guard>} />
        <Route path="/stock/alertes"    element={<Guard permission="view_stock"><AlertesStockPage /></Guard>} />

        {/* ── Achats ── */}
        <Route path="/achats/demandes"
          element={<Guard permission="view_achats"><DemandesPage /></Guard>}
        />
        <Route path="/achats/commandes"
          element={<Guard permission="view_commandes"><CommandesPage /></Guard>}
        />
        <Route path="/achats/fournisseurs"
          element={<Guard permission="view_fournisseurs"><FournisseursPage /></Guard>}
        />

        {/* ── Finance (DG complet, DAF complet, CDT partiel) ── */}
        <Route path="/finance"
          element={<Guard><FinanceDashboardPage /></Guard>}
        />
        <Route path="/finance/depenses"
          element={<Guard><DepensesPage /></Guard>}
        />
        <Route path="/finance/budgets"
          element={<Guard><BudgetsPage /></Guard>}
        />
        <Route path="/finance/factures"
          element={<Guard permission="view_finance_full"><FacturesPage /></Guard>}
        />

        {/* ── HSE ── */}
        <Route path="/hse/incidents"
          element={<Guard permission="view_incidents"><IncidentsPage /></Guard>}
        />
        <Route path="/hse/inspections"
          element={<Guard permission="view_inspections"><InspectionsPage /></Guard>}
        />

        {/* ── Engins ── */}
        <Route path="/engins"
          element={<Guard permission="view_engins"><EnginsListPage /></Guard>}
        />
        <Route path="/engins/maintenance"
          element={<Guard permission="view_engins"><MaintenancePage /></Guard>}
        />

        {/* Fallback — redirige vers le dashboard du rôle */}
        <Route path="*" element={<SmartRedirect />} />
      </Routes>
    </Suspense>
  );
}
