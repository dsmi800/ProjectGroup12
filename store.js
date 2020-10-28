/* STORE.JS
Author: Darrell Smith (ID: 263000704)
Used on Smart Electricity Index Page 
includes addToCart and purchase features and references a Firestore database
*/

if(document.readyState == "loading") {
	document.addEventListener("DOMContentLoaded", ready())
}
else {
	ready()
}

/**

 This function adds event listeners to all buttons on the HTML page 
 sets up the modal window for the purchase form which runs when the user
 clicks on the place your order button
 
 @param nothing.
 @returns nothing.

**/
function ready() {
	// Finds all remove from cart buttons and add's event listener to perform removeCartItem function when clicked.
	let removeItemFromCartButtons = document.getElementsByClassName("remove-button")
	for (let i = 0; i < removeItemFromCartButtons.length; i++) {
		let button = removeItemFromCartButtons[i]
		button.addEventListener('click', removeCartItem)
}
	// Finds all quantity input boxes and add's event listener to perform quantityChanged function when a change is detected. 
	let quantityInputs = document.getElementsByClassName('cart-quantity-input')
	for (let i = 0; i < quantityInputs.length; i++) {
		let input = quantityInputs[i]
		input.addEventListener('change', quantityChanged)
}
	// Finds all addtoCartButtons and add's event listener to perform addtoCartClicked function when button is clicked.
	let addToCartButtons = document.getElementsByClassName("itemCartButton")
	for (let i = 0; i < addToCartButtons.length; i++) {
		let button = addToCartButtons[i]
		button.addEventListener("click", addToCartClicked)
}
	
	// adds event listener to submit button on purchase form (on modal window). 
	const form =document.querySelector("#orderForm")
	form.addEventListener('submit', (e) => {
	e.preventDefault(); // stops the default submit action of reloading the page
	submitOrder(form,modal)}) // runs the submitOrder function, passing it the form and the modal. 


	// Gets the modal
	let modal = document.getElementById("myModal")
	// Gets the button that opens the modal
	let btn = document.getElementById("myBtn")
	// Gets the (x) element that closes the modal
	let span = document.getElementsByClassName("close")[0]
	
		// When the user clicks on the button, open the modal
	btn.onclick = function() {
	  let returnedObject = updateCartTotal()
	  

	// if no items in the cart then displays alert and does not open modal 
	  if (returnedObject[0] != 0) { 
	  modal.style.display = "block";
	} 
	
	else if (returnedObject[0] == 0) {
		alert("You must add an item to your cart to complete an order.")
	}
	
	}

	// When the user clicks on (x) closes the modal
	span.onclick = function() {
	  modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal this closes it
	window.onclick = function(event) {
	  if (event.target == modal) {
		modal.style.display = "none";
	  }
	
}
}
/**

 This function is run after any add to cart button is clicked. It gets the 
 title, price and item code of the item that the user wants to add to their
 cart and runs the addItemToCart function and passes these details to that function. 
 
 
 @param {event} event - the event of the add to cart button being clicked. 


**/
function addToCartClicked(event) {
   let button = event.target
    let shopItem = button.parentElement.parentElement
    let title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    let price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
	let code = shopItem.getElementsByClassName('shop-item-code')[0].innerText
    addItemToCart(title, price, code)
	updateCartTotal() 
}

/**

 This function takes three parameters (title, price and code)
 and uses them to modify the page's HTML by adding a row to the 
 cart that displays the title, price and code of the item. 
 
 This function runs after the addToCartClicked function and returns no value.
 
 @param {string} title - the title of the item from the product section 
 @param {string} price - the price of the item from the product section
 @param {string} code - the code associated with the item from the product section
 @returns nothing.

**/
function addItemToCart(title, price, code) {
	let cartRow = document.createElement('div')
	cartRow.classList.add('cart-row')
	let cartItems = document.getElementsByClassName('cart-items')[0]
	let cartItemNames = cartItems.getElementsByClassName('cart-item-title')
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

/**

This function is run after the user clicks the remove button which appears
on each cart row. It removes the entire row in the cart and the runs the 
updateCartTotal function to update the total displayed at the bottom of the cart.

@param {event} event - the event of the remove button being clicked. 


*/
function removeCartItem(event) {
	let buttonClicked = event.target
	buttonClicked.parentElement.parentElement.remove()
	updateCartTotal()
}

/**

This function goes through all the items in the user's cart and works out the 
cart total by working out each line total (price * quantity) and adding this 
to the overall total. It is also used to collect and return information about the 
cart contents and total to other functions. 

The function runs after any change to the items in the cart; including when the
 user adds an item, removes an item or changes the quantity of an item. It is also 
 run when the user wants to complete their order to collect the information to 
 be saved in the Cloud Firestore database. 

@param none
@returns {array} itemsObject - an array which holds details of the items in the car
								their code, title, quantity and price) and the cart total.


*/
function updateCartTotal() {
    let cartItemContainer = document.getElementsByClassName('cart-items')[0]
    let cartRows = cartItemContainer.getElementsByClassName('cart-row')
    let total = 0
	let itemsObject = []
    for (let i = 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i]
        let priceElement = cartRow.getElementsByClassName('cart-price')[0]
        let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
		let itemCodeElement = cartRow.getElementsByClassName('cart-item-code-title')[0]
		let itemTitleElement = cartRow.getElementsByClassName('cart-item-title')[0]
        let price = parseFloat(priceElement.innerText.replace('$', ''))
        let quantity = quantityElement.value
		let itemTitle = itemTitleElement.innerHTML
		let itemCode = itemCodeElement.innerHTML
        total = total + (price * quantity)
		itemsObject.push({itemTitle: itemTitle, itemCode: itemCode, quantity: quantity, Price:price})
    }
    total = Math.round(total * 100) / 100 //round total to 2 dp
    itemsObject.push(total)
	document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
	return itemsObject
}

/**

This function is run after a change is detected in the quantity input field. 
It gets the number in the field after the change and checks it is more than
one. If so it updates the cart total using the UpdateCartTotal function. Else it
changes the value back to one and updates the cart total using the UpdateCartTotal 
function. 

@param {event} event - the event of the quantity input being changed.


*/
function quantityChanged(event) {
	let input = event.target
	if (isNaN(input.value) || input.value <=0 ) {
		input.value = 1
	}
	
	updateCartTotal()
} 



/**

This function is run after the user clicks the submit button which appears
on the purhcase form modal window. It runs the updateCartTotal function and uses
the returnedObject array to find the information about the contents and total of the 
user's cart. It then creates an object with the current date, all the details from the form and 
details about the cart. It then uses the object to add a document to the form with each key becoming
a field with the associated value. The function then closes the modal window and resets the form then 
runs the completeOrder function. 

@param {form} form - the web form from the HTML document. 
@param (modal) modal - the modal window part of the HTML document. 


*/
function submitOrder(form,modal) {
	let returnedObject = updateCartTotal()
	let cartItems = returnedObject[0]
	let itemCode = cartItems.itemCode
	let itemName = cartItems.itemTitle
	let quantity = cartItems.quantity
	let total = returnedObject[1]

	

	let object = {
		date: new Date(),
        name: form.name.value,
		phoneNumber: form.phoneNumber.value,
		email: form.email.value,
		SALine1: form.SALine1.value,
		SALine2: form.SALine2.value,
		SACity: form.SACity.value,
		SAPostcode: form.SAPostcode.value,
		Total: total,
		QuantityofItem: quantity,
		ItemCode: itemCode,
		ItemName: itemName
    }

    database.collection('Orders').add(object)
	form.reset()
	modal.style.display = "none"
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	completeOrder()
}

/**

This function is run after the submitOrder function. It displays an alert that the order has been
completle and then empties the cart and resets the cart total back to zero. 

*/
function completeOrder(){
	alert("Thank you for your purchase we'll be in contact to arrange payment and delivery.")
	let cartItems = document.getElementsByClassName('cart-items')[0]
	while (cartItems.hasChildNodes()) {
		cartItems.removeChild(cartItems.firstChild)
	}
	updateCartTotal()

}
