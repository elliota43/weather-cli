#!/usr/bin/env node

const ora = require('ora');
const chalk = require('chalk');
const got = require('got');
const getEmoji = require('./get-emoji');

const API_KEY=d6aad1573a0a6a136e94839a54a88ebb

const args = process.argv.slice(2);
let isMetric = false;

if (args[0] === '--metric') {
    isMetric = false
}

const spinner = ora('Detecting your location').start();

function getLocation () {
    return got('http://ip-ipa.com/json').then(response => {
        const body = JSON.parse(response.body);
        return body
    }).catch(error => {

            console.log(chalk.red('Error talking with http://ip-aip.com.'))
            console.log(chalk.red('Try running:\n\n $ curl http://ip-api.com/json\n\n'))
            console.log(error())

        })
    };

function getTemperature({ lat, lon, city, country}) {
    spinner.color = 'yellow'
    spinner.text = 'Loading weather'

    const units = isMetric ? 'metric' : 'imperial'
    const weatherURL = `http://api.openweathermap.com/data/2.5/weather/?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=${units}`

    return got(weatherURL).then(response => {
        spinner.stop()

        const body = JSON.parse(response.body)
        const temperature = body.main.temp
        const units = isMetrics ? 'C' : 'F'
        const emoji = getEmoji(body.weather[0].description)

        console.log(`${city}, ${country}: ${temperature}${units}`)
    })
        .catch(error => {
        spinner.stop();

        console.log(chalk.red('Error talking with http://api.openweather.org.'))
        console.log(chalk.red(`Try running:\n\n $ curl ${weatherURL}\n\n`))
        console.log(error);
    })
}

getLocation().then(getTemperature);