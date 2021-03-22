$( document ).ready(function()
{
    const getUrlParameter = (sParam) => {
      let sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL != undefined && sPageURL.length > 0 ? sPageURL.split('#') : [],
        sParameterName,
        i;
      let split_str = window.location.href.length > 0 ? window.location.href.split('#') : [];
      sURLVariables = split_str != undefined && split_str.length > 1 && split_str[1].length > 0 ? split_str[1].split('&') : [];
      
      sURLVariables.forEach(urlv => {
        sParameterName = urlv.split('=');
        if(sParameterName[0] === sParam)
          return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      });
  };

    const accessToken = getUrlParameter('access_token');

    let cli_id = 'f170b6656aad48da802a5287d67660f4';
    let red_uri = 'https%3A%2F%2Flucaparmeggiani.github.io%2Fstats_spotify_modular';

    const redirect = `https://accounts.spotify.com/authorize?client_id=${cli_id}&response_type=token&redirect_uri=${red_uri}`;
    
    if(accessToken == null || accessToken == "" || accessToken == undefined){
      //window.location.replace(redirect);
    }

    // Search button has been clicked
    $( "#search_button" ).click(function() {
      //Get the value of the search box
      let raw_search_query = $('#search-text').val();
      let search_query = encodeURI(raw_search_query);
      // Make Spotify API call
      // Note: We are using the track API endpoint.
      $.ajax({
        url: `https://api.spotify.com/v1/search?q=${search_query}&type=track`,
        type: 'GET',
        headers: {
            'Authorization' : 'Bearer ' + accessToken
        },
        success: function(data) {
          // Load our songs from Spotify into our page
          let num_of_tracks = data.tracks.items.length;
          let count = 0;
          const max_songs = 12;
          while(count < max_songs && count < num_of_tracks){
            // Extract the id of the FIRST song from the data object
            let id = data.tracks.items[count].id;
            // Constructing two different iframes to embed the song
            let src_str = `https://open.spotify.com/embed/track/${id}`;
            let iframe = `<div class='song'><iframe src=${src_str} frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></div>`;
            let parent_div = $('#song_'+ count);
            parent_div.html(iframe);
            count++;
          }
        }
      });
    });
  });
