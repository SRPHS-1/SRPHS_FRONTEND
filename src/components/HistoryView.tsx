import { History as HistoryIcon, Activity } from 'lucide-react';

export const HistoryView = ({ historyData }: any) => (
  <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 animate-in fade-in duration-500">
    <h3 className="text-xl font-black text-[#2D5A27] mb-8 flex items-center gap-3 uppercase italic">
      <HistoryIcon size={26} /> Historial de Evaluaciones
    </h3>
    <div className="space-y-6">
      {historyData.map((h: any, i: number) => (
        <div key={i} className="p-6 bg-[#FDFCFB] border border-gray-100 rounded-3xl">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-2xl shadow-sm text-[#2D5A27]"><Activity size={20} /></div>
              <div>
                <p className="text-xs font-black text-gray-800">{h.fullDate}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">{h.prediction}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-[#2D5A27]">{h.imc}</p>
              <p className="text-[8px] font-black text-gray-400 uppercase">IMC Registrado</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 border-t border-gray-50 pt-4">
            {h.recommendations?.map((rec: any, idx: number) => (
              <span key={idx} className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-[9px] font-bold text-gray-500 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2D5A27]"></div>
                {rec.text}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);