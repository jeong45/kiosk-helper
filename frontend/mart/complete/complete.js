
// ========================================
// 키우미 마트 결제 완료 페이지
// EASY / HARD 미션 공통
// ========================================

const API_BASE_URL = 'http://127.0.0.1:8000';

// 미션 모드 확인
const isMissionMode =
  sessionStorage.getItem('martMissionMode') === 'true';

// 난이도 확인
const missionDifficulty =
  sessionStorage.getItem('martMissionDifficulty') === 'hard'
    ? 'hard'
    : 'easy';

const isHardMode = isMissionMode && missionDifficulty === 'hard';


// ========================================
// 1. 미션 저장 키
// ========================================

function getMissionIdKey() {
  return isHardMode
    ? 'martHardMissionId'
    : 'martEasyMissionId';
}

function getMissionInstructionKey() {
  return isHardMode
    ? 'martHardMissionInstruction'
    : 'martEasyMissionInstruction';
}


// ========================================
// 2. 장바구니 가져오기
// ========================================

function getCart() {
  try {
    const storageKey = isMissionMode
      ? 'martMissionCartItems'
      : 'martCartItems';

    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch (error) {
    console.error('장바구니 불러오기 실패:', error);
    return [];
  }
}


// ========================================
// 3. 결제 방식 가져오기
// ========================================

function getPaymentMethod() {
  return localStorage.getItem('selectedPayMethod') || '카드 결제';
}


// ========================================
// 4. 멤버십 적립 방식
// ========================================


function getMembershipMethod() {
  const method = sessionStorage.getItem('martMembershipMethod');

  if (method === 'barcode') {
    return '멤버십 바코드로 적립';
  }

  if (method === 'phone') {
    return '전화번호로 적립';
  }

  if (method === 'none') {
    return '적립 안함';
  }

  return null;
}



function getMembershipText() {
  const method = getMembershipMethod();

  if (method === '멤버십 바코드로 적립') {
    return '바코드 적립';
  }

  if (method === '전화번호로 적립') {
    return '전화번호 적립';
  }

  if (method === '적립 안함') {
    return '적립 안 함';
  }

  return '선택 정보 없음';
}



// ========================================
// 5. 총 결제금액 계산
// ========================================

function calculateTotal(cart) {
  return cart.reduce((sum, item) => {
    return sum +
      (Number(item.price) || 0) *
      (Number(item.quantity) || 0);
  }, 0);
}


// ========================================
// 6. 기존 결제 완료 화면
// ========================================

function renderCompletePage(cart) {
  const receiptItems = document.getElementById('receiptItems');

  const totalCount = cart.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );

  receiptItems.replaceChildren();

  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'receipt-row';

    const name = document.createElement('span');
    name.textContent = `${item.name} · ${item.quantity}개`;

    const price = document.createElement('span');
    price.textContent =
      `${((Number(item.price) || 0) *
        (Number(item.quantity) || 0)).toLocaleString()}원`;

    row.append(name, price);
    receiptItems.appendChild(row);
  });

  document.getElementById('receiptTotal').textContent =
    calculateTotal(cart).toLocaleString() + '원';

  document.getElementById('receiptPayMethod').textContent =
    getPaymentMethod();

  document.getElementById('completeSummaryText').innerHTML =
    `${totalCount}개 상품의 결제 연습을 마쳤어요.<br>` +
    '이제 실제 키오스크도 자신 있게 이용해 보세요.';

  // HARD 미션일 때 멤버십 적립 내역 표시
  if (isHardMode) {
    document.getElementById('successMembershipRow').style.display = 'flex';

    document.getElementById('receiptMembership').textContent =
      getMembershipText();
  }
}


// ========================================
// 7. 백엔드 미션 검사
// ========================================

async function checkMission(cart) {
  const missionId =
    sessionStorage.getItem(getMissionIdKey());

  if (!missionId) {
    throw new Error('미션 ID가 없습니다. 새 미션을 시작해 주세요.');
  }

  const items = cart.map(item => ({
    name: item.name,
    quantity: Number(item.quantity),
    options: item.options || {}
  }));

  const payload = {
    mission_id: missionId,
    items: items,
    payment_method: getPaymentMethod(),
    membership_method: isHardMode
      ? getMembershipMethod()
      : null
  };

  console.log('미션 검사 요청:', payload);

  const response = await fetch(
    `${API_BASE_URL}/api/missions/check`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    throw new Error(`미션 검사 요청 실패: ${response.status}`);
  }

  return await response.json();
}


// ========================================
// 8. 미션 성공 화면
// ========================================

function showMissionSuccess() {
  const difficultyText = isHardMode ? 'HARD' : 'EASY';

  document.querySelector('.complete-badge').textContent =
    `${difficultyText} 미션 성공`;

  document.querySelector('.complete-title').textContent =
    '미션을 완료했어요!';

  document.getElementById('completeSummaryText').innerHTML =
    isHardMode
      ? '주문 상품, 결제 방식, 멤버십 적립까지<br>' +
        '모든 조건을 정확하게 완료했어요!'
      : '주문 상품과 결제 방식을 모두 정확하게 선택했어요.<br>' +
        '정말 잘하셨어요!';
}


// ========================================
// 9. 실패 화면 주문 내역
// ========================================

