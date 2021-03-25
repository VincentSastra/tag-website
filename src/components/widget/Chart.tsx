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
    
    const data = {
        labels: keyValueArray.map(kv => kv.x * 1000),
        datasets: [
            {
                label: 'Heartbeat Rate (BPM)',
                data: keyValueArray.map(kv => kv.y),
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
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
                    unit: 'minute'
                }
            }]
        },
    }

    return (
        <Line data={data} options={options} />
    );
}