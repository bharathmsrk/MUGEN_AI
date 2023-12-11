// Search functionality implemented using jQuery

$(document).ready(function() {
    $("#searchButton").click(function() {
        var searchQuery = $("#searchInput").val().toLowerCase();
        var matchingSongs = [];

        $(".song-card").each(function() {
            var songName = $(this).find(".fw-bolder").text().toLowerCase();
            var artistName = $(this).find(".text-center").eq(1).text().toLowerCase();
            
            if (songName.includes(searchQuery) || artistName.includes(searchQuery)) {
                var songData = {
                    songName: songName,
                    artistName: artistName,
                    cardHtml: $(this).prop('outerHTML')
                };
                matchingSongs.push(songData);
            }
        });

        sessionStorage.setItem("matchingSongs", JSON.stringify(matchingSongs));
        window.location.href = "/static/pages/results.html";
    });
});

