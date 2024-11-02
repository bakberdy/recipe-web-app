const apiKey = "48a37afebb374478885f9308ade29257";

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

let productList = document.querySelector('.product-list');
let inputField = document.querySelector('.welcome-block__text input');
let button = document.querySelector('.welcome-block__text button');

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
            // Remove from favorites
            removeFromFavorites(productId);
            e.target.textContent = "Add To Favorite";
        } else {
            // Add to favorites
            addToFavorites(await getProductDetail(productId));
            e.target.textContent = "Remove";
        }
    }
});

button.addEventListener('click', async () => {
    if (inputField.value.trim() !== "") {
        productList.innerHTML = await searchFood(inputField.value);
    }
});

async function searchFood(query) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}&number=6`);
        if (!response.ok) {
            throw new Error(`Failed to fetch recipes. Status: ${response.status}`);
        }
        const resp = await response.json();

        if (resp.results && Array.isArray(resp.results)) {
            const list = resp.results;
            let innerHtml = "";
            list.forEach((element) => {
                innerHtml += productCardWidget(element);
            });
            return innerHtml.trim() !== "" ? innerHtml : "<h1 style='color: red'>No recipes found.</h1>";
        } else {
            return "<h1>No recipes found.</h1>";
        }

    } catch (error) {
        return "An error occurred while fetching recipes. Please try again later.";
    }
}

async function showProductDetails(productId) {
    try {
        const details = await getProductDetail(productId);
        localStorage.setItem('productDetails', JSON.stringify(details));
        localStorage.setItem('productId', productId);
        window.location.href = `../food_details/food_details.html`;

    } catch (error) {
        return "An error occurred while fetching recipes. Please try again later.";
    }
}

async function getProductDetail(productId) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${productId}/information?apiKey=${apiKey}&number=6`);
        if (!response.ok) {
            throw new Error(`Failed to fetch recipes. Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        return "An error occurred while fetching recipes. Please try again later.";
    }
}

function addToFavorites(product) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isAlreadyFavorite = favorites.some(fav => fav.id === product.id);

    if (!isAlreadyFavorite) {
        favorites.push(product);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

function removeFromFavorites(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.id !== productId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}
