//Html connection

let adsBox = document.getElementById("ads");

// Navbar dropdown 
let dropdowncategory = document.getElementById("dropdowncategory");

// Form
let filteredSearch = document.getElementById("filteredSearch");

// Search
let searchBarPosts = document.getElementById("searchBarPosts");

// Filter Category
let filterCategory = document.getElementById("filterCategory");

// Min Price
let minPrcOrd = document.getElementById("minPrcOrd");

// Max Price
let maxPrcOrd = document.getElementById("maxPrcOrd");

// Order
let ordPosts = document.getElementById("ordPosts");

// Submit
let searchBtn = document.getElementById("searchBtn");


// Creator Card Ads

/*Ads Creator*/

function Ads(annuncements) {

    let adsCol = document.createElement("div");
    adsCol.classList.add("col-12", "col-md-6", "col-lg-4", "pt-5");
    adsBox.appendChild(adsCol);

    let cardBox = document.createElement("div");
    cardBox.classList.add("card", "position-relative");
    cardBox.setAttribute("width", "22rem");
    adsCol.appendChild(cardBox);

    let cardButton = document.createElement("button");
    cardButton.classList.add("position-absolute", "top-0", "end-0", "py-1", "px-3");
    if (annuncements.typeCard === "sell") {
        cardButton.classList.add("btn-wwu-sell");
        cardButton.textContent = annuncements.typeCard;
    }
    else {
        cardButton.classList.add("btn-wwu-search")
        cardButton.textContent = annuncements.typeCard;
    };
    cardBox.appendChild(cardButton);

    let cardImg = document.createElement("img");
    cardImg.classList.add("card-img-top", "img-fluid", "div-img-h");
    cardImg.setAttribute("src", annuncements.imgCard);
    cardImg.setAttribute("Alt", "Foto Annuncio");
    cardBox.appendChild(cardImg);

    let article = document.createElement("div");
    article.classList.add("card-body", "shadow-sm", "div-cl-h");
    cardBox.appendChild(article);

    let priceArticle = document.createElement("p");
    priceArticle.classList.add("m-0", "pb-1", "price-color", "lead");
    priceArticle.textContent = `€${annuncements.priceCard}`;
    article.appendChild(priceArticle);

    let titleArticle = document.createElement("h5");
    titleArticle.classList.add("card-title", "display-6");
    titleArticle.textContent = annuncements.titleCard;
    article.appendChild(titleArticle);

    let descriptionArticle = document.createElement("p");
    descriptionArticle.classList.add("card-text", "pb-1", "lead");
    descriptionArticle.textContent = "A little description of the article for you, buy it idiot";
    article.appendChild(descriptionArticle);

    let asideArticle = document.createElement("div");
    asideArticle.classList.add("card-body", "d-flex", "justify-content-around");
    cardBox.appendChild(asideArticle);

    let asideArticletag = document.createElement("div");;
    asideArticle.appendChild(asideArticletag);

    let categoryArticleIcon = document.createElement("i");
    categoryArticleIcon.classList.add("bi", "bi-tag-fill", "me-2", "icon-card");
    asideArticletag.appendChild(categoryArticleIcon);


    let categoryArticle = document.createElement("a");
    categoryArticle.classList.add("card-link", "m-0", "icon-card");
    categoryArticle.setAttribute("href", "#");
    categoryArticle.textContent = annuncements.categoryCard;
    asideArticletag.appendChild(categoryArticle);

    let asideArticledate = document.createElement("div");
    asideArticle.appendChild(asideArticledate);

    let dateArticleIcon = document.createElement("i");
    dateArticleIcon.classList.add("bi", "bi-calendar-fill", "me-2", "icon-card");
    asideArticledate.appendChild(dateArticleIcon);

    let dateArticle = document.createElement("a");
    dateArticle.classList.add("card-link", "m-0", "icon-card");
    dateArticle.setAttribute("href", "#");
    dateArticle.textContent = annuncements.dateCard;
    asideArticledate.appendChild(dateArticle);

}




/*Fetch ads*/

async function loadPosts(url) {

    let Response = await fetch(url);

    let objsServer = await Response.json();

    readerPosts(objsServer);

    filterAds (objsServer);

    createCategorySection(objsServer);

    return Response;

};

loadPosts("./server/api_annunci/annunci.json");


function readerPosts(objsServer) {

    for (let i = 0; i < objsServer.length; i++) {

        datepost = new Date(objsServer[i].createdAt);

        // Img random

        let casualpics = Math.floor(Math.random() * 200);

        let adsReq = {

            typeCard: objsServer[i].type,

            imgCard: `https://picsum.photos/id/${casualpics}/600`,

            priceCard: objsServer[i].price,

            titleCard: objsServer[i].name,

            categoryCard: objsServer[i].category,

            dateCard: `${datepost.getDate()}/${datepost.getMonth() + 1}/${datepost.getFullYear()}`

        };
        Ads(adsReq);
    };
};

// Category Creator

function createCategorySection(objsServer) {

    let categorySection = new Set();

    objsServer.forEach((obj) =>{

        categorySection.add(obj.category)
    })

    categorySection.forEach((category) => {
        console.log(category);
        addCategorySection(category)

    })
    return categorySection
};

