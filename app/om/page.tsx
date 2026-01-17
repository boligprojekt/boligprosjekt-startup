import Link from 'next/link';

export default function OmPage() {
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
              <Link href="/om" className="text-slate-900 font-semibold">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Om BoligProsjekt
          </h1>
          <p className="text-xl text-slate-600">
            Vi gjør oppussing enklere, smartere og mer oversiktlig
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Vår misjon</h2>
          <p className="text-lg text-slate-600 mb-4">
            BoligProsjekt ble skapt for å hjelpe norske boligeiere med å planlegge og gjennomføre 
            oppussingsprosjekter på en smart og kostnadseffektiv måte.
          </p>
          <p className="text-lg text-slate-600">
            Vi vet at det kan være overveldende å starte et oppussingsprosjekt. Hvor mye koster det? 
            Hvilke materialer trenger jeg? Hvor skal jeg handle? BoligProsjekt gir deg svarene.
          </p>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Slik fungerer det</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">1️⃣</div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Legg inn budsjett</h3>
                <p className="text-slate-600">
                  Fortell oss hvor mye du har å bruke på prosjektet ditt
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-4xl">2️⃣</div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Velg prosjekt</h3>
                <p className="text-slate-600">
                  Kjøkken, bad, gulv, maling - vi har kategorier for alle typer oppussing
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-4xl">3️⃣</div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Få forslag</h3>
                <p className="text-slate-600">
                  Vi viser deg hvordan du kan fordele budsjettet og hvilke produkter du trenger
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-4xl">4️⃣</div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Sammenlign priser</h3>
                <p className="text-slate-600">
                  Se produkter fra Byggmax, OBS Bygg, IKEA, Montér og flere butikker
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="font-semibold text-slate-900 mb-2">Spar penger</h3>
            <p className="text-slate-600 text-sm">
              Sammenlign priser og få mest mulig ut av budsjettet ditt
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-4xl mb-3">⏱️</div>
            <h3 className="font-semibold text-slate-900 mb-2">Spar tid</h3>
            <p className="text-slate-600 text-sm">
              Få alt du trenger på ett sted i stedet for å lete rundt
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-semibold text-slate-900 mb-2">Få oversikt</h3>
            <p className="text-slate-600 text-sm">
              Hold styr på alle dine prosjekter på ett sted
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Klar til å starte?</h2>
          <p className="text-lg mb-6 text-slate-300">
            Bli med tusenvis av fornøyde boligeiere som har planlagt sine prosjekter med oss
          </p>
          <Link
            href="/registrer"
            className="inline-block bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-100 transition-colors"
          >
            Kom i gang gratis
          </Link>
        </div>
      </div>
    </div>
  );
}

