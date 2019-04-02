/**
 * @author Tejas M. S.
 * @email proway10@gmail.com
 * @create date 2019-04-01 23:31:31
 * @modify date 2019-04-01 23:31:31
 * @desc [Movies Listing]
 */

// Global Config
let config = {
    base_url: window.location.origin,
    posterRelativeURL: 'https://image.tmdb.org/t/p/w500/',
    backdropRelativeURL: 'https://image.tmdb.org/t/p/w1280/',
    grid: 12,
    apiURL: 'https://backend-ygzsyibiue.now.sh/api/v1/movies/'
};

var total_movies = 0; 
var movies = [];
let htmlBox = '';
let url_string = window.location.href;
 
/* Details about Movies */
let moviesList = {
    totalMovies: 0,
    finalHtml: '',
    fetchMovies: function () {     
        fetAPI(config.apiURL).then((apiData) => { 
            this.totalMovies = apiData.length;
            this.generateHTML(apiData);
            $('.listing-wrapper').html(this.finalHtml); 
        });
    },
    generateHTML: function (data) {        
        for (let movieDetail of data) { 
            let date = getDateStringFormat(movieDetail.releaseDate);
            let movieSlug = (movieDetail.slug).toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            let slug = `${config.base_url}/movie/${movieSlug}-${movieDetail._id}`;
            
            htmlBox += listingHTML(movieDetail, date, slug);
        } 
        this.finalHtml = htmlBox;
    }
}

/* HTML of Listing - Single Card */
function listingHTML(detail, date, slug){    
    let htmDetail = `<div class="col-6 col-md-4 col-lg-3">
                    <div class="list-box" data-id="${detail._id}">
                        <a href="${slug}" class="urlDetail" data-id="${detail._id}">
                            <img src="${config.posterRelativeURL}${detail.posterURL}" class="list-image" alt="">
                        </a>
                        <div class="list-description">
                            <a href="${slug}" class="list-title urlDetail" data-id="${detail._id}">${detail.title}</a>
                            <span class="list-date">
                                ${date}
                            </span>
                        </div>
                    </div>
                </div>`;
    return htmDetail;
}

/* Date in String Format */
function getDateStringFormat(datetimestamp){
    let date = new Date(datetimestamp);
    let day = date.getDate();
    let month = date.toLocaleString('en-us', { month: 'long' });
    let year = date.getFullYear();
    return month + ' ' + day + ', ' + year;
}

/* RENDER of Listing page */
function renderListing(){
    moviesList.fetchMovies();
}

/* Fetch Movie Details - Single Page */
function loadMovieData(){
    
    let id = getID(url_string); 

    fetAPI(config.apiURL+id).then((apiData) => { 
        $('#backdrop-image-top').attr('src', config.backdropRelativeURL + apiData.backdropURL);
        $('#backdrop-poster').attr('src', config.posterRelativeURL + apiData.posterURL);
        $('.movie-title').html(apiData.title);
        $('.movie-release-date').html(getDateStringFormat(apiData.releaseDate));
        $('.movie-data').html(apiData.plot);
        //SEO
        $('title').html(apiData.title); 
    });    
}

/* Get ID from URL */
function getID(url) {
    // We can use API to fetch the ID by passing Slug as a argument
    var arrayURL = url.split("-");
    var id = arrayURL[arrayURL.length - 1];
    return id;
}

/* Delete API */
$(document).on("click", "#delete-movie", function () {
    let id = getID(url_string);
    deleteData(config.apiURL + id);
});

function deleteData(url) {

    fetAPI(url, 'delete').then((apiData) => {
        if (apiData.status == 204) {
            $(document).find('.delete-alert').show();
            $(document).find('.delete-alert').removeClass('fade');
            setTimeout(function () {
                window.location.replace(config.base_url);
            }, 2000);
        }
    }); 

}

/* Service API to Fetch */
async function fetAPI(url, method = 'get')
{
    let response = await fetch(url, { method : method });
    if(method == 'delete'){
        return await response; 
    }
    else{
        return await response.json(); 
    }    
}