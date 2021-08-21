const APIKEY = apiconfig.API_TOKEN;

let cleanCreditsList = [];

let baconList = "";

let knownToBacon = [];


  // ////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////
  // $(".submit-button").on("click", () => {
  //   let userGuess = $(".text-box").val();
  //   //   console.log("The user has entered", userGuess);
  //   digUp(userGuess);
  // });
  // ////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////
  // $(".submit-button-actor").on("click", () => {
  //   let userGuess = $(".text-box-person").val();
  //   console.log("Checking if", userGuess, "has ever worked with Kevin Bacon");
  //   baconBoo(userGuess);
  // });
  // ////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////
  // $(".submit-button-finder").on("click", () => {
  //   let userGuess = $(".text-box-finder").val();
  //   //   console.log("The user has entered", userGuess);
  // });
  // ////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////
  // $(".submit-button-kevin").on("click", () => {
  //   async function clickBacon() {
  //     const baconBacon = await workedWithBacon("Kevin Bacon");
  //     console.log(baconBacon);
  //     for (const actor of baconBacon) {
  //       $(".text-here").append(`<li>${actor}</li>`);
  //     }
  //   }
  //   let buttonOutput = clickBacon();
  //   console.log(buttonOutput);
  //   console.log($("ul li").eq(1).text());
  // });
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  //takes in a castlist


// const submitGuess = async function entryGuess(actor) {

//   console.log("submit guess");

//   console.log(actor);

// }

// $(".entry-button").on("click", submitGuess($(".entry-box").val()))

// $(".entry-button").on("click", () => {
//   console.log("entry button");

//   let entry = $(".entry-box").val();

//   console.log(entry);
// })

  $(".entry-button").on("click", async function () {
    let userGuess = $(".text-box").val();
    console.log("The user has entered", userGuess);
    let actor = await getActorByName(userGuess);
    console.log(actor);
    return getImagesById(actor);
  });






async function getImagesById (actor) {

  const rawImageResults = await fetch (
  `https://api.themoviedb.org/3/person/${actor.id}/images?api_key=${APIKEY}`
  );
  
  const imageResults = await rawImageResults.json();

  console.log(imageResults.profiles[0]);

  let imagePath = decodeURI(imageResults.profiles[0].file_path);

  let imageSrc = `https://image.tmdb.org/t/p/w185${imagePath}`;

  $(".aa").append(
    `<img src="${imageSrc}" class="actor-image">`
  );

}


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
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  //returns, as an object, the movie details
  async function getMovieByName(keyword) {
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
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  async function checkCreditId(keyword) {
    //   console.log("finding movie credit data on ID#", keyword);

    const rawData = await fetch(
      "https://api.themoviedb.org/3/credit/" + keyword + "?api_key=" + APIKEY
    );

    const whatCreditIsThis = await rawData.json();

    //   console.log("credit_id#", keyword, "is listed as:", whatCreditIsThis);
  }

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
  }

  //will return the actor details object for the given actor's name
  async function getActorByName(actorName) {
    const rawActorResults = await fetch(
      "https://api.themoviedb.org/3/search/person?api_key=" +
        APIKEY +
        "&language=en-US&query=" +
        decodeURI(actorName) +
        "&page=1&include_adult=false"
    );

    const actorResults = await rawActorResults.json();

    // console.log(actorResults.results[0]);

    return actorResults.results[0];
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  async function getActingCredits(actor) {
    const rawActingCredits = await fetch(
      "https://api.themoviedb.org/3/person/" +
        actor.id +
        "/movie_credits?api_key=" +
        APIKEY +
        "&language=en-US"
    );

    const actingCredits = await rawActingCredits.json();

    // console.log("actingCredits received:", actingCredits);

    return actingCredits;
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  async function getMovieCredits(movieId) {
    const rawMovieCredits = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${APIKEY}&language=en-US`
    );

    const movieCredits = await rawMovieCredits.json();

    // console.log(movieCredits.cast);

    return movieCredits.cast;
  }

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

    const castList = movieCreditsData.cast;

    makeKnownList(castList);
  }

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
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  async function scrubCredits(creditsArray) {
    // console.log(creditsArray);
    let cleanCreditsList = [];
    for (const credit of creditsArray) {
      const genreList = credit.genre_ids;

      const filteredList = genreList.filter(checkGenres);

      if (filteredList.length > 0) {
        cleanCreditsList.push(credit);
      }
    }

    // console.log(cleanCreditsList);

    return cleanCreditsList;
  }

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
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  async function getCreditById(actor) {
    // console.log(actor);

    const rawCreditDetails = await fetch(
      `https://api.themoviedb.org/3/credit/${actor.credit_id}?api_key=${APIKEY}&language=en-US`
    );

    const creditDetails = await rawCreditDetails.json();

    // console.log(creditDetails);

    return creditDetails;
  }


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
async function workedWithBacon(name) {
  const actorPrime = await getActorByName(name);

  const actorCredits = await getActingCredits(actorPrime);

  const scrubbedCredits = await scrubCredits(actorCredits.cast);

  let firstConnections = [];

  for (const credit of scrubbedCredits) {
    // console.log(credit);

    const movieCharacterList = await getMovieCredits(credit.id);
    // console.log(movieCharacterList);
    let characterList = [];

    //find the details of every character in the movie, add it to an array
    for (const character of movieCharacterList) {
      // console.log("We have the character", character, "  - we have their name as", character.name);

      if (character.name === actorPrime.name) {
        // console.log("found the actor themselves")
        continue;
      }

      if (character.name === "Kevin Bacon") {
        console.log("Got him!", character);
        console.log(movieCharacterList);
        return true;
      }

      if (characterList.includes(character.name)) {
        // console.log("found a repeat")
        continue;
      } else {
        // console.log("this one is clear", character.name);
        characterList.push(character.name);
      }
    }

    for (const actorName of characterList) {
      firstConnections.push(actorName);
    }
    // console.log(firstConnections);
  }
  console.log("We have completed the search on", actorPrime.name);
  return firstConnections;
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
async function baconBoo(actorName) {
  const baconFriend = await workedWithBacon(actorName);

  if (baconFriend === true) {
    return console.log("we got a first connection");
  } else {
    for (const actorName of baconFriend) {
      const secondConnections = await workedWithBacon(actorName);
      if (secondConnections === true) {
        return console.log("we got a second connection");
      } else {
        continue;
      }
    }
    console.log("Still nothing");
  }
}

let baconBuddies = 0;

async function clickBacon() {
  const baconBacon = await workedWithBacon("Kevin Bacon");

  baconBacon;

  for (const actor of baconBacon) {
    $(".text-here").append(`<li>${actor}</li>`);
    baconBuddies++;
  }
}

const buttonOutput = clickBacon();

console.log(buttonOutput);

const firstRelations = $("ul li");



console.log($("ul li").eq(1).text());

$(".log-b-1").on("click", () => {

  console.log("begin logging");
  console.log(firstRelations);

  for (let i=0; i < baconBuddies; i++) {

    console.log($("ul li").eq(i).text());

  }

})