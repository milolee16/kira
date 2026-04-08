
let photoData = [];

// =============================================
// 메인 로드
// =============================================
function loadPhoto() {
    const container = document.getElementById('notebook-content');
    container.style.overflowY = 'auto';
    container.style.height = '100%';
    container.innerHTML = '<div style="text-align:center; padding:20px;">사진첩을 열고 있어요... 📸</div>';

    fetch('photo-data')
        .then(res => res.json())
        .then(data => {
            photoData = data;
            renderFeedView(); // 통합된 피드 뷰 호출
        })
        .catch(err => {
            container.innerHTML = '<div style="text-align:center; padding:20px; color:red;">사진첩 로딩 실패 ㅠㅠ</div>';
            console.error(err);
        });
}

// =============================================
// [뷰 통합] 인스타그램식 피드 뷰 (Sticky 버그 수정)
// =============================================
function renderFeedView() {
    const container = document.getElementById('notebook-content');

    let html = `
        <div style="
            position:sticky; top:-15px; z-index:10;
            /*margin : -20px -16px 0px -16px;*/
            background:#fff; border-bottom:1px solid #eee;
            padding:12px 16px; display:flex; justify-content:space-between; align-items:center;
            box-shadow:0 2px 6px rgba(0,0,0,0.06);">
            
            <h2 style="margin:0; font-size:18px; color:#333; font-family:'Gaegu', cursive;">🖼️ My Photo Album</h2>
            
            <button onclick="openAddModal()" style="
                width:34px; height:34px; border-radius:50%;
                border:2px solid #bbb; background:#fff;
                font-size:20px; cursor:pointer; color:#666;
                display:flex; align-items:center; justify-content:center;
                box-shadow:2px 2px 6px rgba(0,0,0,0.1);"
                onmouseover="this.style.background='#f0f0f0'"
                onmouseout="this.style.background='#fff'">+</button>
        </div>

        <div style="font-family:'Gaegu', cursive; background:#f5f5f5; min-height:100%; padding-bottom:30px; padding-top:10px;">
            <div style="display:flex; flex-direction:column; gap:0;">
    `;

    if (photoData.length === 0) {
        html += `<div style="text-align:center; color:#bbb; padding:40px;">아직 사진이 없어요. + 버튼으로 추가해보세요!</div>`;
    }

    // 데이터를 돌면서 카드 추가
    photoData.forEach((item, index) => {
        html += buildFeedCard(item, index);
    });

    html += `</div></div>`; // 리스트 및 배경 닫는 태그

    // 추가 모달 붙이기
    html += buildAddModalHtml();

    container.innerHTML = html;
}

// =============================================
// 피드 카드 1장 빌더 (호버 아이콘 제거)
// =============================================
function buildFeedCard(item, index) {
    return `
    <div id="detail-card-${index}" style="
        background:#fff; margin:12px 16px; border-radius:12px;
        box-shadow:0 2px 12px rgba(0,0,0,0.08); overflow:hidden;">

        <div style="
            display:flex; justify-content:space-between; align-items:center;
            padding:12px 16px; border-bottom:1px solid #f5f5f5;">
            <span style="font-weight:bold; font-size:15px; color:#333;">👤 ${item.userId}</span>
            <div style="display:flex; align-items:center; gap:12px;">
                <span style="color:#bbb; font-size:12px;">📅 ${item.regDate}</span>
                <button onclick="deletePhoto(${index})" style="
                    background:none; border:none; font-size:18px;
                    color:#ccc; cursor:pointer; line-height:1; padding:0;"
                    onmouseover="this.style.color='#e55'"
                    onmouseout="this.style.color='#ccc'">✕</button>
            </div>
        </div>

        <div style="position:relative; cursor:pointer;" onclick="triggerImgEdit(${index})">
            <img id="detail-img-${index}"
                 src="${item.imgName}"
                 style="width:100%; max-height:420px; object-fit:cover; display:block;">
            
            <input type="file" id="img-input-${index}" accept="image/*"
                   style="display:none;" onchange="applyImgEdit(${index}, event)">
        </div>

        <div style="padding:16px;">

            <div id="title-view-${index}"
                 onclick="startEditTitle(${index})"
                 style="font-weight:bold; font-size:16px; color:#444;
                        margin-bottom:8px; cursor:text;
                        border-radius:4px; padding:2px 4px;"
                 onmouseover="this.style.background='#fafafa'"
                 onmouseout="this.style.background='transparent'">
                ${item.title}
            </div>
            <input id="title-input-${index}" type="text" value="${item.title}"
                   style="display:none; width:100%; font-size:16px; font-weight:bold;
                          font-family:'Gaegu'; border:1px solid #ddd; border-radius:6px;
                          padding:6px 8px; box-sizing:border-box; margin-bottom:8px;"
                   onblur="saveTitle(${index})"
                   onkeydown="if(event.key==='Enter') this.blur()">

            <div id="content-view-${index}"
                 onclick="startEditContent(${index})"
                 style="font-size:14px; color:#666; line-height:1.7;
                        cursor:text; border-radius:4px; padding:2px 4px;
                        min-height:40px; white-space:pre-wrap;"
                 onmouseover="this.style.background='#fafafa'"
                 onmouseout="this.style.background='transparent'">
                ${item.content}
            </div>
            <textarea id="content-input-${index}"
                      style="display:none; width:100%; font-size:14px; color:#666;
                             font-family:'Gaegu'; border:1px solid #ddd; border-radius:6px;
                             padding:6px 8px; box-sizing:border-box; resize:none; line-height:1.7;"
                      rows="4"
                      onblur="saveContent(${index})">${item.content}</textarea>

        </div>
    </div>
    `;
}
// =============================================
// 인라인 편집: 제목
// =============================================
function startEditTitle(index) {
    document.getElementById(`title-view-${index}`).style.display = 'none';
    const input = document.getElementById(`title-input-${index}`);
    input.style.display = 'block';
    input.focus();
    input.select();
}

