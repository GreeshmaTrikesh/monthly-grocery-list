
let lists = JSON.parse(localStorage.getItem('familyLists')) || [];
let history = JSON.parse(localStorage.getItem('historyLists')) || [];

let currentListIndex = 0;
let selectedUnit = 'kg';
let qty = 1;

function save(){
localStorage.setItem('familyLists',JSON.stringify(lists));
localStorage.setItem('historyLists',JSON.stringify(history));
}

function setActive(el){
document.querySelectorAll('.side-item').forEach(i=>i.classList.remove('active'));
el.classList.add('active');
}

function showPage(page,el){

document.getElementById('homePage').style.display='none';
document.getElementById('detailsPage').style.display='none';
document.getElementById('historyPage').style.display='none';

document.getElementById(page).style.display='block';

if(el) setActive(el);

if(page==='historyPage') renderHistory();
}

document.getElementById('monthSelect').addEventListener('change',e=>{
if(e.target.value !== 'Custom'){
document.getElementById('listName').value=e.target.value;
}
});

function createList(){

let name=document.getElementById('listName').value.trim();

if(!name) return;

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
<button class="delete-btn"
onclick="event.stopPropagation();deleteList(${index})">
✕
</button>

<div>${list.name}</div>
`;

div.onclick=()=>openList(index);

container.appendChild(div);
});
}

function deleteList(index){
lists.splice(index,1);
save();
renderLists();
}

function openList(index){

currentListIndex=index;

document.getElementById('currentListNameHeader').innerText=lists[index].name;

showPage('detailsPage');

renderItems();
}

function selectUnit(el,unit){

selectedUnit=unit;

document.querySelectorAll('.unit-pill').forEach(btn=>{
btn.classList.remove('active');
});

el.classList.add('active');
}

function changeQty(change){

qty=Math.max(1,qty+change);

document.getElementById('qtyValue').innerText=qty;
}

function addItem(){

const itemName=document.getElementById('itemName').value;
const brand=document.getElementById('brand').value;

if(!itemName) return;

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
document.getElementById('qtyValue').innerText=1;

save();
renderItems();
}

function toggleComplete(index){

lists[currentListIndex].items[index].completed=
!lists[currentListIndex].items[index].completed;

save();
renderItems();
}

function deleteItem(index){

lists[currentListIndex].items.splice(index,1);

save();
renderItems();
}

function updateProgress(){

const items=lists[currentListIndex].items;

const completed=items.filter(i=>i.completed).length;

const total=items.length;

const percent=total?Math.round((completed/total)*100):0;

document.getElementById('progressText').innerText=`${completed} / ${total} completed`;

document.getElementById('progressPercent').innerText=`${percent}%`;

document.querySelector('.progress-ring').style.background=
`conic-gradient(#0d6e80 ${percent*3.6}deg,#d8eef2 0deg)`;
}

function finishShopping(){

const current=lists[currentListIndex];

history.unshift({
name:current.name,
completed:current.items.filter(i=>i.completed),
remaining:current.items.filter(i=>!i.completed),
allItems:current.items
});

history=history.slice(0,2);

lists.splice(currentListIndex,1);

save();

renderLists();
renderHistory();

alert('Moved to history ✨');

showPage('homePage');
}

function renderHistory(){

const container=document.getElementById('historyContainer');

container.innerHTML='';

history.forEach((entry,index)=>{

const div=document.createElement('div');

div.className='history-card';

div.innerHTML=`
<div class="history-top">

<div class="history-month">${entry.name}</div>

<button class="delete-btn"
onclick="deleteHistory(${index})">
🗑
</button>

</div>

<div>
<strong>Entire List</strong><br>

${entry.allItems.map(i=>
`<span class="history-chip">${i.itemName}</span>`).join('')}
</div>

<br>

<div>
<strong>Purchased</strong><br>

${entry.completed.map(i=>
`<span class="history-chip green">${i.itemName}</span>`).join('')}
</div>

<br>

<div>
<strong>Not Found</strong><br>

${entry.remaining.map(i=>
`<span class="history-chip red">${i.itemName}</span>`).join('')}
</div>

<button class="create-btn"
onclick="addHistory(${index})">
Add To New List
</button>
`;

container.appendChild(div);
});
}

function addHistory(index){

const entry=history[index];

lists.push({
name:entry.name + ' Copy',
items:entry.allItems.map(i=>({
...i,
completed:false
}))
});

save();

renderLists();

alert('Added to new list ✨');

showPage('homePage');
}

function deleteHistory(index){
history.splice(index,1);
save();
renderHistory();
}

function renderItems(){

const container=document.getElementById('itemsContainer');

container.innerHTML='';

lists[currentListIndex].items.forEach((item,index)=>{

const div=document.createElement('div');

div.className='premium-card item-card';

div.innerHTML=`
<div class="item-left">

<div class="pill item-title">${item.itemName}</div>

<div class="pill item-qty">${item.qty}${item.unit}</div>

<div class="pill item-brand">${item.brand}</div>

</div>

<div class="item-actions">

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

container.appendChild(div);

});

updateProgress();
}

renderLists();
