
 // ========================================
 // 키우미 카페 EASY 미션
 // ========================================

 const API_BASE_URL = 'http://127.0.0.1:8000';

 // 미션 데이터 저장 키
 const MISSION_ID_KEY = 'cafeEasyMissionId';
 const MISSION_MODE_KEY = 'cafeMissionMode';
 const MISSION_CART_KEY = 'cafeMissionCartItems';
 const MISSION_INSTRUCTION_KEY = 'cafeEasyMissionInstruction';


 // ========================================
 // 1. EASY 미션 불러오기
 // ========================================

 async function loadEasyMission() {
     const instructionElement = document.getElementById('missionInstruction');

     if (!instructionElement) {
         console.error('미션 안내창을 찾을 수 없습니다.');
         return;
     }

     // 미션 모드 활성화
     sessionStorage.setItem(MISSION_MODE_KEY, 'true');

     // 기존 미션 확인
     const savedMissionId = sessionStorage.getItem(MISSION_ID_KEY);
     const savedInstruction = sessionStorage.getItem(MISSION_INSTRUCTION_KEY);

     // 기존 미션이 있으면 그대로 사용
     if (savedMissionId && savedInstruction) {
         instructionElement.textContent = savedInstruction;

         console.log('기존 EASY 미션 유지:', {
             mission_id: savedMissionId,
             instruction: savedInstruction
         });

         return;
     }

     // 새로운 미션을 시작할 때만 장바구니 초기화
     localStorage.removeItem(MISSION_CART_KEY);

     instructionElement.textContent = '미션을 불러오는 중입니다.';
     instructionElement.classList.add('loading');

     try {
         const response = await fetch(
             `${API_BASE_URL}/api/missions/random?category=cafe&difficulty=easy`
         );

         if (!response.ok) {
             throw new Error(`미션 요청 실패: ${response.status}`);
         }

         const mission = await response.json();

         // 미션 ID 저장
         sessionStorage.setItem(
             MISSION_ID_KEY,
             String(mission.mission_id)
         );

         // 미션 안내 문구 저장
         sessionStorage.setItem(
             MISSION_INSTRUCTION_KEY,
             mission.instruction
         );

         // 미션 안내 문구 표시
         instructionElement.textContent = mission.instruction;

         console.log('새 EASY 미션 불러오기 성공:', mission);

     } catch (error) {
         console.error('EASY 미션 불러오기 오류:', error);

         instructionElement.textContent =
             '미션을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';

     } finally {
         instructionElement.classList.remove('loading');
     }
 }


 // ========================================
 // 2. 페이지 실행
 // ========================================

 document.addEventListener('DOMContentLoaded', () => {
     loadEasyMission();
 });
