import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./components/AuthPage";
import { Dashboard } from "./components/Dashboard";
import { BudgetTracker } from "./components/BudgetTracker";
import { TaskManager } from "./components/TaskManager";
import { PunctualityLog } from "./components/PunctualityLog";
import { ProfileSettings } from "./components/ProfileSettings";
import EventDemo from "./components/EventDemo";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";

type AppState = 'landing' | 'auth' | 'app' | 'event-demo';
type CurrentPage = 'dashboard' | 'budget' | 'tasks' | 'punctuality' | 'profile';

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [currentPage, setCurrentPage] = useState<CurrentPage>('dashboard');

  const handleAuthStart = () => {
    setAppState('auth');
  };

  const handleLogin = () => {
    setAppState('app');
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setAppState('landing');
    setCurrentPage('dashboard');
  };

  const handleBackToLanding = () => {
    setAppState('landing');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'budget':
        return <BudgetTracker />;
      case 'tasks':
        return <TaskManager />;
      case 'punctuality':
        return <PunctualityLog />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return <Dashboard />;
    }
  };

  if (appState === 'landing') {
    return <LandingPage onAuth={handleAuthStart} onEventDemo={() => setAppState('event-demo')} />;
  }

  if (appState === 'auth') {
    return <AuthPage onLogin={handleLogin} onBack={handleBackToLanding} />;
  }

  if (appState === 'event-demo') {
    return <EventDemo />;
  }

  // Main App Layout
  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
        onLogout={handleLogout}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <div className="flex items-center">
          {/* Mobile Sidebar Trigger */}
          <div className="md:hidden p-4">
            <Sidebar 
              currentPage={currentPage} 
              onPageChange={setCurrentPage} 
              onLogout={handleLogout}
              isMobile={true}
            />
          </div>
          
          {/* Top Nav */}
          <div className="flex-1">
            <TopNav 
              currentPage={currentPage} 
              onPageChange={setCurrentPage} 
              onLogout={handleLogout}
            />
          </div>
        </div>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}