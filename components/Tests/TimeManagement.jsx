"use client"
import React, { useState, useEffect, useCallback } from 'react';
import styles from './TimeManagement.module.css'; // Import CSS module

const TimeManagement = () => {
  const [items, setItems] = useState([]);
  const [nameText, setNameText] = useState('');
  const [durationText, setDurationText] = useState('');
  const [on, setOn] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [scalar, setScalar] = useState(10.0);
  const maxDuration = 460;

  useEffect(() => {
    let interval;
    if (on) {
      interval = setInterval(() => {
        tick();
      }, 25);
    } else if (!on && elapsed !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [on, elapsed, tick]);

  const tick = () => {
    setElapsed(prevElapsed => prevElapsed + 1);
    setItems(prevItems => updateProgress(prevItems, elapsed + 1));
  };

  const handleReset = () => {
    if (on) {
      clearInterval(interval);
    }
    setNameText('');
    setDurationText('');
    setItems(resetProgress(items));
    setOn(false);
    setElapsed(0);
  };

  const handleStart = () => {
    setOn(prevOn => !prevOn);
  };

  const handleNameChange = (e) => {
    setNameText(e.target.value);
  };

  const handleDurationChange = (e) => {
    setDurationText(e.target.value.replace(/[^0-9]+/g, ''));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (durationText !== '') {
      const newItem = {
        name: nameText,
        duration: parseInt(durationText) * 40,
        progress: 0,
        id: Date.now()
      };

      const newScalar = Math.min(maxDuration / newItem.duration, scalar);

      setItems(prevItems => [...prevItems, newItem]);
      setScalar(newScalar);
      setNameText('');
      setDurationText('');
    }
  };

  return (
    <div>
      <div className={styles.btnHolder}>
        <button className={`${styles.btn} ${styles.btnSmall}`} onClick={handleStart}>
          {on ? 'Pause' : 'Start'}
        </button>
        <button className={`${styles.btn} ${styles.btnSmall}`} onClick={handleReset}>
          Reset
        </button>
      </div>
      <div id="timer" className={styles.timer}>
        <Timer elapsed={elapsed} />
      </div>
      <TaskList items={items} scalar={scalar} maxDuration={maxDuration} />
      <div style={{ display: on ? 'none' : 'block' }}>
        <div id="editor_label" className={styles.editorLabel}>Add Task</div>
        <form onSubmit={handleSubmit}>
          <div id="task_editor" className={styles.taskEditor}>
            <label htmlFor="taskname">Task name</label>
            <input name="nameText" onChange={handleNameChange} value={nameText} />
            <label htmlFor="duration">Duration in seconds</label>
            <input name="durationText" onChange={handleDurationChange} value={durationText} />
            <button className={`${styles.btn} ${styles.btnSmall}`}>Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Timer = ({ elapsed }) => {
  return (
    <span>{(elapsed / 40).toFixed(2)}</span>
  );
};

const TaskList = ({ items, scalar, maxDuration }) => {
  return (
    <div id="bar_list" style={{ width: 500 }}>
      {items.map(item => {
        const ratio = item.progress / item.duration;
        const duration = item.duration * scalar;
        const progress = ratio * (duration - 6);
        return (
          <div className={styles.barHolder} key={item.id}>
            <Bar duration={duration} progress={progress} text={item.name} />
            <span className={styles.iconGear} />
          </div>
        );
      })}
    </div>
  );
};

const Bar = ({ duration, progress, text }) => {
  return (
    <div className={styles.outerBar} style={{ width: duration, display: 'inline-block' }}>
      <span className={styles.barText} style={{ width: duration - 6 }}>
        {text}
      </span>
      <div className={styles.innerBar} style={{ width: progress }} />
    </div>
  );
};

const updateProgress = (items, elapsed) => {
  for (let i in items) {
    if (elapsed <= items[i].duration) {
      items[i].progress = elapsed;
      elapsed = 0;
      break;
    } else {
      items[i].progress = items[i].duration;
      elapsed -= items[i].duration;
    }
  }
  return items;
};

const resetProgress = (items) => {
  return items.map(item => ({ ...item, progress: 0 }));
};

export default TimeManagement;
