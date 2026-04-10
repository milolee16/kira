let photoData = [];

// =============================================
// 메인 로드
// =============================================
function loadPhoto() {
    const container = document.getElementById('notebook-content');
    container.style.overflowY = 'auto';
    container.style.height = '100%';
    container.innerHTML = '<div style="text-align:center; padding:20px;">사진첩을 열고 있어요... 📸</div>';
    const hostId = sessionStorage.getItem("currentHostId") || loginUserId; // 없으면 내 id


    fetch(`/photo-data?host_id=${encodeURIComponent(hostId)}`)
        .then(res => res.json())
        .then(data => {
            photoData = data;
            renderFeedView(hostId);
        })
        .catch(err => {
            container.innerHTML = '<div style="text-align:center; padding:20px; color:red;">사진첩 로딩 실패 ㅠㅠ</div>';
            console.error(err);
        });
}

// =============================================
// 피드 뷰
// =============================================
function renderFeedView(hostId) {
    const container = document.getElementById('notebook-content');
    const loginId = loginUserId;
    const isOwner = (hostId === loginId); // 내 홈피인지 여부

    let html = `
        <div style="
            position:sticky; top:-15px; z-index:10;
            background:#fff; border-bottom:1px solid #eee;
            padding:12px 16px; display:flex; justify-content:space-between; align-items:center;
            box-shadow:0 2px 6px rgba(0,0,0,0.06);">
            <h2 style="margin:0; font-size:18px; color:#333; font-family:'Gaegu', cursive;">🖼️ My Photo Album</h2>
            <button onclick="openAddModal()" style="
                width:34px; height:34px; border-radius:50%;
                border:2px solid #bbb; background:#fff;
                font-size:20px; cursor:pointer; color:#666;
                display:${isOwner ? 'flex' : 'none'}; align-items:center; justify-content:center;
                box-shadow:2px 2px 6px rgba(0,0,0,0.1);"
                onmouseover="this.style.background='#f0f0f0'"
                onmouseout="this.style.background='#fff'">+</button>
        </div>

        <div style="font-family:'Gaegu', cursive; background:#f5f5f5; min-height:100%; padding-bottom:30px; padding-top:10px;">
            <div style="display:flex; flex-direction:column; gap:16px; padding:0 16px;">
    `;

    if (photoData.length === 0) {
        html += `<div style="text-align:center; color:#bbb; padding:40px;">아직 사진이 없어요. + 버튼으로 추가해보세요!</div>`;
    }

    photoData.forEach((item, index) => {
        html += buildFeedCard(item, index,isOwner);
    });

    html += `</div></div>`;
    html += buildAddModalHtml();

    container.innerHTML = html;
}

// =============================================
// 피드 카드 1장 빌더
// =============================================
function buildFeedCard(item, index,isOwner) {
    return `
    <div id="detail-card-${index}" style="
        background:#fff; border-radius:12px;
        border:0.5px solid #eee; overflow:hidden;
        display:flex; flex-direction:row;">

        <div style="width:260px; min-width:260px; height:200px; overflow:hidden;">
            <img id="detail-img-${index}"
                 src="${item.imgName}"
                 style="width:100%; height:100%; object-fit:cover; display:block;">
            <input type="file" id="img-input-${index}" accept="image/*"
                   style="display:none;" onchange="applyImgEdit(${index}, event)">
        </div>

        <div style="flex:1; padding:20px; display:flex; flex-direction:column;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                <div>
                    <div style="font-size:11px; color:#c0b0a0; margin-bottom:4px;">📅 ${item.regDate}</div>
                    <div id="title-view-${index}"
                         style="font-size:16px; font-weight:bold; color:#444;
                                border-left:3px solid #ffb3ba; padding-left:8px;">
                        ${item.title}
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:11px; color:#bbb; font-weight:bold;">👤 ${item.userId}</span>
                    <button onclick="deletePhoto(${index})" style="
                        display:${isOwner ? 'inline' : 'none'};
                        background:none; border:none; font-size:16px;
                        color:#ccc; cursor:pointer; line-height:1; padding:0;"
                        onmouseover="this.style.color='#e55'"
                        onmouseout="this.style.color='#ccc'">✕</button>
                </div>
            </div>

            <div id="content-view-${index}"
                 style="font-size:13px; 
                        color:#888; 
                        line-height:1.6;
                        border-top:1px dashed #eee; 
                        padding:12px 0; /* 상하 패딩 조절 */
                        margin-top:8px;
                        white-space:pre-wrap;
                        text-align:left; /* 왼쪽 정렬 명시 */
                        height:85px; /* 고정 높이를 주어야 스크롤 판단 기준이 생깁니다 */
                        overflow-y:auto; /* 내용이 넘칠 때만 스크롤 생성 */
                        scrollbar-width: thin; /* (선택) 스크롤바를 얇게 */
                        ">${item.content}</div>

            <div style="display:flex; align-items:center; gap:16px;
                        border-top:1px dashed #eee; padding-top:12px; margin-top:auto;">
                <button onclick="onLikeClick(${index})" style="
                    background:none; border:none; cursor:pointer;
                    display:flex; align-items:center; gap:5px;
                    color:#e88; font-size:13px; font-family:'Gaegu'; padding:0;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e88" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <span id="like-count-${index}">0</span>
                </button>
                <button onclick="onCommentClick(${index})" style="
                    background:none; border:none; cursor:pointer;
                    display:flex; align-items:center; gap:5px;
                    color:#aaa; font-size:13px; font-family:'Gaegu'; padding:0;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span id="comment-count-${index}">0</span>
                </button>
            </div>
        </div>
    </div>
    `;
}

// 좋아요 / 댓글 - 로직은 나중에
function onLikeClick(index) {}
function onCommentClick(index) {}

