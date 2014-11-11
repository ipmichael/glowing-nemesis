$(document).ready(function(){
	var aCount = 0;

	$('div#boot').click(function(e) {
    	var oldText = $(this).text();
    	aCount++;
        // $(this).text('clicked');
        $('div#food').text(aCount);
    });

    $('div#boot').hover(function() {
    	//set multiple CSS properties at once
        $(this).css({
            'background-color': 'blue',
            'color': 'white'
        });
    }, function() {
    	//set multiple CSS properties at once
        $(this).css({
            'background-color': '#1CBADC',
            'color': 'white'
        });
    });

    $('div#food').text(aCount);

});