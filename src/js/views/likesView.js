import { limitRecipeTitle } from '../views/searchView';

import { elements } from "./base";

export const toggleLikeBtn = isLike => {
    const iconString = isLike ? 'icon-heart' : 'icon-heart-outline';

    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
}

export const toggleLikesMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden'
}

export const renderLike = like => {
    const markup = 
    `
    <li>
        <a class="likes__link" data-likeid="${like.id}" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="${limitRecipeTitle(like.title)}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                <p class="likes__author">${like.publisher}</p>
            </div>
        </a>
    </li>    
    `
    elements.likesList.insertAdjacentHTML('beforeend', markup);

}

export const deleteLikeItem = id => {
    const item = document.querySelector(`[data-likeid="${id}"]`);
    if (item) {
        item.parentElement.removeChild(item);
    }
}