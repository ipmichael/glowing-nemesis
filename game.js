$(document).ready(function(){

	var aCount = 0;
	var inc = 1;
	var canHarv = true;
	var leaderLvl = 2;
	var moralLvl = 2;
	var miscTraits = "";

	var leaderAry = [
		"Scum","Citizen","Chieftain","King","Overlord"
	];
	var moralAry = [
		"Nefarious", "Evil", "", "Good", "Honorable"
	];

	$('#bigname').text(miscTraits+" "+moralAry[moralLvl]+" "+leaderAry[leaderLvl]);

	// $('div#tickbar').hide();

	$('div#boot').click(function(e) {
		if(canHarv){
			$('div#tickbar').hide();
			canHarv = false;
    		aCount+=inc;
        	$('#foodLabel').text("Food Gathered: " + aCount);
        	loadbar();
        }
    });

    $('#inc').text(" Income: "+inc);

    function loadbar(){
    	canHarv = false;
    	$('div#tickbar').animate({width:'toggle'},5000);
    	setTimeout(function(){
    		canHarv = true;
    	}, 5000);
    	
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