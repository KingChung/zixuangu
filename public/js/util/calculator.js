define(
    [
        'util/notify'
    ]
    , function(Notify){
    	return {
    		calculate: function(points, options){
                points = _.map(points || [], function(p){
                    return parseFloat(p.price);
                });

                if(points.length) {
                    var p1 = points[0], p2 = points[1], p3 = points[2], p4 = points[3], p5 = points[4], p6 = points[5];

                    //先降后升
                    if(
                        p1 > p2
                        && p3 > p2
                        && p3 && ((p4-p3) / p3) > 0.005
                        && p4 && ((p5-p4) / p4) > 0.005
                        && p5 && ((p6-p5) / p6) > 0.005
                    ) {
                        console.log('alert', p1, p2, p3, p4, p5, p6)
                    }

                    //先升后降
                    if(
                        p1 < p2
                        && p3 < p2
                        && p3 && ((p3-p4) / p3) > 0.005
                        && p4 && ((p4-p5) / p4) > 0.005
                        && p5 && ((p5-p6) / p6) > 0.005
                    ) {
                        console.log('alert', p1, p2, p3, p4, p5, p6)
                    }
                }
    		}
    	};
    }
);