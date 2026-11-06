
 // ========================================
 // 키우미 마트 HARD 미션
 // ========================================

 // 백엔드 주소
 const API_BASE_URL = 'http://127.0.0.1:8000';

 // HARD 미션 데이터 저장 키
 const MISSION_ID_KEY = 'martHardMissionId';
 const MISSION_MODE_KEY = 'martMissionMode';
 const MISSION_CART_KEY = 'martMissionCartItems';
 const MISSION_INSTRUCTION_KEY = 'martHardMissionInstruction';


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
     sessionStorage.setItem('martMissionDifficulty', 'hard');

     // 이전 미션 데이터 초기화
     sessionStorage.removeItem(MISSION_ID_KEY);
     sessionStorage.removeItem(MISSION_INSTRUCTION_KEY);
     localStorage.removeItem(MISSION_CART_KEY);

     instructionElement.textContent =
         'HARD 미션을 불러오는 중입니다.';

     instructionElement.classList.add('loading');

     try {
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

         console.log('HARD 미션 불러오기 성공:', mission);

     } catch (error) {
         console.error('HARD 미션 불러오기 오류:', error);

         instructionElement.textContent =
             'HARD 미션을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';
     }

     instructionElement.classList.remove('loading');
 }


 // ========================================
 // 2. 페이지 실행
 // ========================================

 document.addEventListener('DOMContentLoaded', () => {
     loadHardMission();
 });
