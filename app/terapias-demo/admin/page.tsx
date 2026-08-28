"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { Calendar as CalendarIcon, Lock, ArrowLeft, CheckCircle, Phone, Leaf, Euro, Bell, ShieldCheck, Sliders } from "lucide-react";

export default function TerapiasAdminDashboard() {
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
      const { data: profileData } = await supabase.from("profiles").select("*").eq("slug", "terapias-demo").single();
      if (profileData) {
        setClinic(profileData);
        const { data: apptsData } = await supabase.from("appointments").select("*").eq("profile_id", profileData.id).order('appointment_date', { ascending: true });
        if (apptsData) {
          setAppointments(apptsData);
          const sampleAvisos = apptsData.slice(0, 4).map((appt, idx) => ({
            id: idx + 1,
            tipo: idx === 2 ? 'modificacion' : 'nueva',
            titulo: idx === 2 ? 'Cita Modificada' : 'Nueva Reserva',
            mensaje: idx === 2 
              ? `${appt.client_name} ha modificado su horario al ${appt.appointment_date} a las ${appt.appointment_time} h.`
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
    alert(`Bloqueo registrado con éxito para el día ${blockDate} (${blockTime === 'ALL' ? 'Jornada Completa' : blockTime + ' h'}).`);
    setBlockDate("");
    setBlockReason("");
  };

  const dismissAviso = (id: number) => {
    setAvisos(prev => prev.filter(a => a.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
      </div>
    );
  }

  if (!clinic) return null;

  const totalRevenue = appointments
    .filter(a => a.status === 'confirmed' || a.status === 'completada')
    .length * 60;

  return (
    <main className="min-h-screen bg-[#FDFCFB] font-sans text-stone-800 z-0 flex flex-col">
      
      {/* CABECERA (Adaptada para móvil con pt-12) */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-stone-200 px-4 md:px-6 pt-12 pb-4 md:py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/terapias-demo" className="inline-flex items-center gap-2 bg-[#FDFCFB] px-4 md:px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-700 shadow-sm border border-stone-200 hover:border-stone-900 transition-all">
            <ArrowLeft strokeWidth={1.5} className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Portal Público</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2">
            <Leaf strokeWidth={1.5} className="w-4 h-4 text-stone-900" />
            <h1 className="font-serif font-medium text-lg text-stone-900 tracking-tight">Dirección Ejecutiva — {clinic.business_name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="relative bg-[#FDFCFB] border border-stone-200 hover:border-stone-900 text-stone-700 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
          >
            <Bell strokeWidth={1.5} className="w-4 h-4" />
            <span className="hidden sm:inline">Avisos</span>
            {avisos.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-stone-900 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                {avisos.length}
              </span>
            )}
          </button>

          <div className="bg-stone-900 px-4 md:px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-stone-900 flex items-center gap-2 shadow-md">
            <ShieldCheck strokeWidth={1.5} className="w-4 h-4 text-[#D4AF37]" /> <span className="hidden sm:inline">PIN de Seguridad Activo</span>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 p-4 md:p-10 max-w-[1400px] mx-auto w-full relative z-10 space-y-8">
        
        {/* TARJETAS MÉTRICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Facturación Estimada</p>
              <h3 className="text-3xl font-serif font-medium text-stone-900">{totalRevenue} €</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-900">
              <Euro strokeWidth={1.5} className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Sesiones Registradas</p>
              <h3 className="text-3xl font-serif font-medium text-stone-900">{appointments.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-900">
              <CalendarIcon strokeWidth={1.5} className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Estado del Sistema</p>
              <h3 className="text-xl font-serif font-medium text-stone-900 flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-green-600 animate-pulse"></span> Sincronizado
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-900">
              <CheckCircle strokeWidth={1.5} className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* ACCIONES RÁPIDAS */}
        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] border border-stone-200 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-700 mb-4 flex items-center gap-2">
            <Sliders strokeWidth={1.5} className="w-4 h-4" /> Acciones Rápidas de Gestión
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button onClick={() => alert("Función de Cita Manual activada")} className="p-4 bg-[#FDFCFB] border border-stone-200 hover:border-stone-900 rounded-2xl text-left transition-all group shadow-sm">
              <span className="block text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:text-stone-700">✚ Añadir Sesión</span>
              <span className="text-[11px] text-stone-400 font-light">Registro manual</span>
            </button>
            <button onClick={() => alert("Módulo de bonos activo")} className="p-4 bg-[#FDFCFB] border border-stone-200 hover:border-stone-900 rounded-2xl text-left transition-all group shadow-sm">
              <span className="block text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:text-stone-700">🎟 Bonos de Salud</span>
              <span className="text-[11px] text-stone-400 font-light">Sesiones y bonos</span>
            </button>
            <button onClick={() => alert("Centro de avisos al día")} className="p-4 bg-[#FDFCFB] border border-stone-200 hover:border-stone-900 rounded-2xl text-left transition-all group shadow-sm">
              <span className="block text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:text-stone-700">💬 Recordatorios</span>
              <span className="text-[11px] text-stone-400 font-light">Avisos WhatsApp</span>
            </button>
            <button onClick={() => alert("Cargando contabilidad ejecutiva")} className="p-4 bg-[#FDFCFB] border border-stone-200 hover:border-stone-900 rounded-2xl text-left transition-all group shadow-sm">
              <span className="block text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:text-stone-700">📊 Resumen Clínico</span>
              <span className="text-[11px] text-stone-400 font-light">Métricas y gráficas</span>
            </button>
          </div>
        </div>

        {/* REGISTRO DE CITAS ACTIVAS */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-stone-200 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-stone-200 flex justify-between items-center bg-[#FDFCFB]">
            <div>
              <h2 className="text-2xl font-serif font-medium text-stone-900 tracking-tight">Agenda Clínica y Pacientes</h2>
              <p className="text-stone-500 text-xs font-light mt-1">Seguimiento en tiempo real de tratamientos de bienestar.</p>
            </div>
            <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-widest bg-stone-900 text-white px-4 py-2 rounded-full shadow-sm">
              Vista Clínica
            </span>
          </div>

          <div className="p-6 md:p-8">
            {appointments.length === 0 ? (
              <div className="text-center py-16 text-stone-400 font-light text-sm">
                No hay sesiones registradas en este momento.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appointments.map((appt) => (
                  <div key={appt.id} className="bg-white border border-stone-200 hover:border-stone-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative group">
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-stone-900 rounded-l-2xl"></div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-stone-100 text-stone-800 border border-stone-200">
                        {appt.status || 'Confirmada'}
                      </span>
                      <span className="text-xs font-serif font-medium text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg">
                        {appt.appointment_time} h
                      </span>
                    </div>

                    <h3 className="font-serif font-medium text-lg text-stone-900 mb-1">{appt.client_name}</h3>
                    <p className="text-xs text-stone-600 font-medium mb-3">{appt.service_name}</p>

                    <div className="space-y-1.5 text-xs text-stone-500 font-light border-t border-stone-100 pt-3">
                      <p className="flex items-center gap-2">
                        <CalendarIcon strokeWidth={1.5} className="w-3.5 h-3.5 text-stone-900" /> Fecha: {appt.appointment_date}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone strokeWidth={1.5} className="w-3.5 h-3.5 text-stone-900" /> Tel: {appt.client_phone}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setSelectedAppt(appt); setIsModalOpen(true); }}
                        className="bg-[#FDFCFB] border border-stone-200 text-stone-700 hover:bg-stone-900 hover:text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                      >
                        Gestionar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BLOQUEO MANUAL */}
        <div className="bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-stone-200 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-700 mb-4 flex items-center gap-2">
            <Lock strokeWidth={1.5} className="w-4 h-4" /> Bloqueo Manual de Disponibilidad
          </h3>
          <form onSubmit={handleManualBlock} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <input 
              type="date" 
              value={blockDate} 
              onChange={(e) => setBlockDate(e.target.value)} 
              required 
              className="bg-[#FDFCFB] border border-stone-200 rounded-xl p-3 text-xs font-light text-stone-900 outline-none focus:border-stone-900" 
            />
            <select 
              value={blockTime} 
              onChange={(e) => setBlockTime(e.target.value)} 
              className="bg-[#FDFCFB] border border-stone-200 rounded-xl p-3 text-xs font-light text-stone-900 outline-none focus:border-stone-900"
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
              placeholder="Motivo (Ej. Congreso, Descanso...)" 
              value={blockReason} 
              onChange={(e) => setBlockReason(e.target.value)} 
              className="bg-[#FDFCFB] border border-stone-200 rounded-xl p-3 text-xs font-light text-stone-900 outline-none focus:border-stone-900" 
            />
            <button type="submit" className="bg-stone-900 text-white border border-stone-900 hover:bg-stone-800 py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md">
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
                <div className="w-10 h-10 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-900">
                  <Bell strokeWidth={1.5} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-medium text-2xl text-stone-900">Centro de Novedades</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Avisos registrados en tiempo real</p>
                </div>
              </div>
              <button onClick={() => setIsNotificationsOpen(false)} className="w-9 h-9 bg-stone-100 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors">✕</button>
            </div>
            <div className="space-y-4 mb-8">
              {avisos.length === 0 ? (
                <div className="text-center py-10 text-stone-400 font-light text-sm">No hay nuevos avisos pendientes.</div>
              ) : (
                avisos.map((aviso) => (
                  <div key={aviso.id} className="p-4 rounded-2xl border border-stone-200 bg-[#FDFCFB] flex justify-between items-center shadow-sm">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 block mb-1">{aviso.titulo}</span>
                      <p className="text-xs text-stone-700 font-light leading-relaxed">{aviso.mensaje}</p>
                    </div>
                    <button onClick={() => dismissAviso(aviso.id)} className="bg-white border border-stone-200 hover:border-stone-900 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-stone-600 transition-all shrink-0 ml-4 shadow-sm">✓ OK</button>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => { setAvisos([]); setIsNotificationsOpen(false); }} className="w-full py-4 bg-stone-900 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:bg-stone-800 transition-all">
              Marcar todo como leído y cerrar
            </button>
          </div>
        </div>
      )}

      {isModalOpen && selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 border border-stone-200 z-10">
            <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Gestión de Paciente</span>
                <h3 className="font-serif font-medium text-2xl text-stone-900">{selectedAppt.client_name}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-9 h-9 bg-stone-100 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors">✕</button>
            </div>
            <div className="space-y-4 mb-8 text-sm text-stone-600 font-light bg-[#FDFCFB] p-5 rounded-2xl border border-stone-100">
              <p><strong>Servicio:</strong> {selectedAppt.service_name}</p>
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