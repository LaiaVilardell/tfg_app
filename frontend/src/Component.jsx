import React, {useState} from 'react'

export default function Component() {

    "VARIABLES"
    "text1 (valor del input de -value-) = propietat que té associada l'operació -setText- que serveix per actualitzar l'estat"
    const [text1, setText] = useState()
    
    "per crear el botó"
    const [updated, setUpdated] = useState()

    "FUNCIONS"
    "per crear una funció de fletxa"
    const textOnChange = (event) => 
        {
            setText(event.target.value)
        }
    
    const buttononClick = () => 
    {
        setUpdated(text1)
    }

  return (
    <div>
    <input type="text" value= {text1} onChange= {textOnChange} />
    <button onClick={buttononClick}>Iniciar sessió</button>
    <p>Input: {text1} </p>
    <p>Actualització: {updated} </p>
    </div>
    
  )
}

