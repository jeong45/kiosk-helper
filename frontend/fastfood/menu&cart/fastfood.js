// =====================================
// 1. 상품 데이터 & 세트 옵션 데이터
// =====================================
const FASTFOOD = [
  // 와퍼
  { name: '치즈와퍼', price: 4100, category: '와퍼', color: '#FFFFFF', isNew: false },
  { name: '와퍼', price: 3500, category: '와퍼', color: '#FFFFFF', isNew: false },
  { name: '불고기와퍼', price: 3500, category: '와퍼', color: '#FFFFFF', isNew: false },
  { name: '갈릭불고기와퍼', price: 6800, category: '와퍼', color: '#FFFFFF', isNew: false },
  { name: '스태커4와퍼', price: 13000, category: '와퍼', color: '#FFFFFF', isNew: false },
  { name: '베이컨치즈와퍼', price: 8200, category: '와퍼', color: '#FFFFFF', isNew: false },

  // 사이드
  { name: '프렌치프라이', price: 2800, category: '사이드', color: '#FFFFFF', isNew: false },
  { name: '너겟킹 3조각', price: 2000, category: '사이드', color: '#FFFFFF', isNew: false },
  { name: '치즈스틱', price: 1600, category: '사이드', color: '#FFFFFF', isNew: false },
  { name: '어니언링', price: 2000, category: '사이드', color: '#FFFFFF', isNew: false },
  { name: '코울슬로', price: 1400, category: '사이드', color: '#FFFFFF', isNew: false },

  // 음료
  { name: '코카콜라', price: 1800, category: '음료', color: '#FFFFFF', isNew: false },
  { name: '코카콜라 제로', price: 1800, category: '음료', color: '#FFFFFF', isNew: false },
  { name: '스프라이트', price: 1800, category: '음료', color: '#FFFFFF', isNew: false },
  { name: '미닛메이드 오렌지', price: 1800, category: '음료', color: '#FFFFFF', isNew: false },
  { name: '아메리카노', price: 1800, category: '음료', color: '#FFFFFF', isNew: false },
  { name: '씨그램', price: 1800, category: '음료', color: '#FFFFFF', isNew: false }
];

// 세트용 사이드 옵션
const SET_SIDES = [
  { name: '프렌치프라이', price: 0, icon: '🍟' },
  { name: '프렌치프라이 교환', price: 0, icon: '🍟' },
  { name: '너겟킹 3조각', price: 0, icon: '🍗' },
  { name: '치즈스틱', price: 0, icon: '🧀' },
  { name: '어니언링', price: 300, icon: '🧅' },
  { name: '코울슬로', price: 0, icon: '🥗' }
];

// 세트용 음료 옵션
const SET_DRINKS = [
  { name: '코카콜라', price: 0, icon: '🥤' },
  { name: '코카콜라 제로', price: 0, icon: '🥤' },
  { name: '스프라이트', price: 0, icon: '🥤' },
  { name: '씨그램', price: 0, icon: '🥤' },
  { name: '아메리카노', price: 0, icon: '☕' },
  { name: '미닛메이드 오렌지', price: 800, icon: '🧃' }
];

// 모달 제안용 메뉴
const ADDON_PRODUCTS = [
  { id: 'a1', name: '감자튀김', price: 1700, icon: '🍟' },
  { id: 'a2', name: '코카콜라', price: 1800, icon: '🥤' },
  { id: 'a3', name: '코코넛쉬림프', price: 3500, icon: '🍤' },
  { id: 'a4', name: '바삭킹 2조각', price: 2600, icon: '🍗' }
];



// =====================================
// 2. 현재 선택 및 상태 관리
// =====================================
let currentItem = {
  name: '',
  price: 0,
  quantity: 1,
  setType: 'single', // single, set, large_set
  side: null,
  drink: null
};

let currentCategory = '와퍼';
let selectedAddon = null;

// =====================================
// 3. 키오스크 세션 & 장바구니 유틸
// =====================================
const sessionKey = 'fastfoodSessionStarted';
if (!sessionStorage.getItem(sessionKey)) {
  localStorage.removeItem('fastfoodCartItems');
  sessionStorage.setItem(sessionKey, 'true');
}

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem('fastfoodCartItems'));
    return Array.isArray(cart) ? cart : [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('fastfoodCartItems', JSON.stringify(cart));
}

