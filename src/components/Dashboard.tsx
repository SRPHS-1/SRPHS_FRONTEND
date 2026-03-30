import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, LogOut } from 'lucide-react';
import { healthService } from '../services/api';
import { ProfileView } from './ProfileView';
import { AnalyticsView } from './AnalyticsView';
import { HistoryView } from './HistoryView';
import { WaterTracker } from './WaterTracker';
 
export const Dashboard = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || '';
  const username  = localStorage.getItem('username')  || 'Usuario';
 
  const [view, setView]           = useState<'Perfil' | 'Dashboard' | 'Historial'>('Perfil');
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [tips, setTips]           = useState<any[]>([]);
  const [historyData, setHistoryData] = useState<any[]>([]);
 
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };
 
  // Persistencia del formulario
  const [formData, setFormData] = useState<any>(() => {
    const saved = localStorage.getItem(`form_${userEmail}`);
    return saved
      ? JSON.parse(saved)
      : {
          Gender: '', Age: '', Height: '', Weight: '',
          family_history_with_overweight: '', FAVC: '', FCVC: '', NCP: '',
          CAEC: '', SMOKE: '', CH2O: '', SCC: '', FAF: '', TUE: '',
          CALC: '', MTRANS: '',
          goal: '',  // NUEVO
        };
  });
 
  useEffect(() => {
    if (userEmail) localStorage.setItem(`form_${userEmail}`, JSON.stringify(formData));
  }, [formData, userEmail]);
 
  // Adherencia ponderada — promedio de completion % de cada recomendación
  const adherence = useMemo(() => {
    if (tips.length === 0) return 0;
    const total = tips.reduce((sum: number, t: any) => sum + (t.completion ?? 0), 0);
    return Math.round(total / tips.length);
  }, [tips]);
 
  const handleInputChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
 
  const loadDashboardData = useCallback(async () => {
    if (!userEmail) return;
    try {
      const [resAnalytic, resHistory] = await Promise.all([
        healthService.getAnalytics(userEmail).catch(() => null),
        healthService.getHistory(userEmail).catch(() => null),
      ]);
 
      if (resAnalytic?.status === 'success') setAnalytics(resAnalytic.summary);
 
      if (resHistory?.status === 'success' && resHistory.data) {
        const formatted = resHistory.data
          .map((record: any) => ({
            fecha:        new Date(record.date).toLocaleDateString('es-CO'),
            fullDate:     new Date(record.date).toLocaleString(),
            imc:          parseFloat((record.weight / Math.pow(record.height / 100, 2)).toFixed(1)),
            prediction:   record.prediction,
            weight:       record.weight,
            height:       record.height,
            goal:         record.goal ?? 'mantener',
            recommendations: record.top_recommendations?.map((t: string, i: number) => ({
              id: i, text: t, completion: 0,
            })) ?? [],
          }))
          .reverse();
 
        setHistoryData(formatted);
 
        if (tips.length === 0 && formatted.length > 0) {
          setTips(formatted[0].recommendations);
        }
      }
    } catch {
      console.error('Error de sincronización');
    }
  }, [userEmail, tips.length]);
 
  useEffect(() => {
    if (!userEmail) navigate('/');
    else loadDashboardData();
  }, [userEmail, navigate, loadDashboardData]);
 
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-gray-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md p-4 flex justify-between items-center sticky top-0 z-50 border-b border-gray-100 gap-4">
        <div className="flex items-center gap-3 flex-shrink-0">
          <Heart className="text-[#4A7844]" size={20} fill="currentColor" />
          <h1 className="text-sm font-black uppercase tracking-tighter">SRPHS</h1>
        </div>
 
        {/* Water tracker — visible en todas las vistas */}
        <WaterTracker />
 
        <nav className="flex bg-[#F1F3F0] rounded-full p-1 flex-shrink-0">
          {['Perfil', 'Dashboard', 'Historial'].map(t => (
            <button
              key={t}
              onClick={() => setView(t as any)}
              className={`px-5 py-2 rounded-full text-[10px] font-black transition-all cursor-pointer ${
                view === t ? 'bg-[#2D5A27] text-white shadow-md' : 'text-gray-400'
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </nav>
 
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="group relative w-10 h-10 bg-[#2D5A27] rounded-full flex items-center justify-center text-white font-black border-4 border-[#F8EFE4] cursor-pointer hover:bg-red-600 transition-colors flex-shrink-0"
        >
          <span className="group-hover:hidden">{username[0]}</span>
          <LogOut size={16} className="hidden group-hover:block" />
        </button>
      </header>
 
      {/* Main */}
      <main className="p-6 max-w-7xl mx-auto">
        {view === 'Perfil' && (
          <ProfileView
            formData={formData}
            onChange={handleInputChange}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            userEmail={userEmail}
            username={username}
            setTips={setTips}
            setView={setView}
            refreshData={loadDashboardData}
          />
        )}
        {view === 'Dashboard' && (
          <AnalyticsView
            analytics={analytics}
            historyData={historyData}
            tips={tips}
            setTips={setTips}
            adherence={adherence}
          />
        )}
        {view === 'Historial' && <HistoryView historyData={historyData} />}
      </main>
    </div>
  );
};