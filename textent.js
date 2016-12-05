var Node = basis.require('basis.ui').Node;
var Value = basis.require('basis.data').Value;
var Dataset = basis.require('basis.data').Dataset;
var DataObject = basis.require('basis.data').Object;
var Selection = basis.require('basis.dom.wrapper').Selection;
var Selection = basis.dom.wrapper.Selection;


//var selection = new Selection({ multiple: true });
//var view = new Node();

let namespace = 'textent';

/**
 * Base class for all form field classes
 * @class
 */
var WordClass = Node.subclass({
   className: namespace + '.WordClass',

  template: resource('./word.tmpl'),
  //template: '<span class="item item_{selected}" event-keydown="keydown" event-keyup="keyup" event-click="select" event-blur="lostFocus" contenteditable="true">{word}</span>',

  binding: {
    word: 'data:value'
  },

  handler: {
    select: function(){
      //console.log('word select - ' + this.data.value);
      this.delegate.data.selected = true;
    },
    unselect: function(){
      //console.log('word unselect - ' + this.delegate.data.value);
      this.delegate.data.selected = false;
    }
  },

  action: {
    lostFocus : function(event){
        console.log('lostFocus on ', event.type);
      this.delegate.data.withFocus = true;
    },
    keydown : function(event){
      console.log('keydown', event.keyCode);
      
      var charCode = event.keyCode;
      
      if ( charCode==13/*enter*/ ) {
        event.preventDefault();
            event.stopPropagation();
        return false;
      }
    },
    
    keyup : function(event){
      console.log('keyup', event.keyCode);
      
      var charCode = event.keyCode;
      
      // ignore some special keys
      if ( charCode==9/*tab*/ || charCode==27/*escape*/ ||
        /*arrows*/( charCode>=37 && charCode<=40 ) ) {
        return false;
      }
      
        //var charCode = (typeof event.which === "number") ? event.which : event.keyCode;
      var position = window.getSelection().getRangeAt(0).startOffset;
      //console.log('cursor :' + position );
      // get text ignore html
      var value = this.element.textContent;//.firstChild.data;
      console.log( "v="+value );
      
      var to_process = false;
      if ( charCode==46/*delete*/ || charCode==8/*backspace*/ || charCode==32/*whitespace*/ ) {
        to_process = true;
      }
      if ( charCode==13/*enter*/ ) {
        value = value.substring( 0, position ) + ' ' + value.substring( position, value.length );
        to_process = true;
      }
      console.log(value);
        //console.log('keyup', event.type);
      //console.log(event);
      //console.log(this);
      //console.log(this.data.value);
      //console.log(this.parentNode.data.dataset.getItems());
      //this.parentNode.data.dataset.setAndDestroyRemoved();
      
      let prev_selection = this.parentNode.selection;//.getItems();
      console.log(prev_selection);
      //console.log(this);
      //let obj_id = [];
      //for ( var i=0; i<prev_selection.length; i++ ) {
      //    prev_selection[i]._mark = 1;
      //}
      //console.log(obj_id);
      
      //var parts = value.split(' ');//,.!?;:+-=')
      var parts = value.match(/[-\w]+/g);
      console.log( "parts=" + parts );
      //if ( parts.length>1 ) {
      if ( to_process ) {
        var temp_ar = [], dataset = this.parentNode.data.dataset;
        value = this;
      //console.log(value.delegate);
      //console.log(value);
//      var selected_delegates = prev_selection.getValues().reduce( function(new_array, item) {
//          console.log( item.delegate );
//        if ( dataset.has( item.delegate ) ) {
//              console.log("selected");
//            new_array.push( item.delegate );
//         }
//          return new_array; 
//        }, [] );
      
        var ta = dataset.getItems().reduce( function(new_array, item) {
        //var set_mark = 0;
        //console.log(item);
            if ( value.delegate==item ) {
            if ( parts ) {
              for ( var i=0; i<parts.length; i++ ) {
                let vv = parts[i].trim();
                if ( vv.length>0 ) {
                    var dob = new DataObject({ data: { value: vv }});
                  if ( item.data.selected ) {
                    dob.data.selected = true;
                  }
                  // focus on the last
                  if ( i==(parts.length-1) ) {
                    dob.data.withFocus = true;
                  }
                  new_array.push( dob );
                  //...
                }
              }
            }
          } else {
            //console.log( item.data.selected );
            item.data.withFocus = false;
            new_array.push( item );
            //for ( var j=0; j<selected_delegates.length; j++ ) {
              //for ( var i=0; i<obj_id.length; i++ ) {
              //console.log( selected_delegates[j] );
              //if ( selected_delegates[j]==item ) {
              //  par.selection.add( selected_delegates[j] );
              //}
            //}
          }
          //console.log(new_array.length);
          return new_array;
            }, [] );
//console.log(ta.length);
        //dataset.set( ta );
        //return false;
        var par = this.parentNode;
        // dataset = this.parentNode.data.dataset
        dataset.clear();
        dataset.set( ta );
        // par.update({dataset: ta}); // not works
        //console.log( this.parentNode );
        //dataset.setAndDestroyRemoved( ta );
        //par.firstChild.select(); // works
        //par.firstChild.contextSelection.add( par.firstChild ); // works
        //par.selection.add( par.firstChild ); // works
        //par.selection.set( prev_selection ); // do not works
        //par.selection.add( obj_id );
        
        // restore selection
        // ...
        console.log( "***" );
        par.childNodes.forEach( function(item) {
            console.log( item );
            if ( item.delegate.data.selected ) {
                //console.log("selecteda");
                par.selection.add( item );
          } 
          if ( item.delegate.data.withFocus ) {
            console.log("llost");
            item.focus();
          }
          } );
        //this.element.firstChild.data = parts[0];
//        for ( var j=0; j<selected_delegates.length; j++ ) {
//          //for ( var i=0; i<obj_id.length; i++ ) {
//              console.log( selected_delegates[j] );
//              //if ( dataset.getItems()[j].basisObjectId==obj_id[i] ) {
//              //par.selection.add( selected_delegates[j] );
//            selected_delegates[j].select();
          //}
//        }
      }
      return false;
      //console.log(this.element.firstChild.data);
    }
  } 
  
  });

var TextentClass = Node.subclass({
  className: namespace + '.TextentClass',
  
  container: document.getElementById("aa"),//basis.dom.get('aa'),

  template: resource('./texta.tmpl'),
  //template: '<div id="text_words" style="height:10ex;width:100%;border: 0px solid;"></div>',

//disabled="" dir="ltr" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" //wrap="SOFT"

  dataSource: Value.factory('update', 'data.dataset'),  
  data: {
    dataset: new Dataset()
  },

  //contextSelection: selection,
  selection: {
    multiple: true,
    handler: {
      itemsChanged: function(){
        //editor.setDelegate(this.pick());
        //console.log('parent selection handler ');
       // console.log(this.pick().data.value);
      }
    }
  },

  childClass: WordClass
});

//console.log( words.data.dataset.itemCount );

//words.update( { items: [ { data: { value: 'aaa' } },
//                        { data: { value: 'bb' } } ] } );
//var uo = { dataset: new Dataset( { items: ['foo', 'bar', 'baz', 'kulaop']
//  .map( function(v){ return new DataObject({ data: { value: v } }); }) }) };
//words.update( uo );
//words.update({ items: null }); 

//console.log( uo.dataset.itemCount );
//console.log( words.data.dataset.itemCount );

module.exports = {
    Textent: TextentClass
};
