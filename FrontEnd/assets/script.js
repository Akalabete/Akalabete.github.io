// mes variables
let projects = [];
let isModalOpen = false;
let isAdmin = 0;
let file;
let localUrl;
// Récupération du token d'authentification
const token = sessionStorage.getItem("token");
const modalContainer = document.querySelector(".modal-container");
const closeCross = document.querySelector(".close-modal-cross");
// je cache l'un des boutons modifier au chargement 
const hidden = document.querySelector('.hidden');
hidden.style.display = 'none';
// creation de la modale au chargement
function createModal(){
  const target = document.querySelector("#modal");
  target.setAttribute('style', 'display: none');
  target.setAttribute('aria-hidden', 'true');
  target.setAttribute('aria-modal', 'false');
}

createModal();

// ajout de logout a la place du bouton login et verification du token d'auth
if (token) {
  isAdmin = 1;
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
  //permutation des boutons modifier
  const displayed = document.querySelector('.displayed');
  displayed.style.display = 'none';
  const hidden = document.querySelector('.hidden');
  hidden.style.display = 'flex';
  event.stopPropagation(); // Empêche la fermeture immédiate de la modale
  // changement des attributs de la modale
  const target = document.querySelector("#modal");
  target.setAttribute('style', 'display: flex');
  target.setAttribute('aria-hidden', 'false');
  target.setAttribute('aria-modal', 'true');
  isModalOpen = true;

  //creation du contenu dynamique de la modale
  dynamicModalContent(projects);
  // Ajout de la possibilité de quitter la modale
  // en cliquant hors champs, désynchronisé
  setTimeout(function() {
    addEvent();
  }, 100);
}


//  ajout de l'eventlistener sur la globalité de la page
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
  if (isModalOpen == true) {
    createModal()
    window.removeEventListener("click", outsideClick);
    closeCross.removeEventListener("click", outsideClick);
    isModalOpen = false;
    const displayed = document.querySelector('.displayed');
    displayed.style.display = 'flex';
    const hidden = document.querySelector('.hidden');
    hidden.style.display = 'none';
  } else {
    return;
  }
}


// affichage du contenu dynamique
function showAll() {
  fetch("http://localhost:5678/api/works")
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      projects = data;
      // Afficher les données pour la première fois (par défaut)
      showProjects(projects);
    })
    .catch(error => {
      alert(`Erreur: ${error}`);
      console.error("error");
    });
}
    

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



// constructeur de la gallerie
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
  const deleteAllBtn = document.querySelector('.delete-gallery');
  deleteAllBtn.addEventListener('click', function(){
    deleteAll();
  })
  for (let i = 0; i < projects.length; i++) {
    const project = document.createElement("figure");
    const projectImg = document.createElement("img");
    projectImg.src = projects[i].imageUrl;
    projectImg.alt = projects[i].title;
    // ajout du fa trashcan 
    const iconContainer = document.createElement("div");
    iconContainer.classList.add("icon-container");
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-trash-can", "fa-xs")
    project.classList.add("trashcan");
    // ajout du lien d'édition
    const projectEdition = document.createElement("p");
    projectEdition.innerText = "éditer";
    projectEdition.classList.add(`project-edit`);
    iconContainer.appendChild(icon)
    project.appendChild(iconContainer);
    project.appendChild(projectImg);
    project.appendChild(projectEdition);
    galeryElement.appendChild(project);
  }
  // ajout du listener de modification 
  const projectEditionBtns = document.querySelectorAll(".project-edit");
  for (let j = 0; j < projectEditionBtns.length; j++) {
    const projectEditionBtn = projectEditionBtns[j];
    let imgUrl= projects[j].imageUrl;
    let picTitle= projects[j].title;
    let cat= projects[j].categoryId;
    projectEditionBtn.addEventListener("click", function() {
      modifyPic(imgUrl, picTitle, cat);
    });
  }
  // ajout du listener sur le bouton trash
  const trashCanBtns = document.querySelectorAll(".icon-container");
  for (let k = 0; k < trashCanBtns.length; k++){
    const trashCanBtn = trashCanBtns[k];
    let projectID = projects[k].id;
    trashCanBtn.addEventListener('click', function() {
      deleteItem(projectID);
    })
  }
}


// construction de la page d'édition du lien édit

function modifyPic(imgUrl, picTitle, cat){
  addNewPic();
  const editTitle = document.querySelector('.modal-two-title');
  editTitle.innerText = "Edition de photo";
  const modPicBtn = document.querySelector('.custom-file-upload-span');
  modPicBtn.innerText = "Changer photo"; 
  const previewImage = document.getElementById('previewImage');
  previewImage.src = imgUrl;
  previewImage.style.display = 'flex'
  const fontAwsomeDefault = document.querySelector('.enlarge');
  fontAwsomeDefault.style.display= "none";
  const title = document.getElementById('title');
  title.value = picTitle;
  const category = document.getElementById("categories");
  category.value = cat;

  // ajouter une conditionnelle sur la fonction addNewPic qui deleterait l'item a changer pour ajouter l'item changé
  // car impossible de changer l'item dans la bdd ???
}


