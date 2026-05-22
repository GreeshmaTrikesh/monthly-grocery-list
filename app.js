let lists = JSON.parse(localStorage.getItem('familyLists')) || [];
let currentListIndex = null;

const themes = ['theme1','theme2','theme3','theme4','theme5'];

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

function renderLists(){

const container = document.getElementById('listsContainer');

container.innerHTML='';

lists.forEach((list,index)=>{

const div = document.createElement('div');

div.className = `list-card ${themes[index % themes.length]}`;

div.innerHTML = `<div class="list-name">${list.name}</div>`;

div.onclick = ()=>openList(index);

container.appendChild(div);

});
}

function openList(index){

currentListIndex = index;

document.getElementById('homePage').style.display='none';
document.getElementById('detailsPage').style.display='block';

document.getElementById('currentListName').innerText =
lists[index].name;

renderItems();
}

function goBack(){

document.getElementById('homePage').style.display='block';
document.getElementById('detailsPage').style.display='none';

}

function addItem(){

const itemName =
document.getElementById('itemName').value;

const qty =
document.getElementById('qty').value;

const unit =
document.getElementById('unit').value;

const brand =
document.getElementById('brand').value;

if(!itemName) return;

lists[currentListIndex].items.push({
itemName,qty,unit,brand
});

saveLists();

document.getElementById('itemName').value='';
document.getElementById('qty').value='';
document.getElementById('brand').value='';

renderItems();
}

function renderItems(){

const container =
document.getElementById('itemsContainer');

container.innerHTML='';

lists[currentListIndex].items.forEach((item)=>{

const copyValue =
`${item.brand} ${item.itemName}`;

const div = document.createElement('div');

div.className='item-card';

div.innerHTML = `
<div class="item-left">
<div class="pill item-title">${item.itemName}</div>
<div class="pill item-qty">${item.qty} ${item.unit}</div>
<div class="pill item-brand">${item.brand}</div>
</div>

<button class="copy-btn"
onclick="copyItem('${copyValue}')">
📋
</button>
`;

container.appendChild(div);

});
}

function copyItem(text){
navigator.clipboard.writeText(text);
}

renderLists();
