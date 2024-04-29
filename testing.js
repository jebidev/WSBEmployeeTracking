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

    await page.goto('https://employerstracking.web.app/index.html')

    // click the sign-in button
    await page.click('#signinbutton')

    // student will provide email & password for signing in 
    await page.type("#login_email", "bucky@wisc.edu")
    await page.type("#login_password", 'bucky123')
    // admin will provide email & password for signing in 
    //await page.type("#login_email", "administration@wisc.edu")
    //await page.type("#login_password", 'administration')
    // // employer will provide email & password for signing in 
    // await page.type("#login_email", "boeing@boeing.com")
    // await page.type("#login_password", 'boeing')
    // // click the submit button
    await page.click('#modal_signin')
    
    // must dismiss dialog box for password to move on
    page.on('dialog', async dialog => {
        console.log(dialog.message());
        await dialog.dismiss()
    })

    // go to calendar
    await page.click("#calendarNavItem")

    // sign out
    await page.click('#signoutbutton')
    
    // close the browser
    //browser.close()
}

// call go()
go();