// =============================================
// 이미지 수정
// =============================================

function applyImgEdit(index, event) {
    const file = event.target.files[0];
    if (!file) return;
    const newUrl = URL.createObjectURL(file);
    photoData[index].imgUrl = newUrl;
    photoData[index].imgName = file.name;
    document.getElementById(`detail-img-${index}`).src = newUrl;
}

// =============================================
// 삭제
// =============================================
async function deletePhoto(index) {
    const imgName = photoData[index].imgName;
    if (!confirm('이 게시글을 삭제할까요?')) return;
    const del = await deleteSupabase(imgName);

    try {
        const response = await fetch(`/photo-data?imgName=${encodeURIComponent(imgName)}`, {
            method: 'DELETE'
        });
        console.log(response.ok);
        const text = await response.text();
        const row = parseInt(text);
        if (row > 0) {
            closeAddModal();
            alert('사진이 성공적으로 삭제되었습니다!');
            loadPhoto();
        } else {
            alert('DB 삭제에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('서버 통신 중 오류가 발생했습니다.');
    }
}

// =============================================
// 추가 모달
// =============================================
function buildAddModalHtml() {
    return `
    <div id="addModal" style="
        display:none; position:fixed; inset:0;
        background:rgba(0,0,0,0.45); z-index:1000;
        justify-content:center; align-items:center;">

        <div style="
            background:#fff; border-radius:14px; padding:28px;
            width:400px; max-width:90%;
            box-shadow:0 8px 30px rgba(0,0,0,0.18);
            font-family:'Gaegu', cursive;">

            <h3 style="margin:0 0 18px; font-size:18px;
                        border-bottom:2px dashed #ddd; padding-bottom:10px;">
                📷 새 사진 추가
            </h3>

            <div style="margin-bottom:14px;">
                <label style="font-size:14px; color:#555; display:block; margin-bottom:6px;">사진 선택</label>
                <input type="file" id="addImgFile" accept="image/*"
                       onchange="previewAddImage(event)" style="font-size:13px; width:100%;">
                <img id="addImgPreview" src="" alt="" style="
                    display:none; margin-top:10px; width:100%; max-height:160px;
                    object-fit:cover; border-radius:8px; border:1px solid #eee;">
            </div>

            <div style="margin-bottom:14px;">
                <label style="font-size:14px; color:#555; display:block; margin-bottom:6px;">제목</label>
                <input type="text" id="addTitle" placeholder="제목을 입력하세요" style="
                    width:100%; padding:8px 10px; font-size:14px; font-family:'Gaegu';
                    border:1px solid #ddd; border-radius:6px; box-sizing:border-box;">
            </div>

            <div style="margin-bottom:22px;">
                <label style="font-size:14px; color:#555; display:block; margin-bottom:6px;">내용</label>
                <textarea id="addContent" placeholder="내용을 입력하세요" rows="3" style="
                    width:100%; padding:8px 10px; font-size:14px; font-family:'Gaegu';
                    border:1px solid #ddd; border-radius:6px; resize:none; box-sizing:border-box;"></textarea>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:10px;">
                <button onclick="closeAddModal()" style="
                    padding:8px 18px; border:1px solid #ccc; border-radius:6px;
                    background:#f5f5f5; cursor:pointer; font-family:'Gaegu'; font-size:14px;">
                    취소
                </button>
                <button onclick="addPhoto()" style="
                    padding:8px 20px; border:none; border-radius:6px;
                    background:#555; color:#fff; cursor:pointer;
                    font-family:'Gaegu'; font-size:14px;">
                    추가하기
                </button>
            </div>
        </div>
    </div>`;
}

function openAddModal() {
    document.getElementById('addModal').style.display = 'flex';
}

function closeAddModal() {
    document.getElementById('addModal').style.display = 'none';
    document.getElementById('addTitle').value = '';
    document.getElementById('addContent').value = '';
    document.getElementById('addImgFile').value = '';
    document.getElementById('addImgPreview').style.display = 'none';
}

function previewAddImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    const preview = document.getElementById('addImgPreview');
    preview.src = URL.createObjectURL(file);
    preview.style.display = 'block';
}

async function addPhoto() {
    const title = document.getElementById('addTitle').value.trim();
    const content = document.getElementById('addContent').value.trim();
    if (!title || !content) {
        alert('제목과 내용을 모두 입력해주세요!');
        return;
    }
    const data = await uploadSupabase();
    if (!data || !data.url) return;

    const params = new URLSearchParams();
    params.append('title', title);
    params.append('content', content);
    params.append('imgName', data.url);

    try {
        const response = await fetch('/photo-data', {
            method: 'POST',
            body: params
        });
        console.log(response.ok);
        const text = await response.text();
        const row = parseInt(text);

        if (row > 0) {
            closeAddModal();
            alert('사진이 성공적으로 등록되었습니다!');
            loadPhoto();
        } else {
            alert('DB 저장에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('서버 통신 중 오류가 발생했습니다.');
    }
}

// =============================================
// Supabase 업로드 / 삭제
// =============================================
async function uploadSupabase() {
    const fileInput = document.getElementById('addImgFile');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/supabase', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            alert('클라우드 업로드에 실패했습니다.');
            return null;
        }

        const text = await response.text();
        const data = {url: text};
        return data;
    } catch (error) {
        console.error('Error:', error);
        alert('서버 통신 중 오류가 발생했습니다.');
        return null;
    }
}

async function deleteSupabase(imgName) {
    try {
        const response = await fetch(`/supabase?imgName=${encodeURIComponent(imgName)}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            alert('클라우드 삭제에 실패했습니다.');
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('서버 통신 중 오류가 발생했습니다.');
        return null;
    }
}