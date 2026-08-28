"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { Calendar as CalendarIcon, Lock, ArrowLeft, CheckCircle, Phone, Stethoscope, Euro, Bell, ShieldCheck, Sliders, Activity } from "lucide-react";

export default function DentalAdminDashboard() {
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
      const { data: profileData } = await supabase.from("profiles").select("*").eq("slug", "dental-demo").single();
      if (profileData) {
        setClinic(profileData);
        const { data: apptsData } = await supabase.from("appointments").select("*").eq("profile_id", profileData.id).order('appointment_date', { ascending: true });
        if (apptsData) {
          setAppointments(apptsData);
          const sampleAvisos = apptsData.slice(0, 4).map((appt, idx) => ({
            id: idx + 1,
            tipo: idx === 2 ? 'modificacion' : 'nueva',
            titulo: idx === 2 ? 'Cita Modificada' : 'Nueva Reserva Dental',
            mensaje: idx === 2 
              ? `${appt.client_name} ha modificado su cita para el ${appt.appointment_date} a las ${appt.appointment_time} h.`
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
    alert(`Quirófano / Box bloqueado para el día ${blockDate} (${blockTime === 'ALL' ? 'Jornada Completa' : blockTime + ' h'}).`);
    setBlockDate("");
    setBlockReason("");
  };

  const dismissAviso = (id: number) => {
    setAvisos(prev => prev.filter(a => a.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-700"></div>
      </div>
    );
  }

  if (!clinic) return null;

  const totalRevenue = appointments
    .filter(a => a.status === 'confirmed' || a.status === 'completada')
    .length * 80;

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans text-stone-800 z-0 flex flex-col">
      
      {/* CABECERA CORPORATIVA DENTAL (Tonos Azul Clínico / Sky) */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-sky-900/15 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/dental-demo" className="inline-flex items-center gap-2 bg-[#F8FAFC] px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-sky-800 shadow-sm border border-sky-200 hover:border-sky-700 transition-all">
            <ArrowLeft strokeWidth={1.5} className="w-3.5 h-3.5" /> Portal Público
          </Link>
          <div className="hidden sm:flex items-center gap-2">
            <Stethoscope strokeWidth={1.5} className="w-4 h-4 text-sky-700" />
            <h1 className="font-serif font-medium text-lg text-stone-900 tracking-tight">Gestión de Quirófanos y Odontología — {clinic.business_name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="relative bg-[#F8FAFC] border border-sky-200 hover:border-sky-700 text-sky-800 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
          >
            <Bell strokeWidth={1.5} className="w-4 h-4" />
            <span>Avisos</span>
            {avisos.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-sky-700 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                {avisos.length}
              </span>
            )}
          </button>

          <div className="bg-sky-900 px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-sky-800 flex items-center gap-2 shadow-md">
            <ShieldCheck strokeWidth={1.5} className="w-4 h-4 text-sky-300" /> PIN de Seguridad Activo
          </div>
        </div>
      </header>

      {/* DISEÑO ASIMÉTRICO EN DOS COLUMNAS */}
      <div className="flex-1 p-4 md:p-10 max-w-[1500px] mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA (2/3): AGENDA PRINCIPAL Y BLOQUEO */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* REGISTRO DE CITAS / BOXES */}
          <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-sky-900/10 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-sky-900/10 flex justify-between items-center bg-[#F8FAFC]">
              <div>
                <h2 className="text-2xl font-serif font-medium text-stone-900 tracking-tight">Agenda de Quirófanos y Boxes</h2>
                <p className="text-stone-500 text-xs font-light mt-1">Control activo de pacientes y tratamientos odontológicos.</p>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest bg-sky-50 text-sky-800 border border-sky-200 px-4 py-2 rounded-full">
                Vista Quirúrgica
              </span>
            </div>

            <div className="p-6 md:p-8">
              {appointments.length === 0 ? (
                <div className="text-center py-16 text-stone-400 font-light text-sm">
                  No hay citas odontológicas registradas en este momento.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {appointments.map((appt) => (
                    <div key={appt.id} className="bg-white border border-stone-200 hover:border-sky-700 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative group">
                      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-sky-700 rounded-l-2xl"></div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                          {appt.status || 'Confirmada'}
                        </span>
                        <span className="text-xs font-serif font-medium text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg">
                          {appt.appointment_time} h
                        </span>
                      </div>

                      <h3 className="font-serif font-medium text-lg text-stone-900 mb-1">{appt.client_name}</h3>
                      <p className="text-xs text-sky-800 font-medium mb-3">{appt.service_name}</p>

                      <div className="space-y-1.5 text-xs text-stone-500 font-light border-t border-stone-100 pt-3">
                        <p className="flex items-center gap-2">
                          <CalendarIcon strokeWidth={1.5} className="w-3.5 h-3.5 text-sky-700" /> Fecha: {appt.appointment_date}
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone strokeWidth={1.5} className="w-3.5 h-3.5 text-sky-700" /> Tel: {appt.client_phone}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setSelectedAppt(appt); setIsModalOpen(true); }}
                          className="bg-[#F8FAFC] border border-sky-200 text-sky-800 hover:bg-sky-700 hover:text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
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

          {/* BLOQUEO MANUAL DE BOXES */}
          <div className="bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-sky-900/10 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-sky-800 mb-4 flex items-center gap-2">
              <Lock strokeWidth={1.5} className="w-4 h-4" /> Bloqueo Manual de Box / Quirófano
            </h3>
            <form onSubmit={handleManualBlock} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <input 
                type="date" 
                value={blockDate} 
                onChange={(e) => setBlockDate(e.target.value)} 
                required 
                className="bg-[#F8FAFC] border border-stone-200 rounded-xl p-3 text-xs font-light text-stone-900 outline-none focus:border-sky-700" 
              />
              <select 
                value={blockTime} 
                onChange={(e) => setBlockTime(e.target.value)} 
                className="bg-[#F8FAFC] border border-stone-200 rounded-xl p-3 text-xs font-light text-stone-900 outline-none focus:border-sky-700"
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
                placeholder="Motivo (Ej. Mantenimiento, Implantes...)" 
                value={blockReason} 
                onChange={(e) => setBlockReason(e.target.value)} 
                className="bg-[#F8FAFC] border border-stone-200 rounded-xl p-3 text-xs font-light text-stone-900 outline-none focus:border-sky-700" 
              />
              <button type="submit" className="bg-sky-800 text-white border border-sky-900 hover:bg-sky-900 py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md">
                + Bloquear
              </button>
            </form>
          </div>

        </div>

        {/* COLUMNA DERECHA (1/3): PANEL LATERAL FLOTANTE DE MÉTRICAS Y ACCESOS */}
        <div className="space-y-6">
          
          {/* TARJETAS MÉTRICAS EN VERTICAL */}
          <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] border border-sky-900/10 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-sky-800 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Resumen Financiero
            </h3>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-sky-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Facturación Estimada</p>
                <h3 className="text-2xl font-serif font-medium text-stone-900">{totalRevenue} €</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-800">
                <Euro strokeWidth={1.5} className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-sky-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Citas Activas</p>
                <h3 className="text-2xl font-serif font-medium text-stone-900">{appointments.length}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-800">
                <CalendarIcon strokeWidth={1.5} className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-sky-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Estado de Sincronización</p>
                <h3 className="text-sm font-bold text-green-700 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> En Línea (Cloud)
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <CheckCircle strokeWidth={1.5} className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* ACCIONES RÁPIDAS EN VERTICAL */}
          <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] border border-sky-900/10 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-sky-800 mb-4 flex items-center gap-2">
              <Sliders strokeWidth={1.5} className="w-4 h-4" /> Acciones Rápidas
            </h3>
            
            <button onClick={() => alert("Función de Cita Manual activada")} className="w-full p-3.5 bg-[#F8FAFC] border border-stone-200 hover:border-sky-700 rounded-xl text-left transition-all group flex justify-between items-center shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:text-sky-800">✚ Añadir Cita Dental</span>
              <span className="text-xs text-sky-700 font-bold">→</span>
            </button>
            <button onClick={() => alert("Módulo de presupuestos activo")} className="w-full p-3.5 bg-[#F8FAFC] border border-stone-200 hover:border-sky-700 rounded-xl text-left transition-all group flex justify-between items-center shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:text-sky-800">📋 Presupuestos y Planes</span>
              <span className="text-xs text-sky-700 font-bold">→</span>
            </button>
            <button onClick={() => alert("Centro de avisos al día")} className="w-full p-3.5 bg-[#F8FAFC] border border-stone-200 hover:border-sky-700 rounded-xl text-left transition-all group flex justify-between items-center shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:text-sky-800">💬 Recordatorios WhatsApp</span>
              <span className="text-xs text-sky-700 font-bold">→</span>
            </button>
          </div>

        </div>

      </div>

      {/* MODALES */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setIsNotificationsOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl p-8 border border-sky-900/20 z-10 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-800">
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
                  <div key={aviso.id} className="p-4 rounded-2xl border border-stone-200 bg-[#F8FAFC] flex justify-between items-center shadow-sm">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block mb-1">{aviso.titulo}</span>
                      <p className="text-xs text-stone-700 font-light leading-relaxed">{aviso.mensaje}</p>
                    </div>
                    <button onClick={() => dismissAviso(aviso.id)} className="bg-white border border-stone-200 hover:border-sky-700 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-stone-600 transition-all shrink-0 ml-4 shadow-sm">✓ OK</button>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => { setAvisos([]); setIsNotificationsOpen(false); }} className="w-full py-4 bg-sky-800 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:bg-sky-900 transition-all">
              Marcar todo como leído y cerrar
            </button>
          </div>
        </div>
      )}

      {isModalOpen && selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 border border-sky-900/20 z-10">
            <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-sky-800">Gestión de Paciente</span>
                <h3 className="font-serif font-medium text-2xl text-stone-900">{selectedAppt.client_name}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-9 h-9 bg-stone-100 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors">✕</button>
            </div>
            <div className="space-y-4 mb-8 text-sm text-stone-600 font-light bg-[#F8FAFC] p-5 rounded-2xl border border-stone-100">
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