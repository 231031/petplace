import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(1);

    const increment = () => {
        setCount(count + 1);
    };
    const decrement = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={decrement} style={{ fontSize: '20px' }}>-</button>
            <span style={{
                fontSize: '20px',
                width: '25px', 
                height: '25px',
                borderRadius: '50%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>{count}</span>
                    < button onClick={ increment } style={{ fontSize: '20px' }}>+</button>
        </div >
    );
}

export default Counter;
