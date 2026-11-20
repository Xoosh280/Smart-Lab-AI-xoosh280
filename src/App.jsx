import { useEffect, useMemo, useState } from 'react';
import { initialData, navigation, pageMeta } from './data.js';
import { loadAppData, saveAppData } from './storage.js';

const today = new Date().toISOString().slice(0, 10);

function Icon({ children, className = '' }) { return <span aria-hidden="true" className={`icon ${className}`}>{children}</span>; }
function BrandMark() { return <div className="brand-mark"><span>✚</span><i>AI</i></div>; }
function Status({ value }) {
  const normalized = String(value).toLowerCase();
  const tone = normalized.includes('operational') || normalized.includes('passed') || normalized === 'completed' || normalized === 'in stock' ? 'green' : normalized.includes('repair') || normalized.includes('progress') ? 'amber' : normalized.includes('due') || normalized.includes('low') ? 'red' : 'blue';
  return <span className={`status ${tone}`}><i />{value}</span>;
}
function StatCard({ icon, label, value, note, tone }) { return <article className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-content"><span>{label}</span><strong>{value}</strong><small>{note}</small></div></article>; }
function EmptyState({ text }) { return <div className="empty-state"><span>⌕</span><p>{text}</p></div>; }

function DataTable({ columns, rows, emptyText = 'No records match your search.' }) {
  if (!rows.length) return <EmptyState text={emptyText} />;
  return <div className="table-scroll"><table><thead><tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={row.id || i}>{columns.map(c => <td key={c.key}>{c.render ? c.render(row[c.key], row) : row[c.key] || '—'}</td>)}</tr>)}</tbody></table></div>;
}

