import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, LogOut, User, BarChart2, Clock } from 'lucide-react';
import { healthService } from '../services/api';
import { ProfileView }   from './ProfileView';
import { AnalyticsView } from './AnalyticsView';
import { HistoryView }   from './HistoryView';
import { WaterTracker }  from './WaterTracker';
import { toast }         from './Toast';

const NAV_ITEMS = [
  { key: 'Perfil',     icon: User,     label: 'Perfil'     },
  { key: 'Dashboard',  icon: BarChart2, label: 'Dashboard'  },
  { key: 'Historial',  icon: Clock,    label: 'Historial'  },
] as const;

type ViewKey = typeof NAV_ITEMS[number]['key'];

export const Dashboard = () => {
  const navigate  = useNavigate();
  const userEmail = localStorage.getItem('userEmail')  || '';
  const username  = localStorage.getItem('username')   || 'Usuario';
  const avatar    = localStorage.getItem('userAvatar') || '';

  const [view,        setView]        = useState<ViewKey>('Perfil');
  const [isLoading,   setIsLoading]   = useState(false);
  const [analytics,   setAnalytics]   = useState<any>(null);
  const [tips,        setTips]        = useState<any[]>([]);
  const [historyData, setHistoryData] = useState<any[]>([]);

  const handleLogout = () => {
    localStorage.clear();
    toast.info('Sesión cerrada');
    navigate('/');
  };

  const [formData, setFormData] = useState<any>(() => {
    const saved = localStorage.getItem(`form_${userEmail}`);
    return saved ? JSON.parse(saved) : {
      Gender: '', Age: '', Height: '', Weight: '',
      family_history_with_overweight: '', FAVC: '', FCVC: '', NCP: '',
      CAEC: '', SMOKE: '', CH2O: '', SCC: '', FAF: '', TUE: '',
      CALC: '', MTRANS: '', goal: '',
    };
  });

  useEffect(() => {
    if (userEmail) localStorage.setItem(`form_${userEmail}`, JSON.stringify(formData));
  }, [formData, userEmail]);

  // Adherencia ponderada
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
            fecha:           new Date(record.date).toLocaleDateString('es-CO'),
            fullDate:        new Date(record.date).toLocaleString(),
            imc:             parseFloat((record.weight / Math.pow(record.height, 2)).toFixed(1)),
            prediction:      record.prediction,
            weight:          record.weight,
            height:          record.height,
            goal:            record.goal ?? 'mantener',
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
      toast.error('Error al cargar tus datos');
    }
  }, [userEmail, tips.length]);

  useEffect(() => {
    if (!userEmail) navigate('/');
    else loadDashboardData();
  }, [userEmail, navigate, loadDashboardData]);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-gray-900">

      {/* Header*/}
      <header className="bg-white/90 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">

          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 bg-[#2D5A27] rounded-lg flex items-center justify-center">
              <Heart size={14} fill="white" className="text-white" />
            </div>
            <span className="text-sm font-black uppercase tracking-tighter text-[#2D5A27]">SRPHS</span>
          </div>

          {/* Water tracker centrado */}
          <div className="flex-1 flex justify-center">
            <WaterTracker />
          </div>

          {/* Nav + Avatar */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <nav className="flex bg-gray-100 rounded-full p-0.5">
              {NAV_ITEMS.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setView(key)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black transition-all cursor-pointer ${
                    view === key
                      ? 'bg-[#2D5A27] text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Icon size={11} />
                  <span className="hidden sm:inline uppercase tracking-wide">{label}</span>
                </button>
              ))}
            </nav>

            {/* Avatar y logout */}
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="group relative w-8 h-8 rounded-full overflow-hidden border-2 border-[#2D5A27]/30 hover:border-red-400 transition-all cursor-pointer flex-shrink-0"
            >
              {avatar ? (
                <img src={avatar} alt={username} className="w-full h-full object-cover group-hover:opacity-0 transition-opacity" />
              ) : (
                <div className="w-full h-full bg-[#2D5A27] flex items-center justify-center text-white text-xs font-black group-hover:opacity-0 transition-opacity">
                  {username[0]?.toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <LogOut size={12} className="text-white" />
              </div>
            </button>
          </div>
        </div>
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
            avatar={avatar}
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