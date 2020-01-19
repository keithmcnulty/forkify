import Search from './models/Search';
import Recipe from './models/Recipe';
import ShoppingList from './models/ShoppingList';
import Likes from './models/Likes';
import * as recipeView from './views/recipeView';
import * as searchView from './views/searchView';
import * as shoppingListView from './views/shoppingListView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';


/* Global state of the app
    - Search object
    - Current recipe object
    - Shopping list
    - Liked recipes
*/

const state = {

};

//* SEARCH CONTROLLER *//

const controlSearch = async () => {
    //1. get query from view
    const query = searchView.getInput();

    if (query) {
        // 2. New search object to state
        state.search = new Search(query);

        
        // 3.  prepare UI for results
         searchView.clearInput();
         searchView.clearResults();
         renderLoader(elements.searchRes);

        
        try {
            // 4.  search for recipes
            await state.search.getResults();

            // 5. render result to UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('Something went wrong...');
            clearLoader();
        }
        


    }
    
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

elements.searchResultsPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.clearPaginationBtns();
        searchView.renderResults(state.search.result, goToPage);
    }
});

//* RECIPE CONTROLLER *//

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');

    if (id) {
        // prepare UI
        recipeView.clearRecipe();
        renderLoader(elements.recipePage);

        // create new recipe object
        state.recipe = new Recipe(id);

        if (state.search) {
            recipeView.highlightSelected(id);
        }
        
    try {
        // get data
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();

        // calc time and calc servings
        state.recipe.calcServings();
        state.recipe.calcTime();


        //render
        clearLoader();
        recipeView.renderRecipe(
            state.recipe,
            state.likes.isLiked(id)
            );
   
    } catch (error) {
        alert('An error has occurred!')
    }
        
    }

}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/* 
SHOPPING LIST CONTROLLER
*/

const controlShoppingList = () => {
    // Create a new list if none exists 
    if (!state.list) state.list = new ShoppingList(); 

    // Add each ingredient to list

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        shoppingListView.renderListItem(item);
    })
}

// Deal with deleting and updating items on shopping list

elements.shoppingList.addEventListener('click', event => {
    const id = event.target.closest('.shopping__item').dataset.itemid;

    if (event.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        shoppingListView.deleteListItem(id);
    } else if (event.target.matches('.shopping__count--value')) {
        const val = parseFloat(event.target.value, 10);
        state.list.updateCount(id, val);
    }

})

/* 
LIKES CONTROLLER
*/

// respore liked recipes on page load

window.addEventListener('load', () => {
    state.likes = new Likes();

    state.likes.readStorage();
    likesView.toggleLikesMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(el => likesView.renderLike(el));
})

const controlLikes = () => {
    if (!state.likes) state.likes = new Likes();    
    if (!state.likes.isLiked(state.recipe.id)) {
        // not liked yet 
        // add like to state
        const newLike = state.likes.addLike(
            state.recipe.id,
            state.recipe.title,
            state.recipe.publisher,
            state.recipe.img
        );
        // toggle like button
        likesView.toggleLikeBtn(true);

        // add recipe to liked list
        likesView.renderLike(newLike);
    } else {
        // remove like from state
        state.likes.removeLike(state.recipe.id);
        // toggle like button
        likesView.toggleLikeBtn(false);

        // remove recipe from liked list 
        likesView.deleteLikeItem(state.recipe.id)
    }
    likesView.toggleLikesMenu(state.likes.getNumLikes());
}


elements.recipePage.addEventListener('click', event => {
    if (event.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('desc');
        }
    } else if (event.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('incr');
    } else if (event.target.matches('.recipe__btn--addtolist, recipe__btn--addtolist *' )) {
        controlShoppingList();
    } else if (event.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLikes();
    }

    recipeView.updateServingsIngs(state.recipe);
})
