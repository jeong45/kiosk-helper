
// =====================================
// 현재 모달 선택 상태
// =====================================

let currentItem = { name: '', price: 0, quantity: 1 };


// =====================================
// 레스토랑 메뉴 데이터
// =====================================

const RESTAURANT_PRODUCTS = [
  // 세트메뉴
  { name: '1인 세트', price: 12000, category: '세트메뉴', color: 'orange' },
  { name: '2인 세트', price: 30000, category: '세트메뉴', color: 'red' },
  { name: '4인 세트', price: 58000, category: '세트메뉴', color: 'dark-red' },
  { name: '냉모밀정식', price: 17000, category: '세트메뉴', color: 'blue' },
  { name: '비빔우동정식', price: 17000, category: '세트메뉴', color: 'pink' },
  { name: '돈가스정식', price: 16000, category: '세트메뉴', color: 'yellow' },

  // 단일메뉴
  { name: '비빔밥', price: 10000, category: '단일메뉴', color: 'orange' },
  { name: '김치찌개', price: 9000, category: '단일메뉴', color: 'red' },
  { name: '돈가스', price: 11000, category: '단일메뉴', color: 'dark-red' },
  { name: '냉면', price: 10000, category: '단일메뉴', color: 'blue' },
  { name: '제육덮밥', price: 10500, category: '단일메뉴', color: 'pink' },
  { name: '우동', price: 8500, category: '단일메뉴', color: 'yellow' },

  // 사이드메뉴
  { name: '새우튀김', price: 6000, category: '사이드메뉴', color: 'orange' },
  { name: '감자고로케', price: 5000, category: '사이드메뉴', color: 'red' },
  { name: '미니 돈가스', price: 7000, category: '사이드메뉴', color: 'dark-red' },
  { name: '치킨 가라아게', price: 7500, category: '사이드메뉴', color: 'blue' },
  { name: '계란찜', price: 4000, category: '사이드메뉴', color: 'pink' },
  { name: '공깃밥', price: 1000, category: '사이드메뉴', color: 'yellow' },

  // 음료
  { name: '콜라', price: 2500, category: '음료', color: 'orange' },
  { name: '사이다', price: 2500, category: '음료', color: 'red' },
  { name: '제로콜라', price: 2500, category: '음료', color: 'dark-red' },
  { name: '오렌지주스', price: 3000, category: '음료', color: 'blue' },
  { name: '식혜', price: 3000, category: '음료', color: 'pink' },
  { name: '생수', price: 1500, category: '음료', color: 'yellow' },

  // 주류
  { name: '생맥주', price: 5000, category: '주류', color: 'orange' },
  { name: '병맥주', price: 5000, category: '주류', color: 'red' },
  { name: '소주', price: 5000, category: '주류', color: 'dark-red' },
  { name: '막걸리', price: 6000, category: '주류', color: 'blue' },
  { name: '하이볼', price: 7000, category: '주류', color: 'pink' },
  { name: '무알콜 맥주', price: 4500, category: '주류', color: 'yellow' }
];


// =====================================
// 장바구니 데이터 관리
// =====================================

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('cartItems', JSON.stringify(cart));
}


// =====================================
// 튜토리얼 관련 함수
// =====================================

function isTutorialMode() {
  return sessionStorage.getItem('tutorialMode') === 'true';
}

function clearTutorialState() {
  sessionStorage.removeItem('tutorialMode');
  sessionStorage.removeItem('tutorialStep');
}


// =====================================
// 1. menu.html 관련 함수
// =====================================

// 메뉴 화면에 메뉴 카드 생성
function renderMenu(category) {
  const menuList = document.getElementById('menuList');
  const sectionTitle = document.getElementById('sectionTitle');

  if (!menuList) return;

  const filteredProducts = RESTAURANT_PRODUCTS.filter(
    item => item.category === category
  );

  if (sectionTitle) {
    sectionTitle.innerText = category + ' 메뉴';
  }

  let html = '';

  filteredProducts.forEach((item, index) => {
    const tutorialId =
      category === '세트메뉴' && index === 0
        ? 'id="tutorialFirstSet"'
        : '';

    html += `
      <div class="menu-card" ${tutorialId}
           onclick="openModal('${item.name}', ${item.price})">

        <div class="menu-img-box ${item.color}">
          🍴
        </div>

        <div class="menu-name">
          ${item.name}
        </div>

        <div class="menu-price">
          ${item.price.toLocaleString()}원
        </div>

      </div>
    `;
  });

  menuList.innerHTML = html;
}


