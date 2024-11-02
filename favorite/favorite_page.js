let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let productList = document.querySelector('.product-list');

function productCardWidget(food) {
    let imageUrl = food.image;
    let name = food.title;
    let id = food.id;

    return `
        <div class="product-card" data-id="${id}">
            <div class="product-card__image">
                <img src="${imageUrl}" alt="${name}"/>
            </div>
            <div class="product-card__title">${name}</div>
            <button class="select_button show-details-btn" data-id="${id}">Show Details</button>
            <button class="select_button remove-favorite-btn" data-id="${id}">Remove</button>
        </div>
    `;
}

function showFavorites(list) {
    let innerHtml = "";
    list.forEach((element) => {
        innerHtml += productCardWidget(element);
    });
    return innerHtml.trim() !== "" ? innerHtml : "<h1 style='color: red'>No recipes found.</h1>";
}

function updateFavoritesDisplay() {
    favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    productList.innerHTML = showFavorites(favorites);
}

function removeFromFavorites(productId) {
    favorites = favorites.filter(item => item.id !== productId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesDisplay();
}

productList.innerHTML = showFavorites(favorites);

productList.addEventListener("click", (e) => {
    const target = e.target;
    const productId = parseInt(target.dataset.id);

    if (target.classList.contains("show-details-btn")) {
        const item = favorites.find(item => item.id === productId);
        if (item) {
            localStorage.setItem('productDetails', JSON.stringify(item));
            localStorage.setItem('productId', item.id);
            window.location.href = '../food_details/food_details.html';
        }
    } else if (target.classList.contains("remove-favorite-btn")) {
        removeFromFavorites(productId);
    }
});
