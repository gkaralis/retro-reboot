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
    var engine = Engine.create(document.body, {
        timing: {timeScale:.2},
        render: {
            options: {
                wireframes: false,
                background: 'http://brm.io/matter-js-demo/img/wall-bg.jpg'
            }
        }
    });
    var _engine = engine,
        _mouseConstraint,
        _sceneEvents = [];
    var _world = _engine.world;
    var width = 600;
    var height = 450;
    _mouseConstraint = MouseConstraint.create(_engine);

    World.add(_engine.world, _mouseConstraint);
    var _pagesettings = [
        
        // 1
        {
            boxes: [
                [80,60]
            ],
            position: [
                [50,50]
            ],
            texture: [
                'http://brm.io/matter-js-demo/img/box.png'
            ]

        },

        // 2
        {
            boxes: [
                [80,60]
            ],
            position: [
                [50,50]
            ],
            texture: [
                'http://brm.io/matter-js-demo/img/box.png'
            ]

        },

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
                'http://brm.io/matter-js-demo/img/box.png',
                'http://brm.io/matter-js-demo/img/box.png',
                'http://brm.io/matter-js-demo/img/box.png',
                'http://brm.io/matter-js-demo/img/box.png'
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
                'http://brm.io/matter-js-demo/img/box.png',
                'http://brm.io/matter-js-demo/img/box.png',
                'http://brm.io/matter-js-demo/img/box.png',
                'http://brm.io/matter-js-demo/img/box.png'
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
                'http://brm.io/matter-js-demo/img/box.png',
                'http://brm.io/matter-js-demo/img/box.png',
                'http://brm.io/matter-js-demo/img/box.png',
                'http://brm.io/matter-js-demo/img/box.png'
            ]
        }

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
                {frictionAir: .2,
                 render: {
                    sprite: {
                        texture: t,
                        xScale: s[0]/100,
                        yScale: s[1]/100
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
            bpos[0] = Math.round((bpos[0]*width)/100);
            bpos[1] = Math.round((bpos[1]*height)/100);
            var pos = {
                x1: bpos[0] - bsize[0]/2,
                x2: bpos[0] + bsize[0]/2,
                y1: bpos[1] - bsize[1]/2,
                y2: bpos[1] + bsize[1]/2
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
    //var scene = new THREE.Scene();
    //var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    //
    //var renderer = new THREE.WebGLRenderer();
    //renderer.setSize( window.innerWidth, window.innerHeight );
    //document.body.appendChild( renderer.domElement );
    //
    //
    //var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    //var material = [new THREE.MeshBasicMaterial( { color: 0x00ff00 } ),new THREE.MeshBasicMaterial( { color: 0x0000ff }),new THREE.MeshBasicMaterial( { color: 0xff0000 } )];
    //var cubes = [new THREE.Mesh( geometry, material[0] ),new THREE.Mesh( geometry, material[1] ),new THREE.Mesh( geometry, material[2] )];
    //
    //for (var i = 0; i<cubes.length;i++) {
    //    scene.add( cubes[i] );
    //}
    //
    //cubes[1].position.x = 2;
    //cubes[1].rotation.z = 1;
    //cubes[2].position.y = 2;
    //
    //camera.position.z = 10;
    //
    //function render() {
    //    requestAnimationFrame( render );
    //    cubes[0].rotation.x += 0.1;
    //    cubes[0].rotation.y += 0.1;
    //    renderer.render( scene, camera );
    //}
    //render();
})(jQuery);