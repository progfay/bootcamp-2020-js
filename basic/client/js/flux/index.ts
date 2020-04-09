import { TodoPropsType } from "../components/todo";
/**
 * Dispatcher
 */
class Dispatcher extends EventTarget {
  dispatch() {
    this.dispatchEvent(new CustomEvent("event"));
  }

  subscribe(subscriber: (event: Event) => void) {
    this.addEventListener("event", subscriber);
  }
}

/**
 * Action Creator and Action Types
 */

type ActionBaseType<ActionType extends string, Payload> = {
  type: ActionType,
  payload: Payload
}

const FETCH_TODO_ACTION_TYPE = "Fetch todo list from server";
export type FetchTodoActionType = ActionBaseType<typeof FETCH_TODO_ACTION_TYPE, undefined>;
export function createFetchTodoListAction(): FetchTodoActionType {
  return {
    type: FETCH_TODO_ACTION_TYPE,
    payload: undefined,
  }
};

const ADD_TODO_ACTION_TYPE = "A todo addition to store";
type AddTodoActionPayloadType = { name: string };
export type AddTodoActionType = ActionBaseType<typeof ADD_TODO_ACTION_TYPE, AddTodoActionPayloadType>;
export function createAddTodoAction(todo: AddTodoActionPayloadType): AddTodoActionType {
  return {
    type: ADD_TODO_ACTION_TYPE,
    payload: todo,
  }
};

const DELETE_TODO_ACTION_TYPE = "Delete todo from store";
type DeleteTodoActionPayloadType = { id: number }
export type DeleteTodoActionType = ActionBaseType<typeof DELETE_TODO_ACTION_TYPE, DeleteTodoActionPayloadType>;
export function createDeleteTodoAction(payload: DeleteTodoActionPayloadType): DeleteTodoActionType {
  return {
    type: DELETE_TODO_ACTION_TYPE,
    payload,
  }
};

const UPDATE_TODO_STATUS_ACTION_TYPE = "Update todo status";
export type UpdateTodoStatusAction = ActionBaseType<typeof UPDATE_TODO_STATUS_ACTION_TYPE, TodoPropsType>;
export function createUpdateTodoStatusAction(todo: TodoPropsType): UpdateTodoStatusAction {
  return {
    type: UPDATE_TODO_STATUS_ACTION_TYPE,
    payload: todo,
  }
};

const CLEAR_ERROR = "Clear error from state";
export type ClearErrorType = ActionBaseType<typeof CLEAR_ERROR, undefined>;
export function clearError(): ClearErrorType {
  return {
    type: CLEAR_ERROR,
    payload: undefined,
  }
};

type ActionType =
| FetchTodoActionType
| AddTodoActionType
| DeleteTodoActionType
| UpdateTodoStatusAction
| ClearErrorType

/**
 * Store Creator
 */
const api = "http://localhost:3000/todo";

export type StateType = {
  todoList: TodoPropsType[],
  error?: Error | null,
};

const defaultState: StateType = {
  todoList: [],
  error: null,
};

const headers = {
  "Content-Type": "application/json; charset=utf-8",
};

const reducer = async (prevState: StateType, action: ActionType) => {
  switch (action.type) {
    case FETCH_TODO_ACTION_TYPE: {
      try {
        const resp = await fetch(api).then((d) => d.json());
        return { todoList: resp.todoList, error: null };
      } catch (err) {
        return { ...prevState, error: err as Error };
      }
    }
    case ADD_TODO_ACTION_TYPE: {
      const body = JSON.stringify(action.payload);
      const config = { method: "POST", body, headers };
      try {
        const resp = await fetch(api, config).then((d) => d.json());
        return { todoList: [...prevState.todoList, resp], error: null };
      } catch (err) {
        return { ...prevState, error: err as Error };
      }
    }
    case DELETE_TODO_ACTION_TYPE: {
      try {
        const resp = await fetch(`${api}/${action.payload.id}`, { method: "DELETE" });
        return {
          todoList: prevState.todoList.filter(todo => todo.id !== action.payload.id),
          error: null
        };
      } catch (err) {
        return { ...prevState, error: err as Error };
      }
    }
    case UPDATE_TODO_STATUS_ACTION_TYPE: {
      try {
        const body = JSON.stringify(action.payload);
        const config = { method: "PATCH", body, headers };
        const resp = await fetch(`${api}/${action.payload.id}`, config).then((d) => d.json());
        console.log(resp);
        return {
          todoList: prevState.todoList.map(todo => todo.id === action.payload.id ? resp : todo),
          error: null
        };
      } catch (err) {
        return { ...prevState, error: err as Error };
      }
    }
    case CLEAR_ERROR: {
      return { ...prevState, error: null };
    }
    default: {
      throw new Error(`unexpected action type: ${action}`);
    }
  }
};

export function createStore(initialState = defaultState) {
  const dispatcher = new Dispatcher();
  let state = initialState;

  const dispatch = async (action: ActionType) => {
    console.group(action.type);
    console.log("prev", state);
    state = await reducer(state, action);
    console.log("next", state);
    console.groupEnd();
    dispatcher.dispatch();
  };

  const subscribe = (subscriber: (state: StateType) => void) => {
    dispatcher.subscribe(() => subscriber(state));
  };

  return {
    dispatch,
    subscribe,
  };
}
