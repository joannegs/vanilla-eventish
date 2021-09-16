const nameInput = document.querySelector("#userName")
const emailInput = document.querySelector("#userEmail");
const passwordInput = document.querySelector("#userPassword");
const signUpButton = document.querySelector("#sign-up-button");

async function signUp(name, email, password) {
    let user = await fetch("/save-user", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email, 
            password: password
        })
    });

    return user.json();
}

signUpButton.addEventListener("click", () => {
    signUp(nameInput.value, emailInput.value, passwordInput.value).then(res => {
        localStorage.setItem("logged_user", res.user_id);
        location.replace(`/events/${res.user_id}`);
    })
})




