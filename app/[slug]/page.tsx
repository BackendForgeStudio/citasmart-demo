"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { Clock, MapPin, Star, ArrowRight, Phone, Sparkles, X, ChevronLeft, ChevronRight, User, ArrowLeft, LayoutDashboard, Diamond, CheckCircle2 } from "lucide-react";

export default function BookingPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [clinic, setClinic] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [bookedAppointments, setBookedAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedService, setSelectedService] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTimes = ["10:00", "11:30", "13:00", "16:00", "17:30", "19:00"];

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      const { data: profileData } = await supabase.from("profiles").select("*").eq("slug", slug).single();
      if (profileData) {
        setClinic(profileData);
        
        const { data: servicesData } = await supabase.from("services").select("*").eq("profile_id", profileData.id);
        if (servicesData) setServices(servicesData);
        
        const { data: apptsData } = await supabase.from("appointments").select("appointment_date, appointment_time").eq("profile_id", profileData.id).eq("status", "confirmed");
        if (apptsData) setBookedAppointments(apptsData);
      }
      setLoading(false);
    }
    fetchData();
  }, [slug]);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const openBookingModal = (service: any) => {
    setSelectedService(service);
    setIsModalOpen(true);
    setBookingStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    
    const formattedDate = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
    
    const { error } = await supabase.from('appointments').insert([
      {
        profile_id: clinic.id,
        client_name: customerName,
        client_phone: customerPhone,
        service_name: selectedService.name,
        appointment_date: formattedDate,
        appointment_time: selectedTime,
        status: 'confirmed'
      }
    ]);

    if (!error) {
      setBookedAppointments(prev => [...prev, { appointment_date: formattedDate, appointment_time: selectedTime }]);
    } else {
      console.error("Error al guardar la cita:", error);
    }

    setIsSubmitting(false);
    setBookingStep(3);
  };

  const isTimeBooked = (time: string) => {
    if (!selectedDate) return false;
    const formattedDate = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
    return bookedAppointments.some(appt => appt.appointment_date === formattedDate && appt.appointment_time === time);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  if (!clinic) return null;

  const colorDictionary: Record<string, any> = {
    'slate-900': { bg: 'bg-slate-900', text: 'text-slate-900', lightBg: 'bg-slate-50', hover: 'hover:bg-slate-800', ring: 'focus:ring-slate-900' },
    'sky-700': { bg: 'bg-sky-700', text: 'text-sky-700', lightBg: 'bg-sky-50', hover: 'hover:bg-sky-600', ring: 'focus:ring-sky-700' },
    'rose-600': { bg: 'bg-rose-600', text: 'text-rose-600', lightBg: 'bg-rose-50', hover: 'hover:bg-rose-500', ring: 'focus:ring-rose-600' },
    'teal-700': { bg: 'bg-teal-700', text: 'text-teal-700', lightBg: 'bg-teal-50', hover: 'hover:bg-teal-600', ring: 'focus:ring-teal-700' }
  };

  const dbColor = clinic.primary_color || 'slate-900';
  const theme = colorDictionary[dbColor] || colorDictionary['slate-900'];
  
  const fallbackImages: Record<string, string> = {
    'beauty-demo': 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1600&auto=format&fit=crop',
    'dental-demo': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1600&auto=format&fit=crop',
    'terapias-demo': 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1600&auto=format&fit=crop'
  };
  
  const coverImage = clinic.cover_image_url || fallbackImages[slug] || "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1600&auto=format&fit=crop";

  return (
    <main className="relative min-h-screen bg-[#FDFCFB] sm:p-6 md:p-12 flex flex-col items-center justify-center font-sans text-stone-800 overflow-hidden z-0">
      
      <div 
        className="absolute inset-0 z-[-1] opacity-[0.04] pointer-events-none mix-blend-multiply fixed"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2000&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      ></div>

      <div className="w-full max-w-6xl mb-6 flex justify-between items-center px-2 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-[#9B804E] shadow-sm border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:shadow-md transition-all">
          <ArrowLeft strokeWidth={1.5} className="w-4 h-4" /> Demos
        </Link>
        <Link href={`/${slug}/admin`} className="inline-flex items-center gap-2 bg-stone-900 text-[#D4AF37] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-md border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all">
          <LayoutDashboard strokeWidth={1.5} className="w-4 h-4" /> Admin
        </Link>
      </div>

      <div className="w-full max-w-6xl relative z-10 p-[1px] rounded-[2rem] bg-gradient-to-b from-[#EAE2D0] via-transparent to-transparent hover:from-[#D4AF37] hover:to-[#F3E5AB] transition-all duration-700 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_40px_rgba(212,175,55,0.1)]">
        <div className="bg-white/95 backdrop-blur-xl rounded-[calc(2rem-1px)] overflow-hidden flex flex-col md:flex-row min-h-[80vh] md:min-h-[720px] shadow-inner">
          
          <div className="md:w-[45%] relative min-h-[350px] md:min-h-full bg-stone-900 border-r border-[#D4AF37]/20">
            <img src={coverImage} alt="Interior del centro" className="absolute inset-0 w-full h-full object-cover opacity-90" onError={(e) => { e.currentTarget.src = fallbackImages[slug] || "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1600&auto=format&fit=crop"; }} />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/95 via-stone-900/30 to-transparent"></div>
            <div className="absolute bottom-0 w-full p-8 md:p-14 text-white">
              <div className="flex gap-1 mb-6">
                <Diamond strokeWidth={1.5} className="w-4 h-4 text-[#D4AF37]" /><Diamond strokeWidth={1.5} className="w-4 h-4 text-[#D4AF37]" /><Diamond strokeWidth={1.5} className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4 leading-tight tracking-tight">{clinic.business_name}</h1>
              <div className="space-y-3 text-stone-300 font-light text-sm md:text-base">
                <p className="flex items-center gap-3"><MapPin strokeWidth={1.2} className="w-5 h-5 text-[#D4AF37]" /> {clinic.contact_address || 'Calle Principal 123, Madrid'}</p>
                <p className="flex items-center gap-3"><Phone strokeWidth={1.2} className="w-5 h-5 text-[#D4AF37]" /> {clinic.contact_phone || '+34 600 000 000'}</p>
              </div>
            </div>
          </div>

          <div className="md:w-[55%] flex flex-col p-8 md:p-14 h-full relative">
            <div className="mb-10 pb-6 border-b border-[#D4AF37]/20">
              <h2 className="text-3xl md:text-4xl font-serif font-medium text-stone-900 mb-3 tracking-tight">Carta de Servicios</h2>
              <p className="text-stone-500 font-light">Seleccione el tratamiento ideal para su bienestar.</p>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-4 space-y-5 pb-20 custom-scrollbar">
              {services.map((service, index) => (
                <button key={service.id} onClick={() => openBookingModal(service)} className={`w-full text-left bg-white p-6 md:p-8 rounded-2xl border border-stone-200 hover:border-[#D4AF37]/60 shadow-sm hover:shadow-[0_4px_20px_rgba(212,175,55,0.08)] transition-all duration-300 group relative`}>
                  
                  {index === 0 && (
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1.5 bg-[#FDFBF7] text-[#9B804E] text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full font-bold border border-[#D4AF37]/50 shadow-sm">
                        <Sparkles strokeWidth={1.5} className="w-3.5 h-3.5" /> Más Solicitado
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-6">
                    <div className="flex-1">
                      <h3 className={`font-serif text-stone-900 text-xl md:text-2xl mb-3 group-hover:${theme.text} transition-colors`}>{service.name}</h3>
                      <div className="flex items-center gap-4 text-stone-500 font-light">
                        <span className="flex items-center gap-1.5 text-sm">
                          <Clock strokeWidth={1.2} className="w-4 h-4 opacity-70" /> {service.duration_minutes} min
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start xl:items-end gap-4">
                      <span className="text-2xl font-serif text-stone-900">{service.price} €</span>
                      <div className={`flex items-center gap-2 ${theme.bg} text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${theme.hover} transition-all duration-300 group-hover:shadow-lg`}>
                        Reservar <ArrowRight strokeWidth={1.5} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" onClick={() => !isSubmitting && bookingStep !== 3 && setIsModalOpen(false)}></div>
          
          <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-[#D4AF37]/40">
            
            {bookingStep !== 3 && (
              <div className="p-6 md:p-8 border-b border-stone-100 flex justify-between items-start bg-[#FDFCFB]">
                <div className="flex items-start gap-4">
                  {bookingStep === 2 && (
                    <button onClick={() => setBookingStep(1)} className="mt-1 p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500">
                      <ArrowLeft strokeWidth={1.5} className="w-5 h-5" />
                    </button>
                  )}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#9B804E] mb-1.5 block">
                      {bookingStep === 1 ? 'Paso 1: Disponibilidad' : 'Paso 2: Confirmación'}
                    </span>
                    <h3 className="font-serif font-medium text-2xl text-stone-900 tracking-tight">
                      {bookingStep === 1 ? 'Planificar su Visita' : 'Detalles de Contacto'}
                    </h3>
                    <p className="text-xs text-stone-500 mt-2 font-light flex items-center gap-1.5">
                      <Diamond className="w-3 h-3 text-[#D4AF37]"/> {selectedService?.name}
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-white border border-stone-200 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors shadow-sm">
                  <X strokeWidth={1.5} className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar bg-white">
              
              {bookingStep === 1 && (
                <div className="transition-all duration-300">
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-lg font-serif font-medium text-stone-900 capitalize">{currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</h4>
                    <div className="flex gap-2">
                      <button onClick={prevMonth} className="p-2 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors"><ChevronLeft strokeWidth={1.5} className="w-4 h-4" /></button>
                      <button onClick={nextMonth} className="p-2 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors"><ChevronRight strokeWidth={1.5} className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (<div key={day} className="text-center text-[10px] uppercase tracking-widest font-bold text-stone-400 py-2">{day}</div>))}
                  </div>
                  <div className="grid grid-cols-7 gap-2 mb-10">
                    {blanks.map((_, i) => (<div key={`blank-${i}`} className="h-10"></div>))}
                    {days.map((day) => (
                      <button key={day} onClick={() => { setSelectedDate(day); setSelectedTime(null); }}
                        className={`h-10 w-10 mx-auto rounded-full text-sm font-medium transition-all flex items-center justify-center ${selectedDate === day ? `${theme.bg} text-white shadow-md` : 'bg-white text-stone-700 hover:bg-[#FDFBF7] hover:text-[#9B804E] hover:border-[#D4AF37]/50 border border-transparent'}`}>
                        {day}
                      </button>
                    ))}
                  </div>
                  
                  {selectedDate && (
                    <div className="animate-fade-in">
                      <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-4 border-t border-stone-100 pt-8">Seleccione Horario</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {availableTimes.map((time) => {
                          const isBooked = isTimeBooked(time);
                          return (
                            <button 
                              key={time} 
                              disabled={isBooked}
                              onClick={() => setSelectedTime(time)} 
                              className={`py-3 rounded-xl text-sm font-medium transition-all border 
                                ${isBooked 
                                  ? 'bg-stone-50/50 text-stone-300 border-stone-100 cursor-not-allowed line-through decoration-stone-200' 
                                  : selectedTime === time 
                                    ? `${theme.bg} text-white border-transparent shadow-md` 
                                    : 'bg-white text-stone-700 border-stone-200 hover:border-[#D4AF37]/60'}`}
                            >
                              {time}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {bookingStep === 2 && (
                <div className="space-y-6 transition-all duration-300">
                  <div className="bg-[#FDFCFB] p-5 rounded-2xl border border-[#D4AF37]/20 flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-[#D4AF37]/30 flex items-center justify-center text-[#9B804E] shrink-0"><Clock strokeWidth={1.5} className="w-5 h-5" /></div>
                    <div>
                      <h4 className="font-serif font-medium text-stone-900">{selectedService?.name}</h4>
                      <p className="text-sm text-stone-500 mt-1 font-light">{selectedDate} de {currentMonth.toLocaleDateString('es-ES', { month: 'long' })} a las {selectedTime}</p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-stone-500 mb-2">Nombre y Apellidos</label>
                      <div className="relative">
                        <User strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                        <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={`w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-xl focus:ring-1 ${theme.ring} focus:border-transparent outline-none transition-all font-light text-stone-900 placeholder:text-stone-300`} placeholder="Ej: Laura Gómez" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-stone-500 mb-2">Teléfono Móvil</label>
                      <div className="relative">
                        <Phone strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                        <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className={`w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-xl focus:ring-1 ${theme.ring} focus:border-transparent outline-none transition-all font-light text-stone-900 placeholder:text-stone-300`} placeholder="+34 600 000 000" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {bookingStep === 3 && (
                <div className="py-12 flex flex-col items-center text-center transition-all duration-300">
                  <div className="w-24 h-24 bg-[#FDFBF7] text-[#9B804E] rounded-full flex items-center justify-center mb-8 border border-[#D4AF37]/50"><CheckCircle2 strokeWidth={1} className="w-12 h-12" /></div>
                  <h3 className="text-3xl font-serif font-medium text-stone-900 mb-4 tracking-tight">Reserva Confirmada</h3>
                  <p className="text-stone-500 mb-10 max-w-[250px] font-light leading-relaxed">Le esperamos el {selectedDate} de {currentMonth.toLocaleDateString('es-ES', { month: 'long' })} a las {selectedTime}.</p>
                  <button onClick={() => setIsModalOpen(false)} className={`w-full py-4 ${theme.bg} text-white rounded-full text-xs font-bold uppercase tracking-wider ${theme.hover} transition-colors shadow-lg`}>Finalizar</button>
                </div>
              )}
            </div>

            {bookingStep !== 3 && (
              <div className="p-6 md:p-8 border-t border-stone-100 bg-[#FDFCFB]">
                {bookingStep === 1 ? (
                  <button onClick={() => setBookingStep(2)} disabled={!selectedDate || !selectedTime} className={`w-full py-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${selectedDate && selectedTime ? `${theme.bg} text-white shadow-lg ${theme.hover}` : 'bg-stone-100 text-stone-400 cursor-not-allowed'}`}>
                    Confirmar Fecha <ArrowRight strokeWidth={1.5} className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={handleConfirmBooking} disabled={!customerName || !customerPhone || isSubmitting} className={`w-full py-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${customerName && customerPhone && !isSubmitting ? `${theme.bg} text-white shadow-lg ${theme.hover}` : 'bg-stone-100 text-stone-400 cursor-not-allowed'}`}>
                    {isSubmitting ? <span className="flex items-center gap-2">Procesando <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div></span> : 'Finalizar Reserva'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}