let addToy = false;
const toyCollection = document.querySelector("#toy-collection");

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy; // true -> false
    if (addToy) {
      toyFormContainer.style.display = "block"; // SHOW THE CONTENT
    } else {
      toyFormContainer.style.display = "none"; // HIDE THE CONTENT
    }
  });

  // OUR CODE IS GOING TO IN THE DOMCONTENT LOADED

  // 1. 'GET' request to fetch all the toy objects.
  getAllToys();
  // 2. Make a div with class of card for each toy
  // 3. add it to the toy-collection
});

function getAllToys() {
  fetch("http://localhost:3000/toys")
    .then((r) => r.json())
    .then((toys) => renderToys(toys));
}

function renderToys(toys) {
  toys.forEach((toyObject) => makeOneToyCard(toyObject));
}

function makeOneToyCard(toyObject) {
  // Making a div
  console.log(toyObject);
  const cardDiv = document.createElement("div");
  cardDiv.className = "card";

  const h2 = document.createElement("h2"); // <h2></h2>
  h2.textContent = toyObject.name;

  const img = document.createElement("img");
  img.src = toyObject.image;
  img.className = "toy-avatar";

  // `p` tag with how many likes that toy has
  const p = document.createElement("p");
  p.textContent = toyObject.likes;
  p.style.fontSize = "25px";
  // `button` tag with a class "like-btn" and an id attribute set to the toy's id
  //   number

  const button = document.createElement("button");
  button.className = "like-btn";
  button.id = toyObject.id;
  button.textContent = "LIKE <3";

  cardDiv.append(h2, img, p, button);
  toyCollection.append(cardDiv);
}

function postAToy(formData) {
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: formData.name,
      image: formData.image,
      likes: 0,
    }),
  };

  fetch("http://localhost:3000/toys", config)
    .then((r) => r.json())
    .then((toyObject) => makeOneToyCard(toyObject));
}

// TARGET THE FORM
const form = document.querySelector(".add-toy-form");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // STOPS REFRESH
  const formData = {};
  formData.name = e.target.name.value;
  formData.image = e.target.image.value;
  postAToy(formData);
  e.target.reset();
});

document.addEventListener("click", (event) => {
  if (event.target.className === "like-btn") {
    const buttonId = event.target.id;
    const currentLikes = Number(
      event.target.previousElementSibling.textContent
    );
    const newLikes = currentLikes + 1;
    // Passing down the button ID
    // Passing down the new Likes
    // Passing down the entire button
    patchLikes(buttonId, newLikes, event.target);
  }
});

function patchLikes(id, newLikes, button) {
  const config = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      likes: newLikes,
    }),
  };

  fetch(`http://localhost:3000/toys/${id}`, config)
    .then((r) => r.json())
    .then((data) => {
      const p = button.previousElementSibling;
      p.textContent = data.likes;
    });
}
