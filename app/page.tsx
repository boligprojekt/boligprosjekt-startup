'use client';

import { useState } from 'react';
import Link from 'next/link';

// Funksjon for å vise ikoner
const getCategoryIcon = (iconType: string) => {
  const iconClass = "w-8 h-8 stroke-current";
  switch(iconType) {
    case 'kitchen':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case 'bathroom':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      );
    case 'floor':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
        </svg>
      );
    case 'paint':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      );
    case 'light':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      );
    case 'window':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM12 5v14M4 12h16" />
        </svg>
      );
    default:
      return null;
  }
};

const categories = [
  { id: 'kjokken', name: 'Kjøkken', icon: 'kitchen', description: 'Oppgradering av kjøkken' },
  { id: 'bad', name: 'Bad', icon: 'bathroom', description: 'Baderom og våtrom' },
  { id: 'gulv', name: 'Gulv', icon: 'floor', description: 'Nye gulv i hele boligen' },
  { id: 'maling', name: 'Maling', icon: 'paint', description: 'Male vegger og tak' },
  { id: 'belysning', name: 'Belysning', icon: 'light', description: 'Ny belysning' },
  { id: 'vinduer', name: 'Vinduer', icon: 'window', description: 'Skifte vinduer' },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [budget, setBudget] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory && budget) {
      // Navigate to results page
      window.location.href = `/prosjekt?kategori=${selectedCategory}&budsjett=${budget}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <svg className="w-8 h-8 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xl font-bold text-slate-900">BoligProsjekt</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/kalkulator" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                Kalkulator
              </Link>
              <Link href="/om" className="text-slate-600 hover:text-slate-900 transition-colors">
                Om oss
              </Link>
              <Link href="/login" className="text-slate-600 hover:text-slate-900 transition-colors">
                Logg inn
              </Link>
              <Link
                href="/registrer"
                className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Kom i gang
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-block bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            Norges smarteste oppussingsplanlegger
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Planlegg ditt drømmeprosjekt
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Få smarte forslag til hvordan du kan bruke budsjettet ditt på oppussing.
            Vi hjelper deg med å finne de beste produktene fra ledende butikker.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-12 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">2,500+</div>
              <div className="text-sm text-slate-600">Prosjekter planlagt</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">45+</div>
              <div className="text-sm text-slate-600">Produkter tilgjengelig</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">5</div>
              <div className="text-sm text-slate-600">Norske butikker</div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <form onSubmit={handleSubmit}>
              {/* Budget Input */}
              <div className="mb-10">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Hva er ditt budsjett?
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="50 000"
                    className="w-full text-4xl font-bold border-0 border-b-2 border-slate-200 focus:border-slate-900 outline-none py-4 transition-colors"
                    required
                  />
                  <span className="absolute right-0 bottom-4 text-4xl font-bold text-slate-400">kr</span>
                </div>
              </div>

              {/* Category Selection */}
              <div className="mb-10">
                <label className="block text-sm font-medium text-slate-700 mb-4">
                  Hva skal du fikse?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        selectedCategory === category.id
                          ? 'border-slate-900 bg-slate-50 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="mb-3 flex justify-center text-slate-700">
                        {getCategoryIcon(category.icon)}
                      </div>
                      <div className="font-semibold text-slate-900">{category.name}</div>
                      <div className="text-xs text-slate-500 mt-1">{category.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!selectedCategory || !budget}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                Se forslag til prosjektet ditt →
              </button>
            </form>
          </div>

          {/* Example Projects */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">Populære prosjekter</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  {getCategoryIcon('kitchen')}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Kjøkkenoppussing</h3>
                <p className="text-sm text-slate-600 mb-4">Komplett kjøkken med skap, benkeplate og hvitevarer</p>
                <div className="text-2xl font-bold text-slate-900">Fra 50 000 kr</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  {getCategoryIcon('bathroom')}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Baderomsrenovering</h3>
                <p className="text-sm text-slate-600 mb-4">Nytt bad med dusj, toalett, servant og fliser</p>
                <div className="text-2xl font-bold text-slate-900">Fra 40 000 kr</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  {getCategoryIcon('floor')}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Nye gulv</h3>
                <p className="text-sm text-slate-600 mb-4">Laminat eller parkett i hele leiligheten</p>
                <div className="text-2xl font-bold text-slate-900">Fra 30 000 kr</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Hvorfor velge BoligProsjekt?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Ekte produkter</h3>
                <p className="text-sm text-slate-600">Alle produkter er verifisert og tilgjengelig i norske butikker</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Smart budsjettering</h3>
                <p className="text-sm text-slate-600">Få oversikt over kostnader og hold deg innenfor budsjettet</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Rask og enkel</h3>
                <p className="text-sm text-slate-600">Få produktforslag på sekunder - ingen registrering nødvendig</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-slate-600">
            <p>© 2025 BoligProsjekt. Gjør drømmeprosjektet ditt til virkelighet.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

