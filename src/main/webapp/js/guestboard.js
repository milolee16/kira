// 방명록 데이터 불러오기 함수
function loadGuestBoard(date = "") {

    let currentHostId = sessionStorage.getItem("currentHostId") ;
    if(currentHostId == null || currentHostId === "null") {
        currentHostId = loginUserId;
    }

    const gbUrl = date ? `/board?date=${date}&host_id=${currentHostId}` : `/board?host_id=${currentHostId}`;


    fetch(gbUrl)
        .then(response => response.json())
        .then(showGB => {
            // 상단 날짜 업데이트
            document.getElementById('calendar-trigger').innerText = showGB.selectedDate;

            // 게시글 영역 비우기
            const gbContent = document.getElementById('gbPostText');
            gbContent.innerHTML = '';

            // 받아온 리스트를 화면에 그리기
            showGB.guestBoards.forEach(gb => {
                // 1. 권한 체크 (내 아이디 vs 글쓴이 아이디 / 내 아이디 vs 홈피 주인 아이디)
                // loginUserId는 index.jsp 맨 아래에 선언해둔 전역 변수를 그대로 씁니다.sessionScope.loginUserId

                const isMyPost = (loginUserId === gb.guest_pk); // 이 글을 내가 썼는가?
                const isMyHompy = (loginUserId === gb.host_id); // 이 홈피가 내 홈피인가?

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

                // 4. 완성된 버튼 변수를 템플릿에 쏙 끼워넣기
                const htmlTemplate = `
          <div class="gb-content-row">
           <span class="gb-text-part">
               <a href="javascript:void(0);" onclick="goSearchMain('${gb.guest_pk}', '${gb.guest_nick}')" class="gb-user-link" >${gb.guest_nick}</a> : <span id="guestHi_${gb.gboard_pk}"> ${gb.board_content}</span>
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

            // 달력 기능 다시 씌워주기
            initFlatpickr(showGB.selectedDate);
        })
        .catch(error => console.error("데이터 가져오기 실패:", error));
}

// 달력 세팅
function initFlatpickr(defaultDate) {
    flatpickr('#datePicker', {
        locale: "ko",
        dateFormat: "Y-m-d",
        defaultDate: defaultDate || "today",
        onChange: function (selectedDates, dateStr) {
            loadGuestBoard(dateStr);
        }
    });

    const trigger = document.getElementById('calendar-trigger');
    trigger.onclick = function () {
        document.getElementById('datePicker')._flatpickr.open();
    };
}


document.addEventListener("submit", function (e) {
    // 폼이 제출되었을 때, 그 폼의 클래스가 'gb-write-form'이 맞는지 확인합니다.
    //다른 페이지에서 무언가 제출이 일어났을 때 이 함수 사용을 막기위한 장치!
    if (e.target && e.target.classList.contains("gb-write-form")) {

        console.log("1. submit 이벤트 감지됨!", e.target);
        e.preventDefault();
        console.log("2. 방명록 폼 확인 완료! 새로고침 차단함.");

        // 주의: document.querySelector 대신 e.target(현재 폼) 안에서 찾습니다!
        //전체를 뒤지기 보다는 내가 타겟한 페이지 안에서 찾겠다는 뜻  !
        const inputHi = e.target.querySelector(".gb-write-input");
        const contentHi = inputHi.value;

        console.log("3. 입력된 글자:", contentHi);
        if (contentHi.trim() == "") {
            alert("인사말을 남겨주세요!");
            return;
        }
        console.log("4. 서버로 fetch 요청 출발합니다!");

        let currentHostId = sessionStorage.getItem("currentHostId") || loginUserId;
        fetch(`/board?host_id=${currentHostId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                content: contentHi
            })
        })
            .then(response => response.json())
            .then(hi => {
                console.log("5. 서버통신 완료!", hi);

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
//method: 'POST' : 편지가 아니라 택배(데이터 전송)라는 뜻입니다.
//
// headers: { 'Content-Type': ... } : 택배 상자 안에 든 물건의 종류입니다. 여기서는 전통적인 HTML Form 데이터 형식(application/x-www-form-urlencoded)으로 보낸다고 명시했습니다. 이렇게 해야 자바 백엔드에서 평소처럼 request.getParameter("content")로 쉽게 꺼낼 수 있습니다.
//
// body : 실제 택배 내용물입니다. new URLSearchParams()를 쓰면 자바스크립트가 알아서 데이터를 content=안녕 같은 형태로 예쁘게 포장해 줍니다.
//
// .then() : 서버에서 작업이 다 끝나고 대답(response)이 돌아왔을 때 실행할 행동입니다. 여기서 새로고침 대신 loadGuestBoard()를 호출해서 새 글이 뿅! 하고 나타나게 만드는 것이 비동기의 묘미입니다.

function gbEditMode(pk, content, date) {
    const updateGB = document.getElementById(`guestHi_${pk}`);

    updateGB.innerHTML = `
        <input type="text" id="gb_edit_${pk}" value="${content}" class="gb_edit">
        <a href="javascript:void(0);" onclick="updateGuestBoard('${pk}','${date}')" style="font-size:12px; margin-left:5px; color:#a29bfe;">[확인]</a>
        <a href="javascript:void(0);" onclick="loadGuestBoard('${date}')" style="font-size:12px; margin-left:5px; color:#ff7675;">[취소]</a>
        `;

    document.getElementById(`gb_edit_${pk}`).focus();
}

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


