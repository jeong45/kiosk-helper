
// =====================================
// 1. 상품 데이터
// =====================================
const FASTFOOD_PRODUCTS = [
  // 스페셜
  { name: '텍사스 칠리와퍼 팩1', price: 18000, category: '스페셜', color: '#FFFFFF', isNew: true },
  { name: '텍사스 칠리와퍼 팩2', price: 18000, category: '스페셜', color: '#FFFFFF', isNew: true },
  { name: '텍사스 칠리와퍼 팩3', price: 18000, category: '스페셜', color: '#FFFFFF', isNew: true },
  { name: '텍사스 칠리와퍼 팩4', price: 18000, category: '스페셜', color: '#FFFFFF', isNew: true },
  { name: '텍사스 칠리와퍼 팩5', price: 20500, category: '스페셜', color: '#FFFFFF', isNew: true },
  { name: '텍사스 칠리와퍼 팩6', price: 22500, category: '스페셜', color: '#FFFFFF', isNew: true },

  // 프리미엄
  { name: '콰트로치즈와퍼', price: 3900, category: '프리미엄', color: '#FFFFFF', isNew: false },
  { name: '통새우와퍼', price: 3900, category: '프리미엄', color: '#FFFFFF', isNew: false },
  { name: '할라피뇨와퍼', price: 3900, category: '프리미엄', color: '#FFFFFF', isNew: false },
  { name: '기네스콰트로치즈와퍼', price: 8500, category: '프리미엄', color: '#FFFFFF', isNew: false },
  { name: '기네스머쉬룸와퍼', price: 8900, category: '프리미엄', color: '#FFFFFF', isNew: false },
  { name: '기네스와퍼', price: 8500, category: '프리미엄', color: '#FFFFFF', isNew: false },

  // 와퍼
  { name: '치즈와퍼', price: 4100, category: '와퍼', color: '#FFFFFF', isNew: false },
  { name: '와퍼', price: 3500, category: '와퍼', color: '#FFFFFF', isNew: false },
  { name: '불고기와퍼', price: 3500, category: '와퍼', color: '#FFFFFF', isNew: false },
  { name: '갈릭불고기와퍼', price: 6800, category: '와퍼', color: '#FFFFFF', isNew: false },
  { name: '스태커4와퍼', price: 13000, category: '와퍼', color: '#FFFFFF', isNew: false },
  { name: '베이컨치즈와퍼', price: 8200, category: '와퍼', color: '#FFFFFF', isNew: false },

  // 사이드
  { name: '사이드소스', price: 300, category: '사이드', color: '#FFFFFF', isNew: false },
  { name: '너겟킹 8조각', price: 2000, category: '사이드', color: '#FFFFFF', isNew: false },
  { name: '21치즈스틱', price: 1600, category: '사이드', color: '#FFFFFF', isNew: false },
  { name: '프렌치프라이(L)', price: 2100, category: '사이드', color: '#FFFFFF', isNew: false },
  { name: '코코넛쉬림프', price: 3300, category: '사이드', color: '#FFFFFF', isNew: false },
  { name: '크리미모짜볼', price: 2200, category: '사이드', color: '#FFFFFF', isNew: false },
  { name: '볼케이노칠리프라이', price: 2800, category: '사이드', color: '#FFFFFF', isNew: false },
  { name: '치즈프라이', price: 2000, category: '사이드', color: '#FFFFFF', isNew: false },
  { name: '트러플프라이', price: 2000, category: '사이드', color: '#FFFFFF', isNew: false },
  { name: '어니언링', price: 2000, category: '사이드', color: '#FFFFFF', isNew: false },
  { name: '프렌치프라이(R)', price: 1600, category: '사이드', color: '#FFFFFF', isNew: false },
  { name: '코울슬로', price: 1400, category: '사이드', color: '#FFFFFF', isNew: false }
];

// =====================================
// 2. 현재 선택 상품 및 카테고리
// =====================================

let currentItem = {
  name: '',
  price: 0,
  quantity: 1
};

let currentCategory = '커피';


// =====================================
// 3. 키오스크 세션 관리
// =====================================

const sessionKey = 'fastfoodSessionStarted';

if (!sessionStorage.getItem(sessionKey)) {
  localStorage.removeItem('fastfoodCartItems');
  sessionStorage.setItem(sessionKey, 'true');
}


// =====================================
// 4. 장바구니 데이터 관리
// =====================================

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
  return cart.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );
}

function getTotalPrice(cart) {
  return cart.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );
}


// =====================================
// 5. 상품 목록 표시
// =====================================

