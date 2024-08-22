import React,{useState, useEffect} from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import { Tables } from "@/pages/dashboard/tables";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard, StockSentimentCard } from "@/widgets/cards";
import { StatisticsChart, GaugeMeter } from "@/widgets/charts";
import {
  statisticsCardsData,
  statisticsChartsSocial,
  statisticsChartsNews,
  pieCharts,
  topNews,
  topPosts
} from "@/data";
import {
  Sidenav,
  SearchCard
} from "@/widgets/layout";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";

export function Home() {
  const [chartNewsData, setChartNewsData] = useState(null);
  const [chartSocialData, setChartSocialData] = useState(null);
  const [pieCharts, setPieCharts] = useState(null);
  const [gaugeData, setGaugeData] = useState(null);
  const [topNews, setTopNews] = useState(null);
  const [topPosts, setTopPosts] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabSelect = (index) => {
    setTabIndex(index);
  };


  return (
    <div className="mt-12">
      <div className="mb-12 flex justify-center items-center gap-x-4">
        <SearchCard setNewsData={setChartNewsData} setSocialData={setChartSocialData} setGaugeData={setGaugeData} setPieCharts={setPieCharts} setTopNews={setTopNews} setTopPosts={setTopPosts}/>
      </div>
      <Tabs selectedIndex={tabIndex} onSelect={handleTabSelect}>
        <TabList>
          <Tab>Stock Price Synergy</Tab>
          <Tab>News</Tab>
          <Tab>Social Media</Tab>
        </TabList>

        <TabPanel>
        
           <GaugeMeter values={gaugeData}/> 
          <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-2">
          {pieCharts && pieCharts.map((props) => (
              <StatisticsChart
                key={props.title}
                {...props}
              />
            ))}
             </div>
        </TabPanel>

        <TabPanel>
          <div className="md:w-100">
            <h1 className="text-3xl text-black-600 font-bold my-4">News</h1>
            <div className="mb-6 grid grid-cols-2 gap-4">
              {chartNewsData && chartNewsData.map((props) => (
                <StatisticsChart
                  key={props.title}
                  {...props}
                  footer={
                    <Typography
                      variant="small"
                      className="flex items-center font-normal text-blue-gray-600"
                    >
                      <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                      &nbsp;{props.footer}
                    </Typography>
                  }
                />

              ))}
              
            </div>
            <Tables topData={topNews} tabIndex={tabIndex} />
          </div>
        </TabPanel>

        <TabPanel>
          <div className="md:w-100">
            <h1 className="text-3xl text-black-600 font-bold my-4">Social Media</h1>
            <div className="mb-6 grid grid-cols-2 gap-4 ">
            {chartSocialData && chartSocialData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
            </div>
            <Tables topData={topPosts} tabIndex={tabIndex}/>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default Home;