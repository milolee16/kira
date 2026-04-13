document.addEventListener("DOMContentLoaded", function () {
    const goMyHome = document.getElementById("goMyHome");

    if (goMyHome) {
        goMyHome.addEventListener("click", function () {

            // 1. 타인 홈 상태 제거 (세션 초기화)
            sessionStorage.removeItem("currentHostId");
            sessionStorage.removeItem("currentHostNick");

            // 2. 내 홈 화면으로 강제 이동
            loadPage("/home?ajax=true");

            // 3. 내 홈피 데이터 서버에서 새로 가져오기 (가장 중요한 부분)
            // loginUserId가 전역 변수로 선언되어 있다고 가정한다.
            const myId = typeof loginUserId !== 'undefined' ? loginUserId : "";

            // myId가 없으면 백엔드에서 세션 기준으로 처리하도록 유도
            const searchUrl = myId ? `/search-main?host_id=${myId}` : `/search-main`;

            fetch(searchUrl)
                .then((response) => {
                    if (!response.ok) throw new Error("내 홈피 데이터 로드 실패");
                    return response.json();
                })
                .then((searchData) => {
                    // [메뉴 및 탭 활성화 불빛 초기화]
                    document.querySelectorAll(".menu-item, .nb-tab").forEach((el) => el.classList.remove("active"));
                    document.querySelectorAll(".menu-item, .nb-tab").forEach((el) => {
                        const src = el.getAttribute("data-src");
                        if (src && src.includes("home")) {
                            el.classList.add("active");
                        }
                    });

                    // [닉네임 업데이트] 서버 데이터를 우선하고, 실패 시 전역 변수 사용
                    const profileName = document.querySelector(".profile-name") || document.getElementById("profile-name");
                    if (profileName) {
                        profileName.innerText = searchData.hompy_nick || (typeof loginUserNickname !== 'undefined' ? loginUserNickname : "나");
                    }

                    // [미니홈피 제목 업데이트]
                    const titleElement = document.querySelector("#host-title");
                    if (titleElement) {
                        titleElement.innerText = searchData.hompy_title || `📖 ${profileName.innerText}님의 미니홈피`;
                    }

                    // [프로필 사진 업데이트]
                    const profilePhoto = document.getElementById("profile-photo");
                    if (profilePhoto) {
                        profilePhoto.innerHTML = searchData.profileImgUrl
                            ? `<img src="${searchData.profileImgUrl}" alt="프로필 사진" style="width:100%; height:100%; object-fit:cover; border-radius:5px;">`
                            : `🌬️`; // 이미지가 없을 때의 기본 처리
                    }

                    // [상태 메시지 및 기타 데이터 업데이트]
                    const stElement = document.querySelector("#status-text");
                    if (stElement) {
                        stElement.innerHTML = searchData.st_message || "반갑습니다. 😊";
                    }

                    const stDate = document.querySelector(".status-since");
                    if (stDate && searchData.st_date) {
                        stDate.innerHTML = `Since ${searchData.st_date.substring(0, 4)}`;
                    }

                    const latestGbElement = document.querySelector(".gb-title + .update-text");
                    if (latestGbElement && searchData.latest_gb_content) {
                        latestGbElement.innerText = searchData.latest_gb_content;
                    }

                    // [부가 기능 로드] 내 홈이므로 최근 방문자만 로드 (친구 상태 확인 불필요)
                    if (typeof loadRecentVisitors === "function") loadRecentVisitors();
                })
                .catch((error) => console.error("내 데이터 갱신 중 오류 발생:", error));
        });
    }
});