//permutation entre les pages de la modale btn nouveau projet

function addNewPic(){
  const backBtn = document.querySelector(".cancel-add");
  backBtn.setAttribute("style", "display: block");
  backBtn.addEventListener("click", printModalOne);
  const modalTwo = document.querySelector(".two");
  modalTwo.setAttribute("style", "display: block");
  const modalOne = document.querySelector(".one");
  modalOne.setAttribute("style", "display: none");
  // ajout d'un listener sur la page d'ajout
  const validateAdd = document.getElementById("addingNewPic");
  validateAdd.addEventListener('submit', function(e){
    e.preventDefault();
    const fileInput = document.getElementById('previewImage')
    const imgUrl =  fileToUpload; 
    const localShow = localUrl
    const titleInput = document.getElementById('title');
    const picTitle = titleInput.value;    
    const catInput = document.getElementById('categories');
    const cat = catInput.value;    
    createNewProject(localShow, imgUrl, picTitle, cat);
    
  })
}

// crea d'un nouveau projet avec validation des champs
function createNewProject(localShow, imgUrl, picTitle, cat) {
  if (localShow, imgUrl && picTitle && cat) {

//v2 erreur 400
  const formData = new FormData();
    formData.append('image', imgUrl);
    formData.append('title', picTitle);
    formData.append('category', cat);

   

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
       // "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
      //body: formatedPost
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(data => {
        // Mise à jour de projects[]
        // ...
      })
      .catch(error => {
        alert("Problème lors de l'ajout de votre projet : " + error);
      });

    let catValue = "";
    if (cat === 1) {
      catValue = "Objets";
    } else if (cat === 2) {
      catValue = "Appartements";
    } else if (cat === 3) {
      catValue = "Hotels & restaurants";
    }

    const newObject = {
      'category': {
        'id': cat,
        'name': catValue
      },
      'id': projects.length + 1,
      'categoryId': cat,
      'title': picTitle,
      'imageUrl': localShow,
      'userId': isAdmin
    };
   
    projects.push(newObject);
    showProjects(projects);
    dynamicModalContent(projects);
    
  } else {
    alert('Merci de bien vouloir renseigner tous les champs.');
  }
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
    const fontAwsomeDefault = document.getElementById('enlarge');
    const formatType = document.querySelector('.format-type');
    const customFileUpload = document.querySelector('.custom-file-upload'); 
    previewImage.removeEventListener('click', resetPic)
    previewImage.src = '#';
    previewImage.style.display = 'none';
    fileInput.value = '';
    fontAwsomeDefault.style.display = 'flex';
    formatType.style.display= 'flex';
    customFileUpload.style.display= 'flex';
    globalImgUrl = null;
  }else {
    return;
  }
} 


// function ajout d'une photo

function handleFileSelect(event) {
  const file = event.target.files[0];
  const previewImage = document.getElementById('previewImage');
  const fontAwsomeDefault = document.getElementById('enlarge');
  const formatType = document.querySelector('.format-type');
  const customFileUpload = document.querySelector('.custom-file-upload'); 
  if (file && file.type.match('image.*')) {
    const reader = new FileReader();
    reader.onload = function (e) {
      fileToUpload = file;
      localUrl = e.target.result;
      previewImage.src = e.target.result;
      previewImage.style.display = 'flex';
      fontAwsomeDefault.style.display = 'none';
      formatType.style.display= 'none';
      customFileUpload.style.display= 'none';
    };
    reader.readAsDataURL(file);
    previewImage.addEventListener('click', function(){
      resetPic();
    })
  } else {
    previewImage.style.display = 'none';
  }
}

// function de suppression d'une photo dans la mini gallerie fa trashcan

function deleteItem(projectID) {
  const confirmed = confirm("Voulez-vous vraiment supprimer ce projet?")
  if (confirmed) {
    const updatedProjects = projects.filter(project => project.id !== projectID)
    projects = updatedProjects;
    showProjects(projects);
    dynamicModalContent(projects);
    deleteItemApi(projectID);

  }
}


// format delete = ID ? http://localhost:5678/api/works/${projectID}
function deleteItemApi(projectID) {
  fetch(`http://localhost:5678/api/works/${projectID}`, 
  { 
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    }
  })
    .then(async response => {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson && await response.json();

        // check for error response
        if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
        }

        alert('Projet supprimé!');
    })
    .catch(error => {
        alert(`Erreur: ${error}`);
        console.error('There was an error!', error);
    });
    showProjects(projects);
    dynamicModalContent(projects)
}

// ajout de la fonctionnalité deletAll

function deleteAll() {
  const confirmed = confirm("Voulez-vous vraiment supprimer tous vos projets?")
  if(confirmed){
    for (let i = projects.length; i > 0; i--){
      const projectID = i;
      const updatedProjects = projects.filter(project => project.projectID !== projectID)
      projects = updatedProjects;
      deleteItemApi(projectID);
    }
    showProjects(projects);
    dynamicModalContent(projects);
  }else {
    return;
  }
}

