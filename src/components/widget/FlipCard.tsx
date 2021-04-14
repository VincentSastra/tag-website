import React from "react";
import './FlipCard.css'

// Wrapper function for a FlipCard widget. Displays the FrontElement and if hovered, it flips to display the back
export function FlipCard(FrontElement: JSX.Element, BackElement: JSX.Element): JSX.Element {
    return (
        <div className="flip-card">
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    {FrontElement}
                </div>
                <div className="flip-card-back">
                    {BackElement}
                </div>
            </div>
        </div>
    )
}