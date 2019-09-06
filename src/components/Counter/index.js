import React, { useState, useEffect, useRef } from 'react'

// function extends(child, parent) {
//     const prototype = Object.create(parent.prototype)
//     prototype.constructor = child
//     child.prototype = prototype
// }
const countRef = {
    current: null,
}

function Counter() {
    const [count, setCount] = useState(0);
    //const countRef = useRef(null)

    // function callback() {
    //     setCount(count+1)
    // }

    useEffect(() => {
        countRef.current = count
        var times = countRef.current
        setTimeout(() => {
            console.log(`You clicked ${times} times`);
          }, 3000);
    })

    // useEffect(() => {
    //     function tick() {
    //         countRef.current()
    //     }
    //     const id = setInterval(tick, 1000)
    //     return () => clearInterval(id)
    // }, [])

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>Click me</button>
        </div>
    );
}

export default Counter
