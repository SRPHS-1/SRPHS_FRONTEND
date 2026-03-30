import { History as HistoryIcon, Activity, TrendingDown, TrendingUp, Minus } from 'lucide-react';

const goalLabel: Record<string, { text: string; color: string }> = {
  perder:   { text: 'Perder peso',      color: 'text-blue-500 bg-blue-50 border-blue-100' },
  mantener: { text: 'Mantenerme',       color: 'text-green-600 bg-green-50 border-green-100' },
  ganar:    { text: 'Ganar músculo',    color: 'text-orange-500 bg-orange-50 border-orange-100' },
};

function getBMICategory(bmi: number) {
  if (bmi < 18.5) return { label: 'Bajo peso',  color: 'text-blue-600 bg-blue-50'   };
  if (bmi < 25)   return { label: 'Normal',      color: 'text-green-600 bg-green-50' };
  if (bmi < 30)   return { label: 'Sobrepeso',   color: 'text-yellow-600 bg-yellow-50' };
  return              { label: 'Obesidad',       color: 'text-red-600 bg-red-50'     };
}

export const HistoryView = ({ historyData }: any) => {
  // Calcular tendencia de BMI
  const bmiTrend = historyData.length >= 2
    ? historyData[historyData.length - 1].imc - historyData[0].imc
    : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Summary bar */}
      {historyData.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 text-center">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Evaluaciones</p>
            <p className="text-3xl font-black text-[#2D5A27]">{historyData.length}</p>
          </div>
          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 text-center">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">BMI Actual</p>
            <p className="text-3xl font-black text-gray-800">
              {historyData[historyData.length - 1]?.imc ?? '--'}
            </p>
          </div>
          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 text-center">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Tendencia</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              {bmiTrend === null ? (
                <span className="text-lg font-black text-gray-400">—</span>
              ) : bmiTrend < -0.1 ? (
                <>
                  <TrendingDown size={22} className="text-green-600" />
                  <span className="text-lg font-black text-green-600">{Math.abs(bmiTrend).toFixed(1)}</span>
                </>
              ) : bmiTrend > 0.1 ? (
                <>
                  <TrendingUp size={22} className="text-red-500" />
                  <span className="text-lg font-black text-red-500">+{bmiTrend.toFixed(1)}</span>
                </>
              ) : (
                <>
                  <Minus size={22} className="text-gray-400" />
                  <span className="text-lg font-black text-gray-400">Estable</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* History list */}
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
        <h3 className="text-xl font-black text-[#2D5A27] mb-8 flex items-center gap-3 uppercase italic">
          <HistoryIcon size={24} /> Historial de Evaluaciones
        </h3>

        {historyData.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-gray-400 font-bold">Aún no tienes evaluaciones.</p>
            <p className="text-gray-300 text-sm mt-1">Ve a tu Perfil y genera tu primera recomendación.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {[...historyData].reverse().map((h: any, i: number) => {
              const bmiInfo = getBMICategory(h.imc);
              const goal = goalLabel[h.goal] ?? goalLabel['mantener'];
              return (
                <div
                  key={i}
                  className="p-6 bg-[#FDFCFB] border border-gray-100 rounded-3xl hover:border-[#2D5A27]/20 transition-all"
                >
                  {/* Header row */}
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-2xl shadow-sm text-[#2D5A27] border border-gray-100">
                        <Activity size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-800">{h.fullDate}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">
                          {h.prediction}
                        </p>
                      </div>
                    </div>

                    {/* BMI badge */}
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-black ${bmiInfo.color}`}>
                        <span className="text-xl">{h.imc}</span>
                        <div>
                          <p className="text-[8px] font-black uppercase leading-none">BMI</p>
                          <p className="text-[8px] opacity-70">{bmiInfo.label}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Goal + stats */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${goal.color}`}>
                      🎯 {goal.text}
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold">
                      {h.weight} kg · {(h.height).toFixed(2)} m
                    </span>
                  </div>

                  {/* Recommendations */}
                  {h.recommendations?.length > 0 && (
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2">
                        Recomendaciones generadas
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {h.recommendations.map((rec: any, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-white border border-gray-100 rounded-xl text-[9px] font-bold text-gray-500 flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#2D5A27] flex-shrink-0" />
                            {rec.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};