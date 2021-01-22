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

    let solarPanelTechMap = {
        "Crystalline silicon": "cSi",
        "CIGS": "cis",
        "Cadmium Telluride": "cdTe"
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
            
            "solarPanelParams" : {
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

            "windTurbineParams": {
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
                    "required": ["name", "category"],
                    "properties": {
                        "name": {
                            "type": "string",
                            "title": "Nom",
                            "default": "Consommateur"
                        },
                        "category": {
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
            },

            "solarPanels": {
                "title": "Liste des panneaux solaires",
                "type": "array",
                "items": {
                    "type": "object",
                    "required": ["name", "technology"],
                    "properties": {
                        "name": {
                            "type": "string",
                            "title": "Nom",
                            "default": "Panneau solaire"
                        },
                        "technology": {
                            "type": "string",
                            "title": "Technologie",
                            "enum":[
                                "Crystalline silicon",
                                "CIGS",
                                "Cadmium Telluride"
                            ]
                        } 
                    }
                }
            },

            "windTurbines": {
                "title": "Liste des éoliennes",
                "type": "array",
                "items": {
                    "type": "object",
                    "required": ["name"],
                    "properties": {
                        "name": {
                            "type": "string",
                            "title": "Nom",
                            "default": "Eolien"
                        }
                    }
                }
            },

            "waterTurbines": {
                "title": "Liste des hydroliennes",
                "type": "array",
                "items": {
                    "type": "object",
                    "required": ["name"],
                    "properties": {
                        "name": {
                            "type": "string",
                            "title": "Nom",
                            "default": "Hydrolienne"
                        }
                    }
                }
            },

            "alternators": {
                "title": "Liste des alternateurs",
                "type": "array",
                "items": {
                    "type": "object",
                    "required": ["name"],
                    "properties": {
                        "name": {
                            "type": "string",
                            "title": "Nom",
                            "default": "Alternateur"
                        }
                    }
                }
            },

            "generators": {
                "title": "Liste des générateurs",
                "type": "array",
                "items": {
                    "type": "object",
                    "required": ["name"],
                    "properties": {
                        "name": {
                            "type": "string",
                            "title": "Nom",
                            "default": "Générateur"
                        }
                    }
                }
            },

            "fuelCells": {
                "title": "Liste des pile à combustible",
                "type": "array",
                "items": {
                    "type": "object",
                    "required": ["name"],
                    "properties": {
                        "name": {
                            "type": "string",
                            "title": "Nom",
                            "default": "Pile à combustible"
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

        
        if(config.consumers){
            config.consumers.forEach((consumer, i) => {
                app.handleMessage(plugin.id, 
                    { 
                        updates: [
                            { 
                                values: [
                                    {
                                        path: "electrical.consumers." + i + ".name",
                                        value: consumer.name
                                    },
                                    {
                                        path: "electrical.consumers." + i + ".category",
                                        value: consumerCategoryMap[consumer.category]
                                    }
                                ]
                            }
                        ] 
                    });
            });
        }

        if(config.solarPanels){
            config.solarPanels.forEach((solarPanel, i) => {
                app.handleMessage(plugin.id, 
                    { 
                        updates: [
                            { 
                                values: [
                                    {
                                        path: "electrical.solarPanels." + i + ".name",
                                        value: solarPanel.name
                                    },
                                    {
                                        path: "electrical.solarPanels." + i + ".technology",
                                        value: solarPanelTechMap[solarPanel.technology]
                                    }
                                ]
                            }
                        ] 
                    });
            });
        }

        if(config.windTurbines){
            config.windTurbines.forEach((windTurbine, i) => {
                app.handleMessage(plugin.id, 
                    { 
                        updates: [
                            { 
                                values: [
                                    {
                                        path: "electrical.windTurbines." + i + ".name",
                                        value: windTurbine.name
                                    }
                                ]
                            }
                        ] 
                    });
            });
        }

        if(config.waterTurbines){
            config.waterTurbines.forEach((waterTurbine, i) => {
                app.handleMessage(plugin.id, 
                    { 
                        updates: [
                            { 
                                values: [
                                    {
                                        path: "electrical.waterTurbines." + i + ".name",
                                        value: waterTurbine.name
                                    }
                                ]
                            }
                        ] 
                    });
            });
        }

        if(config.alternators){
            config.alternators.forEach((alternator, i) => {
                app.handleMessage(plugin.id, 
                    { 
                        updates: [
                            { 
                                values: [
                                    {
                                        path: "electrical.alternators." + i + ".name",
                                        value: alternator.name
                                    }
                                ]
                            }
                        ] 
                    });
            });
        }

        if(config.generators){
            config.generators.forEach((generator, i) => {
                app.handleMessage(plugin.id, 
                    { 
                        updates: [
                            { 
                                values: [
                                    {
                                        path: "electrical.generators." + i + ".name",
                                        value: generator.name
                                    }
                                ]
                            }
                        ] 
                    });
            });
        }

        if(config.fuelCells){
            config.fuelCells.forEach((fuelCell, i) => {
                app.handleMessage(plugin.id, 
                    { 
                        updates: [
                            { 
                                values: [
                                    {
                                        path: "electrical.fuelCells." + i + ".name",
                                        value: fuelCell.name
                                    }
                                ]
                            }
                        ] 
                    });
            });
        }
        

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
        let solarPanelSurface = config.solarPanelParams.solarPanelSurface;
        let solarPanelEfficiency = config.solarPanelParams.solarPanelEfficiency/100;
        let solarPanelLossCoeff = config.solarPanelParams.solarPanelLossCoeff/100;

        let solarPanelEnergyByDay = solarPanelSurface * solarPanelEfficiency * infosWeather[2] * solarPanelLossCoeff; // kWh/j
        return solarPanelEnergyByDay;
    }

    const computeWindTurbineForecastProduction = (infosWeather) => {
        let betzLimit = 16/27;

        let bladeDiameter = config.windTurbineParams.windTurbineBladeDiameter;
        let windTurbineLoss = config.windTurbineParams.windTurbineLoss/100;
        let windTurbineNumber = config.windTurbineParams.windTurbineNumber;

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
