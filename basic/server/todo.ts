import express from 'express';
const router = express.Router();
const todoList: Todo[] = [];

class Todo {
  id: number;
  name: string;
  done: boolean;

  constructor(id: number, name: string, done: boolean) {
    this.id = id;
    this.name = name;
    this.done = done;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      done: this.done
    };
  }
}

interface PatchTodoRequest extends Express.Request {
  params: {
    id: string
  },
  body: {
    name?: string,
    done?: boolean,
  }
}

router.post("/", (req, res, next) => {
  const id = todoList.length ? todoList[todoList.length - 1].id + 1 : 0;
  const item = new Todo(id, req.body.name, false);
  todoList.push(item);
  return res.status(201).send(item);
});

router.get("/", (req, res, next) => {
  return res.send({ todoList: todoList });
});

router.patch("/:id", (req: PatchTodoRequest, res, next) => {
  const id = parseInt(req.params.id, 10);
  const todo = todoList.find(todo => todo.id === id);
  if (!todo) return res.status(404).send();
  const { name, done } = req.body;
  todo.name = name || todo.name;
  todo.done = done || todo.done;
  return res.status(201).send(todo);
});

router.delete("/:id", (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const index = todoList.findIndex(todo => todo.id === id);
  todoList.splice(index, 1);
  return res.status(204).send("done");
});

export default router;