function renderProducts(category) {
  const productGrid = document.getElementById('productGrid');

  if (!productGrid) {
    return;
  }

  currentCategory = category;

  const products = FASTFOOD_PRODUCTS.filter(
    product => product.category === category
  );

  productGrid.innerHTML = products.map((product, index) => `
    <div class="product-card"
     data-product-index="${index}"
     data-product-name="${product.name}">
      <div class="product-icon-box"
        style="background-color: ${product.color};">
        <span class="icon-store">🍔</span>
      </div>

      <div class="product-name">${product.name}</div>
      <div class="product-price">${formatPrice(product.price)}</div>
    </div>
  `).join('');

  // 상품 카드 클릭 이벤트
  const productCards = productGrid.querySelectorAll('.product-card');

  productCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      const product = products[index];
      openModal(product.name, product.price);
    });
  });

  // 선택된 카테고리 버튼 표시
  document.querySelectorAll('.tab-btn').forEach(button => {
    button.classList.toggle(
      'active',
      button.dataset.category === category
    );
  });

  // 카테고리에 맞춰 제목 변경
  const sectionTitle = document.querySelector('.section-title');

  if (sectionTitle) {
    sectionTitle.innerText = category;
  }
}


// 카테고리 버튼 연결

function initCategoryTabs() {
  const categoryButtons = document.querySelectorAll('.tab-btn');

  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      renderProducts(button.dataset.category);
    });
  });
}


// =====================================
// 6. 상품 선택 모달
// =====================================

function openModal(name, price) {
  currentItem = {
    name: name,
    price: Number(price),
    quantity: 1
  };

  const beam = document.getElementById('scanBeam');

  if (beam) {
    beam.style.opacity = '1';

    setTimeout(() => {
      beam.style.opacity = '0.4';
    }, 200);
  }

  const title = document.getElementById('modalItemTitle');
  const itemPrice = document.getElementById('modalItemPrice');
  const quantity = document.getElementById('modalQuantity');
  const buttonPrice = document.getElementById('modalBtnPrice');
  const modal = document.getElementById('optionModal');

  if (title) title.innerText = name;
  if (itemPrice) itemPrice.innerText = formatPrice(price);
  if (quantity) quantity.innerText = '1';
  if (buttonPrice) buttonPrice.innerText = formatPrice(price);

  if (modal) {
    modal.style.display = 'flex';
  }
}


// 모달 닫기

function closeModal() {
  const modal = document.getElementById('optionModal');

  if (modal) {
    modal.style.display = 'none';
  }
}


// 모달 안의 상품 수량 변경

function changeQuantity(change) {
  if (currentItem.quantity + change < 1) {
    return;
  }

  currentItem.quantity += change;

  const quantity = document.getElementById('modalQuantity');
  const buttonPrice = document.getElementById('modalBtnPrice');

  if (quantity) {
    quantity.innerText = currentItem.quantity;
  }

  const totalPrice = currentItem.price * currentItem.quantity;

  if (buttonPrice) {
    buttonPrice.innerText = formatPrice(totalPrice);
  }
}


// =====================================
// 7. 상품 장바구니에 담기
// =====================================

function addToCart() {
  if (!currentItem.name || currentItem.price <= 0) {
    return;
  }

  const cart = getCart();

  const index = cart.findIndex(
    item => item.name === currentItem.name
  );

  if (index > -1) {
    cart[index].quantity =
      Number(cart[index].quantity) + currentItem.quantity;
  } else {
    cart.push({ ...currentItem });
  }

  saveCart(cart);

  closeModal();

  updateCartBar();
}


// =====================================
// 8. 상품 선택 화면 장바구니 표시
// =====================================

function updateCartBar() {
  const cart = getCart();

  const totalCount = getTotalCount(cart);
  const totalPrice = getTotalPrice(cart);

  const bottomBar = document.getElementById('bottomCartBar');
  const topBadge = document.getElementById('topCartBadge');

  if (topBadge) {
    topBadge.innerText = `장바구니 ${totalCount}`;
  }

  if (bottomBar) {
    const hasItems = totalCount > 0;

    if (hasItems) {
      bottomBar.classList.add('active');

      bottomBar.innerText =
        `장바구니 보기 · ${totalCount}개 · ${formatPrice(totalPrice)}`;
    } else {
      bottomBar.classList.remove('active');
      bottomBar.innerText = '장바구니가 비어있습니다';
    }
  }

  const headerCount = document.getElementById('header-count');

  if (headerCount) {
    headerCount.innerText = totalCount;
  }
}


// 상품 선택 화면에서 장바구니 페이지 이동

function goToCart() {
  const cart = getCart();

  if (cart.length === 0) {
    alert('장바구니가 비어있습니다.');
    return;
  }

  window.location.href = 'cart.html';
}


// =====================================
// 9. 장바구니 화면 상품 목록 표시
// =====================================

