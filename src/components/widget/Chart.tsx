import React, {useEffect, useRef, useState} from "react";
// @ts-ignore
import { Chart } from "react-charts";

const aspectRatio = 1

export interface Data {
    label: string,
    data: Point[]
}

export interface Point {
    primary: number,
    secondary: number
}

export default function PetDataChart(data: Data[]): JSX.Element {

    console.log(data)

    const series = React.useMemo(
        () => ({
            showPoints: false,
        }),
        []
    );

    console.log(series)

    const axes = React.useMemo(
        () => [
            {
                primary: true,
                type: "time",
                position: "bottom",
            },
            { type: "linear", position: "left" },
        ],
        []
    );

    const divRef = useRef(null)
    const [height, setHeight] = useState(undefined)

    const calculateHeight = () => {
        if (divRef != null) {
            // @ts-ignore
            setHeight(divRef.current.offsetWidth * aspectRatio)
        }
    }

    useEffect(() => {
        window.addEventListener("resize", () => {
            calculateHeight()
        })
    })

    useEffect(() => {
        calculateHeight()
    }, [divRef])

    return (
        <div ref={divRef} style={{ height: height ? height : "0px" }}>
            <Chart data={data} series={series} axes={axes} tooltip />
        </div>
    )
}