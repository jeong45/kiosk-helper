
// ========================================
// 키우미 마트 키오스크 튜토리얼
// ========================================

const martTutorialParams = new URLSearchParams(window.location.search);
const martTutorialPath = window.location.pathname;

// ========================================
// 1. 튜토리얼 상태 관리
// ========================================

// 튜토리얼 최초 진입
if (
  martTutorialParams.get('mode') === 'tutorial' &&
  martTutorialPath.endsWith('menu.html')
) {
  sessionStorage.setItem('martTutorialMode', 'true');
  sessionStorage.setItem('martTutorialStep', '0');
}

// 자유 연습으로 새로 진입한 경우
if (
  martTutorialPath.endsWith('menu.html') &&
  martTutorialParams.get('mode') !== 'tutorial'
) {
  sessionStorage.removeItem('martTutorialMode');
  sessionStorage.removeItem('martTutorialStep');
}

const martTutorialActive =
  sessionStorage.getItem('martTutorialMode') === 'true';

if (martTutorialActive) {

  let martTutorialStep =
    Number(sessionStorage.getItem('martTutorialStep')) || 0;

  // ========================================
  // 2. 단계별 클릭 대상
  // ========================================

  const martTutorialTargets = {
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
const martTutorialHighlightTargets = {
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

  function createMartTutorialStyle() {

    if (document.getElementById('martTutorialStyle')) return;

    const style = document.createElement('style');
    style.id = 'martTutorialStyle';

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

  function showMartTutorialWarning() {

    let warning = document.getElementById('martTutorialWarning');

    if (!warning) {
      warning = document.createElement('div');
      warning.id = 'martTutorialWarning';
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

  function updateMartTutorialHighlight() {

    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });

    const selector =
      martTutorialHighlightTargets[martTutorialStep];

    if (!selector) return;

    const target = document.querySelector(selector);

    if (target) {
      target.classList.add('tutorial-highlight');
    }
  }

  // ========================================
  // 6. 다음 단계 이동
  // ========================================

  function nextMartTutorialStep() {

    martTutorialStep++;

    sessionStorage.setItem(
      'martTutorialStep',
      String(martTutorialStep)
    );

    updateMartTutorialHighlight();
  }

  // ========================================
  // 7. 튜토리얼 종료
  // ========================================

  function finishMartTutorial() {

    sessionStorage.removeItem('martTutorialMode');
    sessionStorage.removeItem('martTutorialStep');

    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });

    document.getElementById('martTutorialWarning')?.remove();
    document.getElementById('martTutorialStyle')?.remove();
  }

  // ========================================
  // 8. 클릭 허용 여부 확인
  // ========================================

  function isAllowedMartTutorialClick(event) {

    if (!(event.target instanceof Element)) return false;

    const selector = martTutorialTargets[martTutorialStep];

    if (!selector) return false;

    return event.target.closest(selector) !== null;
  }

  // ========================================
  // 9. 잘못된 클릭 차단 및 단계 이동
  // ========================================

  document.addEventListener('click', function(event) {

    if (
      sessionStorage.getItem('martTutorialMode') !== 'true'
    ) {
      return;
    }

    if (!isAllowedMartTutorialClick(event)) {

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      showMartTutorialWarning();

      return;
    }

    // 전화번호 입력 단계는 별도 검사
    if (martTutorialStep === 6) return;

    // 마지막 단계
   if (martTutorialStep === 10) {
  finishMartTutorial();
  return;
}

    nextMartTutorialStep();

  }, true);

  // ========================================
  // 10. 전화번호 입력 확인
  // ========================================

  document.addEventListener('click', function(event) {

    if (
      sessionStorage.getItem('martTutorialMode') !== 'true' ||
      martTutorialStep !== 6
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
      nextMartTutorialStep();
    }

  });

  // ========================================
  // 11. 튜토리얼 시작
  // ========================================

  function startMartTutorial() {

    createMartTutorialStyle();

    updateMartTutorialHighlight();
  }

  if (document.readyState === 'loading') {

    document.addEventListener(
      'DOMContentLoaded',
      startMartTutorial
    );

  } else {

    startMartTutorial();

  }
}
