
let lists=JSON.parse(localStorage.getItem('lists')||'[]')
let history=JSON.parse(localStorage.getItem('history')||'[]')
let current=null
let q=1
let u='kg'

function save(){
localStorage.setItem('lists',JSON.stringify(lists))
localStorage.setItem('history',JSON.stringify(history))
}

function toast(t){
const x=document.getElementById('toast')
x.innerText=t
x.style.display='block'
setTimeout(()=>x.style.display='none',1400)
}

function openPage(id){
document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'))
document.getElementById(id).classList.add('active')
}

function tab(id,el){
openPage(id)
document.querySelectorAll('.nav').forEach(n=>n.classList.remove('active'))
el.classList.add('active')
}

function createList(){
const v=document.getElementById('listName').value.trim()
if(!v)return
lists.unshift({id:Date.now(),name:v,items:[]})
document.getElementById('listName').value=''
save();render()
toast('List created')
}

function render(){
home()
allLists()
hist()
}

function home(){
const h=document.getElementById('homeLists')
h.innerHTML=''
lists.slice(0,1).forEach(l=>{
h.innerHTML+=`
<div class='card list-card' onclick='openList(${l.id})'>
<div>
<h3>${l.name}</h3>
<div class='muted'>${l.items.filter(i=>!i.done).length} items left</div>
</div>
<button class='icon-btn' onclick='event.stopPropagation();delList(${l.id})'>✕</button>
</div>`
})
}

function allLists(){
const w=document.getElementById('listsWrap')
w.innerHTML=''
lists.forEach(l=>{
w.innerHTML+=`
<div class='card list-card' onclick='openList(${l.id})'>
<div>
<h3>${l.name}</h3>
<div class='muted'>${l.items.filter(i=>!i.done).length} items left</div>
</div>
<button class='icon-btn' onclick='event.stopPropagation();delList(${l.id})'>✕</button>
</div>`
})
}

function delList(id){
lists=lists.filter(x=>x.id!==id)
save();render();toast('Deleted')
}

function openList(id){
current=id
const l=lists.find(x=>x.id===id)
document.getElementById('title').innerText=l.name
openPage('detail')
renderItems()
}

function qty(v){
q=Math.max(1,q+v)
document.getElementById('qv').innerText=q
}

function unit(el,val){
u=val
document.querySelectorAll('.unit').forEach(x=>x.classList.remove('active'))
el.classList.add('active')
}

function addItem(){
const item=document.getElementById('item').value.trim()
if(!item)return
const brand=document.getElementById('brand').value.trim()
const l=lists.find(x=>x.id===current)
l.items.push({id:Date.now(),name:item,brand,qty:q,unit:u,done:false})
document.getElementById('item').value=''
document.getElementById('brand').value=''
save();renderItems();toast('Added')
}

function renderItems(){
const l=lists.find(x=>x.id===current)
const box=document.getElementById('items')
box.innerHTML=''

l.items.forEach(i=>{
box.innerHTML+=`
<div class='card item'>
<div class='left'>
<div class='chip blue'>${i.name}</div>
<div class='chip'>${i.qty}${i.unit}</div>
${i.brand?`<div class='chip'>${i.brand}</div>`:''}
</div>

<div class='actions'>
<button onclick='copy("${i.name}")'>⧉</button>
<button onclick='toggle(${i.id})'>${i.done?'↺':'✓'}</button>
<button onclick='removeItem(${i.id})'>⌫</button>
</div>
</div>`
})

const done=l.items.filter(x=>x.done).length
const total=l.items.length
const p=total?Math.round(done/total*100):0

document.getElementById('progressText').innerText=`${done} / ${total} completed`
document.getElementById('percent').innerText=p+'%'
document.getElementById('ring').style.background=`conic-gradient(#127c90 ${p*3.6}deg,#dceff2 0deg)`
}

function copy(t){
navigator.clipboard.writeText(t)
toast('Copied')
}

function toggle(id){
const l=lists.find(x=>x.id===current)
const i=l.items.find(x=>x.id===id)
i.done=!i.done
save();renderItems()
}

function removeItem(id){
const l=lists.find(x=>x.id===current)
l.items=l.items.filter(x=>x.id!==id)
save();renderItems()
}

function finishShopping(){
const idx=lists.findIndex(x=>x.id===current)
history.unshift({...lists[idx]})
lists.splice(idx,1)
save();render()
tab('history',document.querySelectorAll('.nav')[2])
toast('Moved to history')
}

function hist(){
const h=document.getElementById('historyWrap')
h.innerHTML=''

history.forEach(x=>{
const good=x.items.filter(i=>i.done)
const bad=x.items.filter(i=>!i.done)

h.innerHTML+=`
<div class='card'>
<div class='history-head'>
<div>
<h3>${x.name}</h3>
<div class='summary'>
✓ Purchased: ${good.length}<br>
✕ Not Found: ${bad.length}
</div>
</div>

<div style='display:flex;gap:8px'>
<button class='icon-btn' onclick='toggleHist(${x.id})'>⌄</button>
<button class='icon-btn' onclick='delHist(${x.id})'>✕</button>
</div>
</div>

<div class='details' id='h${x.id}'>
<div class='rowchips'>
${good.map(i=>`<div class='chip good'>✓ ${i.name}</div>`).join('')}
${bad.map(i=>`<div class='chip bad'>✕ ${i.name}</div>`).join('')}
</div>

<button class='primary' onclick='copyHist(${x.id})'>Add Selected To New List</button>
</div>
</div>`
})
}

function toggleHist(id){
const x=document.getElementById('h'+id)
x.style.display=x.style.display==='block'?'none':'block'
}

function delHist(id){
history=history.filter(x=>x.id!==id)
save();render()
}

function copyHist(id){
const h=history.find(x=>x.id===id)
lists.unshift({id:Date.now(),name:h.name+' Copy',items:[...h.items]})
save();render()
toast('Added')
}

render()
