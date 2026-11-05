
// ========================================
// 키우미 음식점 키오스크 튜토리얼
// ========================================

const isTutorialPage =
  new URLSearchParams(window.location.search).get('mode') === 'tutorial';

const currentPage = window.location.pathname;

// 튜토리얼 최초 진입
if (isTutorialPage) {
  sessionStorage.setItem('tutorialMode', 'true');
  sessionStorage.setItem('tutorialStep', '0');
}

// 메뉴 화면에 새로 진입한 경우 이전 튜토리얼 상태 정리
if (
  currentPage.endsWith('menu.html') &&
  !isTutorialPage &&
  sessionStorage.getItem('preserveCartOnMenu') !== 'true'
) {
  sessionStorage.removeItem('tutorialMode');
  sessionStorage.removeItem('tutorialStep');
}

const tutorialActive =
  sessionStorage.getItem('tutorialMode') === 'true';

if (tutorialActive) {

  let tutorialStep =
    Number(sessionStorage.getItem('tutorialStep')) || 0;

  // 튜토리얼 단계별 클릭 대상
  const tutorialTargets = {
    0: '#tutorialFirstSet',
    1: '#tutorialAddButton',
    2: '#bottomCartBar',
    3: '#tutorialOrderConfirm',
    4: '#tutorialPaymentButton',
    5: '#cardOption',
    6: '#tutorialPayProceed',
    7: '#tutorialInsertComplete'
  };

  // 안내 메시지
  function showTutorialWarning() {
    let warning = document.getElementById('tutorialWarning');

    if (!warning) {
      warning = document.createElement('div');
      warning.id = 'tutorialWarning';
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

  // 현재 단계의 강조 표시 갱신
  function updateTutorialHighlight() {

    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });

    const selector = tutorialTargets[tutorialStep];

    if (!selector) {
      updateScrollHint();
      return;
    }

    const target = document.querySelector(selector);

    if (target) {
      target.classList.add('tutorial-highlight');
    }

    updateScrollHint();
  }

  // 스크롤 안내 표시
  function updateScrollHint() {

    let hint = document.getElementById('tutorialScrollHint');

    if (tutorialStep === 2) {

      if (!hint) {
        hint = document.createElement('div');
        hint.id = 'tutorialScrollHint';
        hint.className = 'tutorial-scroll-hint';
        hint.textContent = '아래로 스크롤해 주세요 ↓';

        document.body.appendChild(hint);
      }

      hint.style.display = 'block';

    } else if (hint) {
      hint.style.display = 'none';
    }
  }

  // 단계 변경
  function nextTutorialStep() {

    tutorialStep++;

    sessionStorage.setItem(
      'tutorialStep',
      String(tutorialStep)
    );

    updateTutorialHighlight();
  }

  // 잘못된 버튼 클릭 방지
  document.addEventListener('click', function(event) {

    if (tutorialStep >= 8) return;

    const selector = tutorialTargets[tutorialStep];

    if (!selector) return;

    const target = event.target.closest(selector);

    if (!target) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      showTutorialWarning();
    }

  }, true);

  // 올바른 버튼 클릭 후 다음 단계로 이동
  document.addEventListener('click', function(event) {

    if (tutorialStep >= 8) return;

    const selector = tutorialTargets[tutorialStep];

    if (!selector) return;

    const target = event.target.closest(selector);

    if (target) {
      nextTutorialStep();
    }

  });

  // 화면 로드 상태에 맞춰 강조 표시
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateTutorialHighlight);
  } else {
    updateTutorialHighlight();
  }

}