function saveTitle(index) {
    const newVal = document.getElementById(`title-input-${index}`).value.trim();
    if (newVal) photoData[index].title = newVal;
    document.getElementById(`title-input-${index}`).style.display = 'none';
    const view = document.getElementById(`title-view-${index}`);
    view.textContent = photoData[index].title;
    view.style.display = 'block';
}

// =============================================
// 인라인 편집: 내용
// =============================================
function startEditContent(index) {
    document.getElementById(`content-view-${index}`).style.display = 'none';
    const ta = document.getElementById(`content-input-${index}`);
    ta.style.display = 'block';
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
    ta.focus();
}

function saveContent(index) {
    const newVal = document.getElementById(`content-input-${index}`).value.trim();
    if (newVal) photoData[index].content = newVal;
    document.getElementById(`content-input-${index}`).style.display = 'none';
    const view = document.getElementById(`content-view-${index}`);
    view.textContent = photoData[index].content;
    view.style.display = 'block';
}

// =============================================
// 이미지 수정
// =============================================
function triggerImgEdit(index) {
    document.getElementById(`img-input-${index}`).click();
}

function applyImgEdit(index, event) {
    const file = event.target.files[0];
    if (!file) return;
    const newUrl = URL.createObjectURL(file);
    photoData[index].imgUrl  = newUrl;
    photoData[index].imgName = file.name;
    document.getElementById(`detail-img-${index}`).src = newUrl;
}

// =============================================
// 삭제
// =============================================
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
    const title   = document.getElementById('addTitle').value.trim();
    const content = document.getElementById('addContent').value.trim();
    // 1. 값 검증 (파일은 Supabase로 가니까 여기서 제외)
    if (!title || !content) {
        alert('제목과 내용을 모두 입력해주세요!');
        return;
    }
    const data = await uploadSupabase();
    if (!data || !data.url) return; // 업로드 실패 시 함수 종료

    // 파일이 빠졌으므로 FormData 대신 URLSearchParams를 쓰면 서블릿에서 받기 훨씬 깔끔
    const params = new URLSearchParams();
    params.append('title', title);
    params.append('content', content);
    params.append('imgName', data.url); //

    try {
        // 4. 서블릿(photo-data)으로 POST 요청
        const response = await fetch('/photo-data', {
            method: 'POST',
            body: params // application/x-www-form-urlencoded 형식으로 전송됨
        });
        console.log(response.ok);
            // 5. 서블릿에서 응답한 최신 DB 데이터(JSON) 받기
            const row = await response.json();

        if (row) {
            // 6. 성공 처리 및 화면 갱신
            closeAddModal();

            alert('사진이 성공적으로 등록되었습니다!');
            // 데이터를 받아와서 렌더링하는 함수 호출
            // (renderFeedView가 전역 데이터를 쓰는지, 인자를 받는지에 따라 맞게 사용하세요)
            loadPhoto()
        } else {
            alert('DB 저장에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('서버 통신 중 오류가 발생했습니다.');
    }
}

function deletePhoto(index) {
    if (!confirm('이 게시글을 삭제할까요?')) return;

    // 배열에서 해당 항목 삭제
    photoData.splice(index, 1);

    // TODO: DB 연동 시 → fetch('photo-delete?id=...', { method:'DELETE' })

    // 삭제 후 피드 다시 그리기
    renderFeedView();

}

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
            alert('업로드에 실패했습니다.');
            return null;
        }

        // 서버에서 {"url": "https://..."} 형식으로 반환한다고 가정
        const text = await response.text();  // 서버에서 단순 문자열
        const data = { url: text };

        return data; // 이렇게 반환해야 addPhoto에서 imgUrl.url 사용 가능
    } catch (error) {
        console.error('Error:', error);
        alert('서버 통신 중 오류가 발생했습니다.');
        return null;
    }
}