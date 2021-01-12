const puppeteer = require('puppeteer')
const $ = require('cheerio')
const CronJob = require('cron').CronJob
const nodemailer = require('nodemailer')

const url = 'https://www.amazon.com/Sony-WH-1000XM4-Canceling-Headphones-phone-call/dp/B0863TXGM3/'

