import React from "react";
import './FlipCard.css'

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