import {useState, useEffect} from 'react'

const fs = require('fs')

export default function WorkPad ({functions}) {

    // Passing down functions
    const {fullData, setFullData} = functions

    //holding the individual notes until submit
    const [noteData, setNoteData] = useState({
        id: Date.now(),
        name:'',
        note:'',
        category:''
    })

    //Setting the data to noteData
    const handleChange = (e) => {
        e.preventDefault()

        setNoteData(prevData => ({
            ...prevData,
            [e.target.name]: e.target.value
        }))

        console.log(noteData)
    }

    // Setting the noteData at the end of fullData

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(fullData && fullData.length === 0){
            setFullData([noteData])
            // await saveData([noteData])

        }else if(fullData && fullData.length > 0){
            setFullData( prevData => [...prevData, noteData])
            // await saveData(fullData.concat(noteData))

        }

            const stringData = fullData.length > 0  ? JSON.stringify(fullData) : '[]'
            await fs.promises.writeFile('./save.json', stringData)
            // alert('success')
            // window.location.reload()
      
    }




        // 
    
useEffect(() => {
    console.log(fullData)
}, [fullData])
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
                <input type='submit' onSubmit={handleSubmit} value='submit' />
                {/* <input id="submit" onChange={handleSubmit} type="submit" value="Save Entry"/> */}
            </form>
        </div>
    )
}