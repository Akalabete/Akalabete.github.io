showAll();
// permet l'affichage de tous les projets
function showAll(){
    fetch("http://localhost:5678/api/works") // recup depuis l'API
        .then(response => response.json()) // transforme la reponse en json
        .then(projects =>{ //crée mon tableau de projets
            console.log(projects); //controle du tableau
            for (let i = 0 ; i < projects.length; i++) {
                // crea de la balise gallery
                const galeryElement = document.querySelector(".gallery");
                // crea de la balise figure
                const project = document.createElement("figure");
                // ajout d'une classe spécifique par catégorie
                project.className= category(projects[i].category.id);
                // crea de la balise img
                const projectImg = document.createElement("img");
                projectImg.src = projects[i].imageUrl;
                projectImg.alt = projects[i].title;
                // crea de la balise figcatption
                const projectDescription = document.createElement("figcaption");
                projectDescription.innerText= projects[i].title;
                // attachement a la div gallery
                galeryElement.appendChild(project);
                // attachement au projet
                project.appendChild(projectImg);
                project.appendChild(projectDescription);
        }
    })
    //ajout de la class btn active au filtre par défaut
    inactiveButton();
    let currentActiveButton = document.querySelector(".all");
    activeButton(currentActiveButton);
}
// function qui va renommer la catégorie
function category(valeur) {
    if(valeur === 1) {
        return "obj";
    } else if(valeur === 2){
        return "apparts";
    }else if(valeur === 3){
        return"hotels_restaurants";
    }
}
// ajout de la class btn-active et inactive aux autres
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


// création des boutons


const bouttonShowAll = document.querySelector(".all");
const bouttonShowObjects = document.querySelector(".objects");
const bouttonShowAppartments = document.querySelector(".appartments");
const bouttonShowHotelsRestaurants = document.querySelector(".hotelsRestaurants");

// ajouts des events listeners et des fonctions associées au click
const apparts = document.getElementsByClassName("apparts");
const obj = document.getElementsByClassName("obj");
const hotel = document.getElementsByClassName("hotels_restaurants");

bouttonShowAll.addEventListener('click', function(){
    let currentActiveButton =  document.querySelector(".all");
    inactiveButton();
    activeButton(currentActiveButton);
    printWhat(all)
})
bouttonShowObjects.addEventListener('click', function(){
    let currentActiveButton =  document.querySelector(".objects");
    inactiveButton();
    activeButton(currentActiveButton);
    printWhat(obj);
})
bouttonShowAppartments.addEventListener('click', function(){
    let currentActiveButton =  document.querySelector(".appartments");
    inactiveButton();
    activeButton(currentActiveButton);
    printWhat(apparts);
})
bouttonShowHotelsRestaurants.addEventListener('click', function(){
    let currentActiveButton =  document.querySelector(".hotelsRestaurants");
    inactiveButton();
    activeButton(currentActiveButton);
    printWhat(hotel)
})


function printWhat(constType){
    document.querySelector(".gallery").innerHtml = '';
    show(constType);
}
