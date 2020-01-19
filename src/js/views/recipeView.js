import { elements } from './base';
import { Fraction } from 'fractional';

const formatCount = count => {
    if (count) {
        const newCount = Math.round(count * 10000)/10000;
        const [int, dec] = newCount.toString().split('.').map(el => parseInt(el, 10));

        if (!dec) return newCount;
        
        if (int === 0) {
            const frac = new Fraction(newCount);
            return `${frac.numerator}/${frac.denominator}`
        } else {
            const frac = new Fraction(newCount - int);
            return `${int} ${frac.numerator}/${frac.denominator}`; 
        }

    } 
    return '?';
} 

const createIngredient = obj => {
    const markup = `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(obj.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${obj.unit}</span>
            ${obj.ingredient}
        </div>
    </li>
    `
    return markup
}

export const renderRecipe = (recipe, isLiked) => {
    
    const markup = `
    <figure class="recipe__fig">
                <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
                <h1 class="recipe__title">
                    <span>${recipe.title}</span>
                </h1>
            </figure>

            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-stopwatch"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                    <span class="recipe__info-text"> minutes</span>
                </div>
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-man"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                    <span class="recipe__info-text"> servings</span>

                    <div class="recipe__info-buttons">
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
                <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="img/icons.svg#${isLiked ? 'icon-heart' : 'icon-heart-outline'}"></use>
                    </svg>
                </button>
            </div>



            <div class="recipe__ingredients">
                <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map(el => createIngredient(el)).join('')}
                </ul>

                <button class="btn-small recipe__btn recipe__btn--addtolist">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-shopping-cart"></use>
                    </svg>
                    <span>Add to shopping list</span>
                </button>
            </div>

            <div class="recipe__directions">
                <h2 class="heading-2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__by">${recipe.publisher}</span>. Please check out directions at their website.
                </p>
                <a class="btn-small recipe__btn" href="${recipe.source}" target="_blank">
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-right"></use>
                    </svg>

                </a>
            </div>
    
    `;

    elements.recipePage.insertAdjacentHTML('afterbegin', markup);
    
}

export const clearRecipe = () => {
    elements.recipePage.innerHTML = '';
}

export const highlightSelected = id => {
    const resultsArr = document.querySelectorAll('.results__link');
    resultsArr.forEach(el => el.classList.remove('results__link--active'));
    document.querySelector(`a[href*="#${id}"]`).classList.add('results__link--active');
}

export const updateServingsIngs = recipe => {
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

    const countElements = Array.from(document.querySelectorAll('.recipe__count'));

    countElements.forEach((el, i) => {
        el.textContent = formatCount(recipe.ingredients[i].count)
    });
}