function renderFailReceipt(cart) {
  const container =
    document.getElementById('fail-receipt-items');

  container.replaceChildren();

  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'summary-item';

    const name = document.createElement('span');
    name.textContent = `${item.name} × ${item.quantity}`;

    const price = document.createElement('span');
    price.textContent =
      `${((Number(item.price) || 0) *
        (Number(item.quantity) || 0)).toLocaleString()}원`;

    row.append(name, price);
    container.appendChild(row);
  });

  document.getElementById('fail-receipt-total').textContent =
    calculateTotal(cart).toLocaleString() + '원';

  document.getElementById('fail-receipt-payment').textContent =
    getPaymentMethod();

  // HARD 미션일 때 실제 멤버십 적립 방식 표시
  if (isHardMode) {
    document.getElementById('failMembershipRow').style.display = 'flex';

    document.getElementById('fail-receipt-membership').textContent =
      getMembershipText();
  }
}


// ========================================
// 10. 조건별 결과 표시
// ========================================

function updateCheckResult(elementId, passed) {
  const element = document.getElementById(elementId);

  element.textContent = passed ? '✓ 성공' : '✕ 놓침';
  element.className = passed ? 'success-badge' : 'fail-badge';
}


// ========================================
// 11. 미션 실패 화면
// ========================================

function showMissionFail(result, cart) {
  document.getElementById('completePage').style.display = 'none';

  const modal = document.getElementById('mission-fail-modal');

  const difficultyText = isHardMode ? 'HARD' : 'EASY';

  // 난이도 표시
  document.getElementById('missionResultTitle').textContent =
    `${difficultyText} 미션 결과`;

  const difficultyBadge =
    document.getElementById('failDifficultyBadge');

  difficultyBadge.textContent = difficultyText;

  if (isHardMode) {
    modal.classList.add('hard-mode');
    difficultyBadge.classList.add('hard-badge');

    document.getElementById('failDescription').innerHTML =
      '상품, 수량, 결제, 멤버십 적립 조건을<br>' +
      '다시 확인해 보세요.';

    document.getElementById('membershipResultRow').style.display = 'flex';

    updateCheckResult(
      'membership-result',
      result.checks.membership_method
    );
  }

  // 미션 안내 문구
  const instruction =
    sessionStorage.getItem(getMissionInstructionKey()) || '';

  document.getElementById('fail-mission-instruction').textContent =
    instruction || '미션 안내를 불러오지 못했습니다.';

  // 상품과 결제 방식 검사
  updateCheckResult('product-result', result.checks.items);
  updateCheckResult('payment-result', result.checks.payment_method);

  // 실제 주문 내역
  renderFailReceipt(cart);

  // 실패 화면 표시
  modal.style.display = 'flex';
}


// ========================================
// 12. 미션 관련 데이터 초기화
// ========================================

function clearMissionData() {
  sessionStorage.removeItem('martMissionMode');
  sessionStorage.removeItem('martMissionDifficulty');

  sessionStorage.removeItem('martEasyMissionId');
  sessionStorage.removeItem('martEasyMissionInstruction');

  sessionStorage.removeItem('martHardMissionId');
  sessionStorage.removeItem('martHardMissionInstruction');

  sessionStorage.removeItem('martMembershipMethod');
}


// ========================================
// 13. 한 번 더 연습하기
// ========================================

function restartPractice() {
  localStorage.removeItem('martCartItems');
  localStorage.removeItem('martMissionCartItems');
  localStorage.removeItem('selectedPayMethod');

  sessionStorage.removeItem('martSessionStarted');
  sessionStorage.removeItem('martMembershipMethod');

  if (isMissionMode) {
    const retryPath = isHardMode
      ? '../mission/hard/hard.html'
      : '../mission/easy/easy.html';

    clearMissionData();

    window.location.href = retryPath;
  } else {
    window.location.href = '../menu&cart/menu.html';
  }
}


// ========================================
// 14. 다른 연습 선택
// ========================================

function goToMain() {
  localStorage.removeItem('martCartItems');
  localStorage.removeItem('martMissionCartItems');
  localStorage.removeItem('selectedPayMethod');

  sessionStorage.removeItem('martSessionStarted');

  clearMissionData();

  window.location.href = '../../main/main.html';
}


// ========================================
// 15. 페이지 실행
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
  const cart = getCart();

  renderCompletePage(cart);

  document.getElementById('retry-btn')
    .addEventListener('click', restartPractice);

  document.getElementById('back-btn')
    .addEventListener('click', goToMain);

  // 자유 연습이면 기존 완료 화면 유지
  if (!isMissionMode) {
    return;
  }

  // 검사 완료 전 성공 화면 숨기기
  document.getElementById('completePage').style.display = 'none';

  try {
    const result = await checkMission(cart);

    if (result.success) {
      document.getElementById('completePage').style.display = 'flex';
      showMissionSuccess();
    } else {
      showMissionFail(result, cart);
    }

  } catch (error) {
    console.error('미션 검사 오류:', error);

    // 검사 오류는 미션 실패로 처리하지 않음
    document.getElementById('completePage').style.display = 'flex';

    document.querySelector('.success-icon-circle').style.display = 'none';

    document.querySelector('.complete-badge').textContent =
      '검사 오류';

    document.querySelector('.complete-title').textContent =
      '미션 결과를 확인하지 못했어요';

    document.getElementById('completeSummaryText').textContent =
      '서버 연결 또는 미션 정보에 문제가 있어요. 새 미션을 시작해 주세요.';
  }
});
