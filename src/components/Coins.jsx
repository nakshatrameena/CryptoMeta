
import React, { useState, useEffect } from 'react';
import { Baseurl } from './baseUrl';
import Loader from './Loader';
import axios from 'axios';
import Header from './Header';
import { Link } from 'react-router-dom';
import './Res.css';

const Coins = () => {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  const [currency, setCurrency] = useState('usd');
  const [search, setSearch] = useState('');

  const currencySymbol = currency === 'inr' ? '₹' : '$';

  useEffect(() => {
    const getCoinsData = async () => {
      setLoading(true);

      try {
        const { data } = await axios.get(
          `${Baseurl}/coins/markets?vs_currency=${currency}`
        );

        setCoins(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching coins:', error);
        setCoins([]);
      } finally {
        setLoading(false);
      }
    };

    getCoinsData();
  }, [currency]);

  const filteredCoins = coins.filter((coin) =>
    coin.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header />

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search Your Coins"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="btns">
            <button onClick={() => setCurrency('inr')}>INR</button>
            <button onClick={() => setCurrency('usd')}>USD</button>
          </div>

          {filteredCoins.map((coindata, i) => (
            <CoinCard
              key={coindata.id}
              coindata={coindata}
              id={coindata.id}
              i={i}
              currencySymbol={currencySymbol}
            />
          ))}

          {filteredCoins.length === 0 && (
            <p>No coins found.</p>
          )}
        </>
      )}
    </>
  );
};

const CoinCard = ({ coindata, currencySymbol, id }) => {
  const priceChange = coindata.price_change_percentage_24h;

  const hasPriceChange =
    typeof priceChange === 'number' &&
    Number.isFinite(priceChange);

  const profit = hasPriceChange && priceChange > 0;

  return (
    <Link
      to={`/coins/${id}`}
      style={{ color: 'white', textDecoration: 'none' }}
    >
      <div className="ex-cards">
        <div className="image">
          <img height="80px" src={coindata.image} alt={coindata.name} />
        </div>

        <div className="name">
          {coindata.name}
        </div>

        <div className="price">
          {currencySymbol}{' '}
          {typeof coindata.current_price === 'number'
            ? coindata.current_price.toFixed(0)
            : 'N/A'}
        </div>

        <div
          className="rank"
          style={{
            color: !hasPriceChange
              ? 'gray'
              : profit
              ? 'green'
              : priceChange < 0
              ? 'red'
              : 'gray',
          }}
        >
          {hasPriceChange
            ? `${priceChange > 0 ? '+' : ''}${priceChange.toFixed(2)}%`
            : 'N/A'}
        </div>
      </div>
    </Link>
  );
};

export default Coins;
