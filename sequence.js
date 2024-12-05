const remoteRecipes = require("./recipes.json");
const remoteIngridients = require("./ingridients.json");

let alcohols = Object.entries(remoteIngridients)
  .filter((ingridient) => ingridient[1].abv > 0)
  .map((ingridient) => ingridient[0]);

let remainingCocktails = remoteRecipes.map((recipe) => ({
  name: recipe.name,
  ingredients: recipe.ingredients
    .map((ingredient) => ingredient.ingredient)
    .filter(Boolean)
    .filter((ingridient) => alcohols.includes(ingridient)),
}));

let myChoice = "Gin";

let myChoiceInThisRound = myChoice;

function getNextCocktails(alcoholInThisRound, cocktailsInThisRound) {
  let cocktailsWithMyChoice = cocktailsInThisRound.filter((cocktail) =>
    cocktail.ingredients.includes(alcoholInThisRound)
  );

  let cocktailsChosen = cocktailsWithMyChoice.filter(
    (cocktail) => cocktail.ingredients.length == 1
  );

  return cocktailsChosen;
}

function getNewRemainingCoctails(
  cocktailsRemaining,
  cocktailsChosen,
  alcoholInThisRound
) {
  let cocktailsNotChosen = cocktailsRemaining.filter(
    (cocktail) => !cocktailsChosen.includes(cocktail)
  );

  let coctailsWithRemovedChoice = cocktailsNotChosen.map((cocktail) => ({
    name: cocktail.name,
    ingredients: cocktail.ingredients.filter(
      (ingredient) => ingredient != alcoholInThisRound
    ),
  }));
  return coctailsWithRemovedChoice;
}

function getNextAlcohol(newRemainingCoctails) {
  let cocktailsWithOnlyRemainingComponent = newRemainingCoctails.filter(
    (cocktail) => cocktail.ingredients.length == 1
  );

  let componentsInCocktailsToEval = cocktailsWithOnlyRemainingComponent
    .map((cocktail) => cocktail.ingredients)
    .flat();

  let counts = componentsInCocktailsToEval.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});

  let sortedByValues = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return sortedByValues[0][0];
}

for (let i = 0; i < 20; i++) {
  console.log("Cocktails revealed adding", myChoiceInThisRound, ":");

  coctailsInThisRound = getNextCocktails(
    myChoiceInThisRound,
    remainingCocktails
  );
  console.log(coctailsInThisRound);
  remainingCocktails = getNewRemainingCoctails(
    remainingCocktails,
    coctailsInThisRound,
    myChoiceInThisRound
  );

  myChoiceInThisRound = getNextAlcohol(remainingCocktails);
}