// 카테고리 버튼 연결
function setupCategoryButtons() {
  const categoryButtons = document.querySelectorAll('.category-btn');

  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;

      if (!category) return;

      categoryButtons.forEach(btn => {
        btn.classList.remove('active');
      });

      button.classList.add('active');

      renderMenu(category);
    });
  });
}


// 메뉴 선택 모달 열기
function openModal(name, price) {
  currentItem = { name, price, quantity: 1 };

  document.getElementById('modalItemTitle').innerText = name;

  document.getElementById('modalItemPrice').innerText =
    price.toLocaleString() + '원';

  document.getElementById('modalQuantity').innerText = 1;

  document.getElementById('modalTotalPrice').innerText =
    price.toLocaleString() + '원';

  document.getElementById('optionModal').style.display = 'flex';
}


// 모달 닫기
function closeModal() {
  const modal = document.getElementById('optionModal');

  if (modal) {
    modal.style.display = 'none';
  }
}


// 수량 변경
function changeQuantity(change) {
  if (currentItem.quantity + change >= 1) {
    currentItem.quantity += change;

    document.getElementById('modalQuantity').innerText =
      currentItem.quantity;

    document.getElementById('modalTotalPrice').innerText =
      (currentItem.price * currentItem.quantity).toLocaleString() + '원';
  }
}


// 장바구니 담기
function addToCart() {
  if (!currentItem.name || currentItem.price <= 0) return;

  let cart = getCart();

  const index = cart.findIndex(
    item => item.name === currentItem.name
  );

  if (index > -1) {
    cart[index].quantity += currentItem.quantity;
  } else {
    cart.push({ ...currentItem });
  }

  saveCart(cart);

  closeModal();

  updateCartBar();
}


// 하단 장바구니 바 및 상단 배지 업데이트
function updateCartBar() {
  const cart = getCart();

  const totalCount = cart.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0), 0
  );

  const totalPrice = cart.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) *
      (Number(item.quantity) || 0), 0
  );

  const bottomBar = document.getElementById('bottomCartBar');
  const topBadge = document.getElementById('topCartBadge');

  if (topBadge) {
    topBadge.innerText = `장바구니 ${totalCount}`;
  }

  if (bottomBar) {
    const hasItems = totalCount > 0;

    bottomBar.classList.toggle('active', hasItems);

    bottomBar.innerText =
      `장바구니 보기 · ${totalCount}개 · ${totalPrice.toLocaleString()}원`;

    bottomBar.setAttribute(
      'aria-disabled',
      String(!hasItems)
    );

    bottomBar.style.pointerEvents = hasItems ? 'auto' : 'none';
  }
}


// 장바구니 페이지 이동
function goToCart() {
  const cart = getCart();

  if (cart.length === 0) {
    alert('장바구니가 비어있습니다.');
    return;
  }

  window.location.href = 'cart.html';
}


// 메뉴 화면으로 돌아가기
function goToMenu() {
  sessionStorage.setItem('preserveCartOnMenu', 'true');
  window.location.href = 'menu.html';
}


// =====================================
// 2. cart.html 관련 함수
// =====================================

