import React from 'react';
import './App.css';
import firebase, { db } from './firebaseInitializer';
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';

function App() {
  const [todo, setTodo] = useState('')
  const [todos, setTodos] = useState([])

  const [user, loading, error] = useAuthState(firebase.auth())

  firebase.auth().signInAnonymously()

  const loadingScreen = (
    <div>
      <p>Loading...</p>
    </div>
  )

  if (loading) {
    return loadingScreen;
  }
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }

  const addTodo = async () => {
    const text = todo
    const uid = user.uid
    db
      .collection('todos')
      .doc(uid)
      .collection('todos')
      .add({
        content: text,
        done: false
      })

    setTodo('')
  }

  const fetchTodo = async () => {
    const uid = user.uid
    db
      .collection('todos')
      .doc(uid)
      .collection('todos')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(function (doc) {
          console.log(doc.id, " => ", doc.data());
          setTodos([...todos, doc.data()])
        });
      })
  }

  const todoList = () => {
    fetchTodo()
    return todos.map(todo => {
      console.log(todo.content)
      return (
        <li>{todo.content}</li>
      )
    })
  }

  return (
    <div className="App">
      <h2>TODO</h2>
      {todo}
      <input
        onChange={event => {
          const text = event.target.value
          setTodo(text)
        }}
      />

      <button
        onClick={() => addTodo()}
      >
        追加する
      </button>

      <button
        onClick={fetchTodo}
      >取得テスト
      </button>

      <ul>
        {todoList()}
      </ul>
    </div>
  );
}

export default App;
