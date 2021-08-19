const APIKEY = apiconfig.API_TOKEN;

let cleanCreditsList = [];

let baconList = "";

let knownToBacon = [];


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
$(".submit-button").on("click", () => {
  let userGuess = $(".text-box").val();
  //   console.log("The user has entered", userGuess);
  digUp(userGuess);
});


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
$(".submit-button-actor").on("click", () => {
  let userGuess = $(".text-box-person").val();
  //   console.log("The user has entered", userGuess);

  let returnData = digUpPerson(userGuess);

  //   console.log("inside actor event listener,", returnData);
});


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
$(".submit-button-finder").on("click", () => {
  let userGuess = $(".text-box-finder").val();
  //   console.log("The user has entered", userGuess);

  let returnData = finder(userGuess);

  //   console.log("inside finder event listener,", returnData);
});


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
$(".submit-button-kevin").on("click", () => {

  // console.log("knwonToBacon", knownToBacon);

  localStorage.setItem('carryOverBaconList', knownToBacon);

  const carryOverBacon = localStorage.getItem('carryOverBaconList');

  console.log("caryOverBacon", carryOverBacon);

  console.log("knownToBacon", knownToBacon);

});


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//takes in a castlist 
function makeKnownList(castList) {
  for (const castMember of castList) {
    // console.log("scrubbing for", castMember)
    // console.log("castMember is", castMember);


    if (castMember.name === "Kevin Bacon") {
      continue;
    } else if (knownToBacon.includes(castMember.name)) {
      continue;
    } else {
      knownToBacon.push(castMember);
    }
  }
};


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//returns, as an object, the movie details
async function getMovieByName(keyword, ) {

  const rawMovieResults = await fetch(
    "https://api.themoviedb.org/3/search/movie/?api_key=" +
    APIKEY +
    "&language=en-US&query=" +
    keyword +
    "&page=1&include_adult=false"
  );

  const movieResults = await rawMovieResults.json();

  // console.log("index 0 for movieResults,", movieResults.results[0].title);

  return movieResults[0];

};





////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
async function checkCreditId(keyword) {
  //   console.log("finding movie credit data on ID#", keyword);

  const rawData = await fetch(
    "https://api.themoviedb.org/3/credit/" + keyword + "?api_key=" + APIKEY
  );

  const whatCreditIsThis = await rawData.json();

  //   console.log("credit_id#", keyword, "is listed as:", whatCreditIsThis);
};


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
async function actorById(actorId) {
  const actor = await fetch(
    "https://api.themoviedb.org/3/person/" +
      actorId +
      "?api_key=" +
      APIKEY +
      "&append_to_response=movie_credits"
  );

  const actorData = await actor.json();

  //   console.log("See below for actor data");
  //   console.log(actorData);
};


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
async function getAllActingCredits(actor) {
  //   console.log("Searching TMDB for: ", actor);

  const rawSearchForActorByName = await fetch(
    "https://api.themoviedb.org/3/search/person?api_key=" +
      APIKEY +
      "&language=en-US&query=" +
      decodeURI(actor) +
      "&page=1&include_adult=false"
  );

  const searchForActorByName = await rawSearchForActorByName.json();

  //   console.log("Received the following data:", searchForActorByName);
  //   console.log("First result is:", searchForActorByName.results[0]);

  const firstId = searchForActorByName.results[0].id;

  //   console.log("First result id# is:", firstId);

  getAllActingCreditsB(firstId, actor);
};


//will return the actor details object for the given actor's name
async function getActorByName (actor) {

  const rawActorResults = await fetch(
    "https://api.themoviedb.org/3/search/person?api_key=" +
      APIKEY +
      "&language=en-US&query=" +
      decodeURI(actor) +
      "&page=1&include_adult=false"
  );

  let actorResults = await rawActorResults.json();

  // console.log("actorDetails is a", typeof actorResults, "and contains:", actorResults);

  let resultsLength = actorResults.results.length;

  for (let i=0; i < resultsLength; i++) {
        if (actorResults.results[i].known_for_department === "Acting") {
          continue
        } else {
          productionCredit = actorResults.results.splice(i, 1);
        }
  }

  // console.log ("Cleaned actorResults first index", actorResults.results[0]);

  return actorResults.results[0];

}








