import React from 'react'
import './Dashboard.css';
import Box from './Boxs';
import Chart from './chart';
import Recap from './Recap';
import PostHeader from './PostHeader';


const Content_dashboard = () => {
  return (
    <div className="container-fluid">
    {/*  <!-- Page Heading --> */}
      <PostHeader/>

      {/*  <!-- Content Row --> */}
      <Recap/>

      {/*  <!-- Content Row --> */}
      {/* <Chart/> */}

      {/*   <!-- Content Row --> */}
      <Box/>
    </div>


  )
}

export default Content_dashboard