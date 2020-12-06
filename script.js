const form_registo = document.getElementById("register_form");
const form_login = document.getElementById("login_form");
let header_registo = document.querySelector("h1");
let search_books = document.getElementById("search");
let users = [];
let data = [];
let bookFav = [];

var time = 0;
function reload() {
tim = setTimeout("location.reload(true);",300000);   // 5 minutes
}

function canceltimer() {
window.clearTimeout(time);  // cancel the timer on each mousemove/click
reload();  // and restart it
}

  
// Event Listeners
eventListeners();

function eventListeners() {
    //Envio de formulario
    form_registo.addEventListener('submit', adicionarUser);

    // Fazer login
    form_login.addEventListener('submit', loginUser);

    // Conteudo adicionado
    document.addEventListener('DOMContentLoaded', function () {
        users = JSON.parse(localStorage.getItem('Users')) || [];
        console.log(users);
        data = JSON.parse(localStorage.getItem('Data Login')) || [];
        //console.log(data);
        bookFav = JSON.parse(localStorage.getItem('Favoritos')) || [];
        /*lastlogin = JSON.parse(localStorage.getItem('Last Login')) || [];
        console.log(lastlogin);*/

    });
}
function adicionarUser(e) {
    e.preventDefault();

    //ler valores dos inputs
    const user_name = document.querySelector('#username').value;
    const user_email = document.querySelector('#email').value;
    const user_password = document.querySelector('#pw').value;
    const conf_password = document.querySelector('#conf_pw').value;

    // validação dos campos
    if (user_name.trim() === '') {
        alert("Deve escrever o username");
        return true;
    }
    if (user_email.trim() === '') {
        alert("Deve escrever o email");
        return true;
    }
    if (user_password.trim() === '') {
        alert("Deve escrever a password");
        return true;
    }

    /*if (user_password.value.length < 4 || user_password.value.length > 8){
        alert("Deve escrever uma password de 4 a 8 caracteres");
        return true;
    }*/

    if (conf_password.trim() != user_password.trim()) {
        alert("As passwords devem ser iguais!");
        return true;
    }

    // criar objeto user
    userObj = {
        Username: user_name,
        Email: user_email,
        Password: user_password
    }

    //adicionar o user ao array users
    users.push(userObj);
    alert("Novo utilizador registado");

    // sincronizar storage
    sincronizarStorage();

    // reiniciar o formulario
    form_registo.reset();
}

// Atualiza user em local storage
function sincronizarStorage() {
    let userStr = JSON.stringify(users);
    localStorage.setItem('Users', userStr);
}


// função login user
function loginUser(e) {

    e.preventDefault();

    const user_login = document.getElementById("login_email").value;
    const password_login = document.getElementById("login_pw").value;

    for (var i = 0; i < users.length; i++) {
        if (user_login == users[i].Email && password_login == users[i].Password) {
            alert("Bem-vindo " + users[i].Username);
            var currentdate = new Date();
            var datetime = ('0' + currentdate.getDate()).slice(-2) + "/"
                + (currentdate.getMonth() + 1) + "/"
                + currentdate.getFullYear() + " "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes();
            dataObj = {
                Username: users[i].Username,
                Login: datetime
            }

            data.push(dataObj);
            localStorage.setItem('Data Login', JSON.stringify(data));

            form_registo.style.display = "none";
            header_registo.style.display = "none";
            form_login.style.display = "none";
            search_books.style.visibility = "visible";
            document.getElementById("logout").style.visibility = "visible";
            document.getElementById("demo").innerHTML = "Bem-vindo " + users[i].Username;
            document.getElementById("time").innerHTML = "Login Atual: " + datetime;
            document.getElementById("demo").style.visibility = "visible";
            document.getElementById("time").style.visibility = "visible";
            return true;
        }
    }
    alert("Não fez login");

    form_login.reset();
}

function logOut() {
    form_registo.style.display = "block";
    header_registo.style.display = "block";
    form_login.style.display = "block";
    search_books.style.visibility = "hidden";
    document.getElementById("logout").style.visibility = "hidden";
    document.getElementById("demo").style.visibility = "hidden";
    document.getElementById("time").style.visibility = "hidden";
    form_login.reset();
}

// codigo API Google Books
function findBooks() {
    var search = document.getElementById("books").value;
    if (search == "") {
        alert("Please enter something in the field");
    }
    else {
        var result = document.getElementById('result');
        var url = "";
        var img = "";
        var title = "";
        var author = "";
        var readmore = "";
        var breakLn = "";
        var addFav;
        var remFav;

        //httpGet("https://www.googleapis.com/books/v1/volumes?q=" + search);
        httpGetAsync("https://www.googleapis.com/books/v1/volumes?q=" + search, volumeInfo);

        function volumeInfo(responseJSON) {
            document.getElementById("result").innerHTML = "";
            response = JSON.parse(responseJSON);
            for (let i = 0; i < response.items.length; i++) {
                divLivro = document.createElement('div');
                divLivro.id = 'book' + i;
                result.appendChild(divLivro);
                title = document.createElement('h5');
                divLivro.appendChild(title);
                title.outerHTML = '<h5 class="center-align white-text">' + response.items[i].volumeInfo.title + '</h5>';
                author = document.createElement('h5');
                divLivro.appendChild(author);
                author.outerHTML = '<h5 class="center-align white-text"> By:' + response.items[i].volumeInfo.authors + '</h5>';
                img = document.createElement('img');
                divLivro.appendChild(img);
                url = response.items[i].volumeInfo.imageLinks.thumbnail;
                img.setAttribute('src', url);
                breakLn = document.createElement('br');
                divLivro.appendChild(breakLn);
                breakLn = document.createElement('br');
                divLivro.appendChild(breakLn);
                readmore = document.createElement('a');
                divLivro.appendChild(readmore);
                readmore.outerHTML = '<a href=' + response.items[i].volumeInfo.infoLink + '><button id="imagebutton" class="btn red">Read More</button></a>';
                addFav = document.createElement('button');
                divLivro.appendChild(addFav);
                addFav.setAttribute('livros', divLivro);
                addFav.addEventListener("click", addFavorite(divLivro));
                addFav.textContent = "Adicione aos Favoritos";
                // Remove Favorite Button
                remFav = document.createElement('button');
                divLivro.appendChild(remFav);
                remFav.setAttribute('livros', divLivro);
                remFav.addEventListener("click", removeFavorite(divLivro));
                remFav.textContent = "Remova dos Favoritos";

            }
            function addFavorite(livros) {
                return function () {
                    favObj = {
                        LivroFav: livros.outerHTML
                    }
                    console.log(favObj);
                    bookFav.push(favObj);
                    localStorage.setItem('Favoritos', JSON.stringify(bookFav));
                }
            }
            function removeFavorite(livros) {
                return function () {
                    bookFav = JSON.parse(localStorage.getItem('Favoritos'));
                    bookFav.splice(livros, 1);
                    localStorage.setItem('Favoritos', JSON.stringify(bookFav));
                }
            }
        }
    }
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous request
    xmlHttp.send(null);
}