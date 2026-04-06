function loadPhoto() {

const container = document.getElementById('notebook-content');
    // 1. 일단 로딩 중 표시 (기존 내용 싹 비우기)
    container.innerHTML = '<div class="loading">사진첩을 열고 있어요... 📸</div>';

    // 2. 데이터 가져오기
    fetch('photo-data')
        .then(res => res.json())
        .then(data => {
            // 3. 사진첩 전체 레이아웃을 백틱으로 감싸기
            let photoHtml = `
                <div class="photo-wrapper" style="padding:20px;">
                    <h2 style="font-family:'Gaegu'; border-bottom:2px dashed #ddd; padding-bottom:10px;">
                        🖼️ My Photo Album
                    </h2>
                    <div class="photo-grid" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:15px; margin-top:20px;">
            `;

            // 4. 데이터 반복 돌면서 아이템 추가
            data.forEach(item => {
                photoHtml += `
                    <div class="photo-card" style="background:#fff; padding:10px; border:1px solid #eee; box-shadow:5px 5px 15px rgba(0,0,0,0.05);">
                        <img src="/uploads/${item.imgName}" style="width:100%; height:120px; object-fit:cover; border-radius:5px;">
                        <div style="margin-top:8px; font-size:13px; text-align:center;">
                            <strong>${item.title}</strong><br>
                            <span style="color:#999; font-size:11px;">by ${item.userId}</span>
                        </div>
                    </div>
                `;
            });

            photoHtml += `</div></div>`; // 닫는 태그

            // 5. 한 방에 밀어넣기 (innerHTML)
            container.innerHTML = photoHtml;
        })
        .catch(err => {
            container.innerHTML = '<div class="error">사진첩 로딩 실패 ㅠㅠ</div>';
            console.error(err);
        });
}