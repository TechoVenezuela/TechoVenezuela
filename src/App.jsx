import { useState } from "react";

const ESTADOS_VENEZUELA = ["La Guaira (zona más afectada)","Caracas","Yaracuy","Carabobo","Aragua","Miranda","Vargas","Falcón","Lara","Zulia","Mérida","Táchira","Barinas","Portuguesa","Guárico","Anzoátegui","Bolívar","Monagas","Sucre","Nueva Esparta","Otro estado"];

const MOCK_LISTINGS = [
  { id: 1, hostName: "Carmen Valera", estado: "Caracas", zone: "Petare", photos: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"], roomType: "Habitación privada con cama", maxGuests: 3, maxDuration: "2 meses", offers: ["Cama y colchón","Agua (cisterna propia)","Cocina de gas compartida","Baño compartido"], accepts: ["Familias con niños pequeños","Madres solas","Adultos mayores"], vetProcess: "Llamada telefónica + verificación de cédula de identidad", story: "Mi casa resistió gracias a que es de hace 40 años. Tengo un cuarto que puedo dar mientras la gente vuelve a pararse. Somos venezolanos, nos ayudamos.", available: true, badge: "Verificada", hasElectricity: false, hasWater: true, hasGas: true, phone: "0414-1234567" },
  { id: 2, hostName: "Familia Suárez-Marcano", estado: "Aragua", zone: "Maracay centro", photos: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80"], roomType: "Sala habilitada como dormitorio", maxGuests: 5, maxDuration: "1 mes", offers: ["Colchones en el piso","Planta eléctrica 4 horas/día","Nevera encendida en horario","Comida básica incluida"], accepts: ["Familias completas","Personas mayores","Personas con discapacidad"], vetProcess: "Solo cédula venezolana vigente", story: "Tenemos casa propia de dos pisos. El segundo piso lo podemos compartir. No pedimos nada a cambio, solo que cuiden el espacio.", available: true, badge: "Anfitrión Solidario", hasElectricity: true, hasWater: true, hasGas: false, phone: "0424-7654321" },
  { id: 3, hostName: "Roberto Angulo", estado: "Carabobo", zone: "Valencia Norte", photos: ["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80"], roomType: "Habitación privada", maxGuests: 2, maxDuration: "3 meses", offers: ["Cama matrimonial","Baño privado","Acceso a cocina","Conexión a internet (Cantv)"], accepts: ["Parejas sin hijos","Adultos solos","No fumadores dentro del hogar"], vetProcess: "Cédula + referencia de alguien conocido en común", story: "Soy carpintero. Mi casa quedó bien. Tengo un cuarto extra que no uso. Si alguien de La Guaira necesita dónde caer, que me llame.", available: true, badge: "Verificada", hasElectricity: true, hasWater: false, hasGas: true, phone: "0412-9876543" },
];

// ─── PALETA ───────────────────────────────────────────────
// Hero/nav:     #7B3FA0  púrpura principal
// Btn primary:  #F5C842  amarillo → texto #7B3FA0
// Btn secondary:#D63384  fucsia
// Fondo página: #F8F4FB  lila muy pálido
// Fondo cards:  #FDF6EC  crema cálido
// Texto:        #2D1A40  casi negro púrpura
// Muted:        #6B5B7B  gris lila
// Verde OK:     #2ECC71
// Coral error:  #FF6B6B
// Bandera:      #F5C842 · #003DA5 · #CF1720  (orden real)

const P = {
  purple:   "#7B3FA0",
  purpleDk: "#5A2D7A",
  yellow:   "#F5C842",
  fuschia:  "#D63384",
  pageBg:   "#F8F4FB",
  cardBg:   "#FDF6EC",
  lilaBg:   "#EDE0F5",
  text:     "#2D1A40",
  muted:    "#6B5B7B",
  green:    "#2ECC71",
  greenBg:  "#D5F5E3",
  coral:    "#FF6B6B",
  coralBg:  "#FFE5E5",
  white:    "#FFFFFF",
  border:   "#E8D8F5",
  flagY:    "#F5C842",
  flagB:    "#003DA5",
  flagR:    "#CF1720",
};

export default function TechoVenezuela() {
  const [view, setView] = useState("home");
  const [selectedListing, setSelectedListing] = useState(null);
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [step, setStep] = useState(1);
  const [hostForm, setHostForm] = useState({ name:"", phone:"", estado:"", zone:"", roomType:"", maxGuests:1, maxDuration:"", story:"", offers:[], accepts:[], vetProcess:"", hasElectricity:false, hasWater:false, hasGas:false });
  const [applyForm, setApplyForm] = useState({ name:"", cedula:"", phone:"", adults:1, children:0, situation:"", fromEstado:"", needDuration:"", hasElderlyOrDisabled:false });

  const offerOptions = ["Cama con colchón","Colchones en el piso","Ropa de cama","Agua (cisterna/pozo)","Cocina de gas","Nevera","Planta eléctrica","Baño privado","Baño compartido","Comida básica incluida","Acceso a patio"];
  const acceptOptions = ["Familias con niños","Madres solas","Adultos mayores","Personas con discapacidad","Adultos solos","Parejas","Mascotas pequeñas","Personas enfermas"];
  const listings = filterEstado === "Todos" ? MOCK_LISTINGS : MOCK_LISTINGS.filter(l => l.estado.includes(filterEstado.replace(" (zona más afectada)","")));
  const toggleArr = (setter, field, item) => setter(prev => ({ ...prev, [field]: prev[field].includes(item) ? prev[field].filter(i => i !== item) : [...prev[field], item] }));

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", background:P.pageBg, minHeight:"100vh", color:P.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }

        /* ── BUTTONS ── */
        .btn-primary {
          background:${P.yellow}; color:${P.purple}; border:none;
          padding:13px 28px; border-radius:10px; font-size:15px; font-weight:800;
          cursor:pointer; transition:all 0.2s; font-family:Inter,sans-serif;
          box-shadow: 0 2px 12px rgba(245,200,66,0.4);
        }
        .btn-primary:hover { background:#e8b800; transform:translateY(-1px); box-shadow:0 4px 20px rgba(245,200,66,0.5); }

        .btn-secondary {
          background:${P.fuschia}; color:#fff; border:none;
          padding:13px 28px; border-radius:10px; font-size:15px; font-weight:700;
          cursor:pointer; transition:all 0.2s; font-family:Inter,sans-serif;
        }
        .btn-secondary:hover { background:#b8226e; transform:translateY(-1px); }

        .btn-outline {
          background:transparent; border:2px solid ${P.fuschia}; color:${P.fuschia};
          padding:11px 24px; border-radius:10px; font-size:14px; font-weight:600;
          cursor:pointer; transition:all 0.2s; font-family:Inter,sans-serif;
        }
        .btn-outline:hover { background:${P.fuschia}; color:#fff; }

        .btn-ghost {
          background:rgba(255,255,255,0.15); border:2px solid rgba(255,255,255,0.5);
          color:#fff; padding:13px 28px; border-radius:10px; font-size:15px;
          font-weight:600; cursor:pointer; transition:all 0.2s; font-family:Inter,sans-serif;
        }
        .btn-ghost:hover { background:rgba(255,255,255,0.25); border-color:rgba(255,255,255,0.8); }

        /* ── CARDS ── */
        .card {
          background:${P.cardBg}; border-radius:16px; overflow:hidden;
          box-shadow:0 2px 16px rgba(123,63,160,0.10); transition:transform 0.18s, box-shadow 0.18s; cursor:pointer;
        }
        .card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(123,63,160,0.18); }

        /* ── INPUTS ── */
        input, textarea, select {
          width:100%; padding:12px 14px; border:1.5px solid ${P.border};
          border-radius:10px; font-size:15px; font-family:Inter,sans-serif;
          background:${P.white}; color:${P.text}; transition:border-color 0.2s;
        }
        input:focus, textarea:focus, select:focus {
          outline:none; border-color:${P.purple}; box-shadow:0 0 0 3px rgba(123,63,160,0.12);
        }
        .lbl {
          font-size:12px; font-weight:700; color:${P.muted}; margin-bottom:6px;
          display:block; text-transform:uppercase; letter-spacing:0.05em;
        }
        .chk {
          display:flex; align-items:center; gap:10px; padding:11px 14px;
          border:1.5px solid ${P.border}; border-radius:10px; cursor:pointer;
          margin-bottom:8px; font-size:14px; transition:all 0.15s; color:${P.text};
          background:${P.white};
        }
        .chk.on { border-color:${P.purple}; background:${P.lilaBg}; font-weight:600; color:${P.purple}; }

        /* ── BADGES ── */
        .badge { display:inline-block; font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px; text-transform:uppercase; letter-spacing:0.04em; }
        .badge-purple { background:${P.lilaBg}; color:${P.purple}; }
        .badge-fuschia { background:#FFE0F0; color:${P.fuschia}; }

        /* ── NAV ── */
        .nav-lnk { cursor:pointer; font-weight:600; font-size:14px; color:${P.text}; padding:4px 0; border-bottom:2px solid transparent; transition:all 0.2s; }
        .nav-lnk:hover { color:${P.purple}; border-bottom-color:${P.purple}; }

        /* ── PROGRESS ── */
        .sbar { width:100%; height:5px; background:${P.border}; border-radius:3px; margin-bottom:8px; }
        .sfil { height:5px; background:${P.purple}; border-radius:3px; transition:width 0.3s; }

        /* ── FLAG — amarillo · azul · rojo (colores reales) ── */
        .flag { height:5px; display:flex; }
        .flag div { flex:1; }
      `}</style>

      {/* EMERGENCY BAR */}
      <div style={{ background:P.purple, color:"#fff", textAlign:"center", padding:"9px 24px", fontSize:13, fontWeight:600 }}>
        🏠 Emergencia sísmica · Terremotos 7.2 y 7.5 · Venezuela 24 junio 2026 · Conectamos a quien tiene espacio con quien lo necesita
      </div>

      {/* BANDERA VENEZOLANA — orden real: amarillo · azul · rojo */}
      <div className="flag">
        <div style={{ background:P.flagY }} />
        <div style={{ background:P.flagB }} />
        <div style={{ background:P.flagR }} />
      </div>

      {/* NAV */}
      <nav style={{ background:P.white, borderBottom:`1px solid ${P.border}`, padding:"0 24px", position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 8px rgba(123,63,160,0.08)" }}>
        <div style={{ maxWidth:1080, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:62 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={() => setView("home")}>
            <div style={{ width:36, height:36, borderRadius:9, background:`linear-gradient(135deg,${P.purple},${P.purpleDk})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🏠</div>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:19, fontWeight:700, color:P.purple }}>Techo Venezuela</span>
          </div>
          <div style={{ display:"flex", gap:28, alignItems:"center" }}>
            <span className="nav-lnk" onClick={() => setView("listings")}>Buscar techo</span>
            <span className="nav-lnk" onClick={() => { setView("offer"); setStep(1); }}>Ofrecer espacio</span>
            <button className="btn-primary" style={{ padding:"9px 20px", fontSize:13 }} onClick={() => setView("listings")}>
              Necesito ayuda urgente
            </button>
          </div>
        </div>
      </nav>

      {/* ══════ HOME ══════ */}
      {view === "home" && (<div>

        {/* HERO */}
        <div style={{ background:`linear-gradient(135deg,${P.purple} 0%,${P.purpleDk} 100%)`, padding:"90px 24px 100px", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-80, right:-80, width:380, height:380, borderRadius:"50%", background:"rgba(245,200,66,0.07)" }} />
          <div style={{ position:"absolute", bottom:-60, left:-60, width:280, height:280, borderRadius:"50%", background:"rgba(214,51,132,0.10)" }} />
          <div style={{ maxWidth:680, margin:"0 auto", position:"relative", zIndex:1 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(245,200,66,0.15)", border:"1px solid rgba(245,200,66,0.4)", borderRadius:24, padding:"6px 18px", marginBottom:32 }}>
              <span style={{ color:P.yellow, fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Red ciudadana de solidaridad</span>
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:52, fontWeight:700, color:"#fff", lineHeight:1.15, marginBottom:24 }}>
              Si tienes espacio,<br />
              <span style={{ color:P.yellow }}>alguien lo necesita hoy.</span>
            </h1>
            <p style={{ color:"rgba(255,255,255,0.75)", fontSize:18, lineHeight:1.75, maxWidth:520, margin:"0 auto 44px" }}>
              Una red gratuita para venezolanos que ofrecen un techo y venezolanos que lo perdieron. Solo en Venezuela. Solo solidaridad.
            </p>
            <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
              <button className="btn-primary" style={{ fontSize:16, padding:"15px 40px" }} onClick={() => setView("listings")}>
                Necesito un techo
              </button>
              <button className="btn-ghost" style={{ fontSize:16, padding:"15px 40px" }} onClick={() => { setView("offer"); setStep(1); }}>
                Tengo espacio y quiero ayudar
              </button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div style={{ background:P.white, borderBottom:`1px solid ${P.border}`, padding:"28px 24px" }}>
          <div style={{ maxWidth:900, margin:"0 auto", display:"flex", gap:48, flexWrap:"wrap", justifyContent:"center" }}>
            {[["1.430+","fallecidos confirmados","#CF1720"],["3.360+","heridos reportados","#CF1720"],["Miles","sin hogar en La Guaira y Caracas",P.purple],["100%","gratuito, sin fines de lucro","#1A7A4A"]].map(([n,l,c]) => (
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:34, fontWeight:700, color:c }}>{n}</div>
                <div style={{ fontSize:12, color:P.muted, fontWeight:500, marginTop:2, maxWidth:140 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ maxWidth:1000, margin:"0 auto", padding:"72px 24px" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, color:P.purple, marginBottom:10 }}>¿Cómo funciona?</h2>
            <p style={{ color:P.muted, fontSize:16 }}>Simple, directo y sin burocracia.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:24 }}>
            {[["🏠","Publicas tu espacio","Completas un formulario con tu estado, lo que ofreces y tu teléfono directo."],["🔎","Quienes necesitan buscan","Filtran por estado, ven fotos, condiciones reales y el contacto del anfitrión."],["📞","Contacto directo","Por teléfono o WhatsApp. Sin intermediarios. Sin esperas innecesarias."],["🪪","Cédula como verificación","El anfitrión verifica cédula venezolana vigente. Simple y seguro."]].map(([icon,title,desc]) => (
              <div key={title} style={{ background:P.cardBg, borderRadius:16, padding:"32px 22px", boxShadow:`0 2px 14px rgba(123,63,160,0.08)`, textAlign:"center" }}>
                <div style={{ width:56, height:56, borderRadius:14, background:P.lilaBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, margin:"0 auto 18px" }}>{icon}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:P.purple, marginBottom:10 }}>{title}</h3>
                <p style={{ color:P.muted, fontSize:13, lineHeight:1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* LISTINGS PREVIEW */}
        <div style={{ background:P.white, padding:"60px 24px" }}>
          <div style={{ maxWidth:1080, margin:"0 auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:36 }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:P.purple }}>Espacios disponibles ahora</h2>
              <span style={{ color:P.fuschia, fontWeight:700, cursor:"pointer", fontSize:14 }} onClick={() => setView("listings")}>Ver todos →</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:24 }}>
              {MOCK_LISTINGS.filter(l => l.available).slice(0,2).map(l => (
                <ListingCard key={l.id} listing={l} P={P} onClick={() => { setSelectedListing(l); setView("listing"); }} />
              ))}
            </div>
          </div>
        </div>

        {/* SAFETY */}
        <div style={{ background:P.lilaBg, padding:"56px 24px" }}>
          <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center" }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:P.purple, marginBottom:14 }}>Tu seguridad importa</h2>
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

        {/* CTA BOTTOM */}
        <div style={{ background:`linear-gradient(135deg,${P.purpleDk},${P.purple})`, padding:"64px 24px", textAlign:"center" }}>
          <div className="flag" style={{ maxWidth:90, margin:"0 auto 44px", borderRadius:4, overflow:"hidden" }}>
            <div style={{ background:P.flagY }} />
            <div style={{ background:P.flagB }} />
            <div style={{ background:P.flagR }} />
          </div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, color:"#fff", marginBottom:16 }}>¿Tienes un cuarto, una sala, un techo?</h2>
          <p style={{ color:"rgba(255,255,255,0.72)", fontSize:16, maxWidth:460, margin:"0 auto 36px", lineHeight:1.7 }}>No hace falta que sea perfecto. Solo que esté disponible. Publica en 5 minutos.</p>
          <button className="btn-primary" style={{ fontSize:16, padding:"15px 40px" }} onClick={() => { setView("offer"); setStep(1); }}>
            Ofrecer mi espacio →
          </button>
        </div>
      </div>)}

      {/* ══════ LISTINGS ══════ */}
      {view === "listings" && (
        <div style={{ maxWidth:1080, margin:"0 auto", padding:"48px 24px" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, color:P.purple, marginBottom:6 }}>Espacios disponibles</h2>
          <p style={{ color:P.muted, marginBottom:32, fontSize:15 }}>Venezolanos que abren su casa. Sin costo. Solo solidaridad.</p>
          <div style={{ marginBottom:36 }}>
            <span className="lbl">Filtrar por estado</span>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:8 }}>
              {["Todos","La Guaira","Caracas","Yaracuy","Carabobo","Aragua","Miranda"].map(e => (
                <button key={e} onClick={() => setFilterEstado(e)} style={{ padding:"7px 18px", borderRadius:24, border:"1.5px solid", borderColor:filterEstado===e ? P.purple : P.border, background:filterEstado===e ? P.purple : P.white, color:filterEstado===e ? "#fff" : P.text, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}>{e}</button>
              ))}
            </div>
          </div>
          {listings.length === 0 ? (
            <div style={{ textAlign:"center", padding:72, color:P.muted }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
              <p style={{ fontSize:15 }}>Todavía no hay espacios en este estado.</p>
              <button className="btn-primary" style={{ marginTop:24 }} onClick={() => { setView("offer"); setStep(1); }}>Ofrecer el primero</button>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))", gap:26 }}>
              {listings.map(l => <ListingCard key={l.id} listing={l} P={P} onClick={() => { setSelectedListing(l); setView("listing"); }} />)}
            </div>
          )}
        </div>
      )}

      {/* ══════ SINGLE LISTING ══════ */}
      {view === "listing" && selectedListing && (
        <div style={{ maxWidth:780, margin:"0 auto", padding:"44px 24px" }}>
          <button onClick={() => setView("listings")} style={{ background:"none", border:"none", color:P.fuschia, cursor:"pointer", fontWeight:700, fontSize:15, marginBottom:28 }}>← Volver</button>
          <img src={selectedListing.photos[0]} alt="espacio" style={{ width:"100%", height:300, objectFit:"cover", borderRadius:16, marginBottom:28 }} />

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16, marginBottom:24 }}>
            <div>
              <span className={`badge ${selectedListing.badge==="Anfitrión Solidario" ? "badge-fuschia" : "badge-purple"}`}>{selectedListing.badge}</span>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:P.purple, marginTop:10, marginBottom:4 }}>{selectedListing.roomType}</h1>
              <p style={{ color:P.muted, fontSize:15 }}>📍 {selectedListing.zone} — {selectedListing.estado}</p>
            </div>
            <div style={{ background:selectedListing.available ? P.greenBg : P.coralBg, borderRadius:12, padding:"12px 20px", textAlign:"center" }}>
              <div style={{ fontSize:14, fontWeight:700, color:selectedListing.available ? "#1A7A4A" : "#C0392B" }}>{selectedListing.available ? "✅ Disponible" : "❌ No disponible"}</div>
              <div style={{ fontSize:12, color:P.muted, marginTop:4 }}>Hasta {selectedListing.maxGuests} persona{selectedListing.maxGuests>1?"s":""} · {selectedListing.maxDuration}</div>
            </div>
          </div>

          {/* Servicios */}
          <div style={{ background:P.cardBg, borderRadius:14, padding:"20px 24px", marginBottom:20, boxShadow:`0 2px 12px rgba(123,63,160,0.07)` }}>
            <span className="lbl">Servicios básicos</span>
            <div style={{ display:"flex", gap:24, flexWrap:"wrap", marginTop:8 }}>
              {[[selectedListing.hasElectricity,"⚡","Electricidad"],[selectedListing.hasWater,"💧","Agua"],[selectedListing.hasGas,"🔥","Gas"]].map(([has,icon,label]) => (
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
              {selectedListing.offers.map(o => <div key={o} style={{ marginBottom:8, fontSize:13, display:"flex", gap:8 }}>✅ {o}</div>)}
            </div>
            <div style={{ background:P.cardBg, borderRadius:14, padding:"20px 22px", boxShadow:`0 2px 12px rgba(123,63,160,0.07)` }}>
              <span className="lbl">A quién recibe</span>
              {selectedListing.accepts.map(a => <div key={a} style={{ marginBottom:8, fontSize:13, display:"flex", gap:8 }}>👥 {a}</div>)}
            </div>
          </div>

          <div style={{ background:P.lilaBg, border:`1.5px solid ${P.purple}`, borderRadius:14, padding:"20px 24px", marginBottom:20 }}>
            <span className="lbl" style={{ color:P.purple }}>Lo que dice el anfitrión</span>
            <p style={{ color:"#4A3560", lineHeight:1.75, fontStyle:"italic", fontSize:15, marginTop:8 }}>"{selectedListing.story}"</p>
            <p style={{ marginTop:12, fontWeight:700, color:P.purple, fontSize:14 }}>— {selectedListing.hostName}</p>
          </div>

          <div style={{ background:"#FFF9EC", border:`1.5px solid ${P.yellow}`, borderRadius:14, padding:"18px 22px", marginBottom:28 }}>
            <span className="lbl" style={{ color:"#8A6A00" }}>Proceso de verificación</span>
            <p style={{ color:"#5A4A00", fontSize:14, marginTop:6 }}>{selectedListing.vetProcess}</p>
          </div>

          {selectedListing.available && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <button className="btn-primary" style={{ width:"100%", fontSize:16, padding:16 }} onClick={() => { setView("apply"); setStep(1); }}>
                Solicitar este espacio
              </button>
              <a href={`https://wa.me/58${selectedListing.phone.replace(/^0/,"").replace(/-/g,"")}`} target="_blank" rel="noreferrer"
                style={{ display:"block", background:"#25D366", color:"#fff", textAlign:"center", padding:"14px", borderRadius:10, fontWeight:700, fontSize:15, textDecoration:"none" }}>
                💬 Escribir por WhatsApp directamente
              </a>
              <div style={{ background:P.white, borderRadius:10, padding:"14px 18px", textAlign:"center", fontSize:14, color:P.muted, border:`1px solid ${P.border}` }}>
                📞 Llamar: <strong style={{ color:P.text }}>{selectedListing.phone}</strong>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════ OFFER FORM ══════ */}
      {view === "offer" && (
        <div style={{ maxWidth:640, margin:"0 auto", padding:"44px 24px" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:P.purple, marginBottom:6 }}>Ofrecer mi espacio</h2>
          <p style={{ color:P.muted, marginBottom:32, fontSize:15 }}>Completamente gratuito. Tu teléfono aparece directamente para que te contacten.</p>
          <div className="sbar"><div className="sfil" style={{ width:`${(step/3)*100}%` }} /></div>
          <p style={{ fontSize:12, color:P.muted, marginBottom:32, marginTop:6 }}>Paso {step} de 3</p>

          {step === 1 && (
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:P.purple }}>¿Dónde estás y qué tienes?</h3>
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
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:P.purple }}>¿Qué ofreces y a quién?</h3>
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
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:P.purple }}>Tu mensaje a quien llegue</h3>
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
              <div style={{ display:"flex", gap:12 }}>
                <button className="btn-outline" onClick={() => setStep(2)}>← Atrás</button>
                <button className="btn-primary" style={{ flex:1 }} onClick={() => setView("success-host")}>Publicar mi espacio →</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════ APPLY FORM ══════ */}
      {view === "apply" && selectedListing && (
        <div style={{ maxWidth:600, margin:"0 auto", padding:"44px 24px" }}>
          <button onClick={() => setView("listing")} style={{ background:"none", border:"none", color:P.fuschia, cursor:"pointer", fontWeight:700, fontSize:15, marginBottom:28 }}>← Volver</button>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:P.purple, marginBottom:6 }}>Solicitar este espacio</h2>
          <p style={{ color:P.muted, marginBottom:28, fontSize:14 }}>Con <strong>{selectedListing.hostName}</strong> en {selectedListing.zone}</p>
          <div className="sbar"><div className="sfil" style={{ width:`${(step/2)*100}%` }} /></div>
          <p style={{ fontSize:12, color:P.muted, marginBottom:32, marginTop:6 }}>Paso {step} de 2</p>

          {step === 1 && (
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:P.purple }}>Quién eres y de dónde vienes</h3>
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
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:P.purple }}>Tu situación</h3>
              <div><span className="lbl">¿Qué pasó? Cuéntale al anfitrión</span><textarea rows={4} placeholder="ej. Mi edificio colapsó en La Guaira. Somos 3 personas. Perdimos todo y no tenemos familia en Caracas." value={applyForm.situation} onChange={e => setApplyForm(p=>({...p,situation:e.target.value}))} /></div>
              <div><span className="lbl">¿Cuánto tiempo necesitas?</span>
                <select value={applyForm.needDuration} onChange={e => setApplyForm(p=>({...p,needDuration:e.target.value}))}>
                  <option value="">Selecciona</option><option>1 semana</option><option>2 semanas</option>
                  <option>1 mes</option><option>2 meses</option><option>3 meses o más</option>
                </select>
              </div>
              <div style={{ background:P.lilaBg, border:`1.5px solid ${P.purple}`, borderRadius:10, padding:"14px 16px", fontSize:13, color:P.purple, lineHeight:1.65 }}>
                📞 Después de enviar, el anfitrión te contactará directamente. También puedes escribirle a: <strong>{selectedListing.phone}</strong>
              </div>
              <div style={{ display:"flex", gap:12 }}>
                <button className="btn-outline" onClick={() => setStep(1)}>← Atrás</button>
                <button className="btn-primary" style={{ flex:1 }} onClick={() => setView("success-apply")}>Enviar solicitud →</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUCCESS HOST */}
      {view === "success-host" && (
        <div style={{ maxWidth:520, margin:"0 auto", padding:"100px 24px", textAlign:"center" }}>
          <div style={{ width:80, height:80, borderRadius:"50%", background:P.greenBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, margin:"0 auto 28px" }}>🏠</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:P.purple, marginBottom:14 }}>Gracias por abrir tu puerta</h2>
          <p style={{ color:"#4A3560", fontSize:15, lineHeight:1.75, marginBottom:40 }}>Tu publicación está en revisión. La activaremos en menos de 2 horas. Te contactaremos directamente al número que indicaste.</p>
          <button className="btn-primary" onClick={() => { setView("home"); setStep(1); }}>Volver al inicio</button>
        </div>
      )}

      {/* SUCCESS APPLY */}
      {view === "success-apply" && (
        <div style={{ maxWidth:520, margin:"0 auto", padding:"100px 24px", textAlign:"center" }}>
          <div style={{ width:80, height:80, borderRadius:"50%", background:P.lilaBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, margin:"0 auto 28px" }}>🤝</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:P.purple, marginBottom:14 }}>Solicitud enviada</h2>
          <p style={{ color:"#4A3560", fontSize:15, lineHeight:1.75, marginBottom:40 }}>El anfitrión recibirá tu solicitud y te contactará por teléfono. Si no hay respuesta en 24 horas, puedes llamarle directamente desde el perfil.</p>
          <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
            <button className="btn-primary" onClick={() => setView("listings")}>Ver más espacios</button>
            <button className="btn-outline" onClick={() => setView("home")}>Inicio</button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ background:P.purpleDk, color:"rgba(255,255,255,0.55)", padding:"40px 24px", textAlign:"center", marginTop:60 }}>
        <div className="flag" style={{ maxWidth:90, margin:"0 auto 28px", borderRadius:3, overflow:"hidden" }}>
          <div style={{ background:P.flagY, height:5 }} />
          <div style={{ background:P.flagB, height:5 }} />
          <div style={{ background:P.flagR, height:5 }} />
        </div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:"#fff", marginBottom:8 }}>Techo Venezuela</div>
        <p style={{ fontSize:13, marginBottom:12 }}>Red ciudadana de solidaridad. Gratuito. Sin fines de lucro. Solo venezolanos en Venezuela.</p>
        <p style={{ fontSize:12 }}>contacto@techovenezuela.org · Reportar problema · Emergencias: 0800-TECHO-VE</p>
      </footer>
    </div>
  );
}

