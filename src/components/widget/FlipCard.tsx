import React, {ReactDOM, useEffect, useRef, useState} from "react";
import ReactCardFlip from "react-card-flip";
import {Card} from "react-bootstrap";

export function FlipCard(FrontElement: JSX.Element, BackElement: JSX.Element): JSX.Element {
    const [flip, setFlip] = useState(false)

    return (
        <div className="FlipCard" style={{height: 300}} onMouseOver={() => setFlip(true)} onMouseOut ={() => setFlip(false)}>
            <ReactCardFlip isFlipped={flip} >
                <div className="fillDiv">
                    {FrontElement}
                </div>

                <div className="fillDiv">
                    {BackElement}
                </div>
            </ReactCardFlip>
        </div>
    )
}