function formatPrice(price) {
  return Number(price).toLocaleString('ko-KR') + '원';
}

function getTotalCount(cart) {
  return cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

function getTotalPrice(cart) {
  return cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
}
// =====================================
// 4. 메뉴판 렌더링
// =====================================
function renderProducts(category) {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) return;

  currentCategory = category;
  const products = FASTFOOD.filter(p => p.category === category);

  productGrid.innerHTML = products.map((product, index) => `
    <div class="product-card" data-product-index="${index}">
      <div class="product-icon-box" style="background-color: ${product.color};">
        <span class="icon-store">🍔</span>
      </div>
      <div class="product-name">${product.name}</div>
      <div class="product-price">${formatPrice(product.price)}</div>
    </div>
  `).join('');

  const productCards = productGrid.querySelectorAll('.product-card');
  productCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      const product = products[index];
      
      if (category === '와퍼') {
        // [수정된 부분] HTML에 세트 선택 창이 있는지 확인해서 에러 방지
        const setModalExists = document.getElementById('setChoiceModal');
        
        if (setModalExists) {
          openSetChoiceModal(product); // 기본 메뉴판에서는 세트 선택 창 열기
        } else {
          // 미션 모드(easy.html)처럼 세트 창이 없으면 바로 단품 수량 조절 창 열기
          currentItem = {
            name: product.name,
            price: product.price,
            quantity: 1,
            setType: 'single',
            side: null,
            drink: null
          };
          openModal(product.name, product.price);
        }
      } else {
        // 사이드/음료는 바로 수량 모달로
        currentItem = {
          name: product.name,
          price: product.price,
          quantity: 1,
          setType: 'single',
          side: null,
          drink: null
        };
        openModal(product.name, product.price);
      }
    });
  });

  document.querySelectorAll('.tab-btn').forEach(button => {
    button.classList.toggle('active', button.dataset.category === category);
  });

  const sectionTitle = document.querySelector('.section-title');
  if (sectionTitle) sectionTitle.innerText = category;
}

function initCategoryTabs() {
  document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
      renderProducts(button.dataset.category);
    });
  });
}

// =====================================
// 5. 와퍼 옵션 선택 모달 흐름 (단품/세트/라지세트)
// =====================================
let tempSelectedBurger = null;

function openSetChoiceModal(burger) {
  tempSelectedBurger = burger;
  currentItem = {
    name: burger.name,
    price: burger.price,
    quantity: 1,
    setType: 'single',
    side: SET_SIDES[0],
    drink: SET_DRINKS[0]
  };

  document.getElementById('setTitleBurgerName').innerText = burger.name;
  document.getElementById('label-large-set').innerText = `${burger.name} 라지세트`;
  document.getElementById('label-set').innerText = `${burger.name} 세트`;

  document.getElementById('price-single').innerText = formatPrice(burger.price);
  document.getElementById('price-set').innerText = formatPrice(burger.price + 3500);
  document.getElementById('price-large-set').innerText = formatPrice(burger.price + 4200);

  selectSetOption('single'); // 기본 선택은 단품
  document.getElementById('setChoiceModal').style.display = 'flex';
}

function selectSetOption(type) {
  currentItem.setType = type;
  document.querySelectorAll('.set-opt-item').forEach(el => el.classList.remove('selected'));
  if (type === 'single') document.getElementById('opt-single').classList.add('selected');
  if (type === 'set') document.getElementById('opt-set').classList.add('selected');
  if (type === 'large_set') document.getElementById('opt-large-set').classList.add('selected');
}

function closeSetChoiceModal() {
  document.getElementById('setChoiceModal').style.display = 'none';
}

function confirmSetChoice() {
  closeSetChoiceModal();
  if (currentItem.setType === 'single') {
    openModal(currentItem.name, currentItem.price);
  } else {
    openSetSideModal(); // 세트나 라지세트면 사이드 선택으로 이동
  }
}

// 세트 사이드 선택 모달
function openSetSideModal() {
  const grid = document.getElementById('setSideGrid');
  grid.innerHTML = SET_SIDES.map((item, idx) => `
    <div class="addon-item ${currentItem.side?.name === item.name ? 'selected' : ''}" onclick="selectSetSide(${idx})">
      <div class="addon-icon-box">${item.icon}</div>
      <div class="addon-name">${item.name}</div>
      <div class="addon-price">${item.price > 0 ? '+' + formatPrice(item.price) : '0원'}</div>
    </div>
  `).join('');
  document.getElementById('setSideModal').style.display = 'flex';
}

