// player.js — index.jsp에서만 로드

// let playlist = [];
// let currentIndex = 0;
// let ytPlayer = null;
// let fetchDone = false;
// let apiReady = false;
// let playerReady = false;

window.playlist = [];
window.currentIndex = 0;
window.ytPlayer = null;
window.fetchDone = false;
window.apiReady = false;
window.playerReady = false;
window.isDefaultPlaylist = true;

const dummyPlaylist = [
    {
        title: "BIGBANG - 하루하루(HARU HARU)",
        youtubeId: "8OAQ6RuYFGE",
        duration: 323,
        trackOrder: 1
    },
    {
        title: "미안해서 미안해 (Feat.G.NA) - 김진표",
        youtubeId: "8Aug4u0dhIU",
        duration: 220,
        trackOrder: 2,
    },
    {
        title: "프리스타일 - Y",
        youtubeId: "WxUwgAli2Ec",
        duration: 280,
        trackOrder: 3,
    },
    {
        title: "프라이머리 - 입장정리 (Feat. 최자, Simon D)",
        youtubeId: "aMbIW_Z3P2g",
        duration: 297,
        trackOrder: 4,
    },
    {
        title: "BIGBANG - 거짓말(LIE)",
        youtubeId: "NeDeZUqNiVo",
        duration: 294,
        trackOrder: 5,
    },
];

window.defaultPlaylist = dummyPlaylist.map((track) => ({...track}));

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ":" + String(s).padStart(2, "0");
}

function saveCurrentIndex() {
    localStorage.setItem("bgmCurrentIndex", String(currentIndex));
}

function restoreCurrentIndex(playlistLength) {
    const saved = parseInt(localStorage.getItem("bgmCurrentIndex") || "0", 10);
    return Math.min(saved, playlistLength - 1);
}

// ── index.jsp 미니플레이어 UI 갱신 ──────────────────────────────
function updateIndexNowPlaying() {
    if (!playlist.length) return;
    const track = playlist[currentIndex];

    const phoneThumb = document.getElementById("phone-thumb");
    const phoneThumbBlur = document.getElementById("phone-thumb-blur"); // ✅ 추가: 배경 블러 요소 참조

    const thumbUrl =
        "https://img.youtube.com/vi/" + track.youtubeId + "/mqdefault.jpg";

    const ytLink = document.getElementById("yt-link");
    const bgmTitleMp3 = document.getElementById("bgm-title-mp3");
    // const bgmTitlePhone = document.getElementById("bgm-title-phone");

    // ✅ 썸네일 업데이트 (메인과 배경 둘 다)
    if (phoneThumb) phoneThumb.src = thumbUrl;
    if (phoneThumbBlur) phoneThumbBlur.src = thumbUrl; // ✅ 추가: 배경 이미지도 같은 주소로 설정

    if (ytLink)
        ytLink.href = "https://www.youtube.com/watch?v=" + track.youtubeId;
    if (bgmTitleMp3) bgmTitleMp3.textContent = "♪ " + track.title;
    // if (bgmTitlePhone) bgmTitlePhone.textContent = "♪ " + track.title;

    const cur =
        ytPlayer && typeof ytPlayer.getCurrentTime === "function"
            ? Math.floor(ytPlayer.getCurrentTime())
            : 0;

    const durationEl = document.getElementById("bgm-duration");
    const currentEl = document.getElementById("bgm-current");
    const progressBar = document.getElementById("bgm-progress-bar");

    if (durationEl) durationEl.textContent = formatTime(track.duration);
    if (currentEl) currentEl.textContent = formatTime(cur);
    if (progressBar)
        progressBar.style.width = Math.min((cur / track.duration) * 100, 100) + "%";
}

// (AJAX 방식) — 같은 window에 있으므로 직접 호출
function notifyBgmFrame() {
    if (typeof window.onTrackChanged === "function") {
        window.onTrackChanged(currentIndex);
    }
}

// ── 재생 제어 (bgm.js에서도 window.playTrack으로 호출) ───────────
function playTrack(index) {
    if (!playerReady) return;
    currentIndex = index;
    localStorage.setItem("bgmCurrentIndex", currentIndex); // 🚩 저장
    ytPlayer.loadVideoById(playlist[currentIndex].youtubeId);
    updateIndexNowPlaying();
    notifyBgmFrame();
    saveCurrentIndex();
}

function playNext() {
    if (!playerReady) return;
    currentIndex = (currentIndex + 1) % playlist.length;
    localStorage.setItem("bgmCurrentIndex", currentIndex); // 🚩 저장
    ytPlayer.loadVideoById(playlist[currentIndex].youtubeId);
    updateIndexNowPlaying();
    notifyBgmFrame();
    saveCurrentIndex();
}

