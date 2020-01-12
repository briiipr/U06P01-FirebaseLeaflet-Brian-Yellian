
auth.onAuthStateChanged(user => {
  if (user) {
    user.getIdTokenResult().then(idTokenResult => {
      interfaz(user);
    });
  } else {
    interfaz();
  }
});

// Registro de cuenta
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Obtenemos datos del usuario
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;
  const password2 = signupForm['signup-password2'].value;

  // Si ambos campos de contraseña son iguales, se procede a registrar, si no, se muestra el error.
  if (password === password2) {
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
      return db.collection('users').doc(cred.user.uid);
    }).then(() => {
      // close the signup modal & reset form
      const modal = document.querySelector('#modal-signup');
      M.Modal.getInstance(modal).close();
      signupForm.reset();
      signupForm.querySelector('.error').innerHTML = ''
    }).catch(err => {
      signupForm.querySelector('.error').innerHTML = err.message;
    });
  }else{
    signupForm.querySelector('.error').innerHTML = 'Las contraseñas deben coincidir.';
  }
});

// Cerrar sesión
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
});

// Iniciar sesión (agregando el evento al formulario de inicio de sesión y la acción de logeo)
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // El usuario inicia sesión una vez recogidos los datos introducidos en el formulario
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
    loginForm.querySelector('.error').innerHTML = '';
  }).catch(err => {
    loginForm.querySelector('.error').innerHTML = err.message;
  });
});