function selectSetSide(index) {
  currentItem.side = SET_SIDES[index];
  openSetSideModal(); // 재렌더링으로 선택 표시 update
}

function closeSetSideModal() {
  document.getElementById('setSideModal').style.display = 'none';
}

function confirmSetSide() {
  closeSetSideModal();
  openSetDrinkModal(); // 음료 선택으로 이동
}

// 세트 음료 선택 모달
function openSetDrinkModal() {
  const grid = document.getElementById('setDrinkGrid');
  grid.innerHTML = SET_DRINKS.map((item, idx) => `
    <div class="addon-item ${currentItem.drink?.name === item.name ? 'selected' : ''}" onclick="selectSetDrink(${idx})">
      <div class="addon-icon-box">${item.icon}</div>
      <div class="addon-name">${item.name}</div>
      <div class="addon-price">${item.price > 0 ? '+' + formatPrice(item.price) : '0원'}</div>
    </div>
  `).join('');
  document.getElementById('setDrinkModal').style.display = 'flex';
}

function selectSetDrink(index) {
  currentItem.drink = SET_DRINKS[index];
  openSetDrinkModal(); // 재렌더링
}

function closeSetDrinkModal() {
  document.getElementById('setDrinkModal').style.display = 'none';
}

function confirmSetDrink() {
  closeSetDrinkModal();

  // 계산된 세트 최종 가격 설정
  let basePrice = tempSelectedBurger.price;
  if (currentItem.setType === 'set') basePrice += 3500;
  if (currentItem.setType === 'large_set') basePrice += 4200;

  if (currentItem.side) basePrice += currentItem.side.price;
  if (currentItem.drink) basePrice += currentItem.drink.price;

  currentItem.price = basePrice;
  let setNameTag = currentItem.setType === 'large_set' ? ' (라지세트)' : ' (세트)';
  
  openModal(currentItem.name + setNameTag, currentItem.price);
}

// =====================================
// 6. 상품 수량 조절 모달
// =====================================
function openModal(name, price) {
  const title = document.getElementById('modalItemTitle');
  const itemPrice = document.getElementById('modalItemPrice');
  const quantity = document.getElementById('modalQuantity');
  const buttonPrice = document.getElementById('modalBtnPrice');
  const modal = document.getElementById('optionModal');

  if (title) title.innerText = name;
  if (itemPrice) itemPrice.innerText = formatPrice(price);
  if (quantity) quantity.innerText = '1';
  if (buttonPrice) buttonPrice.innerText = formatPrice(price);

  if (modal) modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('optionModal');
  if (modal) modal.style.display = 'none';
}

function changeQuantity(change) {
  if (currentItem.quantity + change < 1) return;
  currentItem.quantity += change;

  const quantity = document.getElementById('modalQuantity');
  const buttonPrice = document.getElementById('modalBtnPrice');
  if (quantity) quantity.innerText = currentItem.quantity;
  if (buttonPrice) buttonPrice.innerText = formatPrice(currentItem.price * currentItem.quantity);
}

// =====================================
// 7. 장바구니 담기 & 베스트메뉴 제안
// =====================================
function addToCart() {
  if (!currentItem.name || currentItem.price <= 0) return;
  closeModal();
  
  // addonModal(추가 제안 창)이 현재 HTML에 있는지 확인
  const addonModal = document.getElementById('addonModal');
  
  if (addonModal) {
    openAddonModal(); // 메뉴판(menu.html)처럼 모달이 있으면 띄움
  } else {
    submitAddonAndCart(false); // 미션모드(easy.html)처럼 모달이 없으면 바로 담기!
  }
}

function openAddonModal() {
  selectedAddon = null;
  const addonGrid = document.getElementById('addonGrid');
  const modal = document.getElementById('addonModal');

  if (addonGrid) {
    addonGrid.innerHTML = ADDON_PRODUCTS.map((item, index) => `
      <div class="addon-item" id="addon-item-${index}" onclick="toggleAddon(${index})">
        <div class="addon-icon-box">${item.icon}</div>
        <div class="addon-name">${item.name}</div>
        <div class="addon-price">${formatPrice(item.price)}</div>
      </div>
    `).join('');
  }
  if (modal) modal.style.display = 'flex';
}

