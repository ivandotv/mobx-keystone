import { computed } from "mobx"
import { observer } from "mobx-react"
import {
  model,
  Model,
  modelAction,
  newModel,
  registerRootStore
} from "mobx-state-tree-next"
import React from "react"

// store stuff

@model("todoSample/Todo")
class Todo extends Model<{ text: string; done: boolean }> {
  defaultData = {
    done: false
  }

  @modelAction
  toggle() {
    this.data.done = !this.data.done
  }

  @modelAction
  setText(text: string) {
    this.data.text = text
  }
}

@model("todoSample/TodoList")
class TodoList extends Model<{ todos: Todo[] }> {
  defaultData = {
    todos: []
  }

  @computed
  get pending() {
    return this.data.todos.filter(t => !t.data.done)
  }

  @computed
  get done() {
    return this.data.todos.filter(t => t.data.done)
  }

  @modelAction
  add(todo: Todo) {
    this.data.todos.push(todo)
  }

  @modelAction
  remove(todo: Todo) {
    const list = this.data.todos
    const todoIndex = list.indexOf(todo)
    if (todoIndex >= 0) {
      list.splice(todoIndex, 1)
    }
  }
}

const rootStore = newModel(TodoList, {})
rootStore.add(newModel(Todo, { text: "make mobx-state-tree-next awesome!" }))
rootStore.add(newModel(Todo, { text: "spread the word" }))
rootStore.add(newModel(Todo, { text: "buy some milk", done: true }))
registerRootStore(rootStore)

// react stuff

export const App = observer(() => {
  return <TodoListView list={rootStore} />
})

const TodoListView = observer(({ list }: { list: TodoList }) => {
  const todoRef = React.useRef<HTMLInputElement>(null)

  const renderTodo = (todo: Todo) => (
    <TodoView
      key={todo.modelId}
      done={todo.data.done}
      text={todo.data.text}
      onClick={() => todo.toggle()}
      onRemove={() => list.remove(todo)}
    />
  )

  return (
    <div>
      {list.pending.length > 0 && (
        <>
          <h5>TODO</h5>
          {list.pending.map(t => renderTodo(t))}
        </>
      )}

      {list.done.length > 0 && (
        <>
          <h5>DONE</h5>
          {list.done.map(t => renderTodo(t))}
        </>
      )}
      <br />
      <input ref={todoRef} placeholder="I will..." />
      <button
        onClick={() => {
          list.add(newModel(Todo, { text: todoRef.current!.value }))
        }}
      >
        Add todo
      </button>
    </div>
  )
})

function TodoView({
  done,
  text,
  onClick,
  onRemove
}: {
  done: boolean
  text: string
  onClick(): void
  onRemove(): void
}) {
  return (
    <div>
      <span
        onClick={onClick}
        style={{
          textDecoration: done ? "line-through" : "inherit",
          cursor: "pointer"
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "1.5rem",
            textAlign: "center"
          }}
        >
          {done ? "✔️" : "👀"}
        </span>
        {text}
        {}
      </span>
      <span onClick={onRemove}>❌</span>
    </div>
  )
}