function Modal({ title, children, onClose }) {
  useEffect(() => { const onKey = e => e.key === 'Escape' && onClose(); window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header className="modal-header"><div><span className="eyebrow">SMART LAB AI</span><h2 id="modal-title">{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close">×</button></header>{children}</section></div>;
}

function RecordForm({ kind, onSubmit, onCancel, equipment, initialValues = {} }) {
  const schemas = {
    equipment: [['name','Equipment name','text',true],['category','Category','select',true,['Laboratory','Hospital','Imaging']],['manufacturer','Manufacturer','text',false],['model','Model','text',false],['location','Location','text',false],['status','Status','select',true,['Operational','Service due','Under repair']]],
    maintenance: [['equipment','Equipment','select',true,equipment.map(e => e.name)],['type','Maintenance type','select',true,['Preventive maintenance','Corrective maintenance','Safety inspection']],['dueDate','Due date','date',true],['assigned','Assigned technician','text',true],['priority','Priority','select',true,['Normal','High','Urgent']],['status','Status','select',true,['Scheduled','In progress','Completed']]],
    calibration: [['equipment','Equipment','select',true,equipment.map(e => e.name)],['dueDate','Calibration date','date',true],['standard','Reference standard','text',true],['technician','Technician','text',true],['result','Result','select',true,['Due','Passed','Failed']]],
    repairs: [['equipment','Equipment','select',true,equipment.map(e => e.name)],['issue','Fault / repair description','text',true],['opened','Date opened','date',true],['technician','Technician','text',true],['status','Status','select',true,['Open','In progress','Completed']],['parts','Parts used','text',false]],
    spares: [['name','Part name','text',true],['category','Category','text',true],['stock','Quantity in stock','number',true],['minimum','Reorder threshold','number',true],['location','Storage location','text',false],['unit','Unit','text',false]],
  };
  const fields = schemas[kind];
  return <form className="record-form" onSubmit={e => { e.preventDefault(); const values = Object.fromEntries(new FormData(e.currentTarget)); onSubmit(values); }}>
    <div className="form-grid">{fields.map(([name,label,type,required,options]) => <label className={type === 'text' && name === 'issue' ? 'full' : ''} key={name}>{label}{type === 'select' ? <select name={name} required={required} defaultValue={initialValues[name] || ''}><option value="" disabled>Select {label.toLowerCase()}</option>{options.map(o => <option key={o}>{o}</option>)}</select> : <input name={name} type={type} required={required} min={type === 'number' ? 0 : undefined} defaultValue={initialValues[name] ?? (type === 'date' ? today : '')} placeholder={type === 'text' ? `Enter ${label.toLowerCase()}` : undefined} />}</label>)}</div>
    <div className="form-actions"><button type="button" className="button secondary" onClick={onCancel}>Cancel</button><button className="button primary" type="submit">Save record</button></div>
  </form>;
}

function Dashboard({ data, setPage }) {
  const operational = data.equipment.filter(e => e.status === 'Operational').length;
  const due = data.maintenance.filter(m => m.status !== 'Completed').length;
  const lowStock = data.spares.filter(s => Number(s.stock) <= Number(s.minimum)).length;
  const bars = [38, 55, 45, 70, 52, 83, 63, 76, 57, 91, 73, 100];
  return <>
    <div className="welcome-row"><div><span className="eyebrow">WEDNESDAY, NOVEMBER 19, 2025</span><h2>Good morning, Engineering Team <span>✳</span></h2><p>Here’s your biomedical operations overview for today.</p></div><button className="button primary" onClick={() => setPage('laboratory')}><span>＋</span> Add equipment</button></div>
    <div className="demo-notice"><span>ⓘ</span><div><strong>Demonstration workspace</strong><span>All records shown are sample data for demonstration. Add or edit records to personalize your workspace; changes are saved in this browser.</span></div><button aria-label="Dismiss notice" onClick={e => e.currentTarget.parentElement.remove()}>×</button></div>
    <div className="stats-grid"><StatCard icon="▣" label="Total equipment" value={data.equipment.length} note="Across all departments" tone="blue"/><StatCard icon="✓" label="Operational" value={`${data.equipment.length ? Math.round(operational / data.equipment.length * 100) : 0}%`} note={`${operational} assets running normally`} tone="green"/><StatCard icon="◷" label="Maintenance due" value={due} note="Upcoming work orders" tone="purple"/><StatCard icon="◈" label="Low stock alerts" value={lowStock} note="Parts at reorder threshold" tone="orange"/></div>
    <div className="dashboard-grid"><section className="panel chart-panel"><div className="panel-heading"><div><h3>Service activity</h3><p>Maintenance completed this year</p></div><span className="select-label">2025⌄</span></div><div className="chart"><div className="chart-y"><span>20</span><span>15</span><span>10</span><span>5</span><span>0</span></div><div className="chart-content"><div className="grid-lines"><i/><i/><i/><i/><i/></div><div className="bars">{bars.map((v,i)=><div className="bar-wrap" key={i}><span className={i===9?'bar highlight':'bar'} style={{height:`${v}%`}}/><small>{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}</small></div>)}</div></div></div></section>
      <section className="panel"><div className="panel-heading"><div><h3>Equipment status</h3><p>Current asset overview</p></div><button className="text-button" onClick={()=>setPage('laboratory')}>View inventory →</button></div><div className="donut-wrap"><div className="donut" style={{'--progress':`${data.equipment.length ? operational/data.equipment.length*100 : 0}%`}}><div><strong>{data.equipment.length}</strong><span>Total assets</span></div></div><div className="legend"><span><i className="dot green-dot"/>Operational <b>{operational}</b></span><span><i className="dot amber-dot"/>Service due <b>{data.equipment.filter(e=>e.status==='Service due').length}</b></span><span><i className="dot red-dot"/>Under repair <b>{data.equipment.filter(e=>e.status==='Under repair').length}</b></span></div></div></section>
    </div>
    <section className="panel upcoming-panel"><div className="panel-heading"><div><h3>Upcoming maintenance</h3><p>Stay ahead of scheduled service</p></div><button className="text-button" onClick={()=>setPage('maintenance')}>View schedule →</button></div><DataTable columns={[{key:'equipment',label:'Equipment',render:(v,r)=><div className="asset-cell"><span className="asset-icon">⚙</span><div><strong>{v}</strong><small>{r.assetId}</small></div></div>},{key:'type',label:'Service type'},{key:'dueDate',label:'Due date'},{key:'assigned',label:'Assigned to'},{key:'priority',label:'Priority',render:v=><Status value={v}/>},{key:'status',label:'Status',render:v=><Status value={v}/> }]} rows={data.maintenance.slice(0,3)}/></section>
    <div className="quick-grid"><button onClick={()=>setPage('assistant')}><span className="quick-icon mint">✳</span><span><strong>AI troubleshooting</strong><small>Get guided technical support</small></span><b>→</b></button><button onClick={()=>setPage('calibration')}><span className="quick-icon lavender">⊙</span><span><strong>Calibration due</strong><small>{data.calibration.filter(c=>c.result==='Due').length} equipment needs attention</small></span><b>→</b></button><button onClick={()=>setPage('spares')}><span className="quick-icon peach">◈</span><span><strong>Spare parts</strong><small>{lowStock} items need replenishment</small></span><b>→</b></button></div>
  </>;
}

function InventoryPage({ page, data, onAdd, onEdit, onDelete }) {
  const meta = pageMeta[page]; const [search, setSearch] = useState('');
  if (page === 'laboratory' || page === 'hospital' || page === 'imaging') {
    const rows = data.equipment.filter(e=>e.category===meta.category && Object.values(e).join(' ').toLowerCase().includes(search.toLowerCase()));
    const columns = [{key:'id',label:'Asset ID',render:v=><span className="id-text">{v}</span>},{key:'name',label:'Equipment',render:(v,r)=><div className="asset-cell"><span className="asset-icon">{meta.category==='Imaging'?'▣':meta.category==='Laboratory'?'⚗':'✚'}</span><div><strong>{v}</strong><small>{r.model}</small></div></div>},{key:'manufacturer',label:'Manufacturer'},{key:'location',label:'Location'},{key:'lastService',label:'Last service'},{key:'status',label:'Status',render:v=><Status value={v}/>},{key:'actions',label:'Actions',render:(_,r)=><div className="record-actions"><button className="text-button" onClick={()=>onEdit(r)} aria-label={`Edit ${r.name}`}>Edit</button><button className="text-button danger-button" onClick={()=>onDelete(r)} aria-label={`Delete ${r.name}`}>Delete</button></div>}];
    return <><PageHeader meta={meta} action={()=>onAdd('equipment')} actionLabel="Add equipment"/><div className="filter-row"><div className="search-box"><Icon>⌕</Icon><input aria-label="Search equipment" placeholder="Search by name, asset ID, model…" value={search} onChange={e=>setSearch(e.target.value)}/></div><span className="result-count">{rows.length} assets</span></div><section className="panel page-table"><DataTable columns={columns} rows={rows}/></section></>;
  }
  const key = meta.dataKey;
  const rows = data[key].filter(r=>Object.values(r).join(' ').toLowerCase().includes(search.toLowerCase()));
  const configs = {
    maintenance:[{key:'id',label:'Work order',render:v=><span className="id-text">{v}</span>},{key:'equipment',label:'Equipment',render:(v,r)=><div className="asset-cell"><span className="asset-icon">⚙</span><div><strong>{v}</strong><small>{r.assetId}</small></div></div>},{key:'type',label:'Service type'},{key:'dueDate',label:'Due date'},{key:'assigned',label:'Assigned to'},{key:'priority',label:'Priority',render:v=><Status value={v}/>},{key:'status',label:'Status',render:v=><Status value={v}/> }],
    calibration:[{key:'id',label:'Record ID',render:v=><span className="id-text">{v}</span>},{key:'equipment',label:'Equipment',render:(v,r)=><div className="asset-cell"><span className="asset-icon">⊙</span><div><strong>{v}</strong><small>{r.assetId}</small></div></div>},{key:'standard',label:'Reference standard'},{key:'dueDate',label:'Due date'},{key:'technician',label:'Technician'},{key:'result',label:'Result',render:v=><Status value={v}/> }],
    repairs:[{key:'id',label:'Work order',render:v=><span className="id-text">{v}</span>},{key:'equipment',label:'Equipment',render:(v,r)=><div className="asset-cell"><span className="asset-icon">⌁</span><div><strong>{v}</strong><small>{r.assetId}</small></div></div>},{key:'issue',label:'Fault / repair'},{key:'opened',label:'Date opened'},{key:'technician',label:'Technician'},{key:'parts',label:'Parts used'},{key:'status',label:'Status',render:v=><Status value={v}/> }],
    spares:[{key:'id',label:'Part ID',render:v=><span className="id-text">{v}</span>},{key:'name',label:'Part name',render:v=><div className="asset-cell"><span className="asset-icon">◈</span><strong>{v}</strong></div>},{key:'category',label:'Category'},{key:'stock',label:'In stock',render:(v,r)=><strong className={Number(v)<=Number(r.minimum)?'stock-low':''}>{v} {r.unit}</strong>},{key:'minimum',label:'Reorder at',render:(v,r)=><span>{v} {r.unit}</span>},{key:'location',label:'Storage location'},{key:'stock',label:'Stock status',render:(v,r)=><Status value={Number(v)<=Number(r.minimum)?'Low stock':'In stock'}/> }],
  };
  return <><PageHeader meta={meta} action={()=>onAdd(key)} actionLabel={page==='maintenance'?'Schedule maintenance':page==='calibration'?'Add calibration':'Add record'}/><div className="filter-row"><div className="search-box"><Icon>⌕</Icon><input aria-label={`Search ${meta.title}`} placeholder={`Search ${meta.title.toLowerCase()}…`} value={search} onChange={e=>setSearch(e.target.value)}/></div><span className="result-count">{rows.length} records</span></div><section className="panel page-table"><DataTable columns={configs[page]} rows={rows}/></section></>;
}
function PageHeader({ meta, action, actionLabel }) { return <div className="page-heading"><div><span className="eyebrow">ASSET MANAGEMENT</span><h2>{meta.title}</h2><p>{meta.description}</p></div><button className="button primary" onClick={action}><span>＋</span>{actionLabel}</button></div>; }

function AssistantPage() {
  const [query,setQuery]=useState(''); const [result,setResult]=useState('');
  const submit=e=>{e.preventDefault();if(!query.trim())return;const q=query.toLowerCase();let advice;
    if(q.includes('power')||q.includes('start')||q.includes('boot')) advice='Check that the equipment is connected to its approved power source and that the outlet and cable are intact. Review the manufacturer instructions for startup indicators. If the device still fails to power on, stop and refer the issue to an authorized biomedical engineer.';
    else if(q.includes('calibrat')||q.includes('accuracy')||q.includes('result')) advice='Confirm the correct test method and in-date reference standard are being used. Check environmental and warm-up requirements in the service manual, then document readings and deviations. Do not return equipment to service if results are outside the manufacturer’s acceptance limits.';
    else if(q.includes('error')||q.includes('alarm')||q.includes('code')) advice='Record the exact error code and operating conditions. Consult the equipment’s official service manual for that code and check only user-serviceable items. Avoid bypassing alarms or safety interlocks; escalate unresolved faults to an authorized service professional.';
    else if(q.includes('noise')||q.includes('vibrat')||q.includes('heat')) advice='If the equipment is making unusual noise, vibrating, or overheating, follow site safety policy and remove it from service when safe to do so. Note when the symptom occurs and inspect only externally accessible areas described in the operator manual. Arrange qualified service before clinical use.';
    else advice='Start by documenting the asset ID, symptoms, when the issue began, and any displayed error messages. Review the manufacturer’s operator/service documentation and local safety procedure. Do not open the unit or perform procedures outside your training; escalate unresolved faults to an authorized biomedical engineer.';
    setResult(advice);
  };
  return <><div className="page-heading"><div><span className="eyebrow">ENGINEERING SUPPORT</span><h2>AI troubleshooting assistant</h2><p>Structured first-step guidance for equipment issues.</p></div><span className="ai-pill"><i/> Assistant ready</span></div><div className="assistant-layout"><section className="assistant-card"><div className="assistant-top"><div className="assistant-avatar">✳</div><div><strong>SMART LAB AI Assistant</strong><small>Biomedical equipment support · Demo mode</small></div></div><div className="assistant-welcome"><span>✳</span><h3>How can I help with your equipment?</h3><p>Describe a symptom, fault code, or maintenance question to get general troubleshooting steps.</p></div>{result&&<div className="answer-card"><div><span className="answer-icon">✳</span><strong>Suggested first steps</strong></div><p>{result}</p><small>General guidance only. Follow the manufacturer’s instructions and your facility’s safety procedures.</small></div>}<form className="assistant-input" onSubmit={submit}><textarea value={query} onChange={e=>setQuery(e.target.value)} placeholder="Describe the issue, e.g. ‘Analyzer displays a startup error’" rows="3"/><div className="assistant-input-bottom"><span>Do not include patient-identifiable information.</span><button className="button primary" type="submit">Get guidance <span>↗</span></button></div></form></section><aside className="panel suggestions"><h3>Try asking</h3><p>Choose a prompt to get started</p>{['Equipment will not power on','How should I approach an error code?','Calibration results are out of range','Unusual noise from a device'].map(x=><button key={x} onClick={()=>setQuery(x)}>{x}<span>↗</span></button>)}<div className="safety-note"><strong>Safety first</strong><p>This assistant does not replace official service documentation, training, or qualified technical judgment. Never bypass safety features.</p></div></aside></div></>;
}
function ReportsPage({ data }) {
  const total=data.equipment.length; const operational=data.equipment.filter(e=>e.status==='Operational').length;
  const exportCsv=()=>{const lines=[['Asset ID','Equipment','Category','Manufacturer','Model','Location','Status'],...data.equipment.map(e=>[e.id,e.name,e.category,e.manufacturer,e.model,e.location,e.status])];const csv=lines.map(r=>r.map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='smart-lab-equipment-report.csv';a.click();URL.revokeObjectURL(a.href);};
  return <><div className="page-heading"><div><span className="eyebrow">INSIGHTS & EXPORTS</span><h2>Technical reports</h2><p>Review asset status and export equipment data for your records.</p></div><button className="button primary" onClick={exportCsv}>↓ Export equipment CSV</button></div><div className="stats-grid"><StatCard icon="▣" label="Registered assets" value={total} note="All equipment categories" tone="blue"/><StatCard icon="✓" label="Operational assets" value={operational} note="Currently marked operational" tone="green"/><StatCard icon="◷" label="Open maintenance" value={data.maintenance.filter(x=>x.status!=='Completed').length} note="Scheduled or in progress" tone="purple"/><StatCard icon="◈" label="Parts to reorder" value={data.spares.filter(s=>Number(s.stock)<=Number(s.minimum)).length} note="At or below reorder point" tone="orange"/></div><section className="panel page-table"><div className="panel-heading report-head"><div><h3>Equipment register</h3><p>Export creates a CSV file from current browser data.</p></div><button className="button secondary" onClick={exportCsv}>Download CSV</button></div><DataTable columns={[{key:'id',label:'Asset ID'},{key:'name',label:'Equipment'},{key:'category',label:'Category'},{key:'location',label:'Location'},{key:'status',label:'Status',render:v=><Status value={v}/> }]} rows={data.equipment}/></section></>;
}

export default function App() {
  const [loaded] = useState(() => loadAppData());
  const [data,setData]=useState(loaded.data);
  const [deletedIds,setDeletedIds]=useState(loaded.deletedIds);
  const [page,setPage]=useState('dashboard');
  const [modal,setModal]=useState('');
  const [editingEquipment,setEditingEquipment]=useState(null);
  const [mobileOpen,setMobileOpen]=useState(false);
  const [toast,setToast]=useState(loaded.warning ? {type:'error',message:loaded.warning} : null);
  const active = useMemo(()=>navigation.flatMap(s=>s.items).find(i=>i.id===page),[page]);
  useEffect(()=>{
    const result=saveAppData(data,deletedIds);
    if(!result.ok) setToast({type:'error',message:result.message});
  },[data,deletedIds]);
  const notify=(message,type='success')=>{setToast({type,message});window.setTimeout(()=>setToast(current=>current?.message===message?null:current),4000);};
  const addRecord=(kind,values)=>{
    const idPrefix={equipment:'EQ',maintenance:'PM',calibration:'CAL',repairs:'WO',spares:'SP'}[kind];
    const record={...values,id:`${idPrefix}-${Date.now()}`};
    if(kind==='equipment') record.lastService='Not recorded';
    if(kind==='maintenance'||kind==='calibration'||kind==='repairs') record.assetId=data.equipment.find(e=>e.name===values.equipment)?.id||'—';
    if(kind==='spares'){record.stock=Number(values.stock);record.minimum=Number(values.minimum);record.unit=values.unit||'pcs';}
    setData(prev=>({...prev,[kind]:[record,...prev[kind]]}));
    setModal('');
    notify('Record added successfully.');
  };
  const updateEquipment=values=>{
    setData(prev=>({...prev,equipment:prev.equipment.map(record=>record.id===editingEquipment.id?{...record,...values}:record)}));
    setEditingEquipment(null);setModal('');notify('Equipment record updated successfully.');
  };
  const deleteEquipment=record=>{
    if(!window.confirm(`Delete ${record.name} (${record.id})? This cannot be undone.`)) return;
    setData(prev=>({...prev,equipment:prev.equipment.filter(item=>item.id!==record.id)}));
    setDeletedIds(prev=>[...new Set([...prev,`equipment:${record.id}`])]);
    notify('Equipment record deleted successfully.');
  };
  const changePage=id=>{setPage(id);setMobileOpen(false);};
  const clearDemo=()=>{if(window.confirm('Reset all records to the original demonstration data? This removes changes saved in this browser.')){setData(Object.fromEntries(Object.keys(initialData).map(key=>[key,initialData[key].map(record=>({...record}))])));setDeletedIds([]);notify('Demonstration data restored.');}};
  const closeModal=()=>{setModal('');setEditingEquipment(null);};
  return <div className="app-shell"><aside className={`sidebar ${mobileOpen?'open':''}`}><div className="brand"><BrandMark/><div><strong>SMART LAB <span>AI</span></strong><small>BIOMEDICAL OPERATIONS</small></div><button className="mobile-close" onClick={()=>setMobileOpen(false)} aria-label="Close navigation">×</button></div><div className="workspace"><div className="hospital-avatar">NH</div><div><strong>Northside General</strong><small>Engineering department</small></div><span className="chevron">⌄</span></div><nav>{navigation.map(group=><div className="nav-group" key={group.section}><span className="nav-label">{group.section}</span>{group.items.map(item=><button key={item.id} className={`nav-item ${page===item.id?'active':''}`} onClick={()=>changePage(item.id)}><Icon>{item.icon}</Icon><span>{item.label}</span>{item.badge&&<b className="nav-badge">{item.badge}</b>}</button>)}</div>)}</nav><div className="sidebar-bottom"><div className="help-box"><span>✧</span><strong>Need a hand?</strong><small>Open the AI assistant for technical guidance.</small><button onClick={()=>changePage('assistant')}>Ask assistant <span>→</span></button></div><div className="profile"><div className="profile-avatar">AH</div><div><strong>Ahmed Hassan</strong><small>Biomedical engineer</small></div><button aria-label="Profile options">···</button></div></div></aside>
    {mobileOpen&&<button aria-label="Close menu overlay" className="sidebar-overlay" onClick={()=>setMobileOpen(false)}/>}
    <main className="main-area"><header className="topbar"><button className="menu-toggle" onClick={()=>setMobileOpen(true)} aria-label="Open navigation">☰</button><div className="breadcrumb">Workspace <span>/</span> <strong>{active?.label||'Dashboard'}</strong></div><div className="top-actions"><div className="global-search"><Icon>⌕</Icon><input placeholder="Search assets, work orders…" onKeyDown={e=>{if(e.key==='Enter'){setPage('laboratory');document.querySelector('.filter-row input')?.focus();}}}/><kbd>⌘ K</kbd></div><button className="top-icon" aria-label="Notifications" onClick={()=>changePage('maintenance')}>♧<i/></button><div className="top-profile">AH</div></div></header><div className="content"><div className="mobile-demo"><span>Demo data</span><button onClick={clearDemo}>Reset</button></div>{page==='dashboard'?<Dashboard data={data} setPage={changePage}/>:pageMeta[page]?<InventoryPage page={page} data={data} onAdd={kind=>setModal(kind)} onEdit={record=>{setEditingEquipment(record);setModal('equipment-edit');}} onDelete={deleteEquipment}/>:page==='assistant'?<AssistantPage/>:<ReportsPage data={data}/>}<footer className="footer"><span>© 2025 SMART LAB AI</span><span>Biomedical equipment management · <button onClick={clearDemo}>Reset demo data</button></span></footer></div></main>
    {modal&&<Modal title={modal==='equipment-edit'?'Edit equipment':modal==='equipment'?'Add equipment':modal==='maintenance'?'Schedule maintenance':modal==='calibration'?'Add calibration record':modal==='repairs'?'Add repair record':'Add spare part'} onClose={closeModal}><RecordForm kind={modal==='equipment-edit'?'equipment':modal} equipment={data.equipment} initialValues={editingEquipment||{}} onSubmit={modal==='equipment-edit'?updateEquipment:values=>addRecord(modal,values)} onCancel={closeModal}/></Modal>}
    {toast&&<div className={`toast ${toast.type==='error'?'toast-error':''}`} role="status" aria-live="polite"><span>{toast.type==='error'?'!':'✓'}</span>{toast.message}</div>}
  </div>;
}
