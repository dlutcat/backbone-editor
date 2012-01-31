// Model
var Shape = Backbone.Model.extend({

    defaults: { x: 50, y: 50, width: 150, height: 150, color: 'black' },

    setTopLeft: function(x, y) {
        this.set({ x: x, y: y });
    },

    setDim: function(w, h) {
        this.set({ width: w, height: h });
    }
});

var Document = Backbone.Collection.extend({ model: Shape });

var ShapeView = Backbone.View.extend({
    initialize: function() {
        this.model.bind('change', this.updateView, this);
    },
    render: function() {
        $('#page').append(this.el);
        $(this.el).html('<div class="shape"/>'
                      + '<div class="control delete hide"/>'
                      + '<div class="control change-color hide"/>'
                      + '<div class="control resize hide"/>' )
                  .css({ position: 'absolute', padding: '10px' });

        this.updateView();
        return this;
                    
    },
    updateView: function() {
        console.log(this, this.el);
        $(this.el).css({
            left:       this.model.get('x'),
            top:        this.model.get('y'),
            width:      this.model.get('width') - 10,
            height:     this.model.get('height') - 10,
            background:  this.model.get('color')
        });
    },
    events: {
        'mousemove'           : 'mousemove',
        'mouseup'             : 'mouseup',
        'mouseenter .shape'   : 'hoveringStart',
        'mouseleave'          : 'hoveringEnd',
        'mousedown .shape'    : 'draggingStart',
        'mousedown .resize'   : 'resizingStart',
        'mousedown .change-color' : 'changeColor',
        'mousedown .delete'   : 'deleting'
    },
    hoveringStart: function() {
        this.$('.control').removeClass('hide');
    },
    hoveringEnd: function() {
        this.$('.control').addClass('hide');
    },
    draggingStart: function(e) {
        this.dragging = true;
        this.initialX = e.pageX - this.model.get('x');
        this.initialY = e.pageY - this.model.get('y');
        return false; // prevents default behavior
    },
    resizingStart: function() {
        this.resizing = true;
        return false; // prevents default behavior
    },
    changeColor: function() {
        this.model.set({ color: prompt('Enter color value', this.model.get('color')) });
    },
    deleting: function() {
        this.remove();
    },
    mouseup: function() {
        this.dragging = this.resizing = false;
    },
    mousemove: function(e) {
        if(this.dragging) {
            this.model.setTopLeft(e.pageX - this.initialX, e.pageY - this.initialY);
        }
        else if (this.resizing) {
            this.model.setDim(e.pageX - this.model.get('x'), e.pageY - this.model.get('y'));
        }
    }

});

// document view
var DocumentView = Backbone.View.extend({
    id: 'page',
    views: {},
    initialize: function() {
        this.collection.bind('add', this.added, this);
        this.collection.bind('remove', this.removed, this);
    },
    render: function() {
        return this;
    },
    added: function(m) {
        this.views[m.cid] = new ShapeView({
            model: m,
            id: 'view_' + m.cid
        }).render();
    },
    removed: function() {
        this.views[m.cid].remove();
        delete this.views[m.cid];
    }
});



//
// Main
//

//var shape = new Shape();
$(function() {

    /*
    var dragging = false,
        $page    = $('#page'),
        $shape   = $page.find('.shape'),
        doc      = new Document();
        

    shape.bind('change', function() {
        $shape.css({
            left:       shape.get('x'),
            top:        shape.get('y'),
            width:      shape.get('width'),
            height:     shape.get('height'),
            background:  shape.get('color')
        });
    });

    $shape.mousedown(function(e) {
        dragging = true;
        shape.set({ color: 'gray' });
    });

    $page
        .mouseup(function(e) {
            dragging = false;
            shape.set({ color: 'black' });
        })
        .mousemove(function(e) {
            if(dragging) {
                shape.setTopLeft(e.pageX, e.pageY);
            }
        });

    doc.bind('add', function(model) { console.log('model added'); })
    doc.bind('remove', function(model) { console.log('model removed'); })

    doc.add(shape);
    doc.remove(shape);
    //shape.bind('change:width', function() { console.log('width changed! ', shape.get('width')); });

    shape.setTopLeft(10, 10);
    */

    var doc = new Document();
    var docView = new DocumentView({ collection: doc });
    docView.render();

    $('#new-shape').click(function() {
        doc.add(new Shape());
    });
});
