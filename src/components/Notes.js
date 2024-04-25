import { useState, useEffect } from "react";
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
  const [catSearch, setCatSearch] = useState()
  const [nameSearch, setNameSearch] = useState()

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

  const confirmChange = (note, e) => {
    e.preventDefault()
    setFullData(prevData => prevData.map(item => {
        if(item=== note){
            return{
                ...item,
                ...toChange
            }
        }
    }))
    console.log(note)
  }

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
        <div>
            <Search functions={{ setTags, setCatSearch, setNameSearch, setIsSearching, handleSearch }} />
        </div>

        <div>
            {isSearching ? (
                searchData.map((note) => (
                    <div key={note.id} className='singleNote'>
                        <p>{note.category}</p>
                        <p>{note.name}</p>
                        <p>{note.note}</p>
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
                            <div>
                                <p>
                                    <select name="category" onInput={handleChange} id="category">
                                        <option defaultValue={decideDefault('')} disabled hidden>
                                            Categories
                                        </option>
                                        <option value="character" defaultValue={decideDefault('character')}>Character</option>
                                        <option value="creature" defaultValue={decideDefault('creature')}>Creature</option>
                                        <option value="faction" defaultValue={decideDefault('faction')}>Faction</option>
                                        <option value="item" defaultValue={decideDefault('item')}>Item</option>
                                        <option value="location" defaultValue={decideDefault('location')}>Location</option>
                                        <option value="other" defaultValue={decideDefault('other')}>Other</option>
                                    </select>
                                </p>

                                <p>
                                    <input
                                        id="name"
                                        name="name"
                                        onChange={handleChange}
                                        type="text"
                                        defaultValue={toChange.name}
                                    />
                                </p>

                                <p>
                                    <textarea
                                        onChange={handleChange}
                                        name="note"
                                        id="details"
                                        rows="4"
                                        cols="50"
                                        form="new-note"
                                        defaultValue={toChange.note}
                                    ></textarea>
                                </p>
                                <p>
                                    <button onClick={(event) => confirmChange(note, event)}>Confirm</button>
                                </p>
                            </div>
                        ) : (
                            <>
                                <p>{note.category}</p>
                                <p>{note.name}</p>
                                <p>{note.note}</p>
                                <p>
                                    <button onClick={() => handleDelete(note.id)}>Delete</button>
                                    <button onClick={(event) => handleEdit(note, event)}>Edit</button>
                                </p>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    </div>
  );
}
