const VIDEO_CATALOG=[
  ['01','Manage and publish research data with NOMAD Central','central.html','app.js','NOMAD Central','Explainer'],
  ['02','Manage lab data with NOMAD Oasis','oasis.html','oasis.js','NOMAD Oasis','Explainer'],
  ['03','Building the NOMAD ecosystem','developers-nomad.html','developers-nomad.js','NOMAD Central','Developer story'],
  ['04','Designing the NOMAD experience','developers-designing-experience.html','developers-designing-experience.js','NOMAD Central','Developer story'],
  ['05','Data modeling in computations','developers-data-modeling-computations.html','developers-data-modeling-computations.js','NOMAD Central','Developer story'],
  ['06','Data modeling in experiments','developers-data-modeling-experiments.html','developers-data-modeling-experiments.js','NOMAD Central','Developer story'],
  ['07','Domain-specific search apps in NOMAD','developers-domain-search-apps.html','developers-domain-search-apps.js','NOMAD Central','Developer story'],
  ['08','A trusted platform for research data','developers-trusted-platform.html','developers-trusted-platform.js','NOMAD Central','Developer story'],
  ['09','Automating research workflows','developers-automating-research-workflows.html','developers-automating-research-workflows.js','NOMAD Oasis','Developer story'],
  ['10','Extending NOMAD with plugins','developers-extending-nomad-plugins.html','developers-extending-nomad-plugins.js','NOMAD Oasis','Developer story'],
  ['11','Synthesis and ELN data modeling','developers-synthesis-eln-data-modeling.html','developers-synthesis-eln-data-modeling.js','NOMAD Oasis','Developer story'],
  ['12','Setting up NOMAD Oasis','developers-setting-up-oasis.html','developers-setting-up-oasis.js','NOMAD Oasis','Developer story'],
  ['13','From installation to a production-ready Oasis','developers-production-ready-oasis.html','developers-production-ready-oasis.js','NOMAD Oasis','Developer story'],
  ['14','From calculations to published datasets','users-from-calculations-to-published-datasets.html','users-from-calculations-to-published-datasets.js','NOMAD Central','Researcher story'],
  ['15','NOMAD data for AI-driven materials discovery','users-nomad-data-for-ai-driven-materials-discovery.html','users-nomad-data-for-ai-driven-materials-discovery.js','NOMAD Central','Researcher story'],
  ['16','Connecting samples, experiments, and data','users-connecting-samples-experiments-data.html','users-connecting-samples-experiments-data.js','NOMAD Oasis','Researcher story'],
  ['17','Bringing photovoltaics data together','users-bringing-photovoltaics-data-together.html','users-bringing-photovoltaics-data-together.js','NOMAD Oasis','Researcher story'],
  ['18','Incorporating data literacy in lab courses','users-incorporating-data-literacy-in-lab-courses.html','users-incorporating-data-literacy-in-lab-courses.js','NOMAD Oasis','Researcher story']
].map(([number,title,page,script,product,category])=>({number,title,page,script,product,category}));

const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const typeLabel=type=>({camera:'Camera footage',screen:'Screen recording',mixed:'Mixed media'}[type]||type);
const formatDuration=seconds=>`${seconds} sec`;

async function loadCatalog(){
  const videos=await Promise.all(VIDEO_CATALOG.map(async video=>{
    const source=await fetch(`./${video.script}`,{cache:'no-store'}).then(response=>{
      if(!response.ok) throw new Error(`Could not load ${video.script}`);
      return response.text();
    });
    const match=source.match(/const\s+raw\s*=\s*(\[[\s\S]*?\]);[\s\S]*?const\s+scenes/);
    if(!match) throw new Error(`Scene data not found in ${video.script}`);
    const rows=Function(`"use strict";return (${match[1]})`)();
    return rows.map(([id,title,start,duration,sentence,footage,location,actors,type])=>({
      ...video,id,title,start,duration,sentence,footage,location,
      actors:Array.isArray(actors)?actors.join(', '):actors,type,
      footageId:`V${video.number}-F${String(id).padStart(2,'0')}`
    }));
  }));
  return videos.flat();
}

function renderCatalog(rows,mode){
  const body=document.getElementById('catalogRows');
  const empty=document.getElementById('catalogEmpty');
  const count=document.getElementById('catalogCount');
  const query=document.getElementById('catalogSearch').value.trim().toLowerCase();
  const product=document.getElementById('productFilter').value;
  const type=document.getElementById('typeFilter')?.value||'';
  const visible=rows.filter(row=>(!product||row.product===product)&&(!type||row.type===type)&&(!query||[row.footageId,row.title,row.footage,row.location,row.actors,row.category,row.product].join(' ').toLowerCase().includes(query)));
  count.textContent=`${visible.length} ${mode==='recordings'?'recordings':'footage items'}`;
  empty.hidden=visible.length>0;
  body.innerHTML=visible.map(row=>mode==='recordings'?`
    <tr><td><span class="catalog-id">${escapeHtml(row.footageId)}</span><span class="type-pill ${escapeHtml(row.type)}">${escapeHtml(typeLabel(row.type))}</span></td>
    <td><a href="./${escapeHtml(row.page)}"><small>${escapeHtml(row.number)} · ${escapeHtml(row.category)}</small>${escapeHtml(row.title)}</a></td>
    <td><strong>${escapeHtml(row.title)}</strong><p>${escapeHtml(row.footage)}</p></td><td>${escapeHtml(row.location)}</td><td>${escapeHtml(row.actors)}</td><td>${formatDuration(row.duration)}</td></tr>`:`
    <tr><td><span class="catalog-id">${escapeHtml(row.footageId)}</span><span class="type-pill ${escapeHtml(row.type)}">${escapeHtml(typeLabel(row.type))}</span></td>
    <td><a href="./${escapeHtml(row.page)}"><small>${escapeHtml(row.number)} · ${escapeHtml(row.category)}</small>${escapeHtml(row.title)}</a></td>
    <td><strong>${escapeHtml(row.title)}</strong><p>${escapeHtml(row.footage)}</p></td><td>${escapeHtml(row.location)}</td><td>${escapeHtml(row.actors)}</td></tr>`).join('');
}

async function initializeCatalog(){
  const mode=document.body.dataset.catalogMode;
  const loading=document.getElementById('catalogLoading');
  try{
    let rows=await loadCatalog();
    if(mode==='recordings') rows=rows.filter(row=>row.type==='camera'||row.type==='mixed');
    const update=()=>renderCatalog(rows,mode);
    document.querySelectorAll('.catalog-control').forEach(control=>control.addEventListener(control.tagName==='INPUT'?'input':'change',update));
    loading.hidden=true;
    update();
  }catch(error){
    loading.textContent=`The production data could not be loaded: ${error.message}`;
    loading.classList.add('catalog-error');
  }
}

initializeCatalog();
