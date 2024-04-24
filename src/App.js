import './App.css'
import {useState, useEffect} from 'react'
import WorkPad from './components/WorkPad'
import Notes from './components/Notes'

const fs = require('fs')



function App() {

  return (
    <div className="App">

        <div id='workPad'>
          <WorkPad />
        </div>

        <div>
          <Notes />
        </div>

    </div>
  );
}

export default App;
