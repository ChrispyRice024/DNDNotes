import {useState, useEffect} from 'react'
import WorkPad from './components/WorkPad'
import Notes from './components/Notes'
const fs = require('fs')

function App() {

  const [fullData, setFullData] = useState([])

  const [shouldReload, setShouldReload] = useState(false)

//   useEffect(() => {
//     const saveData = async () => {
//         try{
//             const stringData = fullData.length > 0  ? JSON.stringify(fullData) : []
//             await fs.promises.writeFile('./save.json', stringData)

   
//         }catch(err){
//             console.error('Error saving data to save.json:', err);

//         }
//         // window.location.reload()
//     }
//   saveData()
// }, [fullData])

  useEffect(() => {

    fs.readFile('./save.json', 'utf8', function (err, data) {
      try{
        const jsonData = JSON.parse(data)
        setFullData(jsonData)
      console.log(jsonData)
      }catch(err){
        console.error(err)
      }
    })

    if(fullData && fullData.length === 0){
      console.log(true)
    }else{
      console.log(false)
    }
  }, [])
  
  return (
    <div className="App">
      <div>
        <WorkPad functions={{fullData, setFullData}} />
      </div>
      <div>
        <Notes functions={{fullData, setFullData}} />
      </div>
    </div>
  );
}

export default App;
