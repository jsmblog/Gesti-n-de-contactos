'use strict';
const nameInput = document.getElementById('nameInput');
const contactInput = document.getElementById('contactInput');
const emailInput = document.getElementById('emailInput');
const SAVE_USER = document.getElementById('btn-saved-info-user');
const myContacts = document.getElementById('my-contacts');
const CONTENT_CONTACTS = document.querySelector('.cont-contacts-user')
const usersToFilter = document.getElementById('inputSearhUser');
const tBody = document.getElementById('tBody');
const GET_DATA_LOCALSTORAGE = JSON.parse(localStorage.getItem('users'));
const MESSAGE_WELCOME =  document.getElementById('co-message');
const tagsInputs = document.querySelectorAll('input[name="tag"]');
const btnClose = document.getElementById('btnClose')
const MESSAGE = '¡ Gestiona tus usuarios , ahora !';
let index = 0;
const interval = setInterval(() => {
    if (index < MESSAGE.length) {
        MESSAGE_WELCOME.textContent += MESSAGE[index];
        index++;
    } else {
        clearInterval(interval);
    }
}, 100);

const T_BODY = (array) => {
    tBody.innerHTML = '';

    array.forEach((user) => {
        const { id, name, contact, email, tag} = user;
        tBody.innerHTML += `
        <tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${contact}</td>
            <td>${email}</td>
            <td>${tag}</td>
            <td class="border-td">
                <button class="btn-delete" data-id="${id}">🗑️</button>
                <button class="btn-edit" data-id="${id}">✏️</button>
            </td>
        </tr>`;
    });

    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            deleteUser(id);
        });
    });

    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            editUser(id);
        });
    });
};
T_BODY(GET_DATA_LOCALSTORAGE)
const generatedIdRandom = () => {
    const options = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789'
    const ID_LENGTH = 10;
    let id = '';
    for (let i = 0; i < ID_LENGTH; i++) {
        const random = Math.floor(Math.random() * options.length);
        id += options[random];
    }
    return id;
}

const validateEmail =(email) => {
    return !/\S+@\S+\.\S+/.test(email);
}
const clearInputs = () => {
    nameInput.value = '';
    contactInput.value = '';
    emailInput.value = '';
    tagsInputs.forEach(input => {
        input.checked = false;
    });
};

const displayMessage = (message) => {
    const popUp = document.getElementById('showSms');
    popUp.style.display = 'inline-flex';
    popUp.innerHTML = message;
    setTimeout(() => {
        popUp.style.display = 'none';
        popUp.innerHTML = '';
    }, 5000);
};
if(GET_DATA_LOCALSTORAGE.length > 0 ){
    myContacts.style.display = 'inline-flex'
}
const isEmpty = (value) => {
    return value === '';
}
const fillTbody = (user) => {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    displayMessage('¡ usuario añadido !');
    const DATA_LOCALSTORAGE = JSON.parse(localStorage.getItem('users'));
    T_BODY(DATA_LOCALSTORAGE);
}

const validateData = () => {
    const NAME_USER = nameInput.value.trim();
    const CONTACT_USER = contactInput.value.trim();
    const EMAIL_USER = emailInput.value.trim();

    if (isEmpty(NAME_USER)) {
        displayMessage('añada su nombre');
        return;
    }
    if (!isNaN(NAME_USER)) {
        displayMessage('el nombre no puede ser un número');
        nameInput.value = '';
        return;
    }
    if (isEmpty(CONTACT_USER)) {
        displayMessage('añada su número de contacto');
        return;
    }
    if (isNaN(CONTACT_USER)) {
        displayMessage('su número de contacto debe ser un número');
        contactInput.value = '';
        return;
    }
    if (CONTACT_USER.length !== 10) {
        displayMessage('su núemro de contacto debe tener 10 dígitos');
        contactInput.value = '';
        return;
    }
    if(EMAIL_USER === ''){
        displayMessage('Añada su correo electrónico');
        emailInput.value = '';
        return;
    }
    if(validateEmail(EMAIL_USER)){
        displayMessage('el correo electrónico no es válido , intenta nuevamente');
        emailInput.value = '';
        return;
    }

    const selectedTag = Array.from(tagsInputs).find(input => input.checked);
    if (!selectedTag) {
        displayMessage('Por favor, seleccione una etiqueta');
        return;
    }
   
    const id = generatedIdRandom();
    const user = {
        id,
        name: NAME_USER.toLowerCase(),
        email:EMAIL_USER,
        contact: CONTACT_USER,
        tag:selectedTag.value
    };
    fillTbody(user)
    displayMessage('¡ usuario añadido correctamente !')
    clearInputs();
}
const UP_INFO = () => {
    validateData();
}
const openContentContacts = () => {
CONTENT_CONTACTS.style.display = 'inline-flex'
}
const closeContentContacts = () => {
    CONTENT_CONTACTS.style.display = 'none'
}

myContacts.addEventListener('click', openContentContacts)
btnClose.addEventListener('click', closeContentContacts)

SAVE_USER.addEventListener('click', () => {
    // const editingUserId = localStorage.getItem('editingUserId');
    // if (editingUserId) {
    //     updateUser();
    // } else {
        UP_INFO();
    // }
});
const FILTER = (e) => {
    const txtToFilter = e.target.value.toLowerCase();
    const filteredUsers = GET_DATA_LOCALSTORAGE.filter(user => user.name.toLowerCase().includes(txtToFilter));
    T_BODY(filteredUsers);
    // if(filteredUsers.length > 0){
    //     amountUsers.innerHTML = `${filteredUsers.length} ${filteredUsers.length > 1 ? 'usuarios' : 'usuario'} coinciden con ${txtToFilter}`;
    // }else {
    //     amountUsers.innerHTML = `No se encontró usuarios que coincidan con ${txtToFilter}`
    // }
    // if(txtToFilter === '') amountUsers.textContent = `${PEOPLES.length} usuarios registrados`
}

usersToFilter.addEventListener('input', (e) => FILTER(e));