function ListingCard({ listing, P, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      <div style={{ position:"relative" }}>
        <img src={listing.photos[0]} alt="espacio" style={{ width:"100%", height:195, objectFit:"cover" }} />
        {!listing.available && (
          <div style={{ position:"absolute", inset:0, background:"rgba(90,45,122,0.6)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontWeight:700 }}>No disponible</span>
          </div>
        )}
        <div style={{ position:"absolute", top:12, left:12 }}>
          <span className={`badge ${listing.badge==="Anfitrión Solidario" ? "badge-fuschia" : "badge-purple"}`}>{listing.badge}</span>
        </div>
      </div>
      <div style={{ padding:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:P.purple }}>{listing.roomType}</h3>
          <span style={{ fontSize:11, color:P.muted, whiteSpace:"nowrap", marginLeft:8 }}>{listing.maxDuration}</span>
        </div>
        <p style={{ color:P.muted, fontSize:12, margin:"4px 0 12px" }}>📍 {listing.zone} · {listing.estado}</p>
        <div style={{ display:"flex", gap:12, marginBottom:12 }}>
          <span style={{ fontSize:11, fontWeight:600, color:listing.hasElectricity?"#1A7A4A":P.coral }}>⚡ {listing.hasElectricity?"Luz":"Sin luz"}</span>
          <span style={{ fontSize:11, fontWeight:600, color:listing.hasWater?"#1A7A4A":P.coral }}>💧 {listing.hasWater?"Agua":"Sin agua"}</span>
          <span style={{ fontSize:11, fontWeight:600, color:listing.hasGas?"#1A7A4A":P.coral }}>🔥 {listing.hasGas?"Gas":"Sin gas"}</span>
        </div>
        <p style={{ color:"#4A3560", fontSize:13, lineHeight:1.6, marginBottom:14 }}>"{listing.story.slice(0,85)}..."</p>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontWeight:700, color:P.fuschia, fontSize:13 }}>— {listing.hostName}</span>
          <span style={{ fontSize:12, fontWeight:600, color:listing.available?"#1A7A4A":P.muted }}>{listing.available?"✅ Disponible":"⏸ Ocupado"}</span>
        </div>
      </div>
    </div>
  );
}
