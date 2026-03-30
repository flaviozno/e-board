import { useMemo, useState, useRef, useEffect } from "react";
import { CalendarDays, Printer, Eraser } from "lucide-react";
import SheetHeader from "./SheetHeader";
import HeaderConfigPanel from "./HeaderConfigPanel";

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const WEEKDAY_ABBREVIATIONS = ["D", "S", "T", "Q", "Q", "S", "S"];

const DEFAULT_YEAR = new Date().getFullYear();
const DEFAULT_MONTH = new Date().getMonth() + 1;

const INITIAL_HEADER = {
  teacher: "",
  school: "",
  month: DEFAULT_MONTH,
  year: DEFAULT_YEAR,
};

const normalizeName = (name) =>
  name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const removeAccents = (value) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const abbreviateName = (fullName) => {
  const clean = normalizeName(fullName);
  const parts = clean.split(" ").filter(Boolean);

  if (parts.length <= 2) return clean;

  const first = parts[0];
  const last = parts[parts.length - 1];
  const middle = parts
    .slice(1, -1)
    .map((p) => `${p[0]}.`)
    .join(" ");

  const short = `${first} ${middle} ${last}`.replace(/\s+/g, " ").trim();

  return short.length > 24
    ? `${first} ${parts
        .slice(1, -1)
        .map((p) => p[0])
        .join(". ")}. ${last}`
    : short;
};

const getDaysInMonth = (m, y) => new Date(y, m, 0).getDate();
const getWeekday = (y, m, d) => new Date(y, m - 1, d).getDay();

const getWeekdayLabel = (y, m, d) => WEEKDAY_ABBREVIATIONS[getWeekday(y, m, d)];

const getWeekendClass = (w) =>
  w === 0 ? "bg-slate-100" : w === 6 ? "bg-slate-50" : "bg-white";

const getDayHeaderClass = (w) =>
  w === 0 || w === 6
    ? "bg-slate-200 text-slate-800"
    : "bg-slate-100 text-slate-700";

const getOptimalOrientation = (studentCount) => {
  return studentCount > 29 ? "portrait" : "landscape";
};

const getOptimalRowHeight = (studentCount, orientation) => {
  const maxHeightMm = orientation === "portrait" ? 261 : 174;
  const availableHeight = maxHeightMm - 35;
  const rowHeight = Math.max(3.5, availableHeight / Math.max(studentCount, 1));
  return rowHeight;
};

const getOptimalFontSize = (studentCount) => {
  if (studentCount <= 15) return "8px";
  if (studentCount <= 25) return "7px";
  if (studentCount <= 35) return "6px";
  return "5px";
};

