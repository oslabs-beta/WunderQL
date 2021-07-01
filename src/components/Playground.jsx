// import { useQuery, gql } from '@apollo/client';

// const exampleQuery = gql`
//   query {
//     launchesPast(limit: 10) {
//       mission_name
//       launch_date_local
//       launch_site {
//         site_name_long
//       }
//     }
//   }
// `
const Playground = () => {

  // const t0 = performance.now();
  // const { data, loading, error } = useQuery(exampleQuery);
  // const t1 = performance.now();
  // //
  // const queryResposeTime = t1 - t0;
  // console.log('queryResponseTime!!', queryResposeTime)


  // if (loading) return <p>Loading...damnnn wait yo</p>
  // if (error) return <p>Error rip u</p>

  return (
    <div id='playground'>
      <h1>Loading...</h1>
      {/* {data.launchesPast.length > 0 && data.launchesPast.map(({mission_name, launch_date_local})=>{
        return(
          <div key={mission_name}>
            <p>{mission_name}</p>
            <p>{launch_date_local}</p>
          </div>
        )
      })} */}
    </div>
  )
};

export default Playground;