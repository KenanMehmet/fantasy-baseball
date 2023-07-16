let button = document.querySelector('.button-class#the-button')


button.addEventListener("click", buttonfunction);

function buttonfunction() {
    let paragraph = document.querySelector('#the-paragraph')
    button.innerHTML = paragraph.innerHTML
}

let background_div = document.querySelector('.game-container')
const div_text = background_div.innerHTML

background_div.onmouseover = function () { goAway() };
background_div.onmouseout = function () { theyLeft() };

function goAway() {
    background_div.innerHTML = "GO AWAY!"
    background_div.style.color = "red"
}

function theyLeft() {
    background_div.innerHTML = div_text
    background_div.style.color = "black"
}

background_div.onmouseover = function () { addImage() };
background_div.onmouseout = function () { removeImage() };

function addImage() {
    background_div.style.backgroundImage = "url(https://picsum.photos/200/300)"
}

function removeImage() {
    background_div.style.backgroundImage = ""
}
