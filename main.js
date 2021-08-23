const APIKEY = apiconfig.API_TOKEN;

let cleanCreditsList = [];

let baconList = "";

let knownToBacon = [];

let count = 0;

let baconBuddies = 0;

let lastActor = {};

let devConnections = [];


//this code builds a list of actors that Kevin Bacon has worked with, and stores it
const buttonOutput = clickBacon();

console.log(buttonOutput);

const firstRelations = $("ul li");

console.log($("ul li").eq(1).text());

$(".log-b-1").on("click", () => {
  console.log("begin logging");
  console.log(firstRelations);

  for (let i = 0; i < baconBuddies; i++) {
    console.log($("ul li").eq(i).text());
  }
});

const tierONE = devBACON("Kevin Bacon");

console.log(tierONE);


//
//
//FUNCTIONS
//
//
async function connector(name) {
  const actorPrime = await getActorByName(name);

  const actorCredits = await getActingCredits(actorPrime);

  const scrubbedCredits = await scrubCredits(actorCredits.cast);

  return scrubbedCredits;
}


//USER enters a new guess
$(".entry-button").on("click", entryClick);





async function entryClick () {
  let userGuess = $(".text-box").val();
  console.log("The user has entered", userGuess);

  console.log(lastActor.name);

  const thisCheck = await workedWithBacon(lastActor.name);

  console.log(thisCheck);

  if (thisCheck.includes(userGuess)) {
    console.log(userGuess, "They share a credit.", lastActor.name);
    count++;
  } else {
    return console.log("no match, try again");
  }

  let actor = await getActorByName(userGuess);
  console.log(actor);
  getImagesById(actor);
  let win = await workedWithBacon(userGuess);
  if (win === true) {
    console.log("You won the game!");
    $(".target-win").append(
      "<img src='kevin-bacon-01.jpeg' class='bacon'></img>"
    );
  }

  if (count < 7) {
  return} else {return console.log("You lose.")}

}







//USER begin game
$(".begin-button").on("click", beginGame);

async function beginGame() {
  console.log("begin");
  const starter = await getStartingActor();
  count++;
  let userGuess = starter.name;
  let actor = await getActorByName(userGuess);  
  console.log(actor);
  getImagesById(actor);
  return;
}


$(".help-me").on("click", helpMe);

async function helpMe () {
  const lucky = await baconBoo(lastActor.name);
  if (lucky === true) {
    console.log("found one");

  }
}



function clickInfo(actor) {
  console.log(actor);
}


function makeKnownList(castList) {
  for (const castMember of castList) {
    if (castMember.name === "Kevin Bacon") {
      continue;
    } else if (knownToBacon.includes(castMember.name)) {
      continue;
    } else {
      knownToBacon.push(castMember);
    }
  }
}


