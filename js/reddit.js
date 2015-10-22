$(function(){

	"use strict";
	/**
	 * Jquery elements
	 * @type {*|jQuery|HTMLElement}
	 */
	var $result = $('#result');
	var $message = $('#message');
	var $form = $('#cakeday-form');
	var $cakedayDate = $('#cakeday-date');
	var $userNameInput = $('#user-name-input');

	/**
	 * Requires person to enter user info
	 */
	var noInput = function(){
		emptyAllElements();
		$($message).html("You forgot to type a reddit username");
		$($message).addClass('colored-background');
	};

	/**
	 * Results displayed using Ajax displaying
	 * @param userName
	 */
	var gotInput = function(userName) {
		var userUrl = createUserUrl(userName);
		/**
		 * If it takes more than a second to load, response will default to error: not found
		 */
		$.ajax({
			url: userUrl,
			dataType: "jsonp",
			timeout: 1000,
			success: function(data){
				//using moment plugin to make a manageable date
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
	/**
	 * Next Reddit Birthday date
	 * @param nextCakeday
	 */
	var displayNextCakeday = function(nextCakeday) {
		$($cakedayDate).text(nextCakeday.format("MMMM Do YYYY"));
	};

	/**
	 * Days left until next Reddit birthday
	 * @param daysLeft
	 */
	var displayDaysLeft = function(daysLeft) {
		$($result).text(daysLeft);
	};

	var displayMessage = function(daysLeft) {
		var message = " ";


		$($message).html("days left<br />" + message);
	};
	/**
	 * Empty elements if incorrect username is entered
	 */
	var emptyAllElements = function(){
		$($cakedayDate).empty();
		$($message).empty();
		$($result).empty();
		$('#panda').remove();
		$($message).removeClass('colored-background');
	};
	/**
	 * GET-request for the user
	 * @param userName
	 *
	 */
	var createUserUrl = function(userName){
		return "http://www.reddit.com/user/" + userName +
			"/about.json?jsonp=?";
	};

	/**
	 * Upon submitting form, user will be trigger to gotInput or noInput
	 */
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