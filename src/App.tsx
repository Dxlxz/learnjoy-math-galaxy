
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/hero-profile" element={<HeroProfile />} />
            <Route path="/explorer-map" element={<ExplorerMap />} />
            <Route path="/quest-challenge" element={<QuestChallenge />} />
            <Route path="/treasure-trail" element={<TreasureTrail />} />
            <Route path="/hero-profile-setup" element={<HeroProfileSetup />} />
            <Route path="/welcome-onboarding" element={<WelcomeOnboarding />} />
            <Route path="/games-grotto" element={<GamesGrotto />} />
            <Route path="/quest-chronicle" element={<QuestChronicle />} />
            <Route path="/explorers-toolkit/*" element={<ExplorersToolkit />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

