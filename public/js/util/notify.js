define(
    [
        'notify'
    ]
    , function(){
    	return {
    		notify: function(title, message){
    			return notify.createNotification(title, {
                    icon: "/images/notify-icon.png",
                    body: message
                });
    		}
    	};
    }
);