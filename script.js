const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const filter = document.querySelector(".filter");
const formBtn = itemForm.querySelector("button");
let isModeEdit = false;

//Validate Input

function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  if (newItem === "") {
    alert("Please add item");
    return;
  }

  // Check for edit mode

  if (isModeEdit) {
    const itemToEdit = itemList.querySelector(".edit-mode");

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isModeEdit = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert("Item already exists");
      return;
    }
  }

  //create item on  dom
  addItemToDOM(newItem);

  //add items to local storage
  addItemToStorage(newItem);
  resetUI();

  itemInput.value = "";
}

// Check for edit mode

// if (isModeEdit) {
//   const itemToEdit = itemList.querySelector(".edit-mode");

//   removeItemFromStorage(itemToEdit.textContent);
//   itemToEdit.classList.remove("edit-mode");
//   itemToEdit.remove();
//   isModeEdit = false;
// } else {
//   if (checkIfItemExists(newItem)) {
//     alert("Item already exists");
//     return;
//   }
// }

function addItemToDOM(item) {
  //Create a List Item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  itemList.appendChild(li);
  resetUI();
}

//Display items from local storage

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => {
    addItemToDOM(item);
  });
}

//Add items to local storage

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  //Add new item to array
  itemsFromStorage.push(item);

  //convert to JSON string and set to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

//create button

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

// create Icon
function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

// Get items from storage

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemsFromStorage;
}

// remove item

function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isModeEdit = true;

  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));

  item.classList.add("edit-mode");
  formBtn.innerHTML = '<i class = "fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = "green";
  itemInput.value = item.textContent;
}

function removeItem(item) {
  if (confirm("are you sure?")) {
    //remove item from DOM
    item.remove();

    //remove item from storage
    removeItemFromStorage(item.textContent);
  }
}

//Remove items from local storage

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  //filter out item to be deleted

  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  //Re-set to localStorage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

// clear all

function clear() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  //Clear items from localStorage

  localStorage.removeItem("items");

  resetUI();
}

// filter function

function filterItems(e) {
  const items = itemList.querySelectorAll("li");
  const text = e.target.value.toLocaleLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLocaleLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });

  resetUI();
}

// resetUI fun to clear filter and clearAll as soon as items are cleared

function resetUI() {
  itemInput.value = "";
  const items = itemList.querySelectorAll("li");
  if (items.length === 0) {
    clearBtn.style.display = "none";
    filter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    filter.style.display = "block";
  }

  formBtn.innerHTML = ' <i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = "#333";

  isModeEdit = false;
}

//Event Listeners
itemForm.addEventListener("submit", onAddItemSubmit);
itemList.addEventListener("click", onClickItem);
clearBtn.addEventListener("click", clear);
filter.addEventListener("input", filterItems);
document.addEventListener("DOMContentLoaded", displayItems);

resetUI();
