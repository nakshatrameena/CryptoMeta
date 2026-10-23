
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Baseurl } from './baseUrl';
import { useParams } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Loader from './Loader';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CoinChart = ({ currency }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [days, setDays] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const fetchCoinChartData = async () => {
      setLoading(true);

      try {
        const { data } = await axios.get(
          `${Baseurl}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`
        );

        if (isMounted) {
          setChartData(data.prices || []);
        }
      } catch (error) {
        console.error('Error fetching coin chart data:', error);
        console.error("API Error:", error.message);
        console.error("Request URL:", error.config?.url);
        console.error("HTTP Status:", error.response?.status);
        console.error("Response Data:", error.response?.data);
        console.error("Message:", error.message);
        console.error("URL:", error.config?.url);
        console.error("Status:", error.response?.status);
        console.error("Details:", error.response?.data);

        if (isMounted) {
          setChartData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCoinChartData();

    return () => {
      isMounted = false;
    };
  }, [currency, id, days]);

  const myData = {
    labels: chartData.map((value) => {
      const date = new Date(value[0]);

      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');

      const time =
        hours > 12
          ? `${hours - 12}:${minutes} PM`
          : hours === 12
          ? `12:${minutes} PM`
          : hours === 0
          ? `12:${minutes} AM`
          : `${hours}:${minutes} AM`;

      return days === 1 ? time : date.toLocaleDateString();
    }),

    datasets: [
      {
        label: `Price in Past ${days} Days (${currency})`,
        data: chartData.map((value) => value[1]),
        borderColor: 'yellow',
        borderWidth: 3,
      },
    ],
  };

  if (loading) {
    return <Loader />;
  }

  if (chartData.length === 0) {
    return <p>Unable to load chart data. Please try again later.</p>;
  }

  return (
    <div>
      <Line
        data={myData}
        options={{
          responsive: true,
          elements: {
            point: {
              radius: 1,
            },
          },
        }}
        style={{ marginTop: '5rem', width: '60rem' }}
      />

      <div className="btn" style={{ marginTop: '30px' }}>
        <button onClick={() => setDays(1)}>24 hours</button>
        <button onClick={() => setDays(30)}>1 Month</button>
        <button onClick={() => setDays(365)}>1 Year</button>
      </div>
    </div>
  );
};

export default CoinChart;
