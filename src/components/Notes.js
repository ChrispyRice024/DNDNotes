import { useState, useEffect, useRef } from "react";
import Search from './Search'
import EditEntry from './EditEntry'
const fs = require("fs");

export default function Notes() {

//FULLDATA AND the LOGIC TO POPULATE IT
  const [fullData, setFullData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fs.readFile("./save.json", "utf8", (err, data) => {

          const jsonData = JSON.parse(data);
          
          const addBreaks = () => {

            return jsonData.map((item, index) => {
                const noteWithBreaks = item.note.replace(/\n/g, '<br>')
                return (
                    <div key={index}  />
                )
            })
            for(let i=0; i < jsonData.length; i++){

                let note = jsonData[i].note

                note = note.replace(/\n\n/g, '<br>')
                console.log(jsonData[i])
            }  
          }
          addBreaks()
          setFullData(jsonData);

        });
      } catch (err) {
        console.error(err);
      } finally {
        console.log("fullData, finally", fullData);
      }
    };
    fetchData();
  }, []);


  //SEARCH VARIABLES AND LOGIC
  const [searchData, setSearchData] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [tags, setTags] = useState([])
  const [catSearch, setCatSearch] = useState([])
  const [nameSearch, setNameSearch] = useState([])

  const handleSearch = (e) => {
    e.preventDefault()

    var results = fullData.filter((el) => {
        console.log(el)
        const tagMatch = tags.length === 0 || (el.note && tags.some(tag => el.note.includes(tag)))
        console.log(el, tagMatch)

        const nameMatch = nameSearch.length === 0 || (el.name && nameSearch.some(nameSplit => el.name.toLowerCase().includes(nameSplit.toLowerCase())))
        // const nameMatch = !nameSearch || el.name.toLowerCase().includes(nameSearch.toLowerCase())
        console.log(nameMatch, el)

        const catMatch = catSearch === undefined || (el.category && catSearch === el.category)

        return tagMatch && catMatch && nameMatch;
    })
    console.log(results)
    setIsSearching(true)
    setSearchData(results)
  }


//EDIT VARIABLES AND LOGIC
  const [toChange, setToChange] = useState({})
  const [isEdit, setIsEdit] = useState(false)

  const detailsRef = useRef(null)
  const nameRef = useRef(null)
  const catRef = useRef(null)

  const handleEdit = (noteToChange, e) => {
    e.preventDefault()

    console.log(noteToChange)
    setToChange(noteToChange)
    setIsEdit(true)
  }

  const handleChange = (e) => {
    e.preventDefault()

    setToChange(prevData =>( {
        ...prevData,
        [e.target.name]: e.target.value
    }) )
  }

  const confirmChange = async (note, e) => {
    e.preventDefault()


    try{
        const data = await fs.promises.readFile('./save.json', 'utf8')
        const jsonData = JSON.parse(data)

        jsonData.forEach((jsonNote) => {

            if(jsonNote.id === note.id){
                jsonNote.name = nameRef.current.value
                jsonNote.note = detailsRef.current.value
                jsonNote.category = catRef.current.value
            }
        })

        await fs.promises.writeFile('./save.json', JSON.stringify(jsonData), 'utf8')
        console.log('successful update')
        window.location.reload()
    }catch(err){
        console.log(err)
    }

    const updateData = () => {
        fs.readFile('./save.json', 'utf8', (err, data) => {
            if(err){
                console.log(err)
            }else{
                const jsonData = JSON.parse(data)
                console.log(jsonData)
                jsonData.map((jsonNote) =>{
                    if(jsonNote.id === note.id){
                        // jsonNote = note
                        console.log('note', note)
                        console.log('jsonNote', jsonNote)
                        console.log(e)
                    }
                })
            }
        })
    }

    updateData()
    
  }

  useEffect(() => {
    console.log('fullData in notes', fullData)
  })

  const decideDefault = (value) => {
    if (toChange.category === value){
        return true
    }else{
        return false
    }
  }

//LOGIC TO DELETE
  const handleDelete = (idToDelete) => {
    if (fullData.length === 1) {
      setFullData([]);
    }
    const updatedData =
      fullData.length > 1
        ? fullData.filter((note) => note.id !== idToDelete)
        : [];
    console.log(updatedData);

    const stringData = JSON.stringify(updatedData);
    console.log(stringData);
    try {
      fs.writeFile("./save.json", stringData, function (err) {
        if (!err) {
          console.log("Success");
        } else {
          console.error("error line 44 workPad.js", err);
        }
      });
      window.location.reload();
    } catch (err) {
      console.error("error: append file:", err);
    }
  };

  return (
    <div>
        <div id='searchParent'>
            <Search functions={{ setTags, setCatSearch, setNameSearch, setIsSearching, handleSearch }} />
        </div>

        <div>
            {isSearching ? (
                searchData.map((note) => (
                    <div key={note.id} className='singleNote'>
                        <p>{note.category}</p>
                        <p>{note.name}</p>
                        <p style={{ whiteSpace: 'pre-line' }}>{note.note}</p>
                        <p>Extra content for searched items</p>
                        <p>
                            <button onClick={() => handleDelete(note.id)}>Delete</button>
                            <button onClick={(event) => handleEdit(note, event)}>Edit</button>
                        </p>
                    </div>
                ))
            ) : (
                fullData &&
                fullData.map((note) => (
                    <div key={note.id} className='singleNote'>
                        {(toChange.id === note.id && isEdit) ? (
                            <span>
                                <p>
                                    <select name="category" onInput={handleChange} id="category" ref={catRef}>
                                        <option defaultValue={decideDefault('')} disabled hidden>
                                            Categories
                                        </option>
                                        <option value="Character" defaultValue={decideDefault('Character')}>Character</option>
                                        <option value="Creature" defaultValue={decideDefault('Creature')}>Creature</option>
                                        <option value="Faction" defaultValue={decideDefault('Faction')}>Faction</option>
                                        <option value="Item" defaultValue={decideDefault('Item')}>Item</option>
                                        <option value="Location" defaultValue={decideDefault('Location')}>Location</option>
                                        <option value="Other" defaultValue={decideDefault('Other')}>Other</option>
                                        <option value="Quest" defaultValue={decideDefault('Quest')}>Quest</option>
                                    </select>
                                </p>

                                <p>
                                    <input
                                        ref={nameRef}
                                        id="name"
                                        name="name"
                                        onChange={handleChange}
                                        type="text"
                                        defaultValue={toChange.name}
                                    />
                                </p>

                                <p>
                                    <textarea
                                        ref={detailsRef}
                                        onChange={handleChange}
                                        name="note"
                                        id="details"
                                        rows="10"
                                        cols="50"
                                        form="new-note"
                                        defaultValue={toChange.note}
                                    ></textarea>
                                </p>
                                <p>
                                    <button onClick={(event) => confirmChange(note, event)}>Confirm</button>
                                </p>
                            </span>
                        ) : (
                            <span>
                                <p>{note.category}</p>
                                <p>{note.name}</p>
                                <p style={{ whiteSpace: 'pre-line' }}>{note.note}</p>
                                <p>
                                    <button onClick={() => handleDelete(note.id)}>Delete</button>
                                    <button onClick={(event) => handleEdit(note, event)}>Edit</button>
                                </p>
                            </span>
                        )}
                    </div>
                ))
            )}
        </div>
    </div>
  );
}
