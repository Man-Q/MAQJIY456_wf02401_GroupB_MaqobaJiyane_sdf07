// Import Firebase modules for initializing the app and accessing the database
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// Firebase app settings for initializing the app
const appSettings = {
    databaseURL: "https://realtime-database-989cb-default-rtdb.firebaseio.com/"
}

// Initialize the Firebase app with the provided settings
const app = initializeApp(appSettings)

// Get a reference to the Firebase database
const database = getDatabase(app)

// Reference to the 'shoppingList' node in the database
const shoppingListInDB = ref(database, "shoppingList")

// DOM elements
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

// Event listener for the 'Add' button
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    if(inputValue){
        // Push the input value to the 'shoppingList' node in the database
        push(shoppingListInDB, inputValue)
        
        // Clear the input field after adding the item
        clearInputFieldEl()
    }
})

// Event listener for changes in the 'shoppingList' node in the database
onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        // Convert the snapshot data to an array of key-value pairs
        let itemsArray = Object.entries(snapshot.val())
    
        // Clear the shopping list element before updating it
        clearShoppingListEl()
        
        // Iterate through the items array and append them to the shopping list
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        // Display a message when there are no items in the shopping list
        shoppingListEl.innerHTML = "No items here... yet!"
    }
})

// Function to clear the shopping list element
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

// Function to clear the input field
function clearInputFieldEl() {
    inputFieldEl.value = ""
}

// Function to append an item to the shopping list element
function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    // Set the text content of the new list item
    newEl.textContent = itemValue
    
    // Add a click event listener to the new list item to remove it from the database when clicked
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    // Append the new list item to the shopping list element
    shoppingListEl.append(newEl)
}
