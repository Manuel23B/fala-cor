
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-rose-600 rounded-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">Fala Coração</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              A dar alma aos seus textos com vozes genuínas e emoções reais. O seu assistente pessoal de narração angolana.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Serviços</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors">Vozes Neurais</a></li>
              <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors">IA Criativa</a></li>
              <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors">API Fala Coração</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Sobre</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors">A Nossa Missão</a></li>
              <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors">Cultura Angolana</a></li>
              <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors">Privacidade</a></li>
              <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors">Termos de Uso</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">© 2024 Fala Coração Assistente. Luanda, Angola.</p>
          <div className="flex gap-8">
            <span className="text-xs font-black text-slate-400 hover:text-rose-600 cursor-pointer">INSTAGRAM</span>
            <span className="text-xs font-black text-slate-400 hover:text-rose-600 cursor-pointer">LINKEDIN</span>
            <span className="text-xs font-black text-slate-400 hover:text-rose-600 cursor-pointer">YOUTUBE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
