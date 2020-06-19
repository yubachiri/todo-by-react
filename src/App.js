import React from 'react';
import './App.css';
import firebase, { db } from './firebaseInitializer';
import { useState, useEffect } from 'react'

function App() {
  const [todo, setTodo] = useState('')
  const [todos, setTodos] = useState([])
  const [uid, setUid] = useState('')

  useEffect(() => {
    firebase.auth().signInAnonymously()

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // ログイン中
        console.log('そっち')
        setUid(user.uid)
      } else {
        // ログアウト中
        console.log('こっち')
        return <p>ログイン中...</p>
      }
    })
  }, [])

  const addTodo = async () => {
    const text = todo
    const uid = await firebase.auth().currentUser.uid
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
    const uid = await firebase.auth().currentUser.uid
    db
      .collection('todos')
      .doc(uid)
      .collection('todos')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(function(doc) {
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
      <header className="App-header">
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
      </header>
    </div>
  );
}

export default App;
