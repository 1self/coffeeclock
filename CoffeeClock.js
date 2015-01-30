if (Meteor.isClient) {
   var config = {
        appId: "app-id-3523b31ffea8c247e313d5aabd94c680",
        appSecret: "app-secret-6ca07684b6f60bde0d7088206de50e753a07cc67bbca24641673f232ecec049d",
        "appName": "CoffeeClock",
        "appVersion": "0.0.1"
    };

    var lib1self = new Lib1self(config, Meteor.settings.public.env1self);


    Meteor.startup(function () {
        var isStreamRegistered = function () {
            return window.localStorage.streamId !== undefined;
        };

        var storeStreamDetails = function (stream) {
            window.localStorage.streamId = stream.streamid;
            window.localStorage.readToken = stream.readToken;
            window.localStorage.writeToken = stream.writeToken;
        };

        if (!isStreamRegistered()) {
            console.info("registering stream.");
            lib1self.registerStream(function (err, stream) {
                storeStreamDetails(stream);
            });
        }
    });

    Template.logging.events({
        'click #logActivity': function () {
            var coffeeInput = $("input[name='coffee']");
            var coffeeEvent = {
                "source": config.appName,
                "version": config.appVersion,
                "objectTags": ["caffeine", "coffee"],
                "actionTags": ["drink"],
                "properties": {
                    "ml": parseInt(coffeeInput.val())
                }
            };
            
            lib1self.sendEvent(coffeeEvent, window.localStorage.streamId, window.localStorage.writeToken, function(){});
            coffeeInput.val("");
            console.log("Event sent:");
            console.log(coffeeEvent);
        }
    });

    Template.footer.events({
        'click #displayLogActivityTemplate': function () {
            $(".logActivityTemplate").show();
            $(".showVizTemplate").hide();
        },
        'click #displaySelectVizTemplate': function () {
            $(".showVizTemplate").show();
            $(".logActivityTemplate").hide();
        }
    });

    
    Template.selectVisualizations.events({
        'click #coffeeViz': function () {
            var url = lib1self.visualize(window.localStorage.streamId, window.localStorage.readToken)
                .objectTags(["caffeine", "coffee"])
                .actionTags(["drink"])
                .sum("ml")
                .barChart()
                .backgroundColor("84c341")
                .url();
            console.info(url);
            $(".logActivityTemplate").hide();
            window.open(url, "_system", "location=no");
        }
    });

}


