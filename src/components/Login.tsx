import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginbg from '../assets/Login-bg.png'; 
import { loginUser } from '../services/api';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; 
    
    setIsLoading(true);
    try {
      const data = await loginUser({ email, password });
      
      if (data.status === "success") {
        localStorage.setItem('userEmail', email);
        navigate('/dashboard');
      } else {
        alert(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <img 
        src={loginbg} 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover select-none"
      />

      <div className="relative z-10 w-full max-w-md p-10 mx-4 bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/40">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-srphs-green leading-tight">Iniciar Sesión</h1>
          <p className="text-srphs-green-light font-medium mt-2 text-lg">SRPHS</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Correo electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-srphs-green focus:bg-white outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-srphs-green focus:bg-white outline-none transition-all"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl text-lg font-bold text-white shadow-lg transition-all duration-200
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-srphs-green hover:bg-[#23471f] hover:shadow-2xl hover:-translate-y-1 active:scale-[0.97] cursor-pointer'
              }`}
          >
            {isLoading ? 'Verificando...' : 'Entrar al sistema'}
          </button>
        </form>

        <div className="mt-10">
          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase tracking-widest font-bold">O</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <div className="flex justify-center gap-6 mt-6">
            <button type="button" className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1 active:scale-90 cursor-pointer">
              <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className="w-7 h-7" alt="GitHub" />
            </button>
            <button type="button" className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1 active:scale-90 cursor-pointer">
              <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" className="w-7 h-7" alt="Google" />
            </button>
          </div>
        </div>

        <footer className="mt-10 pt-6 border-t border-gray-200/50 flex justify-between items-center">
          <span className="text-sm text-gray-500">¿Eres nuevo?</span>
          <button 
            type="button"
            onClick={() => navigate('/register')}
            className="text-srphs-green font-bold text-sm hover:underline decoration-2 underline-offset-4 cursor-pointer p-1"
          >
            Crea una cuenta
          </button>
        </footer>
      </div>
    </div>
  );
};