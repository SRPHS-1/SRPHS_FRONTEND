import { useMemo } from 'react';
import { healthService } from '../services/api';
import { InputField, SelectField } from './FormComponents';
import { User, Info } from 'lucide-react';
import { toast } from './Toast';

export const ProfileView = ({
  formData, onChange, setIsLoading, isLoading,
  userEmail, username, avatar, setTips, setView, refreshData,
}: any) => {

  const currentBMI = useMemo(() => {
    if (formData.Weight && formData.Height && formData.Height > 0) {
      return parseFloat((formData.Weight / (formData.Height * formData.Height)).toFixed(1));
    }
    return 0;
  }, [formData.Weight, formData.Height]);

  const getBMICategory = (bmi: number) => {
    if (bmi === 0)  return { label: 'Esperando datos', color: 'bg-gray-100', text: 'text-gray-400', position: 0 };
    if (bmi < 18.5) return { label: 'Bajo peso',  color: 'bg-blue-300',   text: 'text-blue-500',   position: (bmi / 18.5) * 20 };
    if (bmi < 25)   return { label: 'Normal',      color: 'bg-green-400',  text: 'text-green-600',  position: 20 + ((bmi - 18.5) / 6.5) * 30 };
    if (bmi < 30)   return { label: 'Sobrepeso',   color: 'bg-yellow-400', text: 'text-yellow-600', position: 50 + ((bmi - 25) / 5) * 25 };
    return { label: 'Obesidad', color: 'bg-red-400', text: 'text-red-600', position: Math.min(75 + ((bmi - 30) / 10) * 25, 100) };
  };

  const bmiInfo = getBMICategory(currentBMI);

  const handlePredict = async () => {
    if (!formData.Weight || !formData.Height || !formData.Age || !formData.Gender) {
      toast.warning('Completa los campos básicos: Género, Edad, Altura y Peso.');
      return;
    }
    if (!formData.goal) {
      toast.warning('Selecciona tu objetivo de salud antes de continuar.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await healthService.predictObesity(userEmail, formData);
      if (res.status === 'success') {
        setTips(res.recommendations?.map((t: string, i: number) => ({ id: i, text: t, completion: 0 })) ?? []);
        toast.success('¡Análisis generado! Revisa tu Dashboard 🎯');
        setView('Dashboard');
        await refreshData();
      } else {
        toast.error('Error al generar el análisis. Inténtalo de nuevo.');
      }
    } catch {
      toast.error('Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in duration-500">

      {/* Columna izquierda */}
      <div className="lg:col-span-8 bg-[#F8EFE4]/60 p-8 rounded-[2.5rem] border border-white shadow-sm">
        <h2 className="text-3xl font-black text-[#2D5A27] mb-2 tracking-tight flex items-center gap-3">
          <User /> Tu perfil personalizado
        </h2>
        <p className="text-gray-500 text-xs mb-8">
          Completa tu información para que la IA genere recomendaciones adaptadas.
        </p>

        {/* Objetivo */}
        <div className="mb-6">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">¿Cuál es tu objetivo?</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: 'perder',   emoji: '🎯', label: 'Perder peso'   },
              { val: 'mantener', emoji: '⚖️', label: 'Mantenerme'    },
              { val: 'ganar',    emoji: '💪', label: 'Ganar músculo' },
            ].map(opt => (
              <button
                key={opt.val}
                onClick={() => onChange('goal', opt.val)}
                className={`py-4 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  formData.goal === opt.val
                    ? 'bg-[#2D5A27] border-[#2D5A27] text-white shadow-lg scale-105'
                    : 'bg-white border-gray-100 text-gray-500 hover:border-[#2D5A27]/40'
                }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-[10px] font-black uppercase tracking-wide">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Campos */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          <SelectField label="Género"    name="Gender" value={formData.Gender} onChange={onChange} options={['Male','Female']} />
          <InputField  label="Edad"      name="Age"    value={formData.Age}    onChange={onChange} min="1" max="120" />
          <InputField  label="Altura (m)"name="Height" value={formData.Height} onChange={onChange} step="0.01" />
          <InputField  label="Peso (kg)" name="Weight" value={formData.Weight} onChange={onChange} step="0.1" />
          <SelectField label="Antecedentes Sobrepeso" name="family_history_with_overweight" value={formData.family_history_with_overweight} onChange={onChange} options={[{val:'yes',label:'Sí'},{val:'no',label:'No'}]} />
          <SelectField label="Comida Hipercalórica"   name="FAVC"  value={formData.FAVC}  onChange={onChange} options={[{val:'yes',label:'Sí'},{val:'no',label:'No'}]} />
          <SelectField label="Consumo Vegetales"      name="FCVC"  value={formData.FCVC}  onChange={onChange} options={[{val:1,label:'Nunca'},{val:2,label:'A veces'},{val:3,label:'Siempre'}]} />
          <InputField  label="Comidas Principales"    name="NCP"   value={formData.NCP}   onChange={onChange} min="1" max="4" />
          <SelectField label="Snacks"                 name="CAEC"  value={formData.CAEC}  onChange={onChange} options={['no','Sometimes','Frequently','Always']} />
          <SelectField label="Fumador"                name="SMOKE" value={formData.SMOKE} onChange={onChange} options={[{val:'yes',label:'Sí'},{val:'no',label:'No'}]} />
          <SelectField label="Agua (Lts)"             name="CH2O"  value={formData.CH2O}  onChange={onChange} options={[{val:1,label:'<1L'},{val:2,label:'1-2L'},{val:3,label:'>2L'}]} />
          <SelectField label="Monitoreo Calorías"     name="SCC"   value={formData.SCC}   onChange={onChange} options={[{val:'yes',label:'Sí'},{val:'no',label:'No'}]} />
          <SelectField label="Actividad Física"       name="FAF"   value={formData.FAF}   onChange={onChange} options={[{val:0,label:'Nada'},{val:1,label:'1-2 días'},{val:2,label:'2-4 días'},{val:3,label:'4-5 días'}]} />
          <InputField  label="Uso Pantallas (h)"      name="TUE"   value={formData.TUE}   onChange={onChange} min="0" max="24" />
          <SelectField label="Alcohol"                name="CALC"  value={formData.CALC}  onChange={onChange} options={['no','Sometimes','Frequently','Always']} />
          <div className="md:col-span-3">
            <SelectField label="Medio de Transporte" name="MTRANS" value={formData.MTRANS} onChange={onChange} options={['Public_Transportation','Walking','Automobile','Motorbike','Bike']} />
          </div>
        </div>

        <button
          onClick={handlePredict}
          disabled={isLoading}
          className="w-full mt-10 bg-[#2D5A27] text-white font-black py-4 rounded-2xl shadow-xl hover:bg-[#3d7a35] transition-all disabled:opacity-50 cursor-pointer uppercase text-[10px] tracking-[0.2em]"
        >
          {isLoading ? 'Calculando con IA...' : 'Generar Recomendaciones →'}
        </button>
      </div>

      {/* Columna derecha */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-[#4A5D44] p-6 rounded-[2rem] text-white shadow-xl">
          <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-4 italic">Vista previa del perfil</p>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-xl font-bold overflow-hidden">
              {avatar
                ? <img src={avatar} alt={username} className="w-full h-full object-cover" />
                : username[0]?.toUpperCase()
              }
            </div>
            <div>
              <h3 className="text-xl font-black">{username}</h3>
              <p className="text-[10px] opacity-60 uppercase">{formData.Age || '0'} años — {formData.Weight || '0'} kg</p>
              {formData.goal && (
                <p className="text-[9px] opacity-70 mt-1 capitalize">
                  🎯 {formData.goal === 'perder' ? 'Perder peso' : formData.goal === 'ganar' ? 'Ganar músculo' : 'Mantenerme'}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <p className="text-xs text-gray-300">Peso</p>
              <p className="text-lg font-black">{formData.Weight || '0'} kg</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <p className="text-xs text-gray-300">Altura</p>
              <p className="text-lg font-black">{currentBMI > 0 ? `${(formData.Height * 100).toFixed(0)} cm` : '0 cm'}</p>
            </div>
          </div>
        </div>

        {/* BMI meter */}
        <div className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Body Mass Index (BMI)</p>
          <div className="flex justify-center items-baseline gap-1.5 mb-5">
            <span className="text-5xl font-black tracking-tighter text-gray-950">{currentBMI > 0 ? currentBMI : '--'}</span>
            <span className="text-xs font-bold text-gray-300 italic">kg/m²</span>
          </div>
          <div className="h-3 w-full flex rounded-full overflow-hidden mb-2 relative bg-gray-50 shadow-inner">
            <div className="w-[20%] bg-blue-300" />
            <div className="w-[30%] bg-green-400" />
            <div className="w-[25%] bg-yellow-400" />
            <div className="flex-1 bg-red-400" />
            {currentBMI > 0 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-4 border-gray-950 shadow-lg transition-all duration-500 ease-out"
                style={{ left: `calc(${bmiInfo.position}% - 8px)` }}
              />
            )}
          </div>
          <div className="flex justify-between text-[8px] font-bold text-gray-400 uppercase tracking-wider px-1 mb-5">
            <span>Bajo peso</span><span>Normal</span><span>Sobrepeso</span><span>Obesidad</span>
          </div>
          <div className={`p-4 rounded-xl ${bmiInfo.text} bg-gray-50 border border-gray-100 flex flex-col gap-1 items-start`}>
            <p className="text-[10px] font-black uppercase tracking-widest">Clasificación: {bmiInfo.label}</p>
            <p className="text-[9px] opacity-70 font-bold italic text-left">BMI {currentBMI > 0 ? currentBMI : '--'} — Referencia escala WHO 2020</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 p-4 rounded-2xl flex items-start gap-3 text-green-800">
          <Info className="w-10 h-10 mt-0.5" />
          <p className="text-[10px] leading-relaxed font-semibold">
            <span className="font-bold">Aviso médico:</span> Este sistema no diagnostica enfermedades. Sus recomendaciones son orientativas.
          </p>
        </div>
      </div>
    </div>
  );
};