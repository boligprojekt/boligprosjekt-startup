'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Kalkulator() {
  const [roomLength, setRoomLength] = useState<string>('');
  const [roomWidth, setRoomWidth] = useState<string>('');
  const [roomHeight, setRoomHeight] = useState<string>('2.5');
  const [coats, setCoats] = useState<string>('2');

  // Beregn areal
  const floorArea = roomLength && roomWidth ? parseFloat(roomLength) * parseFloat(roomWidth) : 0;
  
  // Beregn veggareal (4 vegger)
  const wallArea = roomLength && roomWidth && roomHeight 
    ? 2 * (parseFloat(roomLength) + parseFloat(roomWidth)) * parseFloat(roomHeight)
    : 0;

  // Beregn takareal
  const ceilingArea = floorArea;

  // Beregn maling (ca 10 m² per liter)
  const paintLitersWalls = wallArea > 0 ? (wallArea / 10) * parseInt(coats) : 0;
  const paintLitersCeiling = ceilingArea > 0 ? (ceilingArea / 10) * parseInt(coats) : 0;

  // Beregn fliser (legg til 10% svinn)
  const tilesNeeded = floorArea > 0 ? floorArea * 1.1 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-slate-900">
              BoligProsjekt
            </Link>
            <div className="flex gap-6">
              <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors">
                Hjem
              </Link>
              <Link href="/kalkulator" className="text-slate-900 font-medium">
                Kalkulator
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Oppussingskalkulatorer
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Beregn hvor mye materialer du trenger til prosjektet ditt
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Malingskalkulator */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Malingskalkulator</h2>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rommets lengde (meter)
                </label>
                <input
                  type="number"
                  value={roomLength}
                  onChange={(e) => setRoomLength(e.target.value)}
                  placeholder="5"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rommets bredde (meter)
                </label>
                <input
                  type="number"
                  value={roomWidth}
                  onChange={(e) => setRoomWidth(e.target.value)}
                  placeholder="4"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Takhøyde (meter)
                </label>
                <input
                  type="number"
                  value={roomHeight}
                  onChange={(e) => setRoomHeight(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Antall strøk
                </label>
                <select
                  value={coats}
                  onChange={(e) => setCoats(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                >
                  <option value="1">1 strøk</option>
                  <option value="2">2 strøk</option>
                  <option value="3">3 strøk</option>
                </select>
              </div>
            </div>

            {/* Results */}
            {wallArea > 0 && (
              <div className="bg-slate-50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-slate-900 mb-4">Resultat:</h3>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Veggareal:</span>
                  <span className="font-bold text-slate-900">{wallArea.toFixed(1)} m²</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Takareal:</span>
                  <span className="font-bold text-slate-900">{ceilingArea.toFixed(1)} m²</span>
                </div>

                <div className="border-t border-slate-200 pt-4 mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600">Maling til vegger:</span>
                    <span className="font-bold text-slate-900">{paintLitersWalls.toFixed(1)} liter</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Maling til tak:</span>
                    <span className="font-bold text-slate-900">{paintLitersCeiling.toFixed(1)} liter</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900">Totalt maling:</span>
                    <span className="text-2xl font-bold text-slate-900">
                      {(paintLitersWalls + paintLitersCeiling).toFixed(1)} L
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Basert på ca. 10 m² per liter
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Flisekalkulator */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Flisekalkulator</h2>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rommets lengde (meter)
                </label>
                <input
                  type="number"
                  value={roomLength}
                  onChange={(e) => setRoomLength(e.target.value)}
                  placeholder="5"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rommets bredde (meter)
                </label>
                <input
                  type="number"
                  value={roomWidth}
                  onChange={(e) => setRoomWidth(e.target.value)}
                  placeholder="4"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Results */}
            {floorArea > 0 && (
              <div className="bg-slate-50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-slate-900 mb-4">Resultat:</h3>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Gulvareal:</span>
                  <span className="font-bold text-slate-900">{floorArea.toFixed(1)} m²</span>
                </div>

                <div className="bg-white rounded-lg p-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900">Fliser nødvendig:</span>
                    <span className="text-2xl font-bold text-slate-900">
                      {tilesNeeded.toFixed(1)} m²
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Inkluderer 10% svinn
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>Tips:</strong> Kjøp alltid litt ekstra fliser i tilfelle noen går i stykker under legging eller for fremtidige reparasjoner.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
          >
            Planlegg prosjektet ditt →
          </Link>
        </div>
      </div>
    </div>
  );
}

