import Todo from "./todo.js";
import type { TodoPropsType } from "./todo";

type TodoListPropsType= {
  todoList: TodoPropsType[]
};

class TodoList {
  parent: Element;
  element: HTMLUListElement;
  props: TodoListPropsType;

  constructor(parent: Element, { todoList }: TodoListPropsType) {
    this.parent = parent;
    this.element = document.createElement("ul");
    this.element.className = "todo-list";
    this.props = { todoList };
  }

  render() {
    // 二回目以降のレンダリングでは
    // 前回の DOM を破棄して 子要素すべてを rendering し直す
    if (this.parent.children.length !== 0) {
      for (const child of this.parent.children) {
        this.parent.removeChild(child);
      }
    }

    this.props.todoList.map(todo => {
      new Todo(this.element, todo).render();
    });

    this.parent.appendChild(this.element);
  }
}

export default TodoList;
