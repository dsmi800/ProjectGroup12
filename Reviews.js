var stars = 1;
const reviewList = document.querySelector("#reviewList");
const reviewForm = document.querySelector("#reviewForm")

// Create elements and render reviews
function renderReviews(doc) {
    let li = document.createElement('li');
    let rating = document.createElement('span');
    let review = document.createElement('span')
    
    li.setAttribute('data-id', doc.id);

    rating.textContent = "★".repeat([doc.data().Rating]) + "\n";
    review.textContent = doc.data().Review;

    li.appendChild(rating);
    li.appendChild(review);
    reviewList.appendChild(li);
}
//Getting data
db.collection('Reviews').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        renderReviews(doc);
    });
});

// Displays the number of stars the user selects
function displayStars(number) {
    for (i = 1; i <= number; i++) {
        document.getElementById(i).innerHTML = "★"
    }
    for (i = number + 1; i <= 5; i++) {
        document.getElementById(i).innerHTML = "☆"
    }  
    stars = number
};

//Saving data
reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('Reviews').add({
        Rating: stars,
        Review: reviewForm.review.value
    });
    reviewForm.review.value = "";
    displayStars(0)
});

//Real-time listener
db.collection('Reviews').orderBy('Rating').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added'){
            renderReviews(change.doc);
        }
    })
})

//Collapisble dialog
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
        content.style.maxHeight = null;
        } else {
        content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}