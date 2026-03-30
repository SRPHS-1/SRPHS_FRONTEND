import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3a18] via-[#2D5A27] to-[#4a7a3d] flex items-center justify-center overflow-hidden relative">

      {/* Background dots */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots404" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="1.5" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots404)" />
      </svg>

      {/* Heartbeat line */}
      <svg className="absolute bottom-10 left-0 w-full opacity-15" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <polyline
          points="0,40 300,40 360,40 390,8 420,72 450,20 480,60 510,40 800,40 860,40 890,5 920,75 950,18 980,62 1010,40 1440,40"
          fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round"
        />
      </svg>

      <div className="relative z-10 text-center px-8 max-w-lg">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-sm rounded-3xl mb-8 border border-white/20">
          <Heart size={44} className="text-white/80" />
        </div>

        {/* 404 */}
        <div className="text-[120px] font-black text-white/20 leading-none select-none mb-2">
          404
        </div>

        <h1 className="text-2xl font-black text-white mb-3">
          Página no encontrada
        </h1>
        <p className="text-green-200/70 text-sm mb-10 leading-relaxed">
          Esta ruta no existe en el sistema.<br />
          Regresa al inicio para continuar cuidando tu salud.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3.5 bg-white text-[#2D5A27] font-black text-sm rounded-2xl hover:-translate-y-0.5 hover:shadow-xl transition-all cursor-pointer"
          >
            Ir al inicio
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3.5 bg-white/10 text-white font-black text-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};