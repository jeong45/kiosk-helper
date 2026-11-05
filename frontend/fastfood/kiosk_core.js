
// 상태 관리 변수
let state = {
    orderType: '',
    cart: [],
    currentSelection: {
        burger: null,
        setType: null, 
        side: null,
        drink: null,
        qty: 1,
        finalPrice: 0,
        addonTemp: null
    },
    
    payment: {
        subPrice: 0,
        addonPrice: 0
    }
};

// ================= 화면 전환 로직 =================
function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hide-temp'));
    document.querySelectorAll('.screen').forEach(s => { s.classList.remove('active'); s.classList.add('hidden'); });
}

function goToSplash() {
    hideAllScreens();
    document.getElementById('screen-splash').classList.remove('hidden');
    document.getElementById('screen-splash').classList.add('active');
    state.cart = []; 
    updateCartUI();
}

function goToOrderType() {
    hideAllScreens();
    document.getElementById('screen-order-type').classList.remove('hidden');
    document.getElementById('screen-order-type').classList.add('active');
}

function selectOrderType(type) {
    state.orderType = type;
    hideAllScreens();
    document.getElementById('screen-main-menu').classList.remove('hidden');
    document.getElementById('screen-main-menu').classList.add('active');
    switchTab('whopper');
}

function goToMainMenu() {
    hideAllScreens();
    document.getElementById('screen-main-menu').classList.remove('hidden');
    document.getElementById('screen-main-menu').classList.add('active');
}

// ================= 메인 메뉴 렌더링 =================
function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';

    const items = menuData[tabName];
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `
            <div class="img">${item.icon}</div>
            <div class="name">${item.name}</div>
            <div class="price">${item.price.toLocaleString()}원~</div>
        `;
        div.onclick = () => {
            if(tabName === 'whopper') openSetChoice(item);
            else if(tabName === 'side') addDirectToCart(item); 
        };
        grid.appendChild(div);
    });
}

// ================= 모달 제어 =================
function showModal(id) {
    document.getElementById('modal-overlay').classList.remove('hidden');
    document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
    const openModals = document.querySelectorAll('.modal:not(.hidden)');
    if(openModals.length === 0) {
        document.getElementById('modal-overlay').classList.add('hidden');
    }
}

// [1] 세트 선택 
function openSetChoice(burger) {
    state.currentSelection = { burger: burger, setType: null, side: null, drink: null, qty: 1 };
    
    const container = document.getElementById('set-options');
    container.innerHTML = `
        <div class="option-item" onclick="selectSetType('large_set', ${burger.price + 4200}, this)">
            <div>
                <h3>${burger.name} 라지세트</h3>
                <p>${burger.name} + 큰 감자튀김 + 큰 콜라</p>
                <div class="price">${(burger.price + 4200).toLocaleString()}원</div>
            </div>
            <div style="font-size:40px;">${burger.icon}</div>
        </div>
        <div class="option-item" onclick="selectSetType('set', ${burger.price + 3500}, this)">
            <div>
                <h3>${burger.name} 세트</h3>
                <p>${burger.name} + 감자튀김 + 콜라</p>
                <div class="price">${(burger.price + 3500).toLocaleString()}원</div>
            </div>
            <div style="font-size:40px;">${burger.icon}</div>
        </div>
        <div class="option-item" onclick="selectSetType('single', ${burger.price}, this)">
            <div>
                <h3>${burger.name}</h3>
                <p>단품</p>
                <div class="price">${burger.price.toLocaleString()}원</div>
            </div>
            <div style="font-size:40px;">${burger.icon}</div>
        </div>
    `;
    showModal('modal-set-choice');
}

let tempSetPrice = 0;
function selectSetType(type, price, el) {
    document.querySelectorAll('.option-item').forEach(i => i.classList.remove('selected'));
    el.classList.add('selected');
    state.currentSelection.setType = type;
    tempSetPrice = price;
}

function confirmSetChoice() {
    if(!state.currentSelection.setType) { alert('구성을 선택해주세요.'); return; }
    
    closeModal('modal-set-choice');
    if(state.currentSelection.setType === 'single') {
        openConfirmMenu(); 
    } else {
        openSideChoice(); 
    }
}

