suite('Stage', function() {

    // ======================================================
    test('instantiate stage with id', function() {
      var container = document.createElement('div');
      container.id = 'container';

      kineticContainer.appendChild(container);

      var stage = new Kinetic.Stage({
          container: 'container',
          width: 578,
          height: 200
      });

      assert.equal(stage.getContent().className, 'kineticjs-content');
      assert.equal(stage.getContent().getAttribute('role'), 'presentation');


    });

    // ======================================================
    test('test stage buffer canvas and hit buffer canvas', function() {
      var container = document.createElement('div');
      container.id = 'container';

      kineticContainer.appendChild(container);

      // simulate pixelRatio = 2
      Kinetic.pixelRatio = 2;

      var stage = new Kinetic.Stage({
          container: 'container',
          width: 578,
          height: 200
      });


      assert.equal(stage.bufferCanvas.getPixelRatio(), 1);
      assert.equal(stage.bufferHitCanvas.getPixelRatio(), 2);

      // reset
      Kinetic.pixelRatio = 1;
    });

    // ======================================================
    test('instantiate stage with dom element', function() {
      var container = document.createElement('div');

      kineticContainer.appendChild(container);

      var stage = new Kinetic.Stage({
          container: container,
          width: 578,
          height: 200
      });
    });

    // ======================================================
    test('stage instantiation should clear container', function() {
        var container = document.createElement('div');
        var dummy = document.createElement('p');
        
        container.appendChild(dummy);
        kineticContainer.appendChild(container);

        var stage = new Kinetic.Stage({
            container: container,
            width: 578,
            height: 200
        });

        assert.equal(container.getElementsByTagName('p').length, 0, 'container should have no p tags');
    });

    // ======================================================
    test('set stage size', function() {
        var stage = addStage();

        var layer = new Kinetic.Layer();

        var circle = new Kinetic.Circle({
            x: stage.getWidth() / 2,
            y: stage.getHeight() / 2,
            radius: 70,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 4,
            name: 'myCircle'
        });

        assert.equal(stage.getSize().width, 578);
        assert.equal(stage.getSize().height, 200);
        stage.setSize(1, 2);
        assert.equal(stage.getSize().width, 1);
        assert.equal(stage.getSize().height, 2);
        stage.setSize(3);
        assert.equal(stage.getSize().width, 3);
        assert.equal(stage.getSize().height, 3);
        stage.setSize({
            width: 4,
            height: 5
        });
        assert.equal(stage.getSize().width, 4);
        assert.equal(stage.getSize().height, 5);
        stage.setSize({
            width: 6
        });
        assert.equal(stage.getSize().width, 6);
        assert.equal(stage.getSize().height, 5);
        stage.setSize({
            height: 7
        });
        assert.equal(stage.getSize().width, 6);
        assert.equal(stage.getSize().height, 7);
        stage.setSize([8, 9]);
        assert.equal(stage.getSize().width, 8);
        assert.equal(stage.getSize().height, 9);
        stage.setSize([1, 1, 10, 11]);
        assert.equal(stage.getSize().width, 10);
        assert.equal(stage.getSize().height, 11);

        layer.add(circle);
        stage.add(layer);

        stage.setSize(333, 155);

        assert.equal(stage.getSize().width, 333);
        assert.equal(stage.getSize().height, 155);
        assert.equal(stage.getContent().style.width, '333px');
        assert.equal(stage.getContent().style.height, '155px');
        assert.equal(layer.getCanvas()._canvas.width, 333);
        assert.equal(layer.getCanvas()._canvas.height, 155);
    });

    // ======================================================
    test('get stage DOM', function() {
        var stage = addStage();

        assert.equal(stage.getContent().className, 'kineticjs-content');
    });

    // ======================================================
    test('stage getAllIntersections()', function() {
        var stage = addStage();
        var layer = new Kinetic.Layer();

        var redCircle = new Kinetic.Circle({
            x: 380,
            y: stage.getHeight() / 2,
            radius: 70,
            strokeWidth: 4,
            fill: 'red',
            stroke: 'black',
            id: 'redCircle'
        });

        var greenCircle = new Kinetic.Circle({
            x: 300,
            y: stage.getHeight() / 2,
            radius: 70,
            strokeWidth: 4,
            fill: 'green',
            stroke: 'black',
            id: 'greenCircle'
        });

        layer.add(redCircle);
        layer.add(greenCircle);
        stage.add(layer);

        assert.equal(stage.getIntersection(300, 100).shape.getId(), 'greenCircle', 'shape should be greenCircle');
        assert.equal(stage.getIntersection(380, 100).shape.getId(), 'redCircle', 'shape should be redCircle');
        assert.equal(stage.getIntersection(100, 100).shape, null, 'shape should be null');


    });

    // ======================================================
    test('test getAllIntersections', function() {
        var stage = addStage();
        var layer = new Kinetic.Layer();

        var redCircle = new Kinetic.Circle({
            x: 380,
            y: stage.getHeight() / 2,
            radius: 70,
            strokeWidth: 4,
            fill: 'red',
            stroke: 'black',
            id: 'redCircle'
        });

        var greenCircle = new Kinetic.Circle({
            x: 300,
            y: stage.getHeight() / 2,
            radius: 70,
            strokeWidth: 4,
            fill: 'green',
            stroke: 'black',
            id: 'greenCircle'
        });

        layer.add(redCircle);
        layer.add(greenCircle);
        stage.add(layer);

        // test individual shapes
        assert.equal(stage.getAllIntersections(266, 114).length, 1, '17) getAllIntersections should return one shape');
        assert.equal(stage.getAllIntersections(266, 114)[0].getId(), 'greenCircle', '19) first intersection should be greenCircle');

        assert.equal(stage.getAllIntersections(414, 115).length, 1, '18) getAllIntersections should return one shape');
        assert.equal(stage.getAllIntersections(414, 115)[0].getId(), 'redCircle', '20) first intersection should be redCircle');

        assert.equal(stage.getAllIntersections(350, 118).length, 2, '1) getAllIntersections should return two shapes');
        assert.equal(stage.getAllIntersections(350, 118)[0].getId(), 'redCircle', '2) first intersection should be redCircle');
        assert.equal(stage.getAllIntersections(350, 118)[1].getId(), 'greenCircle', '3) second intersection should be greenCircle');

        // hide green circle.  make sure only red circle is in result set
        greenCircle.hide();
        layer.draw();

        assert.equal(stage.getAllIntersections(350, 118).length, 1, '4) getAllIntersections should return one shape');
        assert.equal(stage.getAllIntersections(350, 118)[0].getId(), 'redCircle', '5) first intersection should be redCircle');

        // show green circle again.  make sure both circles are in result set
        greenCircle.show();
        layer.draw();

        assert.equal(stage.getAllIntersections(350, 118).length, 2, '6) getAllIntersections should return two shapes');
        assert.equal(stage.getAllIntersections(350, 118)[0].getId(), 'redCircle', '7) first intersection should be redCircle');
        assert.equal(stage.getAllIntersections(350, 118)[1].getId(), 'greenCircle', '8) second intersection should be greenCircle');

        // hide red circle.  make sure only green circle is in result set
        redCircle.hide();
        layer.draw();

        assert.equal(stage.getAllIntersections(350, 118).length, 1, '9) getAllIntersections should return one shape');
        assert.equal(stage.getAllIntersections(350, 118)[0].getId(), 'greenCircle', '10) first intersection should be greenCircle');

        // show red circle again.  make sure both circles are in result set
        redCircle.show();
        layer.draw();

        assert.equal(stage.getAllIntersections(350, 118).length, 2, '11) getAllIntersections should return two shapes');
        assert.equal(stage.getAllIntersections(350, 118)[0].getId(), 'redCircle', '12) first intersection should be redCircle');
        assert.equal(stage.getAllIntersections(350, 118)[1].getId(), 'greenCircle', '13) second intersection should be greenCircle');

        // test from layer
        assert.equal(layer.getAllIntersections(350, 118).length, 2, '14) getAllIntersections should return two shapes');
        assert.equal(layer.getAllIntersections(350, 118)[0].getId(), 'redCircle', '15) first intersection should be redCircle');
        assert.equal(layer.getAllIntersections(350, 118)[1].getId(), 'greenCircle', '16) second intersection should be greenCircle');

    });

    // ======================================================
    test('scale stage after add layer', function() {
        var stage = addStage();
        var layer = new Kinetic.Layer();
        var circle = new Kinetic.Circle({
            x: stage.getWidth() / 2,
            y: stage.getHeight() / 2,
            radius: 70,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 4
        });

        layer.add(circle);
        stage.add(layer);

        stage.setScale(0.5);

        assert.equal(stage.getScale().x, 0.5, 'stage scale x should be 0.5');
        assert.equal(stage.getScale().y, 0.5, 'stage scale y should be 0.5');
        stage.draw();
    });

    // ======================================================
    test('scale stage before add shape', function() {
        var stage = addStage();
        var layer = new Kinetic.Layer();
        var circle = new Kinetic.Circle({
            x: stage.getWidth() / 2,
            y: stage.getHeight() / 2,
            radius: 70,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 4
        });

        stage.setScale(0.5);

        assert.equal(stage.getScale().x, 0.5, 'stage scale x should be 0.5');
        assert.equal(stage.getScale().y, 0.5, 'stage scale y should be 0.5');

        layer.add(circle);
        stage.add(layer);
    });

    // ======================================================
    test('remove stage', function() {
        var stage = addStage();
        var layer = new Kinetic.Layer();
        var circle = new Kinetic.Circle({
            x: stage.getWidth() / 2,
            y: stage.getHeight() / 2,
            radius: 70,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 4
        });

        layer.add(circle);
        stage.add(layer);

        // remove should have no effect, and should cause no JS error
        stage.remove();


    });

    // ======================================================
    test('destroy stage', function() {
        var container = document.createElement('div');

        kineticContainer.appendChild(container);

        var stage = new Kinetic.Stage({
            container: container,
            width: 578,
            height: 200,
            id: 'stageFalconId',
            name: 'stageFalconName'
        });

        var layer = new Kinetic.Layer();
        var circle = new Kinetic.Circle({
            x: stage.getWidth() / 2,
            y: stage.getHeight() / 2,
            radius: 70,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 4,
            id: 'circleFalconId',
            name: 'circleFalconName'
        });

        layer.add(circle);
        stage.add(layer);

        assert.equal(Kinetic.ids.stageFalconId._id, stage._id, 'stage id should be in global ids map');
        assert.equal(Kinetic.names.stageFalconName[0]._id, stage._id, 'stage name should be in global names map');
        assert.equal(Kinetic.ids.circleFalconId._id, circle._id, 'circle id should be in global ids map');
        assert.equal(Kinetic.names.circleFalconName[0]._id, circle._id, 'circle name should be in global names map');

        stage.destroy();

        assert.equal(Kinetic.ids.stageFalconId, undefined, 'stage should no longer be in ids map');
        assert.equal(Kinetic.names.stageFalconName, undefined, 'stage should no longer be in names map');
        assert.equal(Kinetic.ids.circleFalconId, undefined, 'circle should no longer be in ids map');
        assert.equal(Kinetic.names.circleFalconName, undefined, 'circle should no longer be in names map');


    });

    // ======================================================
    test('scale stage with no shapes', function() {
        var stage = addStage();

        var layer = new Kinetic.Layer();

        stage.add(layer);
        stage.setScale(0.5);

        stage.draw();
    });

    // ======================================================
    test('test stage.getStage()', function() {
        var stage = addStage();

        assert.notEqual(stage.getStage(), undefined);

        //console.log(stage.getStage());
    });
});