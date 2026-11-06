
// ========================================
// 키우미 카페키오스크 튜토리얼
// ========================================

const cafeTutorialParams = new URLSearchParams(window.location.search);
const cafeTutorialPath = window.location.pathname;

// ========================================
// 1. 튜토리얼 상태 관리
// ========================================

// 튜토리얼 최초 진입
if (
  cafeTutorialParams.get('mode') === 'tutorial' &&
  cafeTutorialPath.endsWith('menu.html')
) {
  sessionStorage.setItem('cafeTutorialMode', 'true');
  sessionStorage.setItem('cafeTutorialStep', '0');
}

// 자유 연습으로 새로 진입한 경우
if (
  cafeTutorialPath.endsWith('menu.html') &&
  cafeTutorialParams.get('mode') !== 'tutorial'
) {
  sessionStorage.removeItem('cafeTutorialMode');
  sessionStorage.removeItem('cafeTutorialStep');
}

const cafeTutorialActive =
  sessionStorage.getItem('cafeTutorialMode') === 'true';

if (cafeTutorialActive) {

  let cafeTutorialStep =
    Number(sessionStorage.getItem('cafeTutorialStep')) || 0;

  // ========================================
  // 2. 단계별 클릭 대상
  // ========================================

  const cafeTutorialTargets = {
  0: '.product-card[data-product-index="0"]',
  1: '#modalAddButton',
  2: '#bottomCartBar',
  3: '#btn-go-order',
  4: '#btn-pay',
  5: '#step-select [onclick*="step-phone"]',
  6: '.key-btn[onclick*="appendNum"]',
  7: '#submit-phone-btn',
  8: '#cardOption',
9: '#methodStep .bottom-fixed-box .btn-primary',
10: '#insertStep .bottom-fixed-box .btn-primary'
};

  // 단계별 강조 대상
const cafeTutorialHighlightTargets = {
  0: '.product-card[data-product-index="0"]',
  1: '#modalAddButton',
  2: '#bottomCartBar',
  3: '#btn-go-order',
  4: '#btn-pay',
  5: '#step-select [onclick*="step-phone"]',
  6: '.keypad-grid',
  7: '#submit-phone-btn',
  8: '#cardOption',
9: '#methodStep .bottom-fixed-box .btn-primary',
10: '#insertStep .bottom-fixed-box .btn-primary'
};

  // ========================================
  // 3. 레스토랑과 동일한 튜토리얼 CSS
  // ========================================

  function createCafeTutorialStyle() {

    if (document.getElementById('cafeTutorialStyle')) return;

    const style = document.createElement('style');
    style.id = 'cafeTutorialStyle';

    style.textContent = `
      .tutorial-highlight {
        position: relative !important;
        z-index: 150 !important;
        outline: 4px solid #111111 !important;
        outline-offset: 5px !important;
        animation: tutorialBlink 0.7s steps(1, end) infinite !important;
      }

      .tutorial-highlight::after {
        content: "여기를 눌러요";
        position: absolute;
        top: -35px;
        right: 0;
        background-color: #111111;
        color: #ffffff;
        padding: 7px 12px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: bold;
        white-space: nowrap;
        z-index: 200;
      }

      @keyframes tutorialBlink {
        0%, 49% {
          outline-color: #111111;
        }

        50%, 100% {
          outline-color: transparent;
        }
      }

      .tutorial-warning {
        display: none;
        position: fixed;
        left: 50%;
        bottom: 30px;
        transform: translateX(-50%);
        width: calc(100% - 32px);
        max-width: 390px;
        padding: 16px;
        background-color: #111111;
        color: #ffffff;
        border-radius: 12px;
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        line-height: 1.5;
        z-index: 500;
      }

      .tutorial-warning.show {
        display: block;
      }
    `;

    document.head.appendChild(style);
  }

  // ========================================
  // 4. 잘못된 클릭 경고
  // ========================================

  function showCafeTutorialWarning() {

    let warning = document.getElementById('cafeTutorialWarning');

    if (!warning) {
      warning = document.createElement('div');
      warning.id = 'cafeTutorialWarning';
      warning.className = 'tutorial-warning';
      document.body.appendChild(warning);
    }

    warning.textContent =
      '다시 한번 해볼까요? 아직 선택할 단계가 아니에요. 검은색 테두리가 깜박이는 버튼을 눌러주세요!';

    warning.classList.add('show');

    clearTimeout(warning.hideTimer);

    warning.hideTimer = setTimeout(() => {
      warning.classList.remove('show');
    }, 2000);
  }

  // ========================================
  // 5. 현재 단계 강조 표시
  // ========================================

  function updateCafeTutorialHighlight() {

    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });

    const selector =
      cafeTutorialHighlightTargets[cafeTutorialStep];

    if (!selector) return;

    const target = document.querySelector(selector);

    if (target) {
      target.classList.add('tutorial-highlight');
    }
  }

  // ========================================
  // 6. 다음 단계 이동
  // ========================================

  function nextCafeTutorialStep() {

    cafeTutorialStep++;

    sessionStorage.setItem(
      'cafeTutorialStep',
      String(cafeTutorialStep)
    );

    updateCafeTutorialHighlight();
  }

  // ========================================
  // 7. 튜토리얼 종료
  // ========================================

  function finishCafeTutorial() {

    sessionStorage.removeItem('cafeTutorialMode');
    sessionStorage.removeItem('cafeTutorialStep');

    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });

    document.getElementById('cafeTutorialWarning')?.remove();
    document.getElementById('cafeTutorialStyle')?.remove();
  }

  // ========================================
  // 8. 클릭 허용 여부 확인
  // ========================================

  function isAllowedCafeTutorialClick(event) {

    if (!(event.target instanceof Element)) return false;

    const selector = cafeTutorialTargets[cafeTutorialStep];

    if (!selector) return false;

    return event.target.closest(selector) !== null;
  }

  // ========================================
  // 9. 잘못된 클릭 차단 및 단계 이동
  // ========================================

  document.addEventListener('click', function(event) {

    if (
      sessionStorage.getItem('cafeTutorialMode') !== 'true'
    ) {
      return;
    }

    if (!isAllowedCafeTutorialClick(event)) {

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      showCafeTutorialWarning();

      return;
    }

    // 전화번호 입력 단계는 별도 검사
    if (cafeTutorialStep === 6) return;

    // 마지막 단계
   if (cafeTutorialStep === 10) {
  finishCafeTutorial();
  return;
}

    nextCafeTutorialStep();

  }, true);

  // ========================================
  // 10. 전화번호 입력 확인
  // ========================================

  document.addEventListener('click', function(event) {

    if (
      sessionStorage.getItem('cafeTutorialMode') !== 'true' ||
      cafeTutorialStep !== 6
    ) {
      return;
    }

    if (!(event.target instanceof Element)) return;

    const target = event.target.closest(
      '.key-btn[onclick*="appendNum"]'
    );

    if (!target) return;

    const phoneInput = document.getElementById('phone-input');

    if (!phoneInput) return;

    const phoneNumber = phoneInput.value.replace(/\D/g, '');

    if (phoneNumber.length >= 10) {
      nextCafeTutorialStep();
    }

  });

  // ========================================
  // 11. 튜토리얼 시작
  // ========================================

  function startCafeTutorial() {

    createCafeTutorialStyle();

    updateCafeTutorialHighlight();
  }

  if (document.readyState === 'loading') {

    document.addEventListener(
      'DOMContentLoaded',
      startCafeTutorial
    );

  } else {

    startCafeTutorial();

  }
}
