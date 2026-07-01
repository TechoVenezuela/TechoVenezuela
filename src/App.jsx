import { useState, useEffect } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://qzouyhpdvzmcpgluuacd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6b3VoeXBkdnptY3BnbHV1YWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3OTgyNjQsImV4cCI6MjA5ODM3NDI2NH0.-Ax1d8EQoh7_P1eVGF4brqwRGi75qmyPoSLeiEtR0Cs";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ESTADOS_VENEZUELA = ["La Guaira (zona más afectada)","Caracas","Yaracuy","Carabobo","Aragua","Miranda","Vargas","Falcón","Lara","Zulia","Mérida","Táchira","Barinas","Portuguesa","Guárico","Anzoátegui","Bolívar","Monagas","Sucre","Nueva Esparta","Otro estado"];


const P = {
  purple:"#7B3FA0", purpleDk:"#5A2D7A", yellow:"#F5C842", fuschia:"#D63384",
  pageBg:"#F8F4FB", cardBg:"#FDF6EC", lilaBg:"#EDE0F5", text:"#2D1A40",
  muted:"#6B5B7B", green:"#2ECC71", greenBg:"#D5F5E3", coral:"#FF6B6B",
  coralBg:"#FFE5E5", white:"#FFFFFF", border:"#E8D8F5",
  flagY:"#F5C842", flagB:"#003DA5", flagR:"#CF1720",
};

