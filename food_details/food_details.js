const productDetails = JSON.parse(localStorage.getItem('productDetails'));
const productId = JSON.parse(localStorage.getItem('productId'));
const apiKey = "48a37afebb374478885f9308ade29257";

if (productDetails) {
    console.log('productDetails', productDetails);
}

let content = document.querySelector('.content');

function createRecipeHTML(recipe, nutritionElement) {
    return `
        <div class="recipe-card">
            <div class="recipe-header">
                <h1 class="recipe-title">${recipe.title}</h1>
                <p class="review">${recipe.summary}</p>
                <div class="summary">
                    <div class="summary-item">
                        <span class="summary-value">${recipe.extendedIngredients.length}</span>
                        <p>Ingredients</p>
                    </div>
                    <div class="summary-item">
                        <span class="summary-value">${recipe.readyInMinutes}</span>
                        <p>Minutes</p>
                    </div>
                </div>
            </div>
            <div class="recipe-image">
                <img src="${recipe.image}" alt="">
            </div>
            <div class="ingredients-section">
                <h2>Ingredients</h2>
                <ul>
                    ${recipe.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
                </ul>
            </div>
            <div class="instructions-section">
                <h2>Instructions</h2>
                <ol>
                    ${recipe.analyzedInstructions[0].steps.map(step => `<li>${step.step}</li>`).join('')}
                </ol>
            </div>
            ${nutritionElement}
        </div>
    `;
}

function createNutritionHTML(data) {
    return `
        <div class="nutrition-info">
            <h2>Nutrition Information</h2>
            <div class="nutrients-section">
                <h3>Nutrients</h3>
                <ul>
                    ${data.nutrients.map(nutrient => `
                        <li>${nutrient.name}: ${nutrient.amount}${nutrient.unit} (${nutrient.percentOfDailyNeeds}% DV)</li>
                    `).join('')}
                </ul>
            </div>
            <div class="properties-section">
                <h3>Properties</h3>
                <ul>
                    ${data.properties.map(property => `
                        <li>${property.name}: ${property.amount}${property.unit}</li>
                    `).join('')}
                </ul>
            </div>
            <div class="caloric-breakdown-section">
                <h3>Caloric Breakdown</h3>
                <ul>
                    <li>Protein: ${data.caloricBreakdown.percentProtein}%</li>
                    <li>Fat: ${data.caloricBreakdown.percentFat}%</li>
                    <li>Carbs: ${data.caloricBreakdown.percentCarbs}%</li>
                </ul>
            </div>
            <div class="weight-per-serving-section">
                <h3>Weight Per Serving</h3>
                <p>${data.weightPerServing.amount}${data.weightPerServing.unit}</p>
            </div>
        </div>
    `;
}

async function renderRecipeWithNutrition() {
    if (productDetails) {
        let nutrition = await getNutritionData(productId);
        content.innerHTML = createRecipeHTML(productDetails, createNutritionHTML(nutrition));
    }
}

async function getNutritionData(id) {
    try {
        let response = await fetch(`https://api.spoonacular.com/recipes/${id}/nutritionWidget.json?apiKey=${apiKey}`);
        let responseObj = await response.json();
        console.table(responseObj);
        return responseObj;
    } catch(error) {
        console.error(error);
    }
}

renderRecipeWithNutrition();
