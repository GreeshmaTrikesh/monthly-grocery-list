
let lists = JSON.parse(localStorage.getItem('groceryLists') || '[]');
let historyLists = JSON.parse(localStorage.getItem('groceryHistory') || '[]');

let currentListId = null;
let qty = 1;
let selectedUnit = 'kg';

function save(){
localStorage.setItem('groceryLists',JSON.stringify(lists));
localStorage.setItem('groceryHistory',JSON.stringify(historyLists));
}

function toast(msg){
const t=document.getElementById('toast');
t.innerText=msg;
t.style.display='block';
setTimeout(()=>{
t.style.display='none';
},2000);
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
renderLists();
toast('✨ List created');
}

function renderLists(){
const container=document.getElementById('listsContainer');
container.innerHTML='';

lists.forEach(list=>{
container.innerHTML += `
<div class="card list-card" onclick="openList(${list.id})">
<div>
<div class="list-title">${list.name}</div>
<div class="muted">${list.items.filter(i=>!i.done).length} items left</div>
</div>

<button class="delete-btn" onclick="event.stopPropagation();deleteList(${list.id})">✕</button>
</div>
`;
});

renderHistory();
}

function deleteList(id){
lists = lists.filter(l=>l.id!==id);
save();
renderLists();
toast('List removed');
}

function openList(id){
currentListId=id;

const list=lists.find(l=>l.id===id);
document.getElementById('currentListTitle').innerText=list.name;

document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
document.getElementById('listPage').classList.add('active');

renderItems();
}

function goHome(){
document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
document.getElementById('homePage').classList.add('active');
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
const item=document.getElementById('itemName').value;
if(!item.trim()) return;

const brand=document.getElementById('brandName').value;

const list=lists.find(l=>l.id===currentListId);

list.items.push({
id:Date.now(),
name:item,
brand:brand,
qty:qty,
unit:selectedUnit,
done:false
});

document.getElementById('itemName').value='';
document.getElementById('brandName').value='';

save();
renderItems();
toast('✓ Item added');
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
<button onclick="copyItem('${item.brand} ${item.name}')">⧉</button>
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
`conic-gradient(#0f7486 ${percent*3.6}deg,#d7eef2 0deg)`;
}

function copyItem(text){
navigator.clipboard.writeText(text);
toast('Copied');
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
toast('Item removed');
}

function finishShopping(){
const index=lists.findIndex(l=>l.id===currentListId);
if(index===-1) return;

historyLists.unshift(lists[index]);
lists.splice(index,1);

save();
renderLists();

goHome();
toast('✓ Shopping moved to history');
}

function renderHistory(){
const container=document.getElementById('historyContainer');
container.innerHTML='';

historyLists.slice(0,2).forEach(list=>{

const purchased=list.items.filter(i=>i.done);
const notFound=list.items.filter(i=>!i.done);

container.innerHTML += `
<div class="card history-card">
<h3>${list.name}</h3>

<div class="muted">
✓ Purchased: ${purchased.length}<br>
✕ Not Found: ${notFound.map(i=>i.name).join(', ') || 'None'}
</div>

<div class="chips">
${purchased.map(i=>`<div class="tag success">✓ ${i.name}</div>`).join('')}
${notFound.map(i=>`<div class="tag fail">✕ ${i.name}</div>`).join('')}
</div>

<button class="primary-btn" onclick="copyHistory(${list.id})">
Add Selected To New List
</button>
</div>
`;
});
}

function copyHistory(id){
const old=historyLists.find(h=>h.id===id);

lists.unshift({
id:Date.now(),
name:old.name + ' Copy',
items:[...old.items]
});

save();
renderLists();
toast('✨ Copied to new list');
}

function switchTab(page,el){
document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
document.getElementById(page).classList.add('active');

document.querySelectorAll('.nav').forEach(n=>n.classList.remove('active'));
el.classList.add('active');
}

renderLists();
