
let lists = JSON.parse(localStorage.getItem('familyLists')) || [];

function saveLists(){
localStorage.setItem('familyLists', JSON.stringify(lists));
}

function createList(){

const name = document.getElementById('listName').value;

if(!name) return;

lists.push({
name:name,
items:[]
});

document.getElementById('listName').value='';

saveLists();
renderLists();
}

function addItem(listIndex){

const itemName = document.getElementById(`itemName-${listIndex}`).value;
const qty = document.getElementById(`qty-${listIndex}`).value;
const unit = document.getElementById(`unit-${listIndex}`).value;
const brand = document.getElementById(`brand-${listIndex}`).value;

if(!itemName) return;

lists[listIndex].items.push({
itemName,
qty,
unit,
brand
});

saveLists();
renderLists();
}

function deleteItem(listIndex,itemIndex){
lists[listIndex].items.splice(itemIndex,1);
saveLists();
renderLists();
}

function searchDMart(item){

const query = `${item.brand} ${item.itemName} ${item.qty} ${item.unit}`;

const url = `https://www.dmart.in/search?searchTerm=${encodeURIComponent(query)}`;

window.location.href = url;
}

function renderLists(){

const container = document.getElementById('listsContainer');
container.innerHTML='';

lists.forEach((list,listIndex)=>{

const card = document.createElement('div');
card.className='list-card';

let itemsHtml='';

list.items.forEach((item,itemIndex)=>{

itemsHtml += `
<div class="item">
<b>${item.itemName}</b><br>
${item.qty} ${item.unit}<br>
${item.brand}

<div class="actions">
<button class="small-btn"
onclick='searchDMart(${JSON.stringify(item)})'>
Search in DMart
</button>

<button class="small-btn"
onclick='deleteItem(${listIndex},${itemIndex})'>
Delete
</button>
</div>
</div>
`;
});

card.innerHTML = `
<h2>${list.name}</h2>

<input id="itemName-${listIndex}" placeholder="Item Name">

<div class="inline">
<input id="qty-${listIndex}" type="number" placeholder="Qty">

<select id="unit-${listIndex}">
<option>kg</option>
<option>g</option>
<option>litre</option>
<option>ml</option>
<option>pcs</option>
<option>packet</option>
<option>dozen</option>
</select>
</div>

<input id="brand-${listIndex}" placeholder="Brand">

<button onclick="addItem(${listIndex})">
Add Item
</button>

${itemsHtml}
`;

container.appendChild(card);

});

}

renderLists();
