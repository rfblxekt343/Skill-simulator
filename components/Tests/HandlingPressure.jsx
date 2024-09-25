"use client"

import React, { useState } from 'react';
import Howler from 'react-howler';

export default function HandlingPressure(){
  const [isPlaying, setIsPlaying] = useState(true);
  const [tasks, setTasks] = useState([
    { id: 1, name: 'משימה 1: הפעלת מגן', completed: false },
    { id: 2, name: 'משימה 2: שיגור מיירט', completed: false }
  ]);

  const completeTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    );
  };

  return (
    <div className="handling-pressure-test">
      <h1>מבחן התמודדות עם לחץ</h1>
      <p>השלים את המשימות תוך כדי לחץ של הסירנה!</p>
      <div>
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task ${task.completed ? 'bg-green-200' : 'bg-red-200'}`}
            onClick={() => completeTask(task.id)}
            style={{ padding: '10px', margin: '10px', cursor: 'pointer' }}
          >
            {task.name}
          </div>
        ))}
      </div>
      <Howler
        src="/siren.mp3"
        playing={isPlaying}
        loop={true}
        volume={0.5}
      />
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="bg-blue-500 p-2 text-white rounded"
      >
        {isPlaying ? 'כבה סירנה' : 'הפעל סירנה'}
      </button>
    </div>
  );
};



