if(document.readyState == "loading") {
	document.addEventListener("DOMContentLoaded", ready())
}
else {
	ready()
}

function ready() {
	let removeItemFromCardButtons = document.getElementsByClassName("remove-button")
	console.log(removeItemFromCardButtons)
	for (let i = 0; i < removeItemFromCardButtons.length; i++) {
		let button = removeItemFromCardButtons[i]
		button.addEventListener('click', removeCartItem)
}

	let quantityInputs = document.getElementsByClassName('cart-quantity-input')
	for (let i = 0; i < quantityInputs.length; i++) {
		let input = quantityInputs[i]
		input.addEventListener('change', quantityChanged)
}

	let addToCartButtons = document.getElementsByClassName("itemCartButton")
	for (let i = 0; i < addToCartButtons.length; i++) {
		let button = addToCartButtons[i]
		button.addEventListener("click", addToCartClicked)
}
	document.getElementsByClassName('btn-purchase')[0].addEventListener('click',purchaseClicked)

}

function purchaseClicked() {
	// Add form here in a pop up window 
	alert("Thank you for your purchase we'll be in contact to arrange payment and delivery.")
	let cartItems = document.getElementsByClassName('cart-items')[0]
	while (cartItems.hasChildNodes()) {
		cartItems.removeChild(cartItems.firstChild)
	}
	updateCartTotal()
}

function removeCartItem(event) {
	let buttonClicked = event.target
	buttonClicked.parentElement.parentElement.remove()
	updateCartTotal()
}

function updateCartTotal() {
    let cartItemContainer = document.getElementsByClassName('cart-items')[0]
    let cartRows = cartItemContainer.getElementsByClassName('cart-row')
    let total = 0
    for (let i = 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i]
        let priceElement = cartRow.getElementsByClassName('cart-price')[0]
        let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        let price = parseFloat(priceElement.innerText.replace('$', ''))
        let quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100 //round total to 2 dp
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}

function quantityChanged(event) {
	let input = event.target
	if (isNaN(input.value) || input.value <=0 ) {
		input.value = 1
	}
	
	updateCartTotal()
} 

function addToCartClicked(event) {
   let button = event.target
    let shopItem = button.parentElement.parentElement
    let title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    let price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
	let code = shopItem.getElementsByClassName('shop-item-code')[0].innerText
    addItemToCart(title, price, code)
	updateCartTotal() 
}

function addItemToCart(title, price, code) {
	let cartRow = document.createElement('div')
	cartRow.classList.add('cart-row')
	let cartItems = document.getElementsByClassName('cart-items')[0]
	console.log(cartItems)
	let cartItemNames = cartItems.getElementsByClassName('cart-item-title')
	console.log(cartItemNames)
	for (let i=0; i < cartItemNames.length; i++) {
		if (cartItemNames[i].innerText == title) {
			alert("This item is already in your cart, view your cart to make a purchase")
			return
	}}
	let cartRowContents = `
		<div class="cart-item-code-column">
        <span class="cart-item-code-title">${code}</span>
        </div>
        <div class="cart-item cart-column">
        <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
        <input class="cart-quantity-input" type="number" value="1">
        <button class="remove-button" type="button">REMOVE</button>
        </div>`
	cartRow.innerHTML = cartRowContents
	cartItems.append(cartRow)
	cartRow.getElementsByClassName('remove-button')[0].addEventListener('click', removeCartItem)
	cartRow.getElementsByClassName('cart-quantity')[0].addEventListener('change', quantityChanged)
	
}
