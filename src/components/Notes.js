import { useState, useEffect } from "react";
import Search from './Search'
const fs = require("fs");

export default function Notes() {
  const [fullData, setFullData] = useState([]);

  const [searchData, setSearchData] = useState([])

  const [isSearching, setIsSearching] = useState(false)

  const [tags, setTags] = useState([])
  const [catSearch, setCatSearch] = useState()
  const [nameSearch, setNameSearch] = useState()
  console.log(tags, catSearch, nameSearch)

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

console.log(handleSearch)
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
console.log(isSearching)
  return (
    <div>
        <div>
          <Search functions={{setTags, setCatSearch, setNameSearch, setIsSearching, handleSearch}} />
        </div>

        <div>
            {isSearching 
                ? (searchData.map((note) => (
                    <div key={note.id} id='singleNote'>
                        <p>{note.category}</p>
                        <p>{note.name}</p>
                        <p>{note.note}</p>
                        <p>
                            <button onClick={() => handleDelete(note.id)}>Delete</button>
                        </p>
                    </div>
)
                )) : 

                fullData && fullData.length >= 1 && Object.keys(fullData[0]).length !== 0
                    ? (fullData.map((note) => (
                        <div key={note.id} id="singleNote">
                        <p>{note.category}</p>
                        <p>{note.name}</p>
                        <p>{note.note}</p>
                        <p>
                            <button onClick={() => handleDelete(note.id)}>Delete</button>
                        </p>
                        </div>
                    ))) : null

            }
        </div>
    </div>
  );
}
