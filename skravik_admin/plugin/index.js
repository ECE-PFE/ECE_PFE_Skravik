const http = require("http")

module.exports = (app) => {
    // ******************************************
    let config;          
    let subscriptions = [];
    let api_key;

    let path_positionTomorrow = "position.tomorrow";

    let consumerCategoryMap = {
        "Appareil de bord classique": "classique",
        "Appareil léger": "leger",
        "Appareil lourd": "lourd",
        "Générateur de chaleur": "generateur_chaleur",
        "Moteur électrique": "moteur_electrique"
    };

    // ******** REQUIRED PLUGIN DEFINITION *******
    let plugin = {};
  
    plugin.id = 'skravik-admin-plugin';
    plugin.name = 'Skravik Admin';
    plugin.description = 'Configuration du catamaran Skravik';
    plugin.schema = {
        "title" : "Configuration Skravik",
        "type": "object",
        "properties": {
            "api_key": {
                "type": "string",
                "title": "API Key OpenWeatherMap"
            },
            
            "solarPanel" : {
                "title": "Paramètres panneaux solaires",
                "type": "object",
                "properties": {

                    "meanIlluminance": {
                        "type": "number",
                        "title": "Ensoleillement moyen (kWh/m²/j)",
                        "default": 5.73874
                    },

                    "minIlluminance": {
                        "type": "number",
                        "title": "Ensoleillement minimum (kWh/m²/j)",
                        "default": 4.98
                    },

                    "solarPanelSurface": {
                        "type": "number",
                        "title": "Surface (m²)",
                        "default": 20
                    },

                    "solarPanelEfficiency": {
                        "type": "number",
                        "title": "Rendement (%)",
                        "default": 20
                    },

                    "solarPanelLossCoeff": {
                        "type": "number",
                        "title": "Perte (%)",
                        "default": 80
                    }
                }
            },

            "windTurbine": {
                "title": "Paramètre eoliens",
                "type": "object",
                "properties": {
                    "windTurbineNumber": {
                        "type": "number",
                        "title": "Nombre d'éoliens",
                        "default": 2
                    },

                    "windTurbineBladeDiameter": {
                        "type": "number",
                        "title": "Diamètre du rotor (m)",
                        "default": 1.15
                    },

                    "windTurbineLoss": {
                        "type": "number",
                        "title": "Perte (%)",
                        "default": 50
                    }
                }
            },

            "consumers": {
                "title": "Liste de consommateurs",
                "type": "array",
                "items": {
                    "type": "object",
                    "required": ["name", "categorie"],
                    "properties": {
                        "name": {
                            "type": "string",
                            "title": "Nom",
                            "default": "Consommateur"
                        },
                        "categorie": {
                            "type": "string",
                            "title": "Catégorie",
                            "enum":[
                                "Appareil de bord classique",
                                "Appareil léger",
                                "Appareil lourd",
                                "Générateur de chaleur",
                                "Moteur électrique"
                            ]
                        } 
                    }
                }
            }
        }
    };

    ///////////////////////////
    /// Démarrage du plugin ///
    ///////////////////////////
    plugin.start = function (options, restartPlugin) {

        config = options;
        api_key = config.api_key;

        console.log(config);

        app.handleMessage(plugin.id, 
            { 
                updates: [
                    { 
                        values: [
                            {
                                path: path_positionTomorrow,
                                value: {}
                            }
                        ]
                    }
                ] 
            });

        let i = 0;
        config.consumers.forEach(consumer => {
            app.handleMessage(plugin.id, 
                { 
                    updates: [
                        { 
                            values: [
                                {
                                    path: "electrical.consumers." + consumerCategoryMap[consumer.categorie] + "." + i + ".name",
                                    value: consumer.name
                                },
                                {
                                    path: "electrical.consumers." + consumerCategoryMap[consumer.categorie] + "." + i + ".power",
                                    value: 0
                                }
                            ]
                        }
                    ] 
                });

            i = i+1;
        });
        

        let localSubscription = {
            context: 'self', // Get data for all contexts
            subscribe: [
                {
                    path: path_positionTomorrow,
                    period: 1000
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

                    //console.log("Position à J+1 : ");
                    //console.log(positionTomorrow);

                    if(Object.entries(positionTomorrow).length !== 0){

                        // anonymous async function to execute some code synchronously after http request
                        (async function () {
                            // wait to http request to finish
                            let infosWeatherTomorrow = await makeSynchronousRequest(positionTomorrow);
    
                            let solarMeanPowerTomorrow = computeSolarForecastProduction(infosWeatherTomorrow); // en kWh/j
                            let windTurbineMeanPowerTomorrow = computeWindTurbineForecastProduction(infosWeatherTomorrow); // en kWh/j

                            //console.log("Puissance moyenne journalière des éoliennes: " + Number(windTurbineMeanPowerTomorrow).toFixed(2) + " kWh/j");
                            //console.log("Puissance moyenne journalière des panneaux solaires: " + Number(solarMeanPowerTomorrow).toFixed(2) + " kWh/j");
        
                            app.handleMessage(plugin.id, 
                                                        {
                                                            updates: [
                                                                {
                                                                    values: [
                                                                        {
                                                                            path: 'electrical.solar.solarPanel.prev.meanPower',
                                                                            value: Number(solarMeanPowerTomorrow).toFixed(2)
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    values: [
                                                                        {
                                                                            path: 'electrical.windTurbines.windTurbine.prev.meanPower',
                                                                            value: Number(windTurbineMeanPowerTomorrow).toFixed(2)
                                                                        }
                                                                    ]
                                                                }
                                                            ]});

                        })();
                    }
                });
            }
        );
    };

    ///////////////////////////
    ///   Arrêt du plugin   ///
    ///////////////////////////
    plugin.stop = function () {
        // Here we put logic we need when the plugin stops
        subscriptions = [];
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

    ///////////////////////////
    ///      Fonctions      ///
    ///////////////////////////

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

    const computeSolarForecastProduction = (infosWeather) => {
        let solarPanelSurface = config.solarPanel.solarPanelSurface;
        let solarPanelEfficiency = config.solarPanel.solarPanelEfficiency/100;
        let solarPanelLossCoeff = config.solarPanel.solarPanelLossCoeff/100;

        let solarPanelEnergyByDay = solarPanelSurface * solarPanelEfficiency * infosWeather[2] * solarPanelLossCoeff; // kWh/j
        return solarPanelEnergyByDay;
    }

    const computeWindTurbineForecastProduction = (infosWeather) => {
        let betzLimit = 16/27;

        let bladeDiameter = config.windTurbine.windTurbineBladeDiameter;
        let windTurbineLoss = config.windTurbine.windTurbineLoss/100;
        let windTurbineNumber = config.windTurbine.windTurbineNumber;

        let volumicMass = 1.23;

        let areaSwipped = 3.14 * (bladeDiameter/2) * (bladeDiameter/2);
        let kineticPower = 0.5 * volumicMass * infosWeather[1] * infosWeather[1] * infosWeather[1] * areaSwipped * windTurbineNumber; // W

        return (kineticPower * windTurbineLoss * betzLimit * 24)/1000; // en kWh par jour
    }

    // Get weather information
    function getWeatherApiPromise(position) {
        return new Promise((resolve, reject) => {
            http.get('http://api.openweathermap.org/data/2.5/onecall?lat=' + position.latitude + '&lon=' + position.longitude + '&appid=' + api_key, (response) => {
                let chunks_of_data = [];
    
                response.on('data', (fragments) => {
                    chunks_of_data.push(fragments);
                });
    
                response.on('end', () => {
                    let response_body = Buffer.concat(chunks_of_data);
                    resolve(JSON.parse(response_body.toString()));
                });
    
                response.on('error', (error) => {
                    reject(error);
                });
            });
        });
    }

    async function makeSynchronousRequest(position) {
        try {
            let http_promise = getWeatherApiPromise(position);
            let response = await http_promise;

            let temperature_forecast = response.daily[0].temp.day;
            let windSpeed_forecast = response.daily[0].wind_speed;
            let illuminance_forecast = (100 - response.daily[0].clouds)/100*config.solarPanel.meanIlluminance + config.solarPanel.minIlluminance;
    
            // holds response from server that is passed when Promise is resolved
            //console.log(response);
            return [temperature_forecast, windSpeed_forecast, illuminance_forecast];
        }
        catch(error) {
            // Promise rejected
            console.log(error);
        }
    }
    
    return plugin;
}
