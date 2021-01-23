const http = require("http");

module.exports = (app) => {
    // ******************************************
    let config;          
    let subscriptions = [];
    let api_key;
    let api_key_2;

    let current_month;
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

            "api_key_2": {
                "type": "string",
                "title": "API Key NREL.gov"
            },
            
            "solarPanelParams" : {
                "title": "Paramètres panneaux solaires",
                "type": "object",
                "properties": {

                    "meanIlluminance": {
                        "type": "number",
                        "title": "Ensoleillement moyen journalier(kWh/m²/j)",
                        "default": 5.73874
                    },

                    "minIlluminance": {
                        "type": "number",
                        "title": "Ensoleillement minimum journalier(kWh/m²/j)",
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
                    "required": ["name"],
                    "properties": {
                        "name": {
                            "type": "string",
                            "title": "Nom",
                            "default": "Panneau solaire"
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
                "title": "Liste des piles à combustible",
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
            },

            "batteries": {
                "title": "Liste des batteries",
                "type": "array",
                "items": {
                    "type": "object",
                    "required": ["name"],
                    "properties": {
                        "name": {
                            "type": "string",
                            "title": "Nom",
                            "default": "Parc de batterie"
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
        api_key_2 = config.api_key_2;
        current_month = new Date().getMonth();

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
                                        path: "electrical.solar." + i + ".name",
                                        value: solarPanel.name
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

        if(config.batteries){
            config.batteries.forEach((battery, i) => {
                app.handleMessage(plugin.id, 
                    { 
                        updates: [
                            { 
                                values: [
                                    {
                                        path: "electrical.batteries." + i + ".name",
                                        value: battery.name
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
                            let infosWeatherTomorrow = await makeSynchronousWeatherRequest(positionTomorrow);
    
                            let solarProduceTomorrowHourly = computeSolarForecastProductionHourly(infosWeatherTomorrow); // en kWh
                            let windTurbineProduceTomorrowHourly = computeWindTurbineForecastProductionHourly(infosWeatherTomorrow); // en kWh

                            console.log("Production horaire J+1 des éoliennes: " + windTurbineProduceTomorrowHourly + " kWh");
                            console.log("Production horaire J+1 des panneaux solaires: " + solarProduceTomorrowHourly + " kWh");
        
                            app.handleMessage(plugin.id, 
                                {
                                    updates: [
                                        {
                                            values: [
                                                {
                                                    path: 'electrical.prev.solar.produceTomorrow.hourly',
                                                    value: solarProduceTomorrowHourly.map(solarProduceTomorrow => Number(solarProduceTomorrow).toFixed(2))
                                                }
                                            ]
                                        },
                                        {
                                            values: [
                                                {
                                                    path: 'electrical.prev.windTurbines.produceTomorrow.hourly',
                                                    value: windTurbineProduceTomorrowHourly.map(windTurbineProduceTomorrow => Number(windTurbineProduceTomorrow).toFixed(2))
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

    const computeSolarForecastProductionDaily = (infosWeather) => {
        let solarPanelSurface = config.solarPanelParams.solarPanelSurface;
        let solarPanelEfficiency = config.solarPanelParams.solarPanelEfficiency/100;

        let windSpeed = infosWeather.daily[0].wind_speed; // m/s
        let temp_ambiant = infosWeather.daily[0].temp.day - 273.15; // °C
        let G = ((100 - infosWeather.daily[0].clouds)/100*config.solarPanelParams.meanIlluminance + config.solarPanelParams.minIlluminance) * 1000; // Wh/m²/jour ou W/m²

        let U0 = 30.02;
        let U1 = 6.28;

        let T = temp_ambiant + G/(U0 + U1*windSpeed);

        let T_ = T - 25;
        let G_ = G/1000;

        let k = [-0.017237, -0.040465, -0.004702, 0.000149, 0.000170, 0.000005];

        let solarPanelLossCoeff = 1 + k[0]*Math.log(G_) + k[1]*Math.log(G_)*Math.log(G_) + k[2]*T_ + k[3]*T_*Math.log(G_) + k[4]*T_*Math.log(G_)*Math.log(G_) + k[5]*T_*T_;

        let P = solarPanelSurface * solarPanelEfficiency * G_ * solarPanelLossCoeff; // kWh/jour ou kW journalier
        return P;
    }

    const computeSolarForecastProductionHourly = (infosWeather) => {
        let solarPanelSurface = config.solarPanelParams.solarPanelSurface;
        let solarPanelEfficiency = config.solarPanelParams.solarPanelEfficiency/100;

        let windSpeedHourly = ((infosWeather.hourly).slice(24,48)).map(x => x.wind_speed); // m/s
        let T_ambiantHourly = ((infosWeather.hourly).slice(24,48)).map(x => x.temp - 273.15); // °C
        let G_Hourly = ((infosWeather.hourly).slice(24,48)).map(x => ((100-x.clouds)/100 * config.solarPanelParams.meanIlluminance + config.solarPanelParams.minIlluminance)*1000); // Wh/m²/jour ou W/m²

        let U0 = 30.02;
        let U1 = 6.28;

        let T_Hourly = [];
        for(let i=0; i<24; i++){
            T_Hourly.push(T_ambiantHourly[i] + G_Hourly[i]/(U0 + U1*windSpeedHourly[i]));
        }

        let T_Hourly_ = T_Hourly.map(t => t - 25);
        let G_Hourly_ = G_Hourly.map(g => g/1000);

        let k = [-0.017237, -0.040465, -0.004702, 0.000149, 0.000170, 0.000005];

        let solarPanelLossCoeff_Hourly = [];
        for(let i=0; i<24; i++){
            solarPanelLossCoeff_Hourly.push(1 + k[0]*Math.log(G_Hourly_[i]) + 
                                            k[1]*Math.log(G_Hourly_[i])*Math.log(G_Hourly_[i]) + 
                                            k[2]*T_Hourly_[i] + k[3]*T_Hourly_[i]*Math.log(G_Hourly_[i]) + 
                                            k[4]*T_Hourly_[i]*Math.log(G_Hourly_[i])*Math.log(G_Hourly_[i]) + 
                                            k[5]*T_Hourly_[i]*T_Hourly_[i]);
        }

        let P_Hourly = [];
        for(let i=0; i<24; i++){
            P_Hourly.push(solarPanelSurface * solarPanelEfficiency * G_Hourly_[i] * solarPanelLossCoeff_Hourly[i]); // kWh/jour ou kW journalier
        }

        return P_Hourly;
    }

    const computeWindTurbineForecastProductionDaily = (infosWeather) => {
        let betzLimit = 16/27;

        let bladeDiameter = config.windTurbineParams.windTurbineBladeDiameter;
        let windTurbineLoss = config.windTurbineParams.windTurbineLoss/100;
        let windTurbineNumber = 0;

        if(config.windTurbines)
            windTurbineNumber = config.windTurbines.length;

        let volumicMass = 1.23;

        let windSpeed = infosWeather.daily[0].wind_speed; // m/s

        let areaSwipped = 3.14 * (bladeDiameter/2) * (bladeDiameter/2);
        let kineticPower = 0.5 * volumicMass * windSpeed * windSpeed * windSpeed * areaSwipped * windTurbineNumber; // W

        return (kineticPower * windTurbineLoss * betzLimit * 24)/1000; // kWh/jour ou kW journalier
    }

    const computeWindTurbineForecastProductionHourly = (infosWeather) => {
        let betzLimit = 16/27;

        let bladeDiameter = config.windTurbineParams.windTurbineBladeDiameter;
        let windTurbineLoss = config.windTurbineParams.windTurbineLoss/100;
        let windTurbineNumber = 0;

        if(config.windTurbines)
            windTurbineNumber = config.windTurbines.length;

        let volumicMass = 1.23;

        let windSpeedHourly = ((infosWeather.hourly).slice(24,48)).map(x => x.wind_speed);

        let areaSwipped = 3.14 * (bladeDiameter/2) * (bladeDiameter/2);
        let kineticPowerHourly = windSpeedHourly.map(windSpeed => 0.5 * volumicMass * windSpeed * windSpeed * windSpeed * areaSwipped * windTurbineNumber); // W

        return kineticPowerHourly.map(kineticPower => (kineticPower * windTurbineLoss * betzLimit)/1000); // kWh
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

    async function makeSynchronousWeatherRequest(position) {
        try {
            let http_promise = getWeatherApiPromise(position);
            let response = await http_promise;
;
            //let irradiance_forecast = (100 - response.daily[0].clouds)/100*config.solarPanel.meanIlluminance + config.solarPanel.minIlluminance;
    
            return response;
        }
        catch(error) {
            // Promise rejected
            console.log(error);
        }
    }
    
    return plugin;
}
