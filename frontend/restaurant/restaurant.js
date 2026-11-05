// 현재 모달 선택 상태
let currentItem = { name: '', price: 0, quantity: 1 };

// 장바구니 데이터를 localStorage로 관리
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

// 튜토리얼 모드인지 확인
function isTutorialMode() {
  return sessionStorage.getItem('tutorialMode') === 'true';
}

// 튜토리얼 상태 초기화
function clearTutorialState() {
  sessionStorage.removeItem('tutorialMode');
  sessionStorage.removeItem('tutorialStep');
}

// 1. menu.html 관련 함수

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

function closeModal() {
  const modal = document.getElementById('optionModal');
  if (modal) modal.style.display = 'none';
}

function changeQuantity(change) {
  if (currentItem.quantity + change >= 1) {
    currentItem.quantity += change;

    document.getElementById('modalQuantity').innerText =
      currentItem.quantity;

    document.getElementById('modalTotalPrice').innerText =
      (currentItem.price * currentItem.quantity).toLocaleString() + '원';
  }
}

// 장바구니 담기 버튼을 눌렀을 때만 상품 추가
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

  // 실제 상품 추가 후에만 버튼 활성화
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

function goToCart() {
  const cart = getCart();

  if (cart.length === 0) {
    alert('장바구니가 비어있습니다.');
    return;
  }

  window.location.href = 'cart.html';
}

function goToMenu() {
  // 장바구니 화면에서 돌아오는 경우 기존 데이터 유지
  sessionStorage.setItem('preserveCartOnMenu', 'true');
  window.location.href = 'menu.html';
}

// 2. cart.html 관련 함수

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

// 3. payment.html 관련 함수

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

// 결제 수단을 누를 때 선택 상태(테두리/체크)만 변경
function selectPayMethod(method) {
  const cardOpt = document.getElementById('tutorialCardOption') || document.getElementById('cardOption');
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

// '결제 진행하기' 버튼을 눌렀을 때 선택된 수단에 맞춰 해당 안내 창으로 이동
function proceedSelectedPayment() {
  const methodStep = document.getElementById('methodStep');
  const insertStep = document.getElementById('insertStep');
  const spayStep = document.getElementById('spayStep');
  const kpayStep = document.getElementById('kpayStep');

  // 어떤 결제 수단이 선택되었는지 확인
  const cardOpt = document.getElementById('tutorialCardOption') || document.getElementById('cardOption');
  const spayOpt = document.getElementById('spayOption');
  const kpayOpt = document.getElementById('kpayOption');

  // 먼저 모든 결제 단계 숨기기
  if (methodStep) methodStep.style.display = 'none';
  if (insertStep) insertStep.style.display = 'none';
  if (spayStep) spayStep.style.display = 'none';
  if (kpayStep) kpayStep.style.display = 'none';

  // 선택된 수단에 따라 각각의 안내 화면 띄우기
  if (spayOpt && spayOpt.classList.contains('selected')) {
    if (spayStep) spayStep.style.display = 'flex';
  } else if (kpayOpt && kpayOpt.classList.contains('selected')) {
    if (kpayStep) kpayStep.style.display = 'flex';
  } else {
    // 기본값은 카드 결제 화면
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

function completePayment() {
  window.location.href = 'complete.html';
}

// 4. complete.html 관련 함수

// 결제 완료 시 선택한 결제 방식을 저장하고 완료 페이지로 이동
function completePayment() {
  // 어떤 결제 수단이 선택되어 있는지 확인 후 저장
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

// 4. complete.html 관련 함수

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

  // ★ 저장된 결제 방식을 읽어와서 영수증에 텍스트 반영
  const receiptPayMethod = document.getElementById('receiptPayMethod');
  if (receiptPayMethod) {
    const savedMethod = localStorage.getItem('selectedPayMethod') || '카드 결제';
    receiptPayMethod.innerText = savedMethod;
  }

  if (document.getElementById('completeSummaryText')) {
    document.getElementById('completeSummaryText').innerHTML =
      `${totalCount}개 상품의 결제 연습을 마쳤어요.<br>
        이제 실제 키오스크도 자신 있게 이용해 보세요.`;
  }
}

// 처음부터 다시 연습
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

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {

  // 메뉴 화면에 새로 접속하면 이전 장바구니 초기화
  if (window.location.pathname.endsWith('menu.html')) {

    const shouldPreserveCart =
      sessionStorage.getItem('preserveCartOnMenu') === 'true';

    if (shouldPreserveCart) {
      sessionStorage.removeItem('preserveCartOnMenu');
    } else {
      localStorage.removeItem('cartItems');
    }
  }

  updateCartBar();
  renderCartPage();
  renderPaymentPage();
  renderCompletePage();
});