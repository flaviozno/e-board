import { useMemo, useState } from "react";
import { CalendarDays, Printer, School, Users, Eraser } from "lucide-react";
import SheetHeader from "./SheetHeader";
import HeaderConfigPanel from "./HeaderConfigPanel";

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Marco",
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

const DEFAULT_YEAR = new Date().getFullYear();
const DEFAULT_MONTH = new Date().getMonth() + 1;

const INITIAL_HEADER = {
  teacher: "",
  school: "",
  className: "",
  shift: "",
  month: DEFAULT_MONTH,
  year: DEFAULT_YEAR,
  room: "",
  period: "",
  notes: "",
};

const normalizeName = (name) =>
  name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const removeAccents = (value) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const abbreviateName = (fullName) => {
  const clean = normalizeName(fullName);
  const parts = clean.split(" ").filter(Boolean);

  if (parts.length <= 2) return clean;

  const firstName = parts[0];
  const lastName = parts[parts.length - 1];
  const middle = parts
    .slice(1, -1)
    .map((part) => `${part.charAt(0)}.`)
    .join(" ");

  const short = `${firstName} ${middle} ${lastName}`
    .replace(/\s+/g, " ")
    .trim();

  return short.length > 24
    ? `${firstName} ${parts
        .slice(1, -1)
        .map((part) => part.charAt(0))
        .join(". ")}. ${lastName}`.replace(/\s+/g, " ")
    : short;
};

const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();
const getWeekday = (year, month, day) =>
  new Date(year, month - 1, day).getDay();

const getWeekdayLabel = (year, month, day) => {
  const weekday = getWeekday(year, month, day);
  const labels = ["D", "S", "T", "Q", "Q", "S", "S"];
  return labels[weekday];
};

const getWeekendClass = (weekday) => {
  if (weekday === 0) return "bg-sky-200";
  if (weekday === 6) return "bg-sky-100";
  return "bg-white";
};

const getDayHeaderClass = (weekday) => {
  if (weekday === 0) return "bg-sky-300 text-sky-950";
  if (weekday === 6) return "bg-sky-200 text-sky-900";
  return "bg-cyan-100 text-cyan-900";
};

const chipColorClasses = [
  "border-cyan-200 bg-cyan-50 text-cyan-700",
  "border-sky-200 bg-sky-50 text-sky-700",
  "border-blue-200 bg-blue-50 text-blue-700",
  "border-indigo-200 bg-indigo-50 text-indigo-700",
  "border-cyan-300 bg-cyan-100 text-cyan-800",
  "border-sky-300 bg-sky-100 text-sky-800",
];

const fieldClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function AttendancePage() {
  const [header, setHeader] = useState(INITIAL_HEADER);
  const [studentsInput, setStudentsInput] = useState("");

  const students = useMemo(() => {
    return studentsInput
      .split("\n")
      .map((name) => normalizeName(name))
      .filter(Boolean)
      .filter((value, index, arr) => arr.indexOf(value) === index)
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
    return Array.from({ length: total }, (_, index) => index + 1);
  }, [header.month, header.year]);

  const handleHeaderChange = (key, value) => {
    setHeader((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClear = () => {
    setHeader(INITIAL_HEADER);
    setStudentsInput("");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.2),transparent_35%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.16),transparent_35%),linear-gradient(to_bottom,#f0f9ff,#ecfeff)] px-4 py-8 text-slate-900 print:bg-white print:p-0">
      <div className="mx-auto grid w-full max-w-[1500px] items-start gap-6 xl:grid-cols-[380px_1fr] print:block print:max-w-none">
        <aside className="rounded-[28px] border border-cyan-200/70 bg-white/90 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-lg xl:sticky xl:top-6 print:hidden">
          <div className="mb-2 flex items-center gap-3 text-2xl font-extrabold text-slate-900">
            <CalendarDays size={24} className="text-cyan-700" />
            <span className="bg-gradient-to-r from-cyan-700 via-sky-700 to-blue-700 bg-clip-text text-transparent">
              Gerador de Chamada
            </span>
          </div>
          <p className="mb-6 text-sm leading-relaxed text-slate-500">
            Monte a folha de presenca e imprima em A4 paisagem.
          </p>

          <HeaderConfigPanel
            header={header}
            onHeaderChange={handleHeaderChange}
            months={MONTHS}
            title="Informacoes da folha"
            icon={School}
            collapsible
          />

          <div className="mb-6 rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
            <div className="mb-4 flex items-center gap-2.5 text-sm font-bold text-slate-800">
              <Users size={18} className="text-sky-700" />
              Lista de alunos
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700">
                Digite um nome por linha
              </label>
              <textarea
                className={`${fieldClassName} min-h-[220px] resize-y leading-relaxed`}
                value={studentsInput}
                onChange={(e) => setStudentsInput(e.target.value)}
              />
            </div>

            <div className="mt-3.5 flex flex-wrap gap-2">
              {students.slice(0, 8).map((student, index) => (
                <span
                  key={student.id}
                  className={`rounded-full border px-3 py-2 text-xs font-bold ${chipColorClasses[index % chipColorClasses.length]}`}
                >
                  {student.shortName}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-700 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5"
              onClick={() => window.print()}
            >
              <Printer size={18} />
              Imprimir
            </button>

            <button
              className="inline-flex items-center gap-2.5 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3.5 text-sm font-extrabold text-sky-900 transition hover:bg-sky-100"
              onClick={handleClear}
            >
              <Eraser size={18} />
              Limpar
            </button>
          </div>
        </aside>

        <main className="overflow-auto pb-5 print:overflow-visible print:pb-0">
          <div className="flex justify-start xl:justify-center print:block">
            <section className="w-[297mm] min-h-[210mm] rounded-[20px] bg-white p-[8mm] text-slate-900 shadow-2xl shadow-sky-900/15 print:w-full print:min-h-0 print:rounded-none print:p-0 print:shadow-none">
              <SheetHeader
                header={header}
                monthLabel={MONTHS[header.month - 1]}
                year={header.year}
              />

              <div className="overflow-x-auto rounded-xl border-2 border-cyan-900 print:overflow-visible">
                <table className="w-full table-fixed border-collapse">
                  <thead>
                    <tr>
                      <th className="w-[30%] border border-cyan-900 bg-cyan-100 px-1.5 py-1 text-left text-[10px] font-bold text-cyan-900 print:px-1 print:py-0.5 print:text-[9px]">
                        Nome do aluno
                      </th>
                      {days.map((day) => {
                        const weekday = getWeekday(
                          header.year,
                          header.month,
                          day,
                        );

                        return (
                          <th
                            key={day}
                            className={`h-[14mm] border border-cyan-900 text-[9px] font-extrabold print:h-[9mm] print:text-[8px] ${getDayHeaderClass(weekday)}`}
                          >
                            <div className="flex h-full flex-col items-center justify-center gap-0.5">
                              <span className="text-[10px] font-extrabold print:text-[8px]">
                                {day}
                              </span>
                              <span className="text-[8px] font-bold text-slate-600 print:text-[7px]">
                                {getWeekdayLabel(
                                  header.year,
                                  header.month,
                                  day,
                                )}
                              </span>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  <tbody>
                    {students.length > 0
                      ? students.map((student) => (
                          <tr key={student.id}>
                            <td
                              className="w-[30%] truncate border border-cyan-900 px-1.5 py-1 text-left text-[10px] font-bold print:px-1 print:py-0.5 print:text-[9px]"
                              title={student.fullName}
                            >
                              {student.shortName}
                            </td>

                            {days.map((day) => {
                              const weekday = getWeekday(
                                header.year,
                                header.month,
                                day,
                              );

                              return (
                                <td
                                  key={`${student.id}-${day}`}
                                  className={`h-[9mm] border border-cyan-900 print:h-[7mm] ${getWeekendClass(weekday)}`}
                                />
                              );
                            })}
                          </tr>
                        ))
                      : Array.from({ length: 12 }).map((_, rowIndex) => (
                          <tr key={`empty-${rowIndex}`}>
                            <td className="w-[30%] border border-cyan-900 px-1.5 py-1 text-left text-[10px] font-bold print:px-1 print:py-0.5 print:text-[9px]">
                              &nbsp;
                            </td>
                            {days.map((day) => {
                              const weekday = getWeekday(
                                header.year,
                                header.month,
                                day,
                              );
                              return (
                                <td
                                  key={`empty-${rowIndex}-${day}`}
                                  className={`h-[9mm] border border-cyan-900 print:h-[7mm] ${getWeekendClass(weekday)}`}
                                />
                              );
                            })}
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AttendancePage;
