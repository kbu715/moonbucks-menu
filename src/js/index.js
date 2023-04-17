// 관용적으로 많이 쓰임 $
const $ = (selector) => document.querySelector(selector);

function App() {
  // Form 태그가 자동적으로 전송되는 걸 막아줌
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
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
    updateMenuCount();

    // input 빈값으로
    $("#espresso-menu-name").value = ``;
  };

  const updateMenuCount = () => {
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

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

    // # 이벤트 위임을 통해 메뉴 삭제하기
    if (e.target.classList.contains("menu-remove-button")) {
      if (confirm("정말 삭제하시겠습니까?")) {
        const element = e.target.closest("li");
        element.remove(); // DOM API
        updateMenuCount();
      }
    }
  });

  // # 클릭이벤트 활용하여 메뉴 추가하기
  $("#espresso-menu-submit-button").addEventListener("click", (e) => {
    addMenu();
  });

  // # 엔터눌러서 메뉴 추가하기
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }
    addMenu();
  });
}

App();
