toggleAppendItem = id => {
	let plus = 	document.getElementById(`plus-${id}`);
	plus.classList.toggle("plus");
	plus.classList.toggle("cross");
	toggleCartItem(id);
}

toggleCartItem = index => {
	http = new XMLHttpRequest();
	http.open("POST", `/cart_item/${index}`, true);
	http.send();
}

toggleExpandItem = id => {

	let chevron = document.getElementById(`down-${id}`);
	chevron.classList.toggle("down");
	chevron.classList.toggle("up");
	
	document.getElementById(`requests-${id}`).classList.toggle("items-hidden");
}

function toggleSideNav() {
	document.getElementById("sidenav").classList.toggle("nav-hide");
	document.getElementById("sidenav").classList.toggle("nav-show");
}

function toggleSort(id) {
	document.getElementById(id + "-content").classList.toggle("sort-show");
	document.getElementById(id + "-content").classList.toggle("sort-hide");
	document.getElementById(id + "-down").classList.toggle("down");
	document.getElementById(id + "-down").classList.toggle("up");
}

validateForm = _ => {
	var form = document.getElementsByTagName("FORM")[0];
	var edits = form.getElementsByTagName("input");
	var numEdits = edits.length;

	let error = document.getElementsByTagName("p")[0];
	let isAllFilled = true;

	for (let i = 0; i < numEdits; i++) {
		if (edits[i].value.length == 0) {
			edits[i].classList.add("red-border")
			isAllFilled = false;
		}
	}

	if (isAllFilled) {
		return true;
	} else {
		error.innerHTML = "Please fill in all information";
		document.getElementsByTagName("p")[0].style.display = "block";
		return false;
	}
}

removeBorder = index => document.getElementsByTagName("input")[index].classList.remove("red-border");

toggleInfoView = _ => {
	document.getElementById("orders").classList.toggle("info-hidden");
	document.getElementById("deliveries").classList.toggle("info-hidden");
	document.getElementById("bg-circle").classList.toggle("rotate");
	document.getElementById("fg-circle").classList.toggle("rotate-anti");
}

toggleView = _ => {
	document.getElementById("carousel").classList.toggle("toggle-view");
	document.getElementById("toggle").classList.toggle("toggle-left");
	document.getElementById("toggle").classList.toggle("toggle-right");
	document.getElementById("ball").classList.toggle("ball-left");
	document.getElementById("ball").classList.toggle("ball-right");
}

constrain = (num, min, max) =>  max * (num >= max) + min * (num <= min) + num * (num < max && num > min);