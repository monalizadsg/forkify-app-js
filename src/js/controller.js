import icons from 'url:../img/icons.svg';
import 'core-js'; // polyfill for everything
import 'regenerator-runtime/runtime'; // polyfill for async/await

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

const renderSpinner = function (parentEl) {
  const markUp = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markUp);
};

const displayRecipe = async function () {
  try {
    // 1. Loading recipe
    renderSpinner(recipeContainer);

    const res = await fetch(
      'https://forkify-api.jonas.io/api/v2/recipes/5ed6604591c37cdc054bc886'
    );
    const data = await res.json();

    // we can use the ok property of the response to throw an error
    // the error we throw in here will be catch down below and be displayed in the alert
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    console.log(res, data);

    let { recipe } = data.data;
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    // Problem that we encountered here:
    // The icons are not displaying because we are still using the path (src/img/icons.svg#icon-users)
    // not the assets coming from the dist folder
    // to fix that we need to have a way to tell Javascript to use the asset from the dist folder
    // we can achieve that by importing the icon by doing this (this is with the help of parcel)
    // import icons from 'url:../img/icons.svg';
    // console.log(icons); -> http://localhost:1234/icons.dfd7a6db.svg?1739458756239
    // as you can see when we import, we are now accessing the icons from the dist folder
    // we can now change the path to icons

    // 2) Rendering recipe
    const markUp = `
        <figure class="recipe__fig">
          <img src="${recipe.image}" alt="${
      recipe.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${recipe.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              recipe.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              recipe.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round">
            <svg class="">
              <use href="${icons}#icon-bookmark-fill"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${recipe.ingredients
              .map(ing => {
                return `<li class="recipe__ingredient">
                          <svg class="recipe__icon">
                            <use href="${icons}#icon-check"></use>
                          </svg>
                          <div class="recipe__quantity">${ing.quantity}</div>
                          <div class="recipe__description">
                            <span class="recipe__unit">${ing.unit}</span>
                            ${ing.description}
                          </div>
                      </li>`;
              })
              .join('')}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              recipe.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${recipe.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
        `;

    // first, get rid of the current html in the recipe (ie.. Start by searching)
    recipeContainer.innerHTML = '';

    // attach to the parent DOM
    recipeContainer.insertAdjacentHTML('afterbegin', markUp);
  } catch (error) {
    alert(error);
  }
};

displayRecipe();
