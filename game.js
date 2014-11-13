$(document).ready(function(){

    //aCount is the number of villagers
	var aCount = 0;
    //trueCount is number of clicks
    var trueCount = 0;
	var inc = 1;
	var canHarv = true;
	var leaderLvl = 2;
	var moralLvl = 2;
	var miscTrait1 = "";
    var miscTrait2 = "";
    var miscTrait3 = "";

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
            trueCount++;
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
            'background-color': 'gray',
            'color': 'white'
        });
    }, function() {
    	//set multiple CSS properties at once
        $(this).css({
            'background-color': 'black',
            'color': 'white'
        });
    });

    function updateVals(){

        //miscTrait1 has to do with number of clicks,
        //overall experience/how long you've been playing
        if(trueCount<7){
            miscTrait1="Amateur ";
        }else if(trueCount<14){
            miscTrait1="Young ";
        }else if(trueCount<23){
            miscTrait1="Capable ";
        }else if(trueCount<33){
            miscTrait1="Experienced ";
        }else if(trueCount<45){
            miscTrait1="Seasoned ";
        }else{
            miscTrait1="Veteran ";
        }
        //updated onclick section!
        //villager count
        $('#foodLabel').text("Villagers: " + aCount);
        //player name
        $('#bigname').text(miscTrait1+miscTrait2+miscTrait3+moralAry[moralLvl]+" "+leaderAry[leaderLvl]);
        //farmer count
        $('#farmers').text(" Farmers: "+farmerCount);
        //debug
        $('#inc').text(" trueCount: "+trueCount);
        //worker count
        $('#workers').text(" Laborers: "+workerCount);
        //warrior count
        $('#warriors').text(" Warriors: "+warriorCount);
    }
});