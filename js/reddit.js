$(function(){

	$(document).on("submit", '#cakedayForm', function(event) {
		event.preventDefault();
		var user = $("#userName").val();
		displayDaysLeft(user);
	});
    
    // fetching the date on which user name was created
	var displayDaysLeft = function(user) {
		user = $("#userName").val();
		var userUrl = "http://www.reddit.com/user/" + user + "/about.json?jsonp=?";

		$.getJSON(userUrl, function(data){
			var createdDate = moment.unix(data.data.created);
			var daysLeft = caluclateDaysLeft(createdDate);
			$('#result').text(daysLeft);
		});
	};
	
	//caluclating days left to the next reddit anniversary/birthday
	var caluclateDaysLeft = function(createdDate) {
		var currentYear = moment().format('YYYY');
		var nextBday = createdDate.year(currentYear);

		if(nextBday < moment()){
			nextBday = nextBday.add('years', 1)
		}
		return nextBday.diff(moment(), 'days');
	};
});