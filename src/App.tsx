
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/demo" element={<Demo />} />
            
            {/* Protected routes that require only authentication */}
            <Route 
              path="/hero-profile-setup" 
              element={
                <ProtectedRoute requireAuth>
                  <HeroProfileSetup />
                </ProtectedRoute>
              } 
            />

            {/* Protected routes that require authentication and profile setup */}
            <Route 
              path="/welcome-onboarding" 
              element={
                <ProtectedRoute requireAuth requireProfile>
                  <WelcomeOnboarding />
                </ProtectedRoute>
              } 
            />

            {/* Protected routes that require full setup */}
            <Route 
              path="/hero-profile" 
              element={
                <ProtectedRoute 
                  requireAuth 
                  requireProfile 
                  requireStarterChallenge
                >
                  <HeroProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/explorer-map" 
              element={
                <ProtectedRoute 
                  requireAuth 
                  requireProfile 
                  requireStarterChallenge
                >
                  <ExplorerMap />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quest-challenge" 
              element={
                <ProtectedRoute 
                  requireAuth 
                  requireProfile 
                  requireStarterChallenge
                >
                  <QuestChallenge />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/treasure-trail" 
              element={
                <ProtectedRoute 
                  requireAuth 
                  requireProfile 
                  requireStarterChallenge
                >
                  <TreasureTrail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/games-grotto" 
              element={
                <ProtectedRoute 
                  requireAuth 
                  requireProfile 
                  requireStarterChallenge
                >
                  <GamesGrotto />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quest-chronicle" 
              element={
                <ProtectedRoute 
                  requireAuth 
                  requireProfile 
                  requireStarterChallenge
                >
                  <QuestChronicle />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/explorers-toolkit/*" 
              element={
                <ProtectedRoute 
                  requireAuth 
                  requireProfile 
                  requireStarterChallenge
                >
                  <ExplorersToolkit />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
