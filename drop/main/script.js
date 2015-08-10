(function() {
    var canvas = document.getElementById('canvas');
    var world = boxbox.createWorld(canvas, {gravity: {x: 0, y: 20}});
    var thisEntity;
    var previousEntity;
        
    var linkTemplate = {
        width: .4,
        height: 1,
        image: "parakeet chain.jpg",
        imageStretchToFit: true
    };
    var x;
    var y;
     
    
    function createRope(links, positionX) {
        console.log("Entered funtion");
        thisEntity = world.createEntity(linkTemplate, {x: positionX, y: 1, type: "static"});
        
        for (y = 0; y < links; y++) {
        
            previousEntity = thisEntity;
            thisEntity = world.createEntity(linkTemplate, {x: positionX, y: -y});
            
            world.createJoint(previousEntity, thisEntity, {
                type: "revolute",
                jointPositionOnEntity1: {x:0, y:-.25},
                jointPositionOnEntity2: {x:0, y:-.25}
            });
        
        }
        
        previousEntity = thisEntity;
        thisEntity = world.createEntity({
            x: positionX,
            y: -y,
            image: "parakeet toy.gif",
            imageOffsetX: -1.5,
            imageOffsetY: -.3,
            density: 5,
            width: 2,
            height: 2
        });
            
        world.createJoint(previousEntity, thisEntity, {
            type: "revolute"
        });    
    }

    
    
    window.drop = function(links, x) {
        console.log("Dropped");
        createRope(links, x);
        //thisEntity.applyImpulse(150, Number(Math.random() * 360));
    }
     
})();

