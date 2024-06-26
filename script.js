const inputSlider = document.querySelector("[data-lenthSlider]");
const lengthDisplay = document.querySelector("[data-lenthNumber]"); 
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#Uppercase");
const lowerCaseCheck = document.querySelector("#Lowercase");
const numbersCheck = document.querySelector("#Numbers");
const symbolsCheck = document.querySelector("#Symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type = checkbox]"); 
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

//set strength circle to grey
setIndicator("#ccc");


// set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;  
    //some addition
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength-min) * 100/(max-min)) + "% 100%";
}

// set indicator
function setIndicator(color) {
     indicator.style.backgroundColor = color;
     //shadow
     indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// random function
function getrandomInteger(min, max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

function getRanInteger() {
    return getrandomInteger(0,9);
}

function genearetLowerCase() {
    return String.fromCharCode(getrandomInteger(97,123));
}

function genearetUpperCase() {
    return String.fromCharCode(getrandomInteger(65,91));
}

function generateSymbol() {
    const randNum = getrandomInteger(0,symbols.length);
    return symbols.charAt(randNum);
}


function calculateStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    
    if(upperCaseCheck.checked) hasUpper = true;
    if(lowerCaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyConent() {
    try{
        await navigator.clipboard.writeText
        (passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy span visible
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    }, 2000);
    
}

function shufflePassword(array) {
    //fisher yetes method
    for(let i = array.length - 1; i > 0;i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;


}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
        //special condition
        if(passwordLength < checkCount){
            passwordLength = checkCount;
            handleSlider();
        }
    })

}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

//event listener on slider
inputSlider.addEventListener('input', (e) =>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value) {
        copyConent();
    }
})

generateBtn.addEventListener('click', ()=> {
    //one of the checkbox are selected
    if(checkCount == 0){
        return;
    }      
    //special case
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    // let's start the journey to find new password
    
    //remove old password
    password = "";

    // let's put the stuff associated by checkboxes
    // if(upperCaseCheck.checked){
    //     password += genearetUpperCase();
    // }

    // if(lowerCaseCheck.checked){
    //     password += genearetLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password += getRanInteger();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(upperCaseCheck.checked)
        funcArr.push(genearetUpperCase);

    if(lowerCaseCheck.checked)
        funcArr.push(genearetLowerCase);

    if(numbersCheck.checked)
        funcArr.push(getRanInteger);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    //for remaining 
    for(let i =0; i < passwordLength- funcArr.length; i++) {

        let randIndex = getrandomInteger(0, funcArr.length);
        password += funcArr[randIndex]();

    } 
    
    //shuffle password
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;

    //calculation od strngth
    calculateStrength();
    


})
 