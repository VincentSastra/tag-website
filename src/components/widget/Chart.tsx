import React from "react";
import {Line} from "react-chartjs-2";

export interface KVPairs {
    x: number,
    y: number
}

export interface Point {
    primary: number,
    secondary: number
}

export default function PetDataChart(keyValueArray: KVPairs[]): JSX.Element {

    let max = keyValueArray.reduce((prev, cur) => Math.max(cur.y, prev), 0)
    let min = keyValueArray.reduce((prev, cur) => Math.min(cur.y, prev), Number.MAX_SAFE_INTEGER)

    let timeLabels = keyValueArray.map(kv => {
        let date: Date = new Date(0)
        date.setUTCSeconds(kv.x)
        return date.toLocaleString()
    });

    const data = {
        labels: keyValueArray.map(kv => kv.x * 1000),
        datasets: [
            {
                label: 'Heartbeat Rate (BPM)',
                data: keyValueArray.map(kv => kv.y),
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 3,
            },
        ],
    }
    const options = {
        responsive: true,
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'hour',
                    unitStepSize: 2,
                },
                ticks: {
                    major: {
                        enabled: true, // <-- This is the key line
                        fontStyle: 'bold', //You can also style these values differently
                        fontSize: 14 //You can also style these values differently
                    },
                },
            }],
            yAxes: [{
                ticks: {
                    suggestedMin: min - Math.ceil((max - min) * 0.1),
                    suggestedMax: max + Math.ceil((max - min) * 0.1),
                },
            }]
        },
    }

    return (
        <Line data={data} options={options} />
    );
}