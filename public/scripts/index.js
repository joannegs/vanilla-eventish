const loginButton = document.querySelector("#login-button");
const email = document.querySelector("#login-email");
const password = document.querySelector("#login-password");

async function login(email, password) {
    let login = await fetch("/login/", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    return login.json();
}

async function userEvents(user_id) {
    await fetch(`/events/${user_id}`);
}

loginButton.addEventListener("click", () => {
    login(email.value, password.value).then(res => {
        localStorage.setItem("logged_user", res.logged_user_id);
        location.replace(`/events/${res.logged_user_id}`);
    });
});

