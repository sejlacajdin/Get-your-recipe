import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements,renderLoader,clearLoader} from './views/base';

/* Global state of the app 
 - Search object 
 - Current recipe object
 - Shopping list object
 - Liked recipes
 */
const state={};

/* SEARCH CONTROLLER */
const controlSearch=async ()=>{
    // 1. Get query from the view 
    const query=searchView.getInput();
   

    if(query){
        // 2. New search object and add to state
        state.search=new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);

        try{
            // 4. Search for recipes
           await state.search.getResult();
    
            // 5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        }catch(err){
            alert('Something is wrong with the search..');
            clearLoader();
        }
    }
}
elements.searchForm.addEventListener('submit',e=>{
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click',e=>{
    const btn=e.target.closest('.btn-inline');
    if(btn){
        const goToPage=parseInt(btn.dataset.goto,10);
        searchView.clearResult();
        searchView.renderResults(state.search.result,goToPage);
       
    }

});

/* RECIPE CONTROLLER */
const controleRecipe=async ()=>{
    // Get ID from url
     const id=window.location.hash.replace('#','');

     if(id){
         //Prepare UI for changes 
         recipeView.clearRecipe();
        renderLoader(elements.recipe);
        
        //Highlight selected search item 
       if(state.search) searchView.highlightSelected(id);

        //Create new recipe object
        state.recipe=new Recipe(id);
        
        try{
             //Get recipe data and parse ingredients
         await   state.recipe.getRecipe();
         state.recipe.parseIngredients();
         
         //Calculate servings and time
         state.recipe.calcTime();
         state.recipe.calcServings();
         //Render recipe 
         clearLoader();
         recipeView.renderRecipe(state.recipe,state.likes.isLiked(id));
         console.log(state.recipe);
         }catch(error){
             console.log(error);
             alert('Error procesing recipe');
         }
     }
    
};

//window.addEventListener('hashchange',controleRecipe);
['hashchange','load'].forEach(event=>window.addEventListener(event,controleRecipe));

/* LIST CONTROLLER */
const controlList=()=>{
     //Create a new list IF there is none yet 
     if(!state.list) state.list=new List();

     //Add each ingredient to the list and UI
     state.recipe.ingredients.forEach(el=>{
        const item= state.list.addItem(el.count,el.unit,el.ingredient);
        listView.renderItem(item);
     });
}

//Handle delete and update list item events
elements.shopping.addEventListener('click',e=>{
    const id=e.target.closest('.shopping_item').dataset.itemid;

    //Handle the delete button
    if(e.target.matches('.shopping_delete, .shopping_delete *')){
        //Delete from state
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);
       
        //Handle the count update
    }else if(e.target.matches('.shopping_count--value')){
        if(e.target.value>0){
        const val= parseFloat(e.target.value);
        state.list.updateCount(id,val);
    }
}
});


/* LIKE CONTROLLER */
const controlLike=()=>{
    if(!state.likes) state.likes=new Likes();
    const currentID= state.recipe.id;

    if(!state.likes.isLiked(currentID)){
        //Add like to the state 
        const newLike=state.likes.addLike(currentID,state.recipe.title,state.recipe.author,state.recipe.img);

        //Toggle the like button
        likesView.toggleLikeBtn(true);
        //Add like to UI list
        likesView.renderLike(newLike);

    }else {
        //Remove like from the state 
        state.likes.deleteLike(currentID);

        //Toggle the like button
        likesView.toggleLikeBtn(false);

        //Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load',()=>{
    state.likes=new Likes();

    //Restore likes
    state.likes.readStorage();

    //Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //Render the existing likes
     state.likes.likes.forEach(el=>likesView.renderLike(el));
});


// Handling recipe button clicks
elements.recipe.addEventListener('click',e=>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings>1)
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);

    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    }else if(e.target.matches('.recipe_btn--add, .recipe_btn--add *')){
        //Add ingredients to shopping list
        controlList();
    }else if(e.target.matches('.recipe_love,.recipe_love *')){
        //Like controller
        controlLike();
    }

});

