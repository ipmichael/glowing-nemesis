$(document).ready(function(){

	var aCount = 0;
	var inc = 1;
	var canHarv = true;
	var leaderLvl = 2;
	var moralLvl = 2;
	var miscTraits = "";

    var workerCount = 0;
    var farmerCount = 0;
    var warriorCount = 0;

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



    function loadbar(){
    	canHarv = false;
    	$('div#tickbar').animate({width:'toggle'},growTime);
    	setTimeout(function(){
    		canHarv = true;
    	}, growTime);	
    }
    /*========================
    UPDOWN BUTTON INCREMENTERS
    ==========================*/

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

    $('div#up2').click(function(e){
        if(aCount>0){
            workerCount++;
            aCount--;
        }
        updateVals();
    });
    $('div#down2').click(function(e){
        if(workerCount>0){
            workerCount--;
            aCount++;
        }
        updateVals();
    });

    $('div#up3').click(function(e){
        if(aCount>0){
            warriorCount++;
            aCount--;
        }
        updateVals();
    });
    $('div#down3').click(function(e){
        if(warriorCount>0){
            warriorCount--;
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
        //worker count
        $('#workers').text(" Laborers: "+workerCount);
        //warrior count
        $('#warriors').text(" Warriors: "+warriorCount);
    }
});