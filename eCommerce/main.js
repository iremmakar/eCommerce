const catgoryList = document.querySelector(".categories");
const productList = document.querySelector(".products");
const modal = document.querySelector(".modal-wrapper");
const openBtn = document.querySelector("#open-btn");
const closeBtn = document.querySelector("#close-btn");
const modalList = document.querySelector(".modal-list");
const modalInfo = document.querySelector("#modal-info");

document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchProduct();
});

function fetchCategories() {
  fetch("https://api.escuelajs.co/api/v1/categories")
    .then((res) => res.json())
    .then((data) =>
      data.slice(0, 4).forEach((category) => {
        const categoryDiv = document.createElement("div");
        categoryDiv.classList.add("category");
        categoryDiv.innerHTML = `
        <img src="${category.image}" />
        <span>${category.name}</span>
      
      `;

        catgoryList.appendChild(categoryDiv);
      })
    )
    .catch();
}

function fetchProduct() {
  fetch("https://api.escuelajs.co/api/v1/products")
    .then((res) => res.json())
    .then((data) =>
      data.slice(0, 25).forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        productDiv.innerHTML = `
      <img src="${product.images[0]}" alt="" />
      <p>${product.title}</p>
      <p>${product.category.name}</p>
      <div class="product-action">
        <p>${product.price} ₺</p>
        <button onclick="addToBasket({
          id: ${product.id},
          title: '${product.title}',
          price: ${product.price},
          image: '${product.images[0]}',
          amount: 1



        })">Sepete Ekle</button>
      </div>
      `;

        productList.appendChild(productDiv);
      })
    );
}

let basket = [];
let total = 0;

function addToBasket(product) {
  const foundItem = basket.find((basketItem) => basketItem.id === product.id);

  if (foundItem) {
    foundItem.amount++;
  } else {
    basket.push(product);
  }
}

openBtn.addEventListener("click", () => {
  modal.classList.add("active");
  addList();
  modalInfo.innerText = total;
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
  modalList.innerHTML = "";
  total = 0;
});

modal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-wrapper")) {
    modal.classList.remove("active");
  }
});

function addList() {
  basket.forEach((basketItem) => {
    const listItem = document.createElement("div");
    listItem.classList.add("list-item");

    listItem.innerHTML = `
    <img src="${basketItem.image}" alt="" />
    <h2>${basketItem.title}</h2>
    <h2>${basketItem.price} ₺</h2>
    <p>Miktar: ${basketItem.amount}</p>
    <button id="del" onClick="deleteItem({id:'${basketItem.id}',price:${basketItem.price},amount:${basketItem.amount}})">Delete</button>
    
    
    `;

    modalList.appendChild(listItem);
    total += basketItem.price * basketItem.amount;
  });
}

function deleteItem(deletingItem) {
  basket = basket.filter((i) => i.id !== deletingItem.id);
  total -= deletingItem.price * deletingItem.amount;
  modalInfo.innerText = total;
}

modal.addEventListener("click", (e) => {
  if (e.target.id === "del") {
    e.target.parentElement.remove();
  }
});
