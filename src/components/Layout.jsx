import { Dumbbell, Utensils, CalendarDays, UserCircle } from 'lucide-react';
import { lightHaptic } from '../utils/haptics';

/**
 * Glass-Morphism Navigation Layout
 * Floating, blurred navigation dock for a high-performance tactical aesthetic
 */
export default function Layout({ currentView, onChangeView, children }) {
  const isImmersive = ['workout', 'onboarding', 'stealth', 'preview', 'success', 'pr-celebration'].includes(currentView);

  const tabs = [
    { id: 'dashboard', icon: Dumbbell, label: 'TRAIN', views: ['dashboard', 'create'] },
    { id: 'nutrition', icon: Utensils, label: 'EAT', views: ['nutrition'] },
    { id: 'history', icon: CalendarDays, label: 'LOG', views: ['history'] },
    { id: 'profile', icon: UserCircle, label: 'ME', views: ['profile', 'leaderboard', 'skills', 'stats'] },
  ];

  const handleNavClick = (tabId) => {
    lightHaptic();
    onChangeView(tabId);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans flex flex-col selection:bg-yellow-500/30">
      <div className={`flex-1 ${!isImmersive ? 'pb-32' : ''}`}>
        {children}
      </div>

      {/* Glass-Morphism Floating Navigation */}
      {!isImmersive && (
        <nav 
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50"
          aria-label="Main navigation"
        >
          <div className="bg-zinc-900/70 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex justify-between items-center shadow-2xl shadow-black/50">
            {tabs.map((tab) => {
              const isActive = tab.views.includes(currentView);
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleNavClick(tab.id)}
                  className={`
                    relative flex flex-col items-center justify-center w-16 h-12 rounded-full 
                    transition-all duration-300 active:scale-90
                    ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}
                  `}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={tab.label}
                >
                  {/* Active indicator - animated pill background */}
                  {isActive && (
                    <div 
                      className="absolute inset-0 bg-blue-600 rounded-full animate-in zoom-in-75 duration-300 shadow-lg shadow-blue-500/30" 
                    />
                  )}
                  
                  {/* Icon */}
                  <tab.icon 
                    size={20} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className="relative z-10" 
                    aria-hidden 
                  />
                  
                  {/* Label */}
                  <span 
                    className={`
                      relative z-10 text-[8px] font-black uppercase mt-0.5 leading-none
                      tracking-[0.15em]
                      ${isActive ? 'text-white' : 'text-zinc-500'}
                    `}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Subtle glow effect under the nav */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-blue-500/10 blur-2xl rounded-full pointer-events-none" />
        </nav>
      )}
    </div>
  );
}
