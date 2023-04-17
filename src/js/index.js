// 관용적으로 많이 쓰임 $
const $ = (selector) => document.querySelector(selector);

function App() {
  // Form 태그가 자동적으로 전송되는 걸 막아줌
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  // # 이벤트 위임을 통해 메뉴 수정하기
  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      // https://developer.mozilla.org/ko/docs/Web/API/Element/closest
      const $menuName = e.target.closest("li").querySelector(".menu-name");
      const updatedMenuName = prompt(
        "메뉴명을 수정하세요",
        $menuName.innerText
      );
      if (updatedMenuName) {
        $menuName.innerText = updatedMenuName;
      }
    }
  });

  const addMenu = () => {
    if ($("#espresso-menu-name").value === "") {
      alert("값을 입력해주세요!");
      return;
    }
    const espressoMenuName = $("#espresso-menu-name").value;
    const menuItemTemplate = (espressoMenuName) => {
      return `<li class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
          >
            수정
          </button>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
          >
            삭제
          </button>
        </li>`;
    };

    // https://developer.mozilla.org/ko/docs/Web/API/Element/insertAdjacentHTML
    $("#espresso-menu-list").insertAdjacentHTML(
      "beforeend", // element 안에 가장 마지막 child
      menuItemTemplate(espressoMenuName)
    );

    // 총 메뉴 갯수 count
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;

    // input 빈값으로
    $("#espresso-menu-name").value = ``;
  };
  // 확인버튼 클릭 이벤트 처리
  $("#espresso-menu-submit-button").addEventListener("click", (e) => {
    addMenu();
  });
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }
    addMenu();
  });
}

App();
