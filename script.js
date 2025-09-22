$(function() {
  $('.js-hamburger').click(function() {
    // メニューの開閉状態を切り替える
    $('.sp_menu').toggleClass('open');

    // ハンバーガーボタンのアクティブクラスを切り替えて三本線をバツにする
    $(this).toggleClass('active');
  });
});


// モーダル

const boxContainer = document.getElementById("boxContainer");
let boxCount = 4;

// モーダル要素の参照
const modal = document.getElementById("modal");
const modalTextarea = document.getElementById("modalTextarea");
const saveBtn = document.getElementById("saveBtn");
let activeBox = null; // 今編集してるtextareaを記録

// 最初の4つにイベントを仕込む
document.querySelectorAll("#boxContainer textarea").forEach(addModalHandler);

// ＋ボタンで追加
document.getElementById("addBox").addEventListener("click", () => {
  boxCount++;
  const newBox = document.createElement("textarea");
  newBox.placeholder = `シーン${boxCount}`;
  boxContainer.appendChild(newBox);

  // ← 新しく作ったtextareaにもモーダル用イベントを追加！
  addModalHandler(newBox);
});

// textareaをクリックしたらモーダルを開く関数
function addModalHandler(textarea) {
    textarea.addEventListener("click", () => {
    activeBox = textarea;
    modalTextarea.value = textarea.value;
    modal.style.display = "block";
  });
}

// 保存ボタン
saveBtn.addEventListener("click", () => {
  if (activeBox) {
    activeBox.value = modalTextarea.value;
  }
  modal.style.display = "none";
});

// モーダルの背景をクリックしたら閉じる
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// シャッフル機能（HTML文字列でセクションを作成）
function clickDisplayAlert() {
  // 入力されたシーンを取得
  const inputTextareas = document.querySelectorAll("#boxContainer textarea");
  const scenes = Array.from(inputTextareas)
    .map(textarea => textarea.value.trim())
    .filter(value => value !== ""); // 空でないもののみ
  
    if (scenes.length === 0) {
      alert("シーンを入力してください");
      return;
    }
  
    // 結果表示エリアを取得（または作成）
    let resultArea = document.getElementById("kekka");
    if (!resultArea) {
    // 結果表示エリアが存在しない場合は作成
    resultArea = document.createElement("div");
    resultArea.id = "kekka";
    document.querySelector("main").appendChild(resultArea);
  }
  
  // 結果エリアをクリア
  resultArea.innerHTML = "";
  
  // 10個のシャッフル案を作成
  for (let step = 1; step <= 10; step++) {
    // シャッフル
    const shuffledScenes = shuffleArray([...scenes]);
    
    // textareaのHTML文字列を作成
    const textareasHtml = shuffledScenes.map((scene, index) => 
      `<textarea placeholder="シーン${index + 1}" readonly>${scene}</textarea>`
    ).join('');

  
    
    // セクション全体のHTML文字列を作成
    const sectionHtml = `
      <section id="kekka${step}">
            <div class="check">
                    <label class="checkbox">
                         <input type="checkbox" id="check${step}" ${step === 1 ? 'checked' : ''}>
                        <span class="custom"></span>
                    </label>
                </div>
        <details ${step === 1 ? 'open' : ''}>
          <summary class="tab_b">
            <h2>シャッフル案<span>${step}</span></h2><span class="arrow"></span>
            </summary>
          <div class="scene">
            <div class="con">
              ${textareasHtml}
            </div>
          </div>
        </details>
      </section>
    `;
    
    // HTML文字列を実際のDOMに挿入
    resultArea.insertAdjacentHTML('beforeend', sectionHtml);
  }
}
//デフォルトで1個出す
// 配列をシャッフルする関数（Fisher-Yatesアルゴリズム）
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

// テキストファイル出力機能（全10案を出力）
function downloadTextFile() {
  const resultArea = document.getElementById("kekka");
  if (!resultArea) {
    alert("出力するシャッフル案がありません");
    return;
  }

  const sections = resultArea.querySelectorAll("section");
  let allContent = "";
  let checkedCount = 0; // ← ここで初期化する
  

  sections.forEach((section, index) => {
    // チェックボックスを取得
    const checkbox = section.querySelector("input[type='checkbox']");

    // チェックされている案のみ処理
    if (checkbox && checkbox.checked) {
      checkedCount++;
      const textareas = section.querySelectorAll("textarea");
      const content = Array.from(textareas)
        .map((textarea, textareaIndex) => {
          const v = textarea.value.trim();
          return v ? `  シーン${textareaIndex + 1}: ${v}` : "";
        })
        .filter(line => line !== "")
        .join("\n");

      if (content) {
        allContent += `シャッフル案${index + 1}:\n${content}\n\n`;
      }
    }
  });

  if (checkedCount === 0) {
    alert("チェックされた案がありません。ダウンロードしたい案にチェックを入れてください。");
    return;
  }

  if (allContent === "") {
    alert("出力する内容がありません");
    return;
  }

  // ダウンロード処理
  const blob = new Blob([allContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const now = new Date().toISOString().replace(/[:.]/g, "-");
  a.download = `箱書きシャッフル結果_${now}_選択${checkedCount}案.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


  




  
  // チェックされた案のみテキストファイルとしてダウンロード
  const blob = new Blob([allContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `箱書きシャッフル結果_選択${checkedCount}案.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);











