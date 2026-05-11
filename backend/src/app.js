const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const errorHandler = require('./middleware/errorHandler');

const authRoutes          = require('./routes/auth.routes');
const chantiersRoutes     = require('./routes/chantiers.routes');
const rapportsRoutes      = require('./routes/rapports.routes');
const achatsRoutes        = require('./routes/achats.routes');
const stockRoutes         = require('./routes/stock.routes');
const financeRoutes       = require('./routes/finance.routes');
const enginsRoutes        = require('./routes/engins.routes');
const hseRoutes           = require('./routes/hse.routes');
const notificationsRoutes = require('./routes/notifications.routes');

const app = express();

// ─── Security & parsing ───────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health check ─────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok', ts: new Date() }));

// ─── API routes ───────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/chantiers',     chantiersRoutes);
app.use('/api/rapports',      rapportsRoutes);
app.use('/api/achats',        achatsRoutes);
app.use('/api/stock',         stockRoutes);
app.use('/api/finance',       financeRoutes);
app.use('/api/engins',        enginsRoutes);
app.use('/api/hse',           hseRoutes);
app.use('/api/notifications', notificationsRoutes);

// ─── 404 ──────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: 'Route introuvable' }));

// ─── Global error handler ─────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
