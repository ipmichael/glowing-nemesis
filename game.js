$(document).ready(function(){


	var aCount = 0;
	var inc = 1;
	var canHarv = true;
	var leaderLvl = 2;
	var moralLvl = 2;
	var miscTraits = "";

    var farmerCount = 0;

    //will be 5000, but shortened for testing
    var growTime = 250;

	var leaderAry = [
		"Scum","Citizen","Chieftain","King","Overlord"
	];
	var moralAry = [
		"Nefarious", "Evil", "", "Good", "Honorable"
	];

    updateVals();

    //boot is the grow button
    //on click, starts loading cooldown bar and also increments villager amount
	$('div#boot').click(function(e) {
		if(canHarv){
			$('div#tickbar').hide();
			canHarv = false;
    		aCount+=inc;
        	$('#foodLabel').text("Villagers: " + aCount);
        	loadbar();
        }

        inc = Math.ceil(aCount/10) || 1;

        updateVals();
    });

    function updateVals(){
        //updated onclick section!
        //villager count
        $('#foodLabel').text("Villagers: " + aCount);
        //player name
        $('#bigname').text(miscTraits+" "+moralAry[moralLvl]+" "+leaderAry[leaderLvl]);
        //farmer count
        $('#farmers').text(" Farmers: "+farmerCount);
        //increase amount
        $('#inc').text(" Income: "+inc);
    }

    function loadbar(){
    	canHarv = false;
    	$('div#tickbar').animate({width:'toggle'},growTime);
    	setTimeout(function(){
    		canHarv = true;
    	}, growTime);	
    }

    $('div#up1').click(function(e){
        if(aCount>0){
            farmerCount++;
            aCount--;
        }
        updateVals();
    });
    $('div#down1').click(function(e){
        if(farmerCount>0){
            farmerCount--;
            aCount++;
        }
        updateVals();
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
});