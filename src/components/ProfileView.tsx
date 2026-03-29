import { useMemo } from 'react';
import { healthService } from '../services/api';
import { InputField, SelectField } from './FormComponents';
import { User, Info } from 'lucide-react';

export const ProfileView = ({ formData, onChange, setIsLoading, isLoading, userEmail, username, setTips, setView, refreshData }: any) => {

  const currentIMC = useMemo(() => {
    if (formData.Weight && formData.Height && formData.Height > 0) {
      return parseFloat((formData.Weight / (formData.Height * formData.Height)).toFixed(1));
    }
    return 0;
  }, [formData.Weight, formData.Height]);

  const getIMCCategory = (imc: number) => {
    if (imc === 0) return { label: "Esperando datos", color: "bg-gray-100", text: "text-gray-400", position: 0 };
    if (imc < 18.5) return { label: "Bajo peso", color: "bg-blue-300", text: "text-blue-500", position: (imc / 18.5) * 20 }; 
    if (imc < 25) return { label: "Normal", color: "bg-green-400", text: "text-green-600", position: 20 + ((imc - 18.5) / 6.5) * 30 }; 
    if (imc < 30) return { label: "Sobrepeso", color: "bg-yellow-400", text: "text-yellow-600", position: 50 + ((imc - 25) / 5) * 25 };
    const obesityPos = 75 + ((imc - 30) / 10) * 25;
    return { label: "Obesidad", color: "bg-red-400", text: "text-red-600", position: Math.min(obesityPos, 100) }; 
  };

  const imcInfo = getIMCCategory(currentIMC);

  const handlePredict = async () => {
    if (!formData.Weight || !formData.Height || !formData.Age || !formData.Gender) {
      return alert("Por favor completa los campos básicos: Género, Edad, Altura y Peso.");
    }
    setIsLoading(true);
    try {
      const res = await healthService.predictObesity(userEmail, formData);
      if (res.status === "success") {
        setTips(res.recommendations?.map((t: string, i: number) => ({ id: i, text: t, status: 'pending' })) || []);
        setView('Dashboard'); 
        await refreshData();
      }
    } catch (err) {
      alert("Error en la predicción. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      {/* Columna Izquierda: Formulario */}
      <div className="lg:col-span-8 bg-[#F8EFE4]/60 p-8 rounded-[2.5rem] border border-white shadow-sm">
        <h2 className="text-3xl font-black text-[#2D5A27] mb-6 tracking-tight flex items-center gap-3">
          <User /> Tu perfil personalizado
        </h2>
        <p className="text-gray-500 text-xs mb-8 -mt-4">Completa tu información para que la IA genere recomendaciones adaptadas.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          <SelectField label="Género" name="Gender" value={formData.Gender} onChange={onChange} options={["Male", "Female"]} />
          <InputField label="Edad" name="Age" value={formData.Age} onChange={onChange} min="1" max="120" />
          <InputField label="Altura (m)" name="Height" value={formData.Height} onChange={onChange} step="0.01" />
          <InputField label="Peso (kg)" name="Weight" value={formData.Weight} onChange={onChange} step="0.1" />
          <SelectField label="Antecedentes Sobrepeso" name="family_history_with_overweight" value={formData.family_history_with_overweight} onChange={onChange} options={[{val:"yes", label:"Sí"}, {val:"no", label:"No"}]} />
          <SelectField label="Comida Hipercalórica" name="FAVC" value={formData.FAVC} onChange={onChange} options={[{val:"yes", label:"Sí"}, {val:"no", label:"No"}]} />
          <SelectField label="Consumo Vegetales (1-3)" name="FCVC" value={formData.FCVC} onChange={onChange} options={[{val:1, label:"Nunca"}, {val:2, label:"A veces"}, {val:3, label:"Siempre"}]} />
          <InputField label="Comidas Principales" name="NCP" value={formData.NCP} onChange={onChange} min="1" max="4" />
          <SelectField label="Snacks" name="CAEC" value={formData.CAEC} onChange={onChange} options={["no", "Sometimes", "Frequently", "Always"]} />
          <SelectField label="Fumador" name="SMOKE" value={formData.SMOKE} onChange={onChange} options={[{val:"yes", label:"Sí"}, {val:"no", label:"No"}]} />
          <SelectField label="Agua (Lts)" name="CH2O" value={formData.CH2O} onChange={onChange} options={[{val:1, label:"<1L"}, {val:2, label:"1-2L"}, {val:3, label:">2L"}]} />
          <SelectField label="Monitoreo Calorías" name="SCC" value={formData.SCC} onChange={onChange} options={[{val:"yes", label:"Sí"}, {val:"no", label:"No"}]} />
          <SelectField label="Actividad Física (Días)" name="FAF" value={formData.FAF} onChange={onChange} options={[{val:0, label:"Nada"}, {val:1, label:"1-2 días"}, {val:2, label:"2-4 días"}, {val:3, label:"4-5 días"}]} />
          <InputField label="Uso de Pantallas (Horas)" name="TUE" value={formData.TUE} onChange={onChange} min="0" max="24" />
          <SelectField label="Alcohol" name="CALC" value={formData.CALC} onChange={onChange} options={["no", "Sometimes", "Frequently", "Always"]} />
          <div className="md:col-span-3">
            <SelectField label="Medio de Transporte" name="MTRANS" value={formData.MTRANS} onChange={onChange} options={["Public_Transportation", "Walking", "Automobile", "Motorbike", "Bike"]} />
          </div>
        </div>
        <button onClick={handlePredict} disabled={isLoading} className="w-full mt-10 bg-[#2D5A27] text-white font-black py-4 rounded-2xl shadow-xl hover:bg-[#3d7a35] transition-all disabled:opacity-50 cursor-pointer uppercase text-[10px] tracking-[0.2em]">
          {isLoading ? 'Calculando con IA...' : 'Generar Recomendaciones →'}
        </button>
      </div>

      {/* Columna Derecha: Vista Previa y Gráfica OMS */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-[#4A5D44] p-6 rounded-[2rem] text-white shadow-xl">
          <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-4 italic">Vista previa del perfil</p>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-xl font-bold">{username[0]}</div>
            <div>
              <h3 className="text-xl font-black">{username}</h3>
              <p className="text-[10px] opacity-60 uppercase">{formData.Age || '0'} años - {formData.Weight || '0'}kg</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10"><p className="text-xs text-gray-300">Peso</p><p className="text-lg font-black">{formData.Weight || '0'}kg</p></div>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10"><p className="text-xs text-gray-300">Altura</p><p className="text-lg font-black">{currentIMC > 0 ? `${(formData.Height * 100).toFixed(0)}cm` : '0cm'}</p></div>
          </div>
        </div>
        
        {/* Recuadro IMC Actual - Estilo de la imagen de referencia */}
        <div className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm text-center relative overflow-hidden">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Índice de Masa Corporal (IMC)</p>
          <div className="flex justify-center items-baseline gap-1.5 mb-5">
            <span className="text-5xl font-black tracking-tighter text-gray-950">{currentIMC > 0 ? currentIMC : '--'}</span>
            <span className="text-xs font-bold text-gray-300 italic">kg/m^2</span>
          </div>

          {/* Gráfica OMS de Colores */}
          <div className="h-3 w-full flex rounded-full overflow-hidden mb-2 relative bg-gray-50 shadow-inner">
            <div className="w-[20%] bg-blue-300"></div> {/* Bajo Peso */}
            <div className="w-[30%] bg-green-400"></div> {/* Normal */}
            <div className="w-[25%] bg-yellow-400"></div> {/* Sobrepeso */}
            <div className="flex-1 bg-red-400"></div>    {/* Obesidad */}
            
            {/* Punto Indicador Dinámico */}
            {currentIMC > 0 && (
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-4 border-gray-950 shadow-lg transition-all duration-500 ease-out"
                style={{ left: `calc(${imcInfo.position}% - 8px)` }}
              />
            )}
          </div>
          
          {/* Etiquetas OMS */}
          <div className="flex justify-between text-[8px] font-bold text-gray-400 uppercase tracking-wider px-1 mb-5">
            <span>Bajo peso</span>
            <span>Normal</span>
            <span>Sobrepeso</span>
            <span>Obesidad</span>
          </div>

          <div className={`p-4 rounded-xl ${imcInfo.text} bg-gray-50 border border-gray-100 flex flex-col gap-1 items-start`}>
            <p className="text-[10px] font-black uppercase tracking-widest">Clasificación: {imcInfo.label}</p>
            <p className="text-[9px] opacity-70 font-bold italic text-left">IMC {currentIMC > 0 ? currentIMC : '--'} - Referencia escala OMS 2020</p>
          </div>
        </div>

        {/* Aviso Médico*/}
        <div className="bg-green-50 border border-green-200 p-4 rounded-2xl flex items-start gap-3 text-green-800 hover:border-green-300 transition-colors cursor-default">
          <Info className="w-10 h-10 mt-0.5" />
          <p className="text-[10px] leading-relaxed font-semibold">
            <span className="font-bold">Aviso médico:</span> Este sistema no diagnostica enfermedades. Sus recomendaciones son orientativas y complementarias al seguimiento médico profesional.
          </p>
        </div>
      </div>
    </div>
  );
};