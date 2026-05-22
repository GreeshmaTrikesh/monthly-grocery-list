let lists = JSON.parse(localStorage.getItem('familyLists')) || [];
let history = JSON.parse(localStorage.getItem('historyLists')) || [];

let currentListIndex = null;
let selectedUnit = 'kg';
let qty = 1;
let completedCollapsed = false;

function vibrate(){
if(navigator.vibrate){
navigator.vibrate(20);
}
}

function save(){
localStorage.setItem('familyLists',JSON.stringify(lists));
localStorage.setItem('historyLists',JSON.stringify(history));
}

function setActiveRail(el){
document.querySelectorAll('.rail-icon').forEach(i=>i.classList.remove('active'));
el.classList.add('active');
}

function showPage(pageId,el){

document.getElementById('homePage').style.display='none';
document.getElementById('detailsPage').style.display='none';
document.getElementById('historyPage').style.display='none';

document.getElementById(pageId).style.display='block';

if(el){
setActiveRail(el);
}

if(pageId==='historyPage'){
renderHistory();
}
}

function createList(){

const name=document.getElementById('listName').value.trim();

if(!name) return;

vibrate();

lists.push({
name:name,
items:[]
});

document.getElementById('listName').value='';

save();
renderLists();
}

function renderLists(){

const container=document.getElementById('listsContainer');
container.innerHTML='';

lists.forEach((list,index)=>{

const div=document.createElement('div');

div.className='list-card';

div.innerHTML=`
<button class="delete-list-btn"
onclick="event.stopPropagation();deleteList(${index})">✕</button>

<div>${list.name}</div>
`;

div.onclick=()=>openList(index);

container.appendChild(div);

});
}

function deleteList(index){
vibrate();
lists.splice(index,1);
save();
renderLists();
}

function openList(index){

currentListIndex=index;

document.getElementById('homePage').style.display='none';
document.getElementById('historyPage').style.display='none';
document.getElementById('detailsPage').style.display='block';

document.getElementById('currentListName').value=lists[index].name;

renderItems();
}

function backHome(){
showPage('homePage');
}

function updateListName(){
lists[currentListIndex].name=document.getElementById('currentListName').value;
save();
renderLists();
}

function selectUnit(el,unit){

selectedUnit=unit;

document.querySelectorAll('.unit-pill').forEach(btn=>{
btn.classList.remove('active');
});

el.classList.add('active');
}

function changeQty(change){

vibrate();

qty=Math.max(1,qty+change);

document.getElementById('qtyValue').innerText=qty;
}

function addItem(){

const itemName=document.getElementById('itemName').value;
const brand=document.getElementById('brand').value;

if(!itemName) return;

vibrate();

lists[currentListIndex].items.push({
itemName,
qty,
unit:selectedUnit,
brand,
completed:false
});

document.getElementById('itemName').value='';
document.getElementById('brand').value='';

qty=1;
document.getElementById('qtyValue').innerText=qty;

save();
renderItems();
}

function toggleComplete(index){

vibrate();

lists[currentListIndex].items[index].completed=
!lists[currentListIndex].items[index].completed;

save();
renderItems();
}

function deleteItem(index){

vibrate();

lists[currentListIndex].items.splice(index,1);

save();
renderItems();
}

function toggleCompletedSection(){

completedCollapsed=!completedCollapsed;

document.getElementById('completedContainer').style.display=
completedCollapsed?'none':'block';

document.getElementById('completedArrow').innerText=
completedCollapsed?'›':'⌄';
}

function updateProgress(){

const items=lists[currentListIndex].items;

const completed=items.filter(i=>i.completed).length;

const total=items.length;

const percent=total?Math.round((completed/total)*100):0;

document.getElementById('progressText').innerText=
`${completed} / ${total} completed`;

document.getElementById('progressPercent').innerText=
`${percent}%`;

document.querySelector('.progress-ring').style.background=
`conic-gradient(#9db6ff ${percent*3.6}deg,#edf1ff 0deg)`;
}

function finishShopping(){

vibrate();

const current=lists[currentListIndex];

history.unshift({
date:new Date().toLocaleDateString(),
name:current.name,
completed:current.items.filter(i=>i.completed),
remaining:current.items.filter(i=>!i.completed)
});

history = history.slice(0,2);

save();

alert('Saved to history ✨');
}

function renderHistory(){

const container=document.getElementById('historyContainer');

container.innerHTML='';

if(history.length===0){
container.innerHTML='<div class="history-card">No shopping history yet ✨</div>';
return;
}

history.forEach(entry=>{

const div=document.createElement('div');

div.className='history-card';

div.innerHTML=`
<div class="history-top">
<div>
<div class="history-month">${entry.name}</div>
<div>${entry.date}</div>
</div>

<div>
✓ ${entry.completed.length} &nbsp; ✕ ${entry.remaining.length}
</div>
</div>

<div class="history-section">
<div><strong>Purchased</strong></div>
${entry.completed.map(i=>
`<span class="history-chip green">${i.itemName}</span>`).join('')}
</div>

<div class="history-section">
<div><strong>Not Found</strong></div>
${entry.remaining.map(i=>
`<span class="history-chip red">${i.itemName}</span>`).join('')}
</div>
`;

container.appendChild(div);

});
}

function copyItem(text){
vibrate();
navigator.clipboard.writeText(text);
}

function renderItems(){

const active=document.getElementById('itemsContainer');
const completed=document.getElementById('completedContainer');

active.innerHTML='';
completed.innerHTML='';

lists[currentListIndex].items.forEach((item,index)=>{

const div=document.createElement('div');

div.className=item.completed?'item-card completed':'item-card';

div.innerHTML=`
<div class="item-left">

<div class="pill item-title">${item.itemName}</div>

<div class="pill item-qty">${item.qty}${item.unit}</div>

<div class="pill item-brand">${item.brand}</div>

</div>

<div class="item-actions">

<button class="icon-btn"
onclick="copyItem('${item.brand} ${item.itemName}')">
⧉
</button>

<button class="icon-btn"
onclick="toggleComplete(${index})">
${item.completed?'↺':'✓'}
</button>

<button class="icon-btn"
onclick="deleteItem(${index})">
🗑
</button>

</div>
`;

if(item.completed){
completed.appendChild(div);
}else{
active.appendChild(div);
}

});

updateProgress();
}

renderLists();
