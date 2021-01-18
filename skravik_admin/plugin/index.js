const http = require("http")

module.exports = (app) => {
    // ******************************************
    let config; // ** applied configuration settings          
    let subscriptions = [];
    let api_key;
    // ******** REQUIRED PLUGIN DEFINITION *******
    var plugin = {};
  
    plugin.id = 'skravik-admin-plugin';
    plugin.name = 'Skravik Admin';
    plugin.description = 'Configuration de Skravik';

    plugin.schema = {
        "title": "Configuration pour prédiction de la production de demain",
        "type": "object",
        "properties": {
            "api_key": {
                "type": "string",
                "title": "API Key OpenWeatherMap"
            }
        }
    };

    ///////////////////////////
    /// Démarrage du plugin ///
    ///////////////////////////
    plugin.start = function (options, restartPlugin) {
        app.debug('Plugin started');

        api_key = options.api_key;

        app.handleMessage(plugin.id, 
            { 
                updates: [
                    { 
                        values: [
                            {
                                path: 'position.tomorrow',
                                value: {}
                            }
                        ]
                    }
                ] 
            });

        let localSubscription = {
            context: 'self', // Get data for all contexts
            subscribe: [
                {
                    path: 'position.tomorrow',
                    period: 1000 //300000 <=> 300 secondes
                }
            ]
        };
        
        app.subscriptionmanager.subscribe(
            localSubscription,
            subscriptions,
            subscriptionError => {
              app.error('Error:' + subscriptionError);
            },
            delta => {
                delta.updates.forEach(update => {

                    let positionTomorrow = update.values[0].value;

                    console.log(positionTomorrow);

                    if(Object.entries(positionTomorrow).length !== 0){
                        let infosWeatherTomorrow = getWeather(positionTomorrow);
    
                        let solarMeanPowerTomorrow = computeSolarForecastProduction(infosWeatherTomorrow); // en W
                        let windTurbineMeanPowerTomorrow = computeWindTurbineForecastProduction(infosWeatherTomorrow); // en W
    
                        app.handleMessage(plugin.id, 
                            {
                                updates: [
                                    {
                                        values: [
                                            {
                                                path: 'electrical.solar.solarPanel.prev.meanPower',
                                                value: solarMeanPowerTomorrow
                                            }
                                        ]
                                    },
                                    {
                                        values: [
                                            {
                                                path: 'electrical.windTurbines.windTurbine.prev.meanPower',
                                                value: windTurbineMeanPowerTomorrow
                                            }
                                        ]
                                    }
                                ]
                            });
                    }
                });
            }
        );
    };
    
    plugin.stop = function () {
        // Here we put logic we need when the plugin stops
        subscriptions = [];
        app.debug('Plugin stopped');
        
    };

    plugin.registerWithRouter = function(router) {
        router.post('/api', (req, res) => {
            if (!Array.isArray(req.body)) {
                res.status(401);
                res.send({ error: true, message: `${plugin.id}: Invalid request data received!` });
            }
            else {
                processUIPost(req.body);
                res.status(200);
                res.send({ error: false, message: `${plugin.id}: OK` });
            }
        });

        return router;
    }

    // ** process posted data **
    const processUIPost = (data) => {
        if (!Array.isArray(data)) {
            server.debug("** ERROR: ** Invalid payload data!!");
            return;
        }

        app.handleMessage(plugin.id, 
            { 
                updates: [
                    { 
                        values: data 
                    }
                ] 
            });
    };

    // ** get weather information **
    const getWeather = (position) => {
            var temperature_forecast; // K
            var windSpeed_forecast; // m/s
            var illuminance_forecast; // pourcentage d'ensoleillement

            http.request(
                {
                    hostname: "api.openweathermap.org",
                    path: "/data/2.5/onecall?lat="+ position.latitude +"&lon="+ position.longitude +"&appid=" + api_key
                },
                    res => {
                        let data = ""

                        res.on("data", d => {
                            data += d
                        })

                        res.on("end", () => {
                            var response = JSON.parse(data);

                            //console.log(response);

                            temperature_forecast = response.daily[0].temp.day;
                            windSpeed_forecast = response.daily[0].wind_speed;
                            illuminance_forecast = 100 - response.daily[0].clouds;
                        })
                    }
            ).end()

            return [temperature_forecast, windSpeed_forecast, illuminance_forecast];
    };

    const computeSolarForecastProduction = (infosWeather) => {
        //TODO
        return 10;
    }

    const computeWindTurbineForecastProduction = (infosWeather) => {
        //TODO
        return 25;
    }
    
    return plugin;
}