// [2] 사이드 & 음료 선택
function renderGrid(containerId, data, selectionKey, priceElementId, basePrice) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    if(!state.currentSelection[selectionKey]) {
        state.currentSelection[selectionKey] = data[0];
    }

    data.forEach(item => {
        const div = document.createElement('div');
        div.className = `grid-item ${state.currentSelection[selectionKey].id === item.id ? 'selected' : ''}`;
        div.innerHTML = `
            <div style="font-size:40px; margin-bottom:10px;">${item.icon}</div>
            <div style="font-size:12px; font-weight:bold;">${item.name}</div>
            <div style="font-size:12px; color:#c00;">+ ${item.price}원</div>
        `;
        div.onclick = () => {
            state.currentSelection[selectionKey] = item;
            renderGrid(containerId, data, selectionKey, priceElementId, basePrice); 
        };
        container.appendChild(div);
    });

    const addPrice = state.currentSelection[selectionKey].price;
    if(document.getElementById(priceElementId)) {
        document.getElementById(priceElementId).innerText = (basePrice + addPrice).toLocaleString();
    }
}

function openSideChoice() {
    renderGrid('side-options', menuData.setSides, 'side', 'side-total-price', tempSetPrice);
    showModal('modal-side-choice');
}

function confirmSideChoice() {
    closeModal('modal-side-choice');
    openDrinkChoice();
}

function openDrinkChoice() {
    const currentPrice = tempSetPrice + state.currentSelection.side.price;
    renderGrid('drink-options', menuData.setDrinks, 'drink', 'drink-total-price', currentPrice);
    showModal('modal-drink-choice');
}

function confirmDrinkChoice() {
    closeModal('modal-drink-choice');
    openConfirmMenu();
}

// [3] 최종 메뉴 확인 (수량 조절)
function openConfirmMenu() {
    const { burger, setType, side, drink, qty } = state.currentSelection;
    const container = document.getElementById('confirm-view-content');
    container.innerHTML = '';

    container.innerHTML += createConfirmCard(burger.icon, burger.name, '구성변경', () => { closeModal('modal-confirm-menu'); showModal('modal-set-choice'); });
    
    if(setType !== 'single') {
        container.innerHTML += createConfirmCard(side.icon, side.name, '사이드변경', () => { closeModal('modal-confirm-menu'); showModal('modal-side-choice'); });
        container.innerHTML += createConfirmCard(drink.icon, drink.name, '음료변경', () => { closeModal('modal-confirm-menu'); showModal('modal-drink-choice'); });
    }

    updateConfirmPrice();
    showModal('modal-confirm-menu');
}

function createConfirmCard(icon, name, btnText, onclickAction) {
    const randomId = 'btn_' + Math.random().toString(36).substring(7);
    setTimeout(() => { document.getElementById(randomId).onclick = onclickAction; }, 50);
    return `
        <div class="confirm-card">
            <div style="font-size:50px;">${icon}</div>
            <div style="font-size:12px; font-weight:bold; margin-top:10px;">${name}</div>
            <button id="${randomId}">${btnText}</button>
        </div>
    `;
}

function goBackFromConfirm() {
    closeModal('modal-confirm-menu');
    if(state.currentSelection.setType === 'single') showModal('modal-set-choice');
    else showModal('modal-drink-choice');
}

function changeQty(amount) {
    if(state.currentSelection.qty + amount > 0) {
        state.currentSelection.qty += amount;
        document.getElementById('current-qty').innerText = state.currentSelection.qty;
        updateConfirmPrice();
    }
}

function updateConfirmPrice() {
    let basePrice = tempSetPrice;
    if(state.currentSelection.side) basePrice += state.currentSelection.side.price;
    if(state.currentSelection.drink) basePrice += state.currentSelection.drink.price;
    
    const finalPrice = basePrice * state.currentSelection.qty;
    document.getElementById('final-total-price').innerText = finalPrice.toLocaleString();
}

// [4] 카트 담기 및 추가 제안
function showAddonSuggest() {
    closeModal('modal-confirm-menu');
    
    let finalItemPrice = tempSetPrice;
    if(state.currentSelection.side) finalItemPrice += state.currentSelection.side.price;
    if(state.currentSelection.drink) finalItemPrice += state.currentSelection.drink.price;
    
    state.currentSelection.finalPrice = finalItemPrice * state.currentSelection.qty;

    renderGrid('addon-options', menuData.addons, 'addonTemp', 'hidden-price', 0); 
    
    showModal('modal-addon-suggest');
}

function finishItemOrder(isAddon) {
    state.cart.push({ ...state.currentSelection });
    let subPrice = state.currentSelection.finalPrice;
    let addonPrice = 0;
    
    if(isAddon && state.currentSelection.addonTemp) {
        addonPrice = state.currentSelection.addonTemp.price;
        state.cart.push({
            burger: state.currentSelection.addonTemp,
            setType: 'single', side: null, drink: null, qty: 1, 
            finalPrice: addonPrice
        });
    }

    closeModal('modal-addon-suggest');
    updateCartUI();

    // 주문확인창 뒤로가기를 위해 금액 저장
    state.payment.subPrice = subPrice;
    state.payment.addonPrice = addonPrice;

    openOrderConfirm(subPrice, addonPrice);
}

