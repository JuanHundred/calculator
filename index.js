// current number to be displayed
let currentNumber = "";

// stores the result of the calculations
let result = []

// operations object, will perform the calculation based on the lastOperation value
const operations = {
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
        return parseFloat((Number(a) + Number(b)).toFixed(10));
    },
    equal: function(a, b){
        return result[0];
    }
}

// get the calculator element, will serve as the parent node for the event bubbling
const calculator = document.querySelector(".buttons");

// get display to show numbers
const displayScreen = document.querySelector(".display-text");

// get clear button to make changes when clicked on
const clearButton = document.querySelector(".clear");

// save the last operation clicked on to display the result of the calculation when the new operation is clicked
let lastOperation = "";

// clear everything when user hits the clear button
function clear() {
    currentNumber = "";
    lastOperation = "";
    result.pop();
    displayScreen.textContent = 0;
}

// remove the clicked class from the button that has it in it's class list
function removeClickedOperation(){
    const clickedOperation = document.querySelector(".clicked");
    if (clickedOperation){
        clickedOperation.classList.remove("clicked");
    }
}

// converts the current number displayed on screen to negative or positive
function negativePositive(){
    // if the current number is currently positive
    if(currentNumber[0] !== "-"){
        currentNumber = "-".concat("", currentNumber);
    // else if the number is negative
    }else{
        currentNumber = currentNumber.slice(1);
    }

    // displays 0 or the currentNumber if the currentNumber is not empty
    if (currentNumber === ""){
        displayScreen.textContent = 0;
    }else if (currentNumber === "-"){
        displayScreen.textContent = "-0";
    }else{
        displayScreen.textContent = currentNumber;
    }
}
// the only buttons that can/will have the clicked class
const validClasses = ["addition", "subtraction", "division", "multiplication"];

// utilize event bubbling to reduce redundancy 
calculator.addEventListener("click", (event) => {
    
    // if the element being clicked are one of the numbers, display it
    if (event.target.classList.contains("number")){
        removeClickedOperation();
        if(clearButton.textContent === "AC"){
            clearButton.textContent = "C";
        }
        // limit to only displaying up to 9 digits
        if (currentNumber.length < 9){
            if(currentNumber === "" && event.target.textContent === "0"){
                currentNumber = "";
            }else{
                currentNumber = currentNumber.concat("", event.target.textContent);
                displayScreen.textContent = currentNumber;
            }
        }
    }

    // if the element being clicked is an operation, perform the calculation if a number has been clicked before
    // if a number hasn't been clicked before then that is the current result until a calculation is done to get the new result
    if (event.target.classList.contains("operation")){
        removeClickedOperation();
        // if button clicked are the validClasses allowed to have the clicked class
        if (validClasses.some((classes) => event.target.classList.contains(classes))){
            event.target.classList.add("clicked");
        }
        if (result.length === 0 && currentNumber !== ""){
            currentNumber = "";
        }else if(result.length === 0){
            result.push(Number(currentNumber));
            lastOperation = event.target.classList[0];
            currentNumber = "";
        } else {
            const operationName = event.target.classList[0];
            const calculationResult = operations[lastOperation](result[0], currentNumber);
            result.pop();
            result.push(calculationResult);
            if (isNaN(result[0])){
                displayScreen.textContent = "ERROR";
            }else{
                if(result[0].toString().length > 9){
                    displayScreen.textContent = result[0].toExponential();
                }else{
                    displayScreen.textContent = result[0]
                }
            }
            lastOperation = operationName;
            currentNumber = "";
        }
    }

    // when user hits clear button
    // will change from C back to AC if the user clicks "=" button or if the lastOperation was assigned
    // if it's the button's text is already AC just clear everything
    if (event.target.classList.contains("clear")){ 
        if (event.target.textContent === "C"){
            if (lastOperation === "equal" || lastOperation.length == 0){
                removeClickedOperation();
                clear();
                clearButton.textContent = "AC";
            }else if(lastOperation.length != 0){
                currentNumber = "";
                displayScreen.textContent = 0;
                clearButton.textContent = "AC";
            }
        }else if (event.target.textContent === "AC"){
            removeClickedOperation();
            clear();
        }
    }

    // when user hits percentage
    if(event.target.classList.contains("percentage")){
        if (currentNumber === "" || currentNumber === "-"){
            displayScreen.textContent = 0;
            currentNumber = "";
        }else{
            let percentageResult = parseFloat(currentNumber) / 100;
            currentNumber = parseFloat(percentageResult.toFixed(10)); 
            displayScreen.textContent = currentNumber;
        }
    };

    // calls negativePositive() when the negative button is clicked
    if(event.target.classList.contains("negative")){
        negativePositive();
    };

    // will add a decimal when the decimal button is clicked
    if(event.target.classList.contains("decimal")){
        removeClickedOperation();
        if (!currentNumber.includes(".")){
            if (currentNumber === "" || currentNumber === "-"){
                currentNumber = currentNumber.concat("0", ".");
            }else {
                currentNumber = currentNumber.concat("", ".");
            }
            displayScreen.textContent = currentNumber;
        }
    };
});