function closeAddonModal() {
  const modal = document.getElementById('addonModal');
  if (modal) modal.style.display = 'none';
}

function toggleAddon(index) {
  const items = document.querySelectorAll('.addon-item');
  items.forEach(item => item.classList.remove('selected'));

  if (selectedAddon && selectedAddon.id === ADDON_PRODUCTS[index].id) {
    selectedAddon = null;
  } else {
    selectedAddon = ADDON_PRODUCTS[index];
    document.getElementById(`addon-item-${index}`).classList.add('selected');
  }
}

function submitAddonAndCart(isAdd) {
  const cart = getCart();
  const isBurger = FASTFOOD.some(
    item => item.name === currentItem.name && item.category === '와퍼'
  );
  const options = {};

  if (isBurger) {
    options.composition = currentItem.setType;
    if (currentItem.setType !== 'single') {
      options.set_side = currentItem.side ? currentItem.side.name : null;
      options.drink = currentItem.drink ? currentItem.drink.name : null;
    }
  }

  cart.push({
    name: currentItem.name,
    price: currentItem.price,
    quantity: currentItem.quantity,
    options
  });

  if (isAdd && selectedAddon) {
    cart.push({
      name: selectedAddon.name,
      price: selectedAddon.price,
      quantity: 1,
      options: {}
    });
  }

  saveCart(cart);
  closeAddonModal();
  updateCartBar();
}

// =====================================
// 8. 장바구니 바 & 장바구니 페이지 조작
// =====================================
function updateCartBar() {
  const cart = getCart();
  const totalCount = getTotalCount(cart);
  const totalPrice = getTotalPrice(cart);

  const bottomBar = document.getElementById('bottomCartBar');
  const topBadge = document.getElementById('topCartBadge');

  if (topBadge) topBadge.innerText = `장바구니 ${totalCount}`;
  if (bottomBar) {
    if (totalCount > 0) {
      bottomBar.classList.add('active');
      bottomBar.innerText = `장바구니 보기 · ${totalCount}개 · ${formatPrice(totalPrice)}`;
    } else {
      bottomBar.classList.remove('active');
      bottomBar.innerText = '장바구니가 비어있습니다';
    }
  }
}

// =====================================
// 상품 선택 화면에서 장바구니 페이지 이동 
// =====================================
function goToCart() {
  const cart = getCart();

  if (cart.length === 0) {
    alert('장바구니가 비어있습니다.');
    return;
  }

  if (window.location.href.includes('easy.html') || window.location.href.includes('mission')) {
    window.location.href = '../../menu&cart/cart.html';
  } else {
    // 일반 메뉴판일 때는 원래대로 이동
    window.location.href = 'cart.html';
  }
}
function renderFastfoodCart() {
  const cartList = document.getElementById('cart-item-list');
  if (!cartList) return;

  const cart = getCart();
  const totalCount = getTotalCount(cart);
  const totalPrice = getTotalPrice(cart);

  const headerCount = document.getElementById('header-count');
  const totalCountElement = document.getElementById('total-count');
  const totalPriceElement = document.getElementById('total-price');

  if (headerCount) headerCount.innerText = totalCount;
  if (totalCountElement) totalCountElement.innerText = totalCount;
  if (totalPriceElement) totalPriceElement.innerText = formatPrice(totalPrice);

  if (cart.length === 0) {
    cartList.innerHTML = `<div class="empty-cart"><p>장바구니가 비어있습니다.</p></div>`;
    return;
  }

  cartList.innerHTML = cart.map((item, index) => {
    let optionDetail = '';
    if (item.options && item.options.composition !== 'single') {
      optionDetail = `<div style="font-size:0.75rem; color:#64748b;">${item.options.set_side || ''} · ${item.options.drink || ''}</div>`;
    }
    return `
      <div class="item-card">
        <div class="item-info">
          <div class="item-icon">🛒</div>
          <div class="item-details">
            <span class="item-name">${item.name}</span>
            ${optionDetail}
            <span class="item-price">${formatPrice(item.price)}</span>
          </div>
        </div>
        <div class="quantity-control">
          <button type="button" class="btn-qty" onclick="changeFastfoodCartQuantity(${index}, -1)">-</button>
          <span class="qty-num">${item.quantity}</span>
          <button type="button" class="btn-qty" onclick="changeFastfoodCartQuantity(${index}, 1)">+</button>
        </div>
      </div>
    `;
  }).join('');
}

