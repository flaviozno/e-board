const fieldClassName =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-400";

function HeaderConfigPanel({
  header,
  onHeaderChange,
  months,
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Professor(a)
          </label>
          <input
            className={fieldClassName}
            value={header.teacher}
            onChange={(e) => onHeaderChange("teacher", e.target.value)}
            placeholder="Nome do professor(a)"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Escola / CEMEI
          </label>
          <input
            className={fieldClassName}
            value={header.school}
            onChange={(e) => onHeaderChange("school", e.target.value)}
            placeholder="Nome da escola"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">Mês</label>
          <select
            className={fieldClassName}
            value={header.month}
            onChange={(e) => onHeaderChange("month", Number(e.target.value))}
          >
            {months.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">Ano</label>
          <input
            className={fieldClassName}
            type="number"
            value={header.year}
            onChange={(e) => onHeaderChange("year", Number(e.target.value))}
            placeholder="Ex: 2026"
          />
        </div>
      </div>
    </div>
  );
}

export default HeaderConfigPanel;
