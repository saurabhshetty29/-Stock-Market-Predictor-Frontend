import { Typography, Select, Option } from "@material-tailwind/react";
import { useState, useRef } from "react";
import { fetchChartData } from "@/api/fetchData";
import { fetchSuggestions } from "@/api/fetchSuggestions";
import { useCombobox } from 'downshift';

export function SearchCard({ setNewsData, setSocialData, setGaugeData , setPieCharts , setTopNews, setTopPosts}) {
  const [isFocused, setIsFocused] = useState(false);
  const [stockTicker, setStockTicker] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getToggleButtonProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    items: suggestions,
    onInputValueChange: ({ inputValue }) => {
      // Fetch suggestions from your API
      fetchSuggestions(inputValue).then(setSuggestions);
    },
    onSelectedItemChange: ({ selectedItem }) => {
      setStockTicker(selectedItem ? selectedItem.Symbol : '');
    },
    itemToString: (item) => (item ? item.Symbol : ''),
  });


  const handleSearchChange = (e) => {
    setStockTicker(e.target.value);

    // Fetch suggestions from your API
    fetchSuggestions(e.target.value).then(setSuggestions);
  };

  const calculateStartDate = (timePeriod) => {
    const today = new Date();
    let startDate;
  
    switch (timePeriod) {
      case "week":
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        break;
      case "twoWeeks":
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);
        break;
      case "month":
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        break;
      default:
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    }
  
    return startDate.toISOString().slice(0, 10);
  };
  
  const fetchData = (stockTicker, startDate) => {
    const today = new Date().toISOString().slice(0, 10);
    fetchChartData(stockTicker, startDate, today).then((data) => {
      setNewsData(data.newsCharts);
      setSocialData(data.socialCharts);
      setGaugeData(data.gaugeChart);
      setPieCharts(data.pieCharts);
      setTopNews(data.topNews);
      setTopPosts(data.topPosts);
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const startDate = calculateStartDate(timePeriod);
    fetchData(stockTicker, startDate);
  };

  return (
    <div className="flex items-center justify-center">
    <form className="flex items-center space-x-2" onSubmit={handleSubmit}>
      <div {...getToggleButtonProps()}>
        <input 
          {...getInputProps({
            onFocus: () => setIsFocused(true),
            onBlur: () => setIsFocused(false),
          })}
          type="search" 
          id="stock-search" 
          className="p-2 border border-gray-300 rounded w-96" 
          placeholder="Search Stocks, Companies..." 
          required 
        />
        <ul {...getMenuProps()}>
            {isOpen
              ? suggestions.slice(0,10).map((item, index) => (
                  <li
                    {...getItemProps({
                      key: index, // Use index as a key
                      index,
                      item,
                      style: {
                        backgroundColor:
                          highlightedIndex === index ? 'lightgray' : 'white',
                        fontWeight: selectedItem === item ? 'bold' : 'normal',
                      },
                    })}
                  >
                    {item.Security} - {item.Symbol}
                  </li>
                ))
              : null}
          </ul>
      </div>

        <div className="mr-4">
          <select 
            name="timeSelect"
            label="Select Time" 
            required 
            className="w-full px-3 py-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline" 
            value={timePeriod}
            onChange={e => setTimePeriod(e.target.value)}
          > 
            <option value="week">Week</option>
            <option value="twoWeeks">Two Weeks</option>
            <option value="month">Month</option>
          </select>
        </div>
  
        <button type="submit" className="p-2 mt-2 bg-indigo-700 text-white rounded">Search</button>
      </form>
    </div>
  );
}