$(document).ready(function(){
    var _url = "https://my-json-server.typicode.com/nisaftm/apipwa/movies"
    var dataResults = ""
    var genreResult = ""
    var genres = []

    function renderPage(data){
    //$.get(_url, function(data){
        $.each(data, function(key, items){
            _genre = items.genre
            dataResults += "<div>"
                            + "<h3>"+items.title+"</h3>"
                            + "<p>"+_genre+"</p>"
                            "<div>";

            if($.inArray(_genre, genres) == -1){
                genres.push(_genre)
                genreResult += "<option value'"+_genre+"'>"+_genre+"</option>"
            }
        })

        $('#movies').html(dataResults)
        $('#genre_select').html("<option value'all'>semua</option>"+genreResult)
    //})
    }

    var networkDataReceive = false
    
    var networkUpdate = fetch(_url).then(function(response) {
        return response.json()
    }).then(function(data){
        networkDataReceive = true
        renderPage(data)
    })

    caches.match(_url).then(function(response) {
        if(!response) throw Error('tidak ada data di cache')
        return response.json()
    }).then(function(data) {
        if (!networkDataReceive) {
            renderPage(data)
            console.log('render data dari cache')
        }
    }).catch(function() {
        return networkUpdate
    })


    $("#genre_select").on('change', function(){
        updateMovies($(this).val())
    })
    
    function updateMovies(genre){
        var dataResults = ''
        var _genUrl = _url
    
        if(genre != 'all')
            _genUrl = _url+"?genre="+genre
    
        $.get(_genUrl, function(data){
            $.each(data, function(key, items){
                _genre = items.genre
                dataResults += "<div>"
                                + "<h3>"+items.title+"</h3>"
                                + "<p>"+_genre+"</p>"
                                "<div>";
            })
    
            $('#movies').html(dataResults)
        })
    }
})

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
