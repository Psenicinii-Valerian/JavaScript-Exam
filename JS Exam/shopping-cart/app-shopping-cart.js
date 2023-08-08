// getting all the necessary variables from html
const cart = document.getElementById("cart");
const total = document.getElementById("total");
const weatherContainer = document.getElementById("weather");
const cartClear = document.getElementById("cart-clear");

// when declaring cartArray we specify that it will get info from local storage if there is any
// otherwise our cartArray will be initialized as an empty array    
let cartArray = JSON.parse(localStorage.getItem('shoppingCart')) || [];

// function to get the weather of the wished city (I sent Chisinau as param here)
async function getWeather(city){
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}
                            &appid=fa9004bb33573ddc82e6f9908c28a1f8`)
    const data = await res.json();
    weatherContainer.innerHTML = `
        <p>${data.name}, ${data.sys.country}: ${Math.round(data.main.temp - 273.5)}°C</p>
    `;
}
getWeather("Chisinau");

showCart();
getSum();

// function to save cartArray data to local storage
function saveCartToLocalStorage(jsonData) {
    localStorage.setItem('shoppingCart', jsonData);
    console.log('Cart saved to localStorage.');
}

// change the quantity of a product
function changeQnt(id, type){
    cartArray = cartArray.map(c => {
        if (c.id === id) {
            if (type === "minus" && c.qnt > 0){
                return {
                    ...c,
                    qnt: c.qnt - 1,
                };
            } else if (type === "plus") {
                return {
                    ...c, 
                    qnt: c.qnt + 1,
                };
            } else {
                return c;
            }
        } else {
            return c;
        }
    });
    showCart();
    getSum();
    // save cartArray data
    const jsonData = JSON.stringify(cartArray);
    saveCartToLocalStorage(jsonData);
}

// show current cart data
function showCart(){
    cart.innerHTML = "";
    cartArray.forEach( 
        (c) => {
            if (c.qnt > 0) {
                (cart.innerHTML += `
                <div class='cart-item'>
                    <img src=${c.img}>
                    <div>
                        <h2>${c.name}</h2>
                        <p>${c.qnt}x${c.price}$</p>
                        <button onClick="changeQnt(${c.id}, 'plus')">Add</button>
                        <button onClick="changeQnt(${c.id}, 'minus')">Remove</button>
                    </div>
                </div>
                `);
            }
        }
    );
}

// function to get the total price of current products from cart
function getSum() {
    // .reduce() - function that will group all of the property's values 
    let totalPrice = cartArray.reduce((s, c) => s + c.price * c.qnt, 0);
    // document.getElementById("total").textContent = `Total price: ${totalPrice}$`;
    total.innerHTML = "";
    total.innerHTML += `<h2>Total price: ${totalPrice}$</h2>`;
}

// function to clear all the data from cart
cartClear.addEventListener("click", () => {
    cartArray = [];
    showCart();
    getSum();
    // save cartArray data
    const jsonData = JSON.stringify(cartArray);
    saveCartToLocalStorage(jsonData);
});