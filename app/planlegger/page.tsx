'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FormData {
  housingType: string;
  buildYear: string;
  roomType: string;
  roomSize: number;
  currentCondition: string;
  budget: number;
  diyLevel: string;
}

export default function Planlegger() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    housingType: '',
    buildYear: '',
    roomType: '',
    roomSize: 0,
    currentCondition: '',
    budget: 0,
    diyLevel: 'beginner'
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    console.log('Genererer plan...', formData);
    // TODO: Lagre til database og generer plan
    window.location.href = '/prosjektplan/demo';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-bold">BoligProsjekt</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`flex-1 h-2 mx-1 rounded ${
                  s <= step ? 'bg-slate-900' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-slate-600">
            Steg {step} av 4
          </p>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 && (
            <Step1Boliginfo formData={formData} updateFormData={updateFormData} />
          )}
          {step === 2 && (
            <Step2Rom formData={formData} updateFormData={updateFormData} />
          )}
          {step === 3 && (
            <Step3Budsjett formData={formData} updateFormData={updateFormData} />
          )}
          {step === 4 && (
            <Step4Egeninnsats formData={formData} updateFormData={updateFormData} />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-slate-200 rounded-lg hover:bg-slate-300"
            >
              ← Tilbake
            </button>
          )}
          {step < 4 && (
            <button
              onClick={handleNext}
              className="ml-auto px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
            >
              Neste →
            </button>
          )}
          {step === 4 && (
            <button
              onClick={handleSubmit}
              className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Generer plan →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Steg 1: Boliginfo
function Step1Boliginfo({ formData, updateFormData }: any) {
  const housingTypes = [
    { id: 'leilighet', name: 'Leilighet', icon: '🏢' },
    { id: 'enebolig', name: 'Enebolig', icon: '🏠' },
    { id: 'rekkehus', name: 'Rekkehus', icon: '🏘️' },
    { id: 'hytte', name: 'Hytte', icon: '🏔️' }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Fortell oss om boligen din</h2>
      
      <div className="mb-8">
        <label className="block text-sm font-medium mb-3">Boligtype</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {housingTypes.map(type => (
            <button
              key={type.id}
              onClick={() => updateFormData('housingType', type.id)}
              className={`p-6 border-2 rounded-xl text-center transition-all ${
                formData.housingType === type.id
                  ? 'border-slate-900 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              <div className="text-4xl mb-2">{type.icon}</div>
              <div className="font-medium">{type.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-3">Byggeår</label>
        <select
          value={formData.buildYear}
          onChange={(e) => updateFormData('buildYear', e.target.value)}
          className="w-full p-3 border-2 border-slate-200 rounded-lg"
        >
          <option value="">Velg byggeår</option>
          <option value="<1950">Før 1950</option>
          <option value="1950-1980">1950-1980</option>
          <option value="1980-2000">1980-2000</option>
          <option value=">2000">Etter 2000</option>
        </select>
      </div>
    </div>
  );
}

// Steg 2: Rom
function Step2Rom({ formData, updateFormData }: any) {
  const rooms = [
    { id: 'kjokken', name: 'Kjøkken', icon: '🍳' },
    { id: 'bad', name: 'Bad', icon: '🚿' },
    { id: 'stue', name: 'Stue', icon: '🛋️' },
    { id: 'soverom', name: 'Soverom', icon: '🛏️' },
    { id: 'gulv', name: 'Gulv', icon: '🪵' },
    { id: 'maling', name: 'Maling', icon: '🎨' }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Hvilket rom skal du pusse opp?</h2>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-3">Velg rom</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {rooms.map(room => (
            <button
              key={room.id}
              onClick={() => updateFormData('roomType', room.id)}
              className={`p-6 border-2 rounded-xl text-center transition-all ${
                formData.roomType === room.id
                  ? 'border-slate-900 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              <div className="text-4xl mb-2">{room.icon}</div>
              <div className="font-medium">{room.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-3">Størrelse (kvm)</label>
        <input
          type="number"
          value={formData.roomSize || ''}
          onChange={(e) => updateFormData('roomSize', parseFloat(e.target.value))}
          placeholder="f.eks. 15"
          className="w-full p-3 border-2 border-slate-200 rounded-lg text-2xl"
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-3">Nåværende tilstand</label>
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'good', name: 'God', desc: 'Trenger oppfriskning' },
            { id: 'medium', name: 'Middels', desc: 'Trenger oppussing' },
            { id: 'poor', name: 'Dårlig', desc: 'Totalrenovering' }
          ].map(condition => (
            <button
              key={condition.id}
              onClick={() => updateFormData('currentCondition', condition.id)}
              className={`p-4 border-2 rounded-xl text-center transition-all ${
                formData.currentCondition === condition.id
                  ? 'border-slate-900 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              <div className="font-medium mb-1">{condition.name}</div>
              <div className="text-xs text-slate-600">{condition.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Steg 3: Budsjett
function Step3Budsjett({ formData, updateFormData }: any) {
  const suggestedBudgets: Record<string, any> = {
    bad: { min: 80000, mid: 150000, max: 300000 },
    kjokken: { min: 50000, mid: 120000, max: 250000 },
    gulv: { min: 20000, mid: 50000, max: 100000 },
    maling: { min: 10000, mid: 25000, max: 50000 },
    stue: { min: 30000, mid: 70000, max: 150000 },
    soverom: { min: 20000, mid: 50000, max: 100000 }
  };

  const suggested = suggestedBudgets[formData.roomType] || { min: 20000, mid: 50000, max: 100000 };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Hva er ditt budsjett?</h2>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-3">Budsjett (kr)</label>
        <input
          type="number"
          value={formData.budget || ''}
          onChange={(e) => updateFormData('budget', parseFloat(e.target.value))}
          placeholder="f.eks. 150 000"
          className="w-full p-4 border-2 border-slate-200 rounded-lg text-3xl font-bold"
        />
      </div>

      <div className="bg-slate-50 p-6 rounded-lg">
        <p className="text-sm font-medium mb-3">Veiledende priser for {formData.roomType}:</p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-slate-600 mb-1">Budsjett</div>
            <div className="font-bold">{suggested.min.toLocaleString()} kr</div>
          </div>
          <div>
            <div className="text-xs text-slate-600 mb-1">Standard</div>
            <div className="font-bold text-green-600">{suggested.mid.toLocaleString()} kr</div>
          </div>
          <div>
            <div className="text-xs text-slate-600 mb-1">Premium</div>
            <div className="font-bold">{suggested.max.toLocaleString()} kr</div>
          </div>
        </div>
      </div>

      {formData.budget > 0 && formData.budget < suggested.min && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Advarsel:</strong> Budsjettet ditt er lavt for dette prosjektet.
            Du kan risikere å måtte spare på kritiske ting.
          </p>
        </div>
      )}
    </div>
  );
}

// Steg 4: Egeninnsats
function Step4Egeninnsats({ formData, updateFormData }: any) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Hva kan du gjøre selv?</h2>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-3">Erfaring med oppussing</label>
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'none', name: 'Nybegynner', desc: 'Aldri pusset opp før', emoji: '🆕' },
            { id: 'beginner', name: 'Noe erfaring', desc: 'Har malt og montert', emoji: '🔨' },
            { id: 'experienced', name: 'Erfaren', desc: 'Kan det meste', emoji: '⚡' }
          ].map(level => (
            <button
              key={level.id}
              onClick={() => updateFormData('diyLevel', level.id)}
              className={`p-6 border-2 rounded-xl text-center transition-all ${
                formData.diyLevel === level.id
                  ? 'border-slate-900 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              <div className="text-3xl mb-2">{level.emoji}</div>
              <div className="font-medium mb-1">{level.name}</div>
              <div className="text-xs text-slate-600">{level.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="font-bold mb-2">💡 Tips basert på ditt nivå:</h3>
        {formData.diyLevel === 'none' && (
          <p className="text-sm text-slate-700">
            Som nybegynner anbefaler vi å bruke fagfolk for de fleste oppgaver.
            Du kan spare penger på enklere ting som maling og montering av møbler.
          </p>
        )}
        {formData.diyLevel === 'beginner' && (
          <p className="text-sm text-slate-700">
            Med noe erfaring kan du gjøre mye selv! Vi anbefaler fagfolk for elektrisk,
            rørlegger og andre kritiske oppgaver.
          </p>
        )}
        {formData.diyLevel === 'experienced' && (
          <p className="text-sm text-slate-700">
            Som erfaren kan du gjøre det meste selv! Husk likevel at noen oppgaver
            (elektrisk, rørlegger) krever sertifisering.
          </p>
        )}
      </div>
    </div>
  );
}

