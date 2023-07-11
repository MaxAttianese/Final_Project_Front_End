// Html Connection

// Div for append card
let cardSectionConteiner = document.getElementById("card-container");

// Nav dropdown ul
let dropdowncategory = document.getElementById("dropdowncategory");

//Form
let formconnect = document.getElementById("formconnect");

// Searchbar
let nameSearch = document.getElementById("nameSearch");

// Filterbar
let categorySearch = document.getElementById("categorySearch");

// Orderbar
let ordPosts = document.getElementById("ordPosts");



// Call Server

fetch("./server/api_categorie/categorie.json")
.then((Response) =>{

    return Response.json();

})
.then((objsServer) =>{

    for(let i = 0; i < objsServer.length; i++){

        postCards(objsServer[i].name, objsServer[i].announcementsCount)

    };

    objsServer.forEach((obj) =>{
        categoryCreate(obj) 
    });

    filtercategory(objsServer);

})
.catch((error) =>{

    console.error(error);

});



// Navbar and Form category create

function categoryCreate(obj) {

    let liCategory = document.createElement("li");
    liCategory.classList.add("dropdown-link", "p-1");

    let linkCategory = document.createElement("a");
    linkCategory.classList.add("dropdow-item", "ps-3", "dropdown-link");
    linkCategory.setAttribute("href", "#dropdown-link");
    linkCategory.textContent = obj.name;
    liCategory.appendChild(linkCategory);
    dropdowncategory.appendChild(liCategory);

    let optionCategory = document.createElement("option");
    optionCategory.setAttribute("value", obj.name);
    optionCategory.textContent = obj.name;
    categorySearch.appendChild(optionCategory);

}



// Creation Categories

function postCards(catName, catnumber) {

    let postCard = document.createElement("div");
    postCard.classList.add("col-12", "col-md-6", "col-lg-4", "col-xl-3", "p-2", "card-bgc");
    cardSectionConteiner.appendChild(postCard);

    let cardConteiner = document.createElement("div");
    cardConteiner.classList.add("card", "card-bdash")
    postCard.appendChild(cardConteiner);

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "d-flex", "flex-column", "align-items-center");
    cardConteiner.appendChild(cardBody);

    let divBody = document.createElement("div");
    divBody.classList.add("circle-aiplane", "mb-4", "mt-2");
    cardBody.appendChild(divBody);

    let icon = document.createElement("i");
    icon.classList.add("bi", "bi-airplane", "color-card");
    divBody.appendChild(icon);

    let postTitle = document.createElement("h3");
    postTitle.textContent = catName;
    cardBody.appendChild(postTitle);

    let postParagraph = document.createElement("p");
    if(catnumber < 2){
        postParagraph.textContent = `${catnumber} Annuncio`;
    }
    else{
        postParagraph.textContent = `${catnumber} Annunci`;
    };
    cardBody.appendChild(postParagraph);
   

};



//wirkwithus

let formwwu = document.getElementById("formWwu");

formwwu.addEventListener("submit", (event) =>{
    event.preventDefault();

    if(!formwwu.checkValidity()){
        console.error("validazione non avvenuta");
    }
    
    formwwu.classList.add("was-validated")

});

// Filter category


function filtercategory(objsServer) {

    formconnect.addEventListener("submit", (event) => {

        event.preventDefault();

        let categoryFiltered = objsServer.filter((obj) => {

            let req = true

            if(nameSearch.value.length > 0) {

                req = obj.name.toLowerCase().includes(nameSearch.value.toLowerCase());
            }

            if(req && categorySearch.value.length > 0) {

                req = obj.name.toLowerCase() == categorySearch.value.toLowerCase()
            }

            return req;
        });

        orderCategory(categoryFiltered, ordPosts.value);

        return categoryFiltered;
        
    })
};

function orderCategory(categoryFiltered, ordPosts) {

    while(cardSectionConteiner.hasChildNodes()) {

        cardSectionConteiner.removeChild(cardSectionConteiner.firstChild);

    }



    switch(ordPosts) {
        case"decNumber":
        categoryFiltered.sort((right, left) => {

            return left.announcementsCount - right.announcementsCount
        
        });
        break;
        case"creNumber":
        categoryFiltered.sort((right, left) => {

            return right.announcementsCount - left.announcementsCount
        
        });
        break;
        case"creAlpha":
        categoryFiltered.sort((right, left) => {

            return right.name.localeCompare(left.name);
        
        });
        break;
        case"decAlpha":
        categoryFiltered.sort((right, left) => {

            return left.name.localeCompare(right.name);
        
        });
        break;
    }
    for(let i = 0; i < categoryFiltered.length; i++){

        postCards(categoryFiltered[i].name, categoryFiltered[i].announcementsCount)

    };;
}