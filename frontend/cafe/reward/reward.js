// Lucide 아이콘 초기화
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
});

// 입력된 전화번호 저장 변수
let rawPhoneNumber = "";

// 스텝 페이지 이동 함수
function goToStep(stepId) {
  const pages = document.querySelectorAll('.step-page');
  pages.forEach(page => page.classList.remove('active'));

  const targetPage = document.getElementById(stepId);
  if (targetPage) {
    targetPage.classList.add('active');
  }

  if (stepId === 'step-phone') {
    updatePhoneUI();
  }
}

// 숫자 버튼 입력
function appendNum(digit) {
  if (rawPhoneNumber.length < 11) {
    rawPhoneNumber += digit;
    updatePhoneUI();
  }
}

// 지우기(BackSpace) 버튼
function deleteNum() {
  if (rawPhoneNumber.length > 0) {
    rawPhoneNumber = rawPhoneNumber.slice(0, -1);
    updatePhoneUI();
  }
}

// X 버튼 (전체 지우기)
function clearPhone() {
  rawPhoneNumber = "";
  updatePhoneUI();
}

// 전화번호 포맷팅 및 UI 업데이트
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
    formatted = `${rawPhoneNumber.slice(0, 3)}-${rawPhoneNumber.slice(3)}`;
  } else if (len < 11) {
    formatted = `${rawPhoneNumber.slice(0, 3)}-${rawPhoneNumber.slice(3, 6)}-${rawPhoneNumber.slice(6)}`;
  } else {
    formatted = `${rawPhoneNumber.slice(0, 3)}-${rawPhoneNumber.slice(3, 7)}-${rawPhoneNumber.slice(7, 11)}`;
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
    submitBtn.className = "btn-primary full-btn";
  } else {
    submitBtn.disabled = true;
    submitBtn.className = "btn-disabled full-btn";
  }
}

// 완료 후 다음 결제 창 이동
// 리워드 선택 완료 후 결제 화면으로 이동
function finishReward() {
  window.location.href = '../payment/payment.html';
}