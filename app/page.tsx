'use client'
import { useState, useRef } from 'react'

const initialPovinnosti = [
  { id:1,  title:'Revize el. zařízení', cat:'Revize', date:'15. 4.', person:'Jana N.', status:'overdue', done:false },
  { id:2,  title:'Školení BOZP', cat:'BOZP', date:'18. 4.', person:'Petr K.', status:'warning', done:false },
  { id:3,  title:'Kontrola lékárničky', cat:'BOZP', date:'22. 4.', person:'Jana N.', status:'warning', done:false },
  { id:4,  title:'Smlouva – úklid prostor', cat:'Smlouvy', date:'30. 4.', person:'Jana N.', status:'normal', done:false },
  { id:5,  title:'Kontrola chladničky na léky', cat:'Legislativa', date:'30. 4.', person:'Marie H.', status:'done', done:true },
  { id:13, title:'Záznamy teplot – duben', cat:'BOZP', date:'30. 4.', person:'Marie H.', status:'warning', done:false },
  { id:15, title:'Školení GDPR – noví zaměstnanci', cat:'Legislativa', date:'30. 4.', person:'Petr K.', status:'normal', done:false },
  { id:6,  title:'GDPR – záznamy zpracování', cat:'Legislativa', date:'1. 5.', person:'Petr K.', status:'done', done:true },
  { id:7,  title:'Hasicí přístroje – revize', cat:'PO', date:'15. 5.', person:'Jana N.', status:'done', done:true },
  { id:8,  title:'Smlouva – IT podpora', cat:'Smlouvy', date:'15. 5.', person:'Petr K.', status:'normal', done:false },
  { id:17, title:'Revize – hasicí přístroje 2026', cat:'Revize', date:'15. 5.', person:'Jana N.', status:'done', done:true },
  { id:9,  title:'Certifikát hygieny pracoviště', cat:'Legislativa', date:'20. 5.', person:'Petr K.', status:'normal', done:false },
  { id:10, title:'Školení PO – zaměstnanci', cat:'PO', date:'25. 5.', person:'Jana N.', status:'normal', done:false },
  { id:11, title:'Revize vzduchotechniky', cat:'Revize', date:'1. 6.', person:'Jana N.', status:'normal', done:false },
  { id:12, title:'Pojistná smlouva – obnova', cat:'Smlouvy', date:'5. 6.', person:'Jana N.', status:'normal', done:false },
  { id:14, title:'Smlouva – odvoz odpadu', cat:'Smlouvy', date:'10. 6.', person:'Marie H.', status:'normal', done:false },
  { id:16, title:'Evakuační cvičení', cat:'PO', date:'20. 6.', person:'Jana N.', status:'done', done:true },
]

const sampleDocs = [
  { id:1,  name:'Revizní zpráva – el. zařízení 2024', cat:'Revize', ext:'PDF', by:'Jana N.', date:'10. 3. 2024', validity:'15. 4. 2026', state:'expired', size:'1.2 MB', real:false },
  { id:2,  name:'Školení BOZP – prezenční listina', cat:'BOZP', ext:'PDF', by:'Petr K.', date:'2. 4. 2026', validity:'2. 4. 2027', state:'ok', size:'0.8 MB', real:false },
  { id:3,  name:'Smlouva – úklid prostor 2025', cat:'Smlouvy', ext:'PDF', by:'Jana N.', date:'1. 5. 2025', validity:'30. 4. 2026', state:'expiring', size:'0.5 MB', real:false },
  { id:4,  name:'GDPR – záznam o zpracování', cat:'Legislativa', ext:'DOCX', by:'Petr K.', date:'28. 3. 2026', validity:'—', state:'ok', size:'0.3 MB', real:false },
  { id:5,  name:'Požární evakuační plán', cat:'PO', ext:'PDF', by:'Jana N.', date:'5. 1. 2026', validity:'5. 1. 2028', state:'ok', size:'2.1 MB', real:false },
  { id:6,  name:'Smlouva – IT podpora 2026', cat:'Smlouvy', ext:'PDF', by:'Jana N.', date:'15. 1. 2026', validity:'15. 1. 2027', state:'ok', size:'0.4 MB', real:false },
  { id:7,  name:'Pracovní řád lékárny', cat:'Legislativa', ext:'DOCX', by:'Jana N.', date:'1. 6. 2025', validity:'—', state:'ok', size:'0.6 MB', real:false },
  { id:8,  name:'Kontrolní list – chladnička', cat:'BOZP', ext:'XLSX', by:'Marie H.', date:'31. 3. 2026', validity:'31. 3. 2027', state:'ok', size:'0.2 MB', real:false },
  { id:9,  name:'Revize – hasicí přístroje 2025', cat:'Revize', ext:'PDF', by:'Jana N.', date:'15. 5. 2025', validity:'15. 5. 2026', state:'expiring', size:'1.0 MB', real:false },
  { id:10, name:'Hygiena – certifikát pracoviště', cat:'Legislativa', ext:'PDF', by:'Marie H.', date:'20. 11. 2024', validity:'20. 11. 2026', state:'ok', size:'0.7 MB', real:false },
  { id:11, name:'Smlouva – dodavatel léků 2026', cat:'Smlouvy', ext:'PDF', by:'Jana N.', date:'1. 1. 2026', validity:'31. 12. 2026', state:'ok', size:'0.9 MB', real:false },
  { id:12, name:'Školení PO – prezenční listina', cat:'PO', ext:'PDF', by:'Petr K.', date:'10. 2. 2026', validity:'10. 2. 2027', state:'ok', size:'0.5 MB', real:false },
]

const catColor: Record<string,string> = { Revize:'#E8E0FF', BOZP:'#D1FAE5', Smlouvy:'#DBEAFE', Legislativa:'#FEF3C7', PO:'#FFE4E6' }
const catText: Record<string,string> = { Revize:'#534AB7', BOZP:'#065f46', Smlouvy:'#1e40af', Legislativa:'#92400e', PO:'#991b1b' }
const extIcon: Record<string,string> = { PDF:'📄', DOCX:'📝', XLSX:'📊' }

const profiles = [
  { id:1, name:'Jana Nováková', initials:'JN', role:'Vedoucí lékárník', email:'jana@naklid.cz', color:'#534AB7' },
  { id:2, name:'Petr Kovář', initials:'PK', role:'Lékárník', email:'petr@naklid.cz', color:'#1D9E75' },
  { id:3, name:'Marie Horáková', initials:'MH', role:'Asistentka', email:'marie@naklid.cz', color:'#EF9F27' },
]

