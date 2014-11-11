$(document).ready(function(){

	var aCount = 0;
	var inc = 1;
	var tickVal = 0;
	$('div#tickbar').hide();

	$('div#boot').click(function(e) {
		$('div#tickbar').hide();
    	var oldText = $(this).text();
    	aCount+=inc;
        // $(this).text('clicked');
        $('#foodLabel').text("Food Gathered: " + aCount);
        loadbar();
        if(tickVal == 10){
        	tickVal = 0;
        }
    });

    function loadbar(){
    	$('div#tickbar').animate({width:'toggle'},350);
    }

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