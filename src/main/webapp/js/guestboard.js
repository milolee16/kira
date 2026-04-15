// 방명록 데이터 불러오기 함수
function loadGuestBoard(date = "") {
    //sessionStorage에 있는 현재 방문한 홈페이지의 주인 id를 currentHostId 로 저장해놨던 것을 가져옴
    let currentHostId = sessionStorage.getItem("currentHostId") ;
    //만약 currentHostId가 없는 값이라면 그 홈페이지는 자기 자신의 페이지이므로 세션에 있는 loginUserId의 값을 사용
    if(currentHostId == null || currentHostId === "null") {
        currentHostId = loginUserId;
    }
    //fetch로 요청할 url을 정해주어야 하는데 만약 date의 값이 있다면 date값을 파라미터로 넘겨주고, 아니면 host_id만 파라미터로 넘겨주는 url 작성
    const gbUrl = date ? `/board?date=${date}&host_id=${currentHostId}` : `/board?host_id=${currentHostId}`;

    //fetch로 전에 정의한 gbUrl 에로의 요청
    fetch(gbUrl)
        // fetch 응답(Response) 객체에서 HTTP 본문(body)을 꺼내어 JSON 객체로 파싱(Parsing)
        .then(response => response.json())
        //json으로 파싱한 객체의 이름을 showGB로 사용하겠다는 의미
        .then(showGB => {
            // 상단 날짜 업데이트
            //calendear-trigger이라는 아이디 값을 가진 div를 찾아 그 안에 텍스트를 showGB가 가지고 있는 selectedDate로 채워주겠다는 의미
            document.getElementById('calendar-trigger').innerText = showGB.selectedDate;

            // 게시글 영역 비우기
            //gbPostText를 gbContent라는 상수로 정의 해주고 그 안의 HTML을 ''로 비워주는 역할을 하는 코드
            const gbContent = document.getElementById('gbPostText');
            gbContent.innerHTML = '';

            // 받아온 리스트를 화면에 그리기
            //showGB객체에서 guestBoards라는 것을 꺼내고 거기서 또 꺼낸 것을 gb라는 이름으로 사용
            showGB.guestBoards.forEach(gb => {
                // 1. 권한 체크 (내 아이디 vs 글쓴이 아이디 / 내 아이디 vs 홈피 주인 아이디)
                // loginUserId는 index.jsp 맨 아래에 선언해둔 전역 변수를 그대로 씁니다.sessionScope.loginUserId

                const isMyPost = (loginUserId === gb.guest_id); // 내가 방문자인가?
                const isMyHompy = (loginUserId === gb.host_id); // 내가 홈피의 주인인가?

                // 2. 버튼 HTML을 담을 빈 바구니 준비
                let editBtnHtml = '';
                let delBtnHtml = '';

                // 3. 조건에 맞춰 버튼 HTML 채워넣기

                // [수정 버튼] ➡️ 오직 '글쓴이(나)'만 가능
                if (isMyPost) {
                    editBtnHtml = `<a href="javascript:void(0);" onclick="gbEditMode('${gb.gboard_pk}', '${gb.board_content}','${showGB.selectedDate}')" class="gbUp">📝</a>`;
                }

                // [삭제 버튼] ➡️ '글쓴이(나)' 이거나 '홈피 주인(나)'일 때 가능
                if (isMyPost || isMyHompy) {
                    delBtnHtml = `<a href="javascript:void(0);" onclick="gbDelete('${gb.gboard_pk}','${showGB.selectedDate}')" class="gbDel">🗑️</a>`;
                }

                // 4.닉네임, 문장, 버튼, 날짜 html을  htmlTemplate라는 상수에 넣어서 gbContent에 추가해준다 .
                const htmlTemplate = `
          <div class="gb-content-row">
           <span class="gb-text-part">
               <a href="javascript:void(0);" onclick="goSearchMain('${gb.guest_id}', '${gb.guest_nick}')" class="gb-user-link" >${gb.guest_nick}</a> : <span id="guestHi_${gb.gboard_pk}"> ${gb.board_content}</span>
           </span>
               ${editBtnHtml}
               ${delBtnHtml}
          </div>
          <div class="gb-created-at">
                ${gb.created_at}
          </div>
   `;
                gbContent.insertAdjacentHTML('beforeend', htmlTemplate);
            })

            //달력세팅해주는 함수. selectedDate로 기본으로 뜨는 날이 선택된 날이 되도록 해줌
            initFlatpickr(showGB.selectedDate);
        })
        .catch(error => console.error("데이터 가져오기 실패:", error));
}

// 달력 세팅 flatpicker 라는 library를 활용해 달력을 그려줌
function initFlatpickr(defaultDate) {
    flatpickr('#datePicker', {
        locale: "ko",
        dateFormat: "Y-m-d",
        defaultDate: defaultDate || "today",
        onChange: function (selectedDates, dateStr) {
            loadGuestBoard(dateStr);
        }
    });
    //'calendar-trigger 라는 이름의 아이디를 가진 div를 정의해주고 그게 클릭되었을 때 달력이 열리는 함수를 실행해줌
    const trigger = document.getElementById('calendar-trigger');
    trigger.onclick = function () {
        document.getElementById('datePicker')._flatpickr.open();
    };
}

