//현재 보고있는 페이지 번호를 저장 -> 게시글삭제나 수정 등에도 같은 페이지 유지하려고 사용
let globalCurrentPage = 1;

// [핵심 함수] 현재 미니홈피의 주인이 누구인지(ownerPk) 알아내는 공통 함수
function getTargetOwnerPk() {

    // 타인의 미니홈피 방문 중인지 확인 (세션 스토리지에 남의 PK가 메모되어 있는지 확인)
    // sessionStorage는 브라우저 탭이 닫히기 전까지 데이터가 유지되므로 페이지를 이동하거나
    // 새로고침해도 이 정보가 유지됨.
    let savedOwnerPk = sessionStorage.getItem("currentHostId");

    // 스토리지에서 가져온 값이 유효한지 검증하느 조건문
    // 데이터가 설정되지 않은 상태(null)이거나 비어있는 문자열("")일 경우를 찾아냄
    // 타인의 홈피에 방문했다는 기록이 없는 상태를 판별하는 기준이 됨
    if (savedOwnerPk == null || savedOwnerPk == "") {

        // 타인의 홈피가 아니라면 무조건 '내 미니홈피'라는 전제하에 다른 곳에 전역으로 선언되어 있을
        // 내 로그인id를 savedOwnerPk 변수에 덮어 씌운다.
        savedOwnerPk = loginUserId; }

    // 2. 메모가 있다면 파도타기 중(남의 홈피)이므로 그 사람의 PK를 반환하고,
    //    메모가 없다면 내 홈피이므로 JSP에 선언해둔 내 전역변수(loginUserPk)를 반환한다.
    return savedOwnerPk; }

// 1. 방명록 작성 (POST 비동기)
// 문서 전체(document)에submit 이벤트 리스너를 등록했다. 이벤트 버블링을 활용하여,발생한 이벤트의 타겟(e.target.id)이
// "v-visitor-form"일 때만 내부 로직을 실행하도록 필터링한다.
document.addEventListener("submit", function (e) {
    if (e.target && e.target.id === "v-visitor-form") {
        // e.preventDefault() 브라우저가 폼 데이터를 서버로 전송하여 페이지를 새로고침하는 기본 동작을 차단한다 비동기 필수조건
        e.preventDefault();
        // getTargetOwnerPk()를 호출하여 방명록이 작성될 대상(미니홈피의 주인)의 식별자를 가져온다.
        const currentOwnerPk = getTargetOwnerPk();
        // 식별자가 유효하지 않을경우 경고창을 띄우고 return으로 함수 실행을 즉각 중단하여 서버로 무의미한 요청 방지
        if (!currentOwnerPk) {
            alert("잘못된 접근입니다. (미니홈피 주인을 찾을 수 없음)");
            return; }
        // DOM에서 이모지 선택 요소를 찾아 값을 추출
        // 사용자가 특정 이모지를 명시적으로 선택했다면 그 값을 사용
        const emojiSelect = document.getElementById("v-visitor-emoji");
        let selectedEmoji;
        // 사용자가 선택한 값이 있으면 그것을 사용하고, 없으면 1~4 사이의 랜덤 값을 생성하여 할당한다.
        if (emojiSelect && emojiSelect.value) {
            selectedEmoji = emojiSelect.value;
        } else {
            // Math.random()은 0 이상 1 미만의 난수를 반환. 이를 이용해 1~4 정수 추출.
            selectedEmoji = String(Math.floor(Math.random() * 4) + 1); }
        // 서버로 보낼 데이터를 URLSearchParams 객체를 사용해 Key=value&key=value 형태의 쿼리 스트링 포맷으로 인코딩한다
        const requestData = new URLSearchParams({
            visitorEmoji: selectedEmoji,
            ownerPk: currentOwnerPk });
        // visitor 라는 앤드포인트로 POST요청을 보낸다. 헤더의 Content-Type을 명시하여 폼 데이터를 표준 방식으로 직렬화하여 서버에 전달
        fetch("visitor", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: requestData })
            // response.ok(HTTP 상태 코드 200-299)데이터 등록이 성공했을 경우
            .then(response => {
                if (response.ok) {
                    // 방명록 목록을 1페이지로 갱신
                    fetchVisitors(1);
                    // 최근 방문자 목록 다시 불러옴
                    loadRecentVisitors();
                // 권한 없음(401)에러를 구체적으로 잡아내어 사용자에게 로그인 유도 알림 띄우기
                } else if (response.status === 401) {
                    alert("로그인이 필요한 서비스입니다.");
                } else {
                    // 그 외의 400번대(잘못된 요청),500번대(서버 에러)상태 코드에 대한 포괄적인 실패 알림 처리
                    alert("등록에 실패했습니다. 서버 오류가 발생했습니다."); }})
            // 네트워크 단절 CORS 이슈, 혹은 Json파싱 에러 등 HTTP 응답 자체를 받지 못한 치명적인 예외 상황을 콘솔에 출력
            .catch(error => console.error("Error:", error)); } });
