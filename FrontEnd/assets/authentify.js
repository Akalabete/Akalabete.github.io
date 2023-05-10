const form = document.querySelector("form");
let username;
let password;

let user = {
  "email" : username,
  "password": password 
} 

form.addEventListener("submit", handleForm)

function handleForm (event){
  event.preventDefault(); // empêcher la soumission par défaut du formulaire
  username = document.getElementById("email").value;
  password = document.getElementById("password").value;
  generateUser()
  console.log(user)
  let response = fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(user)
  })
}

function generateUser(){
  user.email = username;
  user.password = password;
}
