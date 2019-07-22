import {elements} from './base';

export const getInput=()=> elements.searchInput.value;

export const clearInput=()=>{ elements.searchInput.value=''; };

export const clearResult=()=>{ 
    elements.searchResultList.innerHTML='';
    elements.searchResPages.innerHTML='';
 };

 export const highlightSelected=id=>{
     const resultsArr=Array.from(document.querySelectorAll('.results_link'));
     resultsArr.forEach(el=>{
         el.classList.remove('results_link--active');
     });
    document.querySelector(`.results_link[href*="#${id}"]`).classList.add('results_link--active');
 }

export const limitRecipeTitle=(title,limit=17)=>{
    const newTitle=[];

    if(title.length>limit){
      title.split(' ').reduce((acc,cur)=>{
         if(acc+cur.length<=limit){
             newTitle.push(cur);
         }
         return acc+cur.length;
      },0);
      return `${newTitle.join(' ')} ...`;
    }
    return title;
}
const renderRecipe=recipe=>{
    const markup=`<li>
     <a class="results_link" href="#${recipe.recipe_id}"> 
        <figure class="results_fig">
             <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
                 <div class="results_data">
                        <h4 class="results_name">${limitRecipeTitle(recipe.title)}</h4>
                         <p class="results_author">${recipe.publisher}</p>
                 </div>
     </a>
 </li> `;

elements.searchResultList.insertAdjacentHTML('beforeend',markup);
};

//type: prev or next
const createButton=(page,type)=>`
<button class="btn-inline results_btn--${type}" data-goto= ${type==='prev'?page-1:page+1}>
   <span>Page ${type==='prev'?page-1:page+1}</span>
    <svg class="search_icon">
         <use href="img/icons.svg#icon-triangle-${type==='prev'?'left':'right'}"></use>
     </svg>
 </button>
`

const renderButtons=(page,numResults,resPerPage)=>{
   const pages=Math.ceil(numResults/resPerPage);
   let button;
   if(page===1 && pages>1){
       // Only button to go to next page 
      button= createButton(page,'next');
   }else if(page<pages){
       // Both buttons
      button=`
      ${button= createButton(page,'next')}
     ${button=createButton(page,'prev') }`;

   }else if(page===pages && pages>1){
       // Only button to go to prev page 
       button=createButton(page,'prev');
   }
    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
};

export const renderResults= (recipes,page=1,resPerPage=10)=>{
    //render results of current page 
    const start=(page-1)*resPerPage;
    const end=page*resPerPage;

    recipes.slice(start,end).forEach(element => renderRecipe(element));

    //render pagination button
    renderButtons(page,recipes.length,resPerPage);
};