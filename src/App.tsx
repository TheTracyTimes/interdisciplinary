import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AppLayout } from './components/layout/AppLayout'
import { Landing } from './pages/Landing'
import { Shop } from './pages/Shop'
import { GearPage } from './pages/GearPage'
import { PortalPage } from './pages/portal/PortalPage'
import { Community } from './pages/Community'
import { Discover } from './pages/Discover'
import { ClientEntry } from './pages/ClientEntry'
import { ProducerPublicPage } from './pages/ProducerPublicPage'
import { Dashboard } from './pages/app/Dashboard'
import { ProjectsPage } from './pages/app/ProjectsPage'
import { ProjectDetail } from './pages/app/ProjectDetail'
import { FilmPipelinePage } from './pages/app/FilmPipelinePage'
import { MusicPipelinePage } from './pages/app/MusicPipelinePage'
import { ClientsPage } from './pages/app/ClientsPage'
import { ClientProjectsPage } from './pages/app/ClientProjectsPage'
import { SchedulePage } from './pages/app/SchedulePage'
import { InvoicesPage } from './pages/app/InvoicesPage'
import { ContractsPage } from './pages/app/ContractsPage'
import { EquipmentPage } from './pages/app/EquipmentPage'
import { AssetsPage } from './pages/app/AssetsPage'
import { ReferencesPage } from './pages/app/ReferencesPage'
import { LearningPage } from './pages/app/LearningPage'
import { ScriptPage } from './pages/app/ScriptPage'
import { StoryboardPage } from './pages/app/StoryboardPage'
import { ScorePage } from './pages/app/ScorePage'
import { ArrangementPage } from './pages/app/ArrangementPage'
import { ForumPage } from './pages/app/ForumPage'
import { ProfilePage } from './pages/app/ProfilePage'
import { PortfolioPage } from './pages/app/PortfolioPage'
import { PackagesPage } from './pages/app/PackagesPage'
import { MessagesPage } from './pages/app/MessagesPage'
import { BrandPage } from './pages/app/BrandPage'
import { LogsPage } from './pages/app/LogsPage'
import { StoragePage } from './pages/app/StoragePage'
import { ResellMarket } from './pages/ResellMarket'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Shop />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/community" element={<Community />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/resell" element={<ResellMarket />} />
          <Route path="/client" element={<ClientEntry />} />
          <Route path="/p/:handle" element={<ProducerPublicPage />} />
          <Route path="/portal/:token" element={<PortalPage />} />
          <Route path="/gear" element={<GearPage />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="film" element={<FilmPipelinePage />} />
            <Route path="music" element={<MusicPipelinePage />} />
            <Route path="script" element={<ScriptPage />} />
            <Route path="storyboard" element={<StoryboardPage />} />
            <Route path="score" element={<ScorePage />} />
            <Route path="arrangement" element={<ArrangementPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="client-projects" element={<ClientProjectsPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="contracts" element={<ContractsPage />} />
            <Route path="equipment" element={<EquipmentPage />} />
            <Route path="assets" element={<AssetsPage />} />
            <Route path="references" element={<ReferencesPage />} />
            <Route path="learning" element={<LearningPage />} />
            <Route path="forum" element={<ForumPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="brand" element={<BrandPage />} />
            <Route path="storage" element={<StoragePage />} />
            <Route path="logs/inventory" element={<LogsPage type="inventory" />} />
            <Route path="logs/practice" element={<LogsPage type="practice" />} />
            <Route path="logs/archive" element={<LogsPage type="archive" />} />
            <Route path="logs/reference" element={<LogsPage type="reference" />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
