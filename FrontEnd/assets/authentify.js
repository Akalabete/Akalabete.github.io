const form = document.querySelector("form");
let username;
let password;
let token = null;
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
  .then(response => response.json())
  .then(data => handleResponse(data))
  .catch(error =>  {
    console.log(error);
});
}

function generateUser(){
  user.email = username;
  user.password = password;
}

function handleResponse(data) {
  console.log(data);
  if(data.userId !== 1){
    alert("Identifiants non reconnus");
    //reset des champs sur mauvaise id
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
  } else {
    // enregistrement du token
    token = data.token
    sessionStorage.setItem("token", token);// stockage
    redirection();
    console.log(token);

  }
  
}

function redirection(){
  document.location.href="./index.html";
  const token = sessionStorage.getItem("token"); // récupère le token depuis le localStorage
  if (token!==null) {
    alert("Bienvenue Sophie");    
  } else {
    alert("Veuillez vous connecter d'abord");    
  }
}