import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Heart } from 'lucide-react';
import { loginUser, googleLogin } from '../services/api';
import { toast } from './Toast';

interface GooglePayload {
  email: string;
  name: string;
  picture: string;
}

const HealthBackground = () => (
  <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#1a3a18] via-[#2D5A27] to-[#4a7a3d]">
    {/* Círculos decorativos */}
    <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
    <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#4a7a3d]/30 blur-3xl" />

    {/* SVG Pattern */}
    <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="health-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="1.5" fill="white" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#health-grid)" />
    </svg>

    {/* Línea de ritmo cardíaco decorativa */}
    <svg
      className="absolute bottom-16 left-0 w-full opacity-20"
      viewBox="0 0 1440 120"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <polyline
        points="0,60 200,60 260,60 290,10 320,110 350,30 380,90 410,60 600,60 660,60 690,5 720,115 750,25 780,95 810,60 1000,60 1060,60 1090,15 1120,105 1150,35 1180,85 1210,60 1440,60"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>

    {/* Iconos flotantes decorativos */}
    {[
      { icon: '🫀', top: '12%', left: '8%',  size: 'text-4xl', delay: '0s',   duration: '6s'  },
      { icon: '🥗', top: '20%', right: '10%', size: 'text-3xl', delay: '1s',   duration: '8s'  },
      { icon: '🏃', top: '65%', left: '5%',  size: 'text-3xl', delay: '2s',   duration: '7s'  },
      { icon: '💧', top: '75%', right: '8%', size: 'text-2xl', delay: '0.5s', duration: '9s'  },
      { icon: '🍎', top: '40%', left: '12%', size: 'text-2xl', delay: '3s',   duration: '6.5s'},
      { icon: '⚕️', top: '30%', right: '6%', size: 'text-3xl', delay: '1.5s', duration: '7.5s'},
    ].map((item, i) => (
      <div
        key={i}
        className="absolute select-none pointer-events-none"
        style={{
          top: item.top,
          left: 'left' in item ? item.left : undefined,
          right: 'right' in item ? item.right : undefined,
          fontSize: item.size,
          animation: `float ${item.duration} ease-in-out infinite`,
          animationDelay: item.delay,
          opacity: 0.6,
        }}
      >
        {item.icon}
      </div>
    ))}

    {/* Inject float animation */}
    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33%       { transform: translateY(-12px) rotate(3deg); }
        66%       { transform: translateY(-6px) rotate(-2deg); }
      }
    `}</style>
  </div>
);

// Component principal de Login
export const Login = () => {
  const navigate = useNavigate();
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    try {
      const data = await loginUser({ email, password });
      if (data.status === 'success') {
        localStorage.setItem('userEmail', email);
        toast.success('¡Bienvenido de vuelta! 👋');
        setTimeout(() => navigate('/dashboard'), 600);
      } else {
        toast.error(data.message || 'Credenciales incorrectas');
      }
    } catch {
      toast.error('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) return;
    setIsLoading(true);
    try {
      const payload = jwtDecode<GooglePayload>(response.credential);
      const data = await googleLogin(response.credential);
      if (data.status === 'success') {
        localStorage.setItem('userEmail', payload.email);
        toast.success('¡Bienvenido! Iniciaste sesión con Google');
        setTimeout(() => navigate('/dashboard'), 600);
      } else {
        toast.error(data.message || 'Error al iniciar sesión con Google');
      }
    } catch {
      toast.error('Error al procesar el inicio de sesión con Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <HealthBackground />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/60 overflow-hidden">

          {/* Header verde */}
          <div className="bg-gradient-to-r from-[#2D5A27] to-[#4a7a3d] px-10 pt-10 pb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
              <Heart size={28} fill="white" className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Iniciar Sesión</h1>
            <p className="text-green-200 text-sm font-medium mt-1">
              Sistema de Recomendación de Hábitos Saludables
            </p>
          </div>

          {/* Form */}
          <div className="px-10 py-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2D5A27] focus:bg-white outline-none transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2D5A27] focus:bg-white outline-none transition-all text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl text-sm font-black text-white uppercase tracking-widest shadow-lg transition-all duration-200 mt-2
                  ${isLoading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-[#2D5A27] hover:bg-[#23471f] hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] cursor-pointer'
                  }`}
              >
                {isLoading ? 'Verificando...' : 'Entrar →'}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">o continúa con</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Error al conectar con Google')}
                useOneTap={false}
                shape="pill"
                size="large"
                text="signin_with"
              />
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <span className="text-xs text-gray-400">¿No tienes cuenta? </span>
              <button
                onClick={() => navigate('/register')}
                className="text-xs font-black text-[#2D5A27] hover:underline underline-offset-4 cursor-pointer"
              >
                Regístrate aquí
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};