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
              console.log("success");
            }
          });
          window.location.reload();
        } else {
          console.log("data-else", data);
          const jsonData = JSON.parse(data);

          jsonData.push(noteData);

          const stringData = JSON.stringify(jsonData);
          console.log("stringData", stringData);

          fs.writeFile("./save.json", stringData, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("success");
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
        <select name="category" onInput={handleChange} id="category">
          <option value="" disabled selected hidden>
            Categories
          </option>
          <option value="character">Character</option>
          <option value="creature">Creature</option>
          <option value="faction">Faction</option>
          <option value="item">Item</option>
          <option value="location">Location</option>
          <option value="other">Other</option>
        </select>
        {/* Name */}
        <input
          id="name"
          name="name"
          onChange={handleChange}
          type="text"
          placeholder="Name"
        />
        {/* Note */}
        <textarea
          onChange={handleChange}
          name="note"
          id="details"
          rows="4"
          cols="50"
          form="new-note"
        ></textarea>
        {/* Submit */}
        <button onClick={handleSubmit}>New Note</button>
      </form>
    </div>
  );
}
