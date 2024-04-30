// import puppeteer
const puppeteer = require("puppeteer");
const fs = require("fs/promises");

async function go() {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50
    })

    const page = await browser.newPage()

    // visit the site to be tested

    await page.goto('https://employerstracking.web.app/index.html#')

    // no login because navigation which crash puppeteer (reloads)

    // go to calendar
    await page.click("#calendarNavItem")

    // go back home
    await page.click("#Home2")

    //page reload once
    await page.click('#submitFilter')

    //return walmart event
    await page.type('#filterForm > div:nth-child(2) > div > input', 'test')
    await page.click('#officeHourCheckbox')
    await page.click('#submitFilter')
    
    // close the browser
    browser.close()
}

// call go()
go();