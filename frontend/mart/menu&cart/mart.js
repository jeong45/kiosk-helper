
 // =====================================
 // 1. 상품 데이터
 // =====================================

 const MART_PRODUCTS = [
   // 추천상품
   { name: '생수', price: 1000, category: '추천상품', color: '#DBEAFE' },
   { name: '바나나', price: 9000, category: '추천상품', color: '#FEF3C7' },
   { name: '우유', price: 2800, category: '추천상품', color: '#E0F2FE' },
   { name: '신라면', price: 1200, category: '추천상품', color: '#FEE2E2' },
   { name: '감자칩', price: 1800, category: '추천상품', color: '#FFEDD5' },
   { name: '삼각김밥', price: 1500, category: '추천상품', color: '#DCFCE7' },

   // 음료
   { name: '탄산수', price: 1500, category: '음료', color: '#CFFAFE' },
   { name: '오렌지주스', price: 2200, category: '음료', color: '#FFEDD5' },
   { name: '콜라', price: 2000, category: '음료', color: '#FECACA' },
   { name: '이온음료', price: 2100, category: '음료', color: '#DBEAFE' },
   { name: '캔커피', price: 1800, category: '음료', color: '#E7D3C0' },
   { name: '두유', price: 1700, category: '음료', color: '#FEF3C7' },

   // 간편식
   { name: '도시락', price: 5500, category: '간편식', color: '#FDE68A' },
   { name: '김밥', price: 3000, category: '간편식', color: '#DCFCE7' },
   { name: '샌드위치', price: 4200, category: '간편식', color: '#FEF3C7' },
   { name: '컵라면', price: 1800, category: '간편식', color: '#FECACA' },
   { name: '핫도그', price: 2500, category: '간편식', color: '#FED7AA' },
   { name: '샐러드', price: 4800, category: '간편식', color: '#BBF7D0' },

   // 과자
   { name: '새우과자', price: 1700, category: '과자', color: '#FDBA74' },
   { name: '초코과자', price: 2000, category: '과자', color: '#D6B49A' },
   { name: '젤리', price: 1500, category: '과자', color: '#FBCFE8' },
   { name: '쿠키', price: 2300, category: '과자', color: '#FDE68A' },
   { name: '팝콘', price: 2500, category: '과자', color: '#FEF3C7' },
   { name: '견과류', price: 3500, category: '과자', color: '#D6D3D1' },

   // 생활용품
   { name: '물티슈', price: 2000, category: '생활용품', color: '#E0F2FE' },
   { name: '치약', price: 2500, category: '생활용품', color: '#BFDBFE' },
   { name: '칫솔', price: 3200, category: '생활용품', color: '#C7D2FE' },
   { name: '휴지', price: 4500, category: '생활용품', color: '#F1F5F9' },
   { name: '건전지', price: 4000, category: '생활용품', color: '#FDE68A' },
   { name: '우산', price: 9000, category: '생활용품', color: '#DDD6FE' }
 ];


 // =====================================
 // 2. 현재 선택 상품 및 카테고리
 // =====================================

 let currentItem = {
   name: '',
   price: 0,
   quantity: 1
 };

 let currentCategory = '추천상품';


 // =====================================
 // 3. 키오스크 세션 관리
 // =====================================

 const sessionKey = 'martSessionStarted';

 if (!sessionStorage.getItem(sessionKey)) {
   localStorage.removeItem('martCartItems');
   sessionStorage.setItem(sessionKey, 'true');
 }


 // =====================================
 // 4. 미션 모드 확인 및 장바구니 설정
 // =====================================

 function isMartMissionMode() {
   return sessionStorage.getItem('martMissionMode') === 'true';
 }

 function getCartStorageKey() {
   return isMartMissionMode()
     ? 'martMissionCartItems'
     : 'martCartItems';
 }


 // =====================================
 // 5. 장바구니 데이터 관리
 // =====================================

 function getCart() {
   try {
     const cart = JSON.parse(
       localStorage.getItem(getCartStorageKey())
     );

     return Array.isArray(cart) ? cart : [];
   } catch (error) {
     return [];
   }
 }

 function saveCart(cart) {
   localStorage.setItem(
     getCartStorageKey(),
     JSON.stringify(cart)
   );
 }

 function formatPrice(price) {
   return Number(price).toLocaleString('ko-KR') + '원';
 }

 function getTotalCount(cart) {
   return cart.reduce(
     (sum, item) => sum + (Number(item.quantity) || 0),
     0
   );
 }

 function getTotalPrice(cart) {
   return cart.reduce(
     (sum, item) =>
       sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
     0
   );
 }


 // =====================================
 // 6. 상품 목록 표시
 // =====================================

 function renderProducts(category) {
   const productGrid = document.getElementById('productGrid');

   if (!productGrid) {
     return;
   }

   currentCategory = category;

   const products = MART_PRODUCTS.filter(
     product => product.category === category
   );

   productGrid.innerHTML = products.map((product, index) => `
     <div class="product-card"
       data-product-index="${index}"
       data-product-name="${product.name}">

       <div class="product-icon-box"
         style="background-color: ${product.color};">
         <span class="icon-store">🏪</span>
       </div>

       <div class="product-name">${product.name}</div>
       <div class="product-price">${formatPrice(product.price)}</div>

     </div>
   `).join('');

   const productCards = productGrid.querySelectorAll('.product-card');

   productCards.forEach((card, index) => {
     card.addEventListener('click', () => {
       const product = products[index];
       openModal(product.name, product.price);
     });
   });

   document.querySelectorAll('.tab-btn').forEach(button => {
     button.classList.toggle(
       'active',
       button.dataset.category === category
     );
   });

   const sectionTitle = document.querySelector('.section-title');

   if (sectionTitle) {
     sectionTitle.innerText = category;
   }
 }


 // 카테고리 버튼 연결
 function initCategoryTabs() {
   const categoryButtons = document.querySelectorAll('.tab-btn');

   categoryButtons.forEach(button => {
     button.addEventListener('click', () => {
       renderProducts(button.dataset.category);
     });
   });
 }


 // =====================================
 // 7. 상품 선택 모달
 // =====================================

 function openModal(name, price) {
   currentItem = {
     name: name,
     price: Number(price),
     quantity: 1
   };

   const beam = document.getElementById('scanBeam');

   if (beam) {
     beam.style.opacity = '1';

     setTimeout(() => {
       beam.style.opacity = '0.4';
     }, 200);
   }

   const title = document.getElementById('modalItemTitle');
   const itemPrice = document.getElementById('modalItemPrice');
   const quantity = document.getElementById('modalQuantity');
   const buttonPrice = document.getElementById('modalBtnPrice');
   const modal = document.getElementById('optionModal');

   if (title) title.innerText = name;
   if (itemPrice) itemPrice.innerText = formatPrice(price);
   if (quantity) quantity.innerText = '1';
   if (buttonPrice) buttonPrice.innerText = formatPrice(price);

   if (modal) {
     modal.style.display = 'flex';
   }
 }


 // 모달 닫기
 function closeModal() {
   const modal = document.getElementById('optionModal');

   if (modal) {
     modal.style.display = 'none';
   }
 }


 // 모달 안의 상품 수량 변경
 function changeQuantity(change) {
   if (currentItem.quantity + change < 1) {
     return;
   }

   currentItem.quantity += change;

   const quantity = document.getElementById('modalQuantity');
   const buttonPrice = document.getElementById('modalBtnPrice');

   if (quantity) {
     quantity.innerText = currentItem.quantity;
   }

   const totalPrice = currentItem.price * currentItem.quantity;

   if (buttonPrice) {
     buttonPrice.innerText = formatPrice(totalPrice);
   }
 }


 // =====================================
 // 8. 상품 장바구니에 담기
 // =====================================

 function addToCart() {
   if (!currentItem.name || currentItem.price <= 0) {
     return;
   }

   const cart = getCart();

   const index = cart.findIndex(
     item => item.name === currentItem.name
   );

   if (index > -1) {
     cart[index].quantity =
       Number(cart[index].quantity) + currentItem.quantity;
   } else {
     cart.push({ ...currentItem });
   }

   saveCart(cart);

   closeModal();

   updateCartBar();
 }


 // =====================================
 // 9. 상품 선택 화면 장바구니 표시
 // =====================================

 function updateCartBar() {
   const cart = getCart();

   const totalCount = getTotalCount(cart);
   const totalPrice = getTotalPrice(cart);

   const bottomBar = document.getElementById('bottomCartBar');
   const topBadge = document.getElementById('topCartBadge');

   if (topBadge) {
     topBadge.innerText = `장바구니 ${totalCount}`;
   }

   if (bottomBar) {
     const hasItems = totalCount > 0;

     if (hasItems) {
       bottomBar.classList.add('active');

       bottomBar.innerText =
         `장바구니 보기 · ${totalCount}개 · ${formatPrice(totalPrice)}`;
     } else {
       bottomBar.classList.remove('active');
       bottomBar.innerText = '장바구니가 비어있습니다';
     }
   }

   const headerCount = document.getElementById('header-count');

   if (headerCount) {
     headerCount.innerText = totalCount;
   }
 }


 // =====================================
 // 10. 장바구니 페이지 이동
 // =====================================

 function goToCart() {
   const cart = getCart();

   if (cart.length === 0) {
     alert('장바구니가 비어있습니다.');
     return;
   }

   if (isMartMissionMode()) {
     window.location.href = '../../menu&cart/cart.html';
   } else {
     window.location.href = 'cart.html';
   }
 }

 // =====================================
 // 11. 장바구니 화면 상품 목록 표시
 // =====================================

 function renderMartCart() {
   const cartList = document.getElementById('cart-item-list');

   if (!cartList) {
     return;
   }

   const cart = getCart();

   const totalCount = getTotalCount(cart);
   const totalPrice = getTotalPrice(cart);

   const headerCount = document.getElementById('header-count');
   const totalCountElement = document.getElementById('total-count');
   const totalPriceElement = document.getElementById('total-price');

   if (headerCount) {
     headerCount.innerText = totalCount;
   }

   if (totalCountElement) {
     totalCountElement.innerText = totalCount;
   }

   if (totalPriceElement) {
     totalPriceElement.innerText = formatPrice(totalPrice);
   }

   if (cart.length === 0) {
     cartList.innerHTML = `
       <div class="empty-cart">
         <p>장바구니가 비어있습니다.</p>
         <p>상품을 담아주세요.</p>
       </div>
     `;

     return;
   }

   cartList.innerHTML = cart.map((item, index) => `
     <div class="item-card">

       <div class="item-info">
         <div class="item-icon">🛒</div>

         <div class="item-details">
           <span class="item-name">${item.name}</span>
           <span class="item-price">${formatPrice(item.price)}</span>
         </div>
       </div>

       <div class="quantity-control">
         <button type="button" class="btn-qty"
           onclick="changeMartCartQuantity(${index}, -1)">-</button>

         <span class="qty-num">${item.quantity}</span>

         <button type="button" class="btn-qty"
           onclick="changeMartCartQuantity(${index}, 1)">+</button>
       </div>

     </div>
   `).join('');
 }


 // =====================================
 // 12. 장바구니 상품 수량 변경
 // =====================================

 function changeMartCartQuantity(index, change) {
   const cart = getCart();

   if (!cart[index]) {
     return;
   }

   cart[index].quantity =
     Number(cart[index].quantity) + change;

   if (cart[index].quantity <= 0) {
     cart.splice(index, 1);
   }

   saveCart(cart);

   renderMartCart();
   updateCartBar();
 }


 // =====================================
 // 13. 주문 확인 화면 상품 목록 표시
 // =====================================

 function renderMartOrder() {
   const orderList = document.getElementById('order-item-list');

   if (!orderList) {
     return;
   }

   const cart = getCart();

   const totalCount = getTotalCount(cart);
   const totalPrice = getTotalPrice(cart);

   const orderCount = document.getElementById('order-total-count');
   const orderPrice = document.getElementById('order-total-price');

   if (orderCount) {
     orderCount.innerText = totalCount;
   }

   if (orderPrice) {
     orderPrice.innerText = formatPrice(totalPrice);
   }

   if (cart.length === 0) {
     orderList.innerHTML = `
       <div class="empty-cart">
         <p>주문할 상품이 없습니다.</p>
       </div>
     `;

     return;
   }

   orderList.innerHTML = cart.map(item => `
     <div class="item-card">

       <div class="item-info">
         <div class="item-icon">🛒</div>

         <div class="item-details">
           <span class="item-name">${item.name}</span>
           <span class="item-price">${formatPrice(item.price)}</span>
         </div>
       </div>

       <div class="quantity-badge">
         ${item.quantity}개
       </div>

     </div>
   `).join('');
 }


 // =====================================
 // 14. 장바구니 / 주문 확인 화면 전환
 // =====================================

 function showMartView(viewName) {
   const cartView = document.getElementById('cart-view');
   const orderView = document.getElementById('order-view');

   if (!cartView || !orderView) {
     return;
   }

   if (viewName === 'order') {
     renderMartOrder();

     cartView.classList.remove('active');
     orderView.classList.add('active');

   } else {
     renderMartCart();

     orderView.classList.remove('active');
     cartView.classList.add('active');
   }
 }


 // =====================================
 // 15. 미션 난이도에 따른 메뉴 이동
 // =====================================

 function goToMartMenu() {

   // 미션 모드일 때
   if (isMartMissionMode()) {
     const difficulty =
       sessionStorage.getItem('martMissionDifficulty');

     if (difficulty === 'hard') {
       window.location.href = '../mission/hard/hard.html';
     } else {
       window.location.href = '../mission/easy/easy.html';
     }

   } else {
     // 자유 연습 모드일 때
     window.location.href = 'menu.html';
   }
 }


 // =====================================
 // 16. 페이지 로딩 후 실행
 // =====================================

 document.addEventListener('DOMContentLoaded', () => {

   // 상품 선택 페이지인지 확인
   const productGrid = document.getElementById('productGrid');

   if (productGrid) {
     initCategoryTabs();
     renderProducts('추천상품');
   }

   // 장바구니 표시 갱신
   updateCartBar();

   // 장바구니 페이지인지 확인
   const cartView = document.getElementById('cart-view');

   if (!cartView) {
     return;
   }

   renderMartCart();


   // =====================================
   // 메뉴 더 담기 버튼
   // =====================================

   const btnMoreMenu =
     document.getElementById('btn-more-menu');

   if (btnMoreMenu) {
     btnMoreMenu.addEventListener('click', () => {
       goToMartMenu();
     });
   }


   // =====================================
   // 더 담기 버튼
   // =====================================

   const btnMore = document.getElementById('btn-more');

   if (btnMore) {
     btnMore.addEventListener('click', () => {
       goToMartMenu();
     });
   }


   // =====================================
   // 주문 확인 버튼
   // =====================================

   const btnGoOrder =
     document.getElementById('btn-go-order');

   if (btnGoOrder) {
     btnGoOrder.addEventListener('click', () => {

       if (getCart().length === 0) {
         alert('장바구니가 비어있습니다.');
         return;
       }

       showMartView('order');
     });
   }


   // =====================================
   // 이전 버튼
   // =====================================

   const btnBack = document.getElementById('btn-back');

   if (btnBack) {
     btnBack.addEventListener('click', () => {
       showMartView('cart');
     });
   }


   // =====================================
   // 결제하기 버튼
   // =====================================

   const btnPay = document.getElementById('btn-pay');

   if (btnPay) {
     btnPay.addEventListener('click', () => {

       if (getCart().length === 0) {
         alert('결제할 상품이 없습니다.');
         return;
       }

       window.location.href = '../reward/reward.html';
     });
   }

 });
