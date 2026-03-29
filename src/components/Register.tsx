import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginbg from '../assets/Login-bg.png'; 
import { registerUser } from '../services/api';

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const data = await registerUser(formData);
      
      if (data.status === "success") {
        alert("¡Cuenta creada! Ya puedes iniciar sesión");
        navigate('/'); 
      } else {
        alert(data.message || "Error al registrar");
      }
    } catch (error) {
      alert("Error de conexión. Revisa que el servidor esté activo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <img src={loginbg} alt="BG" className="absolute inset-0 w-full h-full object-cover select-none" />

      <div className="relative z-10 w-full max-w-md p-10 mx-4 bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/40">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-srphs-green leading-tight">Nueva Cuenta</h1>
          <p className="text-srphs-green-light font-medium mt-2">Únete a SRPHS hoy</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase ml-1 mb-1">Nombre de Usuario</label>
            <input 
              type="text" 
              placeholder="Ej. jpablo_dev"
              className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-srphs-green outline-none transition-all"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required 
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase ml-1 mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="correo@ejemplo.com"
              className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-srphs-green outline-none transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase ml-1 mb-1">Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-srphs-green outline-none transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-4 mt-4 rounded-2xl text-lg font-bold text-white shadow-lg transition-all
              ${isLoading ? 'bg-gray-400' : 'bg-srphs-green hover:bg-[#23471f] hover:-translate-y-1 cursor-pointer'}`}
          >
            {isLoading ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <footer className="mt-8 pt-6 border-t border-gray-200/50 flex justify-center items-center gap-2">
          <span className="text-sm text-gray-500">¿Ya tienes cuenta?</span>
          <button onClick={() => navigate('/')} className="text-srphs-green font-bold text-sm hover:underline cursor-pointer">
            Inicia Sesión
          </button>
        </footer>
      </div>
    </div>
  );
};