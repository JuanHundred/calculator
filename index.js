// current number to be displayed
let currentNumber = "";

// stores the result of the calculations
let result = []

// operations object, will perform the calculation based on the lastOperation value
const operations= {
    division: function(a, b){
        if (Number(b) === 0){
            return "ERROR";
        }
        return Number(a) / Number(b);
    },
    multiplication: function(a, b) {
        return Number(a) * Number(b);
    },
    subtraction: function(a, b){
        return Number(a) - Number(b);
    },
    addition: function(a, b){
        return Number(a) + Number(b);
    },
    equal: function(a, b){
        return result[0];
    }
}

// get the calculator element, will serve as the parent node for the event bubbling
const calculator = document.querySelector("#calculator");

// get display
const displayScreen = document.querySelector(".display");

// save the last operation clicked on to display the result of the calculation when the new operation is clicked
let lastOperation = "";

// utilize event bubbling to reduce redundancy 
calculator.addEventListener("click", (event) => {
    // if the element being clicked are one of the numbers, display it
    if (event.target.classList.contains("number")){
        currentNumber = currentNumber.concat("", event.target.textContent);
        displayScreen.textContent = currentNumber;
    }
    // if the element being clicked is an operation, perform the calculation if a number has been clicked before
    // if a number hasn't been clicked before then that is the current result until a calculation is done to get the new result
    if (event.target.classList.contains("operation")){
        if (result.length === 0){
            result.push(Number(currentNumber));
            lastOperation = event.target.classList[0]
            currentNumber = "";
        } else {
            const operationName = event.target.classList[0];
            const calculationResult = operations[lastOperation](result[0], currentNumber);
            result.pop()
            result.push(calculationResult);
            displayScreen.textContent = isNaN(result[0]) ? "ERROR" : result[0];
            lastOperation = operationName;
            currentNumber = "";
        }
    }
});