import React from 'react';
import "./ImageLinkForm.css"

const ImageLinkForm = ({onInputChange, onSubmit}) => {
    return (
        <div>
            <p className = 'white f3'>
                {"This Magin Brain will detect faces in your pictures. Give it a try!"}
            </p>
            <div className="center">
                <div className="form center pa4 br3 shadow-5">
                    <input data-cy="cypress-image-url" className='f4 pa2 w-70 center'type = "tex" onChange={onInputChange}/>
                    <button data-cy="cypress-image-button" className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
                    onClick={onSubmit}>Detect</button>
                </div>
            </div>
        </div>
    )
}

export default ImageLinkForm