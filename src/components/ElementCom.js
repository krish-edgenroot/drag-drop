import React from 'react';
import { useDrag } from 'react-dnd';

export function ElementCom({Component, item,index}) {
    const [{isDragging}, drag] = useDrag(() => ({
        type: "tags",
        item,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }))
    return (
        <div ref={drag} style={{opacity: isDragging ? "0%" : "100%"}}>
            <Component id={index}/>
        </div>
    )
}
