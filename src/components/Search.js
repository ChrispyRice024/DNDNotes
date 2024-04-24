import { useState, useEffect } from "react"

export default function Search ({functions}) {

    const {setTags, setCatSearch, setNameSearch, setIsSearching, handleSearch} = functions
    
    const handleNameSearch = (e) => {

        const splitName = e.target.value.split(/[ ,]+/)
        setNameSearch(splitName)
    }

    const handleTags = (e) => {
        const splitTags = e.target.value.split(/[ ,]+/)
        console.log(splitTags)
        setTags(splitTags)
    }

    const clearSearch = (e) => {
        setIsSearching(false)
    }

    const handleCatSearch = (e) => {

        setCatSearch(e.target.value)
    }

    // const handleSubmit = (e) => {
    //     e.preventDefault()
    //     setIsSearching(true)
    // }
    return(
        <div id='search'>
            <form>
                <select onChange={handleCatSearch} name='category' id='searchCat'>
                    <option default value='all'>All</option>
                    <option value="character">Character</option>
                    <option value="creature">Creature</option>
                    <option value="faction">Faction</option>
                    <option value="item">Item</option>
                    <option value="location">Location</option>
                    <option value="other">Other</option>
                </select>

                <input onChange={handleNameSearch} id='searchName' name='name' type='text' placeHolder='Search By Name'/>

                <input onChange={handleTags} name='tags' id='tags' type='text' placeHolder='Search By Keyword'/>

                <button onClick={handleSearch}>Search</button>
                <button onClick={clearSearch}>Clear Search</button>
            </form>
        </div>
    )
}