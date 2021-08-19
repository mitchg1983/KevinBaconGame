const baseURL = "https://api.themoviedb.org/3/";

const APIKEY = apiconfig.API_TOKEN;

const config = "https://api.themoviedb.org/3/configuration?api_key=" + APIKEY;

const search =
  "https://api.themoviedb.org/3/search/movie?api_key=" + APIKEY + "&query=";

const person = "https://api.themoviedb.org/3/search/person/";

let cleanCreditsList = [];




// async function talk() {
//   //   console.log("fetching config");

//   const rawData = await fetch(config);
//   const data = await rawData.json();

//   //   console.log("config data", data);
//   return data;
// }

// talk();

// async function digUp(keyword) {
//   //   console.log("fetching search for", keyword);

//   const rawData = await fetch(search + decodeURI(keyword));
//   const data = await rawData.json();

//   //   console.log(data);
//   //   console.log("Results of data:", data.results);
//   //   console.log("First returned result is - ", data.results[0]);

//   const movieId = data.results[0].id;

//   movieCredits(movieId);

//   return data;
// }

async function movieCredits(keyword) {
  //   console.log("finding movie credits on ID#", keyword);

  const rawData = await fetch(
    "https://api.themoviedb.org/3/movie/" +
      keyword +
      "/credits?api_key=" +
      APIKEY +
      "&language=en"
  );

  const movieCreditsData = await rawData.json();

  //   console.log(movieCreditsData);

  //   console.log("credit_id is...", movieCreditsData.cast[0].credit_id);

  checkCreditId(movieCreditsData.cast[0].credit_id);
}



async function checkCreditId(keyword) {
  //   console.log("finding movie credit data on ID#", keyword);

  const rawData = await fetch(
    "https://api.themoviedb.org/3/credit/" + keyword + "?api_key=" + APIKEY
  );

  const whatCreditIsThis = await rawData.json();

  //   console.log("credit_id#", keyword, "is listed as:", whatCreditIsThis);
}



// async function digUpPerson(keyword) {
//   //   console.log("fetching data on", keyword);

//   const rawData = await fetch(
//     "https://api.themoviedb.org/3/search/person?api_key=" +
//       APIKEY +
//       "&language=en-US&query=" +
//       decodeURI(keyword) +
//       "&page=1&include_adult=false"
//   );

//   const data = await rawData.json();

//   //   console.log(data);
//   //   console.log("Results of data:", data.results);
//   //   console.log("First returned result is - ", data.results[0]);
//   //   console.log("First returned result, 'id' is", data.results[0].id);

//   $(".output-box").text(data.results[0]);

//   const picAddress = data.results[0].profile_path;

//   const portrait =
//     "<img src='http://image.tmdb.org/t/p/w185" + picAddress + "'>";

//   //   console.log(portrait);

//   $(".output-box").append(portrait);

//   return data;
// }


// async function finder(keyword) {

//   //   console.log("finding data on", keyword);

//   const rawData = await fetch(
//     "https://api.themoviedb.org/3/search/person?api_key=" +
//       APIKEY +
//       "&language=en-US&query=" +
//       decodeURI(keyword) +
//       "&page=1&include_adult=false"
//   );

//   const data = await rawData.json();

//   //   console.log(data);

//   //
//   //
//   const actorId = data.results[0].id;

//   //   console.log("fetching actor by id#", actorId);

//   actorById(actorId);

//   return data;
// }

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
}

//
//

$(".submit-button").on("click", () => {
  let userGuess = $(".text-box").val();
  //   console.log("The user has entered", userGuess);
  digUp(userGuess);
});

$(".submit-button-actor").on("click", () => {
  let userGuess = $(".text-box-person").val();
  //   console.log("The user has entered", userGuess);

  let returnData = digUpPerson(userGuess);

  //   console.log("inside actor event listener,", returnData);
});

$(".submit-button-finder").on("click", () => {
  let userGuess = $(".text-box-finder").val();
  //   console.log("The user has entered", userGuess);

  let returnData = finder(userGuess);

  //   console.log("inside finder event listener,", returnData);
});


let baconList = "";

let knownToBacon = [];



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

}



async function getAllActingCreditsB(firstId, actor) {
  //   console.log("Retrieving data on actor:", actor, "with id#:", firstId);

  const rawActingCredits = await fetch(
    "https://api.themoviedb.org/3/person/" +
      firstId +
      "?api_key=" +
      APIKEY +
      "&append_to_response=movie_credits"
  );

  const actingCredits = await rawActingCredits.json();

  //   console.log("Received the following data:", actingCredits);
  //   console.log(actor, "all credits:", actingCredits.movie_credits.cast);

  baconList = actingCredits.movie_credits.cast;

  //   console.log("baconList is:", baconList);



  cleanCredits(baconList)

}


//   const cleanBacon = await cleanCredits(baconList);





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

  }


function makeKnownList (castList) {

    for (const castMember of castList) {
    // console.log("scrubbing for", castMember)

    const name = castMember.name;

    // console.log(name);

    if (name === "Kevin Bacon") {
      // console.log("filtering out", name)
      continue;
    } else if (knownToBacon.includes(name)) {
      // console.log("filtering out", name)
      continue;
    } else {
      // console.log(name, "looks good");
      knownToBacon.push(name);
    }
  }

}


//look through an array of actor's credits
//returns an array of those credits, with certain genres removed
function cleanCredits(creditsArray) {

  for (const credit of creditsArray) {

    const genreList = credit.genre_ids;
    
    //remove all genre_ids, from the genreList, that are linked to movies on our exclude list
    const filteredList = genreList.filter(checkGenres);

    //if any genre_ids remain, for an idividual credit, send it's title & id to a new array
    if (filteredList.length > 0) {
      cleanCreditsList.push(credit.title);
      cleanCreditsList.push(credit.id);
    }
  }

    for (let i = 0; i <= cleanCreditsList.length; i++) {
    
        //should use objects here
        if (i % 2 !== 0) {
          baconFunc1(cleanCreditsList[i]);
        }

        console.log(cleanCreditsList.length);

        if (i === cleanCreditsList.length) {
            console.log(knownToBacon.length);
        }
      }
    
    }
    

  




//looks through an array of genre_ids, and returns false if the movie fits one of the 'if' statements
function checkGenres(genre) {

  // console.log("checkGenres function begins");
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

getAllActingCredits("Kevin Bacon");

