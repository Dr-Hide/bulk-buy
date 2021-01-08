let itemArray = [];
let count = 0;
let unitPrice = 100;

addEvents = () => {
	createItems();

	document
	.getElementById("items")
	.addEventListener("click", e => testItemClicked(e));

	document
	.getElementById("dropdown")
	.addEventListener("click", e => {
		addItem(e.target.innerHTML);
		document.getElementById("item-type").value = "";
		createItems();
	});
}

window.addEventListener("load", addEvents);

displayItem = (item, index, container) => {
	let div = createDiv(`div${index}`);
	let icon = createIcon(`cross${index}`);
	let heading = document.createElement("h4");
	heading.appendChild(document.createTextNode(item));
	
	if (container == "items") {
		let btnContainer = document.getElementById("counter-template").content.cloneNode(true);
		btnContainer.getElementById("minus").id = `minus${count}`;
		btnContainer.getElementById("quantity").id = `quantity${count}`;
		btnContainer.getElementById("plus").id = `plus${count}`;
		div.appendChild(btnContainer);
		div.appendChild(heading);

		div.appendChild(document.createElement("h4").appendChild(document.createTextNode(`R${unitPrice}`)));
		div.appendChild(icon);
	} else {
		div.appendChild(heading);
	}
	document.getElementById(container)
	.appendChild(div);
}

addItem = item => {
	document.getElementById("item-type").focus();

	testExistence(item);
	itemArray.push({item: item, quantity: 1, unitPrice: unitPrice});
	displayItem(item, count, "items");
	count++;
	getTotal();
}

createDiv = divId => {
	let div = document.createElement("div");
	div.classList.add("row", "item");
	div.id = divId;
	return div;
}

createIcon = iconId => {
	let icon = document.createElement("i");
	icon.classList.add("fas", "fa-times");
	icon.id = iconId;
	return icon;
}

removeItem = id => {
	let item = document.getElementById(id);
	item.parentElement.classList.add("hidden");
	setTimeout(() => item.parentNode.remove(), 300);
	getTotal();
}

testExistence = testItem => {
	for (let i = 0; i < itemArray.length; i++) {
		if (itemArray[i]["item"] == testItem) {
		 removeItem(`cross${i}`);
		 itemArray[i] = {quantity: 0, unitPrice: 0};
		}
	}
}

testItemClicked = e => {
	let testItem = e.target.closest('.item').getElementsByTagName('h4')[1].innerHTML;
	if (e.target.matches(".fa-times")) {
		testExistence(testItem);
		getTotal();
	} else {
		let num = 0;
		if (e.target.matches(".fa-minus") || e.target.matches(".fa-plus")) {
			e.target.matches(".fa-plus") ? num = 1 : num = -1;
			let quantityId = `quantity${e.target.id.charAt(e.target.id.length - 1)}`;
			let curVal = parseInt(document.getElementById(quantityId).innerHTML);
			let newVal = constrain(curVal + num, 1, 10);
			document.getElementById(quantityId).innerHTML = newVal;
			itemArray.forEach(item => item.item == testItem ? item.quantity = newVal : null);
		}
		getTotal();
	}
}

getTotal = () => {
	let total = itemArray.reduce((acc, cur) => acc + (cur.quantity * cur.unitPrice), 0);
	document.getElementById("total").innerHTML = `Total: R${total}`;
}

createItems = () => {
	document.getElementById("dropdown").innerHTML = "";
	optionsArray.filter(item => (new RegExp(document.getElementById("item-type").value + '[A-z]*')
	.test(item)))
	.forEach(option => displayItem(option, `${count}`, "dropdown"));
}

post = () => {
	reduceArray();
	window.location = `/new_order/${JSON.stringify(itemArray)}`;
}

reduceArray = () => {
	let tempArr = [];
	itemArray.forEach(item => item.item ? tempArr.push(item) : null);
	itemArray = tempArr;
}