async function baconFunc1(id) {
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


async function scrubCredits(creditsArray) {
  let cleanCreditsList = [];
  for (const credit of creditsArray) {
    const genreList = credit.genre_ids;
    const filteredList = genreList.filter(checkGenres);
    if (filteredList.length > 0) {
      cleanCreditsList.push(credit);
    }
  }
  return cleanCreditsList;
}


function checkGenres(genre) {
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
  //history
  if (genre === 36) {
    return false;
  }
  return true;
}

//main function of the program, turned into a bit of a Swiss Army Knife.
//will return TRUE if the actorPrime given, shares a credit with Bacon
//if NOT, will then return an array of every actor that DOES share a credit
//with actorPrime
async function workedWithBacon(name) {
  const actorPrime = await getActorByName(name);
  const actorCredits = await getActingCredits(actorPrime);
  const scrubbedCredits = await scrubCredits(actorCredits.cast);
  let firstConnections = [];
  for (const credit of scrubbedCredits) {
    const movieCharacterList = await getMovieCredits(credit.id);
    let characterList = [];
    for (const character of movieCharacterList.cast) {
      if (character.name === actorPrime.name) {
        continue;
      }
      //WIN CONDITION
      //kicks off the win condition for the program
      if (character.name === "Kevin Bacon") {
        console.log(credit);

        if (count >= 2) {

        $(".read-box").text(credit.title + " : " + credit.overview);
        const newSrc = `https://image.tmdb.org/t/p/w342${credit.poster_path}`;
        console.log(newSrc);
        $(".poster-place").append(`<img src='${newSrc}' class='bacon-winner'>`);

        }


        return true;
      }
      if (characterList.includes(character.name)) {
        continue;
      } else {
        characterList.push(character.name);
      }
    }
    for (const actorName of characterList) {
      firstConnections.push(actorName);
      console.log();
    }
  }
  console.log("We have completed the search on", actorPrime.name);
  return firstConnections;
}


async function baconBoo(actorName) {
  const baconFriend = await workedWithBacon(actorName);

    for (const actorName of baconFriend) {
      const secondConnections = await workedWithBacon(actorName);
      if (secondConnections === true) {
        console.log("we got a second connection");
        $(".text-box").val(actorName);
        entryClick();
        return ;
      } else {
        continue;
      }
    }
    console.log("Still nothing");
}

async function clickBacon() {
  const baconBacon = await workedWithBacon("Kevin Bacon");

  baconBacon;

  for (const actor of baconBacon) {
    $(".text-here").append(`<li>${actor}</li>`);
    baconBuddies++;
  }
}

async function devBACON(name) {
  const actorPrime = await getActorByName(name);

  const actorCredits = await getActingCredits(actorPrime);

  const scrubbedCredits = await scrubCredits(actorCredits.cast);

  for (const credit of scrubbedCredits) {
    const movieCharacterList = await getMovieCredits(credit.id);
    let characterList = [];

    for (const character of movieCharacterList.cast) {

      if (character.name === actorPrime.name) {
        continue;
      }

      if (characterList.includes(character.name)) {
        continue;
      } else {
        characterList.push(character.name);
      }
    }

    for (const actorName of characterList) {
      devConnections.push(actorName);
    }
  }
  console.log("We have completed the search on", actorPrime.name);
  return devConnections;
}

async function getStartingActor() {
  let randNum = Math.floor(Math.random() * 20);

  const rawPopList = await fetch(
    `https://api.themoviedb.org/3/person/popular?api_key=${APIKEY}&language=en-US&page=${randNum}`
  );
  const popList = await rawPopList.json();

  console.log(popList);

  for (const actor of popList.results) {
    console.log(actor);
    if (actor.known_for[0].media_type === "tv") {
      continue;
    }

    if (actor.known_for[0].original_language !== "en") {
      continue;
    }

    const startingChecker = await workedWithBacon(actor.name);

    if (startingChecker === true) {
      console.log("can't use this one", actor);
      continue;
    }

    if (actor.known_for_department !== "Acting") {
      continue;
    }

    console.log(actor, "looks good");

    return actor;
  }
}




//
//
//API requests
//
//
async function getImagesById(actor) {
  lastActor = actor;
  const rawImageResults = await fetch(
    `https://api.themoviedb.org/3/person/${actor.id}/images?api_key=${APIKEY}`
  );

  const imageResults = await rawImageResults.json();

  let imagePath = decodeURI(imageResults.profiles[0].file_path);

  let imageSrc = `https://image.tmdb.org/t/p/w185${imagePath}`;

  let target = "aa";

  if (count === 1) {
    target = "aa";
  }
  if (count === 2) {
    target = "ab";
  }
  if (count === 3) {
    target = "ac";
  }
  if (count === 4) {
    target = "ba";
  }
  if (count === 5) {
    target = "bb";
  }
  if (count === 6) {
    target = "bc";
  }
  if (count > 6) {
    return console.log("out of guesses");
  }

  $(`.${target}`).append(`
  <div class="big-panel">
  <img src="${imageSrc}" class="actor-image">
  <br>
  <p class="actor-panel-name">${actor.name}</p>
  <ul class="actor-panel">
  <li> ${actor.known_for[0].title} </li>
  <li> ${actor.known_for[1].title} </li>
  <li> ${actor.known_for[2].title} </li>
  </ul>
  </div>
  `);

  $(`.${target}`).on("click", async function () {
    console.log("Hello");
    console.log(lastActor);
    console.log(target);
    const clicker = await actorById(lastActor.id);
    console.log(clicker.biography);
    $(".read-box").html(decodeURI(clicker.biography));
  });
}


async function getMovieByName(keyword) {
  const rawMovieResults = await fetch(
    "https://api.themoviedb.org/3/search/movie/?api_key=" +
      APIKEY +
      "&language=en-US&query=" +
      keyword +
      "&page=1&include_adult=false"
  );

  const movieResults = await rawMovieResults.json();

  return movieResults.results[0];
}


async function checkCreditId(keyword) {
  const rawData = await fetch(
    "https://api.themoviedb.org/3/credit/" + keyword + "?api_key=" + APIKEY
  );

  const whatCreditIsThis = await rawData.json();

  console.log("credit_id#", keyword, "is listed as:", whatCreditIsThis);
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
  return actorData;
}


async function getActorByName(actorName) {
  const rawActorResults = await fetch(
    "https://api.themoviedb.org/3/search/person?api_key=" +
      APIKEY +
      "&language=en-US&query=" +
      decodeURI(actorName) +
      "&page=1&include_adult=false"
  );
  const actorResults = await rawActorResults.json();
  console.log (actorResults);
  return actorResults.results[0];
}


async function getActingCredits(actor) {
  const rawActingCredits = await fetch(
    "https://api.themoviedb.org/3/person/" +
      actor.id +
      "/movie_credits?api_key=" +
      APIKEY +
      "&language=en-US"
  );
  const actingCredits = await rawActingCredits.json();
  return actingCredits;
}


async function getMovieCredits(movieId) {
  const rawMovieCredits = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${APIKEY}&language=en-US`
  );
  const movieCredits = await rawMovieCredits.json();
  return movieCredits;
}


async function cleanCredits(creditsArray) {
  console.log(creditsArray);
  for (const credit of creditsArray) {
    const genreList = credit.genre_ids;
    const filteredList = genreList.filter(checkGenres);
    if (filteredList.length > 0) {
      cleanCreditsList.push(credit);
    }
  }
  for (const credit of cleanCreditsList) {
    baconFunc1(credit.id);
  }
}


async function getCreditById(actor) {
  const rawCreditDetails = await fetch(
    `https://api.themoviedb.org/3/credit/${actor.credit_id}?api_key=${APIKEY}&language=en-US`
  );
  const creditDetails = await rawCreditDetails.json();
  return creditDetails;
}