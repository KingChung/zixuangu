define(
    [
        'notify',
        'swfobject'
    ]
    , function(){
    	return {
    		notify: function(title, message){
                var id = +new Date() + 'sound';
                var $sound = $("<div>").attr('id', id);
                $('body').append($sound);
                var swfVersionStr = "9.0.0";
                // To use express install, set to playerProductInstall.swf, otherwise the empty string. 
                var xiSwfUrlStr = "playerProductInstall.swf";
                swfobject.embedSWF(
                    'sound/notification.swf', id, 
                    "0", "0", 
                    swfVersionStr, xiSwfUrlStr, {}, {}, {locked: 1});
                swfobject.createCSS('#' + id, "display:block;");

                setTimeout(function(){
                    $sound.remove();
                }, 2e3);

    			return notify.createNotification(title, {
                    icon: "/images/notify-icon.png",
                    body: message
                });
    		}
    	};
    }
);