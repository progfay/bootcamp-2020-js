import store from "../store.js";
import { createAddTodoAction } from "../flux/index.js";

class TodoForm {
  button: HTMLButtonElement | null
  form: HTMLFormElement | null

  constructor() {
    this.button = document.querySelector(".todo-form__submit");
    this.form = document.querySelector(".todo-form__input");
  }

  mount() {
    if (!this.button) return;
    this.button.addEventListener("click", e => {
      e.preventDefault();
      if (!this.form) return;
      store.dispatch(createAddTodoAction({ name: this.form.value }));
      this.form.value = "";
    });
  }
}

export default TodoForm;
