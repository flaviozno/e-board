import { useEffect, useState } from "react";
import { ClipboardPen, Table, Lock, Menu, X } from "lucide-react";
import AttendancePage from "./components/AttendancePage";
import CreativeBoardPage from "./components/CreativeBoardPage";
import HomePage from "./components/HomePage";

function App() {
  const [mode, setMode] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="flex min-h-screen bg-slate-50">
      {mode !== "home" && (
        <nav
          className={`fixed left-0 top-0 h-screen border-r border-slate-200 bg-white print:hidden shadow-lg transition-all duration-300 ease-in-out z-40 ${
            sidebarOpen ? "w-64" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col p-6">
            <div className="flex items-center justify-between mb-8">
              <div
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => {
                  setMode("home");
                  setSidebarOpen(false);
                }}
              >
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-slate-900">E-Board</h1>
                  <p className="text-xs text-slate-500">
                    Facilitando o dia a dia dos professores
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSidebarOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors flex-shrink-0"
                title="Retrair"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 flex-1">
              <button
                type="button"
                onClick={() => {
                  setMode("attendance");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 rounded-lg px-4 py-3.5 text-sm font-semibold transition-all ${
                  mode === "attendance"
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
                title="Lista de Chamada"
              >
                <Table size={20} className="flex-shrink-0" />
                <span>Lista de Chamada</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("board");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 rounded-lg px-4 py-3.5 text-sm font-semibold transition-all ${
                  mode === "board"
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
                title="Lousa Criativa"
              >
                <ClipboardPen size={20} className="flex-shrink-0" />
                <span>Lousa Criativa</span>
              </button>

              <button
                type="button"
                disabled
                title="Novas features virão em breve"
                className="w-full flex items-center gap-4 rounded-lg border border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-400 opacity-60 cursor-not-allowed hover:bg-slate-50 transition-all"
              >
                <Lock size={20} className="flex-shrink-0" />
                <span>Em breve</span>
              </button>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 text-center border border-slate-200">
              <p className="text-xs font-medium text-slate-600">
                Feito por{" "}
                <a
                  href="https://github.com/flaviozno"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-slate-900 hover:text-slate-700 underline"
                >
                  flaviozno
                </a>
              </p>
            </div>
          </div>
        </nav>
      )}

      {mode !== "home" && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-4 top-4 z-40 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-all print:hidden"
          title="Expandir"
        >
          <Menu size={24} />
        </button>
      )}

      {sidebarOpen && mode !== "home" && (
        <div
          className="fixed inset-0 z-30 hidden lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 transition-all duration-300">
        {mode === "home" ? (
          <HomePage onNavigate={setMode} />
        ) : mode === "attendance" ? (
          <AttendancePage />
        ) : (
          <CreativeBoardPage />
        )}
      </main>
    </div>
  );
}

export default App;
