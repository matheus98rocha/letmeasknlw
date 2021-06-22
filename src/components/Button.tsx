import { useState } from 'react';

export function Button() {

    const [value, setValue] = useState(0);

    const setNewValue = () => {
        return setValue(value + 1);
    }

    return (
        <div>
            <button onClick={setNewValue}>+1</button>
            <p>{value}</p>
        </div>
    )
}


