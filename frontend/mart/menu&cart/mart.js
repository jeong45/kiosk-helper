
let currentItem = {
  name: '',
  price: 0,
  quantity: 1
};


// =====================================
// 1. 키오스크 세션 관리
// =====================================

const sessionKey = 'martSessionStarted';

if (!sessionStorage.getItem(sessionKey)) {
  localStorage.removeItem('martCartItems');
  sessionStorage.setItem(sessionKey, 'true');
}


// =====================================
// 2. 장바구니 데이터 관리
// =====================================

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem('martCartItems'));

    return Array.isArray(cart) ? cart : [];

  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('martCartItems', JSON.stringify(cart));
}


// 가격 표시

function formatPrice(price) {
  return Number(price).toLocaleString('ko-KR') + '원';
}


// 총 상품 개수

function getTotalCount(cart) {
  return cart.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );
}


// 총 금액

function getTotalPrice(cart) {
  return cart.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );
}


// =====================================
// 3. 상품 선택 모달
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
// 4. 상품 장바구니에 담기
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
// 5. 상품 선택 화면 장바구니 표시
// =====================================

function updateCartBar() {
  const cart = getCart();

  const totalCount = getTotalCount(cart);
  const totalPrice = getTotalPrice(cart);

  const bottomBar = document.getElementById('bottomCartBar');
  const topBadge = document.getElementById('topCartBadge');

  // 상단 장바구니 개수

  if (topBadge) {
    topBadge.innerText = `장바구니 ${totalCount}`;
  }

  // 하단 장바구니 바

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

  // 장바구니 화면 상단 개수

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
// 6. 장바구니 화면 상품 목록 표시
// =====================================

function renderMartCart() {
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


  // 장바구니가 비어 있을 때

  if (cart.length === 0) {
    cartList.innerHTML = `
      <div class="empty-cart">
        <p>장바구니가 비어있습니다.</p>
        <p>상품을 담아주세요.</p>
      </div>
    `;

    return;
  }


  // 상품 목록 생성

  cartList.innerHTML = cart.map((item, index) => `
    <div class="item-card">

      <div class="item-info">

        <div class="item-icon">
          🛒
        </div>

        <div class="item-details">

          <span class="item-name">
            ${item.name}
          </span>

          <span class="item-price">
            ${formatPrice(item.price)}
          </span>

        </div>

      </div>

      <div class="quantity-control">

        <button
          type="button"
          class="btn-qty"
          onclick="changeMartCartQuantity(${index}, -1)"
        >-</button>

        <span class="qty-num">
          ${item.quantity}
        </span>

        <button
          type="button"
          class="btn-qty"
          onclick="changeMartCartQuantity(${index}, 1)"
        >+</button>

      </div>

    </div>
  `).join('');
}


// =====================================
// 7. 장바구니 상품 수량 변경
// =====================================

function changeMartCartQuantity(index, change) {
  const cart = getCart();

  if (!cart[index]) {
    return;
  }

  cart[index].quantity =
    Number(cart[index].quantity) + change;


  // 수량이 0이 되면 상품 삭제

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);

  renderMartCart();
  updateCartBar();
}


// =====================================
// 8. 주문 확인 화면 상품 목록 표시
// =====================================

function renderMartOrder() {
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


  // 주문 상품이 없는 경우

  if (cart.length === 0) {
    orderList.innerHTML = `
      <div class="empty-cart">
        <p>주문할 상품이 없습니다.</p>
      </div>
    `;

    return;
  }


  // 주문 상품 목록 생성

  orderList.innerHTML = cart.map(item => `
    <div class="item-card">

      <div class="item-info">

        <div class="item-icon">
          🛒
        </div>

        <div class="item-details">

          <span class="item-name">
            ${item.name}
          </span>

          <span class="item-price">
            ${formatPrice(item.price)}
          </span>

        </div>

      </div>

      <div class="quantity-badge">
        ${item.quantity}개
      </div>

    </div>
  `).join('');
}


// =====================================
// 9. 장바구니 / 주문 확인 화면 전환
// =====================================

function showMartView(viewName) {
  const cartView = document.getElementById('cart-view');
  const orderView = document.getElementById('order-view');

  if (!cartView || !orderView) {
    return;
  }

  if (viewName === 'order') {
    renderMartOrder();

    cartView.classList.remove('active');
    orderView.classList.add('active');

  } else {
    renderMartCart();

    orderView.classList.remove('active');
    cartView.classList.add('active');
  }
}


// =====================================
// 10. 페이지 로딩 후 실행
// =====================================

document.addEventListener('DOMContentLoaded', () => {

  // 장바구니 표시 갱신

  updateCartBar();


  // 장바구니 페이지인지 확인

  const cartView = document.getElementById('cart-view');

  if (!cartView) {
    return;
  }


  // 장바구니 화면 처음 표시

  renderMartCart();


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

      showMartView('order');
    });
  }


  // 이전 버튼

  const btnBack = document.getElementById('btn-back');

  if (btnBack) {
    btnBack.addEventListener('click', () => {
      showMartView('cart');
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