function addDirectToCart(item) {
    state.cart.push({
        burger: item, setType: 'single', side: null, drink: null, qty: 1, finalPrice: item.price
    });
    updateCartUI();
}

function updateCartUI() {
    let count = 0;
    let total = 0;
    state.cart.forEach(c => {
        count += c.qty;
        total += c.finalPrice;
    });
    document.getElementById('cart-count').innerText = count;
    document.getElementById('cart-total-price').innerText = total.toLocaleString();
}

// ================= 결제 단계 화면 전환 로직 =================
function openOrderConfirm(subPrice, addonPrice) {
    hideAllScreens();
    const screen = document.getElementById('screen-order-confirm');
    screen.classList.remove('hidden');
    screen.classList.add('active');

    const { burger, setType, qty } = state.currentSelection;
    let setName = setType === 'large_set' ? ' 라지세트' : (setType === 'set' ? ' 세트' : '');
    
    document.getElementById('final-order-list').innerHTML = `
        <div class="order-list-item">
            <div>
                <h3 style="font-size:16px;">${burger.name}${setName}</h3>
                <div style="font-size:14px; color:#c00; font-weight:bold;">${subPrice.toLocaleString()}원</div>
                <div style="font-size:12px; color:#888;">수량 - ${qty} +</div>
            </div>
            <div style="font-size:40px;">${burger.icon}</div>
        </div>
    `;

    const total = subPrice + addonPrice;
    document.getElementById('confirm-sub-price').innerText = subPrice.toLocaleString() + '원';
    document.getElementById('confirm-addon-price').innerText = addonPrice > 0 ? `감자튀김 ${addonPrice.toLocaleString()}원` : '0원';
    document.getElementById('confirm-total-price').innerText = total.toLocaleString() + '원';
    document.getElementById('final-pay-price').innerText = total.toLocaleString() + '원';
}

function goToOrderConfirm() {
    openOrderConfirm(state.payment.subPrice, state.payment.addonPrice);
}

function goToMembership() {
    hideAllScreens();
    document.getElementById('screen-membership').classList.remove('hidden');
    document.getElementById('screen-membership').classList.add('active');
}

function goToBarcode() {
    hideAllScreens();
    document.getElementById('screen-barcode').classList.remove('hidden');
    document.getElementById('screen-barcode').classList.add('active');
}

let inputPhoneNumber = '';
function goToPhone() {
    hideAllScreens();
    document.getElementById('screen-phone').classList.remove('hidden');
    document.getElementById('screen-phone').classList.add('active');
    
    // 화면 열릴 때 입력값 초기화
    inputPhoneNumber = '';
    updatePhoneDisplay();
}

// 숫자 버튼 클릭 시
function inputPhone(num) {
    if (inputPhoneNumber.length < 11) { // 최대 11자리 제한
        inputPhoneNumber += num;
        updatePhoneDisplay();
    }
}

// 지우기
function deletePhone() {
    if (inputPhoneNumber.length > 0) {
        inputPhoneNumber = inputPhoneNumber.slice(0, -1);
        updatePhoneDisplay();
    }
}

// 화면에 번호 표시 및 하이픈(-) 자동 추가
// 화면에 번호 표시, 하이픈(-) 자동 추가 및 완료 버튼 활성화 로직
function updatePhoneDisplay() {
    const display = document.getElementById('phone-input-display');
    const btnComplete = document.getElementById('btn-phone-complete'); // 완료 버튼 가져오기
    
    if (inputPhoneNumber.length === 0) {
        display.innerText = '010-0000-0000';
        display.style.color = '#a0a5aa'; // 안내문구 색상
    } else {
        // 010-1234-5678 형태로 포맷팅
        let formatted = inputPhoneNumber;
        if (formatted.length > 3 && formatted.length <= 7) {
            formatted = formatted.replace(/(\d{3})(\d+)/, '$1-$2');
        } else if (formatted.length > 7) {
            formatted = formatted.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
        }
        display.innerText = formatted;
        display.style.color = '#333'; // 입력된 글자 색상
    }

    // 번호가 11자리 모두 입력되었는지 확인
    if (inputPhoneNumber.length === 11) {
        btnComplete.classList.remove('btn-light-grey'); // 회색 배경 제거
        btnComplete.classList.add('btn-blue');          // 파란 배경 추가
        btnComplete.disabled = false;                   // 버튼 활성화 (클릭 가능)
    } else {
        btnComplete.classList.remove('btn-blue');       // 파란 배경 제거
        btnComplete.classList.add('btn-light-grey');    // 회색 배경 추가
        btnComplete.disabled = true;                    // 버튼 비활성화 (클릭 방지)
    }
}

