"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { Calendar as CalendarIcon, Lock, ArrowLeft, CheckCircle, Phone, Sparkles, Euro, Bell, ShieldCheck, Scissors } from "lucide-react";

export default function BeautyAdminDashboard() {
  const [clinic, setClinic] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [avisos, setAvisos] = useState<any[]>([]);

  const [blockDate, setBlockDate] = useState("");
  const [blockTime, setBlockTime] = useState("ALL");
  const [blockReason, setBlockReason] = useState("");

  useEffect(() => {
    async function fetchAdminData() {
      const { data: profileData } = await supabase.from("profiles").select("*").eq("slug", "beauty-demo").single();
      if (profileData) {
        setClinic(profileData);
        const { data: apptsData } = await supabase.from("appointments").select("*").eq("profile_id", profileData.id).order('appointment_date', { ascending: true });
        if (apptsData) {
          setAppointments(apptsData);
          const sampleAvisos = apptsData.slice(0, 4).map((appt, idx) => ({
            id: idx + 1,
            tipo: idx === 2 ? 'modificacion' : 'nueva',
            titulo: idx === 2 ? 'Cita Modificada' : 'Nueva Reserva Boutique',
            mensaje: idx === 2 
              ? `${appt.client_name} ha modificado su sesión de estética al ${appt.appointment_date} a las ${appt.appointment_time} h.`
              : `Nueva reserva de ${appt.client_name} para el ${appt.appointment_date} a las ${appt.appointment_time} h.`
          }));
          setAvisos(sampleAvisos);
        }
      }
      setLoading(false);
    }
    fetchAdminData();
  }, []);

  const updateAppointmentStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("appointments").update({ status: newStatus }).eq("id", id);
    if (!error) {
      setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
      setIsModalOpen(false);
    }
  };

  const deleteAppointment = async (id: string) => {
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (!error) {
      setAppointments(prev => prev.filter(app => app.id !== id));
      setIsModalOpen(false);
    }
  };

  const handleManualBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDate) return;
    alert(`Cabina / Estación bloqueada para el día ${blockDate} (${blockTime === 'ALL' ? 'Jornada Completa' : blockTime + ' h'}).`);
    setBlockDate("");
    setBlockReason("");
  };

  const dismissAviso = (id: number) => {
    setAvisos(prev => prev.filter(a => a.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF9]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (!clinic) return null;

  const totalRevenue = appointments
    .filter(a => a.status === 'confirmed' || a.status === 'completada')
    .length * 65;

  return (
    <main className="min-h-screen bg-[#FDFBF9] font-sans text-stone-800 flex flex-col md:flex-row z-0">
      
      {/* PANEL LATERAL BOUTIQUE (Estilo Revista de Lujo) */}
      <aside className="w-full md:w-80 bg-stone-900 text-stone-100 p-8 flex flex-col justify-between border-r border-rose-500/20 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-5 h-5 text-rose-400" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-rose-300">Boutique Suite</span>
          </div>
          <h1 className="text-2xl font-serif font-light mb-2">{clinic.business_name}</h1>
          <p className="text-xs text-stone-400 font-light mb-10">Control exclusivo de sesiones, estética avanzada y bonos.</p>
          
          <nav className="space-y-3">
            <Link href="/beauty-demo" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs tracking-wider uppercase transition-all text-stone-200">
              <ArrowLeft className="w-4 h-4 text-rose-400" /> Ver Portal Público
            </Link>
            <button 
              onClick={() => setIsNotificationsOpen(true)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-xs tracking-wider uppercase transition-all text-rose-200 font-bold"
            >
              <span className="flex items-center gap-2">🔔 Centro de Avisos</span>
              {avisos.length > 0 && (
                <span className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {avisos.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="pt-8 border-t border-stone-800 text-[10px] text-stone-500 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-rose-400" /> Sincronización iPad Activa
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL ASIMÉTRICO */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto space-y-8">
        
        {/* CABECERA Y MÉTRICAS EN LÍNEA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-stone-200">
          <div>
            <h2 className="text-3xl font-serif font-normal text-stone-900">Panel de Control Estético</h2>
            <p className="text-xs text-stone-500 font-light mt-1">Gestión fluida de citas y recordatorios automatizados.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-4 rounded-2xl border border-stone-200 shadow-sm">
              <span className="text-[10px] uppercase tracking-widest text-stone-400 block">Facturación</span>
              <span className="text-2xl font-serif font-medium text-stone-900">{totalRevenue} €</span>
            </div>
            <div className="bg-white px-6 py-4 rounded-2xl border border-stone-200 shadow-sm">
              <span className="text-[10px] uppercase tracking-widest text-stone-400 block">Citas Totales</span>
              <span className="text-2xl font-serif font-medium text-rose-600">{appointments.length}</span>
            </div>
          </div>
        </div>

        {/* LISTADO DE TRATAMIENTOS EN FORMATO HORIZONTAL ELEGANTE */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">Tratamientos y Sesiones Agendadas</h3>
          
          {appointments.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center text-stone-400 text-sm font-light">
              No hay tratamientos agendados en este momento.
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((appt) => (
                <div key={appt.id} className="bg-white p-6 rounded-2xl border border-stone-200 hover:border-rose-300 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm relative group">
                  <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-rose-500 rounded-l-2xl"></div>
                  <div className="flex items-center gap-4 pl-2">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                      <Scissors className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif font-medium text-lg text-stone-900">{appt.client_name}</h4>
                      <p className="text-xs text-rose-600 font-medium">{appt.service_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                    <div className="text-right">
                      <span className="text-xs font-serif font-bold text-stone-900 block">{appt.appointment_date}</span>
                      <span className="text-[11px] text-stone-400">{appt.appointment_time} h</span>
                    </div>
                    <button 
                      onClick={() => { setSelectedAppt(appt); setIsModalOpen(true); }}
                      className="bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm"
                    >
                      Gestionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BLOQUEO MANUAL DE CABINAS */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-sm mt-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4 flex items-center gap-2">
            <Lock strokeWidth={1.5} className="w-4 h-4 text-rose-500" /> Bloqueo Manual de Cabina / Estación
          </h3>
          <form onSubmit={handleManualBlock} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <input 
              type="date" 
              value={blockDate} 
              onChange={(e) => setBlockDate(e.target.value)} 
              required 
              className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs font-light text-stone-900 outline-none focus:border-rose-500" 
            />
            <select 
              value={blockTime} 
              onChange={(e) => setBlockTime(e.target.value)} 
              className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs font-light text-stone-900 outline-none focus:border-rose-500"
            >
              <option value="ALL">Jornada Completa</option>
              <option value="10:00">10:00 h</option>
              <option value="11:30">11:30 h</option>
              <option value="13:00">13:00 h</option>
              <option value="16:00">16:00 h</option>
              <option value="17:30">17:30 h</option>
            </select>
            <input 
              type="text" 
              placeholder="Motivo (Ej. Mantenimiento Láser...)" 
              value={blockReason} 
              onChange={(e) => setBlockReason(e.target.value)} 
              className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs font-light text-stone-900 outline-none focus:border-rose-500" 
            />
            <button type="submit" className="bg-stone-900 text-white hover:bg-stone-800 py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md">
              + Bloquear
            </button>
          </form>
        </div>

      </div>

      {/* MODALES */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setIsNotificationsOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl p-8 border border-stone-200 z-10 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600"><Bell strokeWidth={1.5} className="w-5 h-5" /></div>
                <div><h3 className="font-serif font-medium text-2xl text-stone-900">Centro de Novedades</h3><p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Avisos en tiempo real</p></div>
              </div>
              <button onClick={() => setIsNotificationsOpen(false)} className="w-9 h-9 bg-stone-100 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors">✕</button>
            </div>
            <div className="space-y-4 mb-8">
              {avisos.length === 0 ? <div className="text-center py-10 text-stone-400 text-sm">No hay nuevos avisos.</div> : avisos.map((aviso) => (
                <div key={aviso.id} className="p-4 rounded-2xl border border-stone-200 bg-[#FDFBF9] flex justify-between items-center shadow-sm">
                  <div><span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block mb-1">{aviso.titulo}</span><p className="text-xs text-stone-700 font-light">{aviso.mensaje}</p></div>
                  <button onClick={() => dismissAviso(aviso.id)} className="bg-white border border-stone-200 hover:border-stone-900 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-stone-600">✓ OK</button>
                </div>
              ))}
            </div>
            <button onClick={() => { setAvisos([]); setIsNotificationsOpen(false); }} className="w-full py-4 bg-stone-900 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-all">Marcar todo como leído y cerrar</button>
          </div>
        </div>
      )}

      {isModalOpen && selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 border border-stone-200 z-10">
            <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
              <div><span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Gestión de Clienta</span><h3 className="font-serif font-medium text-2xl text-stone-900">{selectedAppt.client_name}</h3></div>
              <button onClick={() => setIsModalOpen(false)} className="w-9 h-9 bg-stone-100 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors">✕</button>
            </div>
            <div className="space-y-4 mb-8 text-sm text-stone-600 font-light bg-[#FDFBF9] p-5 rounded-2xl border border-stone-100">
              <p><strong>Tratamiento:</strong> {selectedAppt.service_name}</p>
              <p><strong>Fecha y Hora:</strong> {selectedAppt.appointment_date} a las {selectedAppt.appointment_time}</p>
              <p><strong>Teléfono:</strong> {selectedAppt.client_phone}</p>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => updateAppointmentStatus(selectedAppt.id, 'completada')} className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all">✓ Marcar Pagada</button>
                <button onClick={() => deleteAppointment(selectedAppt.id)} className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all">🗑 Anular Cita</button>
              </div>
              <a href={`https://wa.me/${selectedAppt.client_phone.replace(/\s+/g, '')}?text=${encodeURIComponent(`Hola ${selectedAppt.client_name}, le escribimos de ${clinic.business_name} para confirmar su cita.`)}`} target="_blank" rel="noopener noreferrer" className="w-full block text-center bg-[#25D366] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#20ba5a] transition-all mt-2">
                💬 Enviar Recordatorio WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}