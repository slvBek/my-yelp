import React from 'react'


export const View = ({restaurants}) => {
    return restaurants.map(restaurant=>(
        <tr key={restaurant.name}>
            <td>{restaurant.name}</td>
            <td>{restaurant.description}</td>
            <td>{restaurant.city}</td>
        </tr>
    ))
}

export default View;