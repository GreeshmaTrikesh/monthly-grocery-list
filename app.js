
let lists = JSON.parse(localStorage.getItem('lists') || '[]');
let history = JSON.parse(localStorage.getItem('history') || '[]');

let currentListId = null;
let qty = 1;
let selectedUnit = 'kg';

function save(){
localStorage.setItem('lists', JSON.stringify(lists));
localStorage.setItem('history', JSON.stringify(history));
}

function showToast(msg){
const t=document.getElementById('toast');
t.innerText=msg;
t.style.display='block';
setTimeout(()=>{
t.style.display='none';
},1800);
}

function switchTab(id,el){
document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
document.getElementById(id).classList.add('active');

document.querySelectorAll('.nav').forEach(n=>n.classList.remove('active'));
if(el) el.classList.add('active');
}

function createList(){
const input=document.getElementById('listInput');

if(!input.value.trim()) return;

lists.unshift({
id:Date.now(),
name:input.value,
items:[]
});

input.value='';
save();
render();
showToast('✨ List created');
}

function render(){
renderLists();
renderHistory();
renderHome();
}

function renderHome(){
const home=document.getElementById('homeLists');
home.innerHTML='';

lists.slice(0,1).forEach(list=>{
home.innerHTML += `
<div class="card list-card" onclick="openList(${list.id})">
<div>
<div class="list-name">${list.name}</div>
<div class="small">${list.items.filter(i=>!i.done).length} items left</div>
</div>

<button class="icon-btn" onclick="event.stopPropagation();deleteList(${list.id})">✕</button>
</div>
`;
});
}

function renderLists(){
const container=document.getElementById('listsContainer');
container.innerHTML='';

if(!lists.length){
container.innerHTML='<div class="card small">No active lists ✨</div>';
return;
}

lists.forEach(list=>{
container.innerHTML += `
<div class="card list-card" onclick="openList(${list.id})">
<div>
<div class="list-name">${list.name}</div>
<div class="small">${list.items.filter(i=>!i.done).length} items left</div>
</div>

<button class="icon-btn" onclick="event.stopPropagation();deleteList(${list.id})">✕</button>
</div>
`;
});
}

function deleteList(id){
lists = lists.filter(l=>l.id!==id);
save();
render();
showToast('List removed');
}

function openList(id){
currentListId=id;

const list=lists.find(l=>l.id===id);
document.getElementById('currentTitle').innerText=list.name;

switchTab('listPage');
renderItems();
}

function goLists(){
switchTab('listsPage');
}

function changeQty(v){
qty=Math.max(1,qty+v);
document.getElementById('qtyValue').innerText=qty;
}

function selectUnit(el,u){
selectedUnit=u;
document.querySelectorAll('.unit').forEach(x=>x.classList.remove('active'));
el.classList.add('active');
}

function addItem(){
const item=document.getElementById('itemName').value.trim();
if(!item) return;

const brand=document.getElementById('brandName').value.trim();

const list=lists.find(l=>l.id===currentListId);

list.items.push({
id:Date.now(),
name:item,
brand,
qty,
unit:selectedUnit,
done:false
});

document.getElementById('itemName').value='';
document.getElementById('brandName').value='';

save();
renderItems();
showToast('✓ Item added');
}

function renderItems(){
const list=lists.find(l=>l.id===currentListId);
const container=document.getElementById('itemsContainer');

container.innerHTML='';

list.items.forEach(item=>{
container.innerHTML += `
<div class="card item-card">
<div class="tags">
<div class="tag blue">${item.name}</div>
<div class="tag gray">${item.qty}${item.unit}</div>
${item.brand ? `<div class="tag soft">${item.brand}</div>` : ''}
</div>

<div class="actions">
<button onclick="copyText('${item.brand} ${item.name}')">⧉</button>
<button onclick="toggleItem(${item.id})">${item.done ? '↺' : '✓'}</button>
<button onclick="removeItem(${item.id})">⌫</button>
</div>
</div>
`;
});

const completed=list.items.filter(i=>i.done).length;
const total=list.items.length;
const percent=total?Math.round((completed/total)*100):0;

document.getElementById('progressText').innerText=`${completed} / ${total} completed`;
document.getElementById('progressPercent').innerText=`${percent}%`;

document.querySelector('.ring').style.background =
`conic-gradient(#0f7486 ${percent*3.6}deg,#d8eef2 0deg)`;
}

function copyText(t){
navigator.clipboard.writeText(t);
showToast('Copied');
}

function toggleItem(id){
const list=lists.find(l=>l.id===currentListId);
const item=list.items.find(i=>i.id===id);
item.done=!item.done;

save();
renderItems();
}

function removeItem(id){
const list=lists.find(l=>l.id===currentListId);
list.items=list.items.filter(i=>i.id!==id);

save();
renderItems();
showToast('Removed');
}

function finishShopping(){
const idx=lists.findIndex(l=>l.id===currentListId);

history.unshift({
...lists[idx],
expanded:false
});

lists.splice(idx,1);

save();
render();

switchTab('historyPage', document.querySelectorAll('.nav')[2]);

showToast('✓ Shopping moved');
}

function renderHistory(){
const container=document.getElementById('historyContainer');
container.innerHTML='';

if(!history.length){
container.innerHTML='<div class="card small">No history yet ✨</div>';
return;
}

history.slice(0,2).forEach(list=>{

const purchased=list.items.filter(i=>i.done);
const notFound=list.items.filter(i=>!i.done);

container.innerHTML += `
<div class="card history-card">

<div style="display:flex;justify-content:space-between;align-items:center;">
<div>
<h3>${list.name}</h3>
<div class="summary">
✓ Purchased: ${purchased.length}<br>
✕ Not Found: ${notFound.length}
</div>
</div>

<button class="icon-btn" onclick="toggleHistory(${list.id})">⌄</button>
</div>

<div class="history-details" id="history-${list.id}">

<div class="chips">
${purchased.map(i=>`<div class="tag success selectable" onclick="toggleSelect(this)">✓ ${i.name}</div>`).join('')}
${notFound.map(i=>`<div class="tag fail selectable" onclick="toggleSelect(this)">✕ ${i.name}</div>`).join('')}
</div>

<button class="primary-btn" onclick="copyHistory(${list.id})">Add Selected To New List</button>

</div>

</div>
`;
});
}

function toggleHistory(id){
const el=document.getElementById(`history-${id}`);
el.style.display = el.style.display === 'block' ? 'none' : 'block';
}

function toggleSelect(el){
el.classList.toggle('selected');
}

function copyHistory(id){
const old=history.find(h=>h.id===id);

lists.unshift({
id:Date.now(),
name:old.name + ' Copy',
items:[...old.items]
});

save();
render();
showToast('✨ Added to new list');
}

render();
