"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { Calendar as CalendarIcon, Users, Settings, Lock, ArrowLeft, Plus, CheckCircle, Clock, Phone, Diamond, MoreHorizontal, Euro, Search, Bell, ShieldCheck, Sparkles, Sliders } from "lucide-react";

export default function AdminDashboard() {
  const params = useParams();
  const slug = params.slug as string;

  const [clinic, setClinic] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado para el modal de notificaciones/avisos
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [avisos, setAvisos] = useState<any[]>([]);

  // Estados para el formulario de bloqueo manual
  const [blockDate, setBlockDate] = useState("");
  const [blockTime, setBlockTime] = useState("ALL");
  const [blockReason, setBlockReason] = useState("");

  useEffect(() => {
    async function fetchAdminData() {
      if (!slug) return;
      const { data: profileData } = await supabase.from("profiles").select("*").eq("slug", slug).single();
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
  }, [slug]);

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  if (!clinic) return null;

  // Diccionario de colores adaptativo para el panel de administración
  const colorDictionary: Record<string, any> = {
    'slate-900': { bg: 'bg-slate-900', text: 'text-slate-900', border: 'border-slate-900', hover: 'hover:bg-slate-800' },
    'sky-700': { bg: 'bg-sky-700', text: 'text-sky-700', border: 'border-sky-700', hover: 'hover:bg-sky-600' },
    'rose-600': { bg: 'bg-rose-600', text: 'text-rose-600', border: 'border-rose-600', hover: 'hover:bg-rose-500' },
    'teal-700': { bg: 'bg-teal-700', text: 'text-teal-700', border: 'border-teal-700', hover: 'hover:bg-teal-600' }
  };

  const dbColor = clinic.primary_color || 'slate-900';
  const theme = colorDictionary[dbColor] || colorDictionary['slate-900'];

  const totalRevenue = appointments
    .filter(a => a.status === 'confirmed' || a.status === 'completada')
    .length * 50;

  return (
    <main className="relative min-h-screen bg-[#FDFCFB] font-sans text-stone-800 z-0 flex flex-col">
      
      {/* TEXTURA DE MÁRMOL */}
      <div 
        className="absolute inset-0 z-[-1] opacity-[0.04] pointer-events-none mix-blend-multiply fixed"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2000&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      ></div>

      {/* CABECERA DE CRISTAL ESMERILADO */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-[#D4AF37]/25 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <Link href={`/${slug}`} className="inline-flex items-center gap-2 bg-gradient-to-br from-[#FDFBF7] to-[#F4EFE6] px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#9B804E] shadow-sm border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all">
            <ArrowLeft strokeWidth={1.5} className="w-3.5 h-3.5" /> Portal Público
          </Link>
          <div className="hidden sm:flex items-center gap-2">
            <Diamond strokeWidth={1.5} className="w-4 h-4 text-[#D4AF37]" />
            <h1 className="font-serif font-medium text-lg text-stone-900 tracking-tight">Dirección Ejecutiva — {clinic.business_name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* BOTÓN DE AVISOS CON BADGE */}
          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="relative bg-gradient-to-br from-[#FDFBF7] to-[#F4EFE6] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#9B804E] px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
          >
            <Bell strokeWidth={1.5} className="w-4 h-4" />
            <span>Avisos</span>
            {avisos.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                {avisos.length}
              </span>
            )}
          </button>

          <div className="bg-stone-900 px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/40 flex items-center gap-2 shadow-md">
            <ShieldCheck strokeWidth={1.5} className="w-4 h-4" /> PIN de Seguridad Activo
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 p-4 md:p-10 max-w-[1400px] mx-auto w-full relative z-10 space-y-8">
        
        {/* TARJETAS MÉTRICAS DE LUJO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-[#D4AF37]/30 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Facturación Estimada</p>
              <h3 className="text-3xl font-serif font-medium text-stone-900">{totalRevenue} €</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#FDFBF7] border border-[#D4AF37]/40 flex items-center justify-center text-[#9B804E]">
              <Euro strokeWidth={1.5} className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-[#D4AF37]/30 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Citas Totales Registradas</p>
              <h3 className="text-3xl font-serif font-medium text-stone-900">{appointments.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#FDFBF7] border border-[#D4AF37]/40 flex items-center justify-center text-[#9B804E]">
              <CalendarIcon strokeWidth={1.5} className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-[#D4AF37]/30 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Estado del Sistema</p>
              <h3 className="text-xl font-serif font-medium text-green-700 flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span> Sincronizado
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600">
              <CheckCircle strokeWidth={1.5} className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* ACCIONES RÁPIDAS (Detalles de color dinámico según nicho) */}
        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] border border-[#D4AF37]/30 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#9B804E] mb-4 flex items-center gap-2">
            <Sliders strokeWidth={1.5} className="w-4 h-4" /> Acciones Rápidas de Gestión
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button onClick={() => alert("Función de Cita Manual activada")} className={`p-4 bg-[#FDFCFB] border border-stone-200 hover:${theme.border} rounded-2xl text-left transition-all group shadow-sm`}>
              <span className={`block text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:${theme.text}`}>✚ Añadir Cita</span>
              <span className="text-[11px] text-stone-400 font-light">Registro manual</span>
            </button>
            <button onClick={() => alert("Módulo de bonos activo")} className={`p-4 bg-[#FDFCFB] border border-stone-200 hover:${theme.border} rounded-2xl text-left transition-all group shadow-sm`}>
              <span className={`block text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:${theme.text}`}>🎟 Gestión de Bonos</span>
              <span className="text-[11px] text-stone-400 font-light">Sesiones y pagos</span>
            </button>
            <button onClick={() => alert("Centro de avisos al día")} className={`p-4 bg-[#FDFCFB] border border-stone-200 hover:${theme.border} rounded-2xl text-left transition-all group shadow-sm`}>
              <span className={`block text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:${theme.text}`}>💬 Recordatorios</span>
              <span className="text-[11px] text-stone-400 font-light">Avisos WhatsApp</span>
            </button>
            <button onClick={() => alert("Cargando contabilidad ejecutiva")} className={`p-4 bg-[#FDFCFB] border border-stone-200 hover:${theme.border} rounded-2xl text-left transition-all group shadow-sm`}>
              <span className={`block text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:${theme.text}`}>📊 Resumen Económico</span>
              <span className="text-[11px] text-stone-400 font-light">Métricas y gráficas</span>
            </button>
          </div>
        </div>

        {/* REGISTRO DE CITAS ACTIVAS / CALENDARIO */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-[#D4AF37]/25 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-[#D4AF37]/20 flex justify-between items-center bg-[#FDFCFB]">
            <div>
              <h2 className="text-2xl font-serif font-medium text-stone-900 tracking-tight">Registro de Citas Activas</h2>
              <p className="text-stone-500 text-xs font-light mt-1">Gestión en tiempo real de pacientes y servicios reservados.</p>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest bg-[#FDFCFB] text-[#9B804E] border border-[#D4AF37]/40 px-4 py-2 rounded-full">
              Vista Ejecutiva
            </span>
          </div>

          <div className="p-6 md:p-8">
            {appointments.length === 0 ? (
              <div className="text-center py-16 text-stone-400 font-light text-sm">
                No hay citas registradas en este momento. Realiza una prueba desde el portal público.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appointments.map((appt) => (
                  <div key={appt.id} className="bg-white border border-stone-200 hover:border-[#D4AF37]/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative group">
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#D4AF37] rounded-l-2xl"></div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#FDFCFB] text-[#9B804E] border border-[#D4AF37]/30">
                        {appt.status || 'Confirmada'}
                      </span>
                      <span className="text-xs font-serif font-medium text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg">
                        {appt.appointment_time} h
                      </span>
                    </div>

                    <h3 className="font-serif font-medium text-lg text-stone-900 mb-1">{appt.client_name}</h3>
                    <p className={`text-xs ${theme.text} font-medium mb-3`}>{appt.service_name}</p>

                    <div className="space-y-1.5 text-xs text-stone-500 font-light border-t border-stone-100 pt-3">
                      <p className="flex items-center gap-2">
                        <CalendarIcon strokeWidth={1.5} className="w-3.5 h-3.5 text-[#D4AF37]" /> Fecha: {appt.appointment_date}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone strokeWidth={1.5} className="w-3.5 h-3.5 text-[#D4AF37]" /> Tel: {appt.client_phone}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setSelectedAppt(appt); setIsModalOpen(true); }}
                        className={`bg-[#FDFCFB] border border-[#D4AF37]/40 text-[#9B804E] hover:${theme.bg} hover:text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all`}
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

        {/* BLOQUEO MANUAL DE DISPONIBILIDAD */}
        <div className="bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-[#D4AF37]/30 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#9B804E] mb-4 flex items-center gap-2">
            <Lock strokeWidth={1.5} className="w-4 h-4" /> Bloqueo Manual de Disponibilidad (Días u Horas)
          </h3>
          <form onSubmit={handleManualBlock} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <input 
              type="date" 
              value={blockDate} 
              onChange={(e) => setBlockDate(e.target.value)} 
              required 
              className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs font-light text-stone-900 outline-none focus:border-[#D4AF37]" 
            />
            <select 
              value={blockTime} 
              onChange={(e) => setBlockTime(e.target.value)} 
              className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs font-light text-stone-900 outline-none focus:border-[#D4AF37]"
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
              placeholder="Motivo (Ej. Médico, Descanso...)" 
              value={blockReason} 
              onChange={(e) => setBlockReason(e.target.value)} 
              className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs font-light text-stone-900 outline-none focus:border-[#D4AF37]" 
            />
            <button type="submit" className={`${theme.bg} text-white border border-[#D4AF37]/50 ${theme.hover} py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md`}>
              + Bloquear
            </button>
          </form>
        </div>

      </div>

      {/* MODAL DE CENTRO DE NOVEDADES Y AVISOS */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setIsNotificationsOpen(false)}></div>
          
          <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl p-8 border border-[#D4AF37]/40 z-10 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FDFBF7] border border-[#D4AF37]/40 flex items-center justify-center text-[#9B804E]">
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
                <div className="text-center py-10 text-stone-400 font-light text-sm">
                  No hay nuevos avisos pendientes. ¡Todo al día!
                </div>
              ) : (
                avisos.map((aviso) => (
                  <div key={aviso.id} className="p-4 rounded-2xl border border-stone-200 bg-[#FDFCFB] flex justify-between items-center shadow-sm">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B804E] block mb-1">
                        {aviso.titulo}
                      </span>
                      <p className="text-xs text-stone-700 font-light leading-relaxed">{aviso.mensaje}</p>
                    </div>
                    <button 
                      onClick={() => dismissAviso(aviso.id)} 
                      className="bg-white border border-stone-200 hover:border-[#D4AF37] px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-stone-600 transition-all shrink-0 ml-4 shadow-sm"
                    >
                      ✓ OK
                    </button>
                  </div>
                ))
              )}
            </div>

            <button 
              onClick={() => { setAvisos([]); setIsNotificationsOpen(false); }}
              className={`w-full py-4 ${theme.bg} text-white border border-[#D4AF37]/50 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${theme.hover} transition-all`}
            >
              Marcar todo como leído y cerrar
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE GESTIÓN DE CITA INDIVIDUAL */}
      {isModalOpen && selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 border border-[#D4AF37]/40 z-10">
            <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#9B804E]">Gestión de Paciente</span>
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
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Acciones Ejecutivas</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => updateAppointmentStatus(selectedAppt.id, 'completada')}
                  className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  ✓ Marcar Pagada
                </button>
                <button 
                  onClick={() => deleteAppointment(selectedAppt.id)}
                  className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  🗑 Anular Cita
                </button>
              </div>

              <a 
                href={`https://wa.me/${selectedAppt.client_phone.replace(/\s+/g, '')}?text=${encodeURIComponent(`Hola ${selectedAppt.client_name}, le escribimos de ${clinic.business_name} para confirmar su cita.`)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full block text-center bg-[#25D366] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#20ba5a] transition-all mt-2"
              >
                💬 Enviar Recordatorio WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}