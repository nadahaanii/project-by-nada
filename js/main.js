// open form model and close
let addNewBtn = document.querySelector(".addNew");
let closeFormBtn = document.querySelector(".addNewContact .close");
let formSection = document.querySelector(".form");
let contactForm = document.querySelector(".addNewContact");

addNewBtn.addEventListener('click', ()=> {
    formSection.classList.add("overlay");
    contactForm.style.display = "block"
});
closeFormBtn.addEventListener('click', ()=>{
    formSection.classList.remove("overlay");
    contactForm.style.display = "none"
});

// create array to store data
let savedData = localStorage.getItem("contact")
let contactList = JSON.parse(savedData || "[]");
// select the inputs of the form
let contactFormName = document.getElementById("contact_form_name");
let contactFormPhone = document.getElementById("contact_form_phone");
let contactFormEmail = document.getElementById("contact_form_email");
let contactFormAddress = document.getElementById("contact_form_address");
// get last id
let lastContactId = contactList.length;
// create a function to push new contact into the array
let newContact = () => {
    contactList.push({
        contactId: lastContactId +=1,
        contactName : contactFormName.value,
        contactPhone : contactFormPhone.value,
        contactEmail : contactFormEmail.value,
        contactAddress : contactFormAddress.value
    });
    console.log(contactList)
}

// create render function to show date in the table
let contactTableTbody = document.getElementById("tbody");

let renderContacts = () => {
    let tr = '';
    contactList.forEach(contact => {
        tr += `
        <tr data-id = ${contact.contactId}>
            <td>${contact.contactId}</td>
            <td>${contact.contactName}</td>
            <td>${contact.contactPhone}</td>
            <td>${contact.contactEmail}</td>
            <td>${contact.contactAddress}</td>
            <td class="green">Edit</td>
            <td class="red">Delete</td>
            </tr>
        `
    });
    contactTableTbody.innerHTML = tr
}
// inital start of web page
renderContacts()

//reset value function
let resetFormContact = () => {
    contactFormName.value = '';
    contactFormPhone.value = '';
    contactFormEmail.value = '';
    contactFormAddress.value = '';
}
// handle save btn listener
let saveBtn = document.querySelector(".save");
// add new contact listener
let saveBtnHandler = () => {
    newContact();
    localStorage.setItem("contact",JSON.stringify(contactList))
    resetFormContact();
    renderContacts();
    formSection.classList.remove("overlay");
    contactForm.style.display = "none"
}

saveBtn.addEventListener('click', saveBtnHandler)

// logic to handle edit and delete

contactTableTbody.addEventListener('click', e=> {
    if(e.target.classList.contains("green")){
        let tr = e.target.parentElement;
        let id = tr.dataset.id;
        let index = parseInt(id)-1
        // assign the values from tha array into the input values
        contactFormName.value = contactList[index].contactName;
        contactFormPhone.value = contactList[index].contactPhone;
        contactFormEmail.value = contactList[index].contactEmail;
        contactFormAddress.value = contactList[index].contactAddress;
        // open the form with overlay
        formSection.classList.add("overlay")
        contactForm.style.display = "block";
        // update handler
        let updateHandler = () =>{
            // new object with modified data
            let updatedContact = {
                contactId: parseInt(id),
                contactName : contactFormName.value,
                contactPhone : contactFormPhone.value,
                contactEmail : contactFormEmail.value,
                contactAddress : contactFormAddress.value
            }
            // change the old object with new object
            contactList[index] = updatedContact;
            localStorage.setItem("contact",JSON.stringify(contactList))
            // close the overlay and hide form
            formSection.classList.remove("overlay")
            contactForm.style.display = "none";
            // reset the form
            resetFormContact();
            // display (render data)
            renderContacts();
            // listner handler
            saveBtn.removeEventListener('click',updateHandler);
            saveBtn.addEventListener('click',saveBtnHandler)
            console.log("updated")
        }
        saveBtn.removeEventListener('click',saveBtnHandler)
        saveBtn.addEventListener('click',updateHandler);
    }
    if(e.target.classList.contains("red")){
        let tr = e.target.parentElement;
        let id = tr.dataset.id;
        let index = parseInt(id)-1;
        contactList.splice(index,1);
        localStorage.setItem("contact",JSON.stringify(contactList))
        renderContacts();
    }
});

//search logic

let searchInput = document.getElementById("search");
let form = searchInput.parentElement;
let trs = document.querySelectorAll('tbody tr')
form.addEventListener('submit', e => e.preventDefault());

searchInput.addEventListener('keyup', ()=>{
    let searchInputValue = searchInput.value.toLowerCase();
    trs.forEach(tr => {
        trName = tr.children[1].textContent.toLowerCase();
        if(trName.includes(searchInputValue)){
            tr.style.display = "";
        }else {
            tr.style.display = "none"
        }
    })
})