import { LineChart, Line, Tooltip, ResponsiveContainer, XAxis } from 'recharts';
import { CheckSquare, CheckCircle2, XCircle, Target, Undo2 } from 'lucide-react';

export const AnalyticsView = ({ analytics, historyData, tips, setTips, adherence }: any) => {
  const handleActionTip = (id: number, action: string) => {
    setTips((prev: any[]) => prev.map(tip => tip.id === id ? { ...tip, status: action } : tip));
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 flex flex-col justify-center">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Diagnóstico IA</p>
          <p className="text-lg font-black text-gray-800 leading-tight">{analytics?.estado_actual || "Esperando análisis..."}</p>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 h-[160px]">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-3">Historial de IMC</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData}>
              <XAxis dataKey="fecha" hide />
              <Line type="monotone" dataKey="imc" stroke="#2D5A27" strokeWidth={4} dot={{ r: 6, fill: '#2D5A27', strokeWidth: 2, stroke: '#fff' }} />
              <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={`p-6 rounded-[2rem] text-white shadow-lg flex flex-col justify-center items-center transition-colors duration-500 ${adherence > 50 ? 'bg-[#2D5A27]' : 'bg-orange-500'}`}>
          <p className="text-[9px] font-black uppercase opacity-60 mb-1">Tu Adherencia</p>
          <p className="text-5xl font-black">{adherence}%</p>
          <p className="text-[8px] font-bold mt-2 uppercase tracking-widest">{adherence > 70 ? '¡Excelente Ritmo!' : 'Sigue intentando'}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h3 className="text-xs font-black text-gray-800 uppercase mb-6 flex items-center gap-3">
          <CheckSquare className="text-[#2D5A27]" size={20} /> Objetivos de Salud
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip: any) => (
            <div key={tip.id} className={`p-5 rounded-2xl border transition-all flex items-center justify-between ${tip.status === 'accepted' ? 'bg-green-50 border-green-200' : tip.status === 'declined' ? 'bg-red-50 border-red-200 opacity-60' : 'bg-gray-50 border-transparent'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tip.status === 'accepted' ? 'bg-green-500 text-white' : tip.status === 'declined' ? 'bg-red-400 text-white' : 'bg-white text-[#2D5A27]'}`}>
                  {tip.status === 'accepted' ? <CheckCircle2 size={18} /> : tip.status === 'declined' ? <XCircle size={18} /> : <Target size={18} />}
                </div>
                <p className={`text-sm font-bold ${tip.status === 'declined' ? 'line-through text-gray-400' : 'text-gray-700'}`}>{tip.text}</p>
              </div>
              <div className="flex gap-2">
                {tip.status === 'pending' ? (
                  <>
                    <button onClick={() => handleActionTip(tip.id, 'accepted')} className="p-2 bg-white text-green-600 rounded-lg shadow-sm hover:bg-green-600 hover:text-white transition-all"><CheckCircle2 size={16}/></button>
                    <button onClick={() => handleActionTip(tip.id, 'declined')} className="p-2 bg-white text-red-600 rounded-lg shadow-sm hover:bg-red-600 hover:text-white transition-all"><XCircle size={16}/></button>
                  </>
                ) : (
                  <button onClick={() => handleActionTip(tip.id, 'pending')} className="p-2 text-gray-400 hover:text-[#2D5A27] transition-all flex items-center gap-1">
                    <Undo2 size={14} /> <span className="text-[9px] font-black">REHACER</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};