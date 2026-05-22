let lists = JSON.parse(localStorage.getItem('familyLists')) || [];
let currentListIndex = null;
let selectedUnit = 'kg';

function saveLists(){
localStorage.setItem('familyLists', JSON.stringify(lists));
}

function createList(){
const name = document.getElementById('listName').value.trim();
if(!name) return;

lists.push({
name:name,
items:[]
});

document.getElementById('listName').value='';

saveLists();
renderLists();
}

function deleteList(index){
lists.splice(index,1);
saveLists();
renderLists();
}

function renderLists(){

const container = document.getElementById('listsContainer');
container.innerHTML='';

lists.forEach((list,index)=>{

const div = document.createElement('div');

div.className='list-card';

div.innerHTML = `
<button class="delete-list-btn"
onclick="event.stopPropagation(); deleteList(${index})">✕</button>

<div>${list.name}</div>
`;

div.onclick = ()=>openList(index);

container.appendChild(div);

});
}

function openList(index){

currentListIndex = index;

document.getElementById('homePage').style.display='none';
document.getElementById('detailsPage').style.display='block';

document.getElementById('currentListName').value = lists[index].name;

renderItems();
}

function updateListName(){

lists[currentListIndex].name =
document.getElementById('currentListName').value;

saveLists();
renderLists();
}

function goBack(){
document.getElementById('homePage').style.display='block';
document.getElementById('detailsPage').style.display='none';
}

function selectUnit(el,unit){

selectedUnit = unit;

document.querySelectorAll('.unit-pill').forEach(btn=>{
btn.classList.remove('active');
});

el.classList.add('active');
}

function addItem(){

const itemName = document.getElementById('itemName').value;
const qty = document.getElementById('qty').value;
const brand = document.getElementById('brand').value;

if(!itemName) return;

lists[currentListIndex].items.push({
itemName,
qty,
unit:selectedUnit,
brand,
completed:false
});

saveLists();

document.getElementById('itemName').value='';
document.getElementById('qty').value='';
document.getElementById('brand').value='';

renderItems();
}

function toggleComplete(index){

lists[currentListIndex].items[index].completed =
!lists[currentListIndex].items[index].completed;

saveLists();
renderItems();
}

function deleteItem(index){

lists[currentListIndex].items.splice(index,1);

saveLists();
renderItems();
}

function updateProgress(){

const items = lists[currentListIndex].items;

const completed =
items.filter(i=>i.completed).length;

const total = items.length;

const percent =
total ? Math.round((completed/total)*100) : 0;

document.getElementById('progressText').innerText =
`${completed} / ${total} completed`;

document.getElementById('progressPercent').innerText =
`${percent}%`;

document.querySelector('.progress-ring').style.background =
`conic-gradient(#8ba8ff ${percent*3.6}deg,#edf1ff 0deg)`;
}

function renderItems(){

const activeContainer =
document.getElementById('itemsContainer');

const completedContainer =
document.getElementById('completedContainer');

activeContainer.innerHTML='';
completedContainer.innerHTML='';

lists[currentListIndex].items.forEach((item,index)=>{

const copyValue =
`${item.brand} ${item.itemName}`;

const div = document.createElement('div');

div.className =
item.completed ? 'item-card completed' : 'item-card';

div.innerHTML = `
<div class="item-left">
<div class="pill item-title">${item.itemName}</div>
<div class="pill item-qty">${item.qty} ${item.unit}</div>
<div class="pill item-brand">${item.brand}</div>
</div>

<div class="item-actions">

<button class="icon-btn"
onclick="copyItem('${copyValue}')">⧉</button>

<button class="icon-btn"
onclick="toggleComplete(${index})">✓</button>

<button class="icon-btn"
onclick="deleteItem(${index})">🗑</button>

</div>
`;

if(item.completed){
completedContainer.appendChild(div);
}else{
activeContainer.appendChild(div);
}

});

updateProgress();
}

function copyItem(text){
navigator.clipboard.writeText(text);
}

renderLists();
