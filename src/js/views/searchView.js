import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
}

export const clearResults = () => {
    elements.searchResultsList.innerHTML = '';
}

export const clearPaginationBtns = () => {
    elements.searchResultsPages.innerHTML = '';
}

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, curr) => {
            if (acc + curr.length <= limit) {
                newTitle.push(curr);
            } 
            return acc + curr.length;
        }, 0);
        return `${newTitle.join(' ')} ...`;
    }
    return title;

}

const renderRecipe = recipe => {
    const markup = 
    `<li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class = "results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`;
    elements.searchResultsList.insertAdjacentHTML('beforeend', markup);
}

const createBtn = (page, type) => {

    return `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                    </svg>
                </button>

    </svg>
    </button>
    `;

} 

const renderBtns = (page, numRes, resPerPage) => {
    const pages = Math.ceil(numRes/resPerPage);

    let button;
    if (page === 1  && pages > 1) {
        button = createBtn(page, 'next');
    } else if (page === pages) {
        button = createBtn(page, 'prev');
    } else {
        button = `${createBtn(page, 'prev')}
        ${createBtn(page, 'next')}`;
    }

    elements.searchResultsPages.insertAdjacentHTML('afterbegin', button);


}

export const renderResults = (recipes, page = 1, resPerPage = 10) => {

    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);
    renderBtns(page, recipes.length, resPerPage);
}