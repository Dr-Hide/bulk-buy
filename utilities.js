//utility functions

//random int with min and max
randomInt = (min, max) => min + Math.floor((max - min) * Math.random());

//random float with min and max
randomFloat = (min, max) => min + (max - min) * Math.random();

//add preceding 0s
pad = (n, num) => n.toString().length < num ? pad('0' + n, num) : n;

//create UserId and convert to hex
getUserId = num => {
	let date = new Date();
	let day = pad(date.getDate(), 2);
	let month = pad(date.getMonth() + 1, 2);
	let year = (date.getYear() - 100);
	return pad(parseInt(day + month + year, 10).toString(16), 5) + pad(num.toString(16), 4);
}

