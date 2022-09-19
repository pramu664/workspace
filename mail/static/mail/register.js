// Wait for page to laod
document.addEventListener ('DOMContentLoaded', (event) => {

  // select first input field and register button
  const input_field = document.querySelector ('.form-control');
  const register_button = document.querySelector ('.btn');

  // By default disable the register button
  register_button.disabled = true;

  // Listen for input to be typed to the input field
  input_field.onkeyup = () => {
    if (input_field.value.length > 0) {
      register_button.disabled = false;
    } else {
      register_button.disabled = true;
    }
  }

})