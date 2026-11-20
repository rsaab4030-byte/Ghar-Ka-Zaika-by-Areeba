const dishes = [
  {
    id: 'chicken-biryani',
    name: 'Chicken Biryani',
    portion: 'Chota Box',
    price: 250,
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80',
    colors: ['#D97724', '#F4C430', '#8B3A14']
  },
  {
    id: 'chicken-pulao',
    name: 'Chicken Pulao',
    portion: 'Chota Box',
    price: 250,
    img: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=300&q=80',
    colors: ['#C99A5B', '#F2DFC1', '#7B4B26']
  },
  {
    id: 'chana-pulao',
    name: 'Chana Pulao',
    portion: 'Chota Box',
    price: 150,
    img: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=300&q=80',
    colors: ['#B87A3D', '#E8CFA6', '#6E421B']
  },
  {
    id: 'chicken-mandi',
    name: 'Chicken Mandi',
    portion: '1kg (1 Leg Piece)',
    price: 800,
    img: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=300&q=80',
    colors: ['#B84A1E', '#F3D299', '#5E240D']
  },
  {
    id: 'chicken-manchurian',
    name: 'Chicken Manchurian & Chinese Rice',
    portion: 'Chota Box',
    price: 600,
    img: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=300&q=80',
    colors: ['#A8281B', '#F7E7CE', '#4D140E']
  },
  {
    id: 'malka-masoor',
    name: 'Malka Masoor Pulao',
    portion: 'Chota Box',
    price: 200,
    img: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=300&q=80',
    colors: ['#7A4928', '#E5C9A3', '#4A2B16']
  },
  {
    id: 'tikka-biryani',
    name: 'Tikka Biryani',
    portion: '1kg',
    price: 1000,
    img: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=300&q=80',
    colors: ['#C43E1C', '#F5B841', '#691D0B']
  },
  {
    id: 'vegetable-rice',
    name: 'Vegetable Rice',
    portion: 'Chota Box',
    price: 300,
    img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=300&q=80',
    colors: ['#4C8C3B', '#F4E3B2', '#D96B27']
  },
  {
    id: 'beef-biryani',
    name: 'Beef Biryani',
    portion: 'Chota Box',
    price: 350,
    img: 'https://images.unsplash.com/photo-1633945274309-2c16c9682a8c?auto=format&fit=crop&w=300&q=80',
    colors: ['#8F3419', '#F0B643', '#4F1B0C']
  },
  {
    id: 'chicken-fajita-rice',
    name: 'Chicken Fajita Rice',
    portion: 'Chota Box',
    price: 450,
    img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=300&q=80',
    colors: ['#C95B24', '#F5D68E', '#3E6B2C']
  }
];

const cart = {};
let deferredPrompt = null;

function generateBowlFallback(colors) {
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#F5E4CA';
  ctx.fillRect(0, 0, 160, 160);

  ctx.beginPath();
  ctx.arc(80, 86, 56, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(59, 30, 13, 0.18)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(80, 80, 56, 0, Math.PI * 2);
  ctx.fillStyle = colors[2];
  ctx.fill();

  ctx.beginPath();
  ctx.arc(80, 80, 48, 0, Math.PI * 2);
  ctx.fillStyle = colors[1];
  ctx.fill();

  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * Math.PI * 2;
    const r = 14 + (i % 3) * 10;
    const x = 80 + Math.cos(angle) * r;
    const y = 80 + Math.sin(angle) * r;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? colors[0] : colors[2];
    ctx.fill();
  }

  return canvas.toDataURL('image/png');
}

function renderMenu() {
  const container = document.getElementById('menuList');
  container.innerHTML = '';

  dishes.forEach(dish => {
    const qty = cart[dish.id] || 0;
    const card = document.createElement('article');
    card.className = 'dish-card';

    const img = document.createElement('img');
    img.className = 'dish-thumb';
    img.alt = dish.name;
    img.src = dish.img;
    img.onerror = function () {
      this.onerror = null;
      this.src = generateBowlFallback(dish.colors);
    };

    const info = document.createElement('div');
    info.className = 'dish-info';
    info.innerHTML = `
      <div class="dish-name">${dish.name}</div>
      <div class="dish-portion">${dish.portion}</div>
      <div class="dish-price">${dish.price} PKR</div>
    `;

    const controls = document.createElement('div');
    controls.className = 'qty-controls';
    controls.innerHTML = `
      <button class="qty-btn" type="button" aria-label="Decrease ${dish.name}" onclick="updateQty('${dish.id}', -1)">−</button>
      <span class="qty-val" id="qty-${dish.id}">${qty}</span>
      <button class="qty-btn" type="button" aria-label="Increase ${dish.name}" onclick="updateQty('${dish.id}', 1)">+</button>
    `;

    card.appendChild(img);
    card.appendChild(info);
    card.appendChild(controls);
    container.appendChild(card);
  });
}

function updateQty(id, delta) {
  const current = cart[id] || 0;
  const next = Math.max(0, current + delta);
  if (next === 0) {
    delete cart[id];
  } else {
    cart[id] = next;
  }
  const qtyEl = document.getElementById(`qty-${id}`);
  if (qtyEl) qtyEl.textContent = next;
  updateSummary();
}

function updateSummary() {
  let totalItems = 0;
  let totalPrice = 0;

  dishes.forEach(dish => {
    const qty = cart[dish.id] || 0;
    totalItems += qty;
    totalPrice += qty * dish.price;
  });

  document.getElementById('itemCountLabel').textContent =
    `${totalItems} ${totalItems === 1 ? 'Item' : 'Items'} Selected`;
  document.getElementById('totalPriceLabel').textContent = `Total: ${totalPrice} PKR`;
}

document.getElementById('whatsappOrderBtn').addEventListener('click', () => {
  const phone = '923142011627';
  const selected = dishes.filter(d => (cart[d.id] || 0) > 0);
  const note = document.getElementById('orderNote').value.trim();

  let message = 'Assalam-o-Alaikum! I would like to place an order from *Ghar Ka Zaika by Areeba*:%0A%0A';

  if (selected.length === 0) {
    message += '• Please share details for a Customized Order.%0A';
  } else {
    let grandTotal = 0;
    selected.forEach((d, idx) => {
      const qty = cart[d.id];
      const sub = qty * d.price;
      grandTotal += sub;
      message += `${idx + 1}. *${d.name}* (${d.portion}) x ${qty} = ${sub} PKR%0A`;
    });
    message += `%0A*Grand Total: ${grandTotal} PKR*%0A`;
  }

  if (note) {
    message += `%0A*Note / Address:* ${encodeURIComponent(note)}%0A`;
  }

  message += '%0A(Delivery All Karachi)';
  window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
});

// PWA / Shortcut Install Support
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

const installBtn = document.getElementById('installAppBtn');
const shortcutModal = document.getElementById('shortcutModal');
const closeModalBtn = document.getElementById('closeModalBtn');

installBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  } else {
    shortcutModal.hidden = false;
  }
});

closeModalBtn.addEventListener('click', () => {
  shortcutModal.hidden = true;
});

shortcutModal.addEventListener('click', (e) => {
  if (e.target === shortcutModal) {
    shortcutModal.hidden = true;
  }
});

if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

renderMenu();
updateSummary();
