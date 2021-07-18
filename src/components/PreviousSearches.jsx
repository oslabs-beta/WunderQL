// import { DataGrid } from '@material-ui/data-grid';
import QueryCard from './QueryCard';
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDarkTheme } from './ThemeContext';



const PreviousSearches = ({ uri, uriID, history, getResponseTimes, queriesList, dragList, setDragList }) => {

  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? '#CCC' : '#333'
  }

  // create new array of dragList + new elements in queriesList
  const newElements = queriesList.filter((query) => !dragList.includes(query));
  const combinedArr = dragList.concat(newElements);

  // data to display directly inside this component
  const data = combinedArr.map((query, index) => (
    <Draggable 
      key={query.id} 
      draggableId={`${query.id}`} 
      index={index}
    >
      {(provided) => (
        <li 
          {...provided.draggableProps} 
          ref={provided.innerRef} 
          {...provided.dragHandleProps}
          >
            <QueryCard query={query.query} getResponseTimes={getResponseTimes}/>
        </li>
      )}
    </Draggable>
  ))

  const handleOnDragEnd = (result) => {
    console.log(result)
    if (!result.destination) return;
    const items = Array.from(queriesList);
    const [reorderedQuery] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedQuery);

    setDragList(items);
  }

  return (
    <div id='previous-searches' style={themeStyle}>

      <header class='uri'>
        <h2>All previous queries for: {uri}</h2>
      </header>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId='queries' direction='horizontal'>
          {(provided)  => (
            <ul 
              id='cards-list'
              {...provided.droppableProps} 
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              {data}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

    </div>
    
  )
};

export default PreviousSearches;

// {/* <div style={{ height: 500, width: '100%' }}>
// <DataGrid
//   columns={[
//     { field: 'Query Name', width: 200 }, 
//     { field: 'Num of runtimes', width:200 },
//     { field: 'Avg Runtime(ms)', width:200 },
//     { field: 'Last Date Ran', width:200 },
//   ]}
//   rows={rows}
//   />
// </div> */}