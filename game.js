$(document).ready(function(){
	var aCount = 0;

	$('div#boot').click(function(e) {
    	var oldText = $(this).text();
    	aCount++;
        $(this).text('clicked');
    });

    $('div#boot').hover(function(){
    	$(this).css({
            'background-color': 'blue',
    });

});