import store from "../store.js";
import {
  createDeleteTodoAction,
  createUpdateTodoStatusAction
} from "../flux/index.js";

export type TodoPropsType = {
  id: number,
  name: string,
  done: boolean
}

class Todo {
  parent: HTMLUListElement
  element: HTMLLIElement | null
  props: TodoPropsType


  constructor(parent: HTMLUListElement, { id, name, done }: TodoPropsType) {
    this.parent = parent;
    this.element = document.createElement("li");
    this.element.className = "todo-item";
    this.props = { id, name, done };
    this.toggleCheck = this.toggleCheck.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
  }

  toggleCheck() {
    store.dispatch(createUpdateTodoStatusAction({
      id: this.props.id,
      name: this.props.name,
      done: !this.props.done
    }));
  }

  deleteTodo() {
    store.dispatch(createDeleteTodoAction({ id: this.props.id }));
    this.unmount();
  }

  mount() {
    if (!this.element) return;

    const todoToggle = this.element.querySelector('.todo-toggle')
    if (todoToggle) {
      todoToggle.addEventListener('click', this.toggleCheck);
    }

    const todoRemoveButton = this.element.querySelector('.todo-remove-button')
    if (todoRemoveButton) {
      todoRemoveButton.addEventListener('click', this.deleteTodo, { once: true });
    }
  }

  unmount() {
    if (!this.element) return;

    const todoToggle = this.element.querySelector('.todo-toggle')
    if (todoToggle) {
      todoToggle.removeEventListener('click', this.toggleCheck);
    }

    const todoRemoveButton = this.element.querySelector('.todo-remove-button')
    if (todoRemoveButton) {
      todoRemoveButton.removeEventListener('click', this.deleteTodo);
    }
  }

  render() {
    if (!this.element) return;
    const { id, name, done } = this.props;
    this.element.innerHTML = `
      <label class="todo-toggle__container">
        <input
          data-todo-id="${id}"
          type="checkbox"
          class="todo-toggle"
          value="checked"
          ${done ? "checked" : ""}
        />
        <span class="todo-toggle__checkmark"></span>
      </label>
      <div class="todo-name">${name}</div>
      <div data-todo-id="${id}" class="todo-remove-button">x</div>
    `;
    this.parent.appendChild(this.element);
    this.mount();
  }
}

export default Todo;
