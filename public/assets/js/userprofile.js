
function toggleExpandItem(id, num) {
	let chevron = document.getElementById(`down-${id}-${num}`);
	chevron.classList.toggle("down");
	chevron.classList.toggle("up");
	
	let element = document.getElementById(`requests-${id}-${num}`);
	element.classList.toggle("items-hidden");
}

removeItem = id => {
	let item = document.getElementById(id);
	item.classList.add("hidden");
	setTimeout(() => item.remove(), 400);
}

cancelMyOrder = id => {
	removeItem(id);
	http = new XMLHttpRequest();
	http.open("GET", `/cancel_item/${id}`, true);
	http.send();
}

cancelMyDelivery = id => {
	removeItem(id);
	http = new XMLHttpRequest();
	http.open("GET", `/cancel_item/${id}`, true);
	http.send();
}

finishOrder = id => {
	removeItem(id);
	http = new XMLHttpRequest();
	http.open("GET", `/finish_item/${id}`, true);
	http.send();
}

dismiss = id => {
	removeItem(id);
	http = new XMLHttpRequest();
	http.open("GET", `/finalise_item/${id}`, true);
	http.send();
}