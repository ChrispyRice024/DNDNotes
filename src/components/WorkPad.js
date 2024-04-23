import {useState, useEffect} from 'react'

const fs = require('fs')

export default function WorkPad ({functions}) {

    // Passing down functions
    const {fullData, setFullData, getNoteData} = functions
    
    const [DBChange, setDBChange] = useState(false)

    const [noteData, setNoteData] = useState({
        id: Date.now(),
        name:'',
        note:'',
        category:''
      })

    const handleChange = (e) => {
    e.preventDefault()

    setNoteData(prevData => ({
        ...prevData,
        [e.target.name]: e.target.value
    }))

    console.log(noteData)
    }



    useEffect(() => {
        getNoteData(noteData)
    }, [])

    useEffect(() => {
        console.log('fullData-WorkPad initial', fullData)
    })
    useEffect(() => {
        console.log('fullData-WorkPad', fullData)
    }, [fullData])

    const handleSubmit =  (e) => {
        e.preventDefault()
      
        // setFullData(prevData => [...prevData, noteData])

        console.log('right after fullData is set in handleSubmit', fullData)
        
        // const saveFile = async () => {
      
        //   try{
        //       const stringData = JSON.stringify(fullData)
        //       console.log('|fullData|', fullData)
      
        //       fs.writeFile('./save.json', stringData, (err) => {
        //           if(err){
        //               console.log('try', err)
        //           }else{
        //           console.log('successful writeFile', fullData)
      
        //           // console.log(save.json)
        //           }
        //   })
        //   }catch(err){
        //       console.error('catch', err)
        //   }
        // }
      
        // const saveFile = async () => {

        //     let jsonData

        //     try{

        //         const data = fs.readFile('./save.json', 'utf8', (err) => {
        //             if(err){
        //                 console.log('readFile', err)
        //             }else{
        //                 console.log('data-else-try', data)
        //                 jsonData = JSON.parse(data)
        //                 console.log('success')
                        
        //                 jsonData.push(noteData)
        //             }
        //         })
        //         const stringData = JSON.stringify(jsonData)

                
        //         console.log('stringData', stringData)
                
        //         fs.writeFile('./save.json', stringData, (err) => {
        //             if(err){
        //                 console.log('writeFile', err)
        //             }else{
        //                 console.log('success')
        //             }
        //         })
        //     }catch(err){
        //         console.log('catch', err)
        // }}

        const saveFile = () => {

            fs.readFile('./save.json', 'utf8', (err, data) => {
                if(err){
                    console.log('saveFile-if', err)
                
                }else if(data === '' || data.length === 0){

                    const noteArray = [noteData]
                    const noteArrayString = JSON.stringify(noteArray)

                    fs.writeFile('./save.json', noteArrayString, (err) => {
                        if(err){
                            console.log(err)
                        }else{
                            console.log('success')
                        }
                        })
                    window.location.reload()
                }else{
                    console.log('data-else', data)
                    const jsonData = JSON.parse(data)

                    jsonData.push(noteData)

                    const stringData = JSON.stringify(jsonData)
                    console.log('stringData', stringData)

                    fs.writeFile('./save.json', stringData, (err) => {
                        if(err){
                            console.log(err)
                        }else{
                            console.log('success')
                        }
                    })
                    window.location.reload()
                }

                }
            )
        }
        saveFile()
        console.log('after saveFile is run in handleSubmit', fullData)
      
            // window.location.reload()
      
      } 

    return(
        <div>
            <form id='newNote'>
                {/* Category */}
                <select name='category' onInput={handleChange} id='category'>
                    <option value="" disabled selected hidden>Categories</option>
                    <option value="character">Character</option>
                    <option value="creature">Creature</option>
                    <option value="faction">Faction</option>
                    <option value="item">Item</option>
                    <option value="location">Location</option>
                    <option value="other">Other</option>
                </select>
                {/* Name */}
                <input id="name" name='name' onChange={handleChange} type="text" placeholder="Name"/>
                {/* Note */}
                <textarea onChange={handleChange} name='note' id="details" rows="4" cols="50" form="new-note"></textarea>
                {/* Submit */}
                {/* <input type='submit' onSubmit={handleSubmit} value='submit' /> */}
                <button onClick={handleSubmit}>Click</button>
                {/* <input id="submit" onChange={handleSubmit} type="submit" value="Save Entry"/> */}
            </form>
        </div>
    )
}