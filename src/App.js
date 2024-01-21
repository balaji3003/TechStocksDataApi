import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS



const App = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockDetails, setStockDetails] = useState(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('https://api.iex.cloud/v1/data/core/stock_collection/sector?collectionName=Technology&token=pk_4348fb2cef714bb5a1abeba2f387916d');
        setStocks(response.data);
        if (response.data.length >= 4) {
          const fourthStock = response.data[3].symbol;
          setSelectedStock(fourthStock);
          fetchStockDetails(fourthStock);
        }
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    };

    fetchStocks();
  }, []);

  useEffect(() => {
    if (selectedStock) {
      fetchStockDetails(selectedStock);
    }
  }, [selectedStock]);

  const fetchStockDetails = async (symbol) => {
    try {
      const response = await axios.get(`https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=pk_4348fb2cef714bb5a1abeba2f387916d`);
      setStockDetails(response.data);
    } catch (error) {
      console.error('Error fetching stock details:', error);
    }
  };

  const handleStockChange = (event) => {
    setSelectedStock(event.target.value);
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="container mt-5">
      <h1 className="text-primary">Technology Sector Stocks</h1>
      <select className="form-select my-3" onChange={handleStockChange} value={selectedStock}>
        {stocks.map(stock => (
          <option key={stock.symbol} value={stock.symbol}>{stock.companyName}</option>
        ))}
      </select>

      {stockDetails && (
        <div>
          <h2 className="text-secondary">Stock Details</h2>
          <table className="table table-striped">
            <thead className="table-primary">
              <tr>
                <th>Property</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stockDetails).map(([key, value]) => (
                key && value && (
                  <tr key={key}>
                    <td>{capitalize(key)}</td>
                    <td>{value}</td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
