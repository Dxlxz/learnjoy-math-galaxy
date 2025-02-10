
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import RequireAuth from "./components/auth/RequireAuth";
import PublicOnly from "./components/auth/PublicOnly";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PasswordReset from "./pages/PasswordReset";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";
import HeroProfile from "./pages/HeroProfile";
import ExplorerMap from "./pages/ExplorerMap";
import QuestChallenge from "./pages/QuestChallenge";
import TreasureTrail from "./pages/TreasureTrail";
import HeroProfileSetup from "./pages/HeroProfileSetup";
import WelcomeOnboarding from "./pages/WelcomeOnboarding";
import GamesGrotto from "./pages/GamesGrotto";
import QuestChronicle from "./pages/QuestChronicle";
import ExplorersToolkit from "./pages/ExplorersToolkit";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <BrowserRouter>
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/demo" element={<Demo />} />
            
            {/* Auth routes - only accessible when NOT authenticated */}
            <Route path="/register" element={
              <PublicOnly>
                <Register />
              </PublicOnly>
            } />
            <Route path="/login" element={
              <PublicOnly>
                <Login />
              </PublicOnly>
            } />
            <Route path="/password-reset" element={
              <PublicOnly>
                <PasswordReset />
              </PublicOnly>
            } />

            {/* Protected routes - only accessible when authenticated */}
            <Route path="/hero-profile" element={
              <RequireAuth>
                <HeroProfile />
              </RequireAuth>
            } />
            <Route path="/explorer-map" element={
              <RequireAuth>
                <ExplorerMap />
              </RequireAuth>
            } />
            <Route path="/quest-challenge" element={
              <RequireAuth>
                <QuestChallenge />
              </RequireAuth>
            } />
            <Route path="/treasure-trail" element={
              <RequireAuth>
                <TreasureTrail />
              </RequireAuth>
            } />
            <Route path="/hero-profile-setup" element={
              <RequireAuth>
                <HeroProfileSetup />
              </RequireAuth>
            } />
            <Route path="/welcome-onboarding" element={
              <RequireAuth>
                <WelcomeOnboarding />
              </RequireAuth>
            } />
            <Route path="/games-grotto" element={
              <RequireAuth>
                <GamesGrotto />
              </RequireAuth>
            } />
            <Route path="/quest-chronicle" element={
              <RequireAuth>
                <QuestChronicle />
              </RequireAuth>
            } />
            <Route path="/explorers-toolkit/*" element={
              <RequireAuth>
                <ExplorersToolkit />
              </RequireAuth>
            } />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </TooltipProvider>
  </BrowserRouter>
);

export default App;
