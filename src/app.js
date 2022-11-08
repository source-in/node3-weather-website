const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// console.log(__dirname)
// console.log(path.join(__dirname, '../public'))

const app = express()
const port = process.env.PORT || 3000

// Define Paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static diretory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Mike Ki'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Mike Ki'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpText: 'You will find help here!',
        name: 'Mike Ki'
    })
})

// app.get('/help', (req, res) => {
//     res.sendfile(publicDirectoryPath + '/help.html')
// })

// app.get('/about', (req, res) => {
//     res.sendfile(publicDirectoryPath + '/about.html')
// })

app.get('/weather', (req, res) => {
    const queryInput = req.query.address

    if (!queryInput) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(queryInput, (error, { latitude, longitude, location } = {} ) => {
        if (error) {
            return res.send({ error })
        }
        
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
        
            res.send({
                forecast: forecastData,
                location,
                address: queryInput
            })
            })
    })   
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMsg: 'Help article not found!'
    })
})

// Wildcard character means it will match with anything that hasn't been matched above.
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMsg: 'Page not found!'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port + '.')
})