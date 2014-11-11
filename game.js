$(document).ready(function(){
	var aCount = 0;
	var inc = 1;

	$('div#boot').click(function(e) {
    	var oldText = $(this).text();
    	aCount+=inc;
        // $(this).text('clicked');
        $('#foodLabel').text("Food Gathered: " + aCount);
    });f

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

});