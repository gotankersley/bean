//rename 's/\d+/sprintf("%04d",$&)/e' *
var fs = require('fs');
var cheerio = require('cheerio');

//Parse
function parseTag(tagData) {
	$ = cheerio.load(tagData);
	var str = '[';
	var polys = $('area[shape=poly]');
	polys.each(function(i, elem) {	
		var p = $(this);		
		str += '{';
		str += 'cursor:"' + p.attr('href') + '",';
		str += 'target:' + p.attr('target') + ',';
		str += 'coords:[';
		var coords = p.attr('coords').split(',');
		for (var c = 0; c < coords.length; c+=2) { //Should always be an even length
			str += '[' + coords[c] + ',' + coords[c+1] + '],';			
		}
		str += '],';
		str += '},';	
	});
	return str + '],';
}

//Read map file(s)
var path;
if (process.argv.length <= 2) {
	path = __dirname + '/maps';    
    console.log('Reading maps dir: ' + path);
}
else {
	path = ____dirname + '/' + process.argv[2];
	console.log('Using ' + path);
}
 
fs.readdir(path, function(err, items) {    
	
	var str = 'var nav=[' 
	items = items.sort();
	//Loop through map file(s)
	var total = 0;
    for (var i=0; i<items.length; i++) {
        var item = items[i];
		var tagData = fs.readFileSync(path + '/' + item, 'utf8');
		var num = parseInt(item.replace('.map', '').substr(2));
		if (i != num) {			
			for (var n = Math.max(i, total); n < num && n < 50; n++) {						
				str += '[],//' + n + '\n';			
				total++;				
			}
		}
		
		console.log('Parsing:' + item);					
		str += parseTag(tagData) + '//' + num + '\n';
		total++;
    }
	str += '];\n';
	
	//Output
	var outPath = __dirname + '/out.js';
	fs.writeFileSync(outPath, str, 'utf8');
	console.log('Wrote file: ' + outPath);
});



