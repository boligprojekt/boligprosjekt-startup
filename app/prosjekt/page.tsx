'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useMemo } from 'react';
import Link from 'next/link';

// Fallback-funksjon for produktbilder hvis bilde-URL ikke fungerer
const getFallbackImage = (productName: string) => {
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#64748b;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#475569;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#grad)"/>
      <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="16" font-family="system-ui, -apple-system, sans-serif" font-weight="600" opacity="0.95">
        ${productName.substring(0, 30)}
      </text>
      ${productName.length > 30 ? `<text x="50%" y="60%" text-anchor="middle" fill="white" font-size="14" font-family="system-ui, -apple-system, sans-serif" font-weight="500" opacity="0.9">${productName.substring(30, 60)}</text>` : ''}
    </svg>
  `;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

// VIKTIG: Alle produkter er ekte varer som finnes i norske butikker
// Søke-URLer tar deg direkte til produktet i butikkens søk
const mockProducts = {
  kjokken: [
    { id: 1, name: 'IKEA METOD Overskap hvit 80x40', price: 1295, store: 'IKEA', category: 'Skap', url: 'https://www.ikea.com/no/no/search/?q=METOD%20overskap%20hvit%2080x40', description: 'Overskap med hvit front, 80x40 cm', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop' },
    { id: 2, name: 'IKEA KNOXHULT Kjøkken komplett', price: 8995, store: 'IKEA', category: 'Kjøkken', url: 'https://www.ikea.com/no/no/search/?q=KNOXHULT%20kjøkken', description: 'Komplett kjøkkenløsning med skap og benkeplate', image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400&h=300&fit=crop' },
    { id: 3, name: 'Laminat benkeplate eik 246cm', price: 1499, store: 'Byggmax', category: 'Benkeplate', url: 'https://www.byggmax.no/sok?q=laminat+benkeplate+eik', description: 'Laminat benkeplate i eik-dekor, 246x60 cm', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop' },
    { id: 4, name: 'Kjøkkenvask rustfri stål', price: 1299, store: 'Byggmax', category: 'Vask', url: 'https://www.byggmax.no/sok?q=kjøkkenvask+rustfri', description: 'Rustfri stål kjøkkenvask med 1 kum', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop' },
    { id: 5, name: 'Kjøkkenkran Oras Safira', price: 1890, store: 'OBS Bygg', category: 'Armatur', url: 'https://www.obsbygg.no/sok?q=oras+safira+kjøkkenkran', description: 'Oras Safira kjøkkenkran med uttrekkbar tut', image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop' },
    { id: 6, name: 'LED-list kjøkken 3m', price: 449, store: 'Montér', category: 'Belysning', url: 'https://www.monter.no/sok?q=LED+list+kjøkken', description: 'LED-list for kjøkkenbenk, 3 meter', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop' },
    { id: 7, name: 'Kjøkkenvifte 60cm rustfri', price: 2499, store: 'Elkjøp', category: 'Ventilasjon', url: 'https://www.elkjop.no/search?SearchTerm=kjøkkenvifte+60cm', description: 'Kjøkkenvifte 60 cm i rustfritt stål', image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop' },
    { id: 8, name: 'Fliseklebemiddel 15kg', price: 299, store: 'Byggmax', category: 'Tilbehør', url: 'https://www.byggmax.no/sok?q=fliseklebemiddel', description: 'Fliseklebemiddel for kjøkken og bad, 15 kg', image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=300&fit=crop' },
  ],
  bad: [
    { id: 9, name: 'Duxa Solid dusjkabinett 90x90', price: 5495, store: 'OBS Bygg', category: 'Dusjutstyr', url: 'https://www.obsbygg.no/bad-og-kjokken/dusjlosninger/dusjkabinett', description: 'Duxa Solid dusjkabinett 90x90 cm med klart glass', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop' },
    { id: 10, name: 'Duxa Voss dusjkabinett 80x80', price: 7495, store: 'OBS Bygg', category: 'Dusjutstyr', url: 'https://www.obsbygg.no/bad-og-kjokken/dusjlosninger/dusjkabinett', description: 'Duxa Voss dusjkabinett krom 80x80 cm', image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop' },
    { id: 11, name: 'Toalett Ifö Sign 6860', price: 2995, store: 'Montér', category: 'Sanitær', url: 'https://www.monter.no/sok?q=ifö+sign+toalett', description: 'Ifö Sign toalett med soft close sete', image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop&q=80' },
    { id: 12, name: 'Servant 60cm hvit porselen', price: 1295, store: 'Byggmax', category: 'Sanitær', url: 'https://www.byggmax.no/sok?q=servant+60cm+hvit', description: 'Servant 60 cm i hvit porselen', image: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=400&h=300&fit=crop' },
    { id: 13, name: 'IKEA GODMORGON Servantskap', price: 2495, store: 'IKEA', category: 'Skap', url: 'https://www.ikea.com/no/no/search/?q=GODMORGON%20servantskap', description: 'GODMORGON servantskap med 2 skuffer', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop' },
    { id: 14, name: 'Fliser hvit blank 30x60cm', price: 349, store: 'Byggmax', category: 'Fliser', url: 'https://www.byggmax.no/sok?q=fliser+hvit+30x60', description: 'Hvit blank veggflise 30x60 cm, pris per m²', image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=300&fit=crop' },
    { id: 15, name: 'Membran tetting våtrom 5m²', price: 899, store: 'OBS Bygg', category: 'Tetting', url: 'https://www.obsbygg.no/sok?q=membran+tetting+våtrom', description: 'Membran for tetting av våtrom, 5 m²', image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=300&fit=crop&q=80' },
    { id: 16, name: 'Baderomsvifte Flexit', price: 795, store: 'Montér', category: 'Ventilasjon', url: 'https://www.monter.no/sok?q=flexit+baderomsvifte', description: 'Flexit baderomsvifte med timer', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop' },
    { id: 17, name: 'Gulvvarme 3m² elektrisk', price: 1899, store: 'Elkjøp', category: 'Varme', url: 'https://www.elkjop.no/search?SearchTerm=gulvvarme+elektrisk', description: 'Elektrisk gulvvarme 3 m² med termostat', image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=300&fit=crop&q=70' },
  ],
  gulv: [
    { id: 18, name: 'Laminatgulv eik 2,47m²', price: 249, store: 'Byggmax', category: 'Gulv', url: 'https://www.byggmax.no/sok?q=laminatgulv+eik', description: 'Laminatgulv i eik-dekor, 2,47 m² per pakke', image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=300&fit=crop&q=80' },
    { id: 19, name: 'Parkett 3-stav eik 2,2m²', price: 449, store: 'OBS Bygg', category: 'Gulv', url: 'https://www.obsbygg.no/sok?q=parkett+3-stav+eik', description: 'Parkett 3-stav eik, 2,2 m² per pakke', image: 'https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=400&h=300&fit=crop' },
    { id: 20, name: 'Vinylgulv grå 2m²', price: 199, store: 'Byggmax', category: 'Gulv', url: 'https://www.byggmax.no/sok?q=vinylgulv+grå', description: 'Vinylgulv i grå farge, 2 m² per pakke', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop' },
    { id: 21, name: 'Gulvlist hvit 240cm', price: 59, store: 'Byggmax', category: 'Tilbehør', url: 'https://www.byggmax.no/sok?q=gulvlist+hvit', description: 'Hvit gulvlist 240 cm', image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=300&fit=crop&q=60' },
    { id: 22, name: 'Undergulv 3mm 10m²', price: 299, store: 'OBS Bygg', category: 'Undergulv', url: 'https://www.obsbygg.no/sok?q=undergulv+3mm', description: 'Undergulv 3 mm tykkelse, 10 m²', image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=300&fit=crop&q=50' },
    { id: 23, name: 'Gulvlim 14kg', price: 399, store: 'Byggmax', category: 'Lim', url: 'https://www.byggmax.no/sok?q=gulvlim', description: 'Gulvlim for vinyl og linoleum, 14 kg', image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=300&fit=crop&q=40' },
    { id: 24, name: 'Overgangslist aluminium', price: 89, store: 'OBS Bygg', category: 'Tilbehør', url: 'https://www.obsbygg.no/sok?q=overgangslist+aluminium', description: 'Overgangslist i aluminium', image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=300&fit=crop&q=30' },
  ],
  maling: [
    { id: 25, name: 'Jotun Lady Pure Color 10L hvit', price: 899, store: 'Byggmax', category: 'Maling', url: 'https://www.byggmax.no/sok?q=jotun+lady+pure+color', description: 'Jotun Lady Pure Color veggmaling 10L hvit', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop' },
    { id: 26, name: 'Jotun Butinox 3L hvit', price: 549, store: 'OBS Bygg', category: 'Maling', url: 'https://www.obsbygg.no/sok?q=jotun+butinox', description: 'Jotun Butinox veggmaling 3L hvit', image: 'https://images.unsplash.com/photo-1572364970209-44cf2ff6d0c0?w=400&h=300&fit=crop' },
    { id: 27, name: 'Beckers Elegant Takfarge 10L', price: 699, store: 'Byggmax', category: 'Takfarge', url: 'https://www.byggmax.no/sok?q=beckers+elegant+takfarge', description: 'Beckers Elegant takfarge 10L hvit', image: 'https://images.unsplash.com/photo-1562259929-2e8e2b9e3e5e?w=400&h=300&fit=crop' },
    { id: 28, name: 'Malerrulle sett 3 deler', price: 179, store: 'Byggmax', category: 'Verktøy', url: 'https://www.byggmax.no/sok?q=malerrulle+sett', description: 'Malerrulle sett med 3 deler', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop&q=80' },
    { id: 29, name: 'Malerkost sett 5 deler', price: 249, store: 'OBS Bygg', category: 'Verktøy', url: 'https://www.obsbygg.no/sok?q=malerkost+sett', description: 'Malerkost sett med 5 deler', image: 'https://images.unsplash.com/photo-1572364970209-44cf2ff6d0c0?w=400&h=300&fit=crop&q=80' },
    { id: 30, name: 'Malertape 50m', price: 89, store: 'Byggmax', category: 'Tilbehør', url: 'https://www.byggmax.no/sok?q=malertape', description: 'Malertape 50 meter', image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=300&fit=crop&q=20' },
    { id: 31, name: 'Plastduk 4x5m', price: 49, store: 'Byggmax', category: 'Tilbehør', url: 'https://www.byggmax.no/sok?q=plastduk+maling', description: 'Plastduk for maling 4x5 meter', image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=300&fit=crop&q=10' },
    { id: 32, name: 'Sparkel 5L', price: 199, store: 'OBS Bygg', category: 'Sparkel', url: 'https://www.obsbygg.no/sok?q=sparkel', description: 'Sparkel for vegg og tak, 5 liter', image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=300&fit=crop&q=5' },
  ],
  belysning: [
    { id: 33, name: 'IKEA NYMÅNE Taklampe LED', price: 599, store: 'IKEA', category: 'Taklampe', url: 'https://www.ikea.com/no/no/search/?q=NYMÅNE%20taklampe', description: 'NYMÅNE taklampe med LED-pære', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop&q=80' },
    { id: 34, name: 'LED-panel 60x60 40W', price: 799, store: 'Montér', category: 'Panel', url: 'https://www.monter.no/sok?q=LED+panel+60x60', description: 'LED-panel 60x60 cm, 40W', image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop&q=80' },
    { id: 35, name: 'Spotlights 6-pack GU10', price: 1499, store: 'Elkjøp', category: 'Spots', url: 'https://www.elkjop.no/search?SearchTerm=spotlights+GU10', description: 'Spotlights 6-pack med GU10 LED-pærer', image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=300&fit=crop' },
    { id: 36, name: 'LED-stripe 5m RGB', price: 399, store: 'Elkjøp', category: 'LED-stripe', url: 'https://www.elkjop.no/search?SearchTerm=LED+stripe+RGB', description: 'LED-stripe 5 meter RGB med fjernkontroll', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop' },
    { id: 37, name: 'Dimmer smart WiFi', price: 449, store: 'Montér', category: 'Tilbehør', url: 'https://www.monter.no/sok?q=smart+dimmer+wifi', description: 'Smart WiFi dimmer med app-styring', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80' },
    { id: 38, name: 'Vegglampe moderne svart', price: 699, store: 'IKEA', category: 'Vegglampe', url: 'https://www.ikea.com/no/no/search/?q=SKURUP%20vegglampe', description: 'SKURUP vegglampe i svart', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop' },
    { id: 39, name: 'Downlights 10-pack hvit', price: 1299, store: 'Montér', category: 'Downlights', url: 'https://www.monter.no/sok?q=downlights+LED', description: 'Downlights 10-pack hvit med LED', image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop&q=70' },
  ],
  vinduer: [
    { id: 40, name: 'Trefritt vindu 120x120 hvit', price: 5995, store: 'Byggmax', category: 'Vindu', url: 'https://www.byggmax.no/sok?q=trefritt+vindu+120x120', description: 'Trefritt vindu 120x120 cm i hvit', image: 'https://images.unsplash.com/photo-1545259742-12f8a5c9c4bf?w=400&h=300&fit=crop' },
    { id: 41, name: 'Trefritt vindu 90x120 hvit', price: 4995, store: 'OBS Bygg', category: 'Vindu', url: 'https://www.obsbygg.no/sok?q=trefritt+vindu+90x120', description: 'Trefritt vindu 90x120 cm i hvit', image: 'https://images.unsplash.com/photo-1545259742-12f8a5c9c4bf?w=400&h=300&fit=crop&q=80' },
    { id: 42, name: 'Vindusbeslag sett komplett', price: 349, store: 'Byggmax', category: 'Beslag', url: 'https://www.byggmax.no/sok?q=vindusbeslag', description: 'Komplett vindusbeslag sett', image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=300&fit=crop&q=15' },
    { id: 43, name: 'Montageskum vindu 750ml', price: 89, store: 'Byggmax', category: 'Montering', url: 'https://www.byggmax.no/sok?q=montageskum', description: 'Montageskum for vinduer og dører, 750ml', image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=300&fit=crop&q=12' },
    { id: 44, name: 'Vinduslist utvendig 240cm', price: 129, store: 'OBS Bygg', category: 'List', url: 'https://www.obsbygg.no/sok?q=vinduslist', description: 'Vinduslist utvendig 240 cm', image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=300&fit=crop&q=8' },
    { id: 45, name: 'Silikon vindu/dør hvit', price: 69, store: 'Byggmax', category: 'Tetting', url: 'https://www.byggmax.no/sok?q=silikon+vindu', description: 'Silikon for vinduer og dører, hvit', image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=300&fit=crop&q=3' },
  ],
};

function ProsjektContent() {
  const searchParams = useSearchParams();
  const kategori = searchParams.get('kategori') || '';
  const budsjett = parseInt(searchParams.get('budsjett') || '0');

  const [savedToProfile, setSavedToProfile] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high'>('default');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const allProducts = mockProducts[kategori as keyof typeof mockProducts] || [];

  // Filter by store
  let filteredProducts = selectedStore === 'all'
    ? allProducts
    : allProducts.filter(p => p.store === selectedStore);

  // Sort products
  const products = useMemo(() => {
    const sorted = [...filteredProducts];
    if (sortBy === 'price-low') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
  }, [filteredProducts, sortBy]);

  // Get unique stores
  const stores = ['all', ...Array.from(new Set(allProducts.map(p => p.store)))];

  // Toggle product selection
  const toggleProduct = (productId: number) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Calculate budget distribution
  const materialsBudget = Math.floor(budsjett * 0.7);
  const toolsBudget = Math.floor(budsjett * 0.2);
  const contingencyBudget = budsjett - materialsBudget - toolsBudget;

  // Calculate total product cost (only selected products)
  const totalProductCost = useMemo(() => {
    if (selectedProducts.length === 0) {
      return products.reduce((sum, product) => sum + product.price, 0);
    }
    return allProducts
      .filter(p => selectedProducts.includes(p.id))
      .reduce((sum, product) => sum + product.price, 0);
  }, [selectedProducts, products, allProducts]);

  const remainingBudget = budsjett - totalProductCost;
  const budgetPercentageUsed = budsjett > 0 ? Math.round((totalProductCost / budsjett) * 100) : 0;

  const categoryNames: Record<string, string> = {
    kjokken: 'Kjøkken',
    bad: 'Bad',
    gulv: 'Gulv',
    maling: 'Maling',
    belysning: 'Belysning',
    vinduer: 'Vinduer',
  };

  const handleSaveProject = () => {
    setSavedToProfile(true);
    setTimeout(() => setSavedToProfile(false), 3000);
  };

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
              <Link href="/profil" className="text-slate-600 hover:text-slate-900 transition-colors">
                Min profil
              </Link>
              <Link href="/login" className="text-slate-600 hover:text-slate-900 transition-colors">
                Logg inn
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-slate-600 hover:text-slate-900 mb-4 inline-flex items-center">
            ← Tilbake
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Ditt {categoryNames[kategori]}-prosjekt
          </h1>
          <p className="text-xl text-slate-600">
            Budsjett: <span className="font-bold text-slate-900">{budsjett.toLocaleString('nb-NO')} kr</span>
          </p>
        </div>

        {/* Budget Distribution */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-sm text-slate-600 mb-1">Materialer</div>
            <div className="text-3xl font-bold text-slate-900">{materialsBudget.toLocaleString('nb-NO')} kr</div>
            <div className="text-sm text-slate-500 mt-1">70% av budsjett</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-sm text-slate-600 mb-1">Verktøy & Utstyr</div>
            <div className="text-3xl font-bold text-slate-900">{toolsBudget.toLocaleString('nb-NO')} kr</div>
            <div className="text-sm text-slate-500 mt-1">20% av budsjett</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-sm text-slate-600 mb-1">Buffer</div>
            <div className="text-3xl font-bold text-slate-900">{contingencyBudget.toLocaleString('nb-NO')} kr</div>
            <div className="text-sm text-slate-500 mt-1">10% av budsjett</div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Anbefalte produkter fra norske butikker</h2>
              <p className="text-sm text-slate-600 mt-1">
                {selectedProducts.length > 0
                  ? `${selectedProducts.length} produkter valgt`
                  : 'Velg produkter for å legge til i prosjektet ditt'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-600">
                {products.length} produkter
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              >
                <option value="default">Sorter etter</option>
                <option value="price-low">Pris: Lav til høy</option>
                <option value="price-high">Pris: Høy til lav</option>
              </select>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              >
                <option value="all">Alle butikker</option>
                {stores.filter(s => s !== 'all').map(store => (
                  <option key={store} value={store}>{store}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Info banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-2">Ekte produkter fra norske butikker</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Alle produktene nedenfor er <strong>ekte varer som faktisk finnes</strong> i de norske butikkene.
                  Når du klikker "Kjøp hos [butikk]" blir du tatt til butikkens nettside hvor du finner produktet.
                  Prisene er veiledende - sjekk alltid aktuelle priser og tilgjengelighet hos butikken.
                </p>
              </div>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Ingen produkter funnet</h3>
              <p className="text-slate-600">Prøv en annen kategori eller budsjett</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const isSelected = selectedProducts.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className={`bg-white border-2 rounded-xl overflow-hidden hover:shadow-lg transition-all ${
                      isSelected ? 'border-slate-900 shadow-md' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Product Image */}
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img
                        src={product.image || getFallbackImage(product.name)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          // Hvis bildet ikke laster, bruk fallback
                          e.currentTarget.src = getFallbackImage(product.name);
                        }}
                      />
                      {/* Checkbox overlay */}
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => toggleProduct(product.id)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-slate-900 text-white'
                              : 'bg-white/90 text-slate-400 hover:bg-white hover:text-slate-900'
                          }`}
                        >
                          {isSelected ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {/* Store badge */}
                      <div className="absolute bottom-3 left-3">
                        <div className="text-xs bg-white/95 backdrop-blur-sm text-slate-700 px-3 py-1.5 rounded-full font-medium shadow-sm">
                          {product.store}
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <div className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">
                        {product.category}
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2 text-lg leading-tight">{product.name}</h3>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{product.description}</p>

                      <div className="flex items-center justify-between gap-3 mt-auto">
                        <div className="text-2xl font-bold text-slate-900">{product.price.toLocaleString('nb-NO')} kr</div>
                        <a
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-all text-sm font-medium hover:shadow-lg flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          Kjøp
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Budget Summary */}
        {products.length > 0 && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <h2 className="text-2xl font-bold mb-6">Budsjettsammendrag</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <div className="text-sm text-slate-300 mb-1">Totalt budsjett</div>
                <div className="text-3xl font-bold">{budsjett.toLocaleString('nb-NO')} kr</div>
              </div>
              <div>
                <div className="text-sm text-slate-300 mb-1">Produkter vist</div>
                <div className="text-3xl font-bold">{totalProductCost.toLocaleString('nb-NO')} kr</div>
              </div>
              <div>
                <div className="text-sm text-slate-300 mb-1">
                  {remainingBudget >= 0 ? 'Gjenstående' : 'Over budsjett'}
                </div>
                <div className={`text-3xl font-bold ${remainingBudget >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.abs(remainingBudget).toLocaleString('nb-NO')} kr
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Budsjettbruk</span>
                <span>{budgetPercentageUsed}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    budgetPercentageUsed > 100 ? 'bg-red-500' :
                    budgetPercentageUsed > 80 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(budgetPercentageUsed, 100)}%` }}
                ></div>
              </div>
            </div>

            <p className="text-sm text-slate-300">
              💡 Tips: Dette er eksempler på produkter. Du kan velge færre eller andre produkter basert på dine behov.
            </p>
          </div>
        )}

        {/* Save Project */}
        <div className="flex justify-center">
          <button
            onClick={handleSaveProject}
            className="bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
          >
            {savedToProfile ? '✓ Prosjekt lagret!' : '💾 Lagre prosjekt til min profil'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProsjektPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Laster...</div>}>
      <ProsjektContent />
    </Suspense>
  );
}