function renderFastfoodCart() {
  const cartList = document.getElementById('cart-item-list');

  if (!cartList) {
    return;
  }

  const cart = getCart();

  const totalCount = getTotalCount(cart);
  const totalPrice = getTotalPrice(cart);

  const headerCount = document.getElementById('header-count');
  const totalCountElement = document.getElementById('total-count');
  const totalPriceElement = document.getElementById('total-price');

  if (headerCount) {
    headerCount.innerText = totalCount;
  }

  if (totalCountElement) {
    totalCountElement.innerText = totalCount;
  }

  if (totalPriceElement) {
    totalPriceElement.innerText = formatPrice(totalPrice);
  }

  if (cart.length === 0) {
    cartList.innerHTML = `
      <div class="empty-cart">
        <p>장바구니가 비어있습니다.</p>
        <p>상품을 담아주세요.</p>
      </div>
    `;

    return;
  }

  cartList.innerHTML = cart.map((item, index) => `
    <div class="item-card">

      <div class="item-info">
        <div class="item-icon">🛒</div>

        <div class="item-details">
          <span class="item-name">${item.name}</span>
          <span class="item-price">${formatPrice(item.price)}</span>
        </div>
      </div>

      <div class="quantity-control">
        <button type="button" class="btn-qty"
          onclick="changeFastfoodCartQuantity(${index}, -1)">-</button>

        <span class="qty-num">${item.quantity}</span>

        <button type="button" class="btn-qty"
          onclick="changeFastfoodCartQuantity(${index}, 1)">+</button>
      </div>

    </div>
  `).join('');
}


// =====================================
// 10. 장바구니 상품 수량 변경
// =====================================

function changeFastfoodCartQuantity(index, change) {
  const cart = getCart();

  if (!cart[index]) {
    return;
  }

  cart[index].quantity =
    Number(cart[index].quantity) + change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);

  renderFastfoodCart();
  updateCartBar();
}


// =====================================
// 11. 주문 확인 화면 상품 목록 표시
// =====================================

function renderFOrder() {
  const orderList = document.getElementById('order-item-list');

  if (!orderList) {
    return;
  }

  const cart = getCart();

  const totalCount = getTotalCount(cart);
  const totalPrice = getTotalPrice(cart);

  const orderCount = document.getElementById('order-total-count');
  const orderPrice = document.getElementById('order-total-price');

  if (orderCount) {
    orderCount.innerText = totalCount;
  }

  if (orderPrice) {
    orderPrice.innerText = formatPrice(totalPrice);
  }

  if (cart.length === 0) {
    orderList.innerHTML = `
      <div class="empty-cart">
        <p>주문할 상품이 없습니다.</p>
      </div>
    `;

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

      <div class="quantity-badge">
        ${item.quantity}개
      </div>

    </div>
  `).join('');
}


// =====================================
// 12. 주문 확인 화면 상품 목록 표시
// =====================================

function renderFastfoodOrder() {
  const orderList = document.getElementById('order-item-list');

  if (!orderList) {
    return;
  }

  const cart = getCart();
  const totalCount = getTotalCount(cart);
  const totalPrice = getTotalPrice(cart);
  const orderCount = document.getElementById('order-total-count');
  const orderPrice = document.getElementById('order-total-price');

  if (orderCount) {
    orderCount.innerText = totalCount;
  }

  if (orderPrice) {
    orderPrice.innerText = formatPrice(totalPrice);
  }

  if (cart.length === 0) {
    orderList.innerHTML = `
      <div class="empty-cart">
        <p>주문할 상품이 없습니다.</p>
      </div>
    `;
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


// =====================================
// 13. 장바구니 / 주문 확인 화면 전환
// =====================================

function showFastfoodView(viewName) {
  const cartView = document.getElementById('cart-view');
  const orderView = document.getElementById('order-view');

  if (!cartView || !orderView) {
    return;
  }

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
// 13. 페이지 로딩 후 실행
// =====================================

document.addEventListener('DOMContentLoaded', () => {

  // 상품 선택 페이지인지 확인
  const productGrid = document.getElementById('productGrid');

  if (productGrid) {
    initCategoryTabs();
    renderProducts('스페셜');
  }

  // 장바구니 표시 갱신
  updateCartBar();

  // 장바구니 페이지인지 확인
  const cartView = document.getElementById('cart-view');

  if (!cartView) {
    return;
  }

  renderFastfoodCart();

  // 메뉴 더 담기 버튼
  const btnMoreMenu = document.getElementById('btn-more-menu');

  if (btnMoreMenu) {
    btnMoreMenu.addEventListener('click', () => {
      window.location.href = 'menu.html';
    });
  }

  // 더 담기 버튼
  const btnMore = document.getElementById('btn-more');

  if (btnMore) {
    btnMore.addEventListener('click', () => {
      window.location.href = 'menu.html';
    });
  }

  // 주문 확인 버튼
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

  // 이전 버튼
  const btnBack = document.getElementById('btn-back');

  if (btnBack) {
    btnBack.addEventListener('click', () => {
      showFastfoodView('cart');
    });
  }

  // 결제하기 버튼
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