////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
async function getActingCredits(actorId) {

  const rawActingCredits = await fetch(
    "https://api.themoviedb.org/3/person/" +
      actorId +
      "/movie_credits?api_key=" +
      APIKEY +
      "&language=en-US"
  );

  const actingCredits = await rawActingCredits.json();

  // console.log("actingCredits received:", actingCredits);

  return actingCredits;


};





////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
async function getMovieCredits(movieId) {

  const rawMovieCredits = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${APIKEY}&language=en-US`
  );

  const movieCredits = await rawMovieCredits.json();

  // console.log(movieCredits.cast);

  return movieCredits.cast;

};


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
async function baconFunc1(id) {
  // console.log("finding movie credits on ID#", id);

  const rawData = await fetch(
    "https://api.themoviedb.org/3/movie/" +
      id +
      "/credits?api_key=" +
      APIKEY +
      "&language=en"
  );

  const movieCreditsData = await rawData.json();

  // console.log(movieCreditsData.cast);

  const castList = movieCreditsData.cast;

  makeKnownList(castList);
};


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//look through an array of actor's credits
//returns an array of those credits, with certain genres removed
async function cleanCredits(creditsArray) {

  for (const credit of creditsArray) {
    const genreList = credit.genre_ids;

    //remove all genre_ids, from the genreList, that are linked to movies on our exclude list
    //return this 'scrubbed' array of genres
    const filteredList = genreList.filter(checkGenres);

    //if any genre_ids remain, for an idividual credit, send it's title & id to a new array
    if (filteredList.length > 0) {
      // console.log("This is a clean credit", credit);
      cleanCreditsList.push(credit);
      // cleanCreditsList.push(credit.title);
      // cleanCreditsList.push(credit.id);
    }
  }

  for (const credit of cleanCreditsList) {
    baconFunc1(credit.id);
  }
};


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
async function scrubCredits(creditsArray) {

  for (const credit of creditsArray) {

    const genreList = credit.genre_ids;

    const filteredList = genreList.filter(checkGenres);

    if (filteredList.length > 0) {
      cleanCreditsList.push(credit);
    }
  }

  // console.log(cleanCreditsList);

  return cleanCreditsList;

};

  // for (const credit of cleanCreditsList) {
  //   baconFunc1(credit.id);
  // }


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//looks through an array of genre_ids, and returns false if the movie fits one of the 'if' statements
function checkGenres(genre) {
  // console.log("checkGenres function begins")
  // console.log(genre);

  //documentary
  if (genre === 99) {
    return false;
  }

  //tv_movie
  if (genre === 10770) {
    return false;
  }

  //music
  if (genre === 10402) {
    return false;
  }

  return true;
};


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// getAllActingCredits("Kevin Bacon");









async function getStepsToBacon (actor) {




    //get the details on the submitted actor
  const actorDetails = await getActorByName(actor);

  // console.log(actorDetails);

    //get all of this actor's credits
  const actorCredits = await getActingCredits(actorDetails.id);

  // console.log(actorCredits.cast);

    //remove any credits that are not acting
  const scrubbedCredits = await scrubCredits(actorCredits.cast);

  // console.log(scrubbedCredits);

    //for all of the remaining movies, get the castlist for those movies
  for (const credit of scrubbedCredits) {



    const movieCastList = await getMovieCredits(credit.id);

    // console.log(movieCastList);
      let actorCastList = [];
      //create a list of every actor, in the chosen movie
    for (const actor of movieCastList) {

      let name = actor.name;

      actorCastList.push(name);

    }
console.log(credit.title, actorCastList);
  }






}










// getActorByName("Vin Diesel");

getMovieByName("Iron Man");

getMovieByName("Jaws");

getStepsToBacon("Vin Diesel");