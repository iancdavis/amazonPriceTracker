const puppeteer = require('puppeteer')
const $ = require('cheerio')
const CronJob = require('cron').CronJob
//const nodemailer = require('nodemailer')

const url = 'https://www.amazon.com/Sony-WH-1000XM4-Canceling-Headphones-phone-call/dp/B0863TXGM3/'

async function configureBrowser() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    return page
}


async function checkPrice(page) {
    
    await page.reload()
    let html = await page.evaluate(() => document.body.innerHTML)
    //console.log(html)

    $('#priceblock_ourprice', html).each(function() {
        let dollarPrice = $(this).text()
        //console.log(dollarPrice)
        //remove dollar sign and convert text to number
        var currentPrice = Number(dollarPrice.replace(/[^0-9.-]+/g,""))

        if (currentPrice < 400) {
            console.log('BUY ' + currentPrice)
        }
    })
}

async function startTracking() {
    const page = await configureBrowser()

    let job = new CronJob('*/15 * * * * *', function () {
        checkPrice(page)
    }, null, true, null, null, true)
    job.start()
}

startTracking()


// async function monitor() {
//     let page = await configureBrowser()
//     await checkPrice(page)
// }

// monitor()