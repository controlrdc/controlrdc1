import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Textarea } from './components/ui/textarea'
import { Label } from './components/ui/label'
import { Badge } from './components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Timer } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const emptyJob = () => ({
  id: crypto.randomUUID(),
  createdAt: new Date().toISOString(),
  status: 'Recibida',
  dueAt: '',
  estimateLabor: '',
  customer: { name: '', phone: '', email: '' },
  bike: { brand: '', model: '', color: '', serial: '' },
  services: [],
  parts: [],
  diagnosis: '',
  evaluation: '',
  recommendation: '',
  signature: '',
  photos: [],
})

const defaultParts = [
  { name: 'Cadena 11v', price: 25990 },
  { name: 'Pastillas freno disco (par)', price: 11990 },
  { name: 'Zapatas freno ruta (par)', price: 8990 },
  { name: 'Cable cambio', price: 3990 },
  { name: 'Funda cambio (metro)', price: 2990 },
  { name: 'Cámara 29\"', price: 5990 },
  { name: 'Cámara 700C', price: 5490 },
  { name: 'Líquido sellante (120ml)', price: 6990 },
  { name: 'Aceite cadena', price: 4990 },
]

const seedDemoJobs = () => {
  const now = new Date()
  const iso = (d) => new Date(d).toISOString()
  return [
    {
      ...emptyJob(),
      id: crypto.randomUUID(),
      createdAt: iso(new Date(now.getFullYear(), now.getMonth(), now.getDate()-1)),
      status: 'En Proceso',
      dueAt: iso(new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 17, 0)),
      customer: { name: 'Carla Soto', phone: '+569 9876 1111', email: 'carla@example.com' },
      bike: { brand: 'Trek', model: 'Marlin 7', color: 'Azul', serial: 'TRK12345' },
      services: ['Mantención completa', 'Ajuste de cambios'],
      parts: [{ name:'Cadena 11v', price:25990, qty:1 }, { name:'Cámara 29\"', price:5990, qty:2 }],
      diagnosis: 'Cadena gastada y ruedas descentradas.',
      evaluation: 'Cambiar cadena, cámara y centrado rápido.',
      recommendation: 'Revisar tensión de rayos en 2 meses.',
    },
    {
      ...emptyJob(),
      id: crypto.randomUUID(),
      createdAt: iso(now),
      status: 'Recibida',
      dueAt: iso(new Date(now.getFullYear(), now.getMonth(), now.getDate()+2, 12, 30)),
      customer: { name: 'Diego Rivas', phone: '+56 9 2222 3333', email: 'diego@example.com' },
      bike: { brand: 'Specialized', model: 'Rockhopper', color: 'Roja', serial: 'SPC99887' },
      services: ['Cambio de cadena'],
      parts: [{ name:'Cadena 11v', price:25990, qty:1 }],
      diagnosis: 'Cadena salta al pedalear fuerte.',
      evaluation: 'Reemplazo de cadena y ajuste fine-tuning.',
      recommendation: 'Limpiar transmisión cada 150 km.',
    },
    {
      ...emptyJob(),
      id: crypto.randomUUID(),
      createdAt: iso(new Date(now.getFullYear(), now.getMonth(), now.getDate()-3)),
      status: 'Lista',
      dueAt: iso(new Date(now.getFullYear(), now.getMonth(), now.getDate()-1, 18, 0)),
      customer: { name: 'María Pérez', phone: '+56 9 1234 5678', email: 'maria@example.com' },
      bike: { brand: 'Giant', model: 'Talon', color: 'Negra', serial: 'GNT77777' },
      services: ['Alineación de ruedas', 'Ajuste de cambios'],
      parts: [{ name:'Zapatas freno ruta (par)', price:8990, qty:1 }],
      diagnosis: 'Freno delantero gastado.',
      evaluation: 'Cambio de zapatas y ajuste de calipers.',
      recommendation: 'Revisar frenos cada 2 meses.',
    },
    {
      ...emptyJob(),
      id: crypto.randomUUID(),
      createdAt: iso(new Date(now.getFullYear(), now.getMonth(), now.getDate()-5)),
      status: 'Entregada',
      dueAt: iso(new Date(now.getFullYear(), now.getMonth(), now.getDate()-4, 16, 0)),
      customer: { name: 'Jorge Vidal', phone: '+56 9 4455 8899', email: 'jorge@example.com' },
      bike: { brand: 'Cannondale', model: 'Trail 5', color: 'Verde', serial: 'CNN55555' },
      services: ['Sangrado de frenos'],
      parts: [{ name:'Líquido sellante (120ml)', price:6990, qty:2 }],
      diagnosis: 'Maneta esponjosa.',
      evaluation: 'Sangrado completo.',
      recommendation: 'Cambiar líquido cada 10 meses.',
    },
    {
      ...emptyJob(),
      id: crypto.randomUUID(),
      createdAt: iso(new Date(now.getFullYear(), now.getMonth(), now.getDate()-2)),
      status: 'En Proceso',
      dueAt: iso(new Date(now.getFullYear(), now.getMonth(), now.getDate()+3, 10, 0)),
      customer: { name: 'Antonia León', phone: '+56 9 8765 4321', email: 'antonia@example.com' },
      bike: { brand: 'Scott', model: 'Scale 940', color: 'Gris', serial: 'SCT94000' },
      services: ['Mantención completa'],
      parts: [{ name:'Pastillas freno disco (par)', price:11990, qty:1 }, { name:'Aceite cadena', price:4990, qty:1 }],
      diagnosis: 'Transmisión ruidosa.',
      evaluation: 'Limpieza profunda y ajuste general.',
      recommendation: 'Lubricar cadena semanalmente.',
    },
  ]
}

