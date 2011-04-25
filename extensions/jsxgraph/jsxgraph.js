/*
 This extension allows you to use jsxGraph to create pretty graphs inside question content.
 By default, it uses JessieScript (jsxGraph's simple scripting language for creating geometric constructions).
 You can use javascript by adding the attribute language="javascript" to the <jsxgraph> tag.

 Example Usage:

 notextile. 	//this line is required so textile doesn't mess anything up
 <jsxgraph>
 	A(1,1);
 	B(0,0);
 	[AB[;
 </jsxgraph>

 You can specify a width and height:

 notextile.
 <jsxgraph width="400" height="300">
  ....
 </jsxgraph>

 Or use javascript for more complicated constructions:

 notextile.
 <jsxgraph language="javascript">
		var g1 = board.create('point', [1, -1], {style:6});
		var g2 = board.create('point', [2.5, -2], {style:6});
		var g3 = board.create('point', [1, -3], {style:5});
		var g4 = board.create('point', [2.5, -4], {style:5});
		var g5 = board.create('point', [-4, 1], {style:5,name:''});
		var c1 = board.create('curve', [
			   function(t){ return (g1.x()-g2.x())*math.cos(t)+g3.x()*math.cos(t*(g1.x()-g2.x())/g2.x()); },
			   function(t){ return (g1.x()-g2.x())*math.sin(t)+g3.x()*math.sin(t*(g1.x()-g2.x())/g2.x()); },
			   0,function(){ return math.pi*7*math.abs(g4.x());}],{
				  strokewidth:function(){return g5.y()*3;},
				  strokeopacity:function(){return g5.y()*0.6;}
				 });
		var t = board.create('text', [function() { return g5.x()+0.2; },function() { return g5.y()+0.25; },'x(b)=<value>x(b)</value>'], 
				{ 
					digits:3, 
					fontsize:function(){return math.abs(g5.y())*10+1;}
				})
 </jsxgraph>
*/

Numbas.queueScript('extensions/jsxgraph/jsxgraph.js',['display','util','jme'],function() {
	Numbas.loadScript('extensions/jsxgraph/jsxgraphcore.js');
	Numbas.loadCSS('extensions/jsxgraph/jsxgraph.css');
	
	var jme = Numbas.jme;	
	var util = Numbas.util;
	console.log("jsxgraph!");

	var QuestionDisplay = Numbas.display.QuestionDisplay;

	QuestionDisplay.prototype.show = util.extend(QuestionDisplay.prototype.show, function() {
		console.log("QUESTION");
		$('jsxgraph').each(function(index) {
			var id ='jsxgraphboard'+index;
			var text = $(this).text();
			var width= $(this).attr('width') || 400;
			var height = $(this).attr('height') || 400;
			var language = ($(this).attr('language') || 'jessiescript').toLowerCase();
			if((axis = $(this).attr('axis'))=='') { axis = true; }
			axis = util.parseBool(axis);
			var options = {
				width:width,
				height:height, 
				originX: width/2,
				originY: height/2,
				axis: false,
				showCopyright: false
			};

			//create div for board to go in
			$(this).replaceWith('<div id="'+id+'" class="jxgbox"></div>');
			$('#'+id).css('width',width+'px')
					.css('height',height+'px');

			//create board
			var board = JXG.JSXGraph.initBoard(id,options);

			Numbas.debug(language,true);
			Numbas.debug(text,true);
			switch(language)
			{
			case 'jessiescript':
				var constr = board.construct(text);
				break;
			case 'javascript':
				console.log("eval");
				eval(text);
				break;
			}
			console.log("DONE");
		});
	});
});
