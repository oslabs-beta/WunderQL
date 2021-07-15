// import { DataGrid } from '@material-ui/data-grid';
import QueryCard from './QueryCard';
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDarkTheme } from './ThemeContext';



const PreviousSearches = ({ uri, uriID, history, getResponseTimes, queriesList, setQueriesList }) => {

  // const [queriesList, setQueriesList] = useState(fakeData);

  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? '#CCC' : '#333'
  }

  // history prop is an array for a single quuery
  // the array contains objects for each time the query was ran
  // each object contains date and response time
  // for this component, we need an array of ALL queries for a SINGLE uri


  // const data = [];
  const data = queriesList.map((query, index) => (
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
  // const [data, setData] = useState([]);

  // call to database for all searches made on current API
  // useEffect(() => {
  //   fetch('/saved')
  //     .then(res => res.json())
  //     .then(queries => {
  //       queries.map((query, index) => (
  //         data.push({
  //           id: index,
  //           'Query Name': query.name,
  //           'Num of runtimes': query.numRuntimes,
  //           'Avg Runtime(ms)': query.avgRuntime,
  //           'Last Date Ran': query.lastDateRan
  //         })
  //       ))
  //     })
  // })


  const handleOnDragEnd = (result) => {
    console.log(result)
    if (!result.destination) return;
    const items = Array.from(queriesList);
    const [reorderedQuery] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedQuery);

    setQueriesList(items);
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