const plans = [
  { id:'starter', name:'Starter', price:'Zdarma', period:'navždy', desc:'Pro začátek', features:['1 firma','20 povinností','E-mail notifikace','Základní archiv'], highlight:false },
  { id:'business', name:'Business', price:'499 Kč', period:'/měsíc', desc:'Nejoblíbenější', features:['Neomezené povinnosti','Oborové moduly','Správa odpovědností','Předávání agendy','Legislativní monitoring'], highlight:true },
  { id:'enterprise', name:'Enterprise', price:'1 490 Kč', period:'/měsíc', desc:'Pro větší firmy', features:['Více firem/poboček','White-label','SSO přihlášení','API přístup','Dedikovaná podpora'], highlight:false },
]

const predavaniHistory = [
  { id:1, od:'Karel Beneš', na:'Jana Nováková', datum:'Leden 2025', stav:'done' },
  { id:2, od:'—', na:'Marie Horáková', datum:'Září 2024', stav:'done', pozn:'Nástup nové asistentky' },
]

const predavaniChecklist = [
  { id:1, label:'Soupis aktivních povinností předán', done:true },
  { id:2, label:'Přístupy k dokumentům sdíleny', done:true },
  { id:3, label:'Přiřazení nástupce k povinnostem', done:false },
  { id:4, label:'Školení BOZP absolvováno', done:false },
  { id:5, label:'Předání klíčů a přístupových karet', done:false },
  { id:6, label:'Závěrečné schválení vedoucím', done:false },
]

type Doc = { id:number, name:string, cat:string, ext:string, by:string, date:string, validity:string, state:string, size:string, real:boolean, url?:string }