export default function App(){
  const [jobs, setJobs] = useState(()=>{
    try {
      const raw = localStorage.getItem('bikeworkshop.jobs')
      if (raw) return JSON.parse(raw)
      const demo = seedDemoJobs()
      localStorage.setItem('bikeworkshop.jobs', JSON.stringify(demo))
      return demo
    } catch { return [] }
  })
  const [draft, setDraft] = useState(emptyJob)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todas')
  const [activeJobId, setActiveJobId] = useState(null)
  const [now, setNow] = useState(Date.now())
  const [activeTab, setActiveTab] = useState('ordenes')
  const [servicesCatalog, setServicesCatalog] = useState(()=>{
    try {
      const raw = localStorage.getItem('bikeworkshop.catalog.services')
      return raw? JSON.parse(raw): [
        { name: 'Ajuste de cambios', price: 8000 },
        { name: 'Alineación de ruedas', price: 10000 },
        { name: 'Cambio de cadena', price: 6000 },
        { name: 'Sangrado de frenos', price: 15000 },
        { name: 'Mantención completa', price: 35000 },
      ]
    } catch { return [] }
  })
  const [partsCatalog, setPartsCatalog] = useState(()=>{
    try { const raw = localStorage.getItem('bikeworkshop.catalog.parts'); return raw? JSON.parse(raw): defaultParts } catch { return defaultParts }
  })
  const printRef = useRef(null)

  useEffect(()=>{ const t = setInterval(()=>setNow(Date.now()), 60000); return ()=>clearInterval(t)},[])
  useEffect(()=>{ localStorage.setItem('bikeworkshop.jobs', JSON.stringify(jobs)) },[jobs])
  useEffect(()=>{ localStorage.setItem('bikeworkshop.catalog.services', JSON.stringify(servicesCatalog)) },[servicesCatalog])
  useEffect(()=>{ localStorage.setItem('bikeworkshop.catalog.parts', JSON.stringify(partsCatalog)) },[partsCatalog])

  const activeJob = useMemo(()=> jobs.find(j=> j.id===activeJobId) || null, [jobs, activeJobId])
  const filteredJobs = useMemo(()=>{
    const q = query.trim().toLowerCase()
    return jobs
      .filter(j => statusFilter==='Todas' ? true : j.status===statusFilter)
      .filter(j => {
        if(!q) return true
        const s = [j.customer.name, j.customer.phone, j.customer.email, j.bike.brand, j.bike.model, j.bike.serial, j.services.join(', ')].join(' ').toLowerCase()
        return s.includes(q)
      }).sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt))
  }, [jobs, query, statusFilter])

  const resetDraft = () => setDraft(emptyJob)
  const saveDraft = () => {
    if(!draft.customer.name || !draft.bike.brand){ alert('Ingresa al menos el nombre del cliente y la marca de la bici.'); return }
    setJobs(prev => prev.some(j=>j.id===draft.id) ? prev.map(j=> j.id===draft.id? draft: j) : [draft, ...prev])
    setActiveJobId(draft.id)
    setActiveTab('ordenes')
  }
  const deleteJob = (id) => {
    if(confirm('¿Eliminar esta orden?')){
      setJobs(prev => prev.filter(j=> j.id!==id))
      if(activeJobId===id) setActiveJobId(null)
    }
  }

  const addService = (srv) => srv && setDraft(d => ({...d, services: Array.from(new Set([...(d.services||[]), srv]))}))
  const removeService = (srv) => setDraft(d => ({...d, services: (d.services||[]).filter(s=> s!==srv)}))
  const addPart = (p) => {
    if(!p?.name || !p?.price) return
    setDraft(d => {
      const ex = (d.parts||[]).find(i=> i.name===p.name)
      if(ex) return {...d, parts: d.parts.map(i=> i.name===p.name? {...i, qty:(i.qty||1)+1 }: i)}
      return {...d, parts: [...(d.parts||[]), {...p, qty:1}]}
    })
  }
  const updatePartQty = (name, qty) => setDraft(d => ({...d, parts: (d.parts||[]).map(i=> i.name===name? {...i, qty: Math.max(1, Number(qty)||1)}: i)}))
  const removePart = (name) => setDraft(d => ({...d, parts: (d.parts||[]).filter(i=> i.name!==name)}))

  const exportPDF = async (job) => {
    const node = printRef.current; if(!node) return;
    const canvas = await html2canvas(node, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation:'p', unit:'pt', format:'a4' })
    const pageWidth = pdf.internal.pageSize.getWidth(); const pageHeight = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
    const w = canvas.width * ratio; const h = canvas.height * ratio; const x = (pageWidth - w)/2; const y=20;
    pdf.addImage(imgData, 'PNG', x, y, w, h); pdf.save(`Orden-${job.id.slice(0,6)}.pdf`)
  }

  const shareText = (job) => {
    const partsTotal = (job.parts || []).reduce((acc, p) => acc + p.price * (p.qty || 1), 0);
    const labor = Number(job.estimateLabor || 0);
    const total = partsTotal + labor;
    return [
      'Bike Workshop Manager RDC',
      `Orden ${job.id.slice(0,6)} – ${job.status}`,
      `Cliente: ${job.customer.name}`,
      job.customer.phone ? `Tel: ${job.customer.phone}` : null,
      `Bici: ${job.bike.brand} ${job.bike.model}`,
      job.dueAt ? `Entrega: ${new Date(job.dueAt).toLocaleString()}` : null,
      `Servicios: ${(job.services || []).join(', ') || '—'}`,
      `Repuestos: ${(job.parts || []).map(p=>`${p.name} x${p.qty}`).join(', ') || '—'}`,
      `Mano de obra: $${labor.toLocaleString('es-CL')}`,
      `Total estimado: $${total.toLocaleString('es-CL')} CLP`,
    ].filter(Boolean).join("\\n");
  }

  const sanitizePhone = (s) => (s||'').replace(/[^\\d]/g,'')
  const openWhatsApp = (job) => {
    const text = shareText(job)
    const phone = sanitizePhone(job.customer.phone)
    const base = phone ? `https://wa.me/${phone}?text=` : `https://wa.me/?text=`
    window.open(base + encodeURIComponent(text), '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bike Workshop Manager RDC</h1>
            <p className="text-sm text-slate-500">MVP local • Con datos de demo • WhatsApp habilitado</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={()=>{ resetDraft(); setActiveTab('nueva'); }}>Nueva orden</Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ordenes">Órdenes</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="nueva">Nueva</TabsTrigger>
          </TabsList>

          <TabsContent value="ordenes">
            <OrdersSection
              filteredJobs={filteredJobs}
              activeJobId={activeJobId}
              setActiveJobId={setActiveJobId}
              setDraft={setDraft}
              deleteJob={deleteJob}
              now={now}
              query={query}
              setQuery={setQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              activeJob={activeJob}
              exportPDF={exportPDF}
              printRef={printRef}
              openWhatsApp={openWhatsApp}
            />
          </TabsContent>

          <TabsContent value="agenda">
            <AgendaSection jobs={jobs} setActiveTab={setActiveTab} setActiveJobId={setActiveJobId}
              onReschedule={(id, date)=>{
                setJobs(prev => prev.map(j=> j.id===id? {...j, dueAt: new Date(date).toISOString() }: j))
                setActiveTab('ordenes'); setActiveJobId(id)
              }} />
          </TabsContent>

          <TabsContent value="nueva">
            <OrderForm
              draft={draft}
              setDraft={setDraft}
              servicesCatalog={servicesCatalog}
              setServicesCatalog={setServicesCatalog}
              partsCatalog={partsCatalog}
              setPartsCatalog={setPartsCatalog}
              addService={addService}
              removeService={removeService}
              addPart={addPart}
              updatePartQty={updatePartQty}
              removePart={removePart}
              onSave={saveDraft}
            />
          </TabsContent>
        </Tabs>
      </div>
      {/* Área oculta para imprimir PDF */}
      <div className="hidden"><Printable job={activeJob || draft} ref={printRef} /></div>
    </div>
  )
}

function OrdersSection({ filteredJobs, activeJobId, setActiveJobId, setDraft, deleteJob, now, query, setQuery, statusFilter, setStatusFilter, activeJob, exportPDF, printRef, openWhatsApp }){
  return <>
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="md:col-span-6">
            <Input className="pl-3" placeholder="Buscar por cliente, teléfono, serie, servicio..." value={query} onChange={(e)=>setQuery(e.target.value)} />
          </div>
          <div className="md:col-span-3">
            <select className="w-full rounded-2xl border px-3 py-2 text-sm" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
              {['Todas','Recibida','En Proceso','Lista','Entregada'].map(s=> <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="md:col-span-3 text-right">
            <span className="text-sm text-slate-500">{filteredJobs.length} órdenes</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        {filteredJobs.map(job => (
          <Card key={job.id} className={`transition hover:shadow ${activeJobId===job.id? 'ring-2 ring-slate-300':''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">{job.customer.name || '—'} • {job.bike.brand} {job.bike.model}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{job.status}</Badge>
                {job.dueAt && <DueChip dueAt={job.dueAt} now={now} />}
                <Button size="sm" onClick={()=> { setDraft(job); setActiveJobId(job.id); }}>Editar</Button>
                <Button size="sm" onClick={()=> setActiveJobId(job.id)}>Ver</Button>
                <Button size="sm" variant="ghost" onClick={()=> deleteJob(job.id)}>Eliminar</Button>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              <div className="flex flex-wrap gap-2">
                {job.services?.map(s => <Badge key={s}>{s}</Badge>)}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-5">
                <Info label="Cliente" value={`${job.customer.name} ${job.customer.phone? '• '+job.customer.phone:''}`} />
                <Info label="Bicicleta" value={`${job.bike.brand} ${job.bike.model}`} />
                <Info label="Serie" value={job.bike.serial || '—'} />
                <Info label="Entrega" value={job.dueAt ? new Date(job.dueAt).toLocaleString() : '—'} />
                <Info label="Mano de obra" value={job.estimateLabor ? `$${Number(job.estimateLabor).toLocaleString('es-CL')}` : '—'} />
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredJobs.length===0 && <Card><CardContent className="p-6 text-center text-slate-500">Sin órdenes aún. Crea la primera en la pestaña “Nueva”.</CardContent></Card>}
      </div>

      <div className="space-y-3">
        <Card>
          <CardHeader><CardTitle>Detalle / Compartir</CardTitle></CardHeader>
          <CardContent>
            {!activeJob && <p className="text-sm text-slate-500">Selecciona una orden…</p>}
            {activeJob && <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{activeJob.customer.name}</p>
                  <p className="text-xs text-slate-500">{new Date(activeJob.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{activeJob.status}</Badge>
                  {activeJob.dueAt && <DueChip dueAt={activeJob.dueAt} now={now}/>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <Info label="Teléfono" value={activeJob.customer.phone || '—'} />
                <Info label="Correo" value={activeJob.customer.email || '—'} />
                <Info label="Bici" value={`${activeJob.bike.brand} ${activeJob.bike.model}`} />
                <Info label="Color" value={activeJob.bike.color || '—'} />
                <Info label="Serie" value={activeJob.bike.serial || '—'} />
                <Info label="Entrega" value={activeJob.dueAt ? new Date(activeJob.dueAt).toLocaleString() : '—'} />
              </div>

              <Totals job={activeJob} />

              <div className="flex flex-wrap gap-2">
                <Button onClick={()=>exportPDF(activeJob)}>Orden PDF</Button>
                <Button variant="secondary" onClick={()=>openWhatsApp(activeJob)}>WhatsApp</Button>
              </div>
            </div>}
          </CardContent>
        </Card>
      </div>
    </div>
  </>
}

function AgendaSection({ jobs, setActiveTab, setActiveJobId, onReschedule }){
  const [cursor, setCursor] = useState(new Date())
  const startOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  const endOfMonth = new Date(cursor.getFullYear(), cursor.getMonth()+1, 0)
  const startDay = new Date(startOfMonth); startDay.setDate(startOfMonth.getDate() - (startOfMonth.getDay()||7)+1)
  const days = []; for(let d=new Date(startDay); d<=endOfMonth || d.getDay()!==1; d.setDate(d.getDate()+1)){ days.push(new Date(d)); if(days.length>42) break }
  const byDate = (date) => jobs.filter(j => j.dueAt && j.dueAt.slice(0,10) === date.toISOString().slice(0,10))

  const goToday=()=>setCursor(new Date())
  const prevMonth=()=>setCursor(new Date(cursor.getFullYear(), cursor.getMonth()-1,1))
  const nextMonth=()=>setCursor(new Date(cursor.getFullYear(), cursor.getMonth()+1,1))

  const weekStart = new Date(cursor); weekStart.setDate(cursor.getDate() - ((cursor.getDay()||7)-1))
  const weekDays = Array.from({length:7}, (_,i)=> new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate()+i))

  return <div className="grid grid-cols-1 gap-4">
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Agenda mensual</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={prevMonth}>←</Button>
          <Button variant="outline" onClick={goToday}>Hoy</Button>
          <Button variant="outline" onClick={nextMonth}>→</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2 text-sm text-slate-500">{cursor.toLocaleString(undefined,{month:'long',year:'numeric'})}</div>
        <div className="grid grid-cols-7 text-center text-xs uppercase tracking-wide text-slate-400">
          {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d=> <div key={d} className="py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((d, idx)=>{
            const items = byDate(d); const isToday = new Date().toDateString() === d.toDateString()
            return <div key={idx} className={`rounded-xl border p-2 ${isToday? 'ring-2 ring-slate-300':''}`}
              onDragOver={(e)=>e.preventDefault()}
              onDrop={(e)=>{ const id = e.dataTransfer.getData('text/job-id'); if(id){ onReschedule?.(id, new Date(d)); } }}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium">{d.getDate()}</span>
                {items.length>0 && <span className="rounded bg-slate-100 px-1">{items.length}</span>}
              </div>
              <div className="space-y-1">
                {items.slice(0,3).map(j=> <button key={j.id} draggable onDragStart={(e)=> e.dataTransfer.setData('text/job-id', j.id)} onClick={()=>{ setActiveJobId(j.id); setActiveTab('ordenes'); }} className={`block w-full truncate rounded px-2 py-1 text-left text-[11px] ${statusBg(j.status)}`}>
                  {j.customer.name} • {j.bike.brand}
                </button>)}
                {items.length>3 && <div className="text-[11px] text-slate-400">+{items.length-3} más…</div>}
              </div>
            </div>
          })}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Agenda semanal</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((d,i)=>{
            const items = byDate(d)
            return <div key={i} className="rounded-xl border p-2"
              onDragOver={(e)=>e.preventDefault()}
              onDrop={(e)=>{ const id = e.dataTransfer.getData('text/job-id'); if(id){ onReschedule?.(id, new Date(d)); } }}>
              <div className="mb-1 text-xs font-medium">{d.toLocaleDateString(undefined,{weekday:'short', day:'numeric'})}</div>
              <div className="space-y-1">
                {items.length===0 && <div className="text-[11px] text-slate-400">Sin trabajos</div>}
                {items.map(j=> <button key={j.id} draggable onDragStart={(e)=> e.dataTransfer.setData('text/job-id', j.id)} onClick={()=>{ setActiveJobId(j.id); setActiveTab('ordenes'); }} className={`block w-full truncate rounded px-2 py-1 text-left text-[11px] ${statusBg(j.status)}`}>
                  {j.customer.name} • {j.bike.brand} {j.bike.model}
                </button>)}
              </div>
            </div>
          })}
        </div>
      </CardContent>
    </Card>
  </div>
}

function statusBg(status){
  switch(status){
    case 'Recibida': return 'bg-slate-100'
    case 'En Proceso': return 'bg-amber-100'
    case 'Lista': return 'bg-emerald-100'
    case 'Entregada': return 'bg-blue-100'
    default: return 'bg-slate-100'
  }
}

function Info({ label, value }){
  return <div><p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p><p className="text-sm text-slate-700">{value}</p></div>
}

function Totals({ job }){
  const partsTotal = (job.parts||[]).reduce((acc,p)=> acc + p.price*(p.qty||1), 0)
  const labor = Number(job.estimateLabor||0)
  const total = partsTotal + labor
  return <div className="rounded-xl border p-3 text-sm">
    <div className="grid grid-cols-3 gap-2">
      <div className="font-medium">Total repuestos</div>
      <div className="col-span-2 text-right">{partsTotal.toLocaleString('es-CL')} CLP</div>
      <div className="font-medium">Mano de obra</div>
      <div className="col-span-2 text-right">{labor.toLocaleString('es-CL')} CLP</div>
      <div className="font-semibold">Total estimado</div>
      <div className="col-span-2 text-right font-semibold">{total.toLocaleString('es-CL')} CLP</div>
    </div>
  </div>
}

const Printable = React.forwardRef(function Printable({ job }, ref){
  const partsTotal = (job.parts||[]).reduce((acc,p)=> acc + p.price*(p.qty||1), 0)
  const labor = Number(job.estimateLabor||0)
  return <div ref={ref} className="w-[794px] bg-white p-6 text-slate-800">
    <div className="flex items-center justify-between">
      <div><h2 className="text-2xl font-bold">Orden de Servicio</h2><p className="text-xs text-slate-500">ID: {job.id}</p></div>
      <div className="text-right"><p className="text-sm">Fecha: {new Date(job.createdAt).toLocaleDateString()}</p><p className="text-sm">Estado: {job.status}</p>{job.dueAt && <p className="text-sm">Entrega: {new Date(job.dueAt).toLocaleString()}</p>}</div>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
      <div className="rounded-xl border p-3">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Cliente</h3>
        <p><span className="font-medium">Nombre:</span> {job.customer.name || '—'}</p>
        <p><span className="font-medium">Teléfono:</span> {job.customer.phone || '—'}</p>
        <p><span className="font-medium">Correo:</span> {job.customer.email || '—'}</p>
      </div>
      <div className="rounded-xl border p-3">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Bicicleta</h3>
        <p><span className="font-medium">Marca/Modelo:</span> {job.bike.brand} {job.bike.model}</p>
        <p><span className="font-medium">Color:</span> {job.bike.color || '—'}</p>
        <p><span className="font-medium">Nº Serie:</span> {job.bike.serial || '—'}</p>
      </div>
    </div>
    <div className="mt-4 rounded-xl border p-3 text-sm">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Servicios</h3>
      <ul className="list-inside list-disc">
        {(job.services&&job.services.length>0)? job.services.map((s,i)=><li key={i}>{s}</li>): <li>—</li>}
      </ul>
    </div>
    <div className="mt-4 rounded-xl border p-3 text-sm">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Repuestos</h3>
      {(job.parts||[]).length===0? <p>—</p> : <table className="w-full text-sm"><thead><tr className="text-left text-xs text-slate-500"><th className="py-1">Ítem</th><th className="py-1">Precio</th><th className="py-1">Cant.</th><th className="py-1 text-right">Subtotal</th></tr></thead><tbody>{(job.parts||[]).map((p,i)=>(<tr key={i} className="border-t"><td className="py-1">{p.name}</td><td className="py-1">{p.price.toLocaleString('es-CL')}</td><td className="py-1">{p.qty}</td><td className="py-1 text-right">{(p.price*p.qty).toLocaleString('es-CL')}</td></tr>))}</tbody></table>}
    </div>
    <div className="mt-4 flex items-center justify-between rounded-xl border p-3 text-sm">
      <div className="space-y-1">
        <p><span className="font-medium">Total repuestos:</span> {partsTotal.toLocaleString('es-CL')} CLP</p>
        <p><span className="font-medium">Mano de obra:</span> {Number(job.estimateLabor||0).toLocaleString('es-CL')} CLP</p>
        <p className="text-base font-semibold"><span>Total estimado:</span> {(partsTotal+Number(job.estimateLabor||0)).toLocaleString('es-CL')} CLP</p>
      </div>
    </div>
  </div>
})

function DueChip({ dueAt, now }){
  const ms = new Date(dueAt).getTime() - now
  const overdue = ms < 0; const abs = Math.abs(ms)
  const days = Math.floor(abs/(1000*60*60*24))
  const hours = Math.floor((abs/(1000*60*60))%24)
  const minutes = Math.floor((abs/(1000*60))%60)
  return <Badge variant={overdue? 'destructive':'secondary'} className="flex items-center gap-1">
    <Timer className="h-3.5 w-3.5" />
    {overdue? 'Vencida':'Faltan'} {days}d {hours}h {minutes}m
  </Badge>
}

function Field({ label, children, className='' }){
  return <div className={className}><Label className="mb-1 block text-xs text-slate-500">{label}</Label>{children}</div>
}

function OrderForm({ draft, setDraft, servicesCatalog, setServicesCatalog, partsCatalog, setPartsCatalog, addService, removeService, addPart, updatePartQty, removePart, onSave }){
  const [partQuery, setPartQuery] = useState('')
  const [serviceQuery, setServiceQuery] = useState('')
  const partsFiltered = useMemo(()=> partsCatalog.filter(p=> !partQuery || p.name.toLowerCase().includes(partQuery.toLowerCase())), [partQuery, partsCatalog])
  const servicesFiltered = useMemo(()=> servicesCatalog.filter(s=> !serviceQuery || s.name.toLowerCase().includes(serviceQuery.toLowerCase())), [serviceQuery, servicesCatalog])

  const addServiceToCatalog = (name, price)=> name && setServicesCatalog(prev=> [...prev, { name, price: Number(price)||0 }])
  const updateServicePrice = (name, price)=> setServicesCatalog(prev=> prev.map(s=> s.name===name? {...s, price: Number(price)||0 }: s))
  const removeServiceFromCatalog = (name)=> setServicesCatalog(prev=> prev.filter(s=> s.name!==name))
  const addPartToCatalog = (name, price)=> name && setPartsCatalog(prev=> [...prev, { name, price: Number(price)||0 }])

  return <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardHeader><CardTitle className="text-base">Cliente</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Field label="Nombre"><Input value={draft.customer.name} onChange={(e)=>setDraft({ ...draft, customer: { ...draft.customer, name: e.target.value } })} /></Field>
          <Field label="Teléfono (para WhatsApp)"><Input value={draft.customer.phone} onChange={(e)=>setDraft({ ...draft, customer: { ...draft.customer, phone: e.target.value } })} /></Field>
          <Field label="Correo"><Input type="email" value={draft.customer.email} onChange={(e)=>setDraft({ ...draft, customer: { ...draft.customer, email: e.target.value } })} /></Field>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader><CardTitle className="text-base">Bicicleta</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-6">
          <Field label="Marca"><Input value={draft.bike.brand} onChange={(e)=>setDraft({ ...draft, bike: { ...draft.bike, brand: e.target.value } })} /></Field>
          <Field label="Modelo"><Input value={draft.bike.model} onChange={(e)=>setDraft({ ...draft, bike: { ...draft.bike, model: e.target.value } })} /></Field>
          <Field label="Color"><Input value={draft.bike.color} onChange={(e)=>setDraft({ ...draft, bike: { ...draft.bike, color: e.target.value } })} /></Field>
          <Field label="Nº Serie"><Input value={draft.bike.serial} onChange={(e)=>setDraft({ ...draft, bike: { ...draft.bike, serial: e.target.value } })} /></Field>
          <Field label="Estado">
            <select className="w-full rounded-2xl border px-3 py-2 text-sm" value={draft.status} onChange={(e)=>setDraft({ ...draft, status: e.target.value })}>
              {['Recibida','En Proceso','Lista','Entregada'].map(s=> <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Entrega (fecha y hora)"><Input type="datetime-local" value={draft.dueAt? new Date(draft.dueAt).toISOString().slice(0,16): ''} onChange={(e)=>setDraft({ ...draft, dueAt: e.target.value? new Date(e.target.value).toISOString(): '' })} /></Field>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader><CardTitle className="text-base">Servicios de la orden</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2"><Input placeholder="Buscar servicio..." value={serviceQuery} onChange={(e)=>setServiceQuery(e.target.value)} /></div>
          <div className="flex flex-wrap gap-2">
            {servicesFiltered.map(s => <Button key={s.name} variant={(draft.services||[]).includes(s.name)? 'default':'outline'} size="sm" onClick={()=> (draft.services||[]).includes(s.name)? removeService(s.name) : addService(s.name)}>{s.name} {s.price? `(${s.price.toLocaleString('es-CL')})`: ''}</Button>)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Catálogo de servicios (editable)</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {servicesCatalog.map(s => <div key={s.name} className="grid grid-cols-7 items-center gap-2">
            <div className="col-span-4 truncate">{s.name}</div>
            <div><Input className="h-8 w-24" inputMode="numeric" value={s.price} onChange={(e)=>updateServicePrice(s.name, e.target.value)} /></div>
            <div className="col-span-2 text-right"><Button size="sm" variant="outline" onClick={()=>addService(s.name)}>Usar</Button><Button size="sm" variant="ghost" onClick={()=> removeServiceFromCatalog(s.name)}>Quitar</Button></div>
          </div>)}
          <div className="mt-2 grid grid-cols-7 items-center gap-2">
            <Input className="col-span-4" placeholder="Nuevo servicio" id="new-serv-name" />
            <Input className="w-24" placeholder="$" inputMode="numeric" id="new-serv-price" />
            <div className="col-span-2 text-right"><Button size="sm" onClick={()=>{
              const n=document.getElementById('new-serv-name').value; const p=document.getElementById('new-serv-price').value; addServiceToCatalog(n,p); document.getElementById('new-serv-name').value=''; document.getElementById('new-serv-price').value='';
            }}>Agregar</Button></div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader><CardTitle className="text-base">Catálogo de repuestos</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-2 flex items-center gap-2"><Input placeholder="Buscar repuesto..." value={partQuery} onChange={(e)=>setPartQuery(e.target.value)} /></div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {partsFiltered.map(p => <div key={p.name} className="flex items-center justify-between rounded-xl border p-2 text-sm"><div><p className="font-medium">{p.name}</p><p className="text-xs text-slate-500">{p.price.toLocaleString('es-CL')} CLP</p></div><Button size="sm" onClick={()=>addPart(p)}>Agregar</Button></div>)}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Input placeholder="Nuevo repuesto" id="new-part-name" />
            <Input placeholder="Precio" inputMode="numeric" id="new-part-price" className="w-28" />
            <Button onClick={()=>{ const name=document.getElementById('new-part-name').value; const price=document.getElementById('new-part-price').value; addPartToCatalog(name, price); document.getElementById('new-part-name').value=''; document.getElementById('new-part-price').value=''; }}>Agregar repuesto</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Repuestos en la orden</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {(draft.parts||[]).length===0 && <p className="text-slate-500">Sin repuestos.</p>}
          {(draft.parts||[]).map(i => <div key={i.name} className="grid grid-cols-7 items-center gap-2">
            <div className="col-span-3">{i.name}</div>
            <div className="text-right">{i.price.toLocaleString('es-CL')}</div>
            <div className="col-span-2 flex items-center gap-2"><Label className="text-xs">Cant.</Label><Input className="h-8 w-16" inputMode="numeric" value={i.qty} onChange={(e)=>updatePartQty(i.name, e.target.value)} /></div>
            <Button size="sm" variant="ghost" onClick={()=>removePart(i.name)}>Quitar</Button>
          </div>)}
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="md:col-span-1"><CardHeader><CardTitle className="text-base">Diagnóstico</CardTitle></CardHeader><CardContent><Textarea rows={6} value={draft.diagnosis} onChange={(e)=>setDraft({ ...draft, diagnosis: e.target.value })} placeholder="Observaciones iniciales, fallas detectadas..." /></CardContent></Card>
      <Card className="md:col-span-1"><CardHeader><CardTitle className="text-base">Evaluación</CardTitle></CardHeader><CardContent><Textarea rows={6} value={draft.evaluation} onChange={(e)=>setDraft({ ...draft, evaluation: e.target.value })} placeholder="Trabajo requerido, prioridad, repuestos..." /></CardContent></Card>
      <Card className="md:col-span-1"><CardHeader><CardTitle className="text-base">Recomendación</CardTitle></CardHeader><CardContent><Textarea rows={6} value={draft.recommendation} onChange={(e)=>setDraft({ ...draft, recommendation: e.target.value })} placeholder="Consejos de mantenimiento, próximos servicios..." /></CardContent></Card>
    </div>

    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={()=>{ setDraft(emptyJob()); }}>Limpiar</Button>
      <Button onClick={onSave}>Guardar orden</Button>
    </div>
  </div>
}

export { }
