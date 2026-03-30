import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { UserPlus } from 'lucide-react';
import { registerUser, googleRegister } from '../services/api';
import { toast } from './Toast';

interface GooglePayload {
  email: string;
  name: string;
  picture: string;
}

const HealthBackground = () => (
  <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#1a3a18] via-[#2D5A27] to-[#4a7a3d]">
    <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
    <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />
    <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="1.5" fill="white" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
    <svg className="absolute bottom-16 left-0 w-full opacity-20" viewBox="0 0 1440 120" preserveAspectRatio="none">
      <polyline
        points="0,60 200,60 260,60 290,10 320,110 350,30 380,90 410,60 600,60 660,60 690,5 720,115 750,25 780,95 810,60 1000,60 1060,60 1090,15 1120,105 1150,35 1180,85 1210,60 1440,60"
        fill="none" stroke="white" strokeWidth="2.5" strokeLinejoin="round"
      />
    </svg>
    {[
      { icon: '🧘', top: '10%', left: '7%',   delay: '0s',   dur: '7s'  },
      { icon: '🥦', top: '22%', right: '9%',  delay: '1s',   dur: '8s'  },
      { icon: '🚴', top: '68%', left: '6%',   delay: '2s',   dur: '6s'  },
      { icon: '💪', top: '78%', right: '7%',  delay: '0.5s', dur: '9s'  },
      { icon: '🫐', top: '45%', left: '10%',  delay: '3s',   dur: '7s'  },
    ].map((item, i) => (
      <div key={i} className="absolute select-none pointer-events-none text-3xl"
        style={{ top: item.top, left: 'left' in item ? item.left : undefined, right: 'right' in item ? item.right : undefined,
          opacity: 0.55, animation: `float2 ${item.dur} ease-in-out infinite`, animationDelay: item.delay }}>
        {item.icon}
      </div>
    ))}
    <style>{`@keyframes float2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-14px) rotate(4deg)} }`}</style>
  </div>
);

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    try {
      const data = await registerUser(formData);
      if (data.status === 'success') {
        toast.success('¡Cuenta creada! Ya puedes iniciar sesión 🎉');
        setTimeout(() => navigate('/'), 800);
      } else {
        toast.error(data.message || 'Error al registrar');
      }
    } catch {
      toast.error('Error de conexión. Revisa que el servidor esté activo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) return;
    setIsLoading(true);
    try {
      const payload = jwtDecode<GooglePayload>(response.credential);
      const data = await googleRegister(response.credential);
      if (data.status === 'success') {
        localStorage.setItem('userEmail', payload.email);
        toast.success('¡Bienvenido a SRPHS! Cuenta creada con Google 🎉');
        setTimeout(() => navigate('/dashboard'), 800);
      } else {
        toast.error(data.message || 'Error al registrarse con Google');
      }
    } catch {
      toast.error('Error al procesar el registro con Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <HealthBackground />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/60 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#2D5A27] to-[#4a7a3d] px-10 pt-8 pb-7 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-2xl mb-3">
              <UserPlus size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Nueva Cuenta</h1>
            <p className="text-green-200 text-xs font-medium mt-1">Únete a SRPHS hoy</p>
          </div>

          {/* Form */}
          <div className="px-10 py-7">
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Nombre de usuario', key: 'username', type: 'text',     placeholder: 'Ej. jpablo_dev' },
                { label: 'Correo electrónico', key: 'email',    type: 'email',    placeholder: 'correo@ejemplo.com' },
                { label: 'Contraseña',         key: 'password', type: 'password', placeholder: '••••••••' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2D5A27] focus:bg-white outline-none transition-all text-sm"
                    onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                    required
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl text-sm font-black text-white uppercase tracking-widest shadow-lg transition-all mt-1
                  ${isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#2D5A27] hover:bg-[#23471f] hover:-translate-y-0.5 hover:shadow-xl cursor-pointer'}`}
              >
                {isLoading ? 'Creando cuenta...' : 'Registrarme →'}
              </button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">o regístrate con</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Error al conectar con Google')}
                useOneTap={false}
                shape="pill"
                size="large"
                text="signup_with"
              />
            </div>

            <div className="mt-5 text-center">
              <span className="text-xs text-gray-400">¿Ya tienes cuenta? </span>
              <button
                onClick={() => navigate('/')}
                className="text-xs font-black text-[#2D5A27] hover:underline underline-offset-4 cursor-pointer"
              >
                Inicia sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};