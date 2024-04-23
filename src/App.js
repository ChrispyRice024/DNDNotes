import {useState, useEffect} from 'react'
import WorkPad from './components/WorkPad'
import Notes from './components/Notes'
const fs = require('fs')

function App() {

  const [fullData, setFullData] = useState([])

  const [loading, setLoading] = useState(true)

  const [shouldReload, setShouldReload] = useState(false)

  const [didSubmit, setDidSubmit] = useState(false)

  const [noteData, setNoteData] = useState({})

  const getNoteData = (data) => {
    setNoteData(data)
    console.log(noteData)
  }

  useEffect(() => {
    setLoading(false)
  }, [fullData])




  
  // useEffect(() => {
  //   setLoading(false)
  //   console.log('fullData', fullData)
  //   console.log('loading', loading)
  // }, [fullData])

  return (
    <div className="App">
      {loading ? (
        <p>Loading...</p>
      ) : (
      <>
        <div>
          <WorkPad functions={{fullData, setFullData, getNoteData}} />
        </div>
        <div>
          <Notes functions={{fullData, setFullData, setLoading}} />
        </div>
      </>
      )}

    </div>
  );
}

export default App;
