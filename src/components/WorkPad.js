import { useState, useEffect } from "react";

const fs = require("fs");

export default function WorkPad() {
  // Passing down functions

  const [DBChange, setDBChange] = useState(false);

  const [noteData, setNoteData] = useState({
    id: Date.now(),
    name: "",
    note: "",
    category: "",
  });

  const handleChange = (e) => {
    e.preventDefault();

    setNoteData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));

    console.log(noteData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const saveFile = () => {
        
      fs.readFile("./save.json", "utf8", (err, data) => {
        
        if (err) {
          console.log("saveFile-if", err);
        
        } else if (data === "" || data.length === 0) {
        
            const noteArray = [noteData];
            const noteArrayString = JSON.stringify(noteArray);

          fs.writeFile("./save.json", noteArrayString, (err) => {

            if (err) {
              console.log(err);
            } else {
              console.log("success no1");
            }
          });
          window.location.reload();

        } else {
          console.log("data-else", data);
          const jsonData = JSON.parse(data);
            console.log(noteData)
          jsonData.push(noteData);

          const stringData = JSON.stringify(jsonData);
          console.log("stringData", stringData);

          fs.writeFile("./save.json", stringData, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("success no2");
            }
          });
          window.location.reload();
        }
      });
    };
    saveFile();

    // window.location.reload()
  };

  return (
    <div id='form'>
        <h2>
            New Note
        </h2>
      <form id="newNote">
        {/* Category */}
        <p>
            <select name="category" onInput={handleChange} id="category">
            <option value="" disabled selected hidden>
                Categories
            </option>
            <option value="Character">Character</option>
            <option value="Creature">Creature</option>
            <option value="Faction">Faction</option>
            <option value="Item">Item</option>
            <option value="Location">Location</option>
            <option value="Other">Other</option>
            <option value="Quest">Quest</option>
            </select>
        
            {/* Name */}
            <input
            id="name"
            name="name"
            onChange={handleChange}
            type="text"
            placeholder="Name"
            />
        </p>
        <p>
            {/* Note */}
            <textarea
            onChange={handleChange}
            name="note"
            id="details"
            rows="10"
            cols="50"
            form="new-note"
            ></textarea>
        </p>
        {/* Submit */}
        <input src='scroll_submit.png' type='image' id='submit' onClick={handleSubmit} />
      </form>
    </div>
  );
}
