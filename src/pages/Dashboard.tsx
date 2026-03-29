import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { api } from '../lib/api';
import { PetProfile, FoodRecord } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PetProfile | null>(null);
  const [records, setRecords] = useState<FoodRecord[]>([]);
  
  const [fedToggle, setFedToggle] = useState(false);
  const [note, setNote] = useState('');
  const [who, setWho] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('patitas_profile');
    if (!saved) {
      navigate('/login', { replace: true });
      return;
    }
    const parsed = JSON.parse(saved) as PetProfile;
    setProfile(parsed);
    
    fetchRecords(parsed.id);

    // Polling every 10 seconds
    const interval = setInterval(() => {
      fetchRecords(parsed.id);
    }, 10000);

    return () => clearInterval(interval);
  }, [navigate]);

  const fetchRecords = async (profileId: string) => {
    const data = await api.getRecords(profileId);
    setRecords(data);
  };

  const currentFormattedDate = format(new Date(), "EEEE d yyyy", { locale: es }).toLowerCase();

  const handleLogout = () => {
    sessionStorage.removeItem('patitas_profile');
    navigate('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (!who.trim()) {
      alert('¿Quién le está dando de comer?');
      return;
    }

    setSubmitting(true);
    
    const success = await api.createRecord({
      profileId: profile.id,
      by: who.trim(),
      note: note.trim()
    });

    setSubmitting(false);

    if (success) {
      setFedToggle(false);
      setNote('');
      setWho('');
      fetchRecords(profile.id);
    } else {
      alert('Error al guardar el registro. Intenta de nuevo.');
    }
  };

  if (!profile) return <div className="flex-1 bg-background"></div>;

  return (
    <div className="flex-1 flex flex-col bg-background h-screen overflow-hidden">
      
      {/* HEADER */}
      <div className="flex justify-between items-center p-6 pb-2 pt-8">
        <span className="text-sm font-medium text-gray-500 capitalize tracking-wide">
          {currentFormattedDate}
        </span>
        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
        >
          Salir
        </button>
      </div>

      {/* DASHBOARD SCROLL AREA */}
      <div className="flex-1 overflow-y-auto px-6 pb-10">
        
        {/* PROFILE INFO */}
        <div className="mb-8 mt-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
            {profile.petName}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-slate-800 font-bold uppercase tracking-widest text-sm">YA COMI</span>
            <span className="text-2xl">{profile.emoji}</span>
          </div>
        </div>

        {/* FEEDING FORM */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <button
              type="button"
              onClick={() => setFedToggle(!fedToggle)}
              className={`w-full py-4 rounded-xl font-bold uppercase tracking-wide transition-all shadow-sm
                ${fedToggle 
                  ? 'bg-emerald-100 text-emerald-800 scale-[0.98] shadow-inner border-2 border-emerald-200' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
            >
              {fedToggle ? 'YA COMI' : 'MARCAR YA COMI'}
            </button>

            <div>
              <input
                type="text"
                placeholder="Quien le esta dando de comer"
                value={who}
                onChange={(e) => setWho(e.target.value)}
                className="w-full bg-gray-50 px-4 py-3.5 rounded-xl border-none text-sm placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-slate-900 transition-all outline-none"
              />
            </div>

            <div>
              <input
                type="text"
                maxLength={20}
                placeholder="Nota (máx 20 car)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-gray-50 px-4 py-3.5 rounded-xl border-none text-sm placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-slate-900 transition-all outline-none"
              />
              <div className="text-right text-xs text-gray-400 mt-1 mr-1">
                {note.length}/20
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !who.trim()}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:bg-gray-300 text-white py-3.5 pt-4 rounded-xl font-bold text-sm transition-all active:scale-[0.98] mt-2 shadow-sm"
            >
              {submitting ? 'Guardando...' : 'Dar de comer'}
            </button>
          </form>
        </div>

        {/* RECORDS LIST */}
        <div>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">
            Veces que le di de comer a {profile.petName}
          </h2>
          
          <div className="flex flex-col gap-3">
            {records.length === 0 ? (
              <div className="text-center p-8 bg-transparent text-gray-400 text-sm">
                Todavía no hay registros de comida para esta mascota.
              </div>
            ) : (
              records.map((record, index) => {
                const dateObj = new Date(record.createdAt);
                
                return (
                  <div key={record.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <p className="font-bold text-slate-800 text-sm truncate">{record.by}</p>
                        <p className="text-xs text-gray-400 whitespace-nowrap pt-0.5">
                          {format(dateObj, 'dd/MM')} • {format(dateObj, 'HH:mm')}
                        </p>
                      </div>
                      {record.note && (
                        <p className="text-sm text-gray-500 italic truncate border-t border-gray-50 pt-1 mt-1">
                          "{record.note}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
