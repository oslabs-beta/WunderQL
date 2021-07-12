import { useHistory } from "react-router";
import { useEffect } from "react";

const QueryCard = ({ id, query, history, getResponseTimes }) => {

  let routerHistory = useHistory();
  
  // somehow get the history from the initial call in App.js and pass to PreviousSearches and then to QueryCard
  // use that specific history and pass in to each card when opened
  useEffect(() => {

  });

  const openCard = () => {
    routerHistory.push(
      '/testquery', 
      { 
        queryProp: query, 
        // singleHistory: singleHistory 
      }
    );
  };

  return (
    <div id='card' onClick={openCard}>
      {query}
    </div>
  )
}

export default QueryCard;