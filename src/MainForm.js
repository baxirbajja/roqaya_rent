import React, { useState } from "react";
import { useDispatch } from "react-redux";
   export default function MainForm(){
    const [titre, setTitre] = useState("");
    const [descr, setDescription] = useState("");
    const dispatch = useDispatch();
    const ajouterTask = () => {
        dispatch({ type: 'ADD_TASK', payload: { titre, descr } });
        setDescription('');
        setTitre('');
    }
    const handelSubmit = (e) => {
        e.preventDefault();
        ajouterTask();
    }

    return (
        <>
        <form onSubmit={handelSubmit}>
                <div className="container bg-dark text-light p-4 my-3 rounded-3">
                    <div className='d-flex justify-content-center h2 pb-5' style={{ width: "100%" }}>
                        Ajouter une nouvelle tâche
                    </div>
                    <div className="row">
                        <label className="form-label"> Titre:</label>
                        <input type="text" className="form-control mt-3" value={titre } onChange={(e) => setTitre(e.target.value)} />
                    </div>
                    <div className="row">
                        <label className="form-label"> Description:</label>
                        <textarea className="form-control mt-3" value={descr} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div > 
                        <button type="submit" onClick={ajouterTask} className="btn btn-success mt-3">Ajouter Tâche</button>
                    </div>
                </div>
            </form>
            
        </>
    )
};

