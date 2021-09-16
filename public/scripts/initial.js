const addEventButton = document.querySelector("#add-event");
const modal = document.querySelector("#modal")
const close = document.querySelector("#modal .header a");
const eventBoxes = document.querySelectorAll(".event-box");

const modalButtonSave = document.querySelector("#modal-button-save");
const modalButtonDelete = document.querySelector("#modal-button-delete");

const descriptionInput = modal.querySelector("#event-description");
const dateInput = modal.querySelector("#event-date");
const initialHourInput = modal.querySelector("#event-initial-hour");
const finalHourInput = modal.querySelector("#event-final-hour");

const icon = document.querySelector("#icon");

var isEventNew = [false, ""];

async function getEventData(event_id) {
    let res = await fetch(`/get-event/${event_id}`);
    return await res.json();
}

async function deleteEvent(event_id) {
    let res = await fetch(`/delete-event/${event_id}`);
    return await res.json();
}

async function addEvent(description, date, init_hour, final_hour) {
    return await fetch("/save-event/", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: description,
            date: date, 
            initial_hour: init_hour, 
            final_hour: final_hour,
            user_id: localStorage.getItem("logged_user")
        })
    });
}

async function updateEvent(event_id, description, date, init_hour, final_hour) {
    return await fetch(`/update-event/${event_id}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: description,
            date: date, 
            initial_hour: init_hour, 
            final_hour: final_hour,
        })
    });
}

function setModalValues(description, date, init_hour, final_hour) {
    descriptionInput.setAttribute("value", description);
    dateInput.setAttribute("value", date);
    initialHourInput.setAttribute("value", init_hour);
    finalHourInput.setAttribute("value", final_hour);
}

eventBoxes.forEach(event => {
    event.addEventListener("click", () => {
        isEventNew = [false, event.id];
        modalButtonDelete.style.visibility ="visible";
        modal.classList.remove("hide");

        getEventData(event.id).then((res) => {
            setModalValues(res.event_data.description, res.event_data.date, res.event_data.initial_hour, res.event_data.final_hour);
        });
    });
});

addEventButton.addEventListener("click", () => {
    isEventNew = [true, ""];
    modal.classList.remove("hide");
    modalButtonDelete.style.visibility ="hidden";
}); 

modalButtonDelete.addEventListener("click", () => {
    deleteEvent(isEventNew[1]);
    modal.classList.add("hide");
    window.location.reload(true);
}); 

modalButtonSave.addEventListener("click", () => {
    if (isEventNew[0]) {
        addEvent(descriptionInput.value, 
            dateInput.value, 
            initialHourInput.value, 
            finalHourInput.value);

    } else {
        updateEvent(isEventNew[1],
            descriptionInput.value, 
            dateInput.value, 
            initialHourInput.value, 
            finalHourInput.value);
    }
         
    modal.classList.add("hide");
    window.location.reload(true);
});


close.addEventListener("click", () => {
    modal.classList.add("hide");
    setModalValues("", "", "", "");
});

icon.addEventListener("click", () => {
    localStorage.removeItem("logged_user");
});