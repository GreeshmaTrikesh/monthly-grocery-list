let lists = JSON.parse(localStorage.getItem('lists') || '[]');

function save(){
 localStorage.setItem('lists', JSON.stringify(lists));
 render();
}

function createList(){
 const input = document.getElementById('listName');
 const value = input.value.trim();
 if(!value) return;

 lists.push({
   id:Date.now(),
   name:value,
   items:[]
 });

 input.value='';
 save();
}

function deleteList(id){
 lists = lists.filter(x=>x.id!==id);
 save();
}

function render(){
 const root = document.getElementById('lists');

 if(lists.length===0){
   root.innerHTML='';
   return;
 }

 root.innerHTML = lists.map(x=>`
 <div class="list-card">
   <div>
      <div class="title">${x.name}</div>
      <div class="subtitle">${x.items.length} items left</div>
   </div>
   <div class="delete" onclick="deleteList(${x.id})">✕</div>
 </div>
 `).join('');
}

render();
