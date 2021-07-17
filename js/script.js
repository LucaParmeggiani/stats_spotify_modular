$(document).ready(function()
{
  const getUrlParameter = (sParam) => {
    let sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL != undefined && sPageURL.length > 0 ? sPageURL.split('#') : [],
        sParameterName,
        i;
    let split_str = window.location.href.length > 0 ? window.location.href.split('#') : [];
    sURLVariables = split_str != undefined && split_str.length > 1 && split_str[1].length > 0 ? split_str[1].split('&') : [];
    for (i = 0; i < sURLVariables.length; i++)
    {
      sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] === sParam)
        return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  };

  const accessToken = getUrlParameter('access_token');
  let client_id = 'f170b6656aad48da802a5287d67660f4';
  // https://lucaparmeggiani.github.io/stats_spotify_modular
  //let redirect_uri = 'https%3A%2F%2Flucaparmeggiani.github.io%2Fstats_spotify_modular';
  // http://localhost:5500
  let redirect_uri = 'http%3A%2F%2Flocalhost:5500';

  const redirect = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}`;

  if(accessToken == null || accessToken == "" || accessToken == undefined)
    window.location.replace(redirect);

  setup(accessToken);
});
/*
    $( "#search_button" ).click(function()
    {
      let raw_search_query = $('#search-text').val();
      let search_query = encodeURI(raw_search_query);
      // Make Spotify API call
      // Note: We are using the track API endpoint.
      $.ajax({
        url: `https://api.spotify.com/v1/search?q=${search_query}&type=track`,
        type: 'GET',
        headers:
        {
            'Authorization' : 'Bearer ' + accessToken
        },
        success: function(data)
        {
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
*/

function setup(accessToken){
  $.ajax({
    url: 'https://api.spotify.com/v1/me',
    type: 'GET',
    headers:
    { 'Authorization' : 'Bearer ' + accessToken },
    success: function(data)
    {
      let user_name = data.display_name;
      let user_image = data.images[0].url;
      $("#icon").attr("src", user_image);
      $("#name").text("Welcome " + user_name + "!");
    }
  });
}

function toggleEditor(ele, isActive)
{
  if(isActive){
    $("#statistics").css("width", "calc(100% - 250px)");
    $("#sidebar").css("left", "calc(100% - 250px)");
    $("#sidebar").css("box-shadow", "-5px 0px 15px 0px rgba(0,0,0,0.5)");
    $(ele).toggleClass("open-editor");
  }
  else
  {
    $("#statistics").css("width", "100%");
    $("#sidebar").css("left", "100%");
    $("#sidebar").css("box-shadow", "none");
    $(ele).toggleClass("open-editor");
  }
}

$("button").click(function(){
  let isActive = false;
  $(this).toggleClass("is-active");
  if($(this).hasClass("open-editor"))
    isActive = true;
  toggleEditor($(this), isActive);
});

emptyHome();

function emptyHome()
{
  if($("#statistics").text() == "" || $("#statistics").text() == null || $("#statistics").text() == undefined)
    $("#statistics").append("<div id='empty'>Open the editor and start to create your page</div>");
}

//$("#empty").remove();

$.getJSON("categories.json", function(data){
  $(data.categories).each(function(index, el)
  {
    var fixedName = el.name.replace(/\_/g, " ");
    var tmpDiv = "<div id='category" + index + "' onclick='modify($(this).find(\"p\").text(), $(this))'><p>" + fixedName + "</p></div>";
    $("#selectable-category").append(tmpDiv);
  });
}).fail(function(){
  console.error("ERRORE DA GESTIRE");
});

function modify(categoryName, element)
{
  $.getJSON("categories.json", function(data){
    $(data.categories).each(function(index, category)
    {
      var fixedCategoryName = category.name.replace(/\_/g, " ");
      if(fixedCategoryName == categoryName)
        $(category.selectors).each(function(index, division){
          $(division).each(function(index, selector){
          var tmpDiv = $("<div id='selector'><p>&nbsp;&nbsp;&nbsp;&nbsp;" + selector + "</p></div>");
          $(element).append(tmpDiv);
        });
      });
      var line = "<p>----------------</p>";
      $(element).append(line);
    });
  }).fail(function(){
    console.error("ERRORE DA GESTIRE");
  });

  modifyPopup();
}

function modifyPopup(){

}