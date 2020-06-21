import React from 'react';
import './App.css';
import { db } from './firebaseInitializer';
import { useState } from 'react'
import { Switch } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

function TodoRow({ todo, uid }) {
  const [checked, setChecked] = useState(todo.done)

  const updateStatus = (status) => {
    db
      .collection('todos')
      .doc(uid)
      .collection('todos')
      .doc(todo.id)
      .set({done: status, content: todo.content})
  }

  return (
    <TableRow key={todo.content}>
      <TableCell width={"33%"}>
        <Switch
          checked={checked}
          onChange={() => {
            updateStatus(!checked)
            setChecked(!checked)
          }}
          color={'primary'}
        />
      </TableCell>
      <TableCell>
        {todo.content}
      </TableCell>
    </TableRow>
  );
}

export default TodoRow;
