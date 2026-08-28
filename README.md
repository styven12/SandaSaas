wifisanda-frontend/
├── public/
│   ├── favicon.ico
│   └── assets/
│       └── images/                   # Logos, illustrations
├── src/
│   ├── assets/                       # Visuels importés dans les composants (SVG, PNG)
│   ├── components/                   # UI Globale & Réutilisable
│   │   ├── ui/                       # Composants atomiques
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Badge.jsx
│   │   │   └── Card.jsx
│   │   ├── layout/                   # Layouts de l'application
│   │   │   ├── LandingLayout.jsx     # Header + Footer du site public
│   │   │   ├── DashboardLayout.jsx   # Frame globale Gérant (Sidebar + Topbar)
│   │   │   ├── Sidebar.jsx           # Menu latéral de navigation
│   │   │   └── Topbar.jsx            # Barre supérieure (Profil, Sélecteur de zone)
│   │   └── common/                   # Utilitaires visuels et gardes
│   │       ├── ProtectedRoute.jsx    # Protection des accès JWT
│   │       ├── LoadingSpinner.jsx
│   │       └── ToastNotification.jsx
│   ├── config/
│   │   └── constants.js              # Variables de configuration globale
│   ├── context/
│   │   ├── AuthContext.jsx           # État d'authentification global
│   │   └── ZoneContext.jsx           # Zone WiFi actuellement sélectionnée
│   ├── features/                     # MODULES MÉTIERS (Feature-First)
│   │   ├── landing/                  # Site public vitrine
│   │   │   ├── components/
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   ├── FeaturesGrid.jsx
│   │   │   │   └── PricingTable.jsx
│   │   │   └── pages/
│   │   │       └── LandingPage.jsx
│   │   ├── auth/                     # Authentification Gérants
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   └── pages/
│   │   │       ├── LoginPage.jsx
│   │   │       └── RegisterPage.jsx
│   │   ├── dashboard/                # Aperçu & Statistiques
│   │   │   ├── components/
│   │   │   │   ├── KpiCards.jsx
│   │   │   │   ├── SalesChart.jsx
│   │   │   │   └── RecentTransactions.jsx
│   │   │   └── pages/
│   │   │       └── OverviewPage.jsx
│   │   ├── zones/                    # Gestion des Bornes & Forfaits
│   │   │   ├── components/
│   │   │   │   ├── ZoneCard.jsx
│   │   │   │   ├── CreateZoneModal.jsx
│   │   │   │   └── PlanForm.jsx
│   │   │   └── pages/
│   │   │       └── ZonesPage.jsx
│   │   ├── stock/                    # Gestion du Stock de Tickets CSV
│   │   │   ├── components/
│   │   │   │   ├── CsvUploader.jsx
│   │   │   │   └── StockTable.jsx
│   │   │   └── pages/
│   │   │       └── StockPage.jsx
│   │   ├── portal/                   # Portail Captif Mobile (Client final)
│   │   │   ├── components/
│   │   │   │   ├── PlanSelector.jsx
│   │   │   │   ├── OtpVerification.jsx
│   │   │   │   └── TicketDisplay.jsx
│   │   │   └── pages/
│   │   │       └── CaptivePortalPage.jsx
│   │   ├── finance/                  # Solde & Retraits Mobile Money
│   │   │   ├── components/
│   │   │   │   ├── BalanceCard.jsx
│   │   │   │   ├── PayoutModal.jsx
│   │   │   │   └── PayoutsHistoryTable.jsx
│   │   │   └── pages/
│   │   │       └── FinancePage.jsx
│   │   ├── sms/                      # Achat de Crédits SMS OTP
│   │   │   ├── components/
│   │   │   │   ├── SmsPackCard.jsx
│   │   │   │   └── OtpLogsTable.jsx
│   │   │   └── pages/
│   │   │       └── SmsStorePage.jsx
│   │   ├── logs/                     # Registre Légal des Connexions
│   │   │   ├── components/
│   │   │   │   ├── ConnectionLogsTable.jsx
│   │   │   │   └── ExportCsvButton.jsx
│   │   │   └── pages/
│   │   │       └── LegalLogsPage.jsx
│   │   ├── support/                  # System de Tickets Support Client
│   │   │   ├── components/
│   │   │   │   ├── TicketList.jsx
│   │   │   │   ├── CreateTicketModal.jsx
│   │   │   │   └── ChatWindow.jsx
│   │   │   └── pages/
│   │   │       └── SupportPage.jsx
│   │   └── settings/                 # Profil Gérant & Configurations
│   │       └── pages/
│   │           └── SettingsPage.jsx
│   ├── hooks/                        # Custom Hooks React
│   │   ├── useFetch.js
│   │   ├── useZone.js
│   │   └── useAuth.js
│   ├── routes/                       # Configuration React Router
│   │   └── AppRoutes.jsx
│   ├── services/                     # Clients HTTP / Calls Backend
│   │   ├── api.js                    # Instance Axios avec Token JWT
│   │   ├── authService.js
│   │   ├── zoneService.js
│   │   ├── stockService.js
│   │   ├── paymentService.js
│   │   ├── financeService.js
│   │   ├── smsService.js
│   │   ├── logsService.js
│   │   └── supportService.js
│   ├── App.jsx                       # Racine de l'application
│   ├── main.jsx                      # Point d'entrée Vite
│   └── index.css                     # Directives Tailwind & styles globaux
├── .env                              # VITE_API_BASE_URL=https://wifisanda-saas-api.onrender.com
├── .env.example
├── package.json
├── tailwind.config.js
└── vite.config.js