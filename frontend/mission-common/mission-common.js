
document.addEventListener('DOMContentLoaded', () => {

    // 뒤로 가기 버튼
    const backBtn = document.getElementById('backBtn');

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            history.back();
        });
    }

    // 난이도 카드 선택
    const missionCards = document.querySelectorAll('.mission-card');

    missionCards.forEach(card => {
        card.addEventListener('click', () => {

            const selectedLevel = card.dataset.level;

            if (selectedLevel === 'easy') {
                window.location.href = '../mart/mission/easy/easy.html';

            } else if (selectedLevel === 'hard') {
                window.location.href = '../mart/mission/hard/hard.html';
            }

        });
    });

});
