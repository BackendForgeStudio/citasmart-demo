"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Stethoscope, Scissors, Palette, Globe, ShieldCheck, Diamond, Lock, Leaf, X } from "lucide-react";

export default function Home() {
  const [legalModal, setLegalModal] = useState<'aviso' | 'privacidad' | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Ofuscación del correo para evitar rastreadores de SPAM en el código fuente
  const user = "miguel_200894";
  const domain = "hotmail.com";
  const formActionUrl = `https://formsubmit.co/${user}@${domain}`;

  return (
    <main className="relative min-h-screen bg-[#FDFCFB] flex flex-col items-center font-sans text-stone-800 overflow-hidden z-0">
      
      {/* --- TEXTURA DE MÁRMOL --- */}
      <div 
        className="absolute inset-0 z-[-1] opacity-[0.04] pointer-events-none mix-blend-multiply fixed"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2000&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>

      {/* Brillo de fondo sutil */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#EBD9B4]/20 to-transparent rounded-full blur-3xl z-[-1] pointer-events-none"></div>

      {/* --- BARRA DE NAVEGACIÓN SUTIL --- */}
      <header className="w-full sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-[#EAE2D0]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Diamond strokeWidth={1.5} className="w-4 h-4 text-[#9B804E]" />
            <span className="font-serif text-lg text-stone-900 tracking-wide">CitaSmart <span className="text-[#9B804E] italic">Premium</span></span>
          </div>
          <nav className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-widest text-stone-500">
            <a href="#demos" className="hover:text-[#9B804E] transition-colors">Sectores</a>
            <a href="#valores" className="hover:text-[#9B804E] transition-colors">Exclusividad</a>
          </nav>
          <a href="#demos" className="bg-stone-900 text-[#D4AF37] px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-stone-800 transition-all shadow-sm">
            Probar Demos
          </a>
        </div>
      </header>

      {/* --- CABECERA EDITORIAL --- */}
      <div className="max-w-4xl w-full text-center mt-20 mb-20 flex flex-col items-center relative z-10 px-6">
        <div className="mb-8">
          <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] border border-[#D5C29A]/40 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-sm shadow-[0_4px_20px_rgba(213,194,154,0.15)]">
            <Sparkles strokeWidth={1.5} className="w-3.5 h-3.5 text-[#BFA054]" />
            <span className="bg-gradient-to-r from-[#9B804E] via-[#CFA768] to-[#9B804E] bg-clip-text text-transparent">
              Software de Gestión Boutique
            </span>
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-medium text-stone-900 mb-6 tracking-tight leading-[1.1]">
          El lujo de una <br className="hidden md:block" /> gestión perfecta
        </h1>
        <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto font-light leading-relaxed">
          Diseñado para espacios de alto nivel. Seleccione su sector y experimente en vivo cómo la tecnología y la elegancia se fusionan en sus reservas.
        </p>
      </div>

      {/* --- TARJETAS DE DEMOS --- */}
      <div id="demos" className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl relative z-10 px-6 pt-10 scroll-mt-20">
        
        {/* Tarjeta 1 */}
        <div className="group relative p-[1px] rounded-[2rem] bg-gradient-to-b from-[#EAE2D0] via-transparent to-transparent hover:from-[#D4AF37] hover:to-[#F3E5AB] transition-all duration-700 shadow-xl shadow-stone-200/20 hover:shadow-[0_10px_40px_rgba(212,175,55,0.15)] hover:-translate-y-1">
          <div className="bg-white/90 backdrop-blur-xl h-full w-full rounded-[2rem] p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FDFBF7] to-[#F4EFE6] border border-[#EAE2D0] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-700 shadow-inner shrink-0">
              <Leaf strokeWidth={1} className="w-8 h-8 text-[#9B804E]" />
            </div>
            <h2 className="text-2xl font-serif text-stone-900 mb-2">Terapias y Wellness</h2>
            <p className="text-stone-500 mb-8 text-sm font-light leading-relaxed px-2">Atmósfera orgánica y relajante. Gestión avanzada de bonos y sesiones de bienestar.</p>
            <div className="mt-auto w-full space-y-3">
              <Link href="/terapias-demo" className="flex items-center justify-between w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#EAE2D0] hover:border-[#D4AF37] rounded-xl text-[10px] font-bold uppercase tracking-widest text-stone-600 hover:text-[#9B804E] transition-all group/btn">
                <span>Portal Público</span> <ArrowRight strokeWidth={1.5} className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
              <Link href="/terapias-demo/admin" className="flex items-center justify-between w-full px-5 py-3.5 bg-stone-900 border border-stone-900 hover:bg-stone-800 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] transition-all">
                <span>Panel de Dirección</span> <Lock strokeWidth={1.5} className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Tarjeta 2 */}
        <div className="group relative p-[1px] rounded-[2rem] bg-gradient-to-b from-[#EAE2D0] via-transparent to-transparent hover:from-[#D4AF37] hover:to-[#F3E5AB] transition-all duration-700 shadow-xl shadow-stone-200/20 hover:shadow-[0_10px_40px_rgba(212,175,55,0.15)] hover:-translate-y-1">
          <div className="bg-white/90 backdrop-blur-xl h-full w-full rounded-[2rem] p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FDFBF7] to-[#F4EFE6] border border-[#EAE2D0] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-700 shadow-inner shrink-0">
              <Stethoscope strokeWidth={1} className="w-8 h-8 text-[#9B804E]" />
            </div>
            <h2 className="text-2xl font-serif text-stone-900 mb-2">Clínica Dental</h2>
            <p className="text-stone-500 mb-8 text-sm font-light leading-relaxed px-2">Estética clínica y vanguardista. Control absoluto de agendas médicas y quirófanos.</p>
            <div className="mt-auto w-full space-y-3">
              <Link href="/dental-demo" className="flex items-center justify-between w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#EAE2D0] hover:border-[#D4AF37] rounded-xl text-[10px] font-bold uppercase tracking-widest text-stone-600 hover:text-[#9B804E] transition-all group/btn">
                <span>Portal Público</span> <ArrowRight strokeWidth={1.5} className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
              <Link href="/dental-demo/admin" className="flex items-center justify-between w-full px-5 py-3.5 bg-stone-900 border border-stone-900 hover:bg-stone-800 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] transition-all">
                <span>Panel de Dirección</span> <Lock strokeWidth={1.5} className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Tarjeta 3 */}
        <div className="group relative p-[1px] rounded-[2rem] bg-gradient-to-b from-[#EAE2D0] via-transparent to-transparent hover:from-[#D4AF37] hover:to-[#F3E5AB] transition-all duration-700 shadow-xl shadow-stone-200/20 hover:shadow-[0_10px_40px_rgba(212,175,55,0.15)] hover:-translate-y-1">
          <div className="bg-white/90 backdrop-blur-xl h-full w-full rounded-[2rem] p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FDFBF7] to-[#F4EFE6] border border-[#EAE2D0] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-700 shadow-inner shrink-0">
              <Scissors strokeWidth={1} className="w-8 h-8 text-[#9B804E]" />
            </div>
            <h2 className="text-2xl font-serif text-stone-900 mb-2">Salón de Belleza</h2>
            <p className="text-stone-500 mb-8 text-sm font-light leading-relaxed px-2">Diseño editorial de alto contraste. Optimizado para reservas impulsivas y fluidas.</p>
            <div className="mt-auto w-full space-y-3">
              <Link href="/beauty-demo" className="flex items-center justify-between w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#EAE2D0] hover:border-[#D4AF37] rounded-xl text-[10px] font-bold uppercase tracking-widest text-stone-600 hover:text-[#9B804E] transition-all group/btn">
                <span>Portal Público</span> <ArrowRight strokeWidth={1.5} className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
              <Link href="/beauty-demo/admin" className="flex items-center justify-between w-full px-5 py-3.5 bg-stone-900 border border-stone-900 hover:bg-stone-800 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] transition-all">
                <span>Panel de Dirección</span> <Lock strokeWidth={1.5} className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* --- MENSAJE DE ADAPTABILIDAD --- */}
      <div className="mt-16 mb-12 text-center max-w-3xl mx-auto relative z-10 px-6">
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mx-auto mb-8"></div>
        <h3 className="text-xl font-serif text-stone-900 mb-3">Adaptabilidad Absoluta</h3>
        <p className="text-sm md:text-base text-stone-500 font-light leading-relaxed">
          ¿Su negocio pertenece a otro sector? CitaSmart es un lienzo en blanco. <br className="hidden md:block" />
          Diseñamos arquitecturas a medida para <strong className="font-medium text-stone-800">Estudios de Tatuaje de Autor, Centros de Pilates Boutique, Despachos de Psicología y Entrenadores Personales</strong>. Si su negocio requiere gestionar tiempo y exclusividad, construimos el panel perfecto para usted.
        </p>
      </div>

      {/* --- PANEL DE VALOR AÑADIDO --- */}
      <div id="valores" className="w-full max-w-6xl mt-auto relative z-10 px-6 pb-20 scroll-mt-24">
        <div className="border-t border-[#EAE2D0] pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-5 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FDFBF7] to-[#F4EFE6] rounded-full border border-[#EAE2D0] flex items-center justify-center shadow-sm shrink-0 group-hover:border-[#CFA768] transition-colors"><Palette strokeWidth={1} className="w-5 h-5 text-[#9B804E]" /></div>
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-2">Marca Exclusiva</h3>
                <p className="text-sm text-stone-500 font-light leading-relaxed">Logotipo, colores corporativos y tipografías integradas a la perfección en un lienzo de alta costura sin marcas de agua.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-5 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FDFBF7] to-[#F4EFE6] rounded-full border border-[#EAE2D0] flex items-center justify-center shadow-sm shrink-0 group-hover:border-[#CFA768] transition-colors"><Globe strokeWidth={1} className="w-5 h-5 text-[#9B804E]" /></div>
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-2">Sincronización Cloud</h3>
                <p className="text-sm text-stone-500 font-light leading-relaxed">Conectado en tiempo real. Todo lo que ocurra en el portal de sus pacientes aparecerá al instante en sus pantallas.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-5 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FDFBF7] to-[#F4EFE6] rounded-full border border-[#EAE2D0] flex items-center justify-center shadow-sm shrink-0 group-hover:border-[#CFA768] transition-colors"><ShieldCheck strokeWidth={1} className="w-5 h-5 text-[#9B804E]" /></div>
              <div>
                <h3 className="font-serif text-lg text-stone-900 mb-2">Control Absoluto</h3>
                <p className="text-sm text-stone-500 font-light leading-relaxed">Paneles de administración privados y seguros diseñados específicamente para la idiosincrasia de su sector.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CALL TO ACTION FINAL --- */}
      <div className="w-full max-w-6xl mx-auto mt-4 mb-12 px-6 relative z-10">
        <div className="bg-stone-900 rounded-[3rem] text-center py-24 px-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 blur-3xl rounded-full mix-blend-screen"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-stone-500/10 blur-3xl rounded-full mix-blend-screen"></div>
          
          <div className="max-w-2xl mx-auto relative z-10">
            <Diamond strokeWidth={1.5} className="w-6 h-6 text-[#9B804E] mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-serif text-stone-100 mb-6 tracking-tight">Eleve el estándar de su negocio</h2>
            <p className="text-stone-400 font-light mb-10 text-lg">Deje atrás las agendas genéricas. Solicite una consultoría sin compromiso y descubra cómo adaptar CitaSmart a la identidad de su marca.</p>
            <button 
              onClick={() => setIsContactOpen(true)}
              className="inline-block bg-gradient-to-r from-[#D4AF37] to-[#CFA768] text-stone-950 px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-[#D4AF37]/20"
            >
              Solicitar Acceso Privado
            </button>
          </div>
        </div>
      </div>

      {/* --- FOOTER INSTITUCIONAL --- */}
      <footer className="w-full border-t border-[#EAE2D0] py-12 px-6 relative z-10 mt-auto bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-80">
            <Diamond strokeWidth={1.5} className="w-4 h-4 text-[#9B804E]" />
            <span className="font-serif text-lg text-stone-900 tracking-wide">CitaSmart <span className="text-[#9B804E] italic">Premium</span></span>
          </div>
          
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-stone-500">
            <button onClick={() => setLegalModal('aviso')} className="hover:text-[#9B804E] transition-colors">Aviso Legal</button>
            <button onClick={() => setLegalModal('privacidad')} className="hover:text-[#9B804E] transition-colors">Privacidad</button>
            <button onClick={() => setIsContactOpen(true)} className="hover:text-[#9B804E] transition-colors">Contacto</button>
          </div>
          
          <p className="text-xs text-stone-400 font-light">© {new Date().getFullYear()} CitaSmart. Diseñado para la excelencia.</p>
        </div>
      </footer>

      {/* --- MODALES LEGALES --- */}
      {legalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setLegalModal(null)}></div>
          <div className="relative w-full max-w-2xl bg-[#FDFCFB] rounded-[2rem] shadow-2xl p-8 md:p-12 z-10 max-h-[80vh] overflow-y-auto border border-[#EAE2D0]">
            <button onClick={() => setLegalModal(null)} className="absolute top-6 right-6 p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors">
              <X className="w-5 h-5 text-stone-500" />
            </button>
            <h3 className="font-serif text-3xl text-stone-900 mb-6">
              {legalModal === 'aviso' ? 'Aviso Legal' : 'Política de Privacidad'}
            </h3>
            <div className="space-y-4 text-stone-600 font-light text-sm leading-relaxed">
              <p>Este es un texto de ejemplo para la sección de {legalModal}. Aquí deberás incluir los términos y condiciones de tu negocio, los datos de registro mercantil, y la política de tratamiento de datos acorde al RGPD.</p>
              <p>Al ser un proyecto de demostración SaaS, toda la información recopilada tiene fines estrictamente comerciales y de simulación de entorno.</p>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DE CONTACTO (FormSubmit) --- */}
      {isContactOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setIsContactOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-[#FDFCFB] rounded-[2rem] shadow-2xl p-8 z-10 border border-[#EAE2D0]">
            <button onClick={() => setIsContactOpen(false)} className="absolute top-6 right-6 p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors">
              <X className="w-5 h-5 text-stone-500" />
            </button>
            
            <div className="mb-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#9B804E] block mb-2">Contacto Directo</span>
              <h3 className="font-serif text-3xl text-stone-900">Solicitar Información</h3>
            </div>

            <form action={formActionUrl} method="POST" className="space-y-5">
              <input type="hidden" name="_subject" value="Nuevo Lead - CitaSmart Premium" />
              <input type="hidden" name="_captcha" value="false" />
              
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">Nombre completo</label>
                <input type="text" name="nombre" required className="w-full bg-white border border-[#EAE2D0] rounded-xl p-4 text-sm font-light outline-none focus:border-[#CFA768] transition-colors" placeholder="Su nombre o el de su empresa" />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">Correo Electrónico</label>
                <input type="email" name="email" required className="w-full bg-white border border-[#EAE2D0] rounded-xl p-4 text-sm font-light outline-none focus:border-[#CFA768] transition-colors" placeholder="correo@ejemplo.com" />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">Detalles del Proyecto</label>
                <textarea name="mensaje" required rows={4} className="w-full bg-white border border-[#EAE2D0] rounded-xl p-4 text-sm font-light outline-none focus:border-[#CFA768] transition-colors resize-none" placeholder="Cuéntenos sobre su modelo de negocio y necesidades..."></textarea>
              </div>

              <button type="submit" className="w-full bg-stone-900 text-[#D4AF37] py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-md mt-2">
                Enviar Solicitud
              </button>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}