// =========================================================================
// 2. 방문자 목록 불러오기 (GET 비동기) - 캐시 차단 완벽 적용
// =========================================================================
function fetchVisitors(page) {
    // 앞서 정의된 getTargetOwnerPk()를 호출하여 조회할 미니홈피의 주인의 식별자를 가져온다
    const currentOwnerPk = getTargetOwnerPk();
    // 식별자가 없을 경우, 사용자에게 알림(alert)을 띄웠던 방명록 작성(POST)때와 달리
    if (!currentOwnerPk) {
        // 개발자 도구의 콘솔에만 에러를 남기고 실행을 종료
        console.error("주인 PK가 없어 목록을 불러올 수 없습니다.");
        return; }
    // 현재 시간을 밀리초 단위의 숫자로 반환받아 변수에 저장
    const noCache = new Date().getTime();
    // visitor에 데이터 요청 페이지 번호(p), 홈피 주인(ownerPK), 그리고 앞서 만든 타임스탬프(t)를 덧붙인다
    // url 끝의 t 값이 매번 달라지므로 브라우저는 항상 새로운 요청으로 인식
    fetch(`visitor?reqType=json&p=${page}&ownerPk=${currentOwnerPk}&t=${noCache}`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0' } })
        // 서버로부터 응답이 도착했을때 HTTP 상태코드(response.ok0)가 200번대(성공)이 아니라면
        // 강제로 에러를 발생(throw new Error)시켜 아래의 성공 로직을 타지 않고 바로 .catch()블록으로 흐름을 던져버림
        .then(response => {
            if (!response.ok) throw new Error("서버 응답 오류");
            return response.json(); })
        // console.log 파싱된 최종 데이터를 확인하기 위한 디버깅 코드
        .then(data => {
            console.log(data);
            // 서버에서 넘겨받은 현재 페이지 정보(data.currentPage)로 최상단에 선언했던 전역 변수 값 갱신
            // 만약 서버 응답에 currentPage 값이 누락되어 있다면(falsy) 논리적 단절을 막기위해 page 매개변수 값을 사용하도록 || 사용
            globalCurrentPage = data.currentPage || page;
            // 서버에서 받아온 방명록 데이터 배열을 화면에 그리는 함수
            renderPosts(data.visitorList);
            // 페이징 네비게이션을 그리는 함수
            renderPaging(data.visitorList, globalCurrentPage); })
        // 에러들을 일괄적으로 잡아 콘솔에 출력
        .catch(error => console.error("방문자 목록 로딩 실패:", error)); }
// =========================================================================
// 3. 우측 최근 방문자 로딩 & 자동 발도장 (GET 비동기)
// =========================================================================
function loadRecentVisitors() {
    // 공통 함수를 통해 미니홈피의 주인의 식별자를 가져온다.
    const currentOwnerPk = getTargetOwnerPk();
    // 디버깅용 로그 출력, 식별자가 유요하지 않으면 함수 실행 즉시 중단
    console.log("현재 홈피의 id는 " + currentOwnerPk);
    if (!currentOwnerPk) return;
    const noCache = new Date().getTime();
    // 현재 시간의 타임스탬프 생성 get 요청 시 브라우저가 과거 캐시 데이터를 반환하는 것을 방지
    // 방문자 목록 조회와 같은 visitor 앤드포인트를 사용하지만 쿼리 스트링의 reqType 값을
    // json이 아닌 recent 로 다르게 지정했다 서버측에서는 이 파라미터 값을 방명록 전체 목록을 줄 것인지
    // 최근 며칠 혹은 몇 명의 요약된 목록만 줄 것인지 분기 처리하게 된다.
    fetch(`visitor?reqType=recent&ownerPk=${currentOwnerPk}&t=${noCache}`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'} })
        // 앞선 fetcgVisitors 와 다르게 response.ok를 확인하는 예외 처리 로직이 생략되고 바로 .json으로 파싱을 시도
        .then(response => response.json())
        .then(data => {
        // 서버가 응답한 데이터를 받으면, DOM에서 최근 방문자를 나열할 대상 v-recent-list 요소를 찾아 그 내부의 기존
        // HTML을 완전히 비워낸다("") 이전 데이터를 초기화하고 새 데이터를 그리기 위해 준비
            const listContainer = document.getElementById('v-recent-list');
            listContainer.innerHTML = "";
            // 서버에서 받아온 배열 데이터가 null/undefined 이거나 길이가 0일 경우
            // 방문자가 없다는 안내 메시지를 li 태그로 감싸 컨테이너에 직접 삽입한다.
            if (!data || data.length === 0) {
                listContainer.innerHTML = "<li class='v-empty'>아직 다녀간 사람이 없어요.</li>";
            } else {
                data.forEach(v => {
                    let emoji = '✨';
                    if (v.v_emoji == 1) emoji = '🐾';
                    else if (v.v_emoji == 2) emoji = '👣';
                    else if (v.v_emoji == 3) emoji = '🐱';
                    else if (v.v_emoji == 4) emoji = '🐶';
                    // 메모리에 새로운 li요소를 생성한다.(종이한장 꺼내서 미리 준비하는 느낌)
                    const li = document.createElement('li');
                    // 작성자의 닉네임을 클릭하면 타인의 미니홈피로 파도타기하는 goSearchMain 함수가 호출되도록
                    // 인라인 이벤트 핸들러가 바인딩되어 있다. 이때 작성자의 식별자(v_writer_pk)를 매개 변수로 넘긴다
                    li.innerHTML = `
                    <span style="display:flex; align-items:center; gap:5px;">
                        <span style="font-size: 11px;">${emoji}</span>
                        <strong style="cursor:pointer;" onclick="goSearchMain('${v.v_writer_pk}', '${v.v_writer_nickname}')"> ${v.v_writer_nickname}</strong>
                    </span>
                    <span class="v-date-small">${v.v_date}</span> `;
                    // li 요소를 초기화해 두었던 listContainer의 자식 요소로 순차적으로 추가(Append)한다.
                    listContainer.appendChild(li); }); }
            // 방문자를 남기거나 목록을 불러왔다는건 기록이 추가 되었다는 의미니, 미니홈피 상단의 일일/누적 조회수를 업데이트하는
            // 외부 함수(updateHitCount)를 연달아 호출시킨다 단 스크립트 에러 터지는걸 막으려 typeof 연산자로 함수 존재 여부를 확인하는
            // 안전한 호출방식을 채택했고 통신이나 파싱 과정에서 발생한 에러는 콘솔에 출력
            if (typeof updateHitCount === "function") {
                updateHitCount(); } })
        .catch(err => console.error("최근 방문자 로딩 실패:", err)); }
// =========================================================================
// 4. 방명록 삭제 로직
// 함수가 호출될 때 삭제하고자 하는 특정 방명록 게시글의 고유 식별자(id)를 인자로 전달받는다
// 이 값은 HTML 렌더링 단계에서 삭제 버튼의 onclick 이벤트 등에 바인딩 되어 있었을 =
function deleteVisitor(vId) {
    // 브라우저 내장 다이얼로그인 confirm창을 띄워 사용자에게 삭제를 최종확인한다
    // 사용자가 '취소'를 누르면 confirm 함수는 false를 반환하고, 앞에 붙은 논리 부정 연산자(!)에 의해 조건식이 true가 됨
    // 결과적으로 return이 실행되어 서버로 어떠한 요청도 보내지 않고 함수가 즉시 종료된다
    if (!confirm('삭제하시겠습니까?')) return;
    // visitorDel이라는 서버 엔드 포인트로 통신을 시도하며, 삭제할 게시글의 번호(vid)를 url 쿼리 스트링 형태로 덧붙혀 전송
    fetch(`visitorDel?vId=${vId}`, {method: "GET"})
        // response(성공) 삭제가 정상적으러 완료되면 화면을 갱신하기 위해 fetchVisitors 함수를 다시 호출
        .then(response => {
            // 이때 매개 변수로 숫자1이 아닌 맨처음 선언한 전역변수(globalCurrentPage)를 전달한다
            // 즉 사용자가 3페이지에서 게시글을 삭제했다면, 삭제 후 목록을 다시 불러올 때 1페이지로 튕기지 않고
            // 3페이지를 그대로 유지하도록 데이터를 재조회하는 흐름
            if (response.ok) fetchVisitors(globalCurrentPage);
            else alert("삭제에 실패했습니다."); })
        // HTTP코드가 200번대가 아닐경우 삭제 실패 알림 띄움
        .catch(error => console.error("Error:", error)); }
// =========================================================================
// 5. UI 렌더링 함수들
// fetchVisitors 통신 성공 시 서버로부터 전달받은 방명록 데이터 배열 visitorList을 인자로 받는다
// 방명록 게시글들이 그려질 부모 요소 v-posts-container를 DOM에서 찾는다
function renderPosts(visitorList) {
    const container = document.getElementById("v-posts-container");
    //해당 컨테이너 내부의 기존 HTML노드들을 전부 날려버린다, 이전 게시글들 밑에 새 게시글이 중복으로 쌓이는 것을 막기위한 필수 조건
    container.innerHTML = "";
    // 전달받은 배열이 유효하지 않거나 .length === 0, 아예 비어있을 경우 화면에 표시할 '안내 문구'를 렌더링한다.
    // 데이터를 그려넣은 직후 return을 호출하여 아래의 반복문 로직이 실행되지 않도록 함수를 조기종료한다.
    if (!visitorList || visitorList.length === 0) {
        container.innerHTML = `
            <div class="v-post-item" style="text-align:center; color:#aaa; padding:100px 0; font-size:20px;">
                아직 다녀간 사람이 없어요. 첫 발도장을 찍어주세요! 😊
            </div>`;
        return; }
    // 빈 문자열을 담은 변수를 선언 후, 반복문을 돌면서 생성될 각각의 방명록 게시글HTML 마크업을 이 변수에 하나씩 이어 붙일 목적
    let html = "";
    // 배열에 담긴 게시글 객체를 하나씩 꺼내어 순회한다. 앞서 분석했던 loadRecentVisitors 함수와 완전히 동일한 논리
    // 데이터베이스의 숫자형 이모지 코드를 시각적인 이모지 문자로 변환(Mapping)한다
    visitorList.forEach(v => {
        let emoji = '✨';
        if (v.v_emoji == 1) emoji = '🐾';
        else if (v.v_emoji == 2) emoji = '👣';
        else if (v.v_emoji == 3) emoji = '🐱';
        else if (v.v_emoji == 4) emoji = '🐶';
        // 템플릿 리터러를 사용하여 HTML 구조 안에 자바스크립트 변수 ${emoji},${v.v_writer_nickname}, ${v.v_date})를 직접 삽입(바인딩)한다
        html += `
            <div class="v-post-item" style="display:flex; justify-content:space-between; align-items:center; padding:12px 20px; background:#fff; border-radius:10px; border:1px solid #f0eee5; box-shadow: 2px 2px 5px rgba(0,0,0,0.02);">
                <div style="display:flex; align-items:center; gap:15px;">
                    <span class="v-moving-emoji" style="font-size: 22px; display: inline-block;">${emoji}</span>
                    <span style="font-size:18px; color:#5a4a3a;">
                        <strong 
                            style="color:#f2a0a0; cursor:pointer; text-decoration:underline; text-underline-offset: 3px;" 
                            onclick="goSearchMain('${v.v_writer_pk}', '${v.v_writer_nickname}')"
                            title="파도타기!">
                            ${v.v_writer_nickname}
                        </strong>님이 다녀갔습니다.
                    </span>
                </div>
                <div style="display:flex; align-items:center; gap:15px;">
                    <span style="font-size:13px; color:#c0b0a0;">${v.v_date}</span>
                    <a href="javascript:void(0);" onclick="deleteVisitor('${v.v_id}')" style="text-decoration:none; color:#ff9999; font-weight:bold; font-size:20px;">&times;</a>
                </div>
            </div>`;
    });
    container.innerHTML = html;
}
// 서버에서 가져온 방명록 데이터 뭉치(visitorList)와 현재 우리가 보고있는 페이지 번호를 함수의 재료로 받는다.
function renderPaging(visitorList, currentPage) {
    // document.getElementById 화면에서 페이지 버튼들이 들어갈 네모난 구역(컨테이너)를 찾는다
    const container = document.getElementById("v-paging-container");
    // 버튼들을 빈 문자열 준비
    let html = "";
    // 현재 페이지가 1보다 큰지(즉,2페이지 이상인지) 묻는 조건문.
    if (currentPage > 1) {
        // 버튼을 누르면 앞서 분석했던 fetchVisitors 함수를 다시 부르는데, 이때 현재 페이지에서 1을뺀 숫자를 넘겨줌
        html += `<button class="v-page-btn" onclick="fetchVisitors(${currentPage - 1})" style="background:#fff; border:1px solid #f2c0bd; border-radius:15px; padding:5px 15px; cursor:pointer; font-family:'Gaegu'; color:#8a7a78;">◀ 이전</button>`;
    } else {
        // 만약 현재 1페이지라면 갈곳이 없으니 버튼 생성을 안하고 대신 투명 빈박스를 만듬
        html += `<div style="width:70px;"></div>`; }
    // 앞서 만든 '이전버튼(또는 빈 박스)'바로 옆에 현재 페이지 버호 (page1,2등)를 글자로 적어 붙인다.
    html += `<span style="font-family:'Nanum Pen Script'; color:#8a7a78; font-size:22px;">Page ${currentPage}</span>`;
    // 서버에서 가져온 방명록 데이터 개수(visitorList.length)가 정확히7개일 때만 '다음'버튼을 만든다.
    // 버튼을 누르면 현재 페이지에1을 더한값을 서버에 요청한다. 7개가 아니라면 투명한 빈박스를 채워넣는다.
    if (visitorList && visitorList.length === 7) {
        html += `<button class="v-page-btn" onclick="fetchVisitors(${currentPage + 1})" style="background:#fff; border:1px solid #f2c0bd; border-radius:15px; padding:5px 15px; cursor:pointer; font-family:'Gaegu'; color:#8a7a78;">다음 ▶</button>`;
    } else {
        html += `<div style="width:70px;"></div>`; }

    container.innerHTML = html; }

// =========================================================================
// 6. 방문자(발도장) 초기 로딩 함수
// =========================================================================
function initVisitorLog() {
    fetchVisitors(1);
    loadRecentVisitors();
}

// 화면(수첩 속지) 갈아끼우기 함수
function vloadPage(url) {
    if (!url) return;
    // 현재 방문중인 미니홈피 주인의 ID를 브라우저 임시 저장소에서 찾고 없으면 로그인한 내ID를 기본값으로 사용한다.
    const savedOwnerPk = sessionStorage.getItem("currentHostId");
    const targetOwnerPk = savedOwnerPk ? savedOwnerPk : loginUserId;

    let fetchUrl = url;
    // url.includes ('?') 을 통해 기존 주소에 이미 다른 파라미터가 포함되어 있는지 검사
    // 파라미터가 이미 있다면 새로운 파라미터를 추가하기 위해 & 을 붙인다 visitor?page=1&ownerPK=...
    // 파라미터가 없다면 파라미터의 시작을 알리는 ? 을 붙인다 visitor?ownerPk=...
    if (targetOwnerPk) {
        fetchUrl += (fetchUrl.includes('?') ? '&' : '?') + 'ownerPk=' + targetOwnerPk; }
    // 조립된 주소로 서버에 GET요청을 보낸다
    fetch(fetchUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP 오류: ${response.status}`); }
            // 여기서는 서버에서 렌더링된 HTML마크업 전체를 가져오기 위해 response.text를 사용
            // 문자열 형태의 HTML 태그 덩어리를 다음체인(.then)으로 넘긴다
            return response.text(); })
        // 서버에서 받아온 HTML 문자열을 화면의 특정 구역
        .then((htmlData) => {
            // notebook-content 내부에 통째로 덮어 씌운다. 이 순간 브라우저는 텍스트를 실제 DOM 요소로 변환하여 화면에 그린다
            document.getElementById("notebook-content").innerHTML = htmlData;
            // 새로운 페이지가 로드되었으니 is-visitor 클래스를 제거하여 초기화 한다
            const notebook = document.getElementById("notebook");
            if (notebook) notebook.classList.remove("is-visitor");
            // for...in반복문을 사용해 외부에 정의된 pageRoutes객체의 키(path)들을 순회한다
            for (const path in pageRoutes) {
                if (url.includes(path)) {
                    //요청한 url안에 특정경로가 포함되어 있다면 해당 페이지 전용 css클래스(route.cssClass)를 부여하고
                    const route = pageRoutes[path];
                    if (route.cssClass && notebook) notebook.classList.add(route.cssClass);
                    // 초기화가 필요한 함수 route.initFunc를 실행한다 ,매칭되는 경로를 찾았다면 break로 반복문을 탈출
                    if (route.initFunc) route.initFunc();
                    break; } } })
        // 400/500번대 HTTP에러가 발생했을 때(4번의 throw new Error가 실행되었을 때)에러 메시지를 포함한 대체화면
        .catch(error => {
            console.error("페이지 로드 실패:", error);
        // (Fallback UI)을 직접 구성하여 (notebook-content)영역에 주입한다 사용자 경험(UX)을 유지하기 위한 조치.
            document.getElementById('notebook-content').innerHTML = `
                <div class="nb-error">
                    😢 페이지를 불러올 수 없어요<br>
                    <button onclick="loadPage('${url}')">다시 시도</button>
                </div>`;
        });
}