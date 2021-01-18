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

    plugin.start = function (options, restartPlugin) {
        // Here we put our plugin logic
        app.debug('Plugin started');

        api_key = options.api_key;

        let localSubscription = {
            context: 'self', // Get data for all contexts
            subscribe: [
                {
                    path: 'position.tomorrow',
                    period: 300000 // 300 secondes
                }
            ]
        };
        
        app.subscriptionmanager.subscribe(
            localSubscription,
            subscribtions,
            subscriptionError => {
              app.error('Error:' + subscriptionError);
            },
            delta => {
              delta.updates.forEach(u => {
                    app.debug(u);

                    let positionTomorrow = u.values[0].value;

                    let infosWeatherTomorrow = getWeather(positionTomorrow);

                    computeSolarForecastProduction(infosWeatherTomorrow); // en Wh
                    computeWindTurbineForecastProduction(infosWeatherTomorrow); // en Wh
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

            var Http = new XMLHttpRequest();

            xmlHttp.onreadystatechange = function() { 
                if (Http.readyState == 4 && Http.status == 200)
                {
                    var response = JSON.parse(Http.responseText)
                    temperature_forecast = response.daily[0].temp.day;
                    windSpeed_forecast = response.daily[0].wind_speed;
                    illuminance_forecast = 100 - response.daily[0].clouds;
                }
            }

            Http.open("GET", "https://api.openweathermap.org/data/2.5/onecall?lat="+ position.lattitude +"&lon="+ position.longitude +"&appid=" + api_key, true);
            return [temperature_forecast, windSpeed_forecast, illuminance_forecast];
    };
    
    return plugin;
}
