// src/app/api/fetchBFGPrice/route.ts
import puppeteer from 'puppeteer-core';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    });

    const page = await browser.newPage();
    const siteUrl = "https://betfury.com/staking";

    await page.goto(siteUrl, { waitUntil: "networkidle2" });

    const APYSelector = "#__nuxt > div > main > div.wrapper__inner > div > div > div.staking > div.staking__main > div.statistic.staking__chart > div.statistic__apy.label-apy > div > ul > li:nth-child(1) > span";
    await page.waitForSelector(APYSelector);

    const priceAPY = await page.$eval(APYSelector, (el) => el.textContent);

    if (!priceAPY) {
      throw new Error('APY not found');
    }

    await browser.close();

    return NextResponse.json({ priceAPY });
  } catch (err) {
    console.error('Error fetching APY:', err);
    return NextResponse.json({ error: 'Failed to fetch APY' }, { status: 500 });
  }
}
