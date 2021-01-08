window.addEventListener("load", () => {
	for (delivery of deliveries) {
		let plus = 	document.getElementById(`plus-${delivery.orderId}`);
		plus.classList.toggle("plus");
		plus.classList.toggle("cross");
	}
});

toggleAppendItem = (id, curUser) => {
	console.log(curUser);
	if (curUser.userId) {
		let plus = 	document.getElementById(`plus-${id}`);
		plus.classList.toggle("plus");
		plus.classList.toggle("cross");
		toggleCartItem(id);
	}
}