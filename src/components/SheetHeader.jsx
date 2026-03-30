const fieldLineClass =
  "min-h-[18px] flex-1 border-b border-slate-400 px-1 pb-0.5 text-xs text-slate-800 print:text-[9px] print:pb-0";

function SheetHeader({ header, monthLabel, year }) {
  return (
    <div className="mb-4 rounded-xl border border-slate-200 bg-white px-4 py-3 print:mb-2 print:p-2 print:border print:rounded-none">
      <div className="mb-4 flex justify-center print:mb-2">
        <span className="text-sm font-semibold text-slate-700 print:text-[10px] print:font-bold">
          {monthLabel} / {year}
        </span>
      </div>

      <div className="space-y-2 print:space-y-1">
        <div className="flex items-end gap-2 print:gap-1">
          <span className="text-xs font-medium text-slate-600 print:text-[9px] print:whitespace-nowrap">
            Escola / CEMEI:
          </span>
          <div className={fieldLineClass}>{header.school}</div>
        </div>

        <div className="flex items-end gap-2 print:gap-1">
          <span className="text-xs font-medium text-slate-600 print:text-[9px] print:whitespace-nowrap">
            Professor(a):
          </span>
          <div className={fieldLineClass}>{header.teacher}</div>
        </div>
      </div>
    </div>
  );
}

export default SheetHeader;
