import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe () {
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.ingredients = res.data.recipe.ingredients;
            this.img = res.data.recipe.image_url;
            this.publisher = res.data.recipe.publisher;
            this.source = res.data.recipe.source_url;
        }
        catch (error) {
            alert(error);
        }
    }

    calcTime () {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time = periods * 15;
    }

    calcServings () {
        this.servings = 4
    }

    parseIngredients () {
        const oldIngredients = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const newIngredients = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...newIngredients, 'kg', 'g'];

        const newIngs = this.ingredients.map(el => {
            // Uniform metrics
            let ingredient = el.toLowerCase();
            oldIngredients.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, newIngredients[i]);
            })

            // get rid of text in parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // parse ingredient into count, unit, and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                // there is a unit
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrCount.join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIng[0], 10)) {
                // these is a no unit but first element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // there is no unit
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;
        })

        this.oldingredients = this.ingredients; // for checking
        this.ingredients = newIngs;
    }

    updateServings (type) {
        const newServings = type === 'desc' ? this.servings - 1 : this.servings + 1;

        this.ingredients.forEach(el => {
            el.count *= (newServings/this.servings);
        })

        this.servings = newServings;
    }
}