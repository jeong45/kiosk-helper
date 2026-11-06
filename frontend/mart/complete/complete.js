
// 마트 장바구니 데이터 가져오기
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('martCartItems')) || [];
  } catch (error) {
    return [];
  }
}

// 결제 완료 영수증 표시
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
    let html = '';

    cart.forEach(item => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;

      html += `
        <div class="receipt-row">
          <span>${item.name} · ${quantity}개</span>
          <span>${(price * quantity).toLocaleString()}원</span>
        </div>
      `;
    });

    receiptItems.innerHTML = html;
  }

  document.getElementById('receiptTotal').innerText =
    totalPrice.toLocaleString() + '원';

  // 결제수단 표시
  const savedMethod =
    localStorage.getItem('selectedPayMethod') || '카드 결제';

  document.getElementById('receiptPayMethod').innerText =
    savedMethod;

  // 상품 개수 표시
  document.getElementById('completeSummaryText').innerHTML =
    `${totalCount}개 상품의 결제 연습을 마쳤어요.<br>
    이제 실제 키오스크도 자신 있게 이용해 보세요.`;
}

// 한 번 더 연습하기
function restartPractice() {
  localStorage.removeItem('martCartItems');
  localStorage.removeItem('selectedPayMethod');

  sessionStorage.removeItem('martSessionStarted');

  window.location.href = '../menu&cart/menu.html';
}

// 다른 연습 선택
function goToMain() {
  localStorage.removeItem('martCartItems');
  localStorage.removeItem('selectedPayMethod');

  sessionStorage.removeItem('martSessionStarted');

  window.location.href = '../../main/main.html';
}

// 페이지 실행
document.addEventListener('DOMContentLoaded', () => {
  renderCompletePage();
});