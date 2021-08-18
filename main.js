/*************
SAMPLE URLS

1. To get the config data like image base urls
https://api.themoviedb.org/3/configuration?api_key=<APIKEY>

2. To fetch a list of movies based on a keyword
https://api.themoviedb.org/3/search/movie?api_key=<APIKEY>&query=<keyword>

3. To fetch more details about a movie
https://api.themoviedb.org/3/movie/<movie-id>?api_key=<APIKEY>
*************/
//const APIKEY is inside key.js

const baseURL = "https://api.themoviedb.org/3/";

const APIKEY = apiconfig.API_TOKEN;

const config = "https://api.themoviedb.org/3/configuration?api_key=" + APIKEY;

const search =
  "https://api.themoviedb.org/3/search/movie?api_key=" + APIKEY + "&query=";

const person = "https://api.themoviedb.org/3/search/person/";

async function talk() {
  console.log("fetching config");

  const rawData = await fetch(config);
  const data = await rawData.json();

  console.log("config data", data);
  return data;
}

talk();

async function digUp(keyword) {
  console.log("fetching search for", keyword);

  const rawData = await fetch(search + decodeURI(keyword));
  const data = await rawData.json();

  console.log(data);
  console.log("Results of data:", data.results);
  console.log("First returned result is - ", data.results[0]);

  const movieId = data.results[0].id;

  movieCredits(movieId);

  return data;
}

async function movieCredits(keyword) {
  console.log("finding movie credits on ID#", keyword);

  const rawData = await fetch(
    "https://api.themoviedb.org/3/movie/" +
      keyword +
      "/credits?api_key=" +
      APIKEY +
      "&language=en"
  );

  const movieCreditsData = await rawData.json();

  console.log(movieCreditsData);

  console.log("credit_id is...", movieCreditsData.cast[0].credit_id);

  checkCreditId(movieCreditsData.cast[0].credit_id);
}

async function checkCreditId(keyword) {
  console.log("finding movie credit data on ID#", keyword);

  const rawData = await fetch(
    "https://api.themoviedb.org/3/credit/" + keyword + "?api_key=" + APIKEY
  );

  const whatCreditIsThis = await rawData.json();

  console.log("credit_id#", keyword, "is listed as:", whatCreditIsThis);
}

async function digUpPerson(keyword) {
  console.log("fetching data on", keyword);

  const rawData = await fetch(
    "https://api.themoviedb.org/3/search/person?api_key=" +
      APIKEY +
      "&language=en-US&query=" +
      decodeURI(keyword) +
      "&page=1&include_adult=false"
  );

  const data = await rawData.json();

  console.log(data);
  console.log("Results of data:", data.results);
  console.log("First returned result is - ", data.results[0]);
  console.log("First returned result, 'id' is", data.results[0].id);

  $(".output-box").text(data.results[0]);

  const picAddress = data.results[0].profile_path;

  const portrait =
    "<img src='http://image.tmdb.org/t/p/w185" + picAddress + "'>";

  console.log(portrait);

  $(".output-box").append(portrait);

  return data;
}

//
//
async function finder(keyword) {
  //
  //
  console.log("finding data on", keyword);

  const rawData = await fetch(
    "https://api.themoviedb.org/3/search/person?api_key=" +
      APIKEY +
      "&language=en-US&query=" +
      decodeURI(keyword) +
      "&page=1&include_adult=false"
  );

  const data = await rawData.json();

  console.log(data);

  //
  //
  const actorId = data.results[0].id;

  console.log("fetching actor by id#", actorId);

  actorById(actorId);

  return data;
}

async function actorById(actorId) {
  const actor = await fetch(
    "https://api.themoviedb.org/3/person/" +
      actorId +
      "?api_key=" +
      APIKEY +
      "&append_to_response=movie_credits"
  );

  const actorData = await actor.json();

  console.log("See below for actor data");
  console.log(actorData);
}

//
//

$(".submit-button").on("click", () => {
  let userGuess = $(".text-box").val();
  console.log("The user has entered", userGuess);
  digUp(userGuess);
});

$(".submit-button-actor").on("click", () => {
  let userGuess = $(".text-box-person").val();
  console.log("The user has entered", userGuess);

  let returnData = digUpPerson(userGuess);

  console.log("inside actor event listener,", returnData);
});

$(".submit-button-finder").on("click", () => {
  let userGuess = $(".text-box-finder").val();
  console.log("The user has entered", userGuess);

  let returnData = finder(userGuess);

  console.log("inside finder event listener,", returnData);
});

async function getAllActingCredits(actor) {
  console.log("Searching TMDB for: ", actor);

  const rawSearchForActorByName = await fetch(
    "https://api.themoviedb.org/3/search/person?api_key=" +
      APIKEY +
      "&language=en-US&query=" +
      decodeURI(actor) +
      "&page=1&include_adult=false"
  );

  const searchForActorByName = await rawSearchForActorByName.json();

  console.log("Received the following data:", searchForActorByName);

  console.log("First result is:", searchForActorByName.results[0]);

  const firstId = searchForActorByName.results[0].id;

  console.log("First result id# is:", firstId);

  getAllActingCreditsB(firstId, actor);
}

let baconList = "";

async function getAllActingCreditsB(firstId, actor) {
  console.log("Retrieving data on actor:", actor, "with id#:", firstId);

  const rawActingCredits = await fetch(
    "https://api.themoviedb.org/3/person/" +
      firstId +
      "?api_key=" +
      APIKEY +
      "&append_to_response=movie_credits"
  );

  const actingCredits = await rawActingCredits.json();

  console.log("Received the following data:", actingCredits);

  console.log(actor, "all credits:", actingCredits.movie_credits.cast);

  baconList = actingCredits.movie_credits.cast;

  console.log("baconList is:", baconList);

  cleanCredits(baconList);
}

getAllActingCredits("Kevin Bacon");

let cleanCreditList = [];

function cleanCredits(creditsArray) {
  let rawCreditList = [];

  for (const creditObj of creditsArray) {
    // console.log("This credit is:", credit);
    //
    //
    //here is what we do. we have a list of all the credits.
    //we want to iterate through all credits, BEFORE, adding to official list.
    //filter out all music, documentaries and anything else not applicable. We will hopefully have a list
    //of movies that he has only acted in.
    //
    //From there, find every ector he has every worked with. add it to an array called 1st relation.
    //Do this until we have a list, 6 deep, of potentially every single person who is a possible match
    //for the game.
    //we can use this as a filter, so players cannot enter names? maybe an option.

    rawCreditList.push(creditObj);
  }

  console.log(rawCreditList);
}

function checkGenres(genre) {
  if (genre === 99) {
    return false;
  }

  if (genre === 10770) {
    return false;
  }

  if (genre === 10402) {
    return false;
  }
}
