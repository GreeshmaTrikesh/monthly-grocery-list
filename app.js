
let lists = JSON.parse(localStorage.getItem('lists') || '[]');
let historyLists = JSON.parse(localStorage.getItem('historyLists') || '[]');

let currentListId = null;
let qty = 1;
let selectedUnit = 'kg';
let selectedHistory = {};

function save(){
localStorage.setItem('lists', JSON.stringify(lists));
localStorage.setItem('historyLists', JSON.stringify(historyLists));
}

function toast(msg){
const t = document.getElementById('toast');
t.innerText = msg;
t.style.display = 'block';

setTimeout(()=>{
t.style.display = 'none';
},1500);
}

function openPage(id){
document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
document.getElementById(id).classList.add('active');
}

function switchTab(id,el){
openPage(id);

document.querySelectorAll('.nav').forEach(n=>n.classList.remove('active'));
if(el) el.classList.add('active');
}

function createList(){
const input = document.getElementById('listInput');

if(!input.value.trim()) return;

lists.unshift({
id:Date.now(),
name:input.value.trim(),
items:[]
});

input.value='';

save();
renderAll();
toast('✨ List created');
}

function renderHome(){
document.getElementById('activeCount').innerText = lists.length;
document.getElementById('historyCount').innerText = historyLists.length;

const home = document.getElementById('homeList');

if(!lists.length){
home.innerHTML = '';
return;
}

const list = lists[0];

home.innerHTML = `
<div class="list-card" onclick="openList(${list.id})">
<div class="list-left">
<div class="list-name">${list.name}</div>
<div class="list-sub">${list.items.filter(i=>!i.done).length} items left</div>
</div>

<button class="icon-btn" onclick="event.stopPropagation();deleteList(${list.id})">✕</button>
</div>
`;
}

function renderLists(){
const container = document.getElementById('listsContainer');

if(!lists.length){
container.innerHTML = '<div class="list-card"><div class="list-sub">No active lists ✨</div></div>';
return;
}

container.innerHTML='';

lists.forEach(list=>{
container.innerHTML += `
<div class="list-card" onclick="openList(${list.id})">

<div class="list-left">
<div class="list-name">${list.name}</div>
<div class="list-sub">${list.items.filter(i=>!i.done).length} items left</div>
</div>

<button class="icon-btn" onclick="event.stopPropagation();deleteList(${list.id})">✕</button>

</div>
`;
});
}

function deleteList(id){
lists = lists.filter(l=>l.id!==id);

save();
renderAll();
toast('Deleted');
}

function openList(id){
currentListId = id;

const list = lists.find(l=>l.id===id);

document.getElementById('detailTitle').innerText = list.name;

openPage('detailPage');

renderItems();
}

function changeQty(v){
qty = Math.max(1, qty+v);
document.getElementById('qtyValue').innerText = qty;
}

function selectUnit(el,u){
selectedUnit=u;

document.querySelectorAll('.unit').forEach(x=>x.classList.remove('active'));
el.classList.add('active');
}

function addItem(){
const item = document.getElementById('itemInput').value.trim();

if(!item) return;

const brand = document.getElementById('brandInput').value.trim();

const list = lists.find(l=>l.id===currentListId);

list.items.push({
id:Date.now(),
name:item,
brand,
qty,
unit:selectedUnit,
done:false
});

document.getElementById('itemInput').value='';
document.getElementById('brandInput').value='';

save();
renderItems();

toast('✓ Added');
}

function renderItems(){
const list = lists.find(l=>l.id===currentListId);

const container = document.getElementById('itemsContainer');

container.innerHTML='';

list.items.forEach(item=>{
container.innerHTML += `
<div class="item-card">

<div class="item-left">
<div class="chip blue">${item.name}</div>
<div class="chip gray">${item.qty}${item.unit}</div>
${item.brand ? `<div class="chip soft">${item.brand}</div>`:''}
</div>

<div class="actions">
<button onclick="copyItem('${item.name}')">⧉</button>
<button onclick="toggleItem(${item.id})">${item.done?'↺':'✓'}</button>
<button onclick="removeItem(${item.id})">⌫</button>
</div>

</div>
`;
});

const completed = list.items.filter(i=>i.done).length;
const total = list.items.length;
const percent = total ? Math.round((completed/total)*100) : 0;

document.getElementById('progressText').innerText = `${completed} / ${total} completed`;
document.getElementById('ringText').innerText = `${percent}%`;

document.getElementById('ring').style.background =
`conic-gradient(#117b8f ${percent*3.6}deg,#d8eef2 0deg)`;
}

function copyItem(text){
navigator.clipboard.writeText(text);
toast('Copied');
}

function toggleItem(id){
const list = lists.find(l=>l.id===currentListId);

const item = list.items.find(i=>i.id===id);

item.done = !item.done;

save();
renderItems();
}

function removeItem(id){
const list = lists.find(l=>l.id===currentListId);

list.items = list.items.filter(i=>i.id!==id);

save();
renderItems();
toast('Removed');
}

function finishShopping(){
const index = lists.findIndex(l=>l.id===currentListId);

historyLists.unshift(lists[index]);

lists.splice(index,1);

save();
renderAll();

switchTab('historyPage', document.querySelectorAll('.nav')[2]);

toast('✓ Shopping moved');
}

function renderHistory(){
const container = document.getElementById('historyContainer');

container.innerHTML='';

historyLists.forEach(list=>{

const purchased = list.items.filter(i=>i.done);
const notFound = list.items.filter(i=>!i.done);

container.innerHTML += `
<div class="history-card">

<div class="history-top">

<div>
<div class="history-name">${list.name}</div>

<div class="history-summary">
✓ Purchased: ${purchased.length}<br>
✕ Not Found: ${notFound.length}
</div>
</div>

<div class="history-actions">
<button class="icon-btn" onclick="toggleHistory(${list.id})">⌄</button>
<button class="icon-btn" onclick="deleteHistory(${list.id})">✕</button>
</div>

</div>

<div class="history-details" id="history-${list.id}">

<div class="select-grid">
${list.items.map(item=>`
<div class="select-chip"
onclick="toggleSelect(this,${list.id},${item.id})">
${item.done?'✓':'✕'} ${item.name}
</div>
`).join('')}
</div>

<button class="primary-btn"
onclick="copySelected(${list.id})">
Add Selected To New List
</button>

</div>

</div>
`;
});
}

function toggleHistory(id){
const el = document.getElementById(`history-${id}`);

el.style.display = el.style.display==='block' ? 'none':'block';
}

function toggleSelect(el,listId,itemId){

if(!selectedHistory[listId]){
selectedHistory[listId] = [];
}

if(selectedHistory[listId].includes(itemId)){
selectedHistory[listId] =
selectedHistory[listId].filter(i=>i!==itemId);

el.classList.remove('selected');
}else{
selectedHistory[listId].push(itemId);
el.classList.add('selected');
}
}

function copySelected(listId){

const history = historyLists.find(h=>h.id===listId);

const selected = history.items.filter(i=>
(selectedHistory[listId] || []).includes(i.id)
);

if(!selected.length){
toast('Select items first');
return;
}

lists.unshift({
id:Date.now(),
name:history.name + ' Copy',
items:selected.map(i=>({
...i,
done:false
}))
});

save();
renderAll();

toast('✨ Added to new list');
}

function deleteHistory(id){
historyLists = historyLists.filter(h=>h.id!==id);

save();
renderAll();

toast('Deleted');
}

function renderAll(){
renderHome();
renderLists();
renderHistory();
}

renderAll();
