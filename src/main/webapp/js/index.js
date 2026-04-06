document.addEventListener("DOMContentLoaded", function () {

    // 1. 처음 켜졌을 때 메인 화면(main.jsp) 로드
    loadPage('main.jsp');

    // 2. 메뉴/탭 버튼 클릭 이벤트 등록
    document.querySelectorAll('.menu-item, .nb-tab').forEach(button => {
        button.addEventListener('click', function () {
            const targetUrl = this.getAttribute('data-src');

            // 활성화 UI 처리
            document.querySelectorAll('.menu-item, .nb-tab')
                .forEach(el => el.classList.remove('active'));

            document.querySelectorAll(`[data-src="${targetUrl}"]`)
                .forEach(el => el.classList.add('active'));

            loadPage(targetUrl);
        });
    });

    //=============================================================================================
    // 🔍 검색 기능
    //=============================================================================================
    const searchInput = document.getElementById('live-search-input');
    const searchDropdown = document.getElementById('search-dropdown');

    if (searchInput && searchDropdown) {

        searchInput.addEventListener('input', function () {
            const keyword = searchInput.value.trim();

            if (keyword === "") {
                searchDropdown.classList.add('hidden');
                searchDropdown.innerHTML = '';
                return;
            }

            // 🚨 임시 더미 데이터 (나중에 fetch로 교체)
            const dummyData = [
                { pk: "user1", nick: "동민", name: "김동민", title: "동민이의 소소한 일상" },
                { pk: "user2", nick: "코딩요정", name: "박자바", title: "버그 없는 청정구역" }
            ];

            renderDropdown(dummyData);
        });

        function renderDropdown(users) {
            searchDropdown.innerHTML = '';

            if (users.length === 0) {
                searchDropdown.innerHTML = `
                    <div style="padding:15px; text-align:center; color:#c0b0a0; font-family:'Gaegu', cursive; font-size:14px;">
                        결과가 없어요! 😢
                    </div>`;
            } else {
                users.forEach(user => {
                    const item = document.createElement('div');
                    item.className = 'search-item';

                    item.onclick = () => location.href = `/?host_id=${user.pk}`;

                    item.innerHTML = `
                        <div class="search-item-title">
                            ${user.nick} 
                            <span style="font-weight:normal; font-size:12px; color:#ff7675;">
                                (${user.name})
                            </span>
                        </div>
                        <div class="search-item-desc">🏠 ${user.title}</div>
                    `;

                    searchDropdown.appendChild(item);
                });
            }

            searchDropdown.classList.remove('hidden');
        }

        // 외부 클릭 시 닫기
        document.addEventListener('click', function (e) {
            if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
                searchDropdown.classList.add('hidden');
            }
        });
    }
});


// ⭐ 라우터 맵
const pageRoutes = {
    "board.jsp": {
        initFunc: () => loadGuestBoard(),
        cssClass: ""
    },
    "visitor.jsp": {
        initFunc: () => fetchVisitors(1),
        cssClass: "is-visitor"
    },
    "diary.jsp": {
        initFunc: () => loadDiary(),
        cssClass: ""
    }
};


// 📄 페이지 로드 함수
function loadPage(url) {
    if (!url) return;

    fetch(url)
        .then(response => response.text())
        .then(htmlData => {

            // 1. HTML 교체
            document.getElementById('notebook-content').innerHTML = htmlData;

            // 2. CSS 초기화
            const notebook = document.getElementById('notebook');
            notebook.classList.remove('is-visitor');

            // 3. 라우터 실행
            for (const path in pageRoutes) {
                if (url.includes(path)) {
                    const route = pageRoutes[path];

                    if (route.cssClass) {
                        notebook.classList.add(route.cssClass);
                    }

                    if (route.initFunc) {
                        route.initFunc();
                    }

                    break;
                }
            }
        })
        .catch(error => console.error("페이지 로드 실패:", error));
}
