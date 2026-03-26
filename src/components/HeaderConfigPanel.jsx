import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const fieldClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function HeaderConfigPanel({
  header,
  onHeaderChange,
  months,
  title,
  icon: Icon,
  collapsible = false,
  defaultCollapsed = false,
}) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className="mb-4 rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-2.5 text-sm font-bold text-slate-800">
        <div className="flex items-center gap-2.5">
          {Icon ? <Icon size={18} className="text-sky-700" /> : null}
          {title}
        </div>
        {collapsible ? (
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-sky-200 bg-white text-slate-700 hover:bg-sky-50"
            aria-label={isCollapsed ? "Expandir cabecalho" : "Recolher cabecalho"}
            title={isCollapsed ? "Expandir" : "Recolher"}
          >
            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        ) : null}
      </div>

      {!isCollapsed ? (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-1">
            <label className="text-xs font-bold text-slate-700">Professor(a)</label>
            <input className={fieldClassName} value={header.teacher} onChange={(e) => onHeaderChange("teacher", e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-1">
            <label className="text-xs font-bold text-slate-700">Escola / CEMEI</label>
            <input className={fieldClassName} value={header.school} onChange={(e) => onHeaderChange("school", e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-1">
            <label className="text-xs font-bold text-slate-700">Turma</label>
            <input className={fieldClassName} value={header.className} onChange={(e) => onHeaderChange("className", e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-1">
            <label className="text-xs font-bold text-slate-700">Turno</label>
            <input className={fieldClassName} value={header.shift} onChange={(e) => onHeaderChange("shift", e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-1">
            <label className="text-xs font-bold text-slate-700">Mes</label>
            <select className={fieldClassName} value={header.month} onChange={(e) => onHeaderChange("month", Number(e.target.value))}>
              {months.map((month, index) => (
                <option key={month} value={index + 1}>{month}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-1">
            <label className="text-xs font-bold text-slate-700">Ano</label>
            <input className={fieldClassName} type="number" value={header.year} onChange={(e) => onHeaderChange("year", Number(e.target.value))} />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-1">
            <label className="text-xs font-bold text-slate-700">Sala</label>
            <input className={fieldClassName} value={header.room} onChange={(e) => onHeaderChange("room", e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-1">
            <label className="text-xs font-bold text-slate-700">Periodo</label>
            <input className={fieldClassName} value={header.period} onChange={(e) => onHeaderChange("period", e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-700">Observacoes</label>
            <textarea className={`${fieldClassName} min-h-[72px] resize-y`} value={header.notes} onChange={(e) => onHeaderChange("notes", e.target.value)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default HeaderConfigPanel;
