'use client';

import Link from 'next/link';

// Mock saved projects
const savedProjects = [
  {
    id: 1,
    category: 'Kjøkken',
    budget: 50000,
    icon: '🍳',
    date: '2025-10-15',
    status: 'Planlegger',
  },
  {
    id: 2,
    category: 'Bad',
    budget: 75000,
    icon: '🚿',
    date: '2025-10-10',
    status: 'I gang',
  },
  {
    id: 3,
    category: 'Gulv',
    budget: 30000,
    icon: '📐',
    date: '2025-10-05',
    status: 'Fullført',
  },
];

export default function ProfilPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🏠</span>
              <span className="text-xl font-bold text-slate-900">BoligProsjekt</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/profil" className="text-slate-900 font-semibold">
                Min profil
              </Link>
              <button className="text-slate-600 hover:text-slate-900 transition-colors">
                Logg ut
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-white text-3xl">
              👤
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Ola Nordmann</h1>
              <p className="text-slate-600">ola.nordmann@epost.no</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-sm text-slate-600 mb-1">Totalt prosjekter</div>
            <div className="text-3xl font-bold text-slate-900">{savedProjects.length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-sm text-slate-600 mb-1">Totalt budsjett</div>
            <div className="text-3xl font-bold text-slate-900">
              {savedProjects.reduce((sum, p) => sum + p.budget, 0).toLocaleString('nb-NO')} kr
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-sm text-slate-600 mb-1">Fullførte</div>
            <div className="text-3xl font-bold text-slate-900">
              {savedProjects.filter(p => p.status === 'Fullført').length}
            </div>
          </div>
        </div>

        {/* Saved Projects */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Mine prosjekter</h2>
            <Link
              href="/"
              className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              + Nytt prosjekt
            </Link>
          </div>

          <div className="space-y-4">
            {savedProjects.map((project) => (
              <div
                key={project.id}
                className="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{project.icon}</div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">{project.category}</h3>
                      <p className="text-slate-600 text-sm">
                        Budsjett: {project.budget.toLocaleString('nb-NO')} kr
                      </p>
                      <p className="text-slate-500 text-xs mt-1">
                        Opprettet: {new Date(project.date).toLocaleDateString('nb-NO')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        project.status === 'Fullført'
                          ? 'bg-green-100 text-green-800'
                          : project.status === 'I gang'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {project.status}
                    </span>
                    <Link
                      href={`/prosjekt?kategori=${project.category.toLowerCase()}&budsjett=${project.budget}`}
                      className="text-slate-900 hover:underline font-medium"
                    >
                      Se detaljer →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {savedProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Ingen prosjekter ennå</h3>
              <p className="text-slate-600 mb-6">Start ditt første oppussingsprosjekt i dag!</p>
              <Link
                href="/"
                className="inline-block bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Opprett prosjekt
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

