// =====================================
// 1. 장바구니 데이터 불러오기
// =====================================

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('martCartItems')) || [];
  } catch (error) {
    return [];
  }
}


// =====================================
// 2. 결제 금액 표시
// =====================================

function renderPaymentPage() {
  const cart = getCart();

  const totalPrice = cart.reduce((sum, item) => {
    return sum + (Number(item.price) || 0) *
                 (Number(item.quantity) || 0);
  }, 0);

  // 모든 결제 안내 화면에 결제 금액 표시
  document.querySelectorAll('.payment-total').forEach(element => {
    element.innerText = totalPrice.toLocaleString() + '원';
  });
}


// =====================================
// 3. 결제 수단 선택
// =====================================

let selectedPayMethod = 'card';

function selectPayMethod(method) {
  selectedPayMethod = method;

  const cardOpt = document.getElementById('cardOption');
  const spayOpt = document.getElementById('spayOption');
  const kpayOpt = document.getElementById('kpayOption');

  // 모든 선택 표시 제거
  cardOpt.classList.remove('selected');
  spayOpt.classList.remove('selected');
  kpayOpt.classList.remove('selected');

  // 선택한 결제 수단에 표시
  if (method === 'card') {
    cardOpt.classList.add('selected');
  } else if (method === 'spay') {
    spayOpt.classList.add('selected');
  } else if (method === 'kpay') {
    kpayOpt.classList.add('selected');
  }
}


// =====================================
// 4. 결제 수단에 맞는 안내 화면 표시
// =====================================

function proceedSelectedPayment() {
  const methodStep = document.getElementById('methodStep');
  const insertStep = document.getElementById('insertStep');
  const spayStep = document.getElementById('spayStep');
  const kpayStep = document.getElementById('kpayStep');

  // 모든 화면 숨기기
  methodStep.style.display = 'none';
  insertStep.style.display = 'none';
  spayStep.style.display = 'none';
  kpayStep.style.display = 'none';

  // 선택한 결제 수단에 따라 화면 표시
  if (selectedPayMethod === 'card') {
    insertStep.style.display = 'flex';
  } else if (selectedPayMethod === 'spay') {
    spayStep.style.display = 'flex';
  } else if (selectedPayMethod === 'kpay') {
    kpayStep.style.display = 'flex';
  }
}


// =====================================
// 5. 결제 수단 선택 화면으로 돌아가기
// =====================================

function showMethodStep() {
  document.getElementById('insertStep').style.display = 'none';
  document.getElementById('spayStep').style.display = 'none';
  document.getElementById('kpayStep').style.display = 'none';

  document.getElementById('methodStep').style.display = 'flex';
}


// =====================================
// 6. 결제 완료
// =====================================

function completePayment() {
  let payMethodText = '카드 결제';

  if (selectedPayMethod === 'spay') {
    payMethodText = '삼성페이';
  } else if (selectedPayMethod === 'kpay') {
    payMethodText = '카카오페이';
  }

  localStorage.setItem('selectedPayMethod', payMethodText);

  window.location.href = '../complete/complete.html';
}


// =====================================
// 7. 장바구니 화면으로 돌아가기
// =====================================

function goBackToCart() {
  window.location.href = '../menu&cart/cart.html';
}


// =====================================
// 8. 페이지 처음 실행
// =====================================

document.addEventListener('DOMContentLoaded', () => {
  const cart = getCart();

  // 장바구니가 비어 있으면 결제 화면에 들어오지 않도록 처리
  if (cart.length === 0) {
    alert('장바구니가 비어있습니다.');
    window.location.href = '../menu&cart/cart.html';
    return;
  }

  renderPaymentPage();
});