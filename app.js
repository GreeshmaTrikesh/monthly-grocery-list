let items = JSON.parse(localStorage.getItem('groceryItems')) || [];

function saveItems() {
  localStorage.setItem('groceryItems', JSON.stringify(items));
}

function renderItems() {
  const list = document.getElementById('list');
  list.innerHTML = '';

  items.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'item';

    div.innerHTML = `
      <div class="item-title">${item.name}</div>
      <div>Qty: ${item.qty}</div>
      <div>Brand: ${item.brand}</div>

      <div class="actions">
        <button class="small-btn" onclick="searchDMart('${item.brand} ${item.name} ${item.qty}')">
          Search
        </button>

        <button class="small-btn" onclick="deleteItem(${index})">
          Delete
        </button>
      </div>
    `;

    list.appendChild(div);
  });
}

function addItem() {
  const name = document.getElementById('itemName').value;
  const qty = document.getElementById('itemQty').value;
  const brand = document.getElementById('itemBrand').value;

  if (!name) return;

  items.push({ name, qty, brand });

  saveItems();
  renderItems();

  document.getElementById('itemName').value = '';
  document.getElementById('itemQty').value = '';
  document.getElementById('itemBrand').value = '';
}

function deleteItem(index) {
  items.splice(index, 1);
  saveItems();
  renderItems();
}

function searchDMart(query) {
  const url = `https://www.dmart.in/search?q=${encodeURIComponent(query)}`;
  window.open(url, '_blank');
}

renderItems();
