import { Responsive, WidthProvider } from "react-grid-layout";
import React, { useState, useEffect } from "react";
import GridLayout from "react-grid-layout";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);


const Dashboard = ({charts, data}) => {
        // layout is an array of objects, see the demo for more complete usage
        const layouts = [
          { i: "a", x: 0, y: 0, w: 1, h: 2 },
          { i: "b", x: 1, y: 0, w: 3, h: 2 },
          { i: "c", x: 4, y: 0, w: 1, h: 2 }
        ];
        return (
            <ResponsiveGridLayout
                className="layout"
                autoSize={true}
                layouts={layouts}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            >
        
            <div key="a">{charts[0]}</div>
            <div key="b">{charts[1]}</div>
            <div key="c">{charts[2]}</div>
          </ResponsiveGridLayout>
        );
}
export default Dashboard;