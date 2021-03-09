import React from "react";
// @ts-ignore
import { Chart } from "react-charts";

export default function PetDataChart(): JSX.Element {
    const data = React.useMemo(

        () => [

            {

                label: 'Series 1',

                data: [

                    { primary: 1, secondary: 10 },

                    { primary: 2, secondary: 12 },

                    { primary: 3, secondary: 13 },

                ],

            }
        ],

        []

    )

    const series = React.useMemo(
        () => ({
            showPoints: false,
        }),
        []
    );

    const axes = React.useMemo(
        () => [
            {
                primary: true,
                type: "time",
                position: "bottom",
                // filterTicks: (ticks) =>
                //   ticks.filter((date) => +timeDay.floor(date) === +date),
            },
            { type: "linear", position: "left" },
        ],
        []
    );

    return <Chart data={data} series={series} axes={axes} tooltip />
}