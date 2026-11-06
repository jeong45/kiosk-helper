
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


// =====================================
// 장바구니 데이터 관리
// =====================================

// 음식점 미션모드인지 확인
function isRestaurantMissionMode() {
  return sessionStorage.getItem('restaurantMissionMode') === 'true';
}

// 현재 모드에 맞는 장바구니 저장 키
function getRestaurantCartKey() {
  return isRestaurantMissionMode()
    ? 'restaurantMissionCartItems'
    : 'cartItems';
}

// 장바구니 가져오기
function getCart() {
  try {
    return JSON.parse(
      localStorage.getItem(getRestaurantCartKey())
    ) || [];
  } catch (error) {
    console.error('장바구니 불러오기 실패:', error);
    return [];
  }
}

// 장바구니 저장하기
function saveCart(cart) {
  localStorage.setItem(
    getRestaurantCartKey(),
    JSON.stringify(cart)
  );
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

  // 음식점 미션모드
  if (isRestaurantMissionMode()) {
    window.location.href = '../../cart.html';
    return;
  }

  // 자유 연습 및 튜토리얼
  window.location.href = 'cart.html';
}



// 메뉴 화면으로 돌아가기
function goToMenu() {
  // 장바구니 데이터를 유지하도록 설정
  sessionStorage.setItem('preserveCartOnMenu', 'true');

  // 음식점 미션모드
  if (isRestaurantMissionMode()) {
    const difficulty =
      sessionStorage.getItem('restaurantMissionDifficulty');

    if (difficulty === 'easy') {
      window.location.href = 'mission/easy/easy.html';
      return;
    }

    if (difficulty === 'hard') {
      window.location.href = 'mission/hard/hard.html';
      return;
    }
  }

  // 자유 연습 및 튜토리얼
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


// =====================================
// 결제 완료
// =====================================

async function completePayment() {
  const spayOpt = document.getElementById('spayOption');
  const kpayOpt = document.getElementById('kpayOption');

  let payMethodText = '카드 결제';

  if (spayOpt && spayOpt.classList.contains('selected')) {
    payMethodText = '삼성페이';
  } else if (kpayOpt && kpayOpt.classList.contains('selected')) {
    payMethodText = '카카오페이';
  }

  // 선택한 결제 수단 저장
  localStorage.setItem('selectedPayMethod', payMethodText);

  // 자유 연습 및 튜토리얼은 기존 방식 유지
  if (!isRestaurantMissionMode()) {
    window.location.href = 'complete.html';
    return;
  }

  // 음식점 미션 난이도 확인
  const difficulty =
    sessionStorage.getItem('restaurantMissionDifficulty');

  const missionIdKey = difficulty === 'hard'
    ? 'restaurantHardMissionId'
    : 'restaurantEasyMissionId';

  const missionId = sessionStorage.getItem(missionIdKey);

  if (!missionId) {
    alert('미션 정보를 찾을 수 없습니다. 미션을 다시 시작해 주세요.');
    return;
  }

  // 현재 장바구니를 백엔드 제출 형식으로 변환
  const items = getCart().map(item => ({
    name: item.name,
    quantity: item.quantity,
    options: {}
  }));

  const requestData = {
    mission_id: missionId,
    items: items,
    payment_method: payMethodText,
    membership_method: null
  };

  try {
    const response = await fetch(
      'http://127.0.0.1:8000/api/missions/check',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      }
    );

    if (!response.ok) {
      throw new Error(`미션 확인 실패: ${response.status}`);
    }

    const result = await response.json();

    // 성공·실패 결과 저장
    sessionStorage.setItem(
      'restaurantMissionResult',
      JSON.stringify(result)
    );

    console.log('음식점 미션 판정 결과:', result);

    // 결제 완료 화면으로 이동
    window.location.href = 'complete.html';

  } catch (error) {
    console.error('음식점 미션 제출 오류:', error);

    alert(
      '미션 결과를 확인하지 못했습니다. 서버 연결을 확인하고 다시 시도해 주세요.'
    );
  }
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

/* =====================================
   음식점 미션 성공·실패 결과 표시
===================================== */

// 조건별 성공 / 실패 배지
function updateRestaurantCheckResult(elementId, passed) {
  const element = document.getElementById(elementId);

  if (!element) return;

  element.textContent = passed === true
    ? '✓ 성공'
    : '✕ 놓침';

  element.className = passed === true
    ? 'success-badge'
    : 'fail-badge';
}


// 실패 화면 실제 주문 내역
function renderRestaurantFailReceipt() {
  const cart = getCart();

  const container =
    document.getElementById('fail-receipt-items');

  if (!container) return;

  container.replaceChildren();

  let totalPrice = 0;

  cart.forEach(item => {
    const quantity = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    const itemTotal = price * quantity;

    totalPrice += itemTotal;

    const row = document.createElement('div');
    row.className = 'summary-item';

    const name = document.createElement('span');
    name.textContent = `${item.name} × ${quantity}`;

    const amount = document.createElement('span');
    amount.textContent = itemTotal.toLocaleString() + '원';

    row.append(name, amount);
    container.appendChild(row);
  });

  const totalElement =
    document.getElementById('fail-receipt-total');

  if (totalElement) {
    totalElement.textContent =
      totalPrice.toLocaleString() + '원';
  }

  const paymentElement =
    document.getElementById('fail-receipt-payment');

  if (paymentElement) {
    paymentElement.textContent =
      localStorage.getItem('selectedPayMethod') ||
      '카드 결제';
  }
}


// 음식점 미션 결과 표시
function renderRestaurantMissionResult() {

  // 자유 연습과 튜토리얼은 기존 화면 유지
  if (!isRestaurantMissionMode()) return;

  // 결제 완료 페이지에서만 실행
  const completePage =
    document.getElementById('completePage');

  const failModal =
    document.getElementById('mission-fail-modal');

  if (!completePage || !failModal) return;

  // 저장된 미션 결과 불러오기
  const savedResult =
    sessionStorage.getItem('restaurantMissionResult');

  if (!savedResult) {
    console.warn('저장된 음식점 미션 결과가 없습니다.');
    return;
  }

  let result;

  try {
    result = JSON.parse(savedResult);
  } catch (error) {
    console.error('미션 결과 읽기 실패:', error);
    return;
  }

  const difficulty =
    sessionStorage.getItem('restaurantMissionDifficulty');

  const isHardMode = difficulty === 'hard';

  const difficultyText = isHardMode ? 'HARD' : 'EASY';

  // =====================================
  // 1. 미션 성공
  // =====================================

  if (result.success === true) {

    // 실패 화면 숨기기
    failModal.style.display = 'none';

    // 성공 화면 표시
    completePage.style.display = 'flex';

    const icon = document.getElementById('completeIcon');
    const badge = document.getElementById('completeBadge');
    const title = document.getElementById('completeTitle');
    const summary =
      document.getElementById('completeSummaryText');

    if (icon) {
      icon.textContent = '✓';
    }

    if (badge) {
      badge.textContent = `${difficultyText} 미션 성공`;
    }

    if (title) {
      title.textContent = '미션을 완료했어요!';
    }

    if (summary) {
      summary.textContent =
        '오늘의 미션을 정확하게 완료했어요. 정말 잘하셨어요!';
    }

    return;
  }

  // =====================================
  // 2. 미션 실패
  // =====================================

  if (result.success !== false) {
    console.error('올바르지 않은 미션 결과:', result);
    return;
  }

  // 기존 완료 화면 숨기기
  completePage.style.display = 'none';

  // 난이도 표시
  const resultTitle =
    document.getElementById('missionResultTitle');

  if (resultTitle) {
    resultTitle.textContent =
      `${difficultyText} 미션 결과`;
  }

  const difficultyBadge =
    document.getElementById('failDifficultyBadge');

  if (difficultyBadge) {
    difficultyBadge.textContent = difficultyText;

    difficultyBadge.classList.toggle(
      'hard-badge',
      isHardMode
    );
  }

  failModal.classList.toggle('hard-mode', isHardMode);

  // =====================================
  // 3. 미션 안내 문구
  // =====================================

  const instructionKey = isHardMode
    ? 'restaurantHardMissionInstruction'
    : 'restaurantEasyMissionInstruction';

  const instruction =
    sessionStorage.getItem(instructionKey);

  const instructionElement =
    document.getElementById('fail-mission-instruction');

  if (instructionElement) {
    instructionElement.textContent =
      instruction || '미션 안내를 불러오지 못했습니다.';
  }

  // =====================================
  // 4. 조건별 결과
  // =====================================

  const checks = result.checks || {};

  updateRestaurantCheckResult(
    'product-result',
    checks.items
  );

  updateRestaurantCheckResult(
    'payment-result',
    checks.payment_method
  );

  // =====================================
  // 5. HARD 전용 결과
  // =====================================

  const membershipResultRow =
    document.getElementById('membershipResultRow');

  const failMembershipRow =
    document.getElementById('failMembershipRow');

  const failDescription =
    document.getElementById('failDescription');

 // 음식점 미션은 EASY와 HARD 모두 멤버십 조건 없음
if (membershipResultRow) {
  membershipResultRow.style.display = 'none';
}

if (failMembershipRow) {
  failMembershipRow.style.display = 'none';
}

  if (isHardMode) {

    updateRestaurantCheckResult(
      'membership-result',
      checks.membership_method
    );

    if (failDescription) {
      failDescription.innerHTML =
        '주문한 두 메뉴와 수량, 결제 방식을<br>' +
        '다시 확인해 보세요.';
    }

    const membershipText =
      document.getElementById('fail-receipt-membership');

    if (membershipText) {
      membershipText.textContent =
        '선택 정보 없음';
    }

  } else {

    if (failDescription) {
      failDescription.innerHTML =
        '주문 상품, 수량, 결제 조건을<br>' +
        '다시 확인해 보세요.';
    }
  }

  // =====================================
  // 6. 실제 주문 내역
  // =====================================

  renderRestaurantFailReceipt();

  // =====================================
  // 7. 실패 화면 표시
  // =====================================

  failModal.style.display = 'flex';
}



// =====================================
// 5. 처음부터 다시 연습 / 메인 이동
// =====================================


function restartPractice() {

  // 음식점 미션모드일 경우
  if (isRestaurantMissionMode()) {

    const difficulty =
      sessionStorage.getItem('restaurantMissionDifficulty');

    // 이전 미션 정보 삭제
    sessionStorage.removeItem('restaurantEasyMissionId');
    sessionStorage.removeItem('restaurantEasyMissionInstruction');
    sessionStorage.removeItem('restaurantHardMissionId');
    sessionStorage.removeItem('restaurantHardMissionInstruction');
    sessionStorage.removeItem('restaurantMissionResult');
    sessionStorage.removeItem('preserveCartOnMenu');

    // 미션 장바구니 초기화
    localStorage.removeItem('restaurantMissionCartItems');

    // EASY 미션 다시 시작
    if (difficulty === 'easy') {
      window.location.href = 'mission/easy/easy.html';
      return;
    }

    // HARD 미션 다시 시작
    if (difficulty === 'hard') {
      window.location.href = 'mission/hard/hard.html';
      return;
    }
  }

  // 자유 연습 및 튜토리얼
  localStorage.removeItem('cartItems');

  sessionStorage.removeItem('preserveCartOnMenu');
  sessionStorage.removeItem('tutorialMode');
  sessionStorage.removeItem('tutorialStep');

  window.location.href = 'menu.html';
}



function goToMain() {

  // 일반 장바구니 삭제
  localStorage.removeItem('cartItems');

  // 음식점 미션 장바구니 삭제
  localStorage.removeItem('restaurantMissionCartItems');

  // 튜토리얼 정보 초기화
  sessionStorage.removeItem('preserveCartOnMenu');
  sessionStorage.removeItem('tutorialMode');
  sessionStorage.removeItem('tutorialStep');

  // 음식점 미션모드 초기화
  sessionStorage.removeItem('restaurantMissionMode');
  sessionStorage.removeItem('restaurantMissionDifficulty');

  // EASY 미션 정보 삭제
  sessionStorage.removeItem('restaurantEasyMissionId');
  sessionStorage.removeItem('restaurantEasyMissionInstruction');

  // HARD 미션 정보 삭제
  sessionStorage.removeItem('restaurantHardMissionId');
  sessionStorage.removeItem('restaurantHardMissionInstruction');

  // 미션 결과 삭제
  sessionStorage.removeItem('restaurantMissionResult');

  // 메인 화면으로 이동
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
  renderRestaurantMissionResult();
});
