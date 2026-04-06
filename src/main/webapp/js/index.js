document.addEventListener("DOMContentLoaded", function () {
    // 1. 처음 켜졌을 때 메인 화면(main.jsp) 로드
    loadPage('main.jsp');

    // 2. 메뉴/탭 버튼 클릭 이벤트 등록
    document.querySelectorAll('.menu-item, .nb-tab').forEach(button => {
        button.addEventListener('click', function () {
            const targetUrl = this.getAttribute('data-src');

            // 클릭한 탭 색상 활성화
            document.querySelectorAll('.menu-item, .nb-tab').forEach(el => el.classList.remove('active'));

            // 왼쪽 메뉴와 상단 탭 모두 동기화 처리 (선택사항)
            const correspondingTabs = document.querySelectorAll(`[data-src="${targetUrl}"]`);
            correspondingTabs.forEach(el => el.classList.add('active'));

            console.log(targetUrl);
            loadPage(targetUrl);
        });
    });
});

// ⭐ 1. 라우터 맵: 어떤 페이지에서 어떤 함수/디자인을 쓸지 한곳에 정리합니다.
const pageRoutes = {
    "board.jsp": {
        initFunc: () => loadGuestBoard(),
        cssClass: ""               // 특별한 CSS가 필요 없으면 빈칸
    },
    "visitor.jsp": {
        initFunc: () => fetchVisitors(1),    // (나중에 만들 함수)
        cssClass: "is-visitor"     // 방문자 전용 CSS 클래스
    },
    "diary.jsp": {
        initFunc: () => loadDiary(),      // (나중에 만들 함수)
        cssClass: ""
    },
    "photo.jsp": {
        initFunc: () => loadPhoto(), // 사진첩 로드 후 실행할 초기화 함수 (필요시)
        cssClass: "is-photo"
        // 페이지가 늘어나면 여기에 한 줄씩만 추가하면 끝!
    }
}

// 화면 갈아끼우기 함수
function loadPage(url) {
    if (!url) return;

    fetch(url)
        .then(response => response.text())
        .then(htmlData => {
            // 1. 도화지에 껍데기 넣기
            document.getElementById('notebook-content').innerHTML = htmlData;

            // 2. 수첩 CSS 초기화 (이전 페이지에서 붙은 특수 클래스 떼어내기)
            const notebook = document.getElementById('notebook');
            notebook.classList.remove('is-visitor'); // 나중에 특수 클래스가 늘어나면 배열로 관리해도 됩니다.

            // ⭐ 3. 라우터 맵을 뒤져서 URL에 맞는 세팅을 자동으로 실행! (if문 실종사건!)
            for (const path in pageRoutes) {
                if (url.includes(path)) {
                    const route = pageRoutes[path]; // 일치하는 설정 꺼내기

                    // 특수 CSS 클래스가 정의되어 있다면 수첩에 붙여줌
                    if (route.cssClass) {
                        notebook.classList.add(route.cssClass);
                    }

                    // 실행할 초기화 함수가 있다면 실행
                    if (route.initFunc) {
                        route.initFunc();
                    }

                    break; // 찾았으니 반복문 종료
                }
            }
        })
        .catch(error => console.error("페이지 로드 실패:", error));
}

// index.jsp 하단 script 부분 혹은 index.js
document.querySelectorAll('.menu-item, .nb-tab').forEach(tab => {
    tab.addEventListener('click', function () {
        const target = this.getAttribute('data-src');

        if (target.includes('diary')) {
            loadDiary(); // 다이어리 비동기 로드 함수 호출
        } else if (target.includes('board')) {
            loadGuestBoard(); // f팀원분이 만든 방명록 함수 호출
        } else if(target.includes('photo')){
            loadPhoto();
        }
    });
});
// ... 다른 메뉴 처리
//=============================================================================================
// 검색창 js 인데 수정할거 !!
//=============================================================================================
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById('live-search-input');
    const searchDropdown = document.getElementById('search-dropdown');

    searchInput.addEventListener('input', function () {
        const keyword = searchInput.value.trim();

        if (keyword === "") {
            searchDropdown.classList.add('hidden');
            searchDropdown.innerHTML = '';
            return;
        }

        // 🚨 임시 테스트용 더미 데이터
        const dummyData = [
            {pk: "user1", nick: "동민", name: "김동민", title: "동민이의 소소한 일상"},
            {pk: "user2", nick: "코딩요정", name: "박자바", title: "버그 없는 청정구역"}
        ];

        renderDropdown(dummyData);
    });
});
    function renderDropdown(users) {
        searchDropdown.innerHTML = '';

        if (users.length === 0) {
            searchDropdown.innerHTML = `<div style="padding:15px; text-align:center; color:#c0b0a0; font-family:'Gaegu', cursive; font-size:14px;">결과가 없어요! 😢</div>`;
        } else {
            users.forEach(user => {
                const item = document.createElement('div');
                item.className = 'search-item';
                // 클릭 시 파도타기 이동
                item.onclick = () => location.href = `/?host_id=${user.pk}`;

                item.innerHTML = `
                    <div class="search-item-title">${user.nick} <span style="font-weight:normal; font-size:12px; color:#ff7675;">(${user.name})</span></div>
                    <div class="search-item-desc">🏠 ${user.title}</div>
                `;
                searchDropdown.appendChild(item);
            });
        }
        searchDropdown.classList.remove('hidden');
    }

    // 다른 곳 클릭하면 드롭다운 닫기
    // document.addEventListener('click', function (e) {
    //     if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
    //         searchDropdown.classList.add('hidden');
    //     }
    // });