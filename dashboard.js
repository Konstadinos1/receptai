(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const calls = [
    { id:1, name:'Sarah Mitchell', initials:'SM', phone:'(416) 555-0134', reason:'AC not cooling', subreason:'Emergency service', date:'Today, 10:42 AM', duration:'4m 12s', clock:'4:12', seconds:252, outcome:'booked', label:'Booked', sentiment:'Positive', avatar:'violet', value:'$485', summary:'Caller reported that their AC stopped cooling overnight. Mia confirmed the service area, collected the unit details, and booked the earliest repair window.', details:{Service:'Emergency AC repair',Address:'142 Maplewood Drive',Appointment:'Thu, Jul 23 · 9:00 AM',Unit:'Lennox central air · 8 years old','Estimated value':'$485'}, transcript:[['Mia','M','Thanks for calling Northstar Heating & Air. This is Mia, your virtual receptionist. How can I make your day more comfortable?','0:03'],['Sarah','SM','Hi, our air conditioner stopped cooling sometime last night. It’s getting pretty warm in here.','0:12'],['Mia','M','I’m sorry you’re dealing with that, Sarah. Is the system running but blowing warm air, or not turning on at all?','0:21'],['Sarah','SM','It’s running, but the air coming out isn’t cold.','0:34'],['Mia','M','I have an emergency repair window tomorrow at 9:00 AM. Would that work for you?','0:41'],['Sarah','SM','Yes, that would be perfect.','0:48'],['Mia','M','You’re all set. I’ll text the details now, and your technician will call when they’re on the way.','0:56']] },
    { id:2, name:'David Lee', initials:'DL', phone:'(647) 555-0198', reason:'New furnace quote', subreason:'Replacement system', date:'Today, 9:18 AM', duration:'2m 47s', clock:'2:47', seconds:167, outcome:'lead', label:'Qualified lead', sentiment:'Positive', avatar:'blue', value:'$8,200', summary:'David is replacing a 17-year-old furnace in a 2,400 sq ft home. Budget and timeline are confirmed. Mia scheduled an in-home estimate.', details:{Service:'Furnace installation estimate','Home size':'2,400 sq ft',Timeline:'Within 2 weeks',Appointment:'Thu, Jul 23 · 11:30 AM','Estimated value':'$8,200'}, transcript:[['Mia','M','Thanks for calling Northstar Heating & Air. How can I help today?','0:03'],['David','DL','I’m looking to replace our furnace before winter. It’s old and our bills keep going up.','0:10'],['Mia','M','I can arrange a no-obligation estimate. About how large is your home?','0:21'],['David','DL','Around twenty-four hundred square feet.','0:29'],['Mia','M','I have an estimator available Thursday at 11:30 AM. Shall I reserve that?','0:38']] },
    { id:3, name:'Unknown caller', initials:'?', phone:'(289) 555-0112', reason:'Service area question', subreason:'General inquiry', date:'Today, 8:56 AM', duration:'1m 06s', clock:'1:06', seconds:66, outcome:'answered', label:'Answered', sentiment:'Neutral', avatar:'green', value:'—', summary:'Caller asked whether Northstar services Milton. Mia confirmed coverage and provided the standard dispatch fee.', details:{Question:'Service coverage',City:'Milton',Answer:'Within service area','Follow-up':'Not requested','Estimated value':'—'}, transcript:[['Mia','M','Thanks for calling Northstar Heating & Air. How can I help?','0:03'],['Caller','?','Do you service Milton, or is that too far west?','0:10'],['Mia','M','We service Milton. Our $89 dispatch fee is applied toward approved repairs.','0:18']] },
    { id:4, name:'Maria Hernandez', initials:'MH', phone:'(905) 555-0167', reason:'Seasonal tune-up', subreason:'Maintenance', date:'Yesterday, 4:21 PM', duration:'3m 02s', clock:'3:02', seconds:182, outcome:'booked', label:'Booked', sentiment:'Positive', avatar:'green', value:'$189', summary:'Maria arranged annual maintenance. Mia booked a tune-up and sent an SMS confirmation.', details:{Service:'Seasonal HVAC tune-up',Address:'317 King Street W',Appointment:'Thu, Jul 23 · 2:00 PM',Customer:'Returning','Estimated value':'$189'}, transcript:[['Mia','M','Thanks for calling Northstar Heating & Air. How can I help?','0:03'],['Maria','MH','I’d like to book our regular tune-up before things get busy.','0:10'],['Mia','M','I found your profile. Would Thursday at 2:00 PM work?','0:19'],['Maria','MH','That works great, thank you.','0:27']] },
    { id:5, name:'Robert Chen', initials:'RC', phone:'(416) 555-0177', reason:'Heat pump replacement', subreason:'High-intent quote', date:'Yesterday, 1:07 PM', duration:'5m 38s', clock:'5:38', seconds:338, outcome:'lead', label:'Qualified lead', sentiment:'Positive', avatar:'blue', value:'$7,100', summary:'Robert’s 14-year-old heat pump requires frequent repairs. Mia qualified the opportunity and routed it to a comfort advisor.', details:{Service:'Heat pump replacement','Current unit age':'14 years','Home ownership':'Confirmed','Follow-up':'Sales callback requested','Estimated value':'$7,100'}, transcript:[['Mia','M','Thanks for calling Northstar Heating & Air. What can I help with?','0:03'],['Robert','RC','Our heat pump is fourteen years old and we’re spending too much keeping it alive.','0:12'],['Mia','M','I can help you explore replacement options. Are you the homeowner?','0:23'],['Robert','RC','Yes. I’d like to understand rebates and financing too.','0:29']] },
    { id:6, name:'Emily Brown', initials:'EB', phone:'(647) 555-0141', reason:'Ductless mini-split', subreason:'New installation', date:'Mon, 3:34 PM', duration:'2m 18s', clock:'2:18', seconds:138, outcome:'lead', label:'Qualified lead', sentiment:'Positive', avatar:'violet', value:'$4,800', summary:'Emily is finishing a home-office addition and wants a quiet ductless system. Mia captured details and requested a sales follow-up.', details:{Service:'Ductless mini-split',Room:'Home office addition',Timeline:'Next 30 days','Follow-up':'Advisor callback','Estimated value':'$4,800'}, transcript:[['Mia','M','Thanks for calling Northstar Heating & Air. How can I help?','0:03'],['Emily','EB','We added a home office and need heating and cooling without extending the ductwork.','0:13'],['Mia','M','A ductless mini-split may be a good fit. I can have an advisor call to discuss options.','0:24']] },
    { id:7, name:'Tom Wilson', initials:'TW', phone:'(416) 555-0155', reason:'Commercial maintenance', subreason:'Service agreement', date:'Mon, 11:02 AM', duration:'3m 45s', clock:'3:45', seconds:225, outcome:'answered', label:'Follow-up', sentiment:'Neutral', avatar:'green', value:'$3,600', summary:'Tom asked about quarterly maintenance for a retail store. Mia captured the equipment count and assigned a follow-up task.', details:{Service:'Commercial maintenance',Property:'Retail · 4,100 sq ft',Equipment:'2 rooftop units','Follow-up':'Commercial advisor','Estimated value':'$3,600/year'}, transcript:[['Mia','M','Thanks for calling Northstar Heating & Air. How can I help?','0:03'],['Tom','TW','I manage a shop downtown and need someone to maintain two rooftop units.','0:11'],['Mia','M','We offer commercial agreements. I’ll collect details for our commercial advisor.','0:22']] },
  ];
  let filter = 'all';
  let currentCall = calls[0];
  let playerTimer = null;
  let playerElapsed = 0;
  let testTimer = null;
  let testElapsed = 0;

  function toast(message) {
    const el = document.createElement('div');
    const icon = document.createElement('span');
    const copy = document.createElement('strong');
    el.className = 'toast'; icon.textContent = '✓'; copy.textContent = message;
    el.append(icon, copy); $('#toast-stack').append(el);
    setTimeout(() => { el.classList.add('is-leaving'); setTimeout(() => el.remove(), 220); }, 2800);
  }

  function applyProfile() {
    let profile;
    try { profile = JSON.parse(localStorage.getItem('receptai_profile')); } catch (_) { profile = null; }
    if (!profile) return;
    const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Jordan Davis';
    const initials = `${profile.firstName?.[0] || 'J'}${profile.lastName?.[0] || 'D'}`.toUpperCase();
    const business = profile.businessName || 'Northstar Heating & Air';
    $$('[data-user-name]').forEach((el) => { el.textContent = fullName; });
    $$('[data-user-first]').forEach((el) => { el.textContent = profile.firstName || 'Jordan'; });
    $$('[data-user-email]').forEach((el) => { el.textContent = profile.email || 'jordan@northstarhvac.com'; });
    $$('[data-user-initials]').forEach((el) => { el.textContent = initials; });
    $$('[data-business-short]').forEach((el) => { el.textContent = business.replace(/Heating & Air/i, 'HVAC'); });
    $$('[data-business-input]').forEach((el) => { el.value = business; });
    $$('.workspace-avatar').forEach((el) => { if (el.textContent.trim() === 'NH') el.textContent = business.split(/\s+/).slice(0,2).map((word) => word[0]).join('').toUpperCase(); });
  }

  const today = new Date();
  $('#today-label').textContent = new Intl.DateTimeFormat('en-CA',{weekday:'long',month:'long',day:'numeric'}).format(today);
  $('#day-part').textContent = today.getHours() < 12 ? 'morning' : today.getHours() < 18 ? 'afternoon' : 'evening';

  function closeSidebar() { $('#sidebar').classList.remove('is-open'); $('#mobile-scrim').classList.remove('is-open'); }
  function closeDrawer() { $('#call-drawer').classList.remove('is-open'); $('#call-drawer').setAttribute('aria-hidden','true'); $('#drawer-scrim').classList.remove('is-open'); stopPlayer(); }
  function switchView(name, updateHash=true) {
    if (!$(`#view-${name}`)) return;
    $$('.dashboard-view').forEach((view) => view.classList.toggle('is-active', view.id === `view-${name}`));
    $$('.nav-item').forEach((item) => item.classList.toggle('is-active', item.dataset.view === name));
    if (updateHash) history.replaceState(null,'',`#${name}`);
    scrollTo({top:0,behavior:'smooth'}); closeSidebar(); closeDrawer();
  }
  $$('.nav-item').forEach((item) => item.addEventListener('click',() => switchView(item.dataset.view)));
  $$('[data-view-link]').forEach((item) => item.addEventListener('click',() => switchView(item.dataset.viewLink)));
  $('#mobile-menu').addEventListener('click',() => { $('#sidebar').classList.add('is-open'); $('#mobile-scrim').classList.add('is-open'); });
  $('#sidebar-close').addEventListener('click',closeSidebar); $('#mobile-scrim').addEventListener('click',closeSidebar);

  const statusClass = (call) => call.outcome === 'booked' ? 'booked' : call.outcome === 'lead' ? 'lead' : 'answered';
  function renderRecent() {
    $('#recent-call-list').innerHTML = calls.slice(0,4).map((call) => `<div class="mini-call" role="button" tabindex="0" data-call="${call.id}"><span class="call-avatar ${call.avatar}">${call.initials}</span><div><strong>${call.name}</strong><p>${call.reason} · ${call.duration}</p></div><span class="status-pill ${statusClass(call)}">${call.label}</span><small>${call.date.split(', ').pop()}</small><svg class="icon"><use href="#i-chevron"/></svg></div>`).join('');
    $$('.mini-call').forEach((row) => { row.addEventListener('click',() => openCall(+row.dataset.call)); row.addEventListener('keydown',(e) => { if(e.key==='Enter') openCall(+row.dataset.call); }); });
  }
  function matchingCalls() {
    const query = $('#call-search').value.trim().toLowerCase();
    return calls.filter((call) => (filter === 'all' || call.outcome === filter) && (!query || `${call.name} ${call.phone} ${call.reason}`.toLowerCase().includes(query)));
  }
  function renderCalls() {
    const items = matchingCalls();
    $('#calls-count').textContent = `Showing ${items.length} conversation${items.length===1?'':'s'}`;
    $('#calls-table-body').innerHTML = items.length ? items.map((call) => `<tr data-call="${call.id}"><td><div class="caller-cell"><span class="call-avatar ${call.avatar}">${call.initials}</span><div><strong>${call.name}</strong><small>${call.phone}</small></div></div></td><td><div class="reason-cell"><strong>${call.reason}</strong><small>${call.subreason}</small></div></td><td>${call.date}</td><td>${call.duration}</td><td><span class="status-pill ${statusClass(call)}">${call.label}</span></td><td><span class="sentiment ${call.sentiment.toLowerCase()}"><i></i>${call.sentiment}</span></td><td><button class="row-arrow"><svg class="icon"><use href="#i-chevron"/></svg></button></td></tr>`).join('') : '<tr class="empty-table"><td colspan="7">No conversations match those filters.</td></tr>';
    $$('#calls-table-body tr[data-call]').forEach((row) => row.addEventListener('click',() => openCall(+row.dataset.call)));
  }
  $$('#call-filters button').forEach((button) => button.addEventListener('click',() => { filter=button.dataset.filter; $$('#call-filters button').forEach((item) => item.classList.toggle('is-active',item===button)); renderCalls(); }));
  $('#call-search').addEventListener('input',renderCalls);
  $('#call-date-filter').addEventListener('change',() => { renderCalls(); toast(`Showing ${$('#call-date-filter').value.toLowerCase()}`); });

  function buildWave() { const heights=[32,52,77,45,68,90,58,36,72,49,81,62,40,95,64,52,78,44,68,86,57,37,74,92,51,66,84,46,70,54,89,62,38,73,55,82,47,64,91,58,75,42,67,53,80,45,69,87,56,72]; $('#player-wave').innerHTML=heights.map((h)=>`<i style="height:${h}%"></i>`).join(''); }
  function openCall(id) {
    const call=calls.find((item)=>item.id===id); if(!call) return; currentCall=call; playerElapsed=0;
    $('#drawer-name').textContent=call.name; $('#drawer-phone').textContent=call.phone; $('#drawer-date').textContent=call.date; $('#drawer-duration').textContent=call.duration; $('#drawer-sentiment').textContent=call.sentiment; $('#drawer-summary').textContent=call.summary; $('#player-duration').textContent=call.clock; $('#player-current').textContent='0:00'; $('#drawer-status').textContent=call.label; $('#drawer-status').className=`status-pill ${statusClass(call)}`;
    $('#drawer-transcript').innerHTML=call.transcript.map(([speaker,initials,line,time])=>`<div class="transcript-line ${speaker==='Mia'?'':'caller'}"><span class="transcript-speaker">${initials}</span><div class="transcript-copy"><strong>${speaker}</strong><p>${line}</p></div><small>${time}</small></div>`).join('');
    $('#drawer-details').innerHTML=`<div class="captured-list">${Object.entries(call.details).map(([key,value])=>`<div><span>${key}</span><strong>${value}</strong></div>`).join('')}</div>`;
    buildWave(); $('#call-drawer').classList.add('is-open'); $('#call-drawer').setAttribute('aria-hidden','false'); $('#drawer-scrim').classList.add('is-open');
  }
  $('#close-drawer').addEventListener('click',closeDrawer); $('#drawer-scrim').addEventListener('click',closeDrawer);
  $$('.drawer-tabs button').forEach((button)=>button.addEventListener('click',()=>{ $$('.drawer-tabs button').forEach((item)=>item.classList.toggle('is-active',item===button)); $$('[data-drawer-panel]').forEach((panel)=>panel.classList.toggle('is-active',panel.dataset.drawerPanel===button.dataset.drawerTab)); }));
  function stopPlayer(){ clearInterval(playerTimer); playerTimer=null; $('#call-play').innerHTML='<svg class="icon"><use href="#i-play"/></svg>'; }
  $('#call-play').addEventListener('click',()=>{ if(playerTimer){stopPlayer();return;} $('#call-play').innerHTML='<svg class="icon"><use href="#i-pause"/></svg>'; playerTimer=setInterval(()=>{playerElapsed=Math.min(playerElapsed+1,currentCall.seconds); $('#player-current').textContent=`${Math.floor(playerElapsed/60)}:${String(playerElapsed%60).padStart(2,'0')}`; const bars=$$('#player-wave i');bars.forEach((bar,i)=>bar.classList.toggle('is-played',i/bars.length<=playerElapsed/currentCall.seconds));if(playerElapsed>=currentCall.seconds)stopPlayer();},1000); });
  $('#copy-transcript').addEventListener('click',async()=>{const text=currentCall.transcript.map(([speaker,,line,time])=>`[${time}] ${speaker}: ${line}`).join('\n\n');try{await navigator.clipboard.writeText(text);toast('Transcript copied to clipboard');}catch(_){toast('Transcript ready to copy');}});
  $('#export-calls').addEventListener('click',()=>{const rows=[['Caller','Phone','Reason','Date','Duration','Outcome','Sentiment','Value'],...calls.map((c)=>[c.name,c.phone,c.reason,c.date,c.duration,c.label,c.sentiment,c.value])];const csv=rows.map((row)=>row.map((cell)=>`"${String(cell).replaceAll('"','""')}"`).join(',')).join('\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));const link=document.createElement('a');link.href=url;link.download='receptai-calls-july-2026.csv';link.click();URL.revokeObjectURL(url);toast('Call report exported');});

  function renderCalendar(){const dates=[];[28,29,30].forEach((d)=>dates.push(`<button class="muted">${d}</button>`));for(let d=1;d<=31;d++){const cls=[d===22?'today':'',[3,7,10,15,17,21,22,23,24,28,30].includes(d)?'has-event':''].filter(Boolean).join(' ');dates.push(`<button class="${cls}">${d}</button>`);}[1,2,3,4,5,6,7,8].forEach((d)=>dates.push(`<button class="muted">${d}</button>`));$('#calendar-dates').innerHTML=dates.join('');$$('#calendar-dates button').forEach((button)=>button.addEventListener('click',()=>{$$('#calendar-dates button').forEach((item)=>item.classList.remove('today'));button.classList.add('today');}));}
  function renderAnalytics(){const values=[42,58,49,68,52,73,66,82,61,76,69,88,78,94];$('#bar-line-chart').innerHTML=values.map((value,i)=>`<div class="chart-bar-group"><i class="chart-bar" style="height:${Math.max(15,value-23)}%"></i><i class="chart-bar" style="height:${value}%"></i><span>${i%2?'':`Jul ${i+8}`}</span></div>`).join('');const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],hours=['8a','9a','10a','11a','12p','1p','2p','3p','4p','5p','6p','7p'];let heat='<span></span>'+hours.map((h)=>`<span class="heat-hour">${h}</span>`).join('');days.forEach((day,di)=>{heat+=`<span class="heat-label">${day}</span>`;hours.forEach((_,hi)=>{const level=((di*7+hi*3+(hi>1&&hi<9?2:0))%4)+1;heat+=`<i class="heat-cell level-${level}"></i>`;});});$('#heatmap').innerHTML=heat;}

  function modalState(id,open){$(`#${id}`).classList.toggle('is-open',open);$(`#${id}`).setAttribute('aria-hidden',String(!open));}
  $('#add-appointment').addEventListener('click',()=>modalState('appointment-modal',true));$('#quick-add-appointment').addEventListener('click',()=>modalState('appointment-modal',true));$$('[data-close-modal]').forEach((b)=>b.addEventListener('click',()=>modalState('appointment-modal',false)));$('#appointment-modal').addEventListener('click',(e)=>{if(e.target===$('#appointment-modal'))modalState('appointment-modal',false);});
  $('#appointment-form').addEventListener('submit',(e)=>{e.preventDefault();toast(`Appointment created for ${$('#appointment-name').value}`);modalState('appointment-modal',false);e.currentTarget.reset();});
  function endTest(){clearInterval(testTimer);testTimer=null;$('#start-test-call').classList.remove('is-active');$('#test-status').textContent='Call complete';$('#test-hint').textContent='Click to call again';toast('Private test call completed');}
  function closeTest(){if(testTimer)endTest();modalState('test-call-modal',false);}
  $('#test-agent').addEventListener('click',()=>modalState('test-call-modal',true));$('#test-agent-side').addEventListener('click',()=>modalState('test-call-modal',true));$('[data-close-test]').addEventListener('click',closeTest);$('#test-call-modal').addEventListener('click',(e)=>{if(e.target===$('#test-call-modal'))closeTest();});
  $('#start-test-call').addEventListener('click',()=>{if(testTimer){endTest();return;}testElapsed=0;$('#test-timer').textContent='00:00';$('#test-status').textContent='Connecting…';$('#test-hint').textContent='Click to end call';$('#start-test-call').classList.add('is-active');testTimer=setInterval(()=>{testElapsed++;$('#test-timer').textContent=`${String(Math.floor(testElapsed/60)).padStart(2,'0')}:${String(testElapsed%60).padStart(2,'0')}`;if(testElapsed===2){$('#test-status').textContent='Mia is listening';$('#test-copy').textContent='“Thanks for calling Northstar Heating & Air. How can I make your day more comfortable?”';}},1000);});

  function agentState(active){$('#agent-toggle').checked=active;$('#overview-agent-toggle').checked=active;$('.agent-live-strip strong').textContent=active?'Mia is live and answering calls':'Mia is currently paused';$('.status-line').innerHTML=`<i></i>${active?'Live':'Paused'}`;$('.status-line').style.color=active?'var(--green)':'var(--amber)';toast(active?'Mia is now live':'Mia has been paused');}
  $('#agent-toggle').addEventListener('change',(e)=>agentState(e.target.checked));$('#overview-agent-toggle').addEventListener('change',(e)=>agentState(e.target.checked));
  $('#voice-preview').addEventListener('click',()=>{const button=$('#voice-preview'),playing=button.classList.toggle('is-playing');$('.preview-play',button).innerHTML=playing?'<svg class="icon"><use href="#i-pause"/></svg>':'<svg class="icon"><use href="#i-play"/></svg>';if(playing)setTimeout(()=>{button.classList.remove('is-playing');$('.preview-play',button).innerHTML='<svg class="icon"><use href="#i-play"/></svg>';},8000);});
  $('#greeting-text').addEventListener('input',(e)=>{$('.char-count').textContent=`${e.target.value.length} / 300`;});$('#save-agent').addEventListener('click',()=>toast('AI receptionist settings saved'));$('#manage-knowledge').addEventListener('click',()=>toast('Knowledge manager opened in demo mode'));
  $$('.settings-nav button').forEach((button)=>button.addEventListener('click',()=>{$$('.settings-nav button').forEach((item)=>item.classList.toggle('is-active',item===button));$$('[data-settings-panel]').forEach((panel)=>panel.classList.toggle('is-active',panel.dataset.settingsPanel===button.dataset.settingsTab));}));
  $('#save-settings').addEventListener('click',()=>{const business=$('[data-business-input]').value.trim();if(business)$$('[data-business-short]').forEach((el)=>{el.textContent=business.replace(/Heating & Air/i,'HVAC');});toast('Business profile updated');});
  $('#notification-button').addEventListener('click',(e)=>{e.stopPropagation();$('#notification-popover').classList.toggle('is-open');});$('#notification-popover').addEventListener('click',(e)=>e.stopPropagation());document.addEventListener('click',()=>$('#notification-popover').classList.remove('is-open'));$('#mark-read').addEventListener('click',()=>{$$('.notice-row').forEach((n)=>n.classList.remove('unread'));$('.notification-button > i')?.remove();toast('Notifications marked as read');});
  function openSearch(){switchView('calls');setTimeout(()=>$('#call-search').focus(),100);}$('#global-search').addEventListener('click',openSearch);
  document.addEventListener('keydown',(e)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch();}if(e.key==='Escape'){closeDrawer();closeSidebar();modalState('appointment-modal',false);closeTest();}});
  $('#contact-support').addEventListener('click',()=>toast('Support chat is ready · average reply: 2 min'));$('#sync-crm').addEventListener('click',()=>toast('HubSpot sync completed · 7 leads updated'));$('#new-automation').addEventListener('click',()=>toast('Custom workflow builder opened'));$('#automation-add-card').addEventListener('click',()=>toast('Custom workflow builder opened'));$$('.automation-card footer button').forEach((b)=>b.addEventListener('click',()=>toast('Automation settings ready')));$$('.automation-card .switch input').forEach((b)=>b.addEventListener('change',()=>toast(b.checked?'Automation activated':'Automation paused')));$$('.connect-integration').forEach((b)=>b.addEventListener('click',()=>toast('Integration connection flow opened')));

  applyProfile();renderRecent();renderCalls();renderCalendar();renderAnalytics();
  const initial=location.hash.slice(1);if(initial&&$(`#view-${initial}`))switchView(initial,false);
})();
