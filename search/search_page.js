const apiKey = "48a37afebb374478885f9308ade29257";


let productList = document.querySelector('.product-list');
let inputField = document.querySelector('.welcome-block__text input');
let button = document.querySelector('.welcome-block__text button');
let searchResults = document.querySelector('.search-results');
let debounceTimeout;



function searchBar(foods) {
    let innerHtml = foods.map(element => `
        <div class="search-bar-item"><button><h2>${element.title}</h2></button></div>
    `).join('');
    return innerHtml || "<h2 style='color: red'>No results in search bar.</h2>";
}

//event listeners
button.addEventListener('click', async () => {
    if (inputField.value.trim() !== "") {
        productList.innerHTML = productListBar(await searchFood(inputField.value));
        searchResults.innerHTML = "";
    }
});
productList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('show-details-btn')) {
        const productCard = e.target.closest('.product-card');
        const productId = productCard.getAttribute('data-id');
        await showProductDetails(productId);
    }

    if (e.target.classList.contains('favorite-btn')) {
        const productCard = e.target.closest('.product-card');
        const productId = parseInt(productCard.getAttribute('data-id'));
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        if (favorites.some(fav => fav.id === productId)) {
            // remove from favorites
            removeFromFavorites(productId);
            e.target.textContent = "Add To Favorite";
        } else {
            // add to favorites
            addToFavorites(await getProductDetail(productId));
            e.target.textContent = "Remove";
        }
    }
});
searchResults.addEventListener('click', async (e) => {
    const searchItem = e.target.closest('.search-bar-item');
    if (searchItem) {
        const titleElement = searchItem;
        const title = titleElement ? titleElement.textContent : null;
        if (title) {
            productList.innerHTML = productListBar(await searchFood(title));
            searchResults.innerHTML = "";
        } else {
            console.error("Title element not found within the search item.");
        }
    }
});
inputField.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        productList.innerHTML = productListBar(await searchFood(inputField.value));
        searchResults.innerHTML = "";
    }
});
inputField.addEventListener('input', () => {
    clearTimeout(debounceTimeout);

    if (inputField.value.trim() === "") {
        searchResults.innerHTML = "";
        return;
    }
    debounceTimeout = setTimeout(async () => {
        searchResults.innerHTML = "";
        const foods = await searchFood(inputField.value);
        searchResults.innerHTML = searchBar(foods);
    }, 300);
});

//async functions
async function searchFood(query) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}&number=6`);
        if (!response.ok) throw new Error(`Failed to fetch recipes. Status: ${response.status}`);

        const resp = await response.json();
        return resp.results && Array.isArray(resp.results) ? resp.results : [];
    } catch (error) {
        console.error("An error occurred while fetching recipes:", error);
        return [];
    }
}
async function showProductDetails(productId) {
    try {
        const details = await getProductDetail(productId);
        localStorage.setItem('productDetails', JSON.stringify(details));
        localStorage.setItem('productId', productId);
        window.location.href = `../food_details/food_details.html`;
    } catch (error) {
        console.error("An error occurred while fetching product details:", error);
    }
}
async function getProductDetail(productId) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${productId}/information?apiKey=${apiKey}`);
        if (!response.ok) throw new Error(`Failed to fetch recipe details. Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("An error occurred while fetching product details:", error);
        return null;
    }
}

//basic functions
function productListBar(list) {
    let innerHtml = list.map(element => productCardWidget(element)).join('');
    return innerHtml || "<h1 style='color: red'>No recipes found.</h1>";
}
function addToFavorites(product) {
    try {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (!favorites.some(fav => fav.id === product.id)) {
            favorites.push(product);
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    } catch (error) {
        console.error("Failed to add to favorites:", error);
    }
}
function removeFromFavorites(productId) {
    try {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites = favorites.filter(fav => fav.id !== productId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
        console.error("Failed to remove from favorites:", error);
    }
}
function productCardWidget(food) {
    let imageUrl = food.image;
    let name = food.title;
    let id = food.id;

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFavorite = favorites.some(fav => fav.id === id);

    return `
        <div class="product-card" data-id="${id}">
            <div class="product-card__image">
                <img src="${imageUrl}" alt="${name}"/>
            </div>
            <div class="product-card__title">${name}</div>
            <button class="select_button show-details-btn">Show Details</button>
            <button class="select_button favorite-btn">${isFavorite ? "Remove" : "Add To Favorite"}</button>
        </div>
    `;
}

