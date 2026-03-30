import { LineChart, Line, Tooltip, ResponsiveContainer, XAxis } from 'recharts';
import { CheckSquare, Target } from 'lucide-react';
 
// Niveles de cumplimiento
const LEVELS = [
  { value: 0,   label: 'Sin hacer',  color: 'bg-gray-200 text-gray-500' },
  { value: 25,  label: '25%',        color: 'bg-red-100 text-red-500' },
  { value: 50,  label: '50%',        color: 'bg-yellow-100 text-yellow-600' },
  { value: 75,  label: '75%',        color: 'bg-blue-100 text-blue-600' },
  { value: 100, label: 'Completo',   color: 'bg-green-100 text-green-700' },
];
 
function getCardStyle(completion: number) {
  if (completion === 100) return 'bg-green-50 border-green-200';
  if (completion >= 75)   return 'bg-blue-50 border-blue-200';
  if (completion >= 50)   return 'bg-yellow-50 border-yellow-200';
  if (completion >= 25)   return 'bg-red-50 border-red-200 opacity-80';
  return 'bg-gray-50 border-transparent';
}
 
function getBarColor(completion: number) {
  if (completion === 100) return 'bg-green-500';
  if (completion >= 75)   return 'bg-blue-500';
  if (completion >= 50)   return 'bg-yellow-400';
  if (completion >= 25)   return 'bg-red-400';
  return 'bg-gray-200';
}
 
export const AnalyticsView = ({ analytics, historyData, tips, setTips, adherence }: any) => {
 
  const handleCompletion = (id: number, value: number) => {
    setTips((prev: any[]) =>
      prev.map(tip => tip.id === id ? { ...tip, completion: value } : tip)
    );
  };
 
  const goalLabel: Record<string, string> = {
    perder:   '🎯 Objetivo: Perder peso',
    mantener: '⚖️ Objetivo: Mantener peso',
    ganar:    '💪 Objetivo: Ganar masa muscular',
  };
 
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
 
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
 
        {/* Diagnóstico + objetivo */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 flex flex-col justify-center gap-1">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Diagnóstico IA</p>
          <p className="text-base font-black text-gray-800 leading-tight">
            {analytics?.estado_actual || 'Esperando análisis...'}
          </p>
          {analytics?.objetivo_actual && (
            <p className="text-[9px] font-bold text-[#2D5A27] mt-1">
              {goalLabel[analytics.objetivo_actual] ?? ''}
            </p>
          )}
        </div>
 
        {/* Gráfica BMI */}
        <div className="md:col-span-2 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 h-[160px]">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-3">Evolución BMI</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData}>
              <XAxis dataKey="fecha" hide />
              <Line
                type="monotone"
                dataKey="imc"
                stroke="#2D5A27"
                strokeWidth={4}
                dot={{ r: 6, fill: '#2D5A27', strokeWidth: 2, stroke: '#fff' }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '15px',
                  border: 'none',
                  boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
 
        {/* Adherencia ponderada */}
        <div
          className={`p-6 rounded-[2rem] text-white shadow-lg flex flex-col justify-center items-center transition-colors duration-500 ${
            adherence > 50 ? 'bg-[#2D5A27]' : 'bg-orange-500'
          }`}
        >
          <p className="text-[9px] font-black uppercase opacity-60 mb-1">Adherencia</p>
          <p className="text-5xl font-black">{adherence}%</p>
          <p className="text-[8px] font-bold mt-2 uppercase tracking-widest">
            {adherence >= 100
              ? '🏆 ¡Meta alcanzada!'
              : adherence > 70
              ? '¡Excelente ritmo!'
              : 'Sigue intentando'}
          </p>
          <p className="text-[8px] opacity-50 mt-1">Meta del proyecto: 40%</p>
        </div>
      </div>
 
      {/* Recomendaciones con completion % */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h3 className="text-xs font-black text-gray-800 uppercase mb-2 flex items-center gap-3">
          <CheckSquare className="text-[#2D5A27]" size={20} />
          Objetivos de Salud — ¿Cuánto cumpliste hoy?
        </h3>
        <p className="text-[10px] text-gray-400 mb-6 ml-8">
          Selecciona el nivel de cumplimiento de cada recomendación.
        </p>
 
        <div className="flex flex-col gap-4">
          {tips.map((tip: any) => {
            const comp = tip.completion ?? 0;
            return (
              <div
                key={tip.id}
                className={`p-5 rounded-2xl border transition-all ${getCardStyle(comp)}`}
              >
                {/* Header: ícono + texto + % actual */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#2D5A27] flex-shrink-0">
                      <Target size={16} />
                    </div>
                    <p className="text-sm font-bold text-gray-700">{tip.text}</p>
                  </div>
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full whitespace-nowrap ${
                      LEVELS.find(l => l.value === comp)?.color ?? 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {comp === 0 ? 'Sin hacer' : comp === 100 ? '✓ Completo' : `${comp}%`}
                  </span>
                </div>
 
                {/* Barra de progreso */}
                <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${getBarColor(comp)}`}
                    style={{ width: `${comp}%` }}
                  />
                </div>
 
                {/* Botones de nivel */}
                <div className="flex gap-2 flex-wrap">
                  {LEVELS.map(level => (
                    <button
                      key={level.value}
                      onClick={() => handleCompletion(tip.id, level.value)}
                      className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wide transition-all cursor-pointer border ${
                        comp === level.value
                          ? `${level.color} border-current scale-105 shadow-sm`
                          : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};