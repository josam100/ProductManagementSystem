let products = JSON.parse(localStorage.getItem("products")) || [];
let nextProductId = products.length > 0 ? Math.max(...products.map(product => product.id)) + 1: 1;

function getTotal() {
    const price = parseFloat(document.getElementById("price").value) || 0;
    const taxes = parseFloat(document.getElementById("taxes").value) || 0;
    const ads = parseFloat(document.getElementById("ads").value) || 0;
    const discount = parseFloat(document.getElementById("discount").value) || 0;

    const total = price + taxes + ads - discount;

    document.getElementById("total").textContent = `: ${total.toFixed(2)}`;
}

function addProduct() {
    const title = document.getElementById("title").value.trim();
    const price = parseFloat(document.getElementById("price").value) || 0;
    const taxes = parseFloat(document.getElementById("taxes").value) || 0;
    const ads = parseFloat(document.getElementById("ads").value) || 0;
    const discount = parseFloat(document.getElementById("discount").value) || 0;
    const count = parseInt(document.getElementById("count").value) || 1;
    const category = document.getElementById("category").value.trim();

    if (!title || !price || !category) {
        alert("Please fill in all fields.");
        return;
    }

    const total = price + taxes + ads - discount;

    for (let i = 0; i < count; i++) {
        const product = {
            id: nextProductId++,
            title,
            price,
            taxes,
            ads,
            discount,
            total,
            category
        };

        products.push(product);
    }

    updateTable();
    updateDeleteAllButton();
    saveProducts();
    clearInputs();
}

function updateTable() {
    const tableBody = document.getElementById("productTableBody");
    tableBody.innerHTML = "";

    products.forEach((product, index) => {
        const row = tableBody.insertRow();

        for (const key in product) {
            if (product.hasOwnProperty(key) && key !== 'count') {
                const cell = row.insertCell();
                cell.innerHTML = product[key];
            }
        }

        const updateCell = row.insertCell();
        const updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.addEventListener("click", () => updateProduct(index));
        updateCell.appendChild(updateButton);

        const deleteCell = row.insertCell();
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteProduct(index));
        deleteCell.appendChild(deleteButton);
    });
}

function updateDeleteAllButton() {
    const deleteAllButton = document.getElementById("deleteAll");
    if (products.length > 0) {
        deleteAllButton.style.display = "inline-block";
    } else {
        deleteAllButton.style.display = "none";
    }
}

function clearInputs() {
    document.getElementById("title").value = "";
    document.getElementById("price").value = "";
    document.getElementById("taxes").value = "";
    document.getElementById("ads").value = "";
    document.getElementById("discount").value = "";
    document.getElementById("count").value = "";
    document.getElementById("category").value = "";
    document.getElementById("total").textContent = ": 0.00"; // Clear total price field
}

function updateProduct(index) {
    const product = products[index];

    document.getElementById("title").value = product.title;
    document.getElementById("price").value = product.price;
    document.getElementById("taxes").value = product.taxes;
    document.getElementById("ads").value = product.ads;
    document.getElementById("discount").value = product.discount;
    document.getElementById("category").value = product.category;

    products.splice(index, 1);

    updateTable();
    updateDeleteAllButton();
    saveProducts();
}

function deleteProduct(index) {
    products.splice(index, 1);

    // Update product IDs after deletion
    for (let i = 0; i < products.length; i++) {
        products[i].id = i + 1;
    }

    updateTable();
    updateDeleteAllButton();
    saveProducts();
}

function deleteAllProducts() {
    products = [];
    nextProductId = 1;

    updateTable();
    updateDeleteAllButton();
    saveProducts();
}

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

function loadProducts() {
    // Load products from local storage on page load
    updateTable();
    updateDeleteAllButton();
}

function searchByTitle() {
    const searchTerm = document.getElementById("search").value.toLowerCase();

    const filteredProducts = products.filter(product => product.title.toLowerCase().includes(searchTerm));

    updateTable(filteredProducts);
}

function searchByCategory() {
    const searchTerm = document.getElementById("search").value.toLowerCase();

    const filteredProducts = products.filter(product => product.category.toLowerCase().includes(searchTerm));

    updateTable(filteredProducts);
}

document.getElementById("submit").addEventListener("click", addProduct);
document.getElementById("searchTitle").addEventListener("click", searchByTitle);
document.getElementById("searchCategory").addEventListener("click", searchByCategory);
document.getElementById("deleteAll").addEventListener("click", deleteAllProducts);

// Load products on page load
loadProducts();


function searchByTitle() {
    const searchTerm = document.getElementById("search").value.toLowerCase();

    const filteredProducts = products.filter(product => {
        const title = product.title.toLowerCase();
        const index = title.indexOf(searchTerm);
        
        if (index !== -1) {
            const highlightedTitle = title.substring(0, index) +
                `<span style="background-color: #CC7A00;">${title.substring(index, index + searchTerm.length)}</span>` +
                title.substring(index + searchTerm.length);
            product.title = highlightedTitle;
            return true;
        } else {
            return false;
        }
    });

    updateTable(filteredProducts);
}

function searchByCategory() {
    const searchTerm = document.getElementById("search").value.toLowerCase();

    const filteredProducts = products.filter(product => {
        const category = product.category.toLowerCase();
        const index = category.indexOf(searchTerm);
        
        if (index !== -1) {
            const highlightedCategory = category.substring(0, index) +
                `<span style="background-color: #ff00ed;">${category.substring(index, index + searchTerm.length)}</span>` +
                category.substring(index + searchTerm.length);
            product.category = highlightedCategory;
            return true;
        } else {
            return false;
        }
    });

    updateTable(filteredProducts);
}
