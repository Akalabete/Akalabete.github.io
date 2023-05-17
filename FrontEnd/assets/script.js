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
  const modalOne = document.querySelector(".one");
  modalOne.setAttribute("style", "display: block")
  const modalTwo = document.querySelector(".two");
  modalTwo.setAttribute("style", "display: none");
  const backBtn = document.querySelector(".cancel-add");
  backBtn.setAttribute("style", "display: none");
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
    const projectEdition = document.createElement("p");
    projectEdition.innerText = "éditer";
    projectEdition.classList.add(`project-edit`) 
    project.appendChild(projectImg);
    project.appendChild(projectEdition);
    galeryElement.appendChild(project);
  }
  // ajout du listener de modification 
  const projectEditionBtns = document.querySelectorAll(".project-edit");
  console.log(projectEditionBtns);
  for (let j = 0; j < projectEditionBtns.length; j++) {
    const projectEditionBtn = projectEditionBtns[j];
    let imgUrl= projects[j].imageUrl;
    let picTitle= projects[j].title;
    let cat= projects[j].categoryId;
    projectEditionBtn.addEventListener("click", function() {
      console.log("clicked");
      modifyPic(imgUrl, picTitle, cat);
    });
  }
}


// construction de la page d'édition du lien édit
function modifyPic(imgUrl, picTitle, cat){
  console.log("clicked");
  addNewPic();
  const editTitle = document.querySelector('.modal-two-title');
  editTitle.innerText = "Edition de photo";
  const previewImage = document.getElementById('previewImage');
  previewImage.src = imgUrl;
  previewImage.style.display = 'flex'
  const fontAwsomeDefault = document.querySelector('.enlarge');
  fontAwsomeDefault.style.display= "none";
  const title = document.getElementById('title');
  title.value = picTitle;
  const category = document.getElementById("categories");
  category.value = cat;
}


//permutation entre les pages de la modale

function addNewPic(){
  const backBtn = document.querySelector(".cancel-add");
  backBtn.setAttribute("style", "display: block");
  backBtn.addEventListener("click", printModalOne);
  const modalTwo = document.querySelector(".two");
  modalTwo.setAttribute("style", "display: block");
  console.log(modalTwo);
  const modalOne = document.querySelector(".one");
  modalOne.setAttribute("style", "display: none");
}


// retour arrière

function printModalOne(){  
  const modalTwo = document.querySelector(".two");
  modalTwo.setAttribute("style", "display: none");
  const modalOne = document.querySelector(".one");
  modalOne.setAttribute("style", "display: block");
  const backBtn = document.querySelector(".cancel-add");
  backBtn.setAttribute("style", "display: none");
  resetPic()
  backBtn.removeEventListener("click", printModalOne);  
}

// function qui verifie et annule l'ajout de la photo

function resetPic(){
  if(previewImage.style.display = 'flex'){
    const fileInput = document.getElementById('fileInput');
    const previewImage = document.getElementById('previewImage');
    const fontAwsomeDefault = document.querySelector('.enlarge');
    previewImage.src = '#';
    previewImage.style.display = 'none';
    fileInput.value = '';
    fontAwsomeDefault.style.display = 'flex';
  }else {
    return;
  }
} 


// function ajout d'une photo

function handleFileSelect(event) {
  const file = event.target.files[0];
  const previewImage = document.getElementById('previewImage');
  const fontAwsomeDefault = document.querySelector('.enlarge');
  if (file && file.type.match('image.*')) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
      previewImage.style.display = 'flex';
      fontAwsomeDefault.style.display = 'none';
    };
    reader.readAsDataURL(file);
  } else {
    previewImage.style.display = 'none';
  }
}