function changeFastfoodCartQuantity(index, change) {
  const cart = getCart();
  if (!cart[index]) return;

  cart[index].quantity = Number(cart[index].quantity) + change;
  if (cart[index].quantity <= 0) cart.splice(index, 1);

  saveCart(cart);
  renderFastfoodCart();
  updateCartBar();
}

function renderFastfoodOrder() {
  const orderList = document.getElementById('order-item-list');
  if (!orderList) return;

  const cart = getCart();
  const totalCount = getTotalCount(cart);
  const totalPrice = getTotalPrice(cart);

  const orderCount = document.getElementById('order-total-count');
  const orderPrice = document.getElementById('order-total-price');

  if (orderCount) orderCount.innerText = totalCount;
  if (orderPrice) orderPrice.innerText = formatPrice(totalPrice);

  if (cart.length === 0) {
    orderList.innerHTML = `<div class="empty-cart"><p>주문할 상품이 없습니다.</p></div>`;
    return;
  }

  orderList.innerHTML = cart.map(item => `
    <div class="item-card">
      <div class="item-info">
        <div class="item-icon">🛒</div>
        <div class="item-details">
          <span class="item-name">${item.name}</span>
          <span class="item-price">${formatPrice(item.price)}</span>
        </div>
      </div>
      <div class="quantity-badge">${item.quantity}개</div>
    </div>
  `).join('');
}

function showFastfoodView(viewName) {
  const cartView = document.getElementById('cart-view');
  const orderView = document.getElementById('order-view');
  if (!cartView || !orderView) return;

  if (viewName === 'order') {
    renderFastfoodOrder();
    cartView.classList.remove('active');
    orderView.classList.add('active');
  } else {
    renderFastfoodCart();
    orderView.classList.remove('active');
    cartView.classList.add('active');
  }
}

// =====================================
// 9. DOM 로딩 시 실행
// =====================================
document.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.getElementById('productGrid');
  if (productGrid) {
    initCategoryTabs();
    renderProducts('와퍼');
  }

  updateCartBar();

  const cartView = document.getElementById('cart-view');
  if (!cartView) return;

  renderFastfoodCart();

  const btnMoreMenu = document.getElementById('btn-more-menu');
  if (btnMoreMenu) btnMoreMenu.addEventListener('click', () => {
    if (sessionStorage.getItem('fastfoodMissionMode') === 'true') {
      const difficulty =
        sessionStorage.getItem('fastfoodMissionDifficulty') === 'hard'
          ? 'hard'
          : 'easy';
      window.location.href = `../mission/${difficulty}/${difficulty}.html`;
      return;
    }
    window.location.href = 'menu.html';
  });

  const btnMore = document.getElementById('btn-more');
  if (btnMore) btnMore.addEventListener('click', () => {
    if (sessionStorage.getItem('fastfoodMissionMode') === 'true') {
      const difficulty =
        sessionStorage.getItem('fastfoodMissionDifficulty') === 'hard'
          ? 'hard'
          : 'easy';
      window.location.href = `../mission/${difficulty}/${difficulty}.html`;
      return;
    }
    window.location.href = 'menu.html';
  });

  const btnGoOrder = document.getElementById('btn-go-order');
  if (btnGoOrder) {
    btnGoOrder.addEventListener('click', () => {
      if (getCart().length === 0) {
        alert('장바구니가 비어있습니다.');
        return;
      }
      showFastfoodView('order');
    });
  }

  const btnBack = document.getElementById('btn-back');
  if (btnBack) btnBack.addEventListener('click', () => showFastfoodView('cart'));

  const btnPay = document.getElementById('btn-pay');
  if (btnPay) {
    btnPay.addEventListener('click', () => {
      if (getCart().length === 0) {
        alert('결제할 상품이 없습니다.');
        return;
      }
      window.location.href = '../reward/reward.html';
    });
  }
});