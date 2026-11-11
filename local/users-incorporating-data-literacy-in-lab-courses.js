const totalRuntime = 34;
const raw = [
[1, "Oasis as a teaching tool", 0, 6, "In my group at the Physics Department of Humboldt Universit\u00e4t zu Berlin, we use the NOMAD Oasis platform as a tool\u2026", "Speaker addresses the camera in front of display cabinets, using the supplied speaker image.", "Physics Department, Humboldt Universit\u00e4t zu Berlin (room TBC)", ["Speaker (name TBC)"], "camera"],
[2, "Training across study stages", 6, 8, "for training our students in both fundamental courses, basic practicals, advanced practicals, bachelor, master and PhD projects.", "Paired representative images of one camera footage: a tutor and student discussing a model at a workstation, and a wider view of laboratory training.", "Laboratory (location TBC)", ["Tutor (name TBC)", "Student (name TBC)"], "camera"],
[3, "Organizing experimental data", 14, 12, "We find that this is a great tool for them to organize the data that they record experimentally, and also the data that they generate by processing this data,", "Paired representative images of one camera footage: tutor and student discussing experimental data at the monitors, and a close view of the displayed data.", "Laboratory (location TBC)", ["Tutor (name TBC)", "Student (name TBC)"], "camera"],
[4, "Monitoring student progress", 26, 4, "and also for us as mentors and tutors to monitor the progress and have time-stamped records of what they have done.", "Return to the same speaker-to-camera image used in scene 1.", "Physics Department, Humboldt Universit\u00e4t zu Berlin (room TBC)", ["Speaker (name TBC)"], "camera"]
];
const scenes = raw.map(([id,title,start,duration,sentence,footage,location,actors,type]) => ({id,title,start,duration,sentence,footage,location,actors,type}));
let active=0,time=0,playing=false,timer=null;const $=id=>document.getElementById(id),fmt=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
const sceneVisuals = {
  "1": [
    {
      "src": "../public/users-incorporating-data-literacy-in-lab-courses-scene-01-speaker.png",
      "alt": "Speaker addressing the camera in front of scientific display cabinets"
    }
  ],
  "2": [
    {
      "src": "../public/users-incorporating-data-literacy-in-lab-courses-scene-02-shot-01-lab-tutoring.png",
      "alt": "Tutor and student discussing a model at a laboratory workstation"
    },
    {
      "src": "../public/users-incorporating-data-literacy-in-lab-courses-scene-02-shot-02-lab-training.png",
      "alt": "Wider view of tutor and student training in the laboratory"
    }
  ],
  "3": [
    {
      "src": "../public/users-incorporating-data-literacy-in-lab-courses-scene-03-shot-01-data-discussion.png",
      "alt": "Tutor and student reviewing experimental data on laboratory monitors"
    },
    {
      "src": "../public/users-incorporating-data-literacy-in-lab-courses-scene-03-shot-02-data-analysis.png",
      "alt": "Close view of a tutor pointing to experimental data on a monitor"
    }
  ],
  "4": [
    {
      "src": "../public/users-incorporating-data-literacy-in-lab-courses-scene-01-speaker.png",
      "alt": "Return to the speaker addressing the camera"
    }
  ]
};
const literacyVisual = document.createElement("div");
literacyVisual.id = "literacy-visual";
literacyVisual.hidden = true;
$("preview").appendChild(literacyVisual);
function renderList(){const q=$('search').value.toLowerCase(),visible=scenes.filter(s=>`${s.title} ${s.sentence} ${s.location}`.toLowerCase().includes(q));$('count').textContent=visible.length;$('sentence-list').innerHTML=visible.map(s=>`<button data-id="${s.id}" class="sentence-item ${s.id===scenes[active].id?'is-active':''}"><span class="scene-number">${String(s.id).padStart(2,'0')}</span><span class="sentence-copy"><strong>${s.title}</strong><span>${s.sentence}</span><small>${fmt(s.start)} – ${fmt(s.start+s.duration)}</small></span></button>`).join('')||'<div class="empty">No matching sentences</div>';document.querySelectorAll('.sentence-item').forEach(b=>b.onclick=()=>select(+b.dataset.id-1))}
function renderTrack(){$('track').innerHTML=scenes.map((s,i)=>`<button data-index="${i}" aria-label="Scene ${s.id}: ${s.title}" class="clip clip-${s.type} ${i===active?'is-active':''}" style="width:${(s.duration/totalRuntime)*100}%"><span>${s.id}</span></button>`).join('');$('scene-dots').innerHTML=scenes.map((s,i)=>`<button data-index="${i}" aria-label="Go to scene ${s.id}" class="${i===active?'active':''}"></button>`).join('');document.querySelectorAll('[data-index]').forEach(b=>b.onclick=()=>select(+b.dataset.index))}
function render(){const s=scenes[active];$('timecode').textContent=fmt(time);$('playhead').style.left=`${(time/totalRuntime)*100}%`;$('scrubber').value=time;$('scene-counter').textContent=`SCENE ${String(s.id).padStart(2,'0')} OF ${scenes.length}`;$('duration').textContent=`${s.duration} SEC`;$('preview').className=`preview preview-${s.type}`;$('shot-label').textContent=`FOOTAGE ${String(s.id).padStart(2,'0')} · ${s.type==='screen'?'SCREEN RECORDING':s.type==='mixed'?'MIXED MEDIA':'CAMERA FOOTAGE'}`;$('normal-preview').hidden=false;$('preview-location').textContent=s.location;$('victoria-preview').hidden=true;$('triangle-preview').hidden=true;$('end-card').hidden=true;$('scene1-shot-list').hidden=true;$('standard-footage').hidden=false;$('footage').textContent=s.footage;$('location').textContent=s.location;$('actors').innerHTML=s.actors.map(a=>`<em>${a}</em>`).join('');$('preview-time').textContent=`${fmt(s.start)} – ${fmt(s.start+s.duration)}`;$('quote').textContent=`“${s.sentence}”`;$('detail-duration').textContent=`${s.duration} seconds`;$('previous').disabled=active===0;$('next').disabled=active===scenes.length-1;const visuals=sceneVisuals[s.id];literacyVisual.hidden=!visuals;if(visuals){literacyVisual.className=visuals.length===2?'literacy-visual literacy-pair':'literacy-visual';literacyVisual.innerHTML=visuals.map(image=>`<img src="${image.src}" alt="${image.alt}">`).join('');$('normal-preview').hidden=true;}renderList();renderTrack()}
function select(i){active=Math.max(0,Math.min(scenes.length-1,i));time=scenes[active].start;render()}function seek(value){time=Math.max(0,Math.min(totalRuntime,value));active=Math.max(0,scenes.findLastIndex(s=>s.start<=time));render()}
$('play').onclick=()=>{playing=!playing;$('play').textContent=playing?'Ⅱ':'▶';if(playing){timer=setInterval(()=>{time=Math.min(totalRuntime,time+.1);active=Math.max(0,scenes.findLastIndex(s=>s.start<=time));render();if(time>=totalRuntime){playing=false;$('play').textContent='▶';clearInterval(timer)}},100)}else clearInterval(timer)};$('scrubber').max=totalRuntime;$('scrubber').oninput=e=>seek(+e.target.value);$('previous').onclick=()=>select(active-1);$('next').onclick=()=>select(active+1);$('search').oninput=renderList;$('toggle').onclick=()=>{const open=$('toggle').getAttribute('aria-checked')==='true';$('toggle').setAttribute('aria-checked',String(!open));$('details').hidden=open;$('reopen').hidden=!open};$('reopen').onclick=()=>$('toggle').click();render();
