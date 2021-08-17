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

const search = "https://api.themoviedb.org/3/search/movie?api_key=" + APIKEY + "&query=";

const person = "https://api.themoviedb.org/3/search/person/";





async function talk () {

        console.log("fetching config")

        const rawData = await fetch(config)
        const data = await rawData.json();

        console.log("config data", data);
        return data;

    
}

talk();


async function digUp (keyword) {
        console.log("fetching search for", keyword);

        const rawData = await fetch(search + decodeURI(keyword));
        const data = await rawData.json();

        console.log(data);
        console.log("Results of data:", data.results);
        console.log("First returned result is - ", data.results[0]);
        return data;
}


async function digUpPerson (keyword) {
        console.log("fetching data on", keyword);

        const rawData = await fetch(
            "https://api.themoviedb.org/3/search/person?api_key="
            + APIKEY
            + "&language=en-US&query="
            + decodeURI(keyword)
            +"&page=1&include_adult=false"
             );

        const data = await rawData.json();

        console.log(data);
        console.log("Results of data:", data.results);
        console.log("First returned result is - ", data.results[0]);


        $(".output-box").text(data.results[0]);

        const picAddress = data.results[0].profile_path;

        const portrait = "<img src='http://image.tmdb.org/t/p/w185" + picAddress + "'>";

        console.log(portrait);

        $(".output-box").append(portrait);

        return data;



}









$(".submit-button").on("click", () => {
    let userGuess = $(".text-box").val();
    console.log("The user has entered", userGuess);
    digUp(userGuess);
})


$(".submit-button-actor").on("click", () => {
    let userGuess = $(".text-box-person").val();
    console.log("The user has entered", userGuess);

    let returnData = digUpPerson(userGuess);

    console.log("inside event listener, we got this back on a person search", returnData);

    

})






// let configData = null;

// let baseImageURL = null;

// let getConfig = function () {
//   let url = "".concat(baseURL, "configuration?api_key=", APIKEY);
//   fetch(url)
//     .then((result) => {
//       return result.json();
//     })
//     .then((data) => {
//       baseImageURL = data.images.secure_base_url;
//       configData = data.images;
//       console.log("config:", data);
//       console.log("config fetched");
//       runSearch("jaws");
//     })
//     .catch(function (err) {
//       alert(err);
//     });
// };

// let runSearch = function (keyword) {
//   let url = "".concat(
//     baseURL,
//     "search/movie?api_key=",
//     APIKEY,
//     "&query=",
//     keyword
//   );
//   fetch(url)
//     .then((result) => result.json())
//     .then((data) => {
//       //process the returned data
//       document.getElementById("output").innerHTML = JSON.stringify(
//         data,
//         null,
//         4
//       );
//       //work with results array...
//     });
// };

// getConfig();

// document.addEventListener('DOMContentLoaded', getConfig);
/*******************************
        SAMPLE SEARCH RESULTS DATA
        { "vote_count": 2762, 
            "id": 578, 
            "video": false, 
            "vote_average": 7.5, 
            "title": "Jaws", 
            "popularity": 16.273358, 
            "poster_path": "/l1yltvzILaZcx2jYvc5sEMkM7Eh.jpg", 
            "original_language": "en", 
            "original_title": "Jaws", 
            "genre_ids": [ 27, 53, 12 ], 
            "backdrop_path": "/slkPgAt1IQgxZXNrazEcOzhAK8f.jpg", 
            "adult": false, 
            "overview": "An insatiable great white shark terrorizes the townspeople of Amity Island, The police chief, an oceanographer and a grizzled shark hunter seek to destroy the bloodthirsty beast.", 
            "release_date": "1975-06-18" 
        }
        *******************************/

// console.log("Hello there");

// let getAliens = function () {
//     let url = "".concat(baseURL, "search/movie?api_key=", APIKEY, "&language=en-US&query=aliens&page=1&include_adult=false");
//     fetch(url)
//       .then((result) => {
//         return result.json();
//       })
//       .then((data) => {
//         // baseImageURL = data.images.secure_base_url;
//         // configData = data.images;
//         console.log("search:", data);
//         console.log("aliens fetched");
//         runSearch("aliens");
//       })
//       .catch(function (err) {
//         alert(err);
//       });
//   };


  
// getAliens();