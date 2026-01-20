
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center shadow-lg shadow-rose-600/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Fala<span className="text-rose-600">Coração</span>
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-sm font-semibold text-slate-600 hover:text-rose-600 transition-colors">Funcionalidades</a>
            <a href="#" className="text-sm font-semibold text-slate-600 hover:text-rose-600 transition-colors">Vozes</a>
            <a href="#" className="text-sm font-semibold text-slate-600 hover:text-rose-600 transition-colors">Assistente</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="text-sm font-semibold text-slate-600 hover:text-rose-600 px-4 py-2">Login</button>
            <button className="text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 px-6 py-2.5 rounded-full transition-all shadow-lg shadow-rose-600/30 active:scale-95">
              Criar Agora
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
