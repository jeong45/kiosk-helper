
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. 현재 선택한 장소 확인
    // ==========================================

    const params = new URLSearchParams(window.location.search);

    // category=restaurant 또는 category=mart
    const category = params.get('category') || 'mart';

    // ==========================================
    // 2. 뒤로 가기 버튼
    // ==========================================

    const backBtn = document.getElementById('backBtn');

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            history.back();
        });
    }

    // ==========================================
    // 3. 난이도 카드 선택
    // ==========================================

    const missionCards = document.querySelectorAll('.mission-card');

    missionCards.forEach(card => {
        card.addEventListener('click', () => {

            const selectedLevel = card.dataset.level;

            if (selectedLevel !== 'easy' && selectedLevel !== 'hard') {
                return;
            }

            // 음식점 미션
            if (category === 'restaurant') {

                // 기존 음식점 미션 정보 초기화
                sessionStorage.removeItem('restaurantEasyMissionId');
                sessionStorage.removeItem('restaurantEasyMissionInstruction');
                sessionStorage.removeItem('restaurantHardMissionId');
                sessionStorage.removeItem('restaurantHardMissionInstruction');
                sessionStorage.removeItem('restaurantMissionResult');

                localStorage.removeItem('restaurantMissionCartItems');

                // 음식점 미션모드 설정
                sessionStorage.setItem('restaurantMissionMode', 'true');
                sessionStorage.setItem(
                    'restaurantMissionDifficulty',
                    selectedLevel
                );

                if (selectedLevel === 'easy') {
                    window.location.href =
                        '../restaurant/mission/easy/easy.html';
                } else {
                    window.location.href =
                        '../restaurant/mission/hard/hard.html';
                }

                return;
            }

            // 마트 미션 (기존 기능 유지)
            if (category === 'mart') {

                if (selectedLevel === 'easy') {
                    window.location.href =
                        '../mart/mission/easy/easy.html';
                } else {
                    window.location.href =
                        '../mart/mission/hard/hard.html';
                }
            }
            
            // 카페 미션 (기존 기능 유지)
            if (category === 'cafe') {

                if (selectedLevel === 'easy') {
                    window.location.href =
                        '../cafe/mission/easy/easy.html';
                } else {
                    window.location.href =
                        '../cafe/mission/hard/hard.html';
                }
            }
            
            // 패스트푸드미션 (기존 기능 유지)
            if (category === 'fastfood') {

                if (selectedLevel === 'easy') {
                    window.location.href =
                        '../fastfood/mission/easy/easy.html';
                } else {
                    window.location.href =
                        '../fastfood/mission/hard/hard.html';
                }
            }

        });
    });

    // ==========================================
    // 4. 미션 실패 모달
    // ==========================================

    window.showMissionFail = function() {
        const failModal = document.getElementById('mission-fail-modal');

        if (failModal) {
            failModal.style.display = 'flex';
        }
    };

    // 다시 도전하기
    const retryBtn = document.getElementById('retry-btn');

    if (retryBtn) {
        retryBtn.addEventListener('click', () => {

            const failModal =
                document.getElementById('mission-fail-modal');

            if (failModal) {
                failModal.style.display = 'none';
            }

            location.reload();
        });
    }

    // 다른 연습 선택
    const failBackBtn = document.getElementById('fail-back-btn');

    if (failBackBtn) {
        failBackBtn.addEventListener('click', () => {
            history.back();
        });
    }

});
