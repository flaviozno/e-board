import { ArrowRight, ClipboardPen, Table } from "lucide-react";

function HomePage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center mb-20">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            E-Board
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Facilitando o dia a dia dos professores com ferramentas simples e
            eficientes
          </p>
          <p className="text-sm text-slate-500">
            Gerencie sua sala de aula de forma inteligente
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <div
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer"
            onClick={() => onNavigate("attendance")}
          >
            <div className="mb-4 inline-block p-4 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Table size={32} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Lista de Chamada
            </h2>
            <p className="text-slate-600 mb-6">
              Crie e imprima listas de chamada personalizadas. Organize por mês,
              adicione nomes de alunos e ajuste automaticamente o layout.
            </p>
            <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
              Acessar
              <ArrowRight size={20} className="ml-2" />
            </div>
          </div>

          <div
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer"
            onClick={() => onNavigate("board")}
          >
            <div className="mb-4 inline-block p-4 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <ClipboardPen size={32} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Lousa Criativa
            </h2>
            <p className="text-slate-600 mb-6">
              Uma lousa digital para criar conteúdo interativo. Ideal para
              apresentações e atividades criativas em sala de aula.
            </p>
            <div className="flex items-center text-purple-600 font-semibold group-hover:gap-2 transition-all">
              Acessar
              <ArrowRight size={20} className="ml-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