function renderCartPage() {
  const cart = getCart();

  const cartList = document.getElementById('cartList');
  const confirmList = document.getElementById('confirmList');

  if (!cartList && !confirmList) return;

  const totalCount = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity), 0
  );

  if (document.getElementById('cartTotalCount')) {
    document.getElementById('cartTotalCount').innerText = totalCount;
  }

  if (document.getElementById('cartTotalPrice')) {
    document.getElementById('cartTotalPrice').innerText =
      totalPrice.toLocaleString() + '원';
  }

  if (document.getElementById('confirmTotalCount')) {
    document.getElementById('confirmTotalCount').innerText = totalCount;
  }

  if (document.getElementById('confirmTotalPrice')) {
    document.getElementById('confirmTotalPrice').innerText =
      totalPrice.toLocaleString() + '원';
  }

  if (document.getElementById('cartBadgeTop')) {
    document.getElementById('cartBadgeTop').innerText =
      `장바구니 ${totalCount}`;
  }

  let html = '';

  cart.forEach((item, i) => {
    html += `
      <div class="cart-item-card">
        <div class="cart-item-info">
          <div class="item-thumb">🍴</div>
          <div>
            <div class="item-name">${item.name}</div>
            <div class="item-price">
              ${(item.price * item.quantity).toLocaleString()}원
            </div>
          </div>
        </div>

        <div class="quantity-btn-group">
          <button onclick="updateCartQuantity(${i}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateCartQuantity(${i}, 1)">+</button>
        </div>
      </div>
    `;
  });

  if (cartList) {
    cartList.innerHTML = html;
  }

  if (confirmList) {
    let confirmHtml = '';

    cart.forEach(item => {
      confirmHtml += `
        <div class="cart-item-card">
          <div class="cart-item-info">
            <div class="item-thumb">🍴</div>
            <div>
              <div class="item-name">${item.name}</div>
              <div class="item-price">
                ${(item.price * item.quantity).toLocaleString()}원
              </div>
            </div>
          </div>
          <span class="confirm-quantity-badge">${item.quantity}개</span>
        </div>
      `;
    });

    confirmList.innerHTML = confirmHtml;
  }
}


function updateCartQuantity(index, change) {
  let cart = getCart();

  if (!cart[index]) return;

  if (cart[index].quantity + change <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].quantity += change;
  }

  saveCart(cart);

  renderCartPage();
}


// 주문 확인
function showOrderConfirm() {
  document.getElementById('cartStep').style.display = 'none';
  document.getElementById('confirmStep').style.display = 'flex';
}

function showCartStep() {
  document.getElementById('confirmStep').style.display = 'none';
  document.getElementById('cartStep').style.display = 'flex';
}

function goToPayment() {
  window.location.href = 'payment.html';
}


// =====================================
// 3. payment.html 관련 함수
// =====================================

function renderPaymentPage() {
  const cart = getCart();

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity), 0
  );

  if (document.getElementById('payTotalPrice')) {
    document.getElementById('payTotalPrice').innerText =
      totalPrice.toLocaleString() + '원';
  }

  if (document.getElementById('insertTotalPrice')) {
    document.getElementById('insertTotalPrice').innerText =
      totalPrice.toLocaleString() + '원';
  }
}


// 결제 수단 선택
function selectPayMethod(method) {
  const cardOpt =
    document.getElementById('tutorialCardOption') ||
    document.getElementById('cardOption');

  const spayOpt = document.getElementById('spayOption');
  const kpayOpt = document.getElementById('kpayOption');

  if (cardOpt) cardOpt.classList.remove('selected');
  if (spayOpt) spayOpt.classList.remove('selected');
  if (kpayOpt) kpayOpt.classList.remove('selected');

  if (method === 'card') {
    if (cardOpt) cardOpt.classList.add('selected');
  } else if (method === 'spay') {
    if (spayOpt) spayOpt.classList.add('selected');
  } else if (method === 'kpay') {
    if (kpayOpt) kpayOpt.classList.add('selected');
  }
}


// 결제 진행
function proceedSelectedPayment() {
  const methodStep = document.getElementById('methodStep');
  const insertStep = document.getElementById('insertStep');
  const spayStep = document.getElementById('spayStep');
  const kpayStep = document.getElementById('kpayStep');

  const spayOpt = document.getElementById('spayOption');
  const kpayOpt = document.getElementById('kpayOption');

  if (methodStep) methodStep.style.display = 'none';
  if (insertStep) insertStep.style.display = 'none';
  if (spayStep) spayStep.style.display = 'none';
  if (kpayStep) kpayStep.style.display = 'none';

  if (spayOpt && spayOpt.classList.contains('selected')) {
    if (spayStep) spayStep.style.display = 'flex';
  } else if (kpayOpt && kpayOpt.classList.contains('selected')) {
    if (kpayStep) kpayStep.style.display = 'flex';
  } else {
    if (insertStep) insertStep.style.display = 'flex';
  }
}


