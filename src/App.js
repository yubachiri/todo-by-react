import React from 'react';
import './App.css';
import firebase, { db } from './firebaseInitializer';
import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Container, Paper } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    paper: {
      padding: '10px',
      margin: '20px 10px'
    },
  }),
);

const fetchTodo = (uid, setTodos) => {
  db
    .collection('todos')
    .doc(uid)
    .collection('todos')
    .get()
    .then(querySnapshot => {
      const temp = []
      querySnapshot.forEach(doc => {
        temp.push(doc.data())
      });

      setTodos([...temp])
    })
}

function App() {
  const [todo, setTodo] = useState('')
  const [todos, setTodos] = useState([])

  const [user, loading, error] = useAuthState(firebase.auth())

  useEffect(() => {
    if (user?.uid) {
      fetchTodo(user.uid, setTodos)
    }
  }, [user])

  const classes = useStyles();

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

  const todoList = () => {
    const list = todos.map(todo => {
      return (
        <li key={todo.content}>{todo.content}: {todo.done + ''}</li>
      )
    })
    return list
  }

  return (
    <div className="App">
      <Container component={'div'} maxWidth={'xs'}>
        <Paper className={classes.paper}>
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

          <ul>
            {todoList()}
          </ul>
        </Paper>
      </Container>
    </div>
  );
}

export default App;
