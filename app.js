require('dotenv').config()
const express = require("express")
const app = express()
const https = require("https")
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

app.get("/", function(request, response){
    response.render('index',{ })
});

app.post("/", function(request, response){
    const country = request.body.cityName
    const apiKey = process.env.WEATHER_API
    const unit = "metric"
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + country + ",ph&appid=" + apiKey +  "&units=" + unit

    https.get(url, function(res){
        console.log(res.statusCode)
        
        res.on("data", function(data){
            const weatherData = JSON.parse(data)
            const weatherMain = weatherData.weather[0].main
            const weatherTemp = weatherData.main.temp
            const weatherDesc = weatherData.weather[0].description
            const icon = weatherData.weather[0].icon
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"

            response.render('forecast',{mainWeather: weatherMain, tempWeather: weatherTemp, imageURL: imageURL })
        });
    });
});




app.listen(3000, function(){
    console.log("Server is running!")
});

