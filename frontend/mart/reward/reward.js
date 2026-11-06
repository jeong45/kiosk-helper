
// ========================================
// 키우미 마트 멤버십 적립
// ========================================


// ========================================
// 1. Lucide 아이콘 초기화
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});


// ========================================
// 2. 전화번호 저장 변수
// ========================================

let rawPhoneNumber = "";


// ========================================
// 3. 화면 이동
// ========================================

function goToStep(stepId) {
  const pages = document.querySelectorAll('.step-page');

  pages.forEach(page => {
    page.classList.remove('active');
  });

  const targetPage = document.getElementById(stepId);

  if (targetPage) {
    targetPage.classList.add('active');
  }

  if (stepId === 'step-phone') {
    updatePhoneUI();
  }
}


// ========================================
// 4. 숫자 입력
// ========================================

function appendNum(digit) {
  if (rawPhoneNumber.length < 11) {
    rawPhoneNumber += digit;
    updatePhoneUI();
  }
}


// ========================================
// 5. 숫자 한 자리 삭제
// ========================================

function deleteNum() {
  if (rawPhoneNumber.length > 0) {
    rawPhoneNumber = rawPhoneNumber.slice(0, -1);
    updatePhoneUI();
  }
}


// ========================================
// 6. 전화번호 전체 삭제
// ========================================

function clearPhone() {
  rawPhoneNumber = "";
  updatePhoneUI();
}


// ========================================
// 7. 전화번호 UI 업데이트
// ========================================

function updatePhoneUI() {
  const inputEl = document.getElementById('phone-input');
  const clearBtn = document.getElementById('clear-btn');
  const submitBtn = document.getElementById('submit-phone-btn');
  const displayBox = document.getElementById('display-box');

  let formatted = "";
  const len = rawPhoneNumber.length;

  if (len < 4) {
    formatted = rawPhoneNumber;

  } else if (len < 7) {
    formatted =
      `${rawPhoneNumber.slice(0, 3)}-${rawPhoneNumber.slice(3)}`;

  } else if (len < 11) {
    formatted =
      `${rawPhoneNumber.slice(0, 3)}-${rawPhoneNumber.slice(3, 6)}-${rawPhoneNumber.slice(6)}`;

  } else {
    formatted =
      `${rawPhoneNumber.slice(0, 3)}-${rawPhoneNumber.slice(3, 7)}-${rawPhoneNumber.slice(7, 11)}`;
  }

  inputEl.value = formatted;

  if (len > 0) {
    clearBtn.classList.add('show');
    displayBox.classList.add('active');
  } else {
    clearBtn.classList.remove('show');
    displayBox.classList.remove('active');
  }

  if (len >= 10) {
    submitBtn.disabled = false;
    submitBtn.className = 'btn-primary full-btn';
  } else {
    submitBtn.disabled = true;
    submitBtn.className = 'btn-disabled full-btn';
  }
}


// ========================================
// 8. 멤버십 적립 완료
// ========================================

function finishReward(method) {

  // 선택한 멤버십 적립 방식 저장
  // none    : 적립 안 함
  // barcode : 바코드 적립
  // phone   : 전화번호 적립

  sessionStorage.setItem(
    'martMembershipMethod',
    method
  );

  console.log('선택한 멤버십 적립 방식:', method);

  // 결제 화면으로 이동
  window.location.href = '../payment/payment.html';
}
