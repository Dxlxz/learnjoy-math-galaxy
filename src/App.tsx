
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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
            {/* All routes are now public */}
            <Route path="/" element={<Index />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/hero-profile" element={<HeroProfile />} />
            <Route path="/explorer-map" element={<ExplorerMap />} />
            <Route path="/quest-challenge" element={<QuestChallenge />} />
            <Route path="/treasure-trail" element={<TreasureTrail />} />
            <Route path="/hero-profile-setup" element={<HeroProfileSetup />} />
            <Route path="/welcome-onboarding" element={<WelcomeOnboarding />} />
            <Route path="/games-grotto" element={<GamesGrotto />} />
            <Route path="/quest-chronicle" element={<QuestChronicle />} />
            <Route path="/explorers-toolkit/*" element={<ExplorersToolkit />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </TooltipProvider>
  </BrowserRouter>
);

export default App;
