module.exports = (app) => {
    // ******************************************
    let config; // ** applied configuration settings          
    let subscriptions = [];
    // ******** REQUIRED PLUGIN DEFINITION *******
    var plugin = {};
  
    plugin.id = 'skravik-sim-plugin';
    plugin.name = 'Skravik Simulator';
    plugin.description = 'Simule la production et la consommation en kW';

    plugin.start = function (options, restartPlugin) {
        // Here we put our plugin logic
        app.debug('Plugin started');
      };
    
    plugin.stop = function () {
        // Here we put logic we need when the plugin stops
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
            server.debug(`** ERROR: ** Invalid payload data!!`);
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
    
    plugin.schema = {
        // The plugin schema
    };
    
    return plugin;
}