function goToPayment() {
    hideAllScreens();
    document.getElementById('screen-payment').classList.remove('hidden');
    document.getElementById('screen-payment').classList.add('active');
}

// ================= 결제 수단 선택 및 성공 화면 로직 =================

let selectedPayMethod = '';

// 결제 수단 버튼 클릭 시
function selectPayMethod(method, element) {
    selectedPayMethod = method;

    // 모든 버튼의 선택 상태 초기화
    document.querySelectorAll('.pay-method-btn').forEach(btn => btn.classList.remove('selected'));
    
    // 클릭한 버튼 활성화
    element.classList.add('selected');

    // 하단 '진행하기' 버튼 활성화 및 텍스트 변경
    const btnProceed = document.getElementById('btn-pay-proceed');
    btnProceed.disabled = false;
    btnProceed.classList.remove('btn-light-grey');
    btnProceed.classList.add('btn-blue');

    if (method === 'card') {
        btnProceed.innerText = '카드 결제 진행하기';
        btnProceed.onclick = () => goToPayGuide('card');
    } else if (method === 'samsung') {
        btnProceed.innerText = '삼성페이 진행하기';
        btnProceed.onclick = () => goToPayGuide('samsung');
    } else if (method === 'kakao') {
        btnProceed.innerText = '카카오페이 진행하기';
        btnProceed.onclick = () => goToPayGuide('kakao');
    }
}

// 각 결제 방식 안내 화면으로 이동
function goToPayGuide(method) {
    hideAllScreens();
    
    // 하단 결제 금액 세팅
    const totalAmount = document.getElementById('final-pay-price').innerText;
    document.querySelectorAll('.confirm-pay-amount').forEach(el => el.innerText = totalAmount);

    if (method === 'card') {
        document.getElementById('screen-pay-card').classList.remove('hidden');
        document.getElementById('screen-pay-card').classList.add('active');
    } else if (method === 'samsung') {
        document.getElementById('screen-pay-samsung').classList.remove('hidden');
        document.getElementById('screen-pay-samsung').classList.add('active');
    } else if (method === 'kakao') {
        document.getElementById('screen-pay-kakao').classList.remove('hidden');
        document.getElementById('screen-pay-kakao').classList.add('active');
    }
}

// 결제 성공 화면으로 이동 및 데이터 바인딩
function goToSuccess(methodName) {
    hideAllScreens();
    
    const screen = document.getElementById('screen-success');
    screen.classList.remove('hidden');
    screen.classList.add('active');

    // 데이터 가져오기
    const { burger, setType } = state.currentSelection;
    let setName = setType === 'large_set' ? ' 라지세트' : (setType === 'set' ? ' 세트' : '');
    
    // 최종 금액 및 결제 방식 텍스트 바인딩
    document.getElementById('success-menu-name').innerText = burger.name + setName;
    document.getElementById('success-total-price').innerText = document.getElementById('final-pay-price').innerText;
    document.getElementById('success-pay-method').innerText = methodName;

    // 상세 내역 구성 (세트일 경우 사이드/음료, 애드온 있을 경우 애드온)
    let detailText = '';
    if (setType !== 'single' && state.currentSelection.side && state.currentSelection.drink) {
        detailText += `${state.currentSelection.side.name} · ${state.currentSelection.drink.name}<br>`;
    }
    if (state.currentSelection.addonTemp) {
        detailText += `추가: ${state.currentSelection.addonTemp.name}`;
    }
    document.getElementById('success-menu-detail').innerHTML = detailText;
}

// 기존 goToPayment 함수 수정 (다시 돌아왔을 때 버튼 초기화)
const originalGoToPayment = goToPayment;
goToPayment = function() {
    originalGoToPayment();
    
    // 선택 초기화
    selectedPayMethod = '';
    document.querySelectorAll('.pay-method-btn').forEach(btn => btn.classList.remove('selected'));
    
    const btnProceed = document.getElementById('btn-pay-proceed');
    btnProceed.disabled = true;
    btnProceed.classList.remove('btn-blue');
    btnProceed.classList.add('btn-light-grey');
    btnProceed.innerText = '결제 방식을 선택해 주세요';
};




