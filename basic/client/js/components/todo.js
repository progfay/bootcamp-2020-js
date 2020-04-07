import store from "../store.js";
import {
  createDeleteTodoAction,
  createUpdateTodoStatusAction
} from "../flux/index.js";

class Todo {
  constructor(parent, { id, name, done }) {
    this.parent = parent;
    this.element = document.createElement("li");
    this.element.className = "todo-item";
    this.props = { id, name, done };
  }

  mount() {
    this.element.querySelector('.todo-toggle').addEventListener(
      'click',
      event => {
        store.dispatch(createUpdateTodoStatusAction({
          id: this.props.id,
          name: this.props.name,
          done: !this.props.done
        }));
      }
    );
    this.element.querySelector('.todo-remove-button').addEventListener(
      'click',
      event => {
        store.dispatch(createDeleteTodoAction({ id: this.props.id }));
      },
      { once: true }
    );
  }

  render() {
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
