import React from 'react';

import {
  useQuery,
  useMutation,
  gql
} from "@apollo/client";


const GET_TODOS = gql`
  query getTodo {
    todos {
      done
      id
      text
    }
  }
`
const TOGGLE_TODO = gql`
mutation toggleTodo($id: uuid!, $done: Boolean) {
  update_todos(where: {id: {_eq:$id}}, _set: {done: $done}) {
    returning {
      done
      id
      text
    }
  }
}
`
const ADD_TODO = gql`
mutation addTodo($text:String!) {
  insert_todos(objects: {text: $text}) {
    returning {
      done
      id
      text
    }
  }
}
`
const DELETE_TODO = gql`
mutation deleteTodo($id: uuid!) {
  delete_todos(where: {id: {_eq: $id}}) {
    returning {
      done
      id
      text
    }
  }
}
`

function App() {

  const [todoText,setTodoText] = React.useState('')

  const { data, loading, error } = useQuery(GET_TODOS)
  const [toggleTodo] = useMutation(TOGGLE_TODO)
  const [addTodo] = useMutation(ADD_TODO, {
    onCompleted: () => setTodoText('')
  }) 
  const [deleteTodo] = useMutation(DELETE_TODO)

  const handleToggleTodo = async({id,done}) => {
    const data = await toggleTodo({ variables: { id, done: !done } })
    console.log('toggled todo', data)
  }

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!todoText.trim()) return;
    const data = await addTodo({
      variables: { text: todoText },
      // 在toggledone的时候不需要重新进行查询操作，是因为toggle操作的数据在缓存中存在，会触发重绘
      // 而新增添的数据在缓存中不存在，所以需要重新调用query方法
      refetchQueries:[{ query:GET_TODOS}]
    })
    console.log('added todo', data)
    // setTodoText('')
  }

  const handleDeleteTodo = async ({ id }) => {
    const isConfirmed = window.confirm('Do you want to delete this todo?')
    if (isConfirmed) {
      const data = await deleteTodo({
        variables: { id },
        update: cache => {
          // 获取缓存中的数据
          const prevData = cache.readQuery({ query: GET_TODOS  })
          // 手动更新它
          const newTodos = prevData.todos.filter(todo => todo.id !== id)
          cache.writeQuery({query: GET_TODOS,data:{todos: newTodos}})
        }
      })
      console.log("deleted todo",data)
    }
  }

  if (loading)
    return <div>Loading...</div>
  if (error) return <div>Error fetching todos!</div>

  return (
    <div className="vh-100 code 
    flex flex-column items-center
    bg-purple white pa4 fl-1">
      <h1 className="f2-l">
        GraphQL CheckList{" "}
        <span role="img" aria-label="Checkmark">✅</span>
      </h1>
      {/* Todo Form */}
      <form onSubmit={handleAddTodo} className="mb3">
        <input
          type="text"
          placeholder="Write your todo"
          className="pa2 f4 b--dashed"
          onChange={event => setTodoText(event.target.value)}
          value={todoText}
        />
        <button className="pa2 f4 bg-green" type="submit">Create</button>
      </form>
      {/* Todo List */}
      <div className="flex items-center justify-center flex-column">
        {data.todos.map(todo => (
          <p onDoubleClick={()=>handleToggleTodo(todo)} key={todo.id}>
            <span className={`pointer list pa1 f3 ${todo.done&&'strike'}`}>
              {todo.text}
            </span>
            <button  onClick={()=>handleDeleteTodo(todo)} className="bg-transparent bn f4">
              <span className="red">&times;</span>
            </button>
          </p>
        ))}
      </div>
    </div>
  );

}

export default App;
