const totalRuntime = 34;
const raw = [
[1,'Long-term data preservation',0,14,'When researchers publish their data, they need to trust that it will remain available for years to come. Research data uploaded to NOMAD are stored at the Max Planck Computing and Data Facility in Germany.','Two camera footages: a researcher at a workstation, followed by a combined view of the MPCDF exterior and data-center interior.','Office (location TBC) / MPCDF, Germany',['Researcher (name TBC)'],'camera'],
[2,'Regular backups and long-term preservation',14,12,'With regular backups and a commitment to preserve data for at least ten years, we make sure their research is preserved for the future.','Raphael Ritz speaks to camera.','Office 1.108',['Raphael Ritz'],'camera'],
[3,'Join the community',26,4,'For more information visit our website and join us on Discord.','Raphael Ritz speaks to camera.','Office 1.108',['Raphael Ritz'],'camera']
];
const scene1Shots = [
  {
    "id": "1.1",
    "title": "Researcher at a workstation",
    "image": "../public/developers-trusted-platform-scene-01-shot-01-researcher-workstation.png",
    "alt": "Researcher working at a desk beside office windows",
    "description": "Supplied image of a researcher working at a computer.",
    "location": "Office (location TBC)",
    "actors": [
      "Researcher (name TBC)"
    ],
    "type": "camera"
  },
  {
    "id": "1.2",
    "title": "MPCDF and data-center infrastructure",
    "images": [
      "../public/developers-trusted-platform-scene-01-shot-02-mpcdf-exterior.png",
      "../public/developers-trusted-platform-scene-01-shot-02-data-center.png"
    ],
    "alts": [
      "Exterior of the Max Planck Computing and Data Facility",
      "Data-center interior with rows of server racks"
    ],
    "description": "Combine the supplied MPCDF exterior and data-center interior images as two representative views of one footage.",
    "location": "MPCDF, Germany",
    "actors": [
      "No visible people"
    ],
    "type": "camera"
  }
];
const shotArrays = {0: scene1Shots};
const scenes = raw.map(([id,title,start,duration,sentence,footage,location,actors,type]) => ({id,title,start,duration,sentence,footage,location,actors,type}));
let active=0,time=0,playing=false,timer=null;const $=id=>document.getElementById(id),fmt=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
function renderList(){const q=$('search').value.toLowerCase(),visible=scenes.filter(s=>`${s.title} ${s.sentence} ${s.location}`.toLowerCase().includes(q));$('count').textContent=visible.length;$('sentence-list').innerHTML=visible.map(s=>`<button data-id="${s.id}" class="sentence-item ${s.id===scenes[active].id?'is-active':''}"><span class="scene-number">${String(s.id).padStart(2,'0')}</span><span class="sentence-copy"><strong>${s.title}</strong><span>${s.sentence}</span><small>${fmt(s.start)} – ${fmt(s.start+s.duration)}</small></span></button>`).join('')||'<div class="empty">No matching sentences</div>';document.querySelectorAll('.sentence-item').forEach(b=>b.onclick=()=>select(+b.dataset.id-1))}
function renderTrack(){$('track').innerHTML=scenes.map((s,i)=>`<button data-index="${i}" aria-label="Scene ${s.id}: ${s.title}" class="clip clip-${s.type} ${i===active?'is-active':''}" style="width:${(s.duration/totalRuntime)*100}%"><span>${s.id}</span></button>`).join('');$('scene-dots').innerHTML=scenes.map((s,i)=>`<button data-index="${i}" aria-label="Go to scene ${s.id}" class="${i===active?'active':''}"></button>`).join('');document.querySelectorAll('[data-index]').forEach(b=>b.onclick=()=>select(+b.dataset.index))}
function render(){const s=scenes[active];$('timecode').textContent=fmt(time);$('playhead').style.left=`${(time/totalRuntime)*100}%`;$('scrubber').value=time;$('scene-counter').textContent=`SCENE ${String(s.id).padStart(2,'0')} OF ${scenes.length}`;$('duration').textContent=`${s.duration} SEC`;$('preview').className=`preview preview-${s.type}`;$('shot-label').textContent=`FOOTAGE ${String(s.id).padStart(2,'0')} · ${s.type==='screen'?'SCREEN RECORDING':s.type==='mixed'?'MIXED MEDIA':'CAMERA FOOTAGE'}`;$('normal-preview').hidden=false;$('preview-location').textContent=s.location;$('victoria-preview').hidden=true;$('triangle-preview').hidden=true;$('end-card').hidden=true;$('scene1-shot-list').hidden=true;$('standard-footage').hidden=false;$('footage').textContent=s.footage;$('location').textContent=s.location;$('actors').innerHTML=s.actors.map(a=>`<em>${a}</em>`).join('');$('preview-time').textContent=`${fmt(s.start)} – ${fmt(s.start+s.duration)}`;$('quote').textContent=`“${s.sentence}”`;$('detail-duration').textContent=`${s.duration} seconds`;$('previous').disabled=active===0;$('next').disabled=active===scenes.length-1;const shots=shotArrays[active];if(shots){$('normal-preview').hidden=true;$('triangle-preview').hidden=false;$('triangle-preview').className='triangle-preview two-shot-array';$('scene1-shot-list').hidden=false;$('standard-footage').hidden=true;$('triangle-preview').innerHTML=shots.map(shot=>`<figure class="triangle-shot">${shot.images?`<div class="representative-pair">${shot.images.map((image,i)=>`<img src="${image}" alt="${shot.alts[i]}">`).join('')}</div>`:`<img src="${shot.image}" alt="${shot.alt}">`}<figcaption><b>FOOTAGE ${shot.id}: CAMERA FOOTAGE</b><span>${shot.title}</span></figcaption></figure>`).join('');$('scene1-shot-list').innerHTML=shots.map(shot=>`<article class="shot-detail"><div class="shot-detail-number">${shot.id}</div><div><strong>${shot.title}</strong><p>${shot.description}</p><dl><div><dt>LOCATION</dt><dd>${shot.location}</dd></div><div><dt>ACTORS</dt><dd>${shot.actors.join(', ')}</dd></div></dl></div></article>`).join('');}if(s.id===2||s.id===3){$('victoria-preview').src='../public/speaker-raphael-ritz-office.png';$('victoria-preview').alt='Supplied speaker image beside a display of computing and data services';$('victoria-preview').hidden=false;$('normal-preview').hidden=true;}renderList();renderTrack()}
function select(i){active=Math.max(0,Math.min(scenes.length-1,i));time=scenes[active].start;render()}function seek(value){time=Math.max(0,Math.min(totalRuntime,value));active=Math.max(0,scenes.findLastIndex(s=>s.start<=time));render()}
$('play').onclick=()=>{playing=!playing;$('play').textContent=playing?'Ⅱ':'▶';if(playing){timer=setInterval(()=>{time=Math.min(totalRuntime,time+.1);active=Math.max(0,scenes.findLastIndex(s=>s.start<=time));render();if(time>=totalRuntime){playing=false;$('play').textContent='▶';clearInterval(timer)}},100)}else clearInterval(timer)};$('scrubber').max=totalRuntime;$('scrubber').oninput=e=>seek(+e.target.value);$('previous').onclick=()=>select(active-1);$('next').onclick=()=>select(active+1);$('search').oninput=renderList;$('toggle').onclick=()=>{const open=$('toggle').getAttribute('aria-checked')==='true';$('toggle').setAttribute('aria-checked',String(!open));$('details').hidden=open;$('reopen').hidden=!open};$('reopen').onclick=()=>$('toggle').click();render();
