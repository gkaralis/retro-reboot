(function ($) {

    // Matter.js module aliases
    var Engine = Matter.Engine,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Common = Matter.Common,
        Constraint = Matter.Constraint,
        Events = Matter.Events,
        Bounds = Matter.Bounds,
        Sprites = Matter.Sprites,
        Vector = Matter.Vector,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Query = Matter.Query;

    // create a Matter.js engine
    var engine = Engine.create(document.getElementById("canvas"), {
        timing: {timeScale:.2},
        render: {
            options: {
                wireframes: false,
                background: './img/background.png',
				width: 576,
				height: 480
            }
        }
    });
    var _engine = engine,
        _mouseConstraint,
        _sceneEvents = [];
    var _world = _engine.world;
    var width = 100;
    var height = 100;
    _mouseConstraint = MouseConstraint.create(_engine);

    World.add(_engine.world, _mouseConstraint);
    var _pagesettings = [
        
        // 1
        {
            boxes: [
                [336,192],
				[288,96],
				[96,96],
				[96, 192]
            ],
            position: [
                [48,48],
				[96,288],
				[432,96],
				[432,240]
            ],
            texture: [
                './img/title.png',
				'./img/Description288x96.png',
				'./img/Icon96x96.png',
				'./img/Date96x192.png'
            ]

        } ,

        // 2
        {
            boxes: [
                [192,192],
				[144,96],
				[192,96],
				[240, 192]
            ],
            position: [
                [48,96],
				[96,336],
				[288, 48],
				[288, 192]
            ],
            texture: [
                './img/Photo192x192.png',
				'./img/Graphic144x96.png',
				'./img/Name192x96.png',
				'./img/Description240x192.png'
            ]

        }/*,

        // 3
        {
            boxes: [
                [80,50],
                [20,10],
                [20,10],
                [20,10]
            ],
            position: [
                [50,30],
                [20,70],
                [50,70],
                [80,70]
            ],
            texture: [
                './img/owl.png',
                './img/owl.png',
				'./img/owl.png',
				'./img/owl.png'
            ]
        },

        // 4
        {
            boxes: [
                [80,50],
                [20,10],
                [20,10],
                [20,10]
            ],
            position: [
                [50,30],
                [20,70],
                [50,70],
                [80,70]
            ],
            texture: [
                './img/owl.png',
                './img/owl.png',
				'./img/owl.png',
				'./img/owl.png'
            ]
        },

        // 5
        {
            boxes: [
                [80,50],
                [20,10],
                [20,10],
                [20,10]
            ],
            position: [
                [50,30],
                [20,70],
                [50,70],
                [80,70]
            ],
            texture: [
                './img/owl.png',
                './img/owl.png',
				'./img/owl.png',
				'./img/owl.png'
            ]
        }
*/
    ]

    // create two boxes and a ground
    var pages = [];
    for (var i = 0; i< _pagesettings.length; i++) {
        var b = [];
        for(var bi = 0; bi < _pagesettings[i].boxes.length;bi++) {
            var s =  _pagesettings[i].boxes[bi];
            var p = _pagesettings[i].position[bi];
            var t = _pagesettings[i].texture[bi];
            s[0] = Math.round((s[0]*width)/100);
            s[1] = Math.round((s[1]*height)/100);
            b.push(Bodies.rectangle(
                Math.round(Math.random()*width*2)-width*(1-p[0]/100),
                Math.round(Math.random()*height*2)-height*(1-p[1]/100),
                s[0],
                s[1],
                {frictionAir: .1,
                 render: {
                    sprite: {
                        texture: t
                    }
                 }
             }));
        }
        _pagesettings[i].composite = Composite.create({bodies:b});
        _pagesettings[i].bodies = b;
        pages.push(_pagesettings[i].composite);
    }

    var constraints = [[],[],[]];
    // add all of the bodies to the world

    World.add(engine.world, pages);



    engine.world.gravity.x = 0;
    engine.world.gravity.y = 0;
    // run the engine
    Engine.run(engine);



    var currentConstraint;
    var currentPage;
    function focusObject (page,pagenum) {

        if(typeof currentPage === "object") {
            var consts = Composite.allConstraints(currentPage.composite);
            for (var i=0; i< consts.length; i++) {
                Composite.removeConstraint(currentPage.composite,consts[i]);
            }

        }
        var bodies = page.bodies;
        var composite = page.composite;
        for (var bindex = 0; bindex < bodies.length; bindex++) {
            var body = bodies[bindex];
            var bsize = page.boxes[bindex];
            var bpos = page.position[bindex].slice();
            bpos[0] = Math.round(bpos[0]);
            bpos[1] = Math.round(bpos[1]);
            var pos = {
                x1: bpos[0],
                x2: bpos[0] + bsize[0],
                y1: bpos[1],
                y2: bpos[1] + bsize[1]
            }
            Composite.addConstraint(composite,Constraint.create({
                pointA : {x:pos.x1,y:pos.y1},
                bodyB : body,
                pointB : Vector.rotate({x:-bsize[0]/2,y:-bsize[1]/2},body.angle),
                render: {visible: false},
                stiffness:.7
            }));
            Composite.addConstraint(composite,Constraint.create({
                pointA : {x:pos.x2,y:pos.y2},
                bodyB : body,
                pointB : Vector.rotate({x:bsize[0]/2,y:bsize[1]/2},body.angle),
                render: {visible: false},
                stiffness:.7
            }))
        }

        currentPage = page;
        //body.inertia = Infinity;
        //body.inverseInertia = 0;

        TweenMax.to(composite.constraints,1,{length:0,delay:0});
    }
    $('.menu a').each(function (i,k) {
        var page = _pagesettings[i];
        $(this).click(function () {
            focusObject(page,i);
        });

    });

	
})(jQuery);