/**
 * Created by WQ on 2015/6/23.
 */
Package( function ( exports ) {
	var gn = imports( "getName.js" );

	function say() {
		var name = gn.getName();
		console.log( name )
	}

	function see() {
		console.log( "i see" )
	}

	exports.say = say;
	exports.see = see;

} );