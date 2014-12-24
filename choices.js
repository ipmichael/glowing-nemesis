$(document).ready(function(){
	var storyAry = [];
	var choice1 = 0;
	var choice2 = 0;
	var choice3 = 0;

	$('div#box1').click(function(e) {
		choice1++;
		update();
    });

	$('div#box2').click(function(e) {
		choice2++;
		update();
    });

    $('div#box3').click(function(e) {
		choice3++;
		update();
    });

    function update(){
    	$('#choice1').text(""+choice1);
    	$('#choice2').text(""+choice2);
    	$('#choice3').text(""+choice3);
    }
});