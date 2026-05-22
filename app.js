
let lists = JSON.parse(localStorage.getItem('lists') || '[]');
let history = JSON.parse(localStorage.getItem('history') || '[]');

function save(){
 localStorage.setItem('lists', JSON.stringify(lists));
 localStorage.setItem('history', JSON.stringify(history));
 render();
}

function toast(msg){
 const t=document.createElement('div');
 t.className='toast';
 t.innerText=msg;
 document.body.appendChild(t);
 setTimeout(()=>t.remove(),1800);
}

function createList(){
 const input=document.getElementById('listInput');
 const value=input.value.trim();
 if(!value)return;

 lists.push({
   id:Date.now(),
   name:value,
   items:[]
 });

 input.value='';
 save();
 toast('List created');
}

function deleteList(id){
 lists=lists.filter(x=>x.id!==id);
 save();
}

function finishList(id){
 const found=lists.find(x=>x.id===id);
 if(!found)return;

 history.unshift({
   name:found.name,
   purchased:0,
   notFound:0
 });

 lists=lists.filter(x=>x.id!==id);
 save();
 toast('Moved to history');
}

function render(){
 const active=document.getElementById('activeLists');

 if(lists.length===0){
   active.innerHTML='';
 }else{
   active.innerHTML=lists.map(x=>`
    <div class="list-card">
      <div onclick="finishList(${x.id})">
        <div class="list-name">${x.name}</div>
        <div class="list-sub">0 items left</div>
      </div>

      <div class="delete-btn" onclick="deleteList(${x.id})">✕</div>
    </div>
   `).join('');
 }

 const hist=document.getElementById('historyLists');

 if(history.length===0){
   hist.innerHTML='<div class="history-line">No history yet</div>';
 }else{
   hist.innerHTML=history.map(x=>`
    <div class="history-card">
      <div class="history-title">${x.name}</div>
      <div class="history-line">✓ Purchased: ${x.purchased}</div>
      <div class="history-line">✕ Not Found: ${x.notFound}</div>
    </div>
   `).join('');
 }
}

function showPage(id){
 document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
 document.getElementById(id).classList.add('active');
}

render();
