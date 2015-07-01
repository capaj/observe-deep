var expect = require('chai').expect;

var observeDeep = require('../observe-deep');

describe('deepObserve', function() {
  var observed;
  var nested;

  function observer(changesTriggered) {
    changes.push(changesTriggered);
  }

  var changes;
  var deliver;

  beforeEach(function() {
    nested = {};
    observed = {nested: nested};
    changes = [];
    deliver = observeDeep(observed, observer);
  });

  it('should throw when cyclic object is detected', function() {
    //TODO implement
  });

  it("should be able to watch simple object and it's values same as regular Object.observe, deliver function should be returned", function(done) {

    observed.a = 1;
    observed.a = 2;
    delete observed.a;
    setTimeout(function() {
      expect(changes.length).to.equal(1);
    }, 1);

    setTimeout(function() {
      observed.b = 0;
    }, 4);

    setTimeout(function() {
      expect(changes.length).to.equal(2);
      expect(changes[0].length).to.equal(3);
      expect(changes[0][0].type).to.equal('add');
      done();
    }, 10);

  });

  it('should watch an object assigned to the root object and stop watching it when it is deleted', function(done) {

    var another = {};
    observed.a = another;

    setTimeout(function() {
      another.propOnAnother = 'value on another';
      observed.b = 0;
    }, 1);

    setTimeout(function() {
      expect(changes.length).to.equal(3);
      expect(changes[0].length).to.equal(1);
      expect(changes[0][0].type).to.equal('add');
      console.log("willDelete");
      delete observed.a;

    }, 10);

    setTimeout(function() {
      another.c = 1;  //should not trigger a change, because another has been deleted from observed
    }, 12);

    setTimeout(function() {
      console.log("changes", changes);
      expect(changes.length).to.equal(4);
      done();
    }, 15)

  });

  it('should stop watching a nested object when it is overwritten with another one', function(done) {
    var another = {};
    observed.nested = another;
    setTimeout(function() {
      nested.a = 3;
      setTimeout(function() {
        expect(changes.length).to.equal(1);
        done();
      });
    });
  });

  it('should allow one object to be observed separately as part of two trees', function() {

  });

  it('should still observe/unobserve when one object is assigned on two different properties', function(done) {
    observed.nestedSecond = nested;
    setTimeout(function() {
      nested.a = 3;
      setTimeout(function() {
        expect(changes.length).to.equal(2);

        setTimeout(function(){
        	delete observed.nested;
          setTimeout(function(){
          	nested.b = 4;
            setTimeout(function(){
              expect(changes.length).to.equal(4);
              done();
            });
          });
        });
      });
    });
  });

});