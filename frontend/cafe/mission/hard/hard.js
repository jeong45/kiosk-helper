
// ========================================
// 키우미 카페 HARD 미션
// ========================================

// 백엔드 주소
const API_BASE_URL = 'http://127.0.0.1:8000';

// HARD 미션 데이터 저장 키
const MISSION_ID_KEY = 'cafeHardMissionId';
const MISSION_MODE_KEY = 'cafeMissionMode';
const MISSION_CART_KEY = 'cafeMissionCartItems';
const MISSION_INSTRUCTION_KEY = 'cafeHardMissionInstruction';


// ========================================
// 1. HARD 미션 불러오기
// ========================================

async function loadHardMission() {
    const instructionElement =
        document.getElementById('missionInstruction');

    if (!instructionElement) {
        console.error('미션 안내창을 찾을 수 없습니다.');
        return;
    }

    // 미션 모드 활성화
    sessionStorage.setItem(MISSION_MODE_KEY, 'true');

    // HARD 난이도 저장
    sessionStorage.setItem('cafeHardMissionDifficulty', 'hard');

    // ========================================
    // 2. 기존 미션이 있으면 유지
    // ========================================

    const savedMissionId =
        sessionStorage.getItem(MISSION_ID_KEY);

    const savedInstruction =
        sessionStorage.getItem(MISSION_INSTRUCTION_KEY);

    if (savedMissionId && savedInstruction) {
        instructionElement.textContent = savedInstruction;

        console.log(
            '기존 카페 HARD 미션 유지:',
            savedMissionId
        );

        return;
    }

    // ========================================
    // 3. 새로운 미션 시작
    // ========================================

    // 새로운 미션일 때만 장바구니 초기화
    localStorage.removeItem(MISSION_CART_KEY);

    // 이전 EASY 미션 정보 삭제
    sessionStorage.removeItem('martEasyMissionId');
    sessionStorage.removeItem('martEasyMissionInstruction');

    // 이전 미션 판정 결과 삭제
    sessionStorage.removeItem('martMissionResult');

    instructionElement.textContent =
        'HARD 미션을 불러오는 중입니다.';

    instructionElement.classList.add('loading');

    try {
        // 백엔드에서 랜덤 HARD 미션 요청
        const response = await fetch(
            `${API_BASE_URL}/api/missions/random?category=mart&difficulty=hard`
        );

        if (!response.ok) {
            throw new Error(`미션 요청 실패: ${response.status}`);
        }

        const mission = await response.json();

        // HARD 미션 ID 저장
        sessionStorage.setItem(
            MISSION_ID_KEY,
            mission.mission_id
        );

        // HARD 미션 안내 문구 저장
        sessionStorage.setItem(
            MISSION_INSTRUCTION_KEY,
            mission.instruction
        );

        // 미션 안내 문구 표시
        instructionElement.textContent =
            mission.instruction;

        console.log(
            '카페 HARD 미션 불러오기 성공:',
            mission
        );

    } catch (error) {
        console.error(
            '카페 HARD 미션 불러오기 오류:',
            error
        );

        instructionElement.textContent =
            'HARD 미션을 불러오지 못했습니다. 서버 연결을 확인해 주세요.';

    } finally {
        instructionElement.classList.remove('loading');
    }
}


// ========================================
// 4. 페이지 실행
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    loadHardMission();
});
