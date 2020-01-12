// DOM elements
const contenidos = document.querySelector('.contenido');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');

const interfaz = (user) => {
  if (user) {
    // Información de la cuenta
    db.collection('users').doc(user.uid).get().then(doc => {
      const html = `<div>Ha iniciado sesión como ${user.email}</div>`;
      accountDetails.innerHTML = html;
    });

    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    // Al cerrar sesión, se limpia el contenedor de datos del usuario para no solaparlo posteriormente.
    accountDetails.innerHTML = '';

    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
};

// Se inician los componentes de Materialize
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);
});