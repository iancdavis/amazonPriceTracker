const puppeteer = require('puppeteer')
const $ = require('cheerio')
const CronJob = require('cron').CronJob
const nodemailer = require('nodemailer')

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
            sendNotification(currentPrice)
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

async function sendNotification(price) {
    
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '*@gmail.com',
            pass: '*'
        }
    })

    let textToSend = 'Price Dropped to ' + price
    let htmlText = `<a href=\"${url}\">Link</a>`

    let info = await transporter.sendMail({
        form: '"Price Tracker" <hugebigdog79@gmail.com>',
        to: "*@gmail.com",
        subject: 'Price dropped to ' + price,
        text: textToSend,
        html: htmlText
    })

    console.log("Message sent: %s", info.messageId)
}

startTracking()


// async function monitor() {
//     let page = await configureBrowser()
//     await checkPrice(page)
// }

// monitor()