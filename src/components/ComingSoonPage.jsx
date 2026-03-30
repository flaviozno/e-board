import { ArrowRight, BarChart3, Zap, ArrowLeft } from "lucide-react";

function ComingSoonPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Em Breve 🚀
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 mb-4 max-w-2xl mx-auto">
            Novas funcionalidades incríveis estão chegando
          </p>
          <p className="text-sm text-slate-500">
            Recursos mais poderosos para potencializar sua sala de aula
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-105">
            <div className="mb-4 inline-block p-4 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
              <Zap size={32} className="text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Board - Projeção Iterativa
            </h2>
            <p className="text-slate-600 mb-6">
              Um espaço colaborativo para apresentações dinâmicas. Crie sprints
              iterativos, organize ideias e projete seu conteúdo em tempo real
              para a sala de aula.
            </p>
            <div className="flex items-center text-amber-600 font-semibold opacity-60">
              Em desenvolvimento
              <ArrowRight size={20} className="ml-2" />
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                Colaborativo
              </span>
              <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                Sprint
              </span>
              <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                Tempo Real
              </span>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-105">
            <div className="mb-4 inline-block p-4 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <BarChart3 size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Gerador de Gráficos Interativos
            </h2>
            <p className="text-slate-600 mb-6">
              Crie gráficos interativos incríveis para visualizar dados de forma
              dinâmica. Ideal para aulas de matemática, estatística e análise de
              dados.
            </p>
            <div className="flex items-center text-green-600 font-semibold opacity-60">
              Em desenvolvimento
              <ArrowRight size={20} className="ml-2" />
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">
                Interativo
              </span>
              <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">
                Customizável
              </span>
              <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">
                Exportável
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-lg mt-12">
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            Por que esperar?
          </h3>
          <p className="text-slate-600 mb-4">
            Estamos trabalhando duro para trazer essas funcionalidades incríveis
            para você. Enquanto isso, aproveite ao máximo:
          </p>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-center gap-2">
              <span className="text-slate-400">✓</span>
              <span>
                <strong>Lista de Chamada</strong> - Crie e imprima listas
                personalizadas
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400">✓</span>
              <span>
                <strong>Lousa Criativa</strong> - Escreva e desenhe com suporte
                a fórmulas
              </span>
            </li>
          </ul>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate("home")}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-lg hover:bg-slate-800 active:scale-95 transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            Voltar para Home
            <ArrowLeft size={20} />
          </button>
        </div>
      </div>

      <div className="border-t border-slate-200 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-600">
            Ficaremos felizes em ouvir sua opinião sobre essas novas features!
          </p>
        </div>
      </div>
    </div>
  );
}

export default ComingSoonPage;
