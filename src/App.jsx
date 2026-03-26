import { useEffect, useState } from "react";
import { ClipboardPen, Table, Lock } from "lucide-react";
import AttendancePage from "./components/AttendancePage";
import CreativeBoardPage from "./components/CreativeBoardPage";

function App() {
  const [mode, setMode] = useState("attendance");

  useEffect(() => {
    const styleId = "dynamic-print-page-style";
    let styleTag = document.getElementById(styleId);

    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    const orientation = mode === "attendance" ? "landscape" : "portrait";
    styleTag.textContent = `@media print { @page { size: A4 ${orientation}; margin: 8mm; } }`;

    return () => {
      const existing = document.getElementById(styleId);
      if (existing) {
        existing.remove();
      }
    };
  }, [mode]);

  return (
    <div className="relative min-h-screen pb-10">
      <div className="fixed left-1/2 top-3 z-50 flex -translate-x-1/2 gap-2 rounded-2xl border border-cyan-200 bg-white/90 p-2 shadow-lg shadow-cyan-500/20 backdrop-blur print:hidden">
        <button
          type="button"
          onClick={() => setMode("attendance")}
          className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${
            mode === "attendance"
              ? "bg-cyan-600 text-white"
              : "bg-cyan-50 text-cyan-900 hover:bg-cyan-100"
          }`}
        >
          <Table size={16} />
          Lista de chamada
        </button>

        <button
          type="button"
          onClick={() => setMode("board")}
          className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${
            mode === "board"
              ? "bg-cyan-600 text-white"
              : "bg-cyan-50 text-cyan-900 hover:bg-cyan-100"
          }`}
        >
          <ClipboardPen size={16} />
          Lousa
        </button>

        <button
          type="button"
          disabled
          title="Novas features virao em breve"
          className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-sky-200 bg-sky-50/70 px-3 py-2 text-sm font-bold text-sky-400 opacity-70"
        >
          <Lock size={16} />
          Em breve
        </button>
      </div>

      {mode === "attendance" ? <AttendancePage /> : <CreativeBoardPage />}

      <footer className="absolute inset-x-0 bottom-2 text-center text-xs font-semibold tracking-wide text-cyan-800/80 print:hidden">
        Feito por{" "}
        <a
          href="https://github.com/flaviozno"
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto underline decoration-cyan-500 underline-offset-2 hover:text-cyan-700"
        >
          flaviozno
        </a>
      </footer>
    </div>
  );
}

export default App;
