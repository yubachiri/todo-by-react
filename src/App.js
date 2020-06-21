import React from 'react';
import './App.css';
import firebase, { db } from './firebaseInitializer';
import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Button, Container, Paper, TextField } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    paper: {
      padding: '10px',
      margin: '20px 10px'
    },
    addButton: {
      margin: '10px'
    }
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
    <Paper className={classes.paper}>
      <p>Loading...</p>
    </Paper>
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
          <div>
            <TextField
              label={'TODO'}
              value={todo}
              onChange={event => {
                const text = event.target.value
                setTodo(text)
              }}
            />
          </div>

          <div>
            <Button
              className={classes.addButton}
              disabled={!todo}
              variant={'contained'}
              color={'primary'}
              size={'small'}
              onClick={() => {
                addTodo()
              }}
            >
              追加する
            </Button>
          </div>

          <ul>
            {todoList()}
          </ul>
        </Paper>
      </Container>
    </div>
  );
}

export default App;
