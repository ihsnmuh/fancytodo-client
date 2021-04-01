function onSignIn(googleUser) {
  // google Login
  const id_token = googleUser.getAuthResponse().id_token;

  $.ajax({
    method: "POST",
    url: "http://localhost:3000/user/googleLogin",
    data: {
      id_token,
    },
  })
    .done((response) => {
      localStorage.setItem("access_token", response.access_token);
      showHomePage();
      fatchDataTodos();
    })
    .fail((err) => {
      console.log(err);
    });
}

function showLoginPage() {
  // sebelum melakukan Login
  $("#form-login").fadeIn("slow");
  $("#form-register").hide();
  $("#todo-container").hide();
  // batas menu
  $("#menu-login").show();
  $("#menu-register").show();
  $("#menu-home").hide();
  $("#menu-logout").hide();
}

function showRegisterPage() {
  // sebelum melakukan Login
  $("#form-login").hide();
  $("#form-register").fadeIn("slow");
  $("#todo-container").hide();
  // batas menu
  $("#menu-login").show();
  $("#menu-register").show();
  $("#menu-home").hide();
  $("#menu-logout").hide();
}

function showHomePage() {
  // setelah melakukan login
  $("#form-login").hide();
  $("#form-register").hide();
  $("#todo-container").fadeIn("slow");
  // batas menu
  $("#menu-login").hide();
  $("#menu-register").hide();
  $("#menu-home").show();
  $("#menu-logout").show();
}

function fatchDataTodos() {
  // memunculkan seluruh data Todos
  $.ajax({
    method: "GET",
    url: "http://localhost:3000/todos",
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done((response) => {
      $("#todos").empty(); // sebelum dimasukan jangan lupa dikosongin dahulu biar ga double
      console.log(response);
      response.forEach((element) => {
        $("#todos").append(`
        <div class="card mt-2">
          <div class="card-body">
            <div class="row">
              <div class="col-7">
                ${element.title}
                </div>
                <div class="ml-5 col-5">
                <a href=""><button class="btn btn-outline-info">View</button></a>
                <a href=""><button class="btn btn-outline-warning">Edit</button></a>
                <a href=""><button class="btn btn-outline-danger">Delete</button></a>
              </div>
            </div>
          </div>
        </div>
        `);
      });
    })
    .fail((err) => {
      console.log(err);
    });
}

// Batas Fuction =================================================================

$(document).ready(function () {
  if (localStorage.getItem("access_token")) {
    showHomePage();
    fatchDataTodos(); //ketika di refresh
  } else {
    showLoginPage();
  }

  $("#login").on("submit", function (event) {
    event.preventDefault(); // biar ngga refresh page
    const email = $("#email-login").val();
    const password = $("#password-login").val();

    $.ajax({
      method: "POST",
      url: "http://localhost:3000/user/login",
      data: {
        email,
        password,
      },
    })
      .done((response) => {
        localStorage.setItem("access_token", response.access_token);
        showHomePage();
        fatchDataTodos(); //jangan lupa ketika refresh panggil lagi datanya
      })
      .fail((err) => {
        console.log(err); // error masih console
      })
      .always(() => {
        $("#email-login").val("");
        $("#password-login").val("");
      });
  });

  $("#register").on("submit", function (event) {
    event.preventDefault(); // biar ngga refresh page
    const email = $("#email-register").val();
    const username = $("#username-register").val();
    const password = $("#password-register").val();

    $.ajax({
      method: "POST",
      url: "http://localhost:3000/user/register",
      data: {
        email,
        username,
        password,
      },
    })
      .done((response) => {
        showLoginPage();
      })
      .fail((err) => {
        console.log(err);
      })
      .always(() => {
        $("#email-register").val("");
        $("#username-register").val("");
        $("#password-register").val("");
      });
  });

  $("#menu-login").click(function () {
    showLoginPage();
  });

  $("#menu-register").click(function () {
    showRegisterPage();
  });

  $("#menu-logout").click(function () {
    localStorage.clear();
    const auth2 = gapi.auth2.getAuthInstance(); // menghilngkan akses google
    auth2.signOut().then(function () {
      console.log("User signed out.");
    });
    showLoginPage();
  });
});