function AttendancePage() {
  const [header, setHeader] = useState(INITIAL_HEADER);
  const [studentsInput, setStudentsInput] = useState("");
  const [scale, setScale] = useState(1);

  const printRef = useRef(null);

  const students = useMemo(() => {
    return studentsInput
      .split("\n")
      .map(normalizeName)
      .filter(Boolean)
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .sort((a, b) =>
        removeAccents(a).localeCompare(removeAccents(b), "pt-BR", {
          sensitivity: "base",
        }),
      )
      .map((fullName) => ({
        id: crypto.randomUUID(),
        fullName,
        shortName: abbreviateName(fullName),
      }));
  }, [studentsInput]);

  const days = useMemo(() => {
    const total = getDaysInMonth(header.month, header.year);
    return Array.from({ length: total }, (_, i) => i + 1);
  }, [header.month, header.year]);

  const orientation = useMemo(() => {
    return getOptimalOrientation(students.length);
  }, [students.length]);

  const handleHeaderChange = (key, value) => {
    setHeader((prev) => ({ ...prev, [key]: value }));
  };

  const handleClear = () => {
    setHeader(INITIAL_HEADER);
    setStudentsInput("");
  };

  useEffect(() => {
    let timeoutId;

    const adjustScale = () => {
      const el = printRef.current;
      if (!el) return;

      const isPortrait = orientation === "portrait";
      const A4_HEIGHT_PX = isPortrait ? 1122 : 794;
      const A4_WIDTH_PX = isPortrait ? 794 : 1122;

      const contentH = el.scrollHeight;
      const contentW = el.scrollWidth;

      const scaleH = contentH > A4_HEIGHT_PX ? A4_HEIGHT_PX / contentH : 1;
      const scaleW = contentW > A4_WIDTH_PX ? A4_WIDTH_PX / contentW : 1;

      setScale(Math.min(scaleH, scaleW));
    };

    adjustScale();

    const debounced = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(adjustScale, 200);
    };

    window.addEventListener("resize", debounced);
    return () => {
      window.removeEventListener("resize", debounced);
      clearTimeout(timeoutId);
    };
  }, [header.month, header.year, students.length, orientation]);

  return (
    <div className="min-h-screen bg-slate-100 px-2 py-4 sm:px-4 sm:py-6 print:bg-white print:p-0">
      {/* Force single A4 page on print - auto-orient based on content */}
      <style>{`
        :root {
          --row-height-mm: ${getOptimalRowHeight(students.length, orientation)}mm;
          --font-size: ${getOptimalFontSize(students.length)};
        }
        @media print {
          @page {
            size: A4 ${orientation};
            margin: 0;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
          }
          .print-sheet {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            transform: none !important;
            padding: 4mm !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .print-table {
            flex: 1 !important;
            width: 100% !important;
          }
          .print-row {
            height: var(--row-height-mm) !important;
          }
          .student-name {
            font-size: var(--font-size) !important;
            line-height: 1 !important;
          }
        }
      `}</style>
      <div className="mx-auto grid max-w-7xl gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-[340px_1fr] print:block">
        {/* CONFIG */}
        <aside className="rounded-xl border bg-white p-4 sm:p-5 print:hidden lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
          <div className="mb-4 flex items-center gap-2 text-lg font-bold">
            <CalendarDays size={20} />
            Gerador de Chamada
          </div>

          <HeaderConfigPanel
            header={header}
            onHeaderChange={handleHeaderChange}
            months={MONTHS}
          />

          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-600">
                Alunos
              </label>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  students.length > 40
                    ? "bg-red-100 text-red-700"
                    : students.length >= 35
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-500"
                }`}
              >
                {students.length}/40
              </span>
            </div>
            <textarea
              className={`w-full border rounded-md p-2 text-sm resize-none transition-colors ${
                students.length > 40
                  ? "border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
                  : "border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400"
              }`}
              rows={10}
              placeholder="Um aluno por linha (máx. 40)"
              value={studentsInput}
              onChange={(e) => setStudentsInput(e.target.value)}
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-700 active:scale-95 transition-all text-sm font-medium shadow-sm"
            >
              <Printer size={15} />
              Imprimir
            </button>

            <button
              onClick={handleClear}
              className="flex-1 flex items-center justify-center gap-2 border border-slate-300 text-slate-600 py-2 px-3 rounded-lg hover:bg-slate-50 hover:border-slate-400 active:scale-95 transition-all text-sm font-medium"
            >
              <Eraser size={15} />
              Limpar
            </button>
          </div>

          {/* Status indicator */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  orientation === "portrait"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                {orientation === "portrait" ? "📄 Vertical" : "📋 Horizontal"}
              </span>
              <span className="text-xs text-slate-400">
                orientação automática
              </span>
            </div>

            {students.length > 40 && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                <span className="text-base leading-none">⚠️</span>
                <div>
                  <p className="font-semibold">Limite excedido!</p>
                  <p>
                    Máximo de <strong>40 alunos</strong> para garantir 1 página.
                    Remova {students.length - 40} aluno(s).
                  </p>
                </div>
              </div>
            )}

            {students.length >= 35 && students.length <= 40 && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                <span className="text-base leading-none">⚡</span>
                <p>
                  Próximo do limite. Restam{" "}
                  <strong>{40 - students.length}</strong> vaga(s).
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* PRINT */}
        <main className="flex justify-center print:block overflow-x-auto">
          <section
            ref={printRef}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top center",
              width: orientation === "portrait" ? "210mm" : "297mm",
            }}
            className="print-sheet bg-white p-[3mm] print:w-full print:p-0"
          >
            <SheetHeader
              header={header}
              monthLabel={MONTHS[header.month - 1]}
              year={header.year}
            />

            <table className="w-full table-fixed border-collapse print:text-[9px]">
              <thead>
                <tr>
                  <th className="w-[30%] border text-left text-xs print:text-[8px] print:p-0.5">
                    Nome
                  </th>
                  {days.map((day) => {
                    const w = getWeekday(header.year, header.month, day);
                    return (
                      <th
                        key={day}
                        className={`border text-[10px] print:text-[7px] print:p-0 print:py-0.5 ${getDayHeaderClass(w)}`}
                      >
                        <div className="print:text-[7px] print:m-0">{day}</div>
                        <div className="text-[8px] print:text-[6px] print:m-0">
                          {getWeekdayLabel(header.year, header.month, day)}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="print-row print:h-[6mm]">
                    <td className="student-name border text-xs px-1 print:text-[8px] print:p-0.5 print:h-[6mm] overflow-hidden">
                      {s.shortName}
                    </td>

                    {days.map((day) => {
                      const w = getWeekday(header.year, header.month, day);
                      return (
                        <td
                          key={day}
                          className={`border h-[8mm] print:h-[6mm] print:p-0 ${getWeekendClass(w)}`}
                        />
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
}

export default AttendancePage;
