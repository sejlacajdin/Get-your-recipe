import {elements} from './base';
import {Fraction} from 'fractional';

export const clearRecipe=()=>{
elements.recipe.innerHTML='';
};

const formatCount = count => {
    if (count) {
        const newCount = Math.round(count * 10000) / 10000;
        const [int, dec] = newCount.toString().split('.').map(el => parseInt(el, 10));

        if (!dec) return newCount;

        if (int === 0) {
            const fr = new Fraction(newCount);
            return `${fr.numerator}/${fr.denominator}`;
        } else {
            const fr = new Fraction(newCount - int);
            return `${int} ${fr.numerator}/${fr.denominator}`;
        }
    }
    return '?';
};

const createIngredient = ingredient => `
    <li class="recipe_item">
        <svg class="recipe_icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe_count">${formatCount(ingredient.count)}</div>
        <div class="recipe_ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>
`;
export const renderRecipe=(recipe,isLiked)=>{
    const markup=`
    <figure class="recipe_fig">
    <img src="${recipe.img}" alt="${recipe.title}" class="recipe_img">
    <h1 class="recipe_title">
        <span>${recipe.title}</span>
    </h1>
</figure>

<div class="recipe_details">
    <div class="recipe_info">
        <svg class="recipe_info-icon">
            <use href="img/icons.svg#icon-stopwatch"></use>
        </svg>
        <span class="recipe_info-data recipe_info-data--minutes">${recipe.time}</span>
        <span class="recipe_info-text"> minutes</span>
    </div>
    <div class="recipe_info">
        <svg class="recipe_info-icon">
            <use href="img/icons.svg#icon-man"></use>
        </svg>
        <span class="recipe_info-data recipe_info-data--people">${recipe.servings}</span>
        <span class="recipe_info-text"> servings</span>

        <div class="recipe_info-buttons">
            <button class="btn-tiny btn-decrease">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-minus"></use>
                </svg>
            </button>
            <button class="btn-tiny btn-increase">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-plus"></use>
                </svg>
            </button>
        </div>

    </div>
    <button class="recipe_love">
        <svg class="header_likes">
            <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
        </svg>
    </button>
</div>

<div class="recipe_ingredients">
    <ul class="recipe_ingredient-list">
    ${recipe.ingredients.map(el => createIngredient(el)).join('')}
    </ul>

    <button class="btn-small recipe_btn recipe_btn--add">
        <svg class="search_icon">
            <use href="img/icons.svg#icon-shopping-cart"></use>
        </svg>
        <span>Add to shopping list</span>
    </button>
</div>

<div class="recipe_directions">
    <h2 class="heading2">How to cook it</h2>
    <p class="recipe_directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe_by">${recipe.author}</span>. Please check out directions at their website.
    </p>
    <a class="btn-small recipe_btn" href="${recipe.url}" target="_blank">
        <span>Directions</span>
        <svg class="search_icon">
            <use href="img/icons.svg#icon-triangle-right"></use>
        </svg>
    </a>
</div>
`
elements.recipe.insertAdjacentHTML('afterbegin',markup);
};

export const updateServingsIngredients=recipe=>{
    //Update servings
    document.querySelector('.recipe_info-data--people').textContent=recipe.servings;

    //Update ingredients
    const countElements= Array.from(document.querySelectorAll('.recipe_count'));
    countElements.forEach((el,i)=>{
        el.textContent=formatCount(recipe.ingredients[i].count);
    });
};