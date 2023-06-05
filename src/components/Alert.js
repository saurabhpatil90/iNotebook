import React from 'react'
import { useContext } from 'react'
import noteContext from '../context/notes/NoteContext';


function Alert() {
    const context = useContext(noteContext);
    const {alert} = context;
    const capitalize = (word)=>{
        if(word === "danger"){
            word = "Error";
        }
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
        
    }
    return (
        <div style={{height: '50px'}}>
        {alert && <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
           <strong>{capitalize(alert.type)}</strong>: {alert.msg} 
        </div>}
        </div>
    )
}

export default Alert