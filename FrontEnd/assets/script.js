// mes variables
let projects;
let isModalOpen = false;

// Récupération du token d'authentification
const token = sessionStorage.getItem("token");
const modalContainer = document.querySelector(".modal-container");
const closeCross = document.querySelector(".close-modal-cross");

// creation de la modale au chargement
function createModal(){
  const target = document.querySelector("#modal");
  target.setAttribute('style', 'display: none');
  target.setAttribute('aria-hidden', 'true');
  target.setAttribute('aria-modal', 'false');
}

createModal();

// ajout de Sophie a la place du bouton login et verification du token d'auth
if (token) {
  const logged = document.querySelector(".connected");
  logged.innerHTML = 'logout';
  logged.addEventListener("click", reinit);
  const magicElements = document.querySelectorAll(".magic");
  magicElements.forEach(magicElement => magicElement.style.display = "flex");
  showAll();
} else { 
  showAll();
}

// definition de la fonction logout
function reinit(event){
  event.preventDefault();
  sessionStorage.removeItem("token");
  location.reload();
  alert("A bientôt!");
}

//ajout des liens modifier
const editLinks = document.querySelectorAll(".js-modal");
editLinks.forEach(link => {
  link.addEventListener("click", openModal);
});

// ouverture de la modale au click
function openModal(event) {
  event.stopPropagation(); // Empêche la fermeture immédiate de la modale
  //console.log("clicked");

  // changement des attributs de la modale
  const target = document.querySelector("#modal");
  target.setAttribute('style', 'display: flex');
  target.setAttribute('aria-hidden', 'false');
  target.setAttribute('aria-modal', 'true');
  //console.log(target);
  isModalOpen = true;
  //console.log(isModalOpen);

  //creation du contenu dynamique de la modale
  dynamicModalContent(projects);

  // Ajout de la possibilité de quitter la modale
  // en cliquant hors champs, désynchronisé
  setTimeout(function() {
    //console.log("timed ?");
    addEvent();
  }, 100);
}

//  ajout de l'eventlistener
function addEvent() {  
  window.addEventListener("click", outsideClick);
  closeCross.addEventListener("click", outsideClick);
}

// fonction qui verifie que l'on clique bien en dehors de la
// modale ou sur la croix
function outsideClick(event) {
  if (!modalContainer.contains(event.target)|| closeCross.contains(event.target)){
    closeModal();
  }
}

// fonction qui ferme la modale
function closeModal() {
  //console.log(isModalOpen);
  if (isModalOpen == true) {
    //console.log("je ferme tout seul?");
    createModal()
    window.removeEventListener("click", outsideClick);
    closeCross.removeEventListener("click", outsideClick);
    isModalOpen = false;
  } else {
    return;
  }
}

// affichage du contenu dynamique
function showAll() {
  fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(data => {
      projects = data;
      // Afficher les données pour la première fois (par défaut)
      showProjects(projects);
    });

  //  bouton "Tout"
  const bouttonShowAll = document.querySelector(".all");
  bouttonShowAll.addEventListener("click", function () {
    showProjects(projects);
    let currentActiveButton =  document.querySelector(".all");
    inactiveButton();
    activeButton(currentActiveButton);
  });

  //  bouton "Objets"
  const bouttonShowObjects = document.querySelector(".objects");
  bouttonShowObjects.addEventListener("click", function () {
    const obj = projects.filter(project => project.category.id === 1);
    showProjects(obj);
   let currentActiveButton =  document.querySelector(".objects");
    inactiveButton();
    activeButton(currentActiveButton);
  });

  //  bouton "Appartements"
  const bouttonShowAppartments = document.querySelector(".appartments");
  bouttonShowAppartments.addEventListener("click", function () {
    const apparts = projects.filter(project => project.category.id === 2);
    showProjects(apparts);
    let currentActiveButton =  document.querySelector(".appartments");
    inactiveButton();
    activeButton(currentActiveButton);
  });

  // bouton "Hotels & Restaurants"
  const bouttonShowHotelsRestaurants = document.querySelector(".hotelsRestaurants");
  bouttonShowHotelsRestaurants.addEventListener("click", function () {
    const hotelsRestaurants = projects.filter(project => project.category.id === 3);
    showProjects(hotelsRestaurants);
    let currentActiveButton =  document.querySelector(".hotelsRestaurants");
    inactiveButton();
    activeButton(currentActiveButton);
  });
}

// contructeur de la mini gallerie
function showProjects(projects) {
  const galeryElement = document.querySelector(".gallery");
  galeryElement.innerHTML = "";
  for (let i = 0; i < projects.length; i++) {
    // créa des éléments figures
    const project = document.createElement("figure");
    // créa et mise en forme des image avec le alt
    const projectImg = document.createElement("img");
    projectImg.src = projects[i].imageUrl;
    projectImg.alt = projects[i].title;
    // creé et mise en forme de la description
    const projectDescription = document.createElement("figcaption");
    projectDescription.innerText = projects[i].title;
    // rattachement au parents
    project.appendChild(projectImg);
    project.appendChild(projectDescription);
    galeryElement.appendChild(project);
  }

  //ajout de la class btn active au filtre par défaut
  inactiveButton();
  let currentActiveButton = document.querySelector(".all");
  activeButton(currentActiveButton);
}

// fonction qui vont attribuer  btn-active et inactive bouttons
function inactiveButton(){
    const buttonCount = document.querySelectorAll(".show");
    buttonCount.forEach(function(item){
        item.classList.remove("btn-active")
        item.classList.add("btn-inactive")
    })
}
function activeButton(currentActiveButton){
    currentActiveButton.classList.remove("btn-inactive");
    currentActiveButton.classList.add("btn-active");
}

// constructeur de la mini gallerie
function dynamicModalContent(projects){
  // bouton ajout d'une photo
  const modalTwo = document.querySelector(".two");
  modalTwo.setAttribute("style", "display: none");
  const addPhoto = document.querySelector(".photo-add");
  addPhoto.addEventListener('click', addNewPic);
  const galeryElement = document.querySelector("#modal-gallery");
  galeryElement.innerHTML = "";
  for (let i = 0; i < projects.length; i++) {
    const project = document.createElement("figure");
    const projectImg = document.createElement("img");
    projectImg.src = projects[i].imageUrl;
    projectImg.alt = projects[i].title;

    // ajout du lien d'édition
    const projectEdition = document.createElement("a");
    projectEdition.innerText = "éditer";
    project.appendChild(projectImg);
    project.appendChild(projectEdition);
    galeryElement.appendChild(project);
  }
}

//permutation entre les pages de la modale
function addNewPic(){
  const modalOne = document.querySelector(".one");
  modalOne.setAttribute("style", "display: none");
  const modalTwo = document.querySelector(".two");
  modalTwo.setAttribute("style", "display: flex")
}
// creation du formulaire d'ajout de photo


// annulation de l'ajout de photo avec le bouton <-
//const backBtn = document.querySelector(".cancel-add");
//backBtn.addEventListener("click", openModal);

function backToModalOne(){
  
  const modalTwo = document.querySelector(".two");
  modalTwo.setAttribute("style", "display: none");
  const modalOne = document.querySelector(".one");
  modalOne.setAttribute("style", "display: flex")
}