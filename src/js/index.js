import { $ } from "./dom.js";

import store from "./store/index.js";

const BASE_URL = "http://localhost:3000/api";

const MenuApi = {
  async getAllMenuByCategory(category) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`);

    return response.json();
  },
};

function App() {
  // 상태: 이 앱에서 변하는 데이터 - 메뉴명
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = "espresso";
  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    initEventListeners();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((menuItem, index) => {
        //https://developer.mozilla.org/ko/docs/Web/HTML/Global_attributes/data-*
        return `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name ${
            menuItem.soldOut ? "sold-out" : ""
          }">${menuItem.name}</span>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button ${
              menuItem.soldOut ? "bg-green-200" : ""
            }"
          >
            품절
          </button>
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
      })
      .join("");

    $("#menu-list").innerHTML = template;

    // 총 메뉴 갯수 count
    updateMenuCount();
  };

  const addMenuName = async () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요!");
      return;
    }
    const menuName = $("#menu-name").value;

    await fetch(`${BASE_URL}/category/${this.currentCategory}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: menuName }),
    }).then((response) => {
      return response.json();
    });

    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    // input 빈값으로
    $("#menu-name").value = ``;
  };

  const updateMenuCount = () => {
    const count = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${count}개`;
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    // https://developer.mozilla.org/ko/docs/Web/API/Element/closest
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    if (updatedMenuName) {
      store.setLocalStorage(this.menu);
      render();
    }
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      render();
    }
  };

  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

  const initEventListeners = () => {
    // Form 태그가 자동적으로 전송되는 걸 막아줌
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-list").addEventListener("click", (e) => {
      // # 이벤트 위임을 통해 메뉴 수정하기
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }

      // # 이벤트 위임을 통해 메뉴 삭제하기
      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }

      // # 이벤트 위임을 통해 품절 시키기
      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    // # 클릭이벤트 활용하여 메뉴 추가하기
    $("#menu-submit-button").addEventListener("click", addMenuName);

    // # 엔터눌러서 메뉴 추가하기
    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      addMenuName();
    });

    // # 카테고리 변경
    $("nav").addEventListener("click", (e) => {
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        render();
      }
    });
  };
}

const app = new App();

app.init();
