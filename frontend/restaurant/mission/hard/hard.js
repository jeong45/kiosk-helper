
// ========================================
// 키우미 음식점 HARD 미션
// ========================================

// 백엔드 주소
const RESTAURANT_MISSION_API = 'http://127.0.0.1:8000';

// 음식점 HARD 미션 전용 저장 키
const RESTAURANT_HARD_ID_KEY = 'restaurantHardMissionId';
const RESTAURANT_HARD_INSTRUCTION_KEY = 'restaurantHardMissionInstruction';
const RESTAURANT_MISSION_MODE_KEY = 'restaurantMissionMode';
const RESTAURANT_DIFFICULTY_KEY = 'restaurantMissionDifficulty';


// ========================================
// 1. HARD 미션 불러오기
// ========================================

async function loadRestaurantHardMission() {
  const instructionElement =
    document.getElementById('missionInstruction');

  if (!instructionElement) return;

  // 기존 미션 정보 확인
  const savedMissionId =
    sessionStorage.getItem(RESTAURANT_HARD_ID_KEY);

  const savedInstruction =
    sessionStorage.getItem(RESTAURANT_HARD_INSTRUCTION_KEY);

  // 음식점 HARD 미션모드 설정
  sessionStorage.setItem(RESTAURANT_MISSION_MODE_KEY, 'true');
  sessionStorage.setItem(RESTAURANT_DIFFICULTY_KEY, 'hard');

  // ========================================
  // 2. 기존 미션이 있으면 유지
  // ========================================

  if (savedMissionId && savedInstruction) {
    instructionElement.textContent = savedInstruction;

    console.log(
      '기존 음식점 HARD 미션 유지:',
      savedMissionId
    );

    return;
  }

  // ========================================
  // 3. 새로운 미션 시작
  // ========================================

  // 새 미션일 때만 장바구니 초기화
  localStorage.removeItem('restaurantMissionCartItems');

  // 이전 EASY 미션 정보 삭제
  sessionStorage.removeItem('restaurantEasyMissionId');
  sessionStorage.removeItem('restaurantEasyMissionInstruction');

  // 이전 미션 판정 결과 삭제
  sessionStorage.removeItem('restaurantMissionResult');

  instructionElement.textContent =
    'HARD 미션을 불러오는 중입니다.';

  instructionElement.classList.add('loading');

  try {
    // 백엔드에서 랜덤 HARD 미션 요청
    const response = await fetch(
      `${RESTAURANT_MISSION_API}/api/missions/random?category=restaurant&difficulty=hard`
    );

    if (!response.ok) {
      throw new Error(`미션 요청 실패: ${response.status}`);
    }

    const mission = await response.json();

    // 미션 정보 저장
    sessionStorage.setItem(
      RESTAURANT_HARD_ID_KEY,
      mission.mission_id
    );

    sessionStorage.setItem(
      RESTAURANT_HARD_INSTRUCTION_KEY,
      mission.instruction
    );

    // 화면에 미션 표시
    instructionElement.textContent = mission.instruction;

    console.log(
      '음식점 HARD 미션 불러오기 성공:',
      mission
    );

  } catch (error) {
    console.error(
      '음식점 HARD 미션 불러오기 실패:',
      error
    );

    instructionElement.textContent =
      '미션을 불러오지 못했습니다. 서버 연결을 확인해 주세요.';

  } finally {
    instructionElement.classList.remove('loading');
  }
}


// ========================================
// 4. 페이지 실행
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  loadRestaurantHardMission();
});
