import {useState, useEffect} from 'react'

const fs = require('fs')

export default function Notes ({functions}) {
    const {fullData, setFullData, setLoading} = functions

    const [noteData, setNoteData] = useState([])

    const handleDelete = (idToDelete) => {
        const updatedData = fullData.filter(note => note.id === idToDelete)

        setFullData(updatedData)

        const stringData = fullData.length > 0  ? JSON.stringify(fullData) : ''

        try{
            
            fs.writeFile('./save.json', stringData, function(err){
                        if(!err){
                            console.log('Success')
                        }else{
                            console.error('error line 44 workPad.js' , err)
                        }
                    })

        }catch(err){
            console.error('error: append file:',err)
        }
        // window.location.reload()
    }

    useEffect(()  => {

        const fetchData = async () => {
    
          try{
            const data = await fs.promises.readFile('./save.json', 'utf8')
            const jsonData = JSON.parse(data)
    
            setFullData(jsonData)
    
            console.log('fullData', fullData)
    
          }catch(err){
            console.error(err)
    
          }finally{
            console.log('fullData, finally', fullData)

          }
          console.log('fullData- end of fetch function', fullData)
        }
        fetchData()
        //this logs an empty array, but other logs on other pages(another child to this childs parent)logs the correct updated data
        console.log('fullData- after fetchData runs', fullData)
      }, [])

    return(
        <div>
            {
                fullData && fullData.length > 1 && Object.keys(fullData[0]).length !== 0 ? 
                fullData.map(note => 
                    <div id='singleNote'>
                        <p>
                            {note.category}
                        </p>
                        <p>
                            {note.name}
                        </p>
                        <p>
                            {note.note}
                        </p>
                        <p>
                            <button onClick={() => handleDelete(note.id)}>Delete</button>
                        </p>
                    </div>
                    )
                : ''
            }
        </div>
    )
}