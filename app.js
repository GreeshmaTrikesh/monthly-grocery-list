
let lists = JSON.parse(localStorage.getItem('familyLists')) || [];
let history = JSON.parse(localStorage.getItem('historyLists')) || [];

let currentListIndex = 0;
let qty = 1;
let selectedUnit = 'kg';
let selectedHistoryItems = {};

function save(){
localStorage.setItem('familyLists',JSON.stringify(lists));
localStorage.setItem('historyLists',JSON.stringify(history));
}

function setActive(el){
document.querySelectorAll('.side-item').forEach(i=>i.classList.remove('active'));
if(el) el.classList.add('active');
}

function showPage(page,el){
['homePage','listsPage','detailsPage','historyPage']
.forEach(id=>document.getElementById(id).style.display='none');

document.getElementById(page).style.display='block';

if(el) setActive(el);

renderLists();
if(page==='historyPage') renderHistory();
}

document.getElementById('monthSelect').addEventListener('change',e=>{
if(e.target.value !== 'Custom'){
document.getElementById('listName').value=e.target.value;
}
});

function createList(){
const name=document.getElementById('listName').value.trim();
if(!name) return;

lists.push({name,items:[]});

document.getElementById('listName').value='';

save();
renderLists();
}

function renderLists(){
const containers=['listsContainer','homeLists'];

containers.forEach(id=>{
const container=document.getElementById(id);
if(!container) return;
container.innerHTML='';

lists.forEach((list,index)=>{
const div=document.createElement('div');
div.className='list-card';

div.innerHTML=`
<div>${list.name}</div>
<button class="delete-btn"
onclick="event.stopPropagation();deleteList(${index})">✕</button>
`;

div.onclick=()=>openList(index);

container.appendChild(div);
});
});

document.getElementById('emptyLists').style.display =
lists.length ? 'none':'block';
}

function deleteList(index){
lists.splice(index,1);
save();
renderLists();
}

function openList(index){
currentListIndex=index;

document.getElementById('currentListTitle').value =
lists[index].name;

showPage('detailsPage');

renderItems();
}

function renameList(){
lists[currentListIndex].name =
document.getElementById('currentListTitle').value;

save();
renderLists();
}

function changeQty(change){
qty=Math.max(1,qty+change);
document.getElementById('qtyValue').innerText=qty;
}

function setUnit(el,unit){
selectedUnit=unit;

document.querySelectorAll('.unit').forEach(u=>u.classList.remove('active'));
el.classList.add('active');
}

function addItem(){
const itemName=document.getElementById('itemName').value.trim();
const brand=document.getElementById('brand').value.trim();

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
document.getElementById('qtyValue').innerText='1';

save();
renderItems();
}

function toggleComplete(index){
lists[currentListIndex].items[index].completed =
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

document.getElementById('progressText').innerText =
`${completed} / ${total} completed`;

document.getElementById('progressPercent').innerText =
`${percent}%`;

document.querySelector('.progress-ring').style.background =
`conic-gradient(#0f7486 ${percent*3.6}deg,#d9eef2 0deg)`;
}

function renderItems(){
const container=document.getElementById('itemsContainer');
container.innerHTML='';

lists[currentListIndex].items.forEach((item,index)=>{
const div=document.createElement('div');
div.className=`card item-card ${item.completed?'completed':''}`;

div.innerHTML=`
<div class="item-left">
<div class="pill item-title">${item.itemName}</div>
<div class="pill item-qty">${item.qty}${item.unit}</div>
${item.brand ? `<div class="pill item-brand">${item.brand}</div>`:''}
</div>

<div class="item-actions">
<button class="icon-btn"
onclick="toggleComplete(${index})">
${item.completed?'↺':'✓'}
</button>

<button class="icon-btn"
onclick="deleteItem(${index})">🗑</button>
</div>
`;

container.appendChild(div);
});

updateProgress();
}

function finishShopping(){
const current=lists[currentListIndex];

history.unshift({
name:current.name,
items:current.items
});

history=history.slice(0,2);

lists.splice(currentListIndex,1);

save();

renderLists();
renderHistory();

alert('Moved to history ✨');

showPage('homePage');
}

function toggleHistory(index){
const el=document.getElementById(`history-${index}`);
el.style.display = el.style.display==='block' ? 'none':'block';
}

function toggleHistoryItem(historyIndex,itemIndex,el){
if(!selectedHistoryItems[historyIndex]){
selectedHistoryItems[historyIndex]=[];
}

const arr=selectedHistoryItems[historyIndex];

if(arr.includes(itemIndex)){
selectedHistoryItems[historyIndex]=arr.filter(i=>i!==itemIndex);
el.classList.remove('selected-chip');
}else{
arr.push(itemIndex);
el.classList.add('selected-chip');
}
}

function addSelected(historyIndex){
const entry=history[historyIndex];

const selected=(selectedHistoryItems[historyIndex]||[])
.map(i=>entry.items[i]);

if(!selected.length) return;

lists.push({
name:entry.name + ' Copy',
items:selected.map(i=>({
...i,
completed:false
}))
});

save();
renderLists();

alert('Selected items added ✨');

showPage('listsPage');
}

function deleteHistory(index){
history.splice(index,1);
save();
renderHistory();
}

function renderHistory(){
const container=document.getElementById('historyContainer');
container.innerHTML='';

history.forEach((entry,index)=>{

const purchased=entry.items.filter(i=>i.completed).length;
const notFound=entry.items.filter(i=>!i.completed).length;

const div=document.createElement('div');
div.className='history-card';

div.innerHTML=`
<div class="history-summary"
onclick="toggleHistory(${index})">

<div>
<div style="font-size:22px;font-weight:700;">
${entry.name}
</div>

<div class="summary-counts">
✓ ${purchased} Purchased • ✕ ${notFound} Not Found
</div>
</div>

<button class="delete-btn"
onclick="event.stopPropagation();deleteHistory(${index})">
🗑
</button>

</div>

<div class="history-details" id="history-${index}">

${entry.items.map((item,itemIndex)=>`
<span class="history-chip"
onclick="toggleHistoryItem(${index},${itemIndex},this)">
${item.itemName}
</span>
`).join('')}

<div class="action-row">
<button class="primary-btn"
onclick="addSelected(${index})">
Add Selected To New List
</button>
</div>

</div>
`;

container.appendChild(div);
});
}

renderLists();