function playPrev() {
    if (!playerReady) return;
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    localStorage.setItem("bgmCurrentIndex", currentIndex); // 🚩 저장
    ytPlayer.loadVideoById(playlist[currentIndex].youtubeId);
    updateIndexNowPlaying();
    notifyBgmFrame();
    saveCurrentIndex();
}

function togglePlay() {
    if (
        !playerReady ||
        !ytPlayer ||
        typeof ytPlayer.getPlayerState !== "function"
    )
        return; // ✅ 핵심 수정
    ytPlayer.getPlayerState() === YT.PlayerState.PLAYING
        ? ytPlayer.pauseVideo()
        : ytPlayer.playVideo();
}

// ── 플레이어 초기화 (한 번만) ───────────────────────────────────
function initPlayer() {
    if (!playlist.length || !apiReady) return;
// 🚩 [추가] 새로고침 시 저장된 마지막 순번(Index)을 읽어옴
    const savedIndex = parseInt(localStorage.getItem("bgmCurrentIndex") || "0", 10);
    // 목록이 변경되었을 경우를 대비해 범위 체크 후 설정
    window.currentIndex = (savedIndex < window.playlist.length) ? savedIndex : 0;
    // ✅ 이전 플레이어 잔재 제거
    const holder = document.getElementById("yt-player-hidden");
    if (holder) holder.innerHTML = "";
    ytPlayer = null;
    playerReady = false;

    ytPlayer = new YT.Player("yt-player-hidden", {
        width: "0",
        height: "0",
        videoId: playlist[currentIndex].youtubeId,
        playerVars: {autoplay: 1, controls: 0, rel: 0, playsinline: 1},
        events: {
            onReady: (event) => {
                playerReady = true;

                // ✅ 실제 재생 시간 보정 로직
                // 유튜브 API에서 실제 길이(초) 가져오기
                const realDuration = Math.floor(event.target.getDuration());
                const currentTrack = window.playlist[window.currentIndex];

                // 기존 시간과 실제 시간이 1초 이상 차이 나면 보정 작업 시작
                if (
                    currentTrack &&
                    Math.abs(currentTrack.duration - realDuration) > 1
                ) {
                    console.log(
                        `[시간 보정] ${currentTrack.title}: ${realDuration}초로 수정 중...`,
                    );

                    // 1. 메모리(현재 변수)를 즉시 수정
                    currentTrack.duration = realDuration;

                    // 2. 서버 DB 업데이트 (PUT 요청)
                    const params = new URLSearchParams();
                    params.append("youtubeId", currentTrack.youtubeId);
                    params.append("duration", realDuration);

                    fetch("/api/bgm?" + params.toString(), {
                        method: "PUT",
                    })
                        .then((res) => res.json())
                        .then((json) => {
                            if (json.result === "ok") {
                                console.log("DB 업데이트 완료");
                                // ✅ 3. 핵심: DB 저장이 끝났으니 화면 리스트를 다시 그려줌
                                // 이 함수가 실행되면서 화면의 숫자가 즉시 바뀝니다.
                                if (typeof renderQueue === "function") {
                                    renderQueue();
                                }
                            }
                        })
                        .catch((err) => console.error("업데이트 실패:", err));
                }

                event.target.playVideo();
                updateIndexNowPlaying();
                setInterval(updateIndexNowPlaying, 1000);
                notifyBgmFrame();
            },
            onStateChange: (e) => {
                // 1. 영상이 끝났을 때 시간 보정 및 다음 곡 재생
                if (e.data === YT.PlayerState.ENDED) {
                    const realDuration = Math.floor(e.target.getDuration());
                    const currentTrack = window.playlist[window.currentIndex];

                    // 마지막으로 실제 시간 확인 후 다르면 업데이트
                    if (
                        currentTrack &&
                        realDuration > 0 &&
                        Math.abs(currentTrack.duration - realDuration) > 1
                    ) {
                        currentTrack.duration = realDuration; // 메모리 갱신

                        // DB 업데이트 (PUT)
                        const params = new URLSearchParams();
                        params.append("youtubeId", currentTrack.youtubeId);
                        params.append("duration", realDuration);

                        fetch("/api/bgm?" + params.toString(), {method: "PUT"}).then(
                            () => {
                                // 화면 갱신 후 다음 곡으로
                                if (typeof renderQueue === "function") renderQueue();
                                playNext();
                            },
                        );
                    } else {
                        // 보정할 필요 없으면 바로 다음 곡
                        playNext();
                    }
                }

                // 🚩 [추가] 재생이 시작될 때 현재 순번을 다시 한번 저장 (확실한 동기화)
                if (e.data === YT.PlayerState.PLAYING) {
                    localStorage.setItem("bgmCurrentIndex", window.currentIndex);
                }

                // 2. 버튼 텍스트 변경 로직
                const btn = document.getElementById("bgm-toggle");
                if (btn)
                    btn.textContent = e.data === YT.PlayerState.PLAYING ? "⏸" : "▶";

                notifyBgmFrame();
            },
        },
    });
}