// ── LOGO SVG COMPONENT ──────────────────────────────────
function Logo({ height = 36, light = false }) {
  const textColor = light ? "#fff" : P.text;
  const subColor = light ? P.yellow : P.purple;
  const arc1Color = light ? "rgba(255,255,255,0.45)" : P.purple;
  const arc2Color = light ? "#fff" : P.fuschia;
  const w = height * 4;
  const h = height;
  const scale = height / 36;
  return (
    <svg width={w} height={h} viewBox="0 0 144 36" style={{ display:"block" }}>
      <path d={`M8,30 Q16,8 24,30`} stroke={arc1Color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d={`M14,30 Q22,4 30,30`} stroke={arc2Color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <circle cx="22" cy="4" r="3" fill={P.yellow}/>
      <text x="38" y="17" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="900" fill={textColor} letterSpacing="-0.3">TECHO</text>
      <text x="38" y="30" fontFamily="Inter,Arial,sans-serif" fontSize="8.5" fontWeight="700" fill={subColor} letterSpacing="1.5">VENEZUELA</text>
    </svg>
  );
}

// ── FORMSPREE ENDPOINT — reemplaza con tu ID real ────────
export default function TechoVenezuela() {
  const [view, setView] = useState("home");
  const [selectedListing, setSelectedListing] = useState(null);
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      setLoadingListings(true);
      const { data, error } = await supabase
        .from("anfitriones")
        .select("*")
        .eq("aprobado", true)
        .eq("disponible", true)
        .order("created_at", { ascending: false });
      if (!error && data) setListings(data);
      setLoadingListings(false);
    }
    fetchListings();
  }, []);

  const filteredListings = filterEstado === "Todos"
    ? listings
    : listings.filter(l => l.estado && l.estado.includes(filterEstado.replace(" (zona más afectada)","")));

  const [hostForm, setHostForm] = useState({ name:"", phone:"", estado:"", zone:"", roomType:"", maxGuests:1, maxDuration:"", story:"", offers:[], accepts:[], vetProcess:"", hasElectricity:false, hasWater:false, hasGas:false });
  const [applyForm, setApplyForm] = useState({
    name:"", cedula:"", phone:"", adults:1, children:0, situation:"", fromEstado:"", needDuration:"", hasElderlyOrDisabled:false,
    homeCondition:"", homeDamage:"", hasCriminalRecord:"", criminalRecordExplain:"", canVideoCall:"",
    preferredZone:"", preferredZoneReason:"", referenceName:"", referenceContact:"",
  });

  const offerOptions = ["Cama con colchón","Colchones en el piso","Ropa de cama","Agua (cisterna/pozo)","Cocina de gas","Nevera","Planta eléctrica","Baño privado","Baño compartido","Comida básica incluida","Acceso a patio"];
  const acceptOptions = ["Familias con niños","Madres solas","Adultos mayores","Personas con discapacidad","Adultos solos","Parejas","Mascotas pequeñas","Personas enfermas"];
  const toggleArr = (setter, field, item) => setter(prev => ({ ...prev, [field]: prev[field].includes(item) ? prev[field].filter(i => i !== item) : [...prev[field], item] }));

  async function submitHostForm() {
    setSubmitting(true);
    const { error } = await supabase.from("anfitriones").insert([{
      nombre: hostForm.name,
      telefono: hostForm.phone,
      estado: hostForm.estado,
      zona: hostForm.zone,
      tipo_espacio: hostForm.roomType,
      max_personas: parseInt(hostForm.maxGuests),
      max_duracion: hostForm.maxDuration,
      historia: hostForm.story,
      ofrece: hostForm.offers.join(", "),
      acepta: hostForm.accepts.join(", "),
      proceso_verificacion: hostForm.vetProcess,
      tiene_electricidad: hostForm.hasElectricity,
      tiene_agua: hostForm.hasWater,
      tiene_gas: hostForm.hasGas,
      aprobado: false,
      disponible: false,
    }]);
    setSubmitting(false);
    if (error) { alert("Hubo un error al enviar. Por favor intenta de nuevo."); return; }
    setView("success-host");
  }

  async function submitApplyForm() {
    setSubmitting(true);
    const { error } = await supabase.from("solicitantes").insert([{
      nombre: applyForm.name,
      cedula: applyForm.cedula,
      telefono: applyForm.phone,
      from_estado: applyForm.fromEstado,
      adultos: parseInt(applyForm.adults),
      ninos: parseInt(applyForm.children),
      tiene_adulto_mayor_discapacidad: applyForm.hasElderlyOrDisabled,
      situacion: applyForm.situation,
      condicion_vivienda: applyForm.homeCondition,
      danos_vivienda: applyForm.homeDamage,
      duracion_necesaria: applyForm.needDuration,
      antecedentes_penales: applyForm.hasCriminalRecord,
      explicacion_antecedentes: applyForm.criminalRecordExplain,
      puede_videollamada: applyForm.canVideoCall,
      zona_preferida: applyForm.preferredZone,
      razon_zona_preferida: applyForm.preferredZoneReason,
      referencia_nombre: applyForm.referenceName,
      referencia_contacto: applyForm.referenceContact,
      estado_caso: "pendiente",
    }]);
    setSubmitting(false);
    if (error) { alert("Hubo un error al enviar. Por favor intenta de nuevo."); return; }
    setView("success-apply");
  }

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", background:P.pageBg, minHeight:"100vh", color:P.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        .btn-primary { background:${P.yellow}; color:${P.purple}; border:none; padding:13px 28px; border-radius:10px; font-size:15px; font-weight:800; cursor:pointer; transition:all 0.2s; font-family:Inter,sans-serif; box-shadow:0 2px 12px rgba(245,200,66,0.4); }
        .btn-primary:hover { background:#e8b800; transform:translateY(-1px); }
        .btn-secondary { background:${P.fuschia}; color:#fff; border:none; padding:13px 28px; border-radius:10px; font-size:15px; font-weight:700; cursor:pointer; transition:all 0.2s; font-family:Inter,sans-serif; }
        .btn-secondary:hover { background:#b8226e; transform:translateY(-1px); }
        .btn-outline { background:transparent; border:2px solid ${P.fuschia}; color:${P.fuschia}; padding:11px 24px; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.2s; font-family:Inter,sans-serif; }
        .btn-outline:hover { background:${P.fuschia}; color:#fff; }
        .btn-ghost { background:rgba(255,255,255,0.15); border:2px solid rgba(255,255,255,0.5); color:#fff; padding:13px 28px; border-radius:10px; font-size:15px; font-weight:600; cursor:pointer; transition:all 0.2s; font-family:Inter,sans-serif; }
        .btn-ghost:hover { background:rgba(255,255,255,0.25); }
        .card { background:${P.cardBg}; border-radius:16px; overflow:hidden; box-shadow:0 2px 16px rgba(123,63,160,0.10); transition:transform 0.18s, box-shadow 0.18s; cursor:pointer; }
        .card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(123,63,160,0.18); }
        input, textarea, select { width:100%; padding:12px 14px; border:1.5px solid ${P.border}; border-radius:10px; font-size:15px; font-family:Inter,sans-serif; background:#fff; color:${P.text}; transition:border-color 0.2s; }
        input:focus, textarea:focus, select:focus { outline:none; border-color:${P.purple}; box-shadow:0 0 0 3px rgba(123,63,160,0.12); }
        .lbl { font-size:12px; font-weight:700; color:${P.muted}; margin-bottom:6px; display:block; text-transform:uppercase; letter-spacing:0.05em; }
        .chk { display:flex; align-items:center; gap:10px; padding:11px 14px; border:1.5px solid ${P.border}; border-radius:10px; cursor:pointer; margin-bottom:8px; font-size:14px; transition:all 0.15s; color:${P.text}; background:#fff; }
        .chk.on { border-color:${P.purple}; background:${P.lilaBg}; font-weight:600; color:${P.purple}; }
        .badge { display:inline-block; font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px; text-transform:uppercase; letter-spacing:0.04em; }
        .badge-purple { background:${P.lilaBg}; color:${P.purple}; }
        .badge-fuschia { background:#FFE0F0; color:${P.fuschia}; }
        .nav-lnk { cursor:pointer; font-weight:600; font-size:14px; color:${P.text}; padding:4px 0; border-bottom:2px solid transparent; transition:all 0.2s; }
        .nav-lnk:hover { color:${P.purple}; border-bottom-color:${P.purple}; }
        .nav-lnk.active { color:${P.purple}; border-bottom-color:${P.purple}; }
        .sbar { width:100%; height:5px; background:${P.border}; border-radius:3px; margin-bottom:8px; }
        .sfil { height:5px; background:${P.purple}; border-radius:3px; transition:width 0.3s; }
        .flag { height:5px; display:flex; }
        .flag div { flex:1; }
      `}</style>

      {/* EMERGENCY BAR */}
      <div style={{ background:P.purple, color:"#fff", textAlign:"center", padding:"9px 24px", fontSize:13, fontWeight:600 }}>
        🏠 Emergencia sísmica · Terremotos 7.2 y 7.5 · Venezuela 24 junio 2026 · Conectamos a quien tiene espacio con quien lo necesita
      </div>

      {/* FLAG */}
      <div className="flag">
        <div style={{ background:P.flagY }} /><div style={{ background:P.flagB }} /><div style={{ background:P.flagR }} />
      </div>

      {/* NAV */}
      <nav style={{ background:P.white, borderBottom:`1px solid ${P.border}`, padding:"0 24px", position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 8px rgba(123,63,160,0.08)" }}>
        <div style={{ maxWidth:1080, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:62 }}>
          <div style={{ cursor:"pointer" }} onClick={() => setView("home")}>
            <Logo height={44} />
          </div>
          <div style={{ display:"flex", gap:28, alignItems:"center" }}>
            <span className={`nav-lnk ${view==="apply" && !selectedListing?"active":""}`} onClick={() => { setView("apply"); setStep(1); setSelectedListing(null); }}>Buscar techo</span>
            <span className={`nav-lnk ${view==="offer"?"active":""}`} onClick={() => { setView("offer"); setStep(1); }}>Ofrecer espacio</span>
            <span className={`nav-lnk ${view==="listings"||view==="listing"?"active":""}`} onClick={() => setView("listings")}>Techos disponibles</span>
            <span className={`nav-lnk ${view==="nosotros"?"active":""}`} onClick={() => setView("nosotros")}>Quiénes somos</span>
            <button className="btn-primary" style={{ padding:"9px 20px", fontSize:13 }} onClick={() => { setView("apply"); setStep(1); }}>Necesito ayuda urgente</button>
          </div>
        </div>
      </nav>

      {/* ══════ HOME ══════ */}
      {view === "home" && (<div>
        <div style={{ background:`linear-gradient(135deg,${P.purple} 0%,${P.purpleDk} 100%)`, padding:"90px 24px 100px", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-80, right:-80, width:380, height:380, borderRadius:"50%", background:"rgba(245,200,66,0.07)" }} />
          <div style={{ position:"absolute", bottom:-60, left:-60, width:280, height:280, borderRadius:"50%", background:"rgba(214,51,132,0.10)" }} />
          <div style={{ maxWidth:680, margin:"0 auto", position:"relative", zIndex:1 }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:32 }}>
              <Logo height={60} light={true} />
            </div>
            <h1 style={{ fontFamily:"Inter,sans-serif", fontSize:52, fontWeight:900, color:"#fff", lineHeight:1.1, marginBottom:24, letterSpacing:"-1px" }}>
              Si tienes espacio,<br /><span style={{ color:P.yellow }}>alguien lo necesita hoy.</span>
            </h1>
            <p style={{ color:"rgba(255,255,255,0.75)", fontSize:18, lineHeight:1.75, maxWidth:520, margin:"0 auto 44px" }}>
              Una red gratuita para venezolanos que ofrecen un techo y venezolanos que lo perdieron. Solo en Venezuela. Solo solidaridad.
            </p>
            <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
              <button className="btn-primary" style={{ fontSize:16, padding:"15px 40px" }} onClick={() => { setView("apply"); setStep(1); }}>Necesito un techo</button>
              <button className="btn-ghost" style={{ fontSize:16, padding:"15px 40px" }} onClick={() => { setView("offer"); setStep(1); }}>Tengo espacio y quiero ayudar</button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div style={{ background:P.white, borderBottom:`1px solid ${P.border}`, padding:"28px 24px" }}>
          <div style={{ maxWidth:900, margin:"0 auto", display:"flex", gap:48, flexWrap:"wrap", justifyContent:"center" }}>
            {[["1.430+","fallecidos confirmados","#CF1720"],["3.360+","heridos reportados","#CF1720"],["Miles","sin hogar en La Guaira y Caracas",P.purple],["100%","gratuito, sin fines de lucro","#1A7A4A"]].map(([n,l,c]) => (
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontSize:34, fontWeight:900, color:c }}>{n}</div>
                <div style={{ fontSize:12, color:P.muted, fontWeight:500, marginTop:2, maxWidth:140 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* HOW */}
        <div style={{ maxWidth:1000, margin:"0 auto", padding:"72px 24px" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <h2 style={{ fontSize:30, fontWeight:900, color:P.purple, marginBottom:10, letterSpacing:"-0.5px" }}>¿Cómo funciona?</h2>
            <p style={{ color:P.muted, fontSize:16 }}>Simple, directo y sin burocracia.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:24 }}>
            {[["🏠","Publicas tu espacio","Completas un formulario con tu estado, lo que ofreces y tu teléfono directo."],["🔎","Quienes necesitan buscan","Filtran por estado, ven fotos, condiciones reales y el contacto del anfitrión."],["📞","Contacto directo","Por teléfono o WhatsApp. Sin intermediarios. Sin esperas innecesarias."],["🪪","Cédula como verificación","El anfitrión verifica cédula venezolana vigente. Simple y seguro."]].map(([icon,title,desc]) => (
              <div key={title} style={{ background:P.cardBg, borderRadius:16, padding:"32px 22px", boxShadow:`0 2px 14px rgba(123,63,160,0.07)`, textAlign:"center" }}>
                <div style={{ width:56, height:56, borderRadius:14, background:P.lilaBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, margin:"0 auto 18px" }}>{icon}</div>
                <h3 style={{ fontSize:17, fontWeight:800, color:P.purple, marginBottom:10 }}>{title}</h3>
                <p style={{ color:P.muted, fontSize:13, lineHeight:1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* LISTINGS PREVIEW */}
        <div style={{ background:P.white, padding:"60px 24px" }}>
          <div style={{ maxWidth:1080, margin:"0 auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:36 }}>
              <h2 style={{ fontSize:28, fontWeight:900, color:P.purple, letterSpacing:"-0.5px" }}>Techos disponibles ahora</h2>
              <span style={{ color:P.fuschia, fontWeight:700, cursor:"pointer", fontSize:14 }} onClick={() => setView("listings")}>Ver todos →</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:24 }}>
              {listings.filter(l => l.disponible).slice(0,2).map(l => (
                <ListingCard key={l.id} listing={l} P={P} onClick={() => { setSelectedListing(l); setView("listing"); }} />
              ))}
            </div>
          </div>
        </div>

        {/* SAFETY */}
        <div style={{ background:P.lilaBg, padding:"56px 24px" }}>
          <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center" }}>
            <h2 style={{ fontSize:28, fontWeight:900, color:P.purple, marginBottom:14, letterSpacing:"-0.5px" }}>Tu seguridad importa</h2>
            <p style={{ color:"#4A3560", fontSize:15, lineHeight:1.75, marginBottom:32 }}>
              El anfitrión siempre decide a quién recibe. Pedimos cédula vigente como verificación mínima. Siempre contacto directo, sin intermediarios.
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center" }}>
              {["🪪 Verificación por cédula","📞 Contacto directo","🚨 Sistema de reportes","🔒 Datos protegidos","👥 Solo dentro de Venezuela"].map(item => (
                <span key={item} style={{ display:"inline-flex", alignItems:"center", background:P.greenBg, color:"#1A7A4A", fontSize:13, padding:"7px 14px", borderRadius:20, fontWeight:600 }}>{item}</span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ background:`linear-gradient(135deg,${P.purpleDk},${P.purple})`, padding:"64px 24px", textAlign:"center" }}>
          <div className="flag" style={{ maxWidth:90, margin:"0 auto 44px", borderRadius:4, overflow:"hidden" }}>
            <div style={{ background:P.flagY, height:5 }} /><div style={{ background:P.flagB, height:5 }} /><div style={{ background:P.flagR, height:5 }} />
          </div>
          <h2 style={{ fontSize:32, fontWeight:900, color:"#fff", marginBottom:16, letterSpacing:"-0.5px" }}>¿Tienes un cuarto, una sala, un techo?</h2>
          <p style={{ color:"rgba(255,255,255,0.72)", fontSize:16, maxWidth:460, margin:"0 auto 36px", lineHeight:1.7 }}>No hace falta que sea perfecto. Solo que esté disponible. Publica en 5 minutos.</p>
          <button className="btn-primary" style={{ fontSize:16, padding:"15px 40px" }} onClick={() => { setView("offer"); setStep(1); }}>Ofrecer mi espacio →</button>
        </div>
      </div>)}

      {/* ══════ QUIÉNES SOMOS ══════ */}
      {view === "nosotros" && (
        <div>
          {/* Hero */}
          <div style={{ background:`linear-gradient(135deg,${P.purple},${P.purpleDk})`, padding:"72px 24px", textAlign:"center" }}>
            <div style={{ maxWidth:700, margin:"0 auto" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(245,200,66,0.15)", border:"1px solid rgba(245,200,66,0.4)", borderRadius:24, padding:"6px 18px", marginBottom:24 }}>
                <span style={{ color:P.yellow, fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Sin fines de lucro · 100% gratuito</span>
              </div>
              <h1 style={{ fontSize:44, fontWeight:900, color:"#fff", lineHeight:1.1, marginBottom:20, letterSpacing:"-1px" }}>
                Somos un puente.<br /><span style={{ color:P.yellow }}>Entre la urgencia y la organización.</span>
              </h1>
              <p style={{ color:"rgba(255,255,255,0.75)", fontSize:17, lineHeight:1.75 }}>
                Techo Venezuela es una iniciativa ciudadana creada el 24 de junio de 2026, el mismo día que los terremotos sacudieron el norte del país.
              </p>
              {/* Sub-nav */}
              <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginTop:36 }}>
                {[["quienes","Quiénes somos"],["porque","Por qué existimos"]].map(([id,label]) => (
                  <a key={id} href={`#${id}`} style={{ background:"rgba(255,255,255,0.15)", color:"#fff", padding:"8px 18px", borderRadius:20, fontSize:13, fontWeight:600, textDecoration:"none", border:"1px solid rgba(255,255,255,0.3)" }}>{label}</a>
                ))}
                <span onClick={() => setView("seguridad")} style={{ background:P.yellow, color:P.purple, padding:"8px 18px", borderRadius:20, fontSize:13, fontWeight:700, cursor:"pointer" }}>🔒 Cómo cuidamos la seguridad</span>
              </div>
            </div>
          </div>

          <div style={{ maxWidth:800, margin:"0 auto", padding:"64px 24px" }}>

            {/* ── QUIÉNES SOMOS ── */}
            <div id="quienes" style={{ marginBottom:72 }}>
              <div style={{ display:"inline-block", background:P.lilaBg, color:P.purple, fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:20, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:16 }}>Quiénes somos</div>
              <h2 style={{ fontSize:32, fontWeight:900, color:P.purple, marginBottom:28, letterSpacing:"-0.5px", lineHeight:1.2 }}>Una red independiente de apoyo. No una institución.</h2>

              <p style={{ fontSize:17, lineHeight:1.9, color:"#4A3560", marginBottom:20 }}>
                Techo Venezuela nació como una respuesta ciudadana ante una emergencia: familias que perdieron su casa o no pueden volver a ella, y personas dispuestas a abrir una puerta.
              </p>
              <p style={{ fontSize:17, lineHeight:1.9, color:"#4A3560", marginBottom:20 }}>
                Somos una red independiente de apoyo creada para conectar, de forma gratuita, a personas afectadas por la emergencia en Venezuela con anfitriones que puedan ofrecer un espacio temporal seguro: una habitación, una casa vacía, un anexo, un sofá cama o cualquier lugar digno donde alguien pueda dormir bajo techo mientras encuentra su próximo paso.
              </p>
              <p style={{ fontSize:17, lineHeight:1.9, color:"#4A3560", marginBottom:32 }}>
                No somos una agencia inmobiliaria, una plataforma comercial ni una institución del Estado. No cobramos por conectar a las personas. No intermediamos pagos. No sustituimos a organismos de emergencia, protección civil, organizaciones humanitarias o servicios médicos.
              </p>

              {/* Somos un puente */}
              <div style={{ background:`linear-gradient(135deg,${P.purple},${P.purpleDk})`, borderRadius:20, padding:"40px 36px", marginBottom:40, textAlign:"center" }}>
                <p style={{ fontSize:22, fontWeight:900, color:"#fff", lineHeight:1.6, marginBottom:0 }}>
                  Somos un puente.<br />
                  <span style={{ color:P.yellow }}>Un puente entre quien necesita ayuda y quien puede ofrecerla.</span><br />
                  <span style={{ color:"rgba(255,255,255,0.75)", fontWeight:600, fontSize:18 }}>Un puente entre la urgencia y la organización.</span><br />
                  <span style={{ color:"rgba(255,255,255,0.75)", fontWeight:600, fontSize:18 }}>Un puente entre la solidaridad y la seguridad.</span>
                </p>
              </div>

              <p style={{ fontSize:16, lineHeight:1.85, color:"#4A3560", fontStyle:"italic", borderLeft:`4px solid ${P.yellow}`, paddingLeft:20 }}>
                Porque en momentos así, ayudar no puede depender solo de la buena intención. También necesita orden, cuidado y responsabilidad.
              </p>
            </div>

            {/* ── POR QUÉ EXISTE ── */}
            <div id="porque" style={{ marginBottom:72 }}>
              <div style={{ display:"inline-block", background:P.lilaBg, color:P.purple, fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:20, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:16 }}>Por qué existimos</div>
              <h2 style={{ fontSize:32, fontWeight:900, color:P.purple, marginBottom:12, letterSpacing:"-0.5px", lineHeight:1.2 }}>Por qué existe Techo Venezuela</h2>

              <div style={{ background:P.cardBg, borderRadius:16, padding:"28px 32px", marginBottom:32, border:`1.5px solid ${P.border}` }}>
                <p style={{ fontSize:20, fontWeight:800, color:P.purple, lineHeight:1.5, marginBottom:8 }}>Después de una emergencia, una de las primeras preguntas es brutalmente simple:</p>
                <p style={{ fontSize:24, fontWeight:900, color:P.fuschia, letterSpacing:"-0.5px" }}>¿Dónde duermo esta noche?</p>
              </div>

              <p style={{ fontSize:16, lineHeight:1.9, color:"#4A3560", marginBottom:20 }}>
                Para muchas familias, volver a casa no es posible. Para otras, la casa sigue en pie, pero no se siente segura. Hay personas mayores, niños, mujeres solas, familias separadas, personas con discapacidad, mascotas, documentos perdidos, teléfonos sin batería y decisiones urgentes que tomar con muy poca información.
              </p>
              <p style={{ fontSize:16, lineHeight:1.9, color:"#4A3560", marginBottom:20 }}>
                Techo Venezuela existe para responder a una necesidad concreta: encontrar espacios temporales y seguros para personas que han quedado sin techo o que necesitan salir de una zona de riesgo.
              </p>
              <p style={{ fontSize:16, lineHeight:1.9, color:"#4A3560", marginBottom:32, fontWeight:600 }}>
                La solidaridad venezolana siempre aparece. Eso no está en duda. Lo que falta muchas veces es una forma ordenada de conectar esa ayuda con quienes más la necesitan, sin exponer a las familias afectadas ni a quienes ofrecen su casa.
              </p>

              <p style={{ fontSize:16, fontWeight:700, color:P.purple, marginBottom:16 }}>Por eso creamos esta plataforma:</p>
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:36 }}>
                {[
                  "Para que quien pueda ofrecer un espacio pueda registrarlo.",
                  "Para que quien necesita alojamiento pueda pedir ayuda.",
                  "Para que cada caso sea revisado por una persona.",
                  "Para que las conexiones no se hagan a ciegas.",
                  "Para que la ayuda llegue con más rapidez, pero también con más cuidado.",
                ].map((item,i) => (
                  <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start", background:P.cardBg, borderRadius:12, padding:"14px 18px", border:`1.5px solid ${P.border}` }}>
                    <span style={{ background:P.yellow, color:P.purple, width:24, height:24, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, flexShrink:0, marginTop:1 }}>{i+1}</span>
                    <p style={{ fontSize:15, color:"#4A3560", lineHeight:1.6 }}>{item}</p>
                  </div>
                ))}
              </div>

              <div style={{ background:P.lilaBg, borderRadius:16, padding:"28px 32px", textAlign:"center" }}>
                <p style={{ fontSize:16, color:"#4A3560", lineHeight:1.8, marginBottom:12 }}>Techo Venezuela no promete resolverlo todo.</p>
                <p style={{ fontSize:18, fontWeight:800, color:P.purple, lineHeight:1.6 }}>
                  Promete hacer algo concreto, humano y urgente:<br />
                  <span style={{ color:P.fuschia }}>ayudar a que más personas tengan un techo seguro mientras reconstruyen el resto.</span>
                </p>
              </div>
            </div>

            {/* ── LINK A SEGURIDAD ── */}
            <div onClick={() => setView("seguridad")} style={{ background:`linear-gradient(135deg,${P.purpleDk},${P.purple})`, borderRadius:20, padding:"36px 32px", marginBottom:56, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, flexWrap:"wrap" }}>
              <div>
                <h3 style={{ fontSize:20, fontWeight:900, color:"#fff", marginBottom:8 }}>🔒 Cómo cuidamos la seguridad</h3>
                <p style={{ color:"rgba(255,255,255,0.75)", fontSize:14 }}>Nuestro proceso de verificación, los 8 pasos y el contrato entre las partes.</p>
              </div>
              <span style={{ background:P.yellow, color:P.purple, padding:"12px 24px", borderRadius:10, fontWeight:800, fontSize:14, whiteSpace:"nowrap" }}>Ver proceso →</span>
            </div>

            {/* Contacto */}
            <div style={{ textAlign:"center", paddingTop:20 }}>
              <h2 style={{ fontSize:24, fontWeight:900, color:P.purple, marginBottom:12, letterSpacing:"-0.5px" }}>¿Tienes preguntas o quieres colaborar?</h2>
              <p style={{ color:P.muted, fontSize:15, marginBottom:24 }}>Escríbenos directamente. Respondemos en menos de 24 horas.</p>
              <a href="mailto:contacto@techovenezuela.org" style={{ display:"inline-block", background:P.yellow, color:P.purple, padding:"14px 32px", borderRadius:10, fontWeight:800, fontSize:15, textDecoration:"none" }}>
                contacto@techovenezuela.org
              </a>
            </div>

          </div>
        </div>
      )}

      {/* ══════ CÓMO CUIDAMOS LA SEGURIDAD — página propia ══════ */}
      {view === "seguridad" && (
        <div>
          <div style={{ background:`linear-gradient(135deg,${P.purple},${P.purpleDk})`, padding:"72px 24px", textAlign:"center" }}>
            <div style={{ maxWidth:700, margin:"0 auto" }}>
              <div style={{ fontSize:44, marginBottom:16 }}>🔒</div>
              <h1 style={{ fontSize:40, fontWeight:900, color:"#fff", lineHeight:1.15, marginBottom:18, letterSpacing:"-1px" }}>
                Cómo cuidamos la seguridad
              </h1>
              <p style={{ color:"rgba(255,255,255,0.75)", fontSize:17, lineHeight:1.75 }}>
                Cada solicitud y cada oferta de alojamiento pasa por una revisión humana antes de ser conectada.
              </p>
            </div>
          </div>

          <div style={{ maxWidth:800, margin:"0 auto", padding:"64px 24px" }}>

            <p style={{ fontSize:16, lineHeight:1.9, color:"#4A3560", marginBottom:16 }}>
              Techo Venezuela no funciona como un sistema automático. Cada solicitud y cada oferta de alojamiento pasa por una revisión humana antes de ser conectada.
            </p>
            <p style={{ fontSize:16, lineHeight:1.9, color:"#4A3560", marginBottom:48 }}>
              Sabemos que abrir una casa requiere confianza. También sabemos que pedir refugio en un momento vulnerable requiere protección. Por eso nuestro proceso está diseñado para reducir riesgos para ambas partes.
            </p>

            <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:48 }}>
              {[
                { n:"1", title:"Registro separado", desc:"Las personas que ofrecen alojamiento y las personas que necesitan alojamiento completan formularios distintos. Esto nos permite entender la situación de cada lado antes de hacer cualquier conexión." },
                { n:"2", title:"Verificación básica de identidad", desc:"Solicitamos datos de contacto, documento de identidad cuando sea posible, teléfono verificable y, en algunos casos, una videollamada corta o confirmación por referencia." },
                { n:"3", title:"Revisión del espacio ofrecido", desc:"Pedimos información sobre la ubicación aproximada, tipo de espacio, capacidad, condiciones básicas, acceso a baño, agua, electricidad cuando exista, privacidad, presencia de mascotas, niños u otras personas en la vivienda." },
                { n:"4", title:"Confirmación de seguridad mínima", desc:"No publicamos direcciones exactas de forma abierta. La dirección completa solo se comparte cuando hay una posible coincidencia y ambas partes han sido contactadas." },
                { n:"5", title:"Priorización de casos vulnerables", desc:"Cuando hay muchas solicitudes, priorizamos familias con niños, personas mayores, personas con discapacidad, mujeres solas, personas con necesidades médicas y casos donde la vivienda ya no es habitable." },
                { n:"6", title:"Match humano", desc:"No asignamos personas automáticamente. Revisamos compatibilidad básica: zona, número de personas, duración estimada, necesidades especiales, disponibilidad del espacio y condiciones del anfitrión." },
                { n:"7", title:"Acuerdo claro entre las partes", desc:"Antes de confirmar, ambas partes reciben por escrito las condiciones básicas: duración prevista, número de personas, normas de convivencia, qué se ofrece y qué no se ofrece." },
                { n:"8", title:"Seguimiento", desc:"Después del contacto inicial, intentamos hacer seguimiento para confirmar que la conexión ocurrió y que no se reportaron problemas." },
              ].map(({ n, title, desc }) => (
                <div key={n} style={{ display:"flex", gap:20, background:P.cardBg, borderRadius:14, padding:"22px 24px", border:`1.5px solid ${P.border}`, alignItems:"flex-start" }}>
                  <div style={{ background:P.purple, color:"#fff", width:36, height:36, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:900, flexShrink:0 }}>{n}</div>
                  <div>
                    <h3 style={{ fontSize:15, fontWeight:800, color:P.purple, marginBottom:6 }}>{title}</h3>
                    <p style={{ fontSize:14, color:"#4A3560", lineHeight:1.7 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CONTRATO */}
            <div style={{ background:`linear-gradient(135deg,${P.purpleDk},${P.purple})`, borderRadius:20, padding:"40px 36px", marginBottom:40 }}>
              <div style={{ fontSize:32, marginBottom:16, textAlign:"center" }}>📄</div>
              <h2 style={{ fontSize:24, fontWeight:900, color:"#fff", marginBottom:18, textAlign:"center", letterSpacing:"-0.5px" }}>Un acuerdo formal, no una promesa verbal</h2>
              <p style={{ color:"rgba(255,255,255,0.85)", fontSize:15, lineHeight:1.85, marginBottom:18 }}>
                Para que la ayuda sea segura para ambas partes, tanto el anfitrión como la persona alojada reciben y firman un <strong style={{ color:P.yellow }}>acuerdo de convivencia temporal</strong> antes de iniciar la estadía. Este acuerdo deja por escrito las condiciones básicas: quién aloja a quién, cuántas personas, qué se ofrece, qué se espera de cada parte y las normas mínimas de convivencia.
              </p>
              <p style={{ color:"rgba(255,255,255,0.85)", fontSize:15, lineHeight:1.85, marginBottom:18 }}>
                El acuerdo tiene una <strong style={{ color:P.yellow }}>duración inicial de una semana</strong>. Esto protege a ambas partes: le da al anfitrión la tranquilidad de que el compromiso no es indefinido, y le da a la persona alojada un plazo claro para organizar sus próximos pasos sin la presión de una fecha límite improvisada.
              </p>
              <p style={{ color:"rgba(255,255,255,0.85)", fontSize:15, lineHeight:1.85 }}>
                Si al final de esa semana ambas partes desean continuar, el acuerdo <strong style={{ color:P.yellow }}>puede renovarse o extenderse de mutuo acuerdo</strong>, las veces que sea necesario. Ninguna extensión es automática — siempre requiere la conformidad explícita de ambas personas.
              </p>
            </div>

            <div style={{ background:"#FFF9EC", border:`1.5px solid ${P.yellow}`, borderRadius:16, padding:"28px 32px", marginBottom:40 }}>
              <p style={{ fontSize:15, color:"#5A4A00", lineHeight:1.8 }}>
                <strong>Este proceso no elimina todos los riesgos.</strong> Ningún proceso puede hacerlo. Pero sí crea una capa de revisión, cuidado y responsabilidad para que la ayuda no dependa solo de mensajes reenviados por WhatsApp o publicaciones sueltas en redes sociales.
              </p>
            </div>

            <div style={{ textAlign:"center" }}>
              <span onClick={() => setView("legal")} style={{ color:P.fuschia, fontWeight:700, cursor:"pointer", fontSize:14 }}>Leer el Aviso Legal completo →</span>
            </div>

          </div>
        </div>
      )}

      {/* ══════ AVISO LEGAL ══════ */}
      {view === "legal" && (
        <div style={{ maxWidth:760, margin:"0 auto", padding:"56px 24px" }}>
          <h1 style={{ fontSize:30, fontWeight:900, color:P.purple, marginBottom:6, letterSpacing:"-0.5px" }}>Aviso legal y limitación de responsabilidad</h1>
          <p style={{ color:P.muted, fontSize:14, marginBottom:40 }}>Techo Venezuela · Última actualización: junio 2026</p>

          {[
            { t:"1. Naturaleza de la iniciativa", p:[
              "Techo Venezuela es una iniciativa ciudadana y solidaria creada para facilitar la conexión entre personas afectadas por una situación de emergencia en Venezuela que necesitan alojamiento temporal y personas que voluntariamente ofrecen un espacio de acogida.",
              "Techo Venezuela no es una agencia inmobiliaria, hotel, plataforma comercial de hospedaje, servicio de emergencia, organismo público, autoridad de protección civil, entidad médica, empresa de seguridad ni proveedor profesional de alojamiento.",
              "La finalidad de esta iniciativa es servir como puente de conexión, de forma gratuita, entre personas que solicitan ayuda y personas que desean ofrecer apoyo.",
            ]},
            { t:"2. Ausencia de relación contractual de hospedaje", p:[
              "Techo Venezuela no es parte del acuerdo de alojamiento que pueda establecerse entre la persona solicitante y la persona anfitriona.",
              "Cualquier acuerdo, condición, duración de estancia, normas de convivencia, acceso al espacio, uso de servicios, transporte, alimentación u otros aspectos prácticos deberán ser acordados directamente entre la persona solicitante y la persona anfitriona.",
              "Techo Venezuela no cobra comisiones, no gestiona pagos, no administra inmuebles, no alquila espacios y no actúa como representante legal de ninguna de las partes.",
            ]},
            { t:"3. Revisión de información y proceso de conexión", p:[
              "Techo Venezuela podrá solicitar información básica a las personas solicitantes y anfitrionas con el objetivo de revisar cada caso y facilitar conexiones más seguras y responsables.",
              "Esta revisión puede incluir, entre otros datos, identidad, datos de contacto, ubicación aproximada, composición del grupo familiar, necesidades especiales, disponibilidad del espacio, condiciones básicas del alojamiento y referencias cuando sea posible.",
              "El proceso de revisión busca reducir riesgos, pero no constituye una garantía absoluta sobre la identidad, conducta, antecedentes, seguridad, condiciones personales o veracidad total de la información facilitada por ninguna persona.",
              "Techo Venezuela no garantiza que todas las solicitudes reciban alojamiento ni que todas las ofertas sean finalmente asignadas.",
            ]},
            { t:"4. Seguridad y responsabilidad de las partes", p:[
              "Cada persona que utilice Techo Venezuela es responsable de proporcionar información verdadera, completa y actualizada.",
              "Las personas anfitrionas son responsables de asegurarse de que el espacio ofrecido sea seguro, digno y adecuado para el uso temporal que declaran.",
              "Las personas solicitantes son responsables de informar de forma clara sus necesidades, número real de personas, situación de vulnerabilidad, condiciones médicas relevantes, presencia de niños, mascotas u otras circunstancias importantes para la convivencia.",
              "Ambas partes deberán actuar con buena fe, respeto, prudencia y responsabilidad.",
              "Techo Venezuela recomienda que ninguna persona comparta direcciones exactas, documentos sensibles, fotografías de menores, datos bancarios o información privada fuera de los canales indicados hasta que exista una revisión previa y una conexión razonablemente validada.",
            ]},
            { t:"5. Limitación de responsabilidad", p:[
              "En la medida máxima permitida por la ley aplicable, Techo Venezuela, sus fundadores, voluntarios, colaboradores, aliados, donantes o entidades de apoyo no serán responsables por daños, pérdidas, conflictos, accidentes, lesiones, enfermedades, robos, incumplimientos, comportamientos indebidos, disputas personales, daños materiales, daños morales, cancelaciones, desalojos, falta de disponibilidad del alojamiento o cualquier otra situación que pueda surgir como consecuencia directa o indirecta de la relación entre personas solicitantes y anfitrionas.",
              "Techo Venezuela no puede garantizar la seguridad absoluta de las personas, viviendas, zonas geográficas, condiciones sanitarias, servicios públicos, infraestructura, transporte o entorno donde se encuentre el alojamiento ofrecido.",
              "Nada en este aviso pretende excluir responsabilidades que no puedan ser excluidas conforme a la ley aplicable.",
            ]},
            { t:"6. No sustitución de servicios de emergencia", p:[
              "Techo Venezuela no sustituye a servicios de emergencia, protección civil, bomberos, policía, asistencia médica, autoridades locales, organizaciones humanitarias especializadas ni canales oficiales de rescate o evacuación.",
              "Si una persona se encuentra en peligro inmediato, debe contactar primero con los servicios de emergencia, autoridades competentes u organizaciones humanitarias presentes en la zona.",
            ]},
            { t:"7. Tratamiento de datos personales", p:[
              "Techo Venezuela tratará los datos personales proporcionados únicamente para gestionar solicitudes de ayuda, revisar ofertas de alojamiento, facilitar posibles conexiones, realizar seguimiento básico de los casos, prevenir abusos y proteger la seguridad de las personas participantes.",
              "Los datos podrán incluir información identificativa, datos de contacto, ubicación aproximada, composición familiar, situación de vulnerabilidad y otra información necesaria para evaluar la solicitud u oferta.",
              "Los datos no serán vendidos ni utilizados con fines comerciales.",
              "La información solo será compartida con las personas estrictamente necesarias para evaluar y facilitar una posible conexión, o cuando exista obligación legal, riesgo grave para la seguridad de una persona o requerimiento de autoridad competente.",
              "Las personas usuarias podrán solicitar acceso, rectificación, eliminación o limitación del tratamiento de sus datos escribiendo a: contacto@techovenezuela.org.",
            ]},
            { t:"8. Menores de edad", p:[
              "Cuando una solicitud involucre a menores de edad, la información deberá ser proporcionada por su madre, padre, tutor legal o adulto responsable.",
              "Techo Venezuela no publicará datos identificativos de menores ni compartirá información sensible sobre ellos salvo cuando sea necesario para evaluar una conexión segura y siempre bajo criterios de protección y mínima exposición.",
            ]},
            { t:"9. Veracidad de la información", p:[
              "Al utilizar Techo Venezuela, cada persona declara que la información proporcionada es verdadera y que entiende que facilitar datos falsos, incompletos o engañosos puede implicar la suspensión de la solicitud u oferta y, si corresponde, la comunicación a las autoridades competentes.",
            ]},
            { t:"10. Cambios en este aviso", p:[
              "Techo Venezuela podrá modificar este Aviso Legal cuando sea necesario para mejorar la seguridad del proyecto, adaptarse a cambios operativos o cumplir con obligaciones legales.",
              "La versión actualizada estará disponible en esta página.",
            ]},
            { t:"11. Contacto", p:[
              "Para consultas, solicitudes sobre datos personales, reporte de incidentes o dudas sobre este aviso, puedes escribir a contacto@techovenezuela.org",
            ]},
          ].map(({ t, p }) => (
            <div key={t} style={{ marginBottom:32 }}>
              <h2 style={{ fontSize:18, fontWeight:800, color:P.purple, marginBottom:12 }}>{t}</h2>
              {p.map((para,i) => (
                <p key={i} style={{ fontSize:14, lineHeight:1.8, color:"#4A3560", marginBottom:10 }}>{para}</p>
              ))}
            </div>
          ))}

          <div style={{ textAlign:"center", marginTop:48 }}>
            <button className="btn-primary" onClick={() => setView("home")}>Volver al inicio</button>
          </div>
        </div>
      )}
      {view === "listings" && (
        <div style={{ maxWidth:1080, margin:"0 auto", padding:"48px 24px" }}>
          <h2 style={{ fontSize:30, fontWeight:900, color:P.purple, marginBottom:6, letterSpacing:"-0.5px" }}>Techos disponibles</h2>
          <p style={{ color:P.muted, marginBottom:32, fontSize:15 }}>Espacios ya revisados y aprobados por nuestro equipo. Venezolanos que abren su casa.</p>
          <div style={{ marginBottom:36 }}>
            <span className="lbl">Filtrar por estado</span>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:8 }}>
              {["Todos","La Guaira","Caracas","Yaracuy","Carabobo","Aragua","Miranda"].map(e => (
                <button key={e} onClick={() => setFilterEstado(e)} style={{ padding:"7px 18px", borderRadius:24, border:"1.5px solid", borderColor:filterEstado===e ? P.purple : P.border, background:filterEstado===e ? P.purple : P.white, color:filterEstado===e ? "#fff" : P.text, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}>{e}</button>
              ))}
            </div>
          </div>
          {loadingListings ? (
            <div style={{ textAlign:"center", padding:72, color:P.muted }}>
              <div style={{ fontSize:48, marginBottom:16 }}>⏳</div>
              <p style={{ fontSize:15 }}>Cargando espacios disponibles...</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div style={{ textAlign:"center", padding:72, color:P.muted }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
              <p style={{ fontSize:15 }}>Todavía no hay espacios aprobados en este estado.</p>
              <button className="btn-primary" style={{ marginTop:24 }} onClick={() => { setView("offer"); setStep(1); }}>Ofrecer el primero</button>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))", gap:26 }}>
              {filteredListings.map(l => <ListingCard key={l.id} listing={l} P={P} onClick={() => { setSelectedListing(l); setView("listing"); }} />)}
            </div>
          )}
        </div>
      )}

      {/* ══════ SINGLE LISTING ══════ */}
      {view === "listing" && selectedListing && (
        <div style={{ maxWidth:780, margin:"0 auto", padding:"44px 24px" }}>
          <button onClick={() => setView("listings")} style={{ background:"none", border:"none", color:P.fuschia, cursor:"pointer", fontWeight:700, fontSize:15, marginBottom:28 }}>← Volver</button>
          <img src={selectedListing.foto_url || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"} alt="espacio" style={{ width:"100%", height:300, objectFit:"cover", borderRadius:16, marginBottom:28 }} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16, marginBottom:24 }}>
            <div>
              <span className="badge badge-purple">Verificada</span>
              <h1 style={{ fontSize:28, fontWeight:900, color:P.purple, marginTop:10, marginBottom:4, letterSpacing:"-0.5px" }}>{selectedListing.tipo_espacio}</h1>
              <p style={{ color:P.muted, fontSize:15 }}>📍 {selectedListing.zona} — {selectedListing.estado}</p>
            </div>
            <div style={{ background:selectedListing.disponible ? P.greenBg : P.coralBg, borderRadius:12, padding:"12px 20px", textAlign:"center" }}>
              <div style={{ fontSize:14, fontWeight:700, color:selectedListing.disponible ? "#1A7A4A" : "#C0392B" }}>{selectedListing.disponible ? "✅ Disponible" : "❌ No disponible"}</div>
              <div style={{ fontSize:12, color:P.muted, marginTop:4 }}>Hasta {selectedListing.max_personas} persona{selectedListing.max_personas>1?"s":""} · {selectedListing.max_duracion}</div>
            </div>
          </div>
          <div style={{ background:P.cardBg, borderRadius:14, padding:"20px 24px", marginBottom:20, boxShadow:`0 2px 12px rgba(123,63,160,0.07)` }}>
            <span className="lbl">Servicios básicos</span>
            <div style={{ display:"flex", gap:24, flexWrap:"wrap", marginTop:8 }}>
              {[[selectedListing.tiene_electricidad,"⚡","Electricidad"],[selectedListing.tiene_agua,"💧","Agua"],[selectedListing.tiene_gas,"🔥","Gas"]].map(([has,icon,label]) => (
                <span key={label} style={{ fontSize:14, fontWeight:600, color:has?"#1A7A4A":P.coral, display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ width:9, height:9, borderRadius:"50%", background:has?"#2ECC71":P.coral, display:"inline-block" }} />
                  {icon} {has ? label : `Sin ${label.toLowerCase()}`}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:20 }}>
            <div style={{ background:P.cardBg, borderRadius:14, padding:"20px 22px", boxShadow:`0 2px 12px rgba(123,63,160,0.07)` }}>
              <span className="lbl">Qué ofrece</span>
              {(selectedListing.ofrece||"").split(", ").filter(Boolean).map(o => <div key={o} style={{ marginBottom:8, fontSize:13, display:"flex", gap:8 }}>✅ {o}</div>)}
            </div>
            <div style={{ background:P.cardBg, borderRadius:14, padding:"20px 22px", boxShadow:`0 2px 12px rgba(123,63,160,0.07)` }}>
              <span className="lbl">A quién recibe</span>
              {(selectedListing.acepta||"").split(", ").filter(Boolean).map(a => <div key={a} style={{ marginBottom:8, fontSize:13, display:"flex", gap:8 }}>👥 {a}</div>)}
            </div>
          </div>
          <div style={{ background:P.lilaBg, border:`1.5px solid ${P.purple}`, borderRadius:14, padding:"20px 24px", marginBottom:20 }}>
            <span className="lbl" style={{ color:P.purple }}>Lo que dice el anfitrión</span>
            <p style={{ color:"#4A3560", lineHeight:1.75, fontStyle:"italic", fontSize:15, marginTop:8 }}>"{selectedListing.historia}"</p>
            <p style={{ marginTop:12, fontWeight:700, color:P.purple, fontSize:14 }}>— {selectedListing.nombre}</p>
          </div>
          <div style={{ background:"#FFF9EC", border:`1.5px solid ${P.yellow}`, borderRadius:14, padding:"18px 22px", marginBottom:28 }}>
            <span className="lbl" style={{ color:"#8A6A00" }}>Proceso de verificación</span>
            <p style={{ color:"#5A4A00", fontSize:14, marginTop:6 }}>{selectedListing.proceso_verificacion}</p>
          </div>
          {selectedListing.disponible && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <button className="btn-primary" style={{ width:"100%", fontSize:16, padding:16 }} onClick={() => { setView("apply"); setStep(1); }}>Solicitar este espacio</button>
              <a href={`https://wa.me/58${(selectedListing.telefono||"").replace(/^0/,"").replace(/-/g,"")}`} target="_blank" rel="noreferrer"
                style={{ display:"block", background:"#25D366", color:"#fff", textAlign:"center", padding:"14px", borderRadius:10, fontWeight:700, fontSize:15, textDecoration:"none" }}>
                💬 Escribir por WhatsApp directamente
              </a>
              <div style={{ background:P.white, borderRadius:10, padding:"14px 18px", textAlign:"center", fontSize:14, color:P.muted, border:`1px solid ${P.border}` }}>
                📞 Llamar: <strong style={{ color:P.text }}>{selectedListing.telefono}</strong>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════ OFFER FORM ══════ */}
      {view === "offer" && (
        <div style={{ maxWidth:640, margin:"0 auto", padding:"44px 24px" }}>
          <h2 style={{ fontSize:28, fontWeight:900, color:P.purple, marginBottom:6, letterSpacing:"-0.5px" }}>Ofrecer mi espacio</h2>
          <p style={{ color:P.muted, marginBottom:32, fontSize:15 }}>Completamente gratuito. Tu teléfono aparece directamente para que te contacten.</p>
          <div className="sbar"><div className="sfil" style={{ width:`${(step/3)*100}%` }} /></div>
          <p style={{ fontSize:12, color:P.muted, marginBottom:32, marginTop:6 }}>Paso {step} de 3</p>
          {step === 1 && (
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <h3 style={{ fontSize:20, fontWeight:800, color:P.purple }}>¿Dónde estás y qué tienes?</h3>
              <div><span className="lbl">Tu nombre completo</span><input placeholder="ej. Carmen Valera" value={hostForm.name} onChange={e => setHostForm(p=>({...p,name:e.target.value}))} /></div>
              <div><span className="lbl">Teléfono (WhatsApp o llamada)</span><input placeholder="04XX-XXXXXXX" value={hostForm.phone} onChange={e => setHostForm(p=>({...p,phone:e.target.value}))} /></div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div><span className="lbl">Estado</span><select value={hostForm.estado} onChange={e => setHostForm(p=>({...p,estado:e.target.value}))}><option value="">Selecciona</option>{ESTADOS_VENEZUELA.map(e=><option key={e}>{e}</option>)}</select></div>
                <div><span className="lbl">Ciudad o zona</span><input placeholder="ej. Petare..." value={hostForm.zone} onChange={e => setHostForm(p=>({...p,zone:e.target.value}))} /></div>
              </div>
              <div><span className="lbl">Tipo de espacio</span>
                <select value={hostForm.roomType} onChange={e => setHostForm(p=>({...p,roomType:e.target.value}))}>
                  <option value="">Selecciona</option>
                  <option>Habitación privada con cama</option><option>Habitación compartida</option>
                  <option>Sala habilitada como dormitorio</option><option>Espacio en el piso / colchoneta</option>
                  <option>Apartamento o casa completa</option>
                </select>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div><span className="lbl">Personas máximo</span><input type="number" min={1} max={20} value={hostForm.maxGuests} onChange={e => setHostForm(p=>({...p,maxGuests:e.target.value}))} /></div>
                <div><span className="lbl">¿Hasta cuánto tiempo?</span>
                  <select value={hostForm.maxDuration} onChange={e => setHostForm(p=>({...p,maxDuration:e.target.value}))}>
                    <option value="">Selecciona</option><option>1 semana</option><option>2 semanas</option>
                    <option>1 mes</option><option>2 meses</option><option>3 meses</option><option>Sin límite definido</option>
                  </select>
                </div>
              </div>
              <div>
                <span className="lbl">Servicios disponibles</span>
                <div style={{ display:"flex", gap:20, flexWrap:"wrap", marginTop:8 }}>
                  {[["hasElectricity","⚡ Electricidad"],["hasWater","💧 Agua"],["hasGas","🔥 Gas"]].map(([key,lbl]) => (
                    <label key={key} style={{ display:"flex", alignItems:"center", gap:7, cursor:"pointer", fontSize:14, fontWeight:600, color:P.text }}>
                      <input type="checkbox" style={{ width:"auto" }} checked={hostForm[key]} onChange={e => setHostForm(p=>({...p,[key]:e.target.checked}))} />{lbl}
                    </label>
                  ))}
                </div>
              </div>
              <button className="btn-primary" onClick={() => setStep(2)}>Siguiente →</button>
            </div>
          )}
          {step === 2 && (
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <h3 style={{ fontSize:20, fontWeight:800, color:P.purple }}>¿Qué ofreces y a quién?</h3>
              <div><span className="lbl">¿Qué incluye tu espacio?</span>{offerOptions.map(opt => (<div key={opt} className={`chk ${hostForm.offers.includes(opt)?"on":""}`} onClick={() => toggleArr(setHostForm,"offers",opt)}><span>{hostForm.offers.includes(opt)?"☑":"☐"}</span>{opt}</div>))}</div>
              <div><span className="lbl">¿A quién puedes recibir?</span>{acceptOptions.map(opt => (<div key={opt} className={`chk ${hostForm.accepts.includes(opt)?"on":""}`} onClick={() => toggleArr(setHostForm,"accepts",opt)}><span>{hostForm.accepts.includes(opt)?"☑":"☐"}</span>{opt}</div>))}</div>
              <div><span className="lbl">¿Cómo verificas a quien recibes?</span>
                <select value={hostForm.vetProcess} onChange={e => setHostForm(p=>({...p,vetProcess:e.target.value}))}>
                  <option value="">Selecciona</option>
                  <option>Solo cédula venezolana vigente</option><option>Cédula + llamada previa</option>
                  <option>Cédula + referencia de alguien conocido</option><option>Cédula + visita previa al espacio</option>
                </select>
              </div>
              <div style={{ display:"flex", gap:12 }}>
                <button className="btn-outline" onClick={() => setStep(1)}>← Atrás</button>
                <button className="btn-primary" style={{ flex:1 }} onClick={() => setStep(3)}>Siguiente →</button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <h3 style={{ fontSize:20, fontWeight:800, color:P.purple }}>Tu mensaje a quien llegue</h3>
              <div><span className="lbl">¿Por qué abres tu casa?</span><textarea rows={4} placeholder="Cuéntale a las personas que van a ver tu espacio por qué quieres ayudar. Esto genera confianza." value={hostForm.story} onChange={e => setHostForm(p=>({...p,story:e.target.value}))} /></div>
              <div>
                <span className="lbl">📸 Foto del espacio</span>
                <div style={{ border:`2px dashed ${P.border}`, borderRadius:12, padding:32, textAlign:"center", color:P.muted, cursor:"pointer", background:P.white }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>📷</div>
                  <p style={{ fontSize:13 }}>Toca para subir una foto del cuarto o espacio</p>
                  <p style={{ fontSize:11, marginTop:4 }}>JPG o PNG — máximo 5MB</p>
                </div>
              </div>
              <div style={{ background:P.greenBg, borderRadius:10, padding:"14px 16px", fontSize:13, color:"#1A7A4A", lineHeight:1.65 }}>✅ Tu publicación se revisará antes de aparecer. Te avisamos en máximo 2 horas.</div>

              {/* Declaración de anfitrión */}
              <div style={{ background:P.cardBg, border:`1.5px solid ${P.border}`, borderRadius:12, padding:"20px 22px" }}>
                <h4 style={{ fontSize:13, fontWeight:800, color:P.purple, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.04em" }}>Declaración de anfitrión/a</h4>
                <p style={{ fontSize:13, color:"#4A3560", lineHeight:1.7, marginBottom:8 }}>Al ofrecer un espacio a través de Techo Venezuela, declaro que:</p>
                <ul style={{ fontSize:13, color:"#4A3560", lineHeight:1.85, paddingLeft:18, marginBottom:8 }}>
                  <li>El espacio ofrecido existe y está bajo mi control, autorización o responsabilidad.</li>
                  <li>La información que proporciono sobre ubicación, capacidad, condiciones, disponibilidad, servicios básicos y normas de convivencia es verdadera.</li>
                  <li>Me comprometo a tratar a la persona o familia acogida con respeto, dignidad y buena fe.</li>
                  <li>Entiendo que no debo solicitar pagos, favores, servicios personales, contraprestaciones indebidas ni condiciones abusivas a cambio del alojamiento ofrecido.</li>
                  <li>Acepto que Techo Venezuela pueda suspender o rechazar mi oferta si detecta información falsa, incompleta, riesgosa o contraria al espíritu solidario de la iniciativa.</li>
                  <li>Entiendo que Techo Venezuela no será parte del acuerdo de alojamiento y que yo seré responsable de las condiciones del espacio que ofrezco.</li>
                </ul>
                <p style={{ fontSize:12, color:P.muted }}>Al hacer clic en "Publicar mi espacio" confirmas esta declaración y el <span onClick={() => setView("legal")} style={{ color:P.fuschia, fontWeight:700, cursor:"pointer", textDecoration:"underline" }}>Aviso Legal completo</span>.</p>
              </div>

              <div style={{ display:"flex", gap:12 }}>
                <button className="btn-outline" onClick={() => setStep(2)}>← Atrás</button>
                <button className="btn-primary" style={{ flex:1 }} onClick={submitHostForm} disabled={submitting}>
                  {submitting ? "Enviando..." : "Publicar mi espacio →"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════ APPLY FORM ══════ */}
      {view === "apply" && (
        <div style={{ maxWidth:600, margin:"0 auto", padding:"44px 24px" }}>
          <button onClick={() => setView(selectedListing ? "listing" : "home")} style={{ background:"none", border:"none", color:P.fuschia, cursor:"pointer", fontWeight:700, fontSize:15, marginBottom:28 }}>← Volver</button>
          <h2 style={{ fontSize:26, fontWeight:900, color:P.purple, marginBottom:6, letterSpacing:"-0.5px" }}>{selectedListing ? "Solicitar este espacio" : "Necesito un techo"}</h2>
          <p style={{ color:P.muted, marginBottom:28, fontSize:14 }}>
            {selectedListing
              ? <>Con <strong>{selectedListing.hostName}</strong> en {selectedListing.zone}</>
              : "Cuéntanos tu caso. Nuestro equipo lo revisará y buscará el anfitrión más adecuado para ti."}
          </p>
          <div className="sbar"><div className="sfil" style={{ width:`${(step/4)*100}%` }} /></div>
          <p style={{ fontSize:12, color:P.muted, marginBottom:32, marginTop:6 }}>Paso {step} de 4</p>

          {step === 1 && (
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <h3 style={{ fontSize:20, fontWeight:800, color:P.purple }}>Quién eres y de dónde vienes</h3>
              <div><span className="lbl">Nombre completo</span><input placeholder="Tu nombre completo" value={applyForm.name} onChange={e => setApplyForm(p=>({...p,name:e.target.value}))} /></div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div><span className="lbl">Número de cédula</span><input placeholder="V-XXXXXXXX" value={applyForm.cedula} onChange={e => setApplyForm(p=>({...p,cedula:e.target.value}))} /></div>
                <div><span className="lbl">Teléfono</span><input placeholder="04XX-XXXXXXX" value={applyForm.phone} onChange={e => setApplyForm(p=>({...p,phone:e.target.value}))} /></div>
              </div>
              <div><span className="lbl">¿De qué estado o zona vienes?</span>
                <select value={applyForm.fromEstado} onChange={e => setApplyForm(p=>({...p,fromEstado:e.target.value}))}>
                  <option value="">Selecciona</option>{ESTADOS_VENEZUELA.map(e=><option key={e}>{e}</option>)}
                </select>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div><span className="lbl">Adultos en el grupo</span><input type="number" min={1} value={applyForm.adults} onChange={e => setApplyForm(p=>({...p,adults:e.target.value}))} /></div>
                <div><span className="lbl">Niños en el grupo</span><input type="number" min={0} value={applyForm.children} onChange={e => setApplyForm(p=>({...p,children:e.target.value}))} /></div>
              </div>
              <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:14, fontWeight:600, color:P.text }}>
                <input type="checkbox" style={{ width:"auto" }} checked={applyForm.hasElderlyOrDisabled} onChange={e => setApplyForm(p=>({...p,hasElderlyOrDisabled:e.target.checked}))} />
                Hay adultos mayores o personas con discapacidad en el grupo
              </label>
              <button className="btn-primary" onClick={() => setStep(2)}>Siguiente →</button>
            </div>
          )}

          {step === 2 && (
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <h3 style={{ fontSize:20, fontWeight:800, color:P.purple }}>Tu situación y tu vivienda actual</h3>
              <div><span className="lbl">¿Qué pasó? Cuéntale al anfitrión</span><textarea rows={4} placeholder="ej. Mi edificio colapsó en La Guaira. Somos 3 personas. Perdimos todo y no tenemos familia en Caracas." value={applyForm.situation} onChange={e => setApplyForm(p=>({...p,situation:e.target.value}))} /></div>

              <div><span className="lbl">¿En qué condición está tu vivienda actual?</span>
                <select value={applyForm.homeCondition} onChange={e => setApplyForm(p=>({...p,homeCondition:e.target.value}))}>
                  <option value="">Selecciona</option>
                  <option>Colapsó completamente — no es habitable</option>
                  <option>Daños graves — no es segura para vivir</option>
                  <option>Daños moderados — necesita reparación antes de volver</option>
                  <option>Sin daños visibles, pero no me siento segura/o regresando</option>
                  <option>No tengo acceso actualmente a mi vivienda</option>
                </select>
              </div>

              <div><span className="lbl">Describe brevemente los daños (si aplica)</span>
                <textarea rows={3} placeholder="ej. Grietas estructurales en paredes principales, techo parcialmente colapsado, sin agua ni electricidad desde el terremoto." value={applyForm.homeDamage} onChange={e => setApplyForm(p=>({...p,homeDamage:e.target.value}))} />
              </div>

              <div><span className="lbl">¿Cuánto tiempo necesitas?</span>
                <select value={applyForm.needDuration} onChange={e => setApplyForm(p=>({...p,needDuration:e.target.value}))}>
                  <option value="">Selecciona</option><option>1 semana</option><option>2 semanas</option>
                  <option>1 mes</option><option>2 meses</option><option>3 meses o más</option>
                </select>
              </div>

              <div style={{ display:"flex", gap:12 }}>
                <button className="btn-outline" onClick={() => setStep(1)}>← Atrás</button>
                <button className="btn-primary" style={{ flex:1 }} onClick={() => setStep(3)}>Siguiente →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <h3 style={{ fontSize:20, fontWeight:800, color:P.purple }}>Verificación y preferencias</h3>

              <div><span className="lbl">¿Tienes antecedentes penales?</span>
                <select value={applyForm.hasCriminalRecord} onChange={e => setApplyForm(p=>({...p,hasCriminalRecord:e.target.value}))}>
                  <option value="">Selecciona</option>
                  <option>No</option>
                  <option>Sí</option>
                  <option>Prefiero explicarlo directamente</option>
                </select>
              </div>
              {applyForm.hasCriminalRecord && applyForm.hasCriminalRecord !== "No" && (
                <div><span className="lbl">Explica brevemente (opcional pero recomendado)</span>
                  <textarea rows={2} placeholder="Esto nos ayuda a evaluar tu caso con contexto completo." value={applyForm.criminalRecordExplain} onChange={e => setApplyForm(p=>({...p,criminalRecordExplain:e.target.value}))} />
                </div>
              )}

              <div><span className="lbl">¿Estás disponible para una videollamada corta de verificación?</span>
                <select value={applyForm.canVideoCall} onChange={e => setApplyForm(p=>({...p,canVideoCall:e.target.value}))}>
                  <option value="">Selecciona</option>
                  <option>Sí, cuando sea necesario</option>
                  <option>Sí, pero con tiempo limitado</option>
                  <option>No tengo acceso a videollamada actualmente</option>
                </select>
              </div>
              <p style={{ fontSize:12, color:P.muted, marginTop:-10 }}>Esto es opcional — no es requisito obligatorio para aplicar, pero ayuda a agilizar tu solicitud.</p>

              <div><span className="lbl">¿Tienes alguna zona preferencial? (ej. cerca de trabajo, escuela, familiares)</span>
                <input placeholder="ej. Cerca de Chacao, trabajo en esa zona" value={applyForm.preferredZone} onChange={e => setApplyForm(p=>({...p,preferredZone:e.target.value}))} />
              </div>
              <div><span className="lbl">¿Por qué esa zona? (opcional)</span>
                <input placeholder="ej. Para poder seguir yendo a mi trabajo sin perder el empleo" value={applyForm.preferredZoneReason} onChange={e => setApplyForm(p=>({...p,preferredZoneReason:e.target.value}))} />
              </div>

              <div style={{ display:"flex", gap:12 }}>
                <button className="btn-outline" onClick={() => setStep(2)}>← Atrás</button>
                <button className="btn-primary" style={{ flex:1 }} onClick={() => setStep(4)}>Siguiente →</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <h3 style={{ fontSize:20, fontWeight:800, color:P.purple }}>Una referencia y confirmación final</h3>

              <div><span className="lbl">Nombre de una persona de referencia (familiar, amigo, vecino, jefe)</span>
                <input placeholder="Nombre completo" value={applyForm.referenceName} onChange={e => setApplyForm(p=>({...p,referenceName:e.target.value}))} />
              </div>
              <div><span className="lbl">Contacto de esa referencia</span>
                <input placeholder="Teléfono o email" value={applyForm.referenceContact} onChange={e => setApplyForm(p=>({...p,referenceContact:e.target.value}))} />
              </div>

              {selectedListing && (
                <div style={{ background:P.lilaBg, border:`1.5px solid ${P.purple}`, borderRadius:10, padding:"14px 16px", fontSize:13, color:P.purple, lineHeight:1.65 }}>
                  📞 Después de enviar, el anfitrión te contactará directamente. También puedes escribirle a: <strong>{selectedListing.phone}</strong>
                </div>
              )}
              {!selectedListing && (
                <div style={{ background:P.lilaBg, border:`1.5px solid ${P.purple}`, borderRadius:10, padding:"14px 16px", fontSize:13, color:P.purple, lineHeight:1.65 }}>
                  📋 Nuestro equipo revisará tu caso y buscará el anfitrión más adecuado según tu situación, zona y necesidades. Te contactaremos en menos de 24 horas.
                </div>
              )}

              {/* Declaración antes de enviar */}
              <div style={{ background:P.cardBg, border:`1.5px solid ${P.border}`, borderRadius:12, padding:"20px 22px" }}>
                <h4 style={{ fontSize:13, fontWeight:800, color:P.purple, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.04em" }}>Declaración antes de enviar</h4>
                <ul style={{ fontSize:13, color:"#4A3560", lineHeight:1.85, paddingLeft:18, marginBottom:8 }}>
                  <li>Declaro que la información proporcionada es verdadera y completa según mi conocimiento.</li>
                  <li>Entiendo que Techo Venezuela es una iniciativa solidaria de conexión y no un proveedor de alojamiento, servicio de emergencia, autoridad pública, agencia inmobiliaria ni garante absoluto de seguridad.</li>
                  <li>Entiendo que mi información será revisada por el equipo de Techo Venezuela para evaluar mi solicitud, facilitar posibles conexiones y realizar seguimiento básico del caso.</li>
                  <li>Acepto que Techo Venezuela pueda contactarme por teléfono, WhatsApp o email para verificar información o coordinar una posible conexión.</li>
                  <li>Entiendo que ninguna conexión está garantizada y que cualquier acuerdo final será responsabilidad de las personas directamente involucradas.</li>
                </ul>
                <p style={{ fontSize:12, color:P.muted }}>Al hacer clic en "Enviar solicitud" confirmas esta declaración y el <span onClick={() => setView("legal")} style={{ color:P.fuschia, fontWeight:700, cursor:"pointer", textDecoration:"underline" }}>Aviso Legal completo</span>.</p>
              </div>

              <div style={{ display:"flex", gap:12 }}>
                <button className="btn-outline" onClick={() => setStep(3)}>← Atrás</button>
                <button className="btn-primary" style={{ flex:1 }} onClick={submitApplyForm} disabled={submitting}>
                  {submitting ? "Enviando..." : "Enviar solicitud →"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUCCESS HOST */}
      {view === "success-host" && (
        <div style={{ maxWidth:520, margin:"0 auto", padding:"100px 24px", textAlign:"center" }}>
          <div style={{ width:80, height:80, borderRadius:"50%", background:P.greenBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, margin:"0 auto 28px" }}>🏠</div>
          <h2 style={{ fontSize:28, fontWeight:900, color:P.purple, marginBottom:14, letterSpacing:"-0.5px" }}>Gracias por abrir tu puerta</h2>
          <p style={{ color:"#4A3560", fontSize:15, lineHeight:1.75, marginBottom:40 }}>Tu publicación está en revisión. La activaremos en menos de 2 horas. Te contactaremos directamente al número que indicaste.</p>
          <button className="btn-primary" onClick={() => { setView("home"); setStep(1); }}>Volver al inicio</button>
        </div>
      )}

      {/* SUCCESS APPLY */}
      {view === "success-apply" && (
        <div style={{ maxWidth:520, margin:"0 auto", padding:"100px 24px", textAlign:"center" }}>
          <div style={{ width:80, height:80, borderRadius:"50%", background:P.lilaBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, margin:"0 auto 28px" }}>🤝</div>
          <h2 style={{ fontSize:28, fontWeight:900, color:P.purple, marginBottom:14, letterSpacing:"-0.5px" }}>Solicitud enviada</h2>
          <p style={{ color:"#4A3560", fontSize:15, lineHeight:1.75, marginBottom:40 }}>
            {selectedListing
              ? "El anfitrión recibirá tu solicitud y te contactará por teléfono. Si no hay respuesta en 24 horas, puedes llamarle directamente desde el perfil."
              : "Nuestro equipo revisará tu caso y buscará el anfitrión más adecuado según tu situación. Te contactaremos por teléfono en menos de 24 horas."}
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
            <button className="btn-primary" onClick={() => setView("listings")}>Ver techos disponibles</button>
            <button className="btn-outline" onClick={() => setView("home")}>Inicio</button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ background:P.purpleDk, color:"rgba(255,255,255,0.55)", padding:"40px 24px", textAlign:"center", marginTop:60 }}>
        <div style={{ marginBottom:20 }}><Logo height={32} light={true} /></div>
        <div className="flag" style={{ maxWidth:90, margin:"0 auto 24px", borderRadius:3, overflow:"hidden" }}>
          <div style={{ background:P.flagY, height:5 }} /><div style={{ background:P.flagB, height:5 }} /><div style={{ background:P.flagR, height:5 }} />
        </div>
        <p style={{ fontSize:13, marginBottom:8 }}>Red ciudadana de solidaridad. Gratuito. Sin fines de lucro. Solo venezolanos en Venezuela.</p>
        <p style={{ fontSize:12, marginBottom:16 }}>contacto@techovenezuela.org · Reportar problema · Emergencias: 0800-TECHO-VE</p>
        <div style={{ display:"flex", gap:20, justifyContent:"center", flexWrap:"wrap" }}>
          <span style={{ cursor:"pointer", fontSize:13 }} onClick={() => { setView("apply"); setStep(1); setSelectedListing(null); }}>Buscar techo</span>
          <span style={{ cursor:"pointer", fontSize:13 }} onClick={() => { setView("offer"); setStep(1); }}>Ofrecer espacio</span>
          <span style={{ cursor:"pointer", fontSize:13 }} onClick={() => setView("listings")}>Techos disponibles</span>
          <span style={{ cursor:"pointer", fontSize:13 }} onClick={() => setView("nosotros")}>Quiénes somos</span>
          <span style={{ cursor:"pointer", fontSize:13 }} onClick={() => setView("seguridad")}>Seguridad</span>
          <span style={{ cursor:"pointer", fontSize:13 }} onClick={() => setView("legal")}>Aviso legal</span>
        </div>
      </footer>
    </div>
  );
}

function ListingCard({ listing, P, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      <div style={{ position:"relative" }}>
        <img src={listing.foto_url || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"} alt="espacio" style={{ width:"100%", height:195, objectFit:"cover" }} />
        {!listing.disponible && (
          <div style={{ position:"absolute", inset:0, background:"rgba(90,45,122,0.6)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontWeight:700 }}>No disponible</span>
          </div>
        )}
        <div style={{ position:"absolute", top:12, left:12 }}>
          <span className="badge badge-purple">Verificada</span>
        </div>
      </div>
      <div style={{ padding:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <h3 style={{ fontSize:16, fontWeight:800, color:P.purple }}>{listing.tipo_espacio}</h3>
          <span style={{ fontSize:11, color:P.muted, whiteSpace:"nowrap", marginLeft:8 }}>{listing.max_duracion}</span>
        </div>
        <p style={{ color:P.muted, fontSize:12, margin:"4px 0 12px" }}>📍 {listing.zona} · {listing.estado}</p>
        <div style={{ display:"flex", gap:12, marginBottom:12 }}>
          <span style={{ fontSize:11, fontWeight:600, color:listing.tiene_electricidad?"#1A7A4A":P.coral }}>⚡ {listing.tiene_electricidad?"Luz":"Sin luz"}</span>
          <span style={{ fontSize:11, fontWeight:600, color:listing.tiene_agua?"#1A7A4A":P.coral }}>💧 {listing.tiene_agua?"Agua":"Sin agua"}</span>
          <span style={{ fontSize:11, fontWeight:600, color:listing.tiene_gas?"#1A7A4A":P.coral }}>🔥 {listing.tiene_gas?"Gas":"Sin gas"}</span>
        </div>
        <p style={{ color:"#4A3560", fontSize:13, lineHeight:1.6, marginBottom:14 }}>"{(listing.historia||"").slice(0,85)}..."</p>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontWeight:700, color:P.fuschia, fontSize:13 }}>— {listing.nombre}</span>
          <span style={{ fontSize:12, fontWeight:600, color:listing.disponible?"#1A7A4A":P.muted }}>{listing.disponible?"✅ Disponible":"⏸ Ocupado"}</span>
        </div>
      </div>
    </div>
  );
}
