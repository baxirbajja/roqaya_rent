//ResultSummary.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
export default function ResultSummary(){
    const tasks = useSelector((state) => state.products);
    const dispatch = useDispatch();

    const HandleDelete = (index) => {
        dispatch({ type: 'DELETE_TASK', payload: index })
    }
    return (
        <>
            <h1>Liste des taches</h1>
            <ul>
                {tasks.map((task, index) => (
                    <li key={index}>
                        <h3>{task.titre}</h3>
                        <p>{task.descr}</p>
                         <button onClick={()=> HandleDelete(index)}>Supprimer</button>
                    </li>))}
                    
            </ul>
        </>
    )

}


























