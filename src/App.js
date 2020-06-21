import React from 'react';
import './App.css';
import firebase, { db } from './firebaseInitializer';
import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';

const fetchTodo = (uid, setTodos) => {
  db
    .collection('todos')
    .doc(uid)
    .collection('todos')
    .get()
    .then(querySnapshot => {
      const temp = []
      querySnapshot.forEach(doc => {
        temp.push(doc.data()['content'])
      });

      setTodos([...temp])
    })
}

function App() {
  const [todo, setTodo] = useState('')
  const [todos, setTodos] = useState([])

  const [user, loading, error] = useAuthState(firebase.auth())

  useEffect(() => {
    if(user?.uid) {
      fetchTodo(user.uid, setTodos)
    }
  }, [user])

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
    fetchTodo(user.uid, setTodos)
  }

  // const fetchTodo = async () => {
  //   const uid = user.uid
  //   db
  //     .collection('todos')
  //     .doc(uid)
  //     .collection('todos')
  //     .get()
  //     .then(querySnapshot => {
  //       const temp = []
  //       querySnapshot.forEach(doc => {
  //         temp.push(doc.data()['content'])
  //       });
  //
  //       setTodos([...temp])
  //     })
  // }

  const todoList = () => {
    const list = todos.map(todo => {
      return (
        <li key={todo}>{todo}</li>
      )
    })
    return list
  }

  return (
    <div className="App">
      <h2>TODO</h2>
      <input
        value={todo}
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

      {/*<button*/}
      {/*  onClick={fetchTodo}*/}
      {/*>取得テスト*/}
      {/*</button>*/}

      <ul>
        {todoList()}
      </ul>
    </div>
  );
}

export default App;
