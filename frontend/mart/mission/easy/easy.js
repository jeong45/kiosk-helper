// front/마트/미션/이지/easy.js

let currentMission = null;
let cart = [];

document.addEventListener("DOMContentLoaded", async () => {
    await fetchAndRenderMission();
    initEventListeners();
});

// 1. 백엔드에서 무작위 미션 데이터 불러오기
async function fetchAndRenderMission() {
    try {
        // TODO: 백엔드 API 연동 (예: /api/mission/easy)
        // 임시 데이터 구조
        currentMission = {
            difficulty: "EASY",
            targetItemName: "1인 세트",
            targetQuantity: 2,
            targetPayment: "card",
            description: "1인 세트 2개를 주문하고 카드 결제하세요."
        };

        // 상단 배너 텍스트 업데이트
        document.getElementById("mission-tag").innerText = `${currentMission.difficulty} · 오늘의 미션`;
        document.getElementById("mission-desc").innerText = currentMission.description;
    } catch (error) {
        console.error("미션 정보를 불러오지 못했습니다.", error);
    }
}

// 2. 장바구니 담기 및 조건 체크 로직
function addToCart(item) {
    // 이지모드는 메뉴 1개 조건이므로 선택 편의성 고려
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCartUI();
}

// 3. 결제 단계 진입 시 검증 데이터 저장
function proceedToCheckout(selectedPaymentMethod) {
    // 사용자의 행동 데이터를 객체로 정리
    const userAction = {
        orderedItem: cart[0]?.name || "",
        orderedQuantity: cart[0]?.quantity || 0,
        paymentMethod: selectedPaymentMethod // 'card', 's-pay', 'kakao-pay' 등
    };

    // 미션 성공 조건 검증 (메뉴 이름 및 수량, 결제 수단 일치 여부)
    const isItemMatched = userAction.orderedItem === currentMission.targetItemName && 
                          userAction.orderedQuantity === currentMission.targetQuantity;
    const isPaymentMatched = userAction.paymentMethod === currentMission.targetPayment;

    // 결과를 세션스토리지에 저장하여 최종 성공 페이지(스크린샷 7번째 화면)에서 활용
    sessionStorage.setItem("missionResult", JSON.stringify({
        success: isItemMatched && isPaymentMatched,
        itemCheck: isItemMatched,
        paymentCheck: isPaymentMatched,
        details: userAction,
        mission: currentMission
    }));

    // 결제 완료 후 결과 페이지로 이동
    window.location.href = "mission-result.html";
}