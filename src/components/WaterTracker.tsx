import { useState, useEffect } from 'react';

const TOTAL_GLASSES = 8;
const STORAGE_KEY = 'srphs_water_';

function getTodayKey() {
  return STORAGE_KEY + new Date().toISOString().split('T')[0]; 
}

export const WaterTracker = () => {
  const [glasses, setGlasses] = useState<number>(() => {
    const saved = localStorage.getItem(getTodayKey());
    return saved ? parseInt(saved, 10) : 0;
  });

  // Reset automatico si cambia el dia
  useEffect(() => {
    const todayKey = getTodayKey();
    const saved = localStorage.getItem(todayKey);
    if (!saved) {
      // Limpiar claves de días anteriores
      Object.keys(localStorage)
        .filter(k => k.startsWith(STORAGE_KEY) && k !== todayKey)
        .forEach(k => localStorage.removeItem(k));
      setGlasses(0);
    }
  }, []);

  const toggle = (index: number) => {
    const next = glasses === index + 1 ? index : index + 1;
    setGlasses(next);
    localStorage.setItem(getTodayKey(), String(next));
  };

  const remaining = TOTAL_GLASSES - glasses;
  const pct = Math.round((glasses / TOTAL_GLASSES) * 100);

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-5 py-3 flex items-center gap-4 border border-white shadow-sm">
      {/* Label */}
      <div className="hidden sm:block">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
          Hidratación hoy
        </p>
        <p className="text-[10px] font-bold text-gray-500">
          {glasses}/{TOTAL_GLASSES} vasos · {pct}%
        </p>
      </div>

      {/* Vasos */}
      <div className="flex items-center gap-1">
        {Array.from({ length: TOTAL_GLASSES }).map((_, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            title={i < glasses ? 'Quitar vaso' : 'Agregar vaso'}
            className="transition-transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            {i < glasses ? (
              // Vaso lleno — gota azul
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0C19 10.5 12 2 12 2z"
                  fill="#60a5fa"
                  stroke="#3b82f6"
                  strokeWidth="1.2"
                />
              </svg>
            ) : (
              // Vaso vacío — gota outline
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0C19 10.5 12 2 12 2z"
                  fill="#e5e7eb"
                  stroke="#d1d5db"
                  strokeWidth="1.2"
                />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* Quedan X vasos */}
      {remaining > 0 ? (
        <p className="text-[10px] font-bold text-gray-400 whitespace-nowrap">
          Quedan <span className="text-blue-500 font-black">{remaining}</span> vasos
        </p>
      ) : (
        <p className="text-[10px] font-black text-blue-500 whitespace-nowrap">
          ¡Meta diaria! 💧
        </p>
      )}
    </div>
  );
};