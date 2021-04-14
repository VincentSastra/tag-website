import {Doughnut} from "react-chartjs-2";
import React from "react";

// Returns a graph doughnut where the label is a list of strings for the category name
// And the values are a list of numbers weights where the index correspond to the category name
export default function ActivityDoughnut(labels: string[], values: number[]): JSX.Element {
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Activity Chart',
                data: values.map(val => val.toFixed(3)),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    }

    return (
        <Doughnut data={data} />
    )
}