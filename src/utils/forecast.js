const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=d947c340733f4a81b51631ff1641f91f&query=' + latitude + ',' + longitude 

    request({ url, json: true}, (error, { body } = {} ) => {
        if (error) {
            callback('Unable to connect to weather sevice!', undefined)
        } else if (body.error) {
            callback('Unable to find location.', undefined)
        } else {
            callback(undefined, body.current.weather_descriptions[0] + '. The current temperature is ' + body.current.temperature + ' degrees out. It feels like ' + body.current.feelslike + ' degrees. The humidity is ' + body.current.wind_speed + '. Current Time is ' + body.current.observation_time + '.')   
        }
    })
}

module.exports = forecast