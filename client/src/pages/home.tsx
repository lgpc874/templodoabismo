import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="py-8 text-center border-b border-gray-800">
        <h1 className="text-4xl font-bold mb-2">🏛️ TEMPLO DO ABISMO</h1>
        <p className="text-gray-400">Portal dos Ensinamentos Luciferiano Ancestrais</p>
      </header>

      {/* Navigation */}
      <nav className="py-6 text-center bg-gray-900">
        <div className="flex justify-center space-x-6">
          <Link href="/" className="text-white hover:text-yellow-400 transition-colors">
            Home
          </Link>
          <Link href="/admin-login" className="text-white hover:text-yellow-400 transition-colors">
            Admin Login
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <section className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Bem-vindos ao Portal</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Aqui residem os ensinamentos ancestrais e os mistérios primordiais da gnose ctônica.
              Adentre as profundezas do conhecimento proibido e desperte sua verdadeira natureza.
            </p>
          </section>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-3">📚 Grimórios</h3>
              <p className="text-gray-400">
                Textos sagrados e manuscritos antigos contendo conhecimentos ocultos.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-3">🔮 Oráculos</h3>
              <p className="text-gray-400">
                Consultas divinatórias através de diferentes métodos místicos.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-3">✍️ Voz da Pluma</h3>
              <p className="text-gray-400">
                Poemas diários e artigos sobre os mistérios do abismo.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 text-center border-t border-gray-800">
        <p className="text-gray-400">
          © 2024 Templo do Abismo - Sistema 100% Supabase
        </p>
      </footer>
    </div>
  );
}