const http = require("http");

module.exports = (app) => {
    // ******************************************
    let config;          
    let subscriptions = [];
    let api_key;
    let api_key_2;

    let current_month;

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
            
            "solarPanelParams" : {
                "title": "Paramètres panneaux solaires",
                "type": "object",
                "properties": {

                    "maxIrradiance": {
                        "type": "number",
                        "title": "Ensoleillement maximum par jour (kWh/m²/jour)",
                        "default": 5.73874
                    },

                    "minIrradiance": {
                        "type": "number",
                        "title": "Ensoleillement minimum par jour (kWh/m²/jour)",
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
                        "title": "Coefficient de perte (%)",
                        "default": 80
                    }
                }
            },

            "windTurbineParams": {
                "title": "Paramètres eolien",
                "type": "object",
                "properties": {
                    "windTurbineBladeDiameter": {
                        "type": "number",
                        "title": "Diamètre du rotor (m)",
                        "default": 1.15
                    },

                    "windTurbineLoss": {
                        "type": "number",
                        "title": "Coefficient de perte (%)",
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

        let localSubscriptions = {
            context: 'self',
            subscribe: [
                {
                    path: "navigation.tomorrow.position",
                    period: 1000
                },

                {
                    path: "navigation.position.*",
                    period: 1000
                }
            ]
        };
        
        app.subscriptionmanager.subscribe(
            localSubscriptions,
            subscriptions,
            subscriptionError => {
              app.error('Error:' + subscriptionError);
            },
            delta => {
                //console.log(JSON.stringify(delta));
                delta.updates.forEach(update => {

                    if(update.values[0].path == "navigation.tomorrow.position"){
                        let positionTomorrow = update.values[0].value;

                        // console.log("Position à J+1 : ");
                        // console.log(positionTomorrow);

                        if(Object.entries(positionTomorrow).length !== 0){

                            // anonymous async function to execute some code synchronously after http request
                            (async function () {
                                // wait to http request to finish
                                let infosWeatherTomorrow = await makeSynchronousWeatherRequest(positionTomorrow);
        
                                let solarProduceTomorrowHourly = computeSolarForecastProductionHourly(infosWeatherTomorrow); // en kWh
                                let windTurbineProduceTomorrowHourly = computeWindTurbineForecastProductionHourly(infosWeatherTomorrow); // en kWh

                                console.log("Production horaire J+1 des éoliennes: " + windTurbineProduceTomorrowHourly + " kWh");
                                console.log("Production horaire J+1 des panneaux solaires: " + solarProduceTomorrowHourly + " kWh");

                                let solarProdMeanTommorow = 0;
                                let windTurbineProdMeanTommorow = 0;

                                let k = 24 - new Date(infosWeatherTomorrow.hourly[0].dt * 1000).getUTCHours() - 1;

                                //Calcul de la production moyenne des panneaux solaires
                                for(let i=k; i<solarProduceTomorrowHourly.length; i++){
                                    solarProdMeanTommorow = solarProdMeanTommorow + solarProduceTomorrowHourly[i];
                                }

                                if(solarProduceTomorrowHourly.length - k != 0)
                                    solarProdMeanTommorow = solarProdMeanTommorow/(solarProduceTomorrowHourly.length - k);
                                
                                //Calcul de la production moyenne des éoliennes
                                for(let i=k; i<windTurbineProduceTomorrowHourly.length; i++){
                                    windTurbineProdMeanTommorow = windTurbineProdMeanTommorow + windTurbineProduceTomorrowHourly[i];
                                }

                                if(windTurbineProduceTomorrowHourly.length - k != 0)
                                    windTurbineProdMeanTommorow = windTurbineProdMeanTommorow/(windTurbineProduceTomorrowHourly.length - k);
            
                                app.handleMessage(plugin.id, 
                                    {
                                        updates: [
                                            {
                                                values: [
                                                    {
                                                        path: 'electrical.prev.solar.produceTomorrow.hourly',
                                                        value: solarProduceTomorrowHourly.map(solarProduceTomorrow => parseFloat(Number(solarProduceTomorrow).toFixed(6)))
                                                    }
                                                ]
                                            },
                                            {
                                                values: [
                                                    {
                                                        path: 'electrical.prev.windTurbines.produceTomorrow.hourly',
                                                        value: windTurbineProduceTomorrowHourly.map(windTurbineProduceTomorrow => parseFloat(Number(windTurbineProduceTomorrow).toFixed(6)))
                                                    }
                                                ]
                                            },
                                            {
                                                values: [
                                                    {
                                                        path: 'electrical.prev.solar.meanPowerTomorrow',
                                                        value: parseFloat(Number(solarProdMeanTommorow).toFixed(3))*1000
                                                    }
                                                ]
                                            },
                                            {
                                                values: [
                                                    {
                                                        path: 'electrical.prev.windTurbines.meanPowerTomorrow',
                                                        value: parseFloat(Number(windTurbineProdMeanTommorow).toFixed(3))*1000
                                                    }
                                                ]
                                            }
                                        ]});

                            })();
                        }
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

    const computeSolarForecastProductionHourly = (infosWeather) => {

        //Variables de la configuration
        let solarPanelSurface = config.solarPanelParams.solarPanelSurface;
        let solarPanelEfficiency = config.solarPanelParams.solarPanelEfficiency/100;
        let Gmax = config.solarPanelParams.maxIrradiance; // kWh/m²/jours
        let Gmin = config.solarPanelParams.minIrradiance; // kWh/m²/jours

        // Amplitude max de l'ensoleillement en fonction de la couverture du ciel
        let G_amplitude = (infosWeather.hourly).map(x => ((100 - x.clouds)/100*(Gmax-Gmin) + Gmin) * 1000); // Wh/m²/jour

        // Heure où l'ensoleillement est maximal
        let maxIrradianceHours = new Date(((infosWeather.current.sunset + infosWeather.current.sunrise)/2)*1000).getUTCHours();

        // Durée d'ensoleillement en heures
        let sunDurationHours = new Date((infosWeather.current.sunset - infosWeather.current.sunrise)*1000).getUTCHours();

        // Informations météo prévisionnelle horaire
        let windSpeedHourly = (infosWeather.hourly).map(x => x.wind_speed); // m/s
        let T_ambiantHourly = (infosWeather.hourly).map(x => x.temp - 273.15); // °C

        let G_Hourly = [];
        for(let i=0; i<(infosWeather.hourly).length; i++){
            let t = new Date(infosWeather.hourly[i].dt * 1000).getUTCHours();

            G_Hourly.push(G_amplitude[i] * Math.exp(-1/2*(t-maxIrradianceHours)*(t-maxIrradianceHours)/sunDurationHours));  // Wh/m²
        }

        let U0 = 30.02;
        let U1 = 6.28;

        let T_Hourly = [];
        for(let i=0; i<(infosWeather.hourly).length; i++){
            T_Hourly.push(T_ambiantHourly[i] + G_Hourly[i]/(U0 + U1*windSpeedHourly[i]));
        }

        let T_Hourly_ = T_Hourly.map(t => t - 25);
        let G_Hourly_ = G_Hourly.map(g => g/1000);

        let k = [-0.017237, -0.040465, -0.004702, 0.000149, 0.000170, 0.000005];

        let solarPanelLossCoeff_Hourly = [];
        for(let i=0; i<(infosWeather.hourly).length; i++){
            solarPanelLossCoeff_Hourly.push(1 + k[0]*Math.log(G_Hourly_[i]) + 
                                            k[1]*Math.log(G_Hourly_[i])*Math.log(G_Hourly_[i]) + 
                                            k[2]*T_Hourly_[i] + k[3]*T_Hourly_[i]*Math.log(G_Hourly_[i]) + 
                                            k[4]*T_Hourly_[i]*Math.log(G_Hourly_[i])*Math.log(G_Hourly_[i]) + 
                                            k[5]*T_Hourly_[i]*T_Hourly_[i]);
        }

        let P_Hourly = [];
        for(let i=0; i<(infosWeather.hourly).length; i++){
            P_Hourly.push((solarPanelSurface * solarPanelEfficiency * G_Hourly[i] * solarPanelLossCoeff_Hourly[i])/1000); // kWh horaire
        }

        return P_Hourly;
    }

    const computeWindTurbineForecastProductionHourly = (infosWeather) => {
        let betzLimit = 16/27;

        let bladeDiameter = config.windTurbineParams.windTurbineBladeDiameter;
        let windTurbineLoss = config.windTurbineParams.windTurbineLoss/100;
        let windTurbineNumber = 0;

        if(config.windTurbines)
            windTurbineNumber = config.windTurbines.length;

        let volumicMass = 1.23;

        let windSpeedHourly = (infosWeather.hourly).map(x => x.wind_speed);

        let areaSwipped = Math.PI * (bladeDiameter/2) * (bladeDiameter/2);
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
    
            return response;
        }
        catch(error) {
            // Promise rejected
            console.log(error);
        }
    }
    
    return plugin;
}
