$(function(){

	"use strict";

	var $result = $('#result');
	var $message = $('#message');
	var $form = $('#cakeday-form');
	var $cakedayDate = $('#cakeday-date');
	var $userNameInput = $('#user-name-input');

	/**
	 * requires person to enter user info
	 */
	var noInput = function(){
		emptyAllElements();
		$($message).html("You forgot to type a reddit username");
		$($message).addClass('colored-background');
	};

	var gotInput = function(userName) {
		var userUrl = createUserUrl(userName);
		/**
		 * If it takes more than a second to load, response will default to: not found
		 */
		$.ajax({
			url: userUrl,
			dataType: "jsonp",
			timeout: 1000,
			success: function(data){

				var createdDate = moment.unix(data.data.created);
				var nextCakeday = calculateNextCakeday(createdDate);

				var daysLeft = nextCakeday.diff(moment(), 'days');

				displayResults(nextCakeday, daysLeft);
			},
			error: function(){
				emptyAllElements();
				$($message).text("No. Could not find this one. Ask your parents");
				$($message).after('<img src="css/img/sadpanda.png" id="panda" />')
			}});
	};
	/**
	 * Calculating days left until next b-day
	 * @param createdDate
	 * @returns {*}
	 */
	var calculateNextCakeday = function(createdDate){
		var currentYear = moment().format('YYYY');
		var nextCakeday = createdDate.year(currentYear);

		if(nextCakeday < moment()){
			nextCakeday = nextCakeday.add('years', 1)
		}
		return nextCakeday;
	}
	/**
	 * Display Result method
	 * @param nextCakeday
	 * @param daysLeft
	 */
	var displayResults = function(nextCakeday, daysLeft){
		emptyAllElements();
		displayNextCakeday(nextCakeday);
		displayDaysLeft(daysLeft);
		displayMessage(daysLeft);
	}

	var displayNextCakeday = function(nextCakeday) {
		$($cakedayDate).text(nextCakeday.format("MMMM Do YYYY"));
	};

	var displayDaysLeft = function(daysLeft) {
		$($result).text(daysLeft);
	};

	var displayMessage = function(daysLeft) {
		var message = " ";



		$($message).html("days left<br />" + message);
	};

	var emptyAllElements = function(){
		$($cakedayDate).empty();
		$($message).empty();
		$($result).empty();
		$('#panda').remove();
		$($message).removeClass('colored-background');
	};

	var createUserUrl = function(userName){
		return "http://www.reddit.com/user/" + userName +
			"/about.json?jsonp=?";
	};

	$(document).on("submit", $form, function(event) {
		event.preventDefault();
		var userName = $userNameInput.val();

		if(userName) {
			gotInput(userName);
		} else {
			noInput();
		}
	});
});