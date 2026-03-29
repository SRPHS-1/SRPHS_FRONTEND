export const InputField = ({ label, name, value, onChange, type = "number", min, max, step = "1" }: any) => (
  <div className="flex flex-col gap-1">
    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      type={type} step={step} min={min} max={max}
      value={value ?? ""} 
      onChange={e => {
        const val = e.target.value;
        onChange(name, val === "" ? "" : (type === "number" ? Number(val) : val));
      }}
      className="p-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#2D5A27] outline-none text-xs shadow-sm transition-all"
    />
  </div>
);

export const SelectField = ({ label, name, value, onChange, options }: any) => (
  <div className="flex flex-col gap-1">
    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
    <select 
      value={value ?? ""} 
      onChange={e => onChange(name, e.target.value)}
      className="p-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#2D5A27] outline-none text-xs cursor-pointer shadow-sm appearance-none hover:bg-gray-50 transition-colors"
    >
      <option value="">Seleccione...</option>
      {options.map((opt: any) => (
        <option key={opt.val || opt} value={opt.val ?? opt}>{opt.label || opt}</option>
      ))}
    </select>
  </div>
);