import { useState, useEffect } from "react";

const fs = require("fs");

export default function EditEntry({functions}) {

    const {toChange, setToChange} = functions

    console.log(toChange.name) // this logs correctly
    
    return(
        <div id='edit'>
            <p>
                <input type='text' id='editName' defaultValue={toChange.name} /> {/* this is blank */}
            </p>
            <p>
                <select name="category" defaultValue={toChange.category} id="category">

                    <option value="character">Character</option>
                    <option value="creature">Creature</option>
                    <option value="faction">Faction</option>
                    <option value="item">Item</option>
                    <option value="location">Location</option>
                    <option value="other">Other</option>
                </select>
            </p>
        </div>
        
    )
}