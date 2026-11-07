const API_BASE_URL = 'http://127.0.0.1:8000';
const isMissionMode =
  sessionStorage.getItem('fastfoodMissionMode') === 'true';
const missionDifficulty =
  sessionStorage.getItem('fastfoodMissionDifficulty') === 'hard'
    ? 'hard'
    : 'easy';
const missionIdKey = missionDifficulty === 'hard'
  ? 'fastfoodHardMissionId'
  : 'fastfoodEasyMissionId';

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem('fastfoodCartItems'));
    return Array.isArray(cart) ? cart : [];
  } catch (error) {
    console.error('장바구니 불러오기 실패:', error);
    return [];
  }
}

function getMissionOptions(options = {}) {
  return Object.fromEntries(
    Object.entries(options).filter(([, value]) =>
      value !== null && value !== undefined
    )
  );
}

function renderCompletePage() {
  const cart = getCart();
  const totalCount = cart.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0), 0
  );
  const totalPrice = cart.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) *
      (Number(item.quantity) || 0), 0
  );
  const receiptItems = document.getElementById('receiptItems');

  if (receiptItems) {
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
  }

  document.getElementById('receiptTotal').textContent =
    totalPrice.toLocaleString() + '원';
  document.getElementById('receiptPayMethod').textContent =
    localStorage.getItem('selectedPayMethod') || '카드 결제';
  document.getElementById('completeSummaryText').innerHTML =
    `${totalCount}개 상품의 결제 연습을 마쳤어요.<br>` +
    '이제 실제 키오스크도 자신 있게 이용해 보세요.';
}

function showMissionStatus(result, error = false) {
  const icon = document.querySelector('.success-icon-circle');
  const badge = document.querySelector('.complete-badge');
  const title = document.querySelector('.complete-title');
  const summary = document.getElementById('completeSummaryText');

  if (error) {
    icon.textContent = '!';
    badge.textContent = '검사 오류';
    title.textContent = '미션 결과를 확인하지 못했어요';
    summary.textContent =
      '서버 연결 또는 미션 정보에 문제가 있어요. 새 미션을 시작해 주세요.';
    return;
  }

  const success = result.success === true;
  icon.textContent = success ? '✓' : '×';
  badge.textContent =
    `${missionDifficulty.toUpperCase()} 미션 ${success ? '성공' : '실패'}`;
  title.textContent = success
    ? '미션을 완료했어요!'
    : '미션 조건을 다시 확인해 주세요.';
  if (success) {
    summary.innerHTML = missionDifficulty === 'hard'
      ? '상품, 결제 방식, 멤버십 적립을 모두 정확하게 선택했어요.<br>정말 잘하셨어요!'
      : '상품과 결제 방식을 모두 정확하게 선택했어요.<br>정말 잘하셨어요!';
    return;
  }

  summary.innerHTML =
    `상품 조건 ${result.checks.items ? '성공' : '확인 필요'} · ` +
    `결제 방식 ${result.checks.payment_method ? '성공' : '확인 필요'}` +
    (missionDifficulty === 'hard'
      ? ` · 멤버십 ${result.checks.membership_method ? '성공' : '확인 필요'}`
      : '');
}

async function checkMission() {
  const missionId = sessionStorage.getItem(missionIdKey);
  if (!missionId) {
    throw new Error('미션 ID가 없습니다. 새 미션을 시작해 주세요.');
  }

  const payload = {
    mission_id: missionId,
    items: getCart().map(item => {
      const options = getMissionOptions(item.options);
      if (!item.name.includes('와퍼')) {
        delete options.composition;
      }

      return {
        name: item.name,
        quantity: Number(item.quantity),
        options
      };
    }),
    payment_method:
      localStorage.getItem('selectedPayMethod') || '카드 결제',
    membership_method: missionDifficulty === 'hard'
      ? sessionStorage.getItem('fastfoodMembershipMethod')
      : null
  };

  const response = await fetch(`${API_BASE_URL}/api/missions/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`미션 검사 요청 실패: ${response.status}`);
  }

  return response.json();
}

function clearMissionData() {
  [
    'fastfoodMissionMode',
    'fastfoodMissionDifficulty',
    'fastfoodEasyMissionId',
    'fastfoodEasyMissionInstruction',
    'fastfoodHardMissionId',
    'fastfoodHardMissionInstruction',
    'fastfoodMembershipMethod'
  ].forEach(key => sessionStorage.removeItem(key));
}

function restartPractice() {
  localStorage.removeItem('fastfoodCartItems');
  localStorage.removeItem('selectedPayMethod');
  sessionStorage.removeItem('fastfoodSessionStarted');
  clearMissionData();
  window.location.href = '../menu&cart/menu.html';
}

function goToMain() {
  localStorage.removeItem('fastfoodCartItems');
  localStorage.removeItem('selectedPayMethod');
  sessionStorage.removeItem('fastfoodSessionStarted');
  clearMissionData();
  window.location.href = '../../main/main.html';
}

document.addEventListener('DOMContentLoaded', async () => {
  renderCompletePage();
  if (!isMissionMode) return;

  try {
    showMissionStatus(await checkMission());
  } catch (error) {
    console.error('패스트푸드 미션 검사 오류:', error);
    showMissionStatus(null, true);
  }
});
