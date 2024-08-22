// src/app/api/fetchBFGPrice/route.ts
import { NextResponse } from 'next/server';

let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require('chrome-aws-lambda');
  puppeteer = require('puppeteer-core');
} else {
  puppeteer = require('puppeteer');
}

export async function GET() {
  let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, '--hide-scrollbars', '--disable-web-security'],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }

  try {
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto('https://coinmarketcap.com/currencies/betfury/');
    
    const priceSelector = '#section-coin-overview > div.sc-65e7f566-0.DDohe.flexStart.alignBaseline > span';
    await page.waitForSelector(priceSelector);
    const priceText = await page.$eval(priceSelector, el => el.textContent);
    const price = parseFloat(priceText.replace(/[^0-9.-]/g, ''));

    if (isNaN(price)) {
      throw new Error('Price conversion error');
    }

    const myTokenBuyPrice = (price + price * 0.05).toFixed(5);
    const myTokenSellPrice = (price - price * 0.05).toFixed(5);

    await browser.close();

    return NextResponse.json({ price, myTokenBuyPrice, myTokenSellPrice });
  } catch (err) {
    console.error('Error fetching BFG price:', err);
    return NextResponse.json({ error: 'Failed to fetch BFG price' }, { status: 500 });
  }
}
