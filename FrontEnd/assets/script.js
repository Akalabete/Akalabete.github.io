let projects;

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

showAll();