function showCardInsertStep() {
  document.getElementById('methodStep').style.display = 'none';
  document.getElementById('insertStep').style.display = 'flex';
}

function showMethodStep() {
  document.getElementById('insertStep').style.display = 'none';
  document.getElementById('spayStep').style.display = 'none';
  document.getElementById('kpayStep').style.display = 'none';
  document.getElementById('methodStep').style.display = 'flex';
}


// 결제 완료
function completePayment() {
  const spayOpt = document.getElementById('spayOption');
  const kpayOpt = document.getElementById('kpayOption');

  let payMethodText = '카드 결제';

  if (spayOpt && spayOpt.classList.contains('selected')) {
    payMethodText = '삼성페이';
  } else if (kpayOpt && kpayOpt.classList.contains('selected')) {
    payMethodText = '카카오페이';
  }

  localStorage.setItem('selectedPayMethod', payMethodText);

  window.location.href = 'complete.html';
}


// =====================================
// 4. complete.html 관련 함수
// =====================================

function renderCompletePage() {
  const cart = getCart();

  const totalCount = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity), 0
  );

  const receiptItems = document.getElementById('receiptItems');

  if (receiptItems) {
    let html = '';

    cart.forEach(item => {
      html += `
        <div class="receipt-row"
             style="border:none; padding:0; margin-bottom:6px;">
          <span>${item.name} · ${item.quantity}개</span>
          <span>
            ${(item.price * item.quantity).toLocaleString()}원
          </span>
        </div>
      `;
    });

    receiptItems.innerHTML = html;
  }

  if (document.getElementById('receiptTotal')) {
    document.getElementById('receiptTotal').innerText =
      totalPrice.toLocaleString() + '원';
  }

  const receiptPayMethod = document.getElementById('receiptPayMethod');

  if (receiptPayMethod) {
    const savedMethod =
      localStorage.getItem('selectedPayMethod') || '카드 결제';

    receiptPayMethod.innerText = savedMethod;
  }

  if (document.getElementById('completeSummaryText')) {
    document.getElementById('completeSummaryText').innerHTML =
      `${totalCount}개 상품의 결제 연습을 마쳤어요.<br>
        이제 실제 키오스크도 자신 있게 이용해 보세요.`;
  }
}


// =====================================
// 5. 처음부터 다시 연습 / 메인 이동
// =====================================

function restartPractice() {
  localStorage.removeItem('cartItems');

  sessionStorage.removeItem('preserveCartOnMenu');
  sessionStorage.removeItem('tutorialMode');
  sessionStorage.removeItem('tutorialStep');

  window.location.href = 'menu.html';
}


function goToMain() {
  localStorage.removeItem('cartItems');

  sessionStorage.removeItem('preserveCartOnMenu');
  sessionStorage.removeItem('tutorialMode');
  sessionStorage.removeItem('tutorialStep');

  window.location.href = '../main/main.html';
}


// =====================================
// 6. 페이지 로드 시 초기화
// =====================================

document.addEventListener('DOMContentLoaded', () => {

  // 메뉴 화면 초기화
  if (window.location.pathname.endsWith('menu.html')) {

    const shouldPreserveCart =
      sessionStorage.getItem('preserveCartOnMenu') === 'true';

    if (shouldPreserveCart) {
      sessionStorage.removeItem('preserveCartOnMenu');
    } else {
      localStorage.removeItem('cartItems');
    }
  }

  // menu.html에서만 카테고리 및 메뉴 생성
  if (document.getElementById('menuList')) {
    setupCategoryButtons();
    renderMenu('세트메뉴');
  }

  updateCartBar();
  renderCartPage();
  renderPaymentPage();
  renderCompletePage();
});
