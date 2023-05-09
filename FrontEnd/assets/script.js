fetch("http://localhost:5678/api/works") // recup depuis l'API
.then(response => response.json()) // transforme la reponse en json
.then(projects =>{ //crée mon tableau de projets
    console.log(projects); //controle du tableau
    for (let i = 0 ; i < projects.length; i++) {
        // crea de la balise gallery
        const galeryElement = document.querySelector(".gallery");
        // crea de la balise figure
        const project = document.createElement("figure");
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
