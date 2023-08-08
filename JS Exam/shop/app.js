// getting all the necessary variables from html
const data = document.getElementById("data");
const search = document.getElementById("search-btn");
const searchedProduct = document.getElementById("search-box");
const searchedCategory = document.getElementById("category");
const nameFilter = document.getElementById("name");
const priceFilter = document.getElementById("price");

let products = [];
const weatherContainer = document.getElementById("weather");

// function to get the weather of the wished city (I sent Chisinau as param here)
async function getWeather(city){
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}
                            &appid=fa9004bb33573ddc82e6f9908c28a1f8`)
    const data = await res.json();
    weatherContainer.innerHTML = `
        <p>${data.name}, ${data.sys.country}: ${Math.round(data.main.temp - 273.5)}°C</p>
    `;
}
getWeather("Oradea");

// async function to get all the data from the JSON file
// it will be called when the page is being loaded so the data will be provided in time
(async function() {
    try {
      const response = await fetch('./shop-data.json');
      const jsonData = await response.json();
      products = jsonData.products;
    // displaying the products on the page
      displayProducts();
    } catch (error) {
      console.error('Error reading JSON file:', error);
    }
  
})();

// function to display the available products
function displayProducts() {
    products.forEach((pr) => {
        data.innerHTML += `<div class='product'>
                <img src=${pr.img}>
                <h2>${pr.name}</h2>
                <p>${pr.price}$</p>
                <button onClick="addToCart(${pr.id})">Add to cart</button>
            </div>`;
    });
}

// when declaring cartArray we specify that it will get info from local storage if there is any
// otherwise our cartArray will be initialized as an empty array    
let cartArray = JSON.parse(localStorage.getItem('shoppingCart')) || [];

// function to save cartArray data to local storage
function saveCartToLocalStorage(jsonData) {
    localStorage.setItem('shoppingCart', jsonData);
    console.log('Cart saved to localStorage.');
}

// function to add a product to the cart
function addToCart(id){
    // cartArray.filter() - returns all objects that match the specified condition.
    if (cartArray.filter((pr) => pr.id === id).length > 0) {
        // cartArray.map() - iterates over all elements of an array, similar to a for loop, and returns its elements.
        cartArray = cartArray.map((pr) => {
            if (pr.id === id){
                return {
                    // ... - object destructuring (returns the properties of the object) because return {...code...} already returns an object.
                    ...pr,
                    qnt: pr.qnt + 1,
                };
            } else {
                return pr;
            }
        });
    } else {
        // ...product allow us to send all the properties of the object as a param
        const product = products.filter((pr) => pr.id === id)[0];
        cartArray.push({...product, qnt: 1});
    }

    // save cartArray data
    const jsonData = JSON.stringify(cartArray);
    saveCartToLocalStorage(jsonData);
}

// sort by name ascending
function compareProductNamesAscending(a, b) {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
  
    if (nameA < nameB) {
      return -1; // nameA comes before nameB
    }
    if (nameA > nameB) {
      return 1; // nameA comes after nameB
    }
    return 0; // names are equal
}

// sort by name descending
function compareProductNamesDescending(a, b) {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
  
    if (nameA > nameB) {
      return -1; // nameA comes before nameB
    }
    if (nameA < nameB) {
      return 1; // nameA comes after nameB
    }
    return 0; // names are equal
}

// sort by price ascending
function compareProductPricesAscending(a, b) {
    const priceA = a.price;
    const priceB = b.price;
  
    if (priceA < priceB) {
      return -1; // priceA comes before priceB
    }
    if (priceA > priceB) {
      return 1; // priceA comes after priceB
    }
    return 0; // prices are equal
}

// sort by price descending
function compareProductPricesDescending(a, b) {
    const priceA = a.price;
    const priceB = b.price;
  
    if (priceA > priceB) {
      return -1; // priceA comes before priceB
    }
    if (priceA < priceB) {
      return 1; // priceA comes after priceB
    }
    return 0; // prices are equal
}

// Function to filter and display products based on the search criteria
function filterAndDisplayProducts() {
    // initializing needed variables during the filter
    let filteredProducts = [];
    let foundProduct = false;
    // removing all previous data from div
    data.innerHTML = "";
    // getting searched product name from search bar
    const searchedProductName = searchedProduct.value.toLowerCase();
    // getting the selected category of the product
    const selectedCategoryOption = searchedCategory.options[searchedCategory.selectedIndex];
    const selectedCategory = selectedCategoryOption.value;
    // getting the selected name filtering type of the product
    const selectedNameFilterOption = nameFilter.options[nameFilter.selectedIndex];
    const selectedNameFilter = selectedNameFilterOption.value;
    // getting the selected price filtering type of the product;
    const selectedPriceFilterOption = priceFilter[priceFilter.selectedIndex];
    const selectedPriceFilter = selectedPriceFilterOption.value;

    // veryfying if there is any product that corresponds both to given product category and name 
    products.forEach((pr) => {
        const productName = pr.name.toLowerCase();
        const productCategory = pr.category;
        if (
            (productName.slice(0, searchedProductName.length) === searchedProductName || searchedProductName === '') &&
            (selectedCategory === 'Any' || productCategory === selectedCategory)
        ) {
            // if there any products that correspond to the requirement we store them in another variable - filteredProducts
            filteredProducts.push(pr);
            foundProduct = true;
        }
    });

    // filtering found products by their name: ascending/descending/any(nothing will happen)
    // if name != any => filter by price asc/desc will be deselected
    if (selectedNameFilter === "alphabeticallyAscending") {
        filteredProducts.sort(compareProductNamesAscending);
        nameFilter.selectedIndex = 1;
    } else if (selectedNameFilter === "alphabeticallyDescending"){
        filteredProducts.sort(compareProductNamesDescending);
        nameFilter.selectedIndex = 2;
    } 
    
    // filtering found products by their price: ascending/descending/any(nothing will happen)
    // if price != any => filter by name asc/desc will be deselected
    if (selectedPriceFilter === "ascending"){
        filteredProducts.sort(compareProductPricesAscending);
        priceFilter.selectedIndex = 1;
    } else if (selectedPriceFilter === "descending"){
        filteredProducts.sort(compareProductPricesDescending);
        priceFilter.selectedIndex = 2;
    } 

    // if we found any products corresponding to the requirements we display them on the screen
    if (foundProduct) {
        filteredProducts.forEach((pr) => {
            data.innerHTML += `<div class='product'>
            <img src=${pr.img}>
            <h2>${pr.name}</h2>
            <p>${pr.price}$</p>
            <button onClick="addToCart(${pr.id})">Add to cart</button>
            </div>`;
        });
    }
    // if we haven't found any products corresponding to the requirements we display a specific message! 
    if (!foundProduct) {
        data.innerHTML += `<div class='product'>
            <h2><strong>There aren't any products matching the selected criteria!</h2>
        </div>`;
    }
}

// event listener for search button click
search.addEventListener("click", filterAndDisplayProducts);

// event listener for Enter key press in the search input field
searchedProduct.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        filterAndDisplayProducts();
    }
});

// event listener for input change in the search input field
searchedProduct.addEventListener("input", () => {
    filterAndDisplayProducts();
});

// event listener for category selection change
searchedCategory.addEventListener("change", filterAndDisplayProducts);

// event listener for name filtering type selection change
nameFilter.addEventListener("change", () => {
    priceFilter.selectedIndex = 0;
    filterAndDisplayProducts();
});

// event listener for price filtering type selection change
priceFilter.addEventListener("change", () => {
    nameFilter.selectedIndex = 0;
    filterAndDisplayProducts();
});
