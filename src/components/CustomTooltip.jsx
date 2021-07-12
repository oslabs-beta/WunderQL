const CustomTooltip = ({ payload, history, date }) => {
  // console.log('date: ', date)
  console.log('history: ', history)
  console.log('payload: ', payload)
  if (payload) {
    // console.log('payload[0]: ', payload[0])
    // console.log('payload[0]: ', payload[0].payload.date)

  }
  return <div>payload</div>
  // return <div>{payload.payload}</div>
  // return <div>{payload}</div>
}

export default CustomTooltip;