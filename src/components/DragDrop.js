import React, { useEffect, useRef, useState } from 'react'
import { Picture } from './Picture'
import { useDrop } from 'react-dnd'
import { ElementCom } from './ElementCom'
import { ElementLabelCom } from './ElementLabelComp'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TextField } from '@mui/material';

const eleList = [
    {
        type: 'input',
        label: 'Input TAG'
    },
    {
        type: 'checkbox',
        label: 'CheckBox Button'
    },
    {
        type: 'button',
        label: 'Button'
    },
    {
        type: 'radio',
        label: 'Radio button'
    },
    {
        type: 'headLabel',
        label: 'Head Label'
    },
]

const elementList = [
    {
        id: null,
        type: 'input',
        element: ({ id, label }) => {
            return <TextField type="text" id={id} label={label} variant='filled' />
        },
        label: null,
    },
    {
        id: null,
        label: null,
        type: 'checkbox',
        element: ({ id, label }) => {
            return <>
                <input type='checkbox' value={'checkbox'} id={id} /> <span>{label}</span>
            </>
        }
    },
    {
        id: null,
        type: 'button',
        element: ({ id, label }) => {
            return <button id={id} >{label}</button>
        }
    },
    {
        id: null,
        type: 'radio',
        element: ({ id, keyRadio, label }) => {
            return <>
                <input type='radio' name={keyRadio} value={label} id={id} /> <span>{label}</span>
            </>
        },
        label: null,
        keyRadio: null
    },
    {
        id: null,
        type: 'headLabel',
        element: ({ id, label }) => {
            return <>
                <span id={id}>{label}</span>
            </>
        }
    },
]

const takenElementList = eleList.map(ele => <ElementLabelCom label={ele.label} item={ele} />)

function Dragdrop() {

    const [board, setBoard] = useState([])
    const [label, setLabel] = useState('');
    const [radioLabel, setRadioLabel] = useState('');
    const count = useRef(0)
    const renderDefend = useRef(0);
    const Popup = () => {
        const type = currentItem.type
        switch (type) {
            case 'radio':
                return <>
                    <form>
                        <span>key for radio</span>
                        <input autoFocus="autofocus" value={radioLabel} onChange={(e) => {
                            setRadioLabel(e.target.value);
                        }} />
                        <span>Label</span>
                        <input autoFocus="autofocus" value={label} onChange={(e) => {
                            setLabel(e.target.value);
                        }} />
                        <button onClick={() => {
                            setPop(false);
                        }}>close</button>
                    </form>
                </>
            default:
                return <>
                    <form>
                        <span>Label</span>
                        <input autoFocus="autofocus" value={label} onChange={(e) => {
                            setLabel(e.target.value);
                        }} />
                        <button onClick={() => {
                            setPop(false);
                        }}>close</button>
                    </form>
                </>
        }
    }
    const [pop, setPop] = useState(false);
    const [currentItem, setCurrentItem] = useState({});
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "tags",
        drop: (item) => activatePopup(item),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }))

    const activatePopup = (item) => {
        setPop(true);
        setCurrentItem(item);
    }

    useEffect(() => {
        if (!pop && count.current++) {
            addElement(currentItem, label);
            setCurrentItem({});
        }
    }, [pop])

    const addElement = (item, label) => {
        let droppedElement = { ...elementList.find(ele => item.type === ele.type) }
        if (item.type === "radio") {
            droppedElement.keyRadio = radioLabel;
            setRadioLabel('');
        }
        droppedElement.label = label
        droppedElement.id = board.length;
        setLabel('');
        setBoard(data => [...data, new Object(droppedElement)])
    }

    useEffect(() => {
        console.log("board", board)
    }, [board])

    function handleOnDragEnd(result) {
        if (!result.destination) return;

        const items = Array.from(board);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setBoard(items);
    }
    return (
        <>
            {pop ? <Popup />
                : <>
                    <div className='container'>
                        <div className='drag-box'>
                            {takenElementList}
                        </div>
                        <div className='drop-board' ref={drop} style={{ border: isOver ? '3px solid red' : '1px solid black' }}>

                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Droppable droppableId='tags'>
                                    {(provided) => (
                                        <div className="tags" {...provided.droppableProps} ref={provided.innerRef}>
                                            {board.map((ele, index) => {
                                                return (
                                                    <Draggable key={index} draggableId={`${index}`} index={index}>
                                                        {(provided) => (
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                <div style={{ margin: 10 }}>
                                                                    {<ele.element id={ele.id} label={ele.label} keyRadio={ele.keyRadio} />}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                );
                                            })}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>

                        </div>
                    </div>
                    <div>
                        <button onClick={() => {
                            console.log("final publish", board);
                        }}>publish</button>
                    </div>
                </>
            }
        </>
    )
}

export default Dragdrop