//제출이라는 이벤트가 일어났을때 함수 e를 실행하겠다는 의미
document.addEventListener("submit", function (e) {
    // 폼이 제출되었을 때, 그 폼의 클래스가 'gb-write-form'이 맞는지 확인합니다.
    //다른 페이지에서 무언가 제출이 일어났을 때 이 함수 사용을 막기위한 장치!
    if (e.target && e.target.classList.contains("gb-write-form")) {

        console.log("1. submit 이벤트 감지됨!", e.target);
        //e.preventDefault();를 한마디로 요약하면 **"웹 브라우저야, 네가 원래 하던 기본 행동(Default)을 하지 말고 멈춰!(Prevent)"**라는 뜻
        //브라우저의 기본 고집: "폼 안에서 [엔터]를 치거나 submit 버튼을 누르면, 무조건 화면을 새로고침하면서 서버로 데이터를 날림
        // e.preventDefault(); 사용 시: 화면 새로고침이 멈춤 , 화면 이동 없이 뒤에서 조용히 자바스크립트(fetch, AJAX)만 써서 데이터를 서버로 보낼 수 있게 됨
        e.preventDefault();
        console.log("2. 방명록 폼 확인 완료! 새로고침 차단함.");

        // 주의: document.querySelector 대신 e.target(현재 폼) 안에서 찾습니다!
        //전체를 뒤지기 보다는 내가 타겟한 페이지 안에서 찾겠다는 뜻  !
        const inputHi = e.target.querySelector(".gb-write-input");
        const contentHi = inputHi.value;

        console.log("3. 입력된 글자:", contentHi);
        //trim()은 문자열의 양쪽 끝에 있는 쓸데없는 공백(스페이스바 띄어쓰기, 탭, 줄바꿈 등)을 싹 잘라내 주는(다듬어 주는) 역할
        if (contentHi.trim() == "") {
            alert("인사말을 남겨주세요!");
            return;
        }
        console.log("4. 서버로 fetch 요청 출발합니다!");
        //currentHostId가 sessionStorage에 없으면 loginUserId가 자동으로 불러와져서 상수에 들어감
        let currentHostId = sessionStorage.getItem("currentHostId") || loginUserId;
        //fetch 요청 post로 요청하고 host_id로 파라미터 붙여줌
        fetch(`/board?host_id=${currentHostId}`, {
            method: 'POST',
            headers: {
                //서버(백엔드)에게 "내가 지금 보내는 데이터가 어떤 형태(Type)인지" 미리 알려주는 안내문
                //서버야, 내가 지금 보내는 데이터는 옛날부터 쓰던 HTML <form> 태그가 데이터를 전송하는 방식이랑 똑같은 형태야!" 라는 뜻입니다.
                // 이 방식을 쓰면 데이터가 이름=홍길동&나이=20 처럼 키=값 형태로 변환되어 날아갑니다.
                // 왜 이걸 쓸까요? 백엔드(JSP/Spring)에서 익숙하게 쓰던 request.getParameter("content")로 값을 아주 쉽게 꺼내 쓸 수 있기 때문입니다.
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            //자바스크립트는 데이터를 다룰 때 { content: "안녕하세요" } 같은 '객체(Object)' 형태를 좋아합니다.
            // 하지만 위에서 우리가 소포 라벨(Header)에 **"HTML 폼 형식(키=값)으로 보낼게!"**라고 적어놨죠?
            // 그래서 자바스크립트 객체를 그 규칙에 맞게 텍스트로 **'번역(포장)'**해 주는 녀석이 바로 URLSearchParams입니다.
            // 즉, 저 코드는 { content: "안녕하세요" }라는 예쁜 객체를 content=%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94 같은 인터넷 표준 암호화 텍스트로 변환해서 상자에 넣어줍니다.
            body: new URLSearchParams({
                content: contentHi
            })
        })
            .then(response => response.json())
            .then(hi => {
                console.log("5. 서버통신 완료!", hi);
                //받은 값의 결과가 success라면 inputHi의 값을 초기화시켜주고 방명록을 다시 불러와줌
                if (hi.result == "success") {
                    inputHi.value = "";
                    loadGuestBoard();
                } else {
                    alert("방명록 등록에 실패했습니다.");
                }
            })
            .catch(error => console.error("통신 에러:", error));
    }
});

//방명록 수정 기능 함수
function gbEditMode(pk, content, date) {
    //수정버튼을 누르면 그 방명록 div의 아이디값을 가져와 updateGB라는 상수로 정의하고 안에 html을 바꿔끼워준다
    const updateGB = document.getElementById(`guestHi_${pk}`);

    updateGB.innerHTML = `
        <input type="text" id="gb_edit_${pk}" value="${content}" class="gb_edit">
        <a href="javascript:void(0);" onclick="updateGuestBoard('${pk}','${date}')" style="font-size:12px; margin-left:5px; color:#a29bfe;">[확인]</a>
        <a href="javascript:void(0);" onclick="loadGuestBoard('${date}')" style="font-size:12px; margin-left:5px; color:#ff7675;">[취소]</a>
        `;

    document.getElementById(`gb_edit_${pk}`).focus();
}
//db에 update 요청을 보내기 위해 fetch로 요청하는 함수
function updateGuestBoard(pk, date) {
    const newGB = document.getElementById(`gb_edit_${pk}`).value;

    if (newGB.trim() === "") {
        alert("수정할 내용을 입력해주세요!");
        return;
    }

    fetch('/updateGB', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            pk: pk,
            content: newGB
        })
    })
        .then(response => response.json())
        .then(upGB => {
            if (upGB.result == "success") {
                loadGuestBoard(date);
            } else {
                alert("방명록 수정에 실패했습니다.");
            }
        })
        .catch(error => console.error("수정 통신 에러:", error));
}
//방명록 삭제 함수
function gbDelete(pk, date) {
    fetch('/delGB', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            pk: pk

        })
    })
        .then(response => response.json())
        .then(delGB => {
            if (delGB.result == "success") {
                loadGuestBoard(date);
            } else {
                alert("방명록 삭제에 실패했습니다.");
            }
        })
        .catch(error => console.error("수정 통신 에러:", error));


}