// ── 플레이리스트 로드 ─────────────────────────────────────────
function loadPlaylist(targetPk) {
    const myPk = String(window.loginUserPk || loginUserPk || '');
    const isActuallyMe = (!targetPk || String(targetPk) === myPk);
    // ✅ 1. 현재 재생 중인 대상(PK)이 바뀐 건지 확인
    // 기존에 window.currentPlayingPk 같은 변수가 없다면 새로 정의해서 비교합니다.
    const currentPk = isActuallyMe ? 'MY' : targetPk;
    const isSameTarget = (window.lastLoadedPk === currentPk);

    window.isMyPlaylist = isActuallyMe;
    window.lastLoadedPk = currentPk; // 현재 로드한 대상 저장

    const url = isActuallyMe
        ? '/api/bgm'
        : `/api/visitor/bgm?ownerPk=${targetPk}`;

    fetch(url)
        .then(r => r.json())
        .then(tracks => {
            if (!tracks || tracks.length === 0) {
                window.playlist = dummyPlaylist;
                window.isDefaultPlaylist = true;
                window.currentHostNickname = null;
            } else {
                window.playlist = tracks;
                window.isDefaultPlaylist = false;
                window.currentHostNickname = tracks[0].userNickname;
            }

            window.fetchDone = true;

            // ✅ 2. UI는 매번 그리되, 재생 위치는 유지
            if (typeof renderQueue === 'function') renderQueue();

            // ✅ 3. 핵심 수정: 동일한 사람의 목록을 다시 여는 거라면 재생 명령을 내리지 않음
            if (isSameTarget) {
                console.log("이미 같은 목록 재생 중 - 상태 유지");
                return;
            }

            // 새로운 목록일 때만 처음부터 재생
            window.currentIndex = 0;
            if (window.ytPlayer && window.playerReady) {
                window.ytPlayer.loadVideoById(window.playlist[0].youtubeId);
            } else if (window.apiReady) {
                initPlayer();
            }
        });
}

// ── YouTube API 준비 콜백 ─────────────────────────────────────
window.onYouTubeIframeAPIReady = function () {
    apiReady = true;
    if (fetchDone) initPlayer();
};

// ✅ API가 이미 로드된 상태면 직접 호출
if (window.YT && window.YT.Player) {
    window.onYouTubeIframeAPIReady();
}

// ── 페이지 이탈 직전 현재 곡/재생 위치 저장 ──────────────────────
window.addEventListener("pageshow", function (event) {
    // Safari/Chrome back-forward cache or any navigation that restores page
    if (event.persisted || window.performance.navigation.type === 2) {
        console.log("Page restored from cache - reinitializing YouTube player");
        
        // Reset player state
        playerReady = false;
        
        // Clear existing player instance
        if (ytPlayer) {
            try {
                ytPlayer.destroy();
            } catch (e) {
                console.log("Player destroy failed:", e);
            }
            ytPlayer = null;
        }
        
        // Clear player container
        const holder = document.getElementById("yt-player-hidden");
        if (holder) {
            holder.innerHTML = "";
        }
        
        // Reinitialize after a short delay to ensure DOM is ready
        setTimeout(() => {
            if (fetchDone && apiReady) {
                initPlayer();
            }
        }, 100);
    }
});

// playTrack(0) 호출 금지 — initPlayer → onReady에서 자동 시작
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        loadPlaylist(window.loginUserPk || "");

        // ✅ 이전/다음 버튼 연결
        const prevBtn = document.getElementById("bgm-prev");
        const nextBtn = document.getElementById("bgm-next");

        if (prevBtn) prevBtn.addEventListener("click", playPrev);
        if (nextBtn) nextBtn.addEventListener("click", playNext);
    });
} else {
    loadPlaylist(loginUserPk || "");

    // ✅ 이전/다음 버튼 연결
    const prevBtn = document.getElementById("bgm-prev");
    const nextBtn = document.getElementById("bgm-next");

    if (prevBtn) prevBtn.addEventListener("click", playPrev);
    if (nextBtn) nextBtn.addEventListener("click", playNext);
}
