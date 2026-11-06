
// ========================================
// 키우미 패스트푸드키오스크 튜토리얼
// ========================================

const fastfoodTutorialParams = new URLSearchParams(window.location.search);
const fastfoodTutorialPath = window.location.pathname;

// ========================================
// 1. 튜토리얼 상태 관리
// ========================================

// 튜토리얼 최초 진입
if (
  fastfoodTutorialParams.get('mode') === 'tutorial' &&
  fastfoodTutorialPath.endsWith('menu.html')
) {
  sessionStorage.setItem('fastfoodTutorialMode', 'true');
  sessionStorage.setItem('fastfoodTutorialStep', '0');
}

// 자유 연습으로 새로 진입한 경우
if (
  fastfoodTutorialPath.endsWith('menu.html') &&
  fastfoodTutorialParams.get('mode') !== 'tutorial'
) {
  sessionStorage.removeItem('fastfoodTutorialMode');
  sessionStorage.removeItem('fastfoodTutorialStep');
}

const fastfoodTutorialActive =
  sessionStorage.getItem('fastfoodTutorialMode') === 'true';

if (fastfoodTutorialActive) {

  let fastfoodTutorialStep =
    Number(sessionStorage.getItem('fastfoodTutorialStep')) || 0;
// ========================================
  // 2. 단계별 클릭 대상 (매장/포장 선택 단계 추가)
  // ========================================

  const fastfoodTutorialTargets = {
    0: '.type-card',                       // [추가] 0단계: 매장/포장 선택 카드
    1: '.product-card[data-product-index="0"]', // (기존 0번이 1번으로 밀림)
    2: '#modalAddButton',
    3: '#addon-item-1',
    4: '.modal-footer-btns .btn-primary',
    5: '#bottomCartBar',
    6: '#btn-go-order',
    7: '#btn-pay',
    8: '#step-select [onclick*="step-phone"]',
    9: '.key-btn[onclick*="appendNum"]',
    10: '#submit-phone-btn',
    11: '#cardOption',
    12: '#methodStep .bottom-fixed-box .btn-primary',
    13: '#insertStep .bottom-fixed-box .btn-primary'
  };

  // 단계별 강조 대상
  const fastfoodTutorialHighlightTargets = {
    0: '.type-card',                       // [추가] 0단계 강조
    1: '.product-card[data-product-index="0"]', // (기존 0번이 1번으로 밀림)
    2: '#modalAddButton',
    3: '#addon-item-1',
    4: '.modal-footer-btns .btn-primary',
    5: '#bottomCartBar',
    6: '#btn-go-order',
    7: '#btn-pay',
    8: '#step-select [onclick*="step-phone"]',
    9: '.keypad-grid',
    10: '#submit-phone-btn',
    11: '#cardOption',
    12: '#methodStep .bottom-fixed-box .btn-primary',
    13: '#insertStep .bottom-fixed-box .btn-primary'
  };
  // ========================================
  // 3. 레스토랑과 동일한 튜토리얼 CSS
  // ========================================

  function createFastfoodTutorialStyle() {

    if (document.getElementById('fastfoodTutorialStyle')) return;

    const style = document.createElement('style');
    style.id = 'fastfoodTutorialStyle';

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

  function showFastfoodTutorialWarning() {

    let warning = document.getElementById('fastfoodTutorialWarning');

    if (!warning) {
      warning = document.createElement('div');
      warning.id = 'fastfoodTutorialWarning';
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

  function updateFastfoodTutorialHighlight() {

    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });

    const selector =
      fastfoodTutorialHighlightTargets[fastfoodTutorialStep];

    if (!selector) return;

    const target = document.querySelector(selector);

    if (target) {
      target.classList.add('tutorial-highlight');
    }
  }

  // ========================================
  // 6. 다음 단계 이동
  // ========================================

  function nextFastfoodTutorialStep() {

    fastfoodTutorialStep++;

    sessionStorage.setItem(
      'fastfoodTutorialStep',
      String(fastfoodTutorialStep)
    );

    setTimeout(() => {
      updateFastfoodTutorialHighlight();
    }, 50);
  }

  // ========================================
  // 7. 튜토리얼 종료
  // ========================================

  function finishFastfoodTutorial() {

    sessionStorage.removeItem('fastfoodTutorialMode');
    sessionStorage.removeItem('fastfoodTutorialStep');

    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });

    document.getElementById('fastfoodTutorialWarning')?.remove();
    document.getElementById('fastfoodTutorialStyle')?.remove();
  }

  // ========================================
  // 8. 클릭 허용 여부 확인
  // ========================================

  function isAllowedFastfoodTutorialClick(event) {

    if (!(event.target instanceof Element)) return false;

    const selector = fastfoodTutorialTargets[fastfoodTutorialStep];

    if (!selector) return false;

    return event.target.closest(selector) !== null;
  }

  // ========================================
  // 9. 잘못된 클릭 차단 및 단계 이동
  // ========================================

  document.addEventListener('click', function(event) {

    if (
      sessionStorage.getItem('fastfoodTutorialMode') !== 'true'
    ) {
      return;
    }

    if (!isAllowedFastfoodTutorialClick(event)) {

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      showFastfoodTutorialWarning();

      return;
    }

    // 전화번호 입력 단계는 별도 검사
    if (fastfoodTutorialStep === 9) return;

    // 마지막 단계
   if (fastfoodTutorialStep === 13) {
  finishFastfoodTutorial();
  return;
}

    nextFastfoodTutorialStep();

  }, true);

  // ========================================
  // 10. 전화번호 입력 확인
  // ========================================

  document.addEventListener('click', function(event) {

    if (
      sessionStorage.getItem('fastfoodTutorialMode') !== 'true' ||
      fastfoodTutorialStep !== 9
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
      nextFastfoodTutorialStep();
    }

  });

  // ========================================
  // 11. 튜토리얼 시작
  // ========================================

  function startFastfoodTutorial() {

    createFastfoodTutorialStyle();

    updateFastfoodTutorialHighlight();
  }

  if (document.readyState === 'loading') {

    document.addEventListener(
      'DOMContentLoaded',
      startFastfoodTutorial
    );

  } else {

    startFastfoodTutorial();

  }
}