export default function Home() {
  const [items, setItems] = useState(initialPovinnosti)
  const [docs, setDocs] = useState<Doc[]>(sampleDocs)
  const [activePage, setActivePage] = useState('dashboard')
  const [filter, setFilter] = useState('vse')
  const [docSearch, setDocSearch] = useState('')
  const [docCat, setDocCat] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showProfileSwitch, setShowProfileSwitch] = useState(false)
  const [activeProfileId, setActiveProfileId] = useState(1)
  const [newTitle, setNewTitle] = useState('')
  const [newCat, setNewCat] = useState('BOZP')
  const [newDate, setNewDate] = useState('')
  const [newPerson, setNewPerson] = useState('Jana Nováková')
  const [activePlan, setActivePlan] = useState('business')
  const [firma, setFirma] = useState('Lékárna U Koruny s.r.o.')
  const [ico, setIco] = useState('12345678')
  const [modul, setModul] = useState('Lékárna')
  const [profileSaved, setProfileSaved] = useState(false)
  const [notifSide, setNotifSide] = useState<'left'|'right'>('right')
  const [dragOver, setDragOver] = useState(false)
  const [uploadCat, setUploadCat] = useState('BOZP')
  const [uploadValidity, setUploadValidity] = useState('')
  const [uploadFile, setUploadFile] = useState<File|null>(null)
  const [checklistItems, setChecklistItems] = useState(predavaniChecklist)
  const [predavaniOdchod, setPredavaniOdchod] = useState('Petr Kovář')
  const [predavaniNastupce, setPredavaniNastupce] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0]

  const toggle = (id: number) => {
    setItems(prev => prev.map(p => {
      if (p.id !== id) return p
      const done = !p.done
      return { ...p, done, status: done ? 'done' : (id === 1 ? 'overdue' : id <= 3 || id === 13 ? 'warning' : 'normal') }
    }))
  }

  const addPovinnost = () => {
    if (!newTitle.trim()) return
    const parts = newPerson.split(' ')
    setItems(prev => [...prev, { id:Date.now(), title:newTitle, cat:newCat, date:newDate||'—', person:parts[0]+' '+parts[1]?.[0]+'.', status:'normal', done:false }])
    setNewTitle(''); setNewDate(''); setShowModal(false)
  }

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) setUploadFile(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setUploadFile(file)
  }

  const uploadDoc = () => {
    if (!uploadFile) return
    const ext = uploadFile.name.split('.').pop()?.toUpperCase() || 'PDF'
    const url = URL.createObjectURL(uploadFile)
    const today = new Date().toLocaleDateString('cs-CZ', { day:'numeric', month:'numeric', year:'numeric' })
    const newDoc: Doc = {
      id: Date.now(),
      name: uploadFile.name.replace(/\.[^/.]+$/, ''),
      cat: uploadCat,
      ext,
      by: activeProfile.name.split(' ')[0] + ' ' + activeProfile.name.split(' ')[1][0] + '.',
      date: today,
      validity: uploadValidity || '—',
      state: 'ok',
      size: (uploadFile.size / 1024 / 1024).toFixed(1) + ' MB',
      real: true,
      url,
    }
    setDocs(prev => [newDoc, ...prev])
    setUploadFile(null); setUploadValidity(''); setShowUploadModal(false)
  }

  const toggleChecklist = (id: number) => {
    setChecklistItems(prev => prev.map(c => c.id === id ? {...c, done: !c.done} : c))
  }

  const [predavaniDone, setPredavaniDone] = useState(false)
  const [predavaniLog, setPredavaniLog] = useState<{od:string,na:string,datum:string}[]>([])

  const potvrditPredavani = () => {
    if (!predavaniNastupce.trim()) return
    const odProfile = profiles.find(p => p.name === predavaniOdchod)
    const odShort = odProfile ? odProfile.name.split(' ')[0] + ' ' + odProfile.name.split(' ')[1][0] + '.' : predavaniOdchod
    const nastupceJmena = predavaniNastupce.trim().split(' ')
    const naShort = nastupceJmena[0] + ' ' + (nastupceJmena[1]?.[0] || '') + '.'
    setItems(prev => prev.map(p => p.person === odShort ? {...p, person: naShort} : p))
    const dnes = new Date().toLocaleDateString('cs-CZ', {day:'numeric', month:'numeric', year:'numeric'})
    setPredavaniLog(prev => [{od: predavaniOdchod, na: predavaniNastupce, datum: dnes}, ...prev])
    setChecklistItems(predavaniChecklist.map(c => ({...c, done: false})))
    const zbyvajici = profiles.find(p => p.name !== predavaniOdchod)
    if (zbyvajici) setPredavaniOdchod(zbyvajici.name)
    setPredavaniNastupce('')
    setPredavaniDone(true)
    setTimeout(() => setPredavaniDone(false), 3000)
  }

  const saveProfile = () => { setProfileSaved(true); setTimeout(() => setProfileSaved(false), 2000) }

  const overdueCount = items.filter(p => p.status === 'overdue').length
  const filteredPov = items.filter(p => {
    if (filter === 'overdue') return p.status === 'overdue'
    if (filter === 'warning') return p.status === 'warning'
    if (filter === 'done') return p.done
    return true
  })
  const filteredDocs = docs.filter(d => {
    const q = docSearch.toLowerCase()
    const matchQ = !q || d.name.toLowerCase().includes(q) || d.cat.toLowerCase().includes(q) || d.by.toLowerCase().includes(q)
    const matchCat = !docCat || d.cat === docCat
    return matchQ && matchCat
  })

  const checkDone = checklistItems.filter(c => c.done).length
  const checkTotal = checklistItems.length
  const checkPct = Math.round((checkDone / checkTotal) * 100)

  const c = {
    app: { display:'flex', minHeight:'100vh', background:'#f5f3ef', fontFamily:'system-ui,sans-serif' } as React.CSSProperties,
    sidebar: { width:'200px', minWidth:'200px', background:'#1e1e2e', display:'flex', flexDirection:'column' as const },
    main: { flex:1, display:'flex', flexDirection:'column' as const },
    topbar: { padding:'14px 20px', background:'#fff', borderBottom:'0.5px solid #e8e5e0', display:'flex', alignItems:'center', justifyContent:'space-between' },
    content: { flex:1, padding:'20px', overflowY:'auto' as const },
    card: { background:'#fff', border:'0.5px solid #e8e5e0', borderRadius:'12px', padding:'14px 16px', marginBottom:'12px' } as React.CSSProperties,
  }

  const navItem = (id: string, icon: string, label: string, count?: number) => (
    <div key={id} onClick={() => setActivePage(id)} style={{ display:'flex', alignItems:'center', gap:'9px', padding:'8px 10px', borderRadius:'8px', cursor:'pointer', marginBottom:'2px', background: activePage===id?'rgba(255,255,255,0.12)':'transparent', color: activePage===id?'#fff':'rgba(255,255,255,0.5)', fontSize:'13px', fontWeight: activePage===id?'500':'400' }}>
      <span>{icon}</span><span style={{flex:1}}>{label}</span>
      {count ? <span style={{fontSize:'10px',fontWeight:'600',padding:'1px 6px',borderRadius:'99px',background:'#E24B4A',color:'#fff'}}>{count}</span> : null}
    </div>
  )

  const Badge = ({ status, done }: { status: string, done: boolean }) => {
    const s: React.CSSProperties = { fontSize:'11px', padding:'3px 9px', borderRadius:'99px', fontWeight:'600' }
    if (done) return <span style={{...s,background:'#d1fae5',color:'#065f46'}}>Splněno</span>
    if (status==='overdue') return <span style={{...s,background:'#fee2e2',color:'#991b1b'}}>Po termínu</span>
    if (status==='warning') return <span style={{...s,background:'#fef3c7',color:'#92400e'}}>Blíží se</span>
    return <span style={{...s,background:'#dbeafe',color:'#1e40af'}}>OK</span>
  }

  const pageTitle: Record<string,string> = { dashboard:'Přehled', povinnosti:'Povinnosti', dokumenty:'Archiv dokumentů', notifikace:'Upozornění', predavani:'Předávání agendy', nastaveni:'Nastavení' }

  const notifPanel = (
    <div style={{...c.card, width: notifSide==='left'?'280px':undefined, minWidth: notifSide==='left'?'280px':undefined}}>
      <div style={{fontSize:'13px', fontWeight:'500', marginBottom:'12px', color:'#1a1a2e', display:'flex', alignItems:'center', gap:'8px'}}>
        Upozornění
        {overdueCount > 0 && <span style={{fontSize:'11px',background:'#E24B4A',color:'#fff',padding:'2px 8px',borderRadius:'99px',fontWeight:'600'}}>{overdueCount}</span>}
        <span style={{marginLeft:'auto', fontSize:'11px', color:'#bbb', cursor:'pointer'}} onClick={() => setNotifSide(s => s==='right'?'left':'right')}>
          {notifSide==='right' ? '← vlevo' : 'vpravo →'}
        </span>
      </div>
      {items.filter(p => !p.done && (p.status==='overdue'||p.status==='warning')).map(p => (
        <div key={p.id} style={{display:'flex', gap:'12px', padding:'11px 0', borderBottom:'0.5px solid #f0ede8', alignItems:'flex-start'}}>
          <div style={{width:'32px', height:'32px', borderRadius:'9px', background: p.status==='overdue'?'#fee2e2':'#fef3c7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', flexShrink:0}}>
            {p.status==='overdue' ? '🚨' : '⚠'}
          </div>
          <div style={{flex:1}}>
            <div style={{fontWeight:'600', color: p.status==='overdue'?'#991b1b':'#92400e', fontSize:'12px'}}>{p.title}</div>
            <div style={{color:'#999', fontSize:'11px', marginTop:'2px'}}>{p.date} · {p.person}</div>
          </div>
          <button onClick={() => toggle(p.id)} style={{fontSize:'11px', padding:'3px 8px', borderRadius:'6px', border:'0.5px solid #d4d0c8', background:'#fff', cursor:'pointer', color:'#555', flexShrink:0}}>✓</button>
        </div>
      ))}
      {items.filter(p => !p.done && (p.status==='overdue'||p.status==='warning')).length === 0 && (
        <div style={{textAlign:'center', padding:'20px', color:'#999', fontSize:'13px'}}>Žádná nová upozornění 🎉</div>
      )}
    </div>
  )

  return (
    <div style={c.app}>

      {/* SIDEBAR */}
      <div style={c.sidebar}>
        <div style={{padding:'18px 16px 14px', borderBottom:'0.5px solid rgba(255,255,255,0.08)'}}>
          <div style={{fontSize:'15px', fontWeight:'500', color:'#fff'}}>(na)KLID</div>
          <div style={{fontSize:'11px', color:'rgba(255,255,255,0.35)', marginTop:'2px'}}>{firma}</div>
        </div>
        <div style={{flex:1, padding:'10px 8px'}}>
          {navItem('dashboard','▦','Přehled')}
          {navItem('povinnosti','✓','Povinnosti')}
          {navItem('dokumenty','◧','Dokumenty')}
          {navItem('notifikace','◉','Upozornění', overdueCount||undefined)}
          {navItem('predavani','⇄','Předávání agendy')}
          {navItem('nastaveni','◎','Nastavení')}
        </div>
        <div style={{padding:'12px', borderTop:'0.5px solid rgba(255,255,255,0.08)', position:'relative'}}>
          {showProfileSwitch && (
            <div style={{position:'absolute', bottom:'60px', left:'12px', right:'12px', background:'#2a2a3e', borderRadius:'10px', border:'0.5px solid rgba(255,255,255,0.1)', overflow:'hidden', zIndex:20}}>
              {profiles.map(p => (
                <div key={p.id} onClick={() => { setActiveProfileId(p.id); setShowProfileSwitch(false) }} style={{display:'flex', alignItems:'center', gap:'9px', padding:'9px 12px', cursor:'pointer', background: activeProfileId===p.id?'rgba(255,255,255,0.1)':'transparent', borderBottom:'0.5px solid rgba(255,255,255,0.06)'}}>
                  <div style={{width:'26px', height:'26px', borderRadius:'50%', background:p.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:'600', color:'#fff', flexShrink:0}}>{p.initials}</div>
                  <div><div style={{fontSize:'12px', fontWeight:'500', color:'#fff'}}>{p.name}</div><div style={{fontSize:'10px', color:'rgba(255,255,255,0.4)'}}>{p.role}</div></div>
                  {activeProfileId===p.id && <span style={{marginLeft:'auto', fontSize:'12px', color:'#1D9E75'}}>✓</span>}
                </div>
              ))}
            </div>
          )}
          <div onClick={() => setShowProfileSwitch(s => !s)} style={{display:'flex', alignItems:'center', gap:'9px', cursor:'pointer', padding:'4px', borderRadius:'8px'}}>
            <div style={{width:'28px', height:'28px', borderRadius:'50%', background:activeProfile.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'600', color:'#fff', flexShrink:0}}>{activeProfile.initials}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:'12px', fontWeight:'500', color:'#fff'}}>{activeProfile.name}</div>
              <div style={{fontSize:'11px', color:'rgba(255,255,255,0.35)'}}>{activeProfile.role}</div>
            </div>
            <span style={{fontSize:'10px', color:'rgba(255,255,255,0.3)'}}>⇅</span>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={c.main}>
        <div style={c.topbar}>
          <div style={{fontSize:'15px', fontWeight:'500', color:'#1a1a2e'}}>{pageTitle[activePage]}</div>
          <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
            {overdueCount > 0 && notifSide==='right' && activePage!=='notifikace' && (
              <div style={{fontSize:'12px', color:'#991b1b', background:'#fff2f2', border:'0.5px solid #fca5a5', borderRadius:'8px', padding:'5px 10px', cursor:'pointer'}} onClick={() => setActivePage('notifikace')}>
                ⚠ {overdueCount} po termínu
              </div>
            )}
            <button onClick={() => setShowModal(true)} style={{padding:'7px 14px', borderRadius:'8px', border:'none', background:'#534AB7', color:'#fff', fontSize:'12px', fontWeight:'500', cursor:'pointer'}}>
              + Přidat povinnost
            </button>
          </div>
        </div>

        <div style={{display:'flex', flex:1, overflow:'hidden'}}>
          {notifSide==='left' && activePage!=='notifikace' && (
            <div style={{width:'300px', minWidth:'300px', padding:'20px', borderRight:'0.5px solid #e8e5e0', background:'#fafaf8', overflowY:'auto' as const}}>
              {notifPanel}
            </div>
          )}

          <div style={c.content}>

            {/* DASHBOARD */}
            {activePage === 'dashboard' && (
              <div>
                <div style={{background: overdueCount>0?'#fff2f2':'#f0fdf4', border:`0.5px solid ${overdueCount>0?'#fca5a5':'#a7f3d0'}`, borderRadius:'10px', padding:'10px 14px', marginBottom:'14px', display:'flex', alignItems:'center', gap:'10px'}}>
                  <span>⚠</span>
                  <span style={{fontWeight:'500', color: overdueCount>0?'#991b1b':'#065f46', fontSize:'13px'}}>
                    {overdueCount>0 ? `${overdueCount} povinnosti jsou po termínu` : 'Všechny povinnosti jsou splněny! 🎉'}
                  </span>
                  {overdueCount>0 && <button onClick={() => setActivePage('povinnosti')} style={{marginLeft:'auto', fontSize:'11px', padding:'4px 10px', borderRadius:'6px', border:'0.5px solid #fca5a5', background:'transparent', color:'#991b1b', cursor:'pointer'}}>Zobrazit →</button>}
                </div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px', marginBottom:'16px'}}>
                  {([['Po termínu',overdueCount,'#E24B4A'],['Blíží se',items.filter(p=>p.status==='warning').length,'#EF9F27'],['Splněno',items.filter(p=>p.done).length,'#1D9E75'],['Celkem',items.length,'#534AB7']] as [string,number,string][]).map(([label,val,bg]) => (
                    <div key={label} style={{borderRadius:'12px', padding:'13px 15px', background:bg, color:'#fff'}}>
                      <div style={{fontSize:'10px', fontWeight:'500', opacity:.7, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'5px'}}>{label}</div>
                      <div style={{fontSize:'26px', fontWeight:'500', lineHeight:1}}>{val}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:'12px'}}>
                  <div style={c.card}>
                    <div style={{fontSize:'13px', fontWeight:'500', marginBottom:'12px', color:'#1a1a2e', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                      Aktivní povinnosti
                      <span onClick={() => setActivePage('povinnosti')} style={{fontSize:'11px', color:'#534AB7', cursor:'pointer', fontWeight:'400'}}>Zobrazit vše →</span>
                    </div>
                    {items.filter(p => !p.done).length === 0 && (
                      <div style={{textAlign:'center', padding:'20px', color:'#1D9E75', fontSize:'13px'}}>🎉 Všechny povinnosti jsou splněny!</div>
                    )}
                    {items.filter(p => !p.done).map(p => (
                      <div key={p.id} style={{display:'flex', alignItems:'center', gap:'10px', padding:'8px 0', borderBottom:'0.5px solid #f5f3ef'}}>
                        <div onClick={() => toggle(p.id)} style={{width:'18px', height:'18px', borderRadius:'50%', flexShrink:0, cursor:'pointer', border:'2px solid #d4d0c8', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', color:'#fff', fontWeight:'700'}}></div>
                        <div style={{flex:1, fontSize:'12px', fontWeight:'500', color:'#1a1a2e'}}>{p.title}</div>
                        <div style={{fontSize:'11px', color: p.status==='overdue'?'#E24B4A':p.status==='warning'?'#EF9F27':'#bbb', fontWeight: p.status==='overdue'||p.status==='warning'?'600':'400'}}>{p.date}</div>
                        <Badge status={p.status} done={p.done} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={c.card}>
                      <div style={{fontSize:'13px', fontWeight:'500', marginBottom:'12px', color:'#1a1a2e'}}>Plnění kategorií</div>
                      {([['BOZP & PO','90','#1D9E75'],['Smlouvy','75','#EF9F27'],['Revize','60','#E24B4A'],['Legislativa','100','#1D9E75']] as [string,string,string][]).map(([label,pct,color]) => (
                        <div key={label} style={{marginBottom:'10px'}}>
                          <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'4px'}}>
                            <span style={{fontWeight:'500'}}>{label}</span><span style={{color, fontWeight:'600'}}>{pct} %</span>
                          </div>
                          <div style={{height:'5px', background:'#f0ede8', borderRadius:'3px', overflow:'hidden'}}>
                            <div style={{width:`${pct}%`, height:'100%', background:color, borderRadius:'3px'}}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={c.card}>
                      <div style={{fontSize:'13px', fontWeight:'500', marginBottom:'10px', color:'#1a1a2e'}}>Tým</div>
                      {profiles.map(p => (
                        <div key={p.id} style={{display:'flex', alignItems:'center', gap:'9px', padding:'7px 0', borderBottom:'0.5px solid #f5f3ef'}}>
                          <div style={{width:'26px', height:'26px', borderRadius:'50%', background:p.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:'600', color:'#fff'}}>{p.initials}</div>
                          <div style={{flex:1}}><div style={{fontSize:'12px', fontWeight:'500', color:'#1a1a2e'}}>{p.name}</div><div style={{fontSize:'11px', color:'#999'}}>{p.role}</div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* POVINNOSTI */}
            {activePage === 'povinnosti' && (
              <div>
                <div style={{display:'flex', gap:'6px', marginBottom:'14px', flexWrap:'wrap', alignItems:'center'}}>
                  {([['vse','Vše'],['overdue','Po termínu'],['warning','Blíží se'],['done','Splněno']] as [string,string][]).map(([f,label]) => (
                    <span key={f} onClick={() => setFilter(f)} style={{padding:'5px 11px', borderRadius:'99px', fontSize:'11px', cursor:'pointer', background: filter===f?'#534AB7':'#fff', color: filter===f?'#fff':'#666', border: filter===f?'0.5px solid #534AB7':'0.5px solid #d4d0c8', fontWeight: filter===f?'500':'400'}}>{label}</span>
                  ))}
                  <span style={{marginLeft:'auto', fontSize:'12px', color:'#999'}}>{filteredPov.length} položek</span>
                </div>
                {filteredPov.map(p => (
                  <div key={p.id} style={{display:'flex', alignItems:'center', gap:'12px', padding:'11px 14px', borderRadius:'10px', marginBottom:'7px', background: p.done?'#f8fdf9':p.status==='overdue'?'#fff8f8':p.status==='warning'?'#fffdf0':'#fff', border:'0.5px solid #e8e5e0', borderLeft: p.status==='overdue'?'3px solid #E24B4A':p.status==='warning'?'3px solid #EF9F27':p.done?'3px solid #1D9E75':'0.5px solid #e8e5e0'}}>
                    <div onClick={() => toggle(p.id)} style={{width:'24px', height:'24px', borderRadius:'50%', flexShrink:0, cursor:'pointer', border: p.done?'none':'2px solid #d4d0c8', background: p.done?'#1D9E75':'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', color:'#fff', fontWeight:'700'}}>
                      {p.done?'✓':''}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:'13px', fontWeight:'500', color: p.done?'#999':'#1a1a2e', textDecoration: p.done?'line-through':'none'}}>{p.title}</div>
                      <div style={{fontSize:'11px', color:'#999', marginTop:'2px'}}>{p.cat} · {p.person}</div>
                    </div>
                    <div style={{fontSize:'12px', fontWeight:'600', color: p.status==='overdue'?'#E24B4A':p.status==='warning'?'#EF9F27':'#999'}}>{p.date}</div>
                    <Badge status={p.status} done={p.done} />
                  </div>
                ))}
              </div>
            )}

            {/* DOKUMENTY */}
            {activePage === 'dokumenty' && (
              <div>
                <input ref={fileRef} type='file' accept='.pdf,.docx,.xlsx,.doc,.xls' style={{display:'none'}} onChange={handleFileSelect} />
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { handleFileDrop(e); setShowUploadModal(true) }}
                  onClick={() => { fileRef.current?.click(); setTimeout(() => setShowUploadModal(true), 300) }}
                  style={{border:`1.5px dashed ${dragOver?'#534AB7':'#d4d0c8'}`, borderRadius:'10px', padding:'20px', textAlign:'center', color: dragOver?'#534AB7':'#999', fontSize:'13px', cursor:'pointer', marginBottom:'14px', background: dragOver?'#f5f3ff':'transparent', transition:'all .15s'}}>
                  <div style={{fontSize:'24px', marginBottom:'5px'}}>↑</div>
                  <div style={{fontWeight:'500', marginBottom:'2px'}}>Přetáhni soubory nebo klikni pro nahrání</div>
                  <div style={{fontSize:'11px'}}>PDF, DOCX, XLSX · max 20 MB</div>
                </div>
                <div style={{display:'flex', gap:'8px', marginBottom:'10px'}}>
                  <div style={{flex:1, position:'relative'}}>
                    <span style={{position:'absolute', left:'11px', top:'50%', transform:'translateY(-50%)', color:'#bbb'}}>⌕</span>
                    <input value={docSearch} onChange={e => setDocSearch(e.target.value)} placeholder="Hledat název, kategorii, autora…" style={{width:'100%', padding:'8px 12px 8px 32px', border:'0.5px solid #d4d0c8', borderRadius:'9px', fontSize:'13px', background:'#fafaf8', color:'#1a1a2e', boxSizing:'border-box'}} />
                  </div>
                  <select value={docCat} onChange={e => setDocCat(e.target.value)} style={{padding:'7px 10px', border:'0.5px solid #d4d0c8', borderRadius:'8px', fontSize:'12px', background:'#fff', color:'#666', minWidth:'130px'}}>
                    <option value=''>Všechny kategorie</option>
                    {['Revize','BOZP','Smlouvy','Legislativa','PO'].map(cat => <option key={cat}>{cat}</option>)}
                  </select>
                </div>
                <div style={{fontSize:'11px', color:'#999', marginBottom:'10px'}}>{filteredDocs.length} dokumentů</div>
                {filteredDocs.length === 0 ? (
                  <div style={{textAlign:'center', padding:'40px', color:'#bbb'}}>
                    <div style={{fontSize:'32px', marginBottom:'8px'}}>🔍</div>
                    <div style={{fontSize:'14px', color:'#999'}}>Žádné dokumenty nenalezeny</div>
                  </div>
                ) : (
                  <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'10px'}}>
                    {filteredDocs.map(d => (
                      <div key={d.id} style={{background:'#fff', border: d.state==='expired'?'0.5px solid #fca5a5':d.state==='expiring'?'0.5px solid #fde68a':'0.5px solid #e8e5e0', borderLeft: d.state==='expired'?'3px solid #E24B4A':d.state==='expiring'?'3px solid #EF9F27':'0.5px solid #e8e5e0', borderRadius:'10px', padding:'13px 14px', cursor:'pointer'}}
                        onClick={() => { if (d.real && d.url) window.open(d.url) }}>
                        <div style={{display:'flex', alignItems:'flex-start', gap:'10px', marginBottom:'8px'}}>
                          <div style={{width:'36px', height:'36px', borderRadius:'8px', background: catColor[d.cat]||'#f0ede8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'17px', flexShrink:0}}>{extIcon[d.ext]||'📄'}</div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:'13px', fontWeight:'500', color:'#1a1a2e', lineHeight:1.3}}>{d.name}</div>
                            {d.real && <span style={{fontSize:'10px', background:'#f0fdf4', color:'#065f46', padding:'1px 6px', borderRadius:'4px', marginTop:'3px', display:'inline-block'}}>✓ Nahráno tebou</span>}
                          </div>
                        </div>
                        <div style={{display:'flex', gap:'6px', alignItems:'center', marginBottom:'8px', flexWrap:'wrap'}}>
                          <span style={{fontSize:'10px', padding:'2px 7px', borderRadius:'99px', background: catColor[d.cat], color: catText[d.cat]}}>{d.cat}</span>
                          <span style={{fontSize:'10px', padding:'2px 7px', borderRadius:'99px', background:'#f0ede8', color:'#666', fontWeight:'600'}}>{d.ext}</span>
                          {d.state==='expired' && <span style={{fontSize:'10px', padding:'2px 8px', borderRadius:'99px', background:'#fee2e2', color:'#991b1b', fontWeight:'600'}}>Prošlé</span>}
                          {d.state==='expiring' && <span style={{fontSize:'10px', padding:'2px 8px', borderRadius:'99px', background:'#fef3c7', color:'#92400e', fontWeight:'600'}}>Brzy vyprší</span>}
                          {d.state==='ok' && <span style={{fontSize:'10px', padding:'2px 8px', borderRadius:'99px', background:'#d1fae5', color:'#065f46', fontWeight:'600'}}>Platné</span>}
                        </div>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:'8px', borderTop:'0.5px solid #f0ede8'}}>
                          <div>
                            <div style={{fontSize:'10px', color:'#ccc', marginBottom:'1px'}}>nahráno {d.date} · {d.size}</div>
                            <div style={{fontSize:'11px', color: d.state==='expired'?'#E24B4A':d.state==='expiring'?'#EF9F27':'#999'}}>Platnost: {d.validity}</div>
                          </div>
                          <div style={{fontSize:'11px', color:'#bbb'}}>{d.by}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* NOTIFIKACE */}
            {activePage === 'notifikace' && notifPanel}

            {/* PŘEDÁVÁNÍ AGENDY */}
            {activePage === 'predavani' && (
              <div>
                <div style={{background:'#fffdf0', border:'0.5px solid #fde68a', borderRadius:'10px', padding:'10px 14px', marginBottom:'14px', display:'flex', alignItems:'center', gap:'10px'}}>
                  <span>⇄</span>
                  <span style={{fontWeight:'500', color:'#92400e', fontSize:'13px'}}>Probíhá předávání agendy · Petr Kovář odchází 30. 4. 2026</span>
                  <span style={{marginLeft:'auto', fontSize:'12px', color:'#92400e', fontWeight:'500'}}>{checkPct} % dokončeno</span>
                </div>

                <div style={{display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:'12px'}}>
                  <div>
                    <div style={c.card}>
                      <div style={{fontSize:'13px', fontWeight:'500', marginBottom:'14px', color:'#1a1a2e', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                        Checklist předávání
                        <span style={{fontSize:'12px', color:'#999', fontWeight:'400'}}>{checkDone}/{checkTotal} splněno</span>
                      </div>
                      <div style={{height:'5px', background:'#f0ede8', borderRadius:'3px', overflow:'hidden', marginBottom:'14px'}}>
                        <div style={{width:`${checkPct}%`, height:'100%', background: checkPct===100?'#1D9E75':'#EF9F27', borderRadius:'3px', transition:'width .3s'}}></div>
                      </div>
                      {checklistItems.map(item => (
                        <div key={item.id} onClick={() => toggleChecklist(item.id)} style={{display:'flex', alignItems:'center', gap:'10px', padding:'9px 0', borderBottom:'0.5px solid #f5f3ef', cursor:'pointer'}}>
                          <div style={{width:'20px', height:'20px', borderRadius:'50%', flexShrink:0, border: item.done?'none':'2px solid #d4d0c8', background: item.done?'#1D9E75':'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', color:'#fff', fontWeight:'700'}}>
                            {item.done?'✓':''}
                          </div>
                          <div style={{fontSize:'13px', color: item.done?'#999':'#1a1a2e', textDecoration: item.done?'line-through':'none'}}>{item.label}</div>
                        </div>
                      ))}
                    </div>

                    <div style={c.card}>
                      <div style={{fontSize:'13px', fontWeight:'500', marginBottom:'12px', color:'#1a1a2e'}}>Detaily předávání</div>
                      <div style={{marginBottom:'10px'}}>
                        <div style={{fontSize:'11px', color:'#666', marginBottom:'3px', fontWeight:'500'}}>Odchází</div>
                        <select value={predavaniOdchod} onChange={e=>setPredavaniOdchod(e.target.value)} style={{width:'100%', padding:'7px 10px', border:'0.5px solid #d4d0c8', borderRadius:'8px', fontSize:'13px'}}>
                          {profiles.map(p=><option key={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div style={{marginBottom:'12px'}}>
                        <div style={{fontSize:'11px', color:'#666', marginBottom:'3px', fontWeight:'500'}}>Nástupce (jméno a příjmení)</div>
                        <input value={predavaniNastupce} onChange={e=>setPredavaniNastupce(e.target.value)} placeholder='např. Pavel Novák' style={{width:'100%', padding:'7px 10px', border:'0.5px solid #d4d0c8', borderRadius:'8px', fontSize:'13px', boxSizing:'border-box'}} />
                      </div>
                      {predavaniNastupce.trim() && (
                        <div style={{background:'#fff8f0', border:'0.5px solid #fde68a', borderRadius:'8px', padding:'10px 12px', marginBottom:'12px', fontSize:'12px', color:'#92400e'}}>
                          ⚠ Všechny povinnosti <strong>{predavaniOdchod}</strong> budou přepsány na <strong>{predavaniNastupce}</strong>
                        </div>
                      )}
                      <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                        <button onClick={potvrditPredavani} disabled={!predavaniNastupce.trim()} style={{padding:'8px 16px', borderRadius:'8px', border:'none', background: predavaniNastupce.trim()?'#1D9E75':'#d4d0c8', color:'#fff', fontSize:'12px', fontWeight:'500', cursor: predavaniNastupce.trim()?'pointer':'not-allowed'}}>
                          ✓ Potvrdit předávání
                        </button>
                        {predavaniDone && <span style={{fontSize:'12px', color:'#1D9E75', fontWeight:'500'}}>✓ Předáno!</span>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={c.card}>
                      <div style={{fontSize:'13px', fontWeight:'500', marginBottom:'12px', color:'#1a1a2e'}}>Povinnosti k předání</div>
                      {(() => {
                        const odProfile = profiles.find(p => p.name === predavaniOdchod)
                        const odShort = odProfile ? odProfile.name.split(' ')[0] + ' ' + odProfile.name.split(' ')[1][0] + '.' : ''
                        const povKPredani = items.filter(p => !p.done && p.person === odShort)
                        if (povKPredani.length === 0) return (
                          <div style={{fontSize:'12px', color:'#999', textAlign:'center', padding:'12px'}}>Žádné aktivní povinnosti</div>
                        )
                        return povKPredani.map(p => (
                          <div key={p.id} style={{display:'flex', alignItems:'center', gap:'8px', padding:'8px 0', borderBottom:'0.5px solid #f5f3ef'}}>
                            <div style={{width:'8px', height:'8px', borderRadius:'50%', background: p.status==='overdue'?'#E24B4A':p.status==='warning'?'#EF9F27':'#93c5fd', flexShrink:0}}></div>
                            <div style={{flex:1, fontSize:'12px', fontWeight:'500', color:'#1a1a2e'}}>{p.title}</div>
                            <div style={{fontSize:'11px', color:'#999'}}>{p.date}</div>
                          </div>
                        ))
                      })()}
                    </div>

                    <div style={c.card}>
                      <div style={{fontSize:'13px', fontWeight:'500', marginBottom:'12px', color:'#1a1a2e'}}>Historie předávání</div>
                      {[...predavaniLog, ...predavaniHistory].map((h, i) => (
                        <div key={i} style={{display:'flex', gap:'10px', padding:'8px 0', borderBottom:'0.5px solid #f5f3ef'}}>
                          <div style={{width:'8px', height:'8px', borderRadius:'50%', background:'#1D9E75', marginTop:'4px', flexShrink:0}}></div>
                          <div>
                            <div style={{fontSize:'12px', fontWeight:'500', color:'#1a1a2e'}}>{h.od} → {h.na}</div>
                            {'pozn' in h && h.pozn && <div style={{fontSize:'11px', color:'#999'}}>{(h as typeof predavaniHistory[0]).pozn}</div>}
                            <div style={{fontSize:'11px', color:'#bbb', marginTop:'2px'}}>{h.datum} · Dokončeno</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NASTAVENÍ */}
            {activePage === 'nastaveni' && (
              <div>
                <div style={c.card}>
                  <div style={{fontSize:'13px', fontWeight:'500', marginBottom:'14px', color:'#1a1a2e'}}>Profil a firma</div>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'12px'}}>
                    {([['Jméno','name'],['E-mail','email']] as [string,string][]).map(([label,key]) => (
                      <div key={key}>
                        <div style={{fontSize:'11px', color:'#666', marginBottom:'3px', fontWeight:'500'}}>{label}</div>
                        <input defaultValue={(profiles.find(p=>p.id===activeProfileId) as typeof profiles[0])[key as 'name'|'email']} style={{width:'100%', padding:'7px 10px', border:'0.5px solid #d4d0c8', borderRadius:'8px', fontSize:'13px', boxSizing:'border-box'}} />
                      </div>
                    ))}
                    <div>
                      <div style={{fontSize:'11px', color:'#666', marginBottom:'3px', fontWeight:'500'}}>Název firmy</div>
                      <input value={firma} onChange={e=>setFirma(e.target.value)} style={{width:'100%', padding:'7px 10px', border:'0.5px solid #d4d0c8', borderRadius:'8px', fontSize:'13px', boxSizing:'border-box'}} />
                    </div>
                    <div>
                      <div style={{fontSize:'11px', color:'#666', marginBottom:'3px', fontWeight:'500'}}>IČO</div>
                      <input value={ico} onChange={e=>setIco(e.target.value)} style={{width:'100%', padding:'7px 10px', border:'0.5px solid #d4d0c8', borderRadius:'8px', fontSize:'13px', boxSizing:'border-box'}} />
                    </div>
                  </div>
                  <div style={{marginBottom:'12px'}}>
                    <div style={{fontSize:'11px', color:'#666', marginBottom:'3px', fontWeight:'500'}}>Oborový modul</div>
                    <select value={modul} onChange={e=>setModul(e.target.value)} style={{padding:'7px 10px', border:'0.5px solid #d4d0c8', borderRadius:'8px', fontSize:'13px', minWidth:'200px'}}>
                      {['Lékárna','Gastro','Stavebnictví','Kosmetika','IT firma','E-shop','Vlastní'].map(m=><option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <button onClick={saveProfile} style={{padding:'8px 16px', borderRadius:'8px', border:'none', background:'#534AB7', color:'#fff', fontSize:'12px', fontWeight:'500', cursor:'pointer'}}>Uložit změny</button>
                    {profileSaved && <span style={{fontSize:'12px', color:'#1D9E75', fontWeight:'500'}}>✓ Uloženo!</span>}
                  </div>
                </div>
                <div style={c.card}>
                  <div style={{fontSize:'13px', fontWeight:'500', marginBottom:'12px', color:'#1a1a2e'}}>Panel upozornění</div>
                  <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <span style={{fontSize:'13px', color:'#555', marginRight:'4px'}}>Zobrazit panel</span>
                    <button onClick={() => setNotifSide('left')} style={{padding:'5px 12px', borderRadius:'8px', fontSize:'12px', cursor:'pointer', background: notifSide==='left'?'#534AB7':'#fff', color: notifSide==='left'?'#fff':'#666', border: notifSide==='left'?'0.5px solid #534AB7':'0.5px solid #d4d0c8'}}>← Vlevo</button>
                    <button onClick={() => setNotifSide('right')} style={{padding:'5px 12px', borderRadius:'8px', fontSize:'12px', cursor:'pointer', background: notifSide==='right'?'#534AB7':'#fff', color: notifSide==='right'?'#fff':'#666', border: notifSide==='right'?'0.5px solid #534AB7':'0.5px solid #d4d0c8'}}>Vpravo →</button>
                  </div>
                </div>
                <div style={c.card}>
                  <div style={{fontSize:'13px', fontWeight:'500', marginBottom:'14px', color:'#1a1a2e'}}>Předplatné</div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px'}}>
                    {plans.map(plan => (
                      <div key={plan.id} onClick={() => setActivePlan(plan.id)} style={{border: activePlan===plan.id?'2px solid #534AB7':'0.5px solid #e8e5e0', borderRadius:'12px', padding:'16px', cursor:'pointer', background: activePlan===plan.id?'#f5f3ff':'#fff', position:'relative'}}>
                        {plan.highlight && <div style={{position:'absolute', top:'-10px', left:'50%', transform:'translateX(-50%)', background:'#534AB7', color:'#fff', fontSize:'10px', fontWeight:'600', padding:'2px 10px', borderRadius:'99px', whiteSpace:'nowrap'}}>Nejoblíbenější</div>}
                        <div style={{fontSize:'14px', fontWeight:'500', color: activePlan===plan.id?'#534AB7':'#1a1a2e', marginBottom:'2px'}}>{plan.name}</div>
                        <div style={{fontSize:'11px', color:'#999', marginBottom:'8px'}}>{plan.desc}</div>
                        <div style={{fontSize:'20px', fontWeight:'500', color:'#1a1a2e', marginBottom:'2px'}}>{plan.price}</div>
                        <div style={{fontSize:'11px', color:'#999', marginBottom:'12px'}}>{plan.period}</div>
                        <div style={{fontSize:'11px', color:'#555', display:'flex', flexDirection:'column', gap:'4px'}}>
                          {plan.features.map(f => <div key={f} style={{display:'flex', gap:'6px'}}><span style={{color:'#1D9E75'}}>✓</span>{f}</div>)}
                        </div>
                        {activePlan===plan.id && <div style={{marginTop:'12px', fontSize:'11px', fontWeight:'600', color:'#534AB7', textAlign:'center'}}>✓ Aktivní plán</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* MODAL – nová povinnost */}
      {showModal && (
        <div style={{position:'fixed', inset:0, background:'rgba(15,15,30,0.5)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{background:'#fff', borderRadius:'14px', padding:'22px', width:'340px'}}>
            <div style={{fontSize:'15px', fontWeight:'500', marginBottom:'16px', color:'#1a1a2e'}}>Nová povinnost</div>
            {([
              ['Název', <input key='n' value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder='např. Revize hasicích přístrojů' style={{width:'100%',padding:'7px 10px',border:'0.5px solid #d4d0c8',borderRadius:'8px',fontSize:'13px',boxSizing:'border-box' as const}} />],
              ['Kategorie', <select key='c' value={newCat} onChange={e=>setNewCat(e.target.value)} style={{width:'100%',padding:'7px 10px',border:'0.5px solid #d4d0c8',borderRadius:'8px',fontSize:'13px'}}>{['BOZP','Revize','Smlouvy','Legislativa','PO'].map(cat=><option key={cat}>{cat}</option>)}</select>],
              ['Termín', <input key='d' value={newDate} onChange={e=>setNewDate(e.target.value)} placeholder='DD. MM. RRRR' style={{width:'100%',padding:'7px 10px',border:'0.5px solid #d4d0c8',borderRadius:'8px',fontSize:'13px',boxSizing:'border-box' as const}} />],
              ['Odpovědná osoba', <select key='p' value={newPerson} onChange={e=>setNewPerson(e.target.value)} style={{width:'100%',padding:'7px 10px',border:'0.5px solid #d4d0c8',borderRadius:'8px',fontSize:'13px'}}>{profiles.map(p=><option key={p.id}>{p.name}</option>)}</select>],
            ] as [string, React.ReactNode][]).map(([label, input]) => (
              <div key={label as string} style={{marginBottom:'10px'}}>
                <div style={{fontSize:'11px', color:'#666', marginBottom:'3px', fontWeight:'500'}}>{label}</div>
                {input}
              </div>
            ))}
            <div style={{display:'flex', gap:'8px', marginTop:'16px'}}>
              <button onClick={addPovinnost} style={{flex:1, padding:'8px', borderRadius:'8px', border:'none', background:'#534AB7', color:'#fff', fontSize:'13px', fontWeight:'500', cursor:'pointer'}}>Uložit</button>
              <button onClick={() => setShowModal(false)} style={{padding:'8px 16px', borderRadius:'8px', border:'0.5px solid #d4d0c8', background:'#fff', fontSize:'13px', cursor:'pointer'}}>Zrušit</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL – nahrání dokumentu */}
      {showUploadModal && (
        <div style={{position:'fixed', inset:0, background:'rgba(15,15,30,0.5)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{background:'#fff', borderRadius:'14px', padding:'22px', width:'360px'}}>
            <div style={{fontSize:'15px', fontWeight:'500', marginBottom:'16px', color:'#1a1a2e'}}>Nahrát dokument</div>
            {uploadFile ? (
              <div style={{background:'#f5f3ff', border:'0.5px solid #d4d0f8', borderRadius:'8px', padding:'10px 14px', marginBottom:'14px', display:'flex', alignItems:'center', gap:'10px'}}>
                <span style={{fontSize:'20px'}}>{extIcon[uploadFile.name.split('.').pop()?.toUpperCase()||'']||'📄'}</span>
                <div>
                  <div style={{fontSize:'13px', fontWeight:'500', color:'#1a1a2e'}}>{uploadFile.name}</div>
                  <div style={{fontSize:'11px', color:'#999'}}>{(uploadFile.size/1024/1024).toFixed(1)} MB</div>
                </div>
              </div>
            ) : (
              <div onClick={() => fileRef.current?.click()} style={{border:'1.5px dashed #d4d0c8', borderRadius:'8px', padding:'16px', textAlign:'center', color:'#999', fontSize:'13px', cursor:'pointer', marginBottom:'14px'}}>
                Klikni pro výběr souboru
              </div>
            )}
            <div style={{marginBottom:'10px'}}>
              <div style={{fontSize:'11px', color:'#666', marginBottom:'3px', fontWeight:'500'}}>Kategorie</div>
              <select value={uploadCat} onChange={e=>setUploadCat(e.target.value)} style={{width:'100%', padding:'7px 10px', border:'0.5px solid #d4d0c8', borderRadius:'8px', fontSize:'13px'}}>
                {['BOZP','Revize','Smlouvy','Legislativa','PO'].map(cat=><option key={cat}>{cat}</option>)}
              </select>
            </div>
            <div style={{marginBottom:'16px'}}>
              <div style={{fontSize:'11px', color:'#666', marginBottom:'3px', fontWeight:'500'}}>Platnost do (nepovinné)</div>
              <input value={uploadValidity} onChange={e=>setUploadValidity(e.target.value)} placeholder='DD. MM. RRRR' style={{width:'100%', padding:'7px 10px', border:'0.5px solid #d4d0c8', borderRadius:'8px', fontSize:'13px', boxSizing:'border-box'}} />
            </div>
            <div style={{display:'flex', gap:'8px'}}>
              <button onClick={uploadDoc} disabled={!uploadFile} style={{flex:1, padding:'8px', borderRadius:'8px', border:'none', background: uploadFile?'#534AB7':'#d4d0c8', color:'#fff', fontSize:'13px', fontWeight:'500', cursor: uploadFile?'pointer':'not-allowed'}}>
                Nahrát dokument
              </button>
              <button onClick={() => { setShowUploadModal(false); setUploadFile(null) }} style={{padding:'8px 16px', borderRadius:'8px', border:'0.5px solid #d4d0c8', background:'#fff', fontSize:'13px', cursor:'pointer'}}>Zrušit</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}