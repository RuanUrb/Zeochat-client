import { useState, useEffect } from 'react'

export default function Join(props: {name: string, isYou: boolean}){
    const [visible, setVisible] = useState(true)
/*
    useEffect(()=>{
        setTimeout(()=>{
            setVisible(false)
        }, 2000)
        console.log('GHAHAAHAH I AM GAY')
    }, [])
*/

    return (
        visible && 
        (!props.isYou ? <p>{props.name} just joined the room.</p> : <p>You joined the room.</p> )
    )
}
