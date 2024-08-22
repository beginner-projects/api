'use client'

import { useState, useEffect } from 'react';

interface BFGPriceData {
  price: number;
  myTokenBuyPrice: string;
  myTokenSellPrice: string;
}

// interface APYData {
//   apy: number;
// }

export default function Home() {
  const [bfgPriceData, setBfgPriceData] = useState<BFGPriceData | null>(null);
  // const [apyData, setApyData] = useState<APYData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBFGPrice = async () => {
      try {
        const response = await fetch('/api/fetchBFGPrice');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: BFGPriceData = await response.json();
        setBfgPriceData(data);
      } catch (error) {
        console.error('Failed to fetch BFG price:', error);
        setError('Failed to fetch BFG price');
      }
    };

    // const fetchAPY = async () => {
    //   try {
    //     const response = await fetch('/api/fetchAPY');

    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }

    //     const data: APYData = await response.json();
    //     setApyData(data);
    //   } catch (error) {
    //     console.error('Failed to fetch APY:', error);
    //     setError('Failed to fetch APY');
    //   }
    // };

    fetchBFGPrice();
    // fetchAPY();

    const intervalId = setInterval(() => {
      fetchBFGPrice();
      // fetchAPY();
    }, 15000); // Fetch every 15 seconds

    return () => clearInterval(intervalId);
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!bfgPriceData) {
    return <div className='flex justify-center items-center mt-11'>Loading...</div>;
  }

  return (
    <div className='mt-11'>
      <h1 className='flex justify-center font-semibold'>HODL $RamiCoin, Earn Bitcoin</h1>
      <div className='flex justify-center m-5 gap-5 font-light'>
        <div>
          <p>Current Price</p>
          <p>Buy Price</p>
          <p>Sell Price</p>
        </div>
        <div>
          <p>:</p>
          <p>:</p>
          <p>:</p>
        </div>
        <div>
          <p>${bfgPriceData.price}</p>
          <p>${bfgPriceData.myTokenBuyPrice}</p>
          <p>${bfgPriceData.myTokenSellPrice}</p>
        </div>
      </div>
    </div>
  );
}


