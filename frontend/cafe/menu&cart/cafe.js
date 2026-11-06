
// =====================================
// 1. 상품 데이터
// =====================================

const CAFE = [
  // 커피
  { name: '아메리카노', price: 2000, category: '커피', color: '#633A1F' },
  { name: '카페라떼', price: 3500, category: '커피', color: '#F2D3A1' },
  { name: '바닐라라떼', price: 3900, category: '커피', color: '#F7E779' },
  { name: '카페모카', price: 4000, category: '커피', color: '#443E38' },
  { name: '콜드브루', price: 3800, category: '커피', color: '#1D1A18' },
  { name: '에스프레소', price: 2500, category: '커피', color: '#4E2911' },

  // 음료
  { name: '블루베리 스무디', price: 5100, category: '음료', color: '#9366F5' },
  { name: '망고 스무디', price: 5000, category: '음료', color: '#D9B31E' },
  { name: '딸기 프라페', price: 5200, category: '음료', color: '#DC6C78' },
  { name: '초코 라떼', price: 4500, category: '음료', color: '#7E4B25' },
  { name: '말차 라떼', price: 4700, category: '음료', color: '#4C9167' },
  { name: '딸기 주스', price: 4500, category: '음료', color: '#DE6F6B' },

  // 티
  { name: '유자차', price: 4200, category: '티', color: '#D9BB1A' },
  { name: '레몬차', price: 4200, category: '티', color: '#C5DF6C' },
  { name: '캐모마일', price: 3800, category: '티', color: '#F3E888' },
  { name: '페퍼민트', price: 3800, category: '티', color: '#68C38B' },
  { name: '얼그레이', price: 3800, category: '티', color: '#A05720' },
  { name: '복숭아 아이스티', price: 3500, category: '티', color: '#E4A968' },

  // 베이커리
  { name: '플레인 크로플', price: 2500, category: '베이커리', color: '#DF981E' },
  { name: '춘천감자빵', price: 3500, category: '베이커리', color: '#BA881F' },
  { name: '치즈케이크', price: 3300, category: '베이커리', color: '#F9F4C2' },
  { name: '초코 머핀', price: 3200, category: '베이커리', color: '#57331C' },
  { name: '소금빵', price: 2800, category: '베이커리', color: '#EDCE9E' },
  { name: '마카롱', price: 1800, category: '베이커리', color: '#E49AC9' },

  // 상품
  { name: '2027 캘린더', price: 7500, category: '상품', color: '#4D96EB' },
  { name: '시그니처 머그컵', price: 5500, category: '상품', color: '#C8CCD2' },
  { name: '인형 키링', price: 4000, category: '상품', color: '#E4B65B' },
  { name: '텀블러', price: 12000, category: '상품', color: '#54A66C' },
  { name: '드립백 세트', price: 8500, category: '상품', color: '#A85A1D' },
  { name: '원두 200g', price: 15000, category: '상품', color: '#2A2928' }
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

const sessionKey = 'cafeSessionStarted';

if (!sessionStorage.getItem(sessionKey)) {
  localStorage.removeItem('cafeCartItems');
  sessionStorage.setItem(sessionKey, 'true');
}


// =====================================
// 4. 장바구니 데이터 관리
// =====================================

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem('cafeCartItems'));
    return Array.isArray(cart) ? cart : [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('cafeCartItems', JSON.stringify(cart));
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

  const products = CAFE.filter(
    product => product.category === category
  );

  productGrid.innerHTML = products.map((product, index) => `
    <div class="product-card"
     data-product-index="${index}"
     data-product-name="${product.name}">
      <div class="product-icon-box"
        style="background-color: ${product.color};">
        <span class="icon-store">☕️</span>
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

function renderCafeCart() {
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
          onclick="changeCafeCartQuantity(${index}, -1)">-</button>

        <span class="qty-num">${item.quantity}</span>

        <button type="button" class="btn-qty"
          onclick="changeCafeCartQuantity(${index}, 1)">+</button>
      </div>

    </div>
  `).join('');
}


// =====================================
// 10. 장바구니 상품 수량 변경
// =====================================

function changeCafeCartQuantity(index, change) {
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

  renderCafeCart();
  updateCartBar();
}


// =====================================
// 11. 주문 확인 화면 상품 목록 표시
// =====================================

function renderCafeOrder() {
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
// 12. 장바구니 / 주문 확인 화면 전환
// =====================================

function showCafeView(viewName) {
  const cartView = document.getElementById('cart-view');
  const orderView = document.getElementById('order-view');

  if (!cartView || !orderView) {
    return;
  }

  if (viewName === 'order') {
    renderCafeOrder();

    cartView.classList.remove('active');
    orderView.classList.add('active');

  } else {
    renderCafe
    Cart();

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
    renderProducts('커피');
  }

  // 장바구니 표시 갱신
  updateCartBar();

  // 장바구니 페이지인지 확인
  const cartView = document.getElementById('cart-view');

  if (!cartView) {
    return;
  }

  renderCafeCart();

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

      showCafeView('order');
    });
  }

  // 이전 버튼
  const btnBack = document.getElementById('btn-back');

  if (btnBack) {
    btnBack.addEventListener('click', () => {
      showCafeView('cart');
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
