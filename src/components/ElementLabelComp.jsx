import React from 'react';
import { useDrag } from 'react-dnd';

export function ElementLabelCom({label, item}) {
    const [{isDragging}, drag] = useDrag(() => ({
        type: "tags",
        item,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }))
    return (
        <div ref={drag} style={{opacity: isDragging ? "0%" : "100%"}}>
            {label}
        </div>
    )
}