function addCategorySection(categorySection) {

    let category = document.createElement("option");
    category.setAttribute("value", categorySection);
    category.textContent = categorySection;
    filterCategory.appendChild(category);

    let liCategory = document.createElement("li");
    liCategory.classList.add("dropdown-link", "p-1");

    let linkCategory = document.createElement("a");
    linkCategory.classList.add("dropdow-item", "ps-3", "dropdown-link");
    linkCategory.setAttribute("href", "#");
    linkCategory.textContent = categorySection;
    liCategory.appendChild(linkCategory);
    dropdowncategory.appendChild(liCategory);

};


//Filter

function filterAds (objsServer) {

    filteredSearch.addEventListener("submit", (event) =>{

        while(adsBox.hasChildNodes()) {

            adsBox.removeChild(adsBox.firstChild);
        
        };

        event.preventDefault();

        let objsServerFiltered = objsServer.filter((obj) =>{

            let request = true;

            if(searchBarPosts.value.length > 0){
                
                request = obj.name.toLowerCase().includes(searchBarPosts.value.toLowerCase())

            }

            if(request && filterCategory.value.length > 0){
                
                request = obj.category.toLowerCase() == filterCategory.value.toLowerCase()

            }

            if(request && minPrcOrd.value.length > 0){
                
                request = parseFloat(obj.price) >= parseFloat(minPrcOrd.value)

            }

            if(request && maxPrcOrd.value.length > 0){
                
                request = parseFloat(obj.price) < parseFloat(maxPrcOrd.value)

            }
            
            return request;
        })

        OrderAds(objsServerFiltered, ordPosts.value)
        return objsServerFiltered;
    })
};

// Order

function OrderAds(objsServerFiltered, ordPosts) {

    console.log(objsServerFiltered);

    switch (objsServerFiltered, ordPosts) {

        case "decTime":
        
        objsServerFiltered.sort((right, left) => {
            return parseInt(left.createdAt) - parseInt(right.createdAt)
        });
        break;

        case "creTime":
        
        objsServerFiltered.sort((right, left) => {
            return parseInt(right.createdAt) - parseInt(left.createdAt)
        });
        break;
        case "decPrice":
        
        objsServerFiltered.sort((right, left) => {
            return parseInt(left.price) - parseInt(right.price)
        });
        break;
        case "crePrice":
        
        objsServerFiltered.sort((right, left) => {
            return parseInt(right.price) - parseInt(left.price)
        });
        break;
        case "creAlpha":
        
        objsServerFiltered.sort((right, left) => {
            return right.name.toLowerCase().localeCompare(left.name.toLowerCase())
        });
        break;
        case "decAlpha":
        
        objsServerFiltered.sort((right, left) => {
            return left.name.toLowerCase().localeCompare(right.name.toLowerCase())
        });
        break;
    
    }

    for (let i = 0; i < objsServerFiltered.length; i++) {

        datepost = new Date(objsServerFiltered[i].createdAt);

        // Img random

        let casualpics = Math.floor(Math.random() * 200);

        let adsReqfiltered = {

            typeCard: objsServerFiltered[i].type,

            imgCard: `https://picsum.photos/id/${casualpics}/600`,

            priceCard: objsServerFiltered[i].price,

            titleCard: objsServerFiltered[i].name,

            categoryCard: objsServerFiltered[i].category,

            dateCard: `${datepost.getDate()}/${datepost.getMonth() + 1}/${datepost.getFullYear()}`

        };
        Ads(adsReqfiltered);
    };
};




 












/* .then((objServer) => {

        for (let i = 0; i < objPost.length; i++) {

            datepost = new Date(objPost[i].createdAt);

            // Img random

            const casualpics = Math.floor(Math.random() * 200);

            let adsReq = {

                typeCard: objPost[i].type,

                imgCard: `https://picsum.photos/id/${casualpics}/600`,

                priceCard: objPost[i].price,

                titleCard: objPost[i].name,

                categoryCard: objPost[i].category,

                dateCard: `${datepost.getDate()}/${datepost.getMonth() + 1}/${datepost.getFullYear()}`

            };

           
        }
    })
    .catch((Error) => {

        console.error(Error);

    });*/

/*
    loadPosts("../../server/api/annunci.json")
    .then((objforfil) =>{

        filteredSearch.addEventListener("submit", (event) =>{

            event.preventDefault();

            let req = true

            let arrFil = objforfil.filter((objforfil) =>{
                if(searchBarPosts.value > 0){
    
                    req = objforfil.name.toLowerCase().includes(searchBarPosts.value.toLowerCase())

                }

            })
            console.log(req);
        })
    })
*/






































































/*fetch("../../server/api/annunci.json")
    .then((Response) => {


        return Response.json();

    })
    .then((date) => {

        console.log(date);

        for(let i = 0; i < date.length; i++) {

            let datepost = new Date(date[i].createdAt);

            // Img random

            const casualpics = Math.floor(Math.random()* 200);


            Ads(date[i].type, `https://picsum.photos/id/${casualpics}/600`, date[i].price, date[i].name, date[i].category, `${datepost.getDate()}/${datepost.getMonth() + 1}/${datepost.getFullYear()}`);

        }

    })
    .catch((Error) => {

        console.error(Error);

    }); */