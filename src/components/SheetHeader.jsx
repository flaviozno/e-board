const fieldLineClass = "min-h-[18px] flex-1 border-b border-slate-900 px-1 pb-0.5 text-xs";

function SheetHeader({ header, monthLabel, year }) {
  return (
    <div className="mb-3 rounded-xl border-2 border-cyan-900 px-3 py-2.5">
      <div className="mb-2.5 flex items-center justify-between gap-4">
        <div className="bg-gradient-to-r from-cyan-700 via-sky-700 to-blue-700 bg-clip-text text-lg font-extrabold uppercase tracking-[0.06em] text-transparent">
          Lista de Chamada
        </div>
        <div className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-bold text-cyan-900">
          {monthLabel} / {year}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.6fr_1.4fr]">
        <div className="flex flex-col gap-2.5">
          <div className="flex min-h-[22px] items-end gap-2">
            <span className="whitespace-nowrap text-xs font-bold">Professor(a):</span>
            <div className={fieldLineClass}>{header.teacher}</div>
          </div>

          <div className="flex min-h-[22px] items-end gap-2">
            <span className="whitespace-nowrap text-xs font-bold">Escola / CEMEI:</span>
            <div className={fieldLineClass}>{header.school}</div>
          </div>

          <div className="flex min-h-[22px] items-end gap-2">
            <span className="whitespace-nowrap text-xs font-bold">Turma:</span>
            <div className={fieldLineClass}>{header.className}</div>
          </div>

          <div className="flex min-h-[22px] items-end gap-2">
            <span className="whitespace-nowrap text-xs font-bold">Turno:</span>
            <div className={fieldLineClass}>{header.shift}</div>
          </div>

          <div className="flex min-h-[22px] items-end gap-2">
            <span className="whitespace-nowrap text-xs font-bold">Sala:</span>
            <div className={fieldLineClass}>{header.room}</div>
          </div>

          <div className="flex min-h-[22px] items-end gap-2">
            <span className="whitespace-nowrap text-xs font-bold">Periodo:</span>
            <div className={fieldLineClass}>{header.period}</div>
          </div>
        </div>

        <div className="min-h-full whitespace-pre-wrap rounded-[10px] border border-cyan-900 bg-cyan-50/50 p-2 text-xs">
          <strong>Observacoes:</strong>
          <br />
          {header.notes}
        </div>
      </div>
    </div>
  );
}

export default SheetHeader;
