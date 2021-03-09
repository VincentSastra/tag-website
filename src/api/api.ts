import {Pet} from './pet'

export async function getPets(username: string): Promise<Array<Pet>> {
    return fetch("https://k7t0ap6b0i.execute-api.us-west-2.amazonaws.com/dev/users/" + username + "/tags/")
        .then(res =>
            res.json()
        )
        .then(json => {
            return json.result.Items.map(
                (item: any) => {
                    const pet: Pet = {
                        name: item.SK.substr(4),
                        img: item.Img
                    }
                    return pet
                }
            )
        })
}