// Read user parameters and sound
window.onload = function() {
	window.wallpaperRegisterAudioListener(wallpaperAudioListener);
};

window.wallpaperPropertyListener = {
	applyUserProperties: function(properties) {
		if (properties.PreventLeakbool) {
			prevent_leak = properties.PreventLeakbool.value;
		}

		if (properties.e5Colorwavebool) {
			useDynamicColorwave = properties.e5Colorwavebool.value;
		}

		if (properties.e6Musicbool) {
			useMusic = properties.e6Musicbool.value;
		}

		if(properties.Musicidlebool){
			useMusicTimeout = properties.Musicidlebool.value;
		}

		if(properties.Musicidletimeout){
			MusicTimeoutTime = properties.Musicidletimeout.value;
		}

		if (properties.e7Extradropsbool) {
			useExtradrops = properties.e7Extradropsbool.value;
		}

		if (properties.e2fontSize) {
			font_size = properties.e2fontSize.value;
			Update_TextCanvas_Array();
			fontsize_changed = true;
		}

		if (properties.f1taillength) {
			tailLength = 1.0/properties.f1taillength.value;
		}

		if (properties.f2speed) {
			speed = 100 - properties.f2speed.value;
		}

		if (properties.e8Volumemultiplier) {
			AudioMultiplier = (properties.e8Volumemultiplier.value)/10.0;
		}

		if (properties.e3customColorbool) {
			useCustomColors = properties.e3customColorbool.value;
		}

		if (properties.ClockSnapbool) {
			previous_use_ClockSnap = use_ClockSnap;
			use_ClockSnap = properties.ClockSnapbool.value;
		}

		if (properties.MessageSnapbool) {
			previous_use_MessageSnap = use_MessageSnap;
			use_MessageSnap = properties.MessageSnapbool.value;
		}

		if (properties.e1Symboltext) {
			if (properties.e1Symboltext.value != ""){
				characters = properties.e1Symboltext.value;
				Update_TextCanvas_Array();
			}
		}

		if (properties.MessageText) {
			if (properties.MessageText.value != ""){
				Messagetext = properties.MessageText.value;
			}
		}

		if (properties.f3Clockbool) {
			Clockbool = properties.f3Clockbool.value;
		}

		if (properties.Clock12hbool) {
			Clock12h = properties.Clock12hbool.value;
		}

		if (properties.f4Clocksize) {
			Clocksize = properties.f4Clocksize.value;
		}

		if (properties.f5ClockPosX) {
			ClockPosX = properties.f5ClockPosX.value;
		}

		if (properties.f6ClockPosY) {
			ClockPosY = properties.f6ClockPosY.value;
		}

		if (properties.Messagebool) {
			use_Message = properties.Messagebool.value;
		}

		if (properties.MessageSize) {
			Messagesize = properties.MessageSize.value;
		}

		if (properties.MessagePosX) {
			MessageposX = properties.MessagePosX.value;
		}

		if (properties.MessagePosY) {
			MessageposY = properties.MessagePosY.value;
		}

		if (properties.e9Color1) {
			var Farbewert1 = properties.e9Color1.value.split(' ');
			ColorValue1 = [parseFloat(Farbewert1[0]) * 255, parseFloat(Farbewert1[1]) * 255, parseFloat(Farbewert1[2]) * 255];
		}
		if (properties.e9Color2) {
			var Farbewert2 = properties.e9Color2.value.split(' ');
			ColorValue2 = [parseFloat(Farbewert2[0]) * 255, parseFloat(Farbewert2[1]) * 255, parseFloat(Farbewert2[2]) * 255];
		}
		if (properties.e9Color3) {
			var Farbewert3 = properties.e9Color3.value.split(' ');
			ColorValue3 = [parseFloat(Farbewert3[0]) * 255, parseFloat(Farbewert3[1]) * 255, parseFloat(Farbewert3[2]) * 255];
		}
		if (properties.e9Color4) {
			var Farbewert4 = properties.e9Color4.value.split(' ');
			ColorValue4 = [parseFloat(Farbewert4[0]) * 255, parseFloat(Farbewert4[1]) * 255, parseFloat(Farbewert4[2]) * 255];
		}
	}
};

var c = document.getElementById("c");
var ctx = c.getContext("2d");

var useCustomColors = false;
var useDynamicColorwave = true;
var useMusic = false;
var useMusicTimeout = true;
var MusicTimeoutTime = 15;
var LastSoundTime = new Date();
var isSilent = false;
var MusicTimeout = true;
var useExtradrops = false;

var ColorValue1;
var ColorValue2;
var ColorValue3;
var ColorValue4;

var AudioMultiplier = 1;
var tailLength = 0.05;

var speed = 33;
var previousspeed = speed;
var IntervallVariable;

var Color;
var Coloroffset = 0;

var FrequencyArray;

var Clockbool = false;
var Clocksize = 2;
var ClockPosX = 50;
var ClockPosY = 5;
var Clock12h = false;
var ClockPosition = [[0,0],[0,0]];
var use_ClockSnap = false;
var previous_use_ClockSnap = false;

var use_Message = true;
var Messagetext = "Error 404";
var Messagesize = 2;
var MessageposX = 0;
var MessageposY = 0;
var MessagePosition = [[0,0],[0,0]];
var use_MessageSnap = true;
var previous_use_MessageSnap = false;

var fontsize_changed = true;


//making the canvas full screen
c.height = window.innerHeight;
c.width = window.innerWidth;

// default hexadecimal characters
var characters = "404";

var font_size = 8;
var columns = c.width/font_size; //number of columns for the rain
//an array of drops - one per column
var drops = [];
//second array for multiple drops per column
var extradrops = [];

for(var x = 0; x < columns; x++){
	drops[x] = 1; //initialize drops on top of page
	extradrops[x] = c.height; //initialize extradrops somewhere below the screen
}

var prevent_leak = true;

var TextCanvas_Array = [];
Update_TextCanvas_Array();

//drawing the characters
function draw()
{
	if(fontsize_changed){
		fontsize_changed = false;
		//recalculate columns
		columns = c.width/font_size;
		//resize drops array
		drops = [];
		extradrops = [];
		for(var x = 0; x < columns; x++){
			drops[x] = 1; //initialize drops on top of page
			extradrops[x] = c.height; //initialize extradrops somewhere below the screen
		}

		//Black BG for the canvas
		ctx.fillStyle = "rgba(0,0,0,1)";
		ctx.fillRect(0, 0, c.width, c.height);

		// set font size
		ctx.font = font_size + "px consolas";
	}


	// fade out characters
	if(Clockbool){
		var today = new Date();
		var h = today.getHours();
		var m = today.getMinutes();

		// format hours and minutes
		if(Clock12h && h > 12){
			h = h % 12;
			if (h == 0){
				h = 12;
			}
		}
		if(h < 10){
			h = "0" + h;
		}
		if(m < 10){
			m = "0" + m;
		}
		ClockPosition = drawString( h + ":" + m ,Clocksize,ClockPosX,ClockPosY);


		// just do this once, after the clocksnap value has changed to true
		if(use_ClockSnap && !previous_use_ClockSnap){
			var ClockLength = ClockPosition[1] [0] - ClockPosition[0] [0];
			var ClockHeight = ClockPosition[1] [1] - ClockPosition[0] [1];
			ClockPosX = Math.floor(((c.width/font_size) / 2.0) - (ClockLength / (font_size * 2.0)));
			ClockPosY = Math.floor(((c.height/font_size)/ 2.0) - (ClockHeight / (font_size * 2.0)));
		}

	}else if(use_Message){
		MessagePosition = drawString(Messagetext ,Messagesize,MessageposX,MessageposY);

		// just do this once, after the clocksnap value has changed to true
		if(use_MessageSnap && !previous_use_MessageSnap){
			var MessageLength = MessagePosition[1] [0] - MessagePosition[0] [0];
			var MessageHeight = MessagePosition[1] [1] - MessagePosition[0] [1];
			MessageposX = Math.floor(((c.width/font_size) / 2.0) - (MessageLength / (font_size * 2.0)));
			MessageposY = Math.floor(((c.height/font_size)/ 2.0) - (MessageHeight / (font_size * 2.0)));
		}

	}else{
		//Black BG for the canvas
		//translucent BG to show trail
		ctx.fillStyle = "rgba(0, 0, 0," + tailLength.toString() + ")";
		ctx.fillRect(0, 0, c.width, c.height);
	}

	// assumption that there is no music
	isSilent = true;

	//looping over drops
	for(var i = 0; i < drops.length; i++)
	{
		var probability = 0.975; //probability that a drop will reset after it is below the screen
		var lightness = 50; // lightness of the character of the current drop
		if (useMusic){
			// map a sound-array element to the current column
			var frequency = Math.floor(i * ((FrequencyArray.length/2) / (drops.length)));

			// read volume level of both stereo channels
			var Volume = FrequencyArray[frequency] + FrequencyArray[frequency + (FrequencyArray.length/2)];

			// is there sound?
			if(Volume > 0.01){
				isSilent = false;
			}

			if( !MusicTimeout || !useMusicTimeout){
				// propability of respawn is equivalent to volume (likely to be between 0.0 and 1.0) cubed
				probability = 1 - clamp(0,1,(Volume * Volume * Volume * AudioMultiplier));
				// lightness depends on volume
				lightness = Math.floor(clamp(40,80,Volume * 100 * AudioMultiplier));
			}

		}

		if(!prevent_leak){
			// delete previous trails
			if (useExtradrops){
				ctx.fillStyle = "rgba(0, 0, 0, 1)";
				ctx.fillRect(i*font_size, (extradrops[i]-1)*font_size + Math.floor(font_size/4.5), font_size, font_size);
			}
			ctx.fillStyle = "rgba(0, 0, 0, 1)";
			ctx.fillRect(i*font_size, (drops[i]-1)*font_size + Math.floor(font_size/4.5), font_size, font_size);

		}

		// calculate gradient between colors
		if (useCustomColors){
			var quantity_red;
			var quantity_green;
			var quantity_blue;
			if(i < drops.length / 6){
				// Color 1 >> Color 1 + Color 2
				quantity_red = ColorValue1[0] + lerp(0,ColorValue2[0],(i / (drops.length / 6.0)));
				quantity_green = ColorValue1[1] + lerp(0,ColorValue2[1],(i / (drops.length / 6.0)));
				quantity_blue = ColorValue1[2] + lerp(0,ColorValue2[2],(i / (drops.length / 6.0)));
			}else if(i < drops.length / 3){
				// Color 1 + Color 2 >> Color2
				quantity_red = ColorValue2[0] + lerp(ColorValue1[0],0,((i-(drops.length / 6.0)) / (drops.length / 6.0)));
				quantity_green = ColorValue2[1] + lerp(ColorValue1[1],0,((i-(drops.length / 6.0)) / (drops.length / 6.0)));
				quantity_blue = ColorValue2[2] + lerp(ColorValue1[2],0,((i-(drops.length / 6.0)) / (drops.length / 6.0)));
			}else if(i < drops.length / 2){
				// Color 2 >> Color 2 + Color 3
				quantity_red = ColorValue2[0] + lerp(0,ColorValue3[0],((i-(drops.length / 3.0)) / (drops.length / 6.0)));
				quantity_green = ColorValue2[1] + lerp(0,ColorValue3[1],((i-(drops.length / 3.0)) / (drops.length / 6.0)));
				quantity_blue = ColorValue2[2] + lerp(0,ColorValue3[2],((i-(drops.length / 3.0)) / (drops.length / 6.0)));
			}else if(i < drops.length / 1.5){
				// Color 2 + Color 3 >> Color 3
				quantity_red = ColorValue3[0] + lerp(ColorValue2[0],0,((i-(drops.length / 2.0)) / (drops.length / 6.0)));
				quantity_green = ColorValue3[1] + lerp(ColorValue2[1],0,((i-(drops.length / 2.0)) / (drops.length / 6.0)));
				quantity_blue = ColorValue3[2] + lerp(ColorValue2[2],0,((i-(drops.length / 2.0)) / (drops.length / 6.0)));
			}else if(i < drops.length / 1.2){
				// Color 3 >> Color 3 + Color 4
				quantity_red = ColorValue3[0] + lerp(0,ColorValue4[0],((i-(drops.length / 1.5)) / (drops.length / 6.0)));
				quantity_green = ColorValue3[1] + lerp(0,ColorValue4[1],((i-(drops.length / 1.5)) / (drops.length / 6.0)));
				quantity_blue = ColorValue3[2] + lerp(0,ColorValue4[2],((i-(drops.length / 1.5)) / (drops.length / 6.0)));
			}else{
				// Color 3 + Color 4 >> Color 4
				quantity_red = ColorValue4[0] + lerp(ColorValue3[0],0,((i-(drops.length / 1.2)) / (drops.length / 6.0)));
				quantity_green = ColorValue4[1] + lerp(ColorValue3[1],0,((i-(drops.length / 1.2)) / (drops.length / 6.0)));
				quantity_blue = ColorValue4[2] + lerp(ColorValue3[2],0,((i-(drops.length / 1.2)) / (drops.length / 6.0)));
			}

			quantity_red = clamp(0,255,quantity_red);
			quantity_green = clamp(0,255,quantity_green);
			quantity_blue = clamp(0,255,quantity_blue);
			ctx.fillStyle = "rgba(" + Math.floor(quantity_red).toString() + "," + Math.floor(quantity_green).toString() + "," + Math.floor(quantity_blue).toString() + ",1.0)";
		}
		// no custom colors
		else{
			if(useDynamicColorwave && !Clockbool && !use_Message){
				// calculate a hue offset
				Coloroffset = (Coloroffset - 0.01) % 361;
			}
			Color = (((i/drops.length) * 360) + 347 + Coloroffset) % 361;
			ctx.fillStyle = "hsl(" + Math.floor(Color).toString() + ", 100%,"+ lightness.toString() +"%)";
		}


		// Print characters
		if(prevent_leak){
			//a random character to print
			var text = TextCanvas_Array[Math.floor(Math.random()*TextCanvas_Array.length)];
			//x = i*font_size, y = value of drops[i]*font_size
			// first draw Text
			ctx.globalCompositeOperation = 'source-over';
			ctx.drawImage(text, (i-1)*font_size, (drops[i]-1)*font_size);
			// then add color
			ctx.globalCompositeOperation = 'multiply';
			ctx.fillRect((i-1)*font_size,(drops[i]-1)*font_size,font_size,font_size);

			//a random character to print
			var text = TextCanvas_Array[Math.floor(Math.random()*TextCanvas_Array.length)];
			//x = i*font_size, y = value of drops[i]*font_size
			// first draw Text
			ctx.globalCompositeOperation = 'source-over';
			ctx.drawImage(text, (i-1)*font_size, (extradrops[i]-1)*font_size);
			// then add color
			ctx.globalCompositeOperation = 'multiply';
			ctx.fillRect((i-1)*font_size,(extradrops[i]-1)*font_size,font_size,font_size);
		}else{
			ctx.globalCompositeOperation = 'source-over';
			ctx.font = font_size + "px consolas";

			//a random character to print
			var text = characters[Math.floor(Math.random()*characters.length)];
			//x = i*font_size, y = value of drops[i]*font_size
			ctx.fillText(text, i*font_size, drops[i]*font_size);

			//a random character to print
			var text = characters[Math.floor(Math.random()*characters.length)];
			//x = i*font_size, y = value of drops[i]*font_size
			ctx.fillText(text, i*font_size, extradrops[i]*font_size);
		}


		if (useExtradrops){
			//sending the drop back to the top randomly after it has crossed the screen
			//adding a randomness to the reset to make the drops scattered on the Y axis
			if((drops[i]*font_size > c.height/2) && (drops[i]*font_size < c.height)){
				if(extradrops[i]*font_size > c.height && Math.random() > probability){
					extradrops[i] = 0;
				}
			}
		}

		//sending the drop back to the top randomly after it has crossed the screen
		//adding a randomness to the reset to make the drops scattered on the Y axis
		if(drops[i]*font_size > c.height && Math.random() > probability)
			drops[i] = 0;

		//incrementing Y coordinate
		drops[i]++;
		extradrops[i]++;
	}

	if(useMusicTimeout){
		// when was the last sound?
		if(!isSilent){
			// just now
			MusicTimeout = false;
			LastSoundTime = new Date();
		}else if((new Date() - LastSoundTime) > MusicTimeoutTime * 1000){
			MusicTimeout = true;
		}
	}


	// if speed changes reconfigure the Interval
	if(previousspeed != speed){
		clearInterval(IntervallVariable);
		IntervallVariable = setInterval(draw, speed);
	}
	previousspeed = speed;
}

function lerp(value1, value2, amount) {
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
}

function clamp(min,max,value){
	if (value < min)
		return min;
	if (value > max)
		return max;
	return value;
}

function wallpaperAudioListener(audioArray) {
	return FrequencyArray = audioArray;
}

    var letters = letters = {
        'A': [
            [0,1,0],
            [1,0,1],
            [1,0,1],
            [1,1,1],
            [1,0,1]
        ],
        'B': [
            [1,1,0],
            [1,0,1],
            [1,1,1],
            [1,0,1],
            [1,1,0]
        ],
        'C': [
            [1,1,1],
            [1,0,0],
            [1,0,0],
            [1,0,0],
            [1,1,1]
        ],
        'D': [
            [1,1,0],
            [1,0,1],
            [1,0,1],
            [1,0,1],
            [1,1,0]
        ],
        'E': [
            [1,1,1],
            [1,0,0],
            [1,1,1],
            [1,0,0],
            [1,1,1]
        ],
        'F': [
            [1,1,1],
            [1,0,0],
            [1,1,0],
            [1,0,0],
            [1,0,0]
        ],
        'G': [
            [0,1,1,0],
            [1,0,0,0],
            [1,0,1,1],
            [1,0,0,1],
            [0,1,1,0]
        ],
        'H': [
            [1,0,1],
            [1,0,1],
            [1,1,1],
            [1,0,1],
            [1,0,1]
        ],
        'I': [
            [1,1,1],
            [0,1,0],
            [0,1,0],
            [0,1,0],
            [1,1,1]
        ],
        'J': [
            [1,1,1],
            [0,0,1],
            [0,0,1],
            [1,0,1],
            [1,1,1]
        ],
        'K': [
            [1,0,0,1],
            [1,0,1,0],
            [1,1,0,0],
            [1,0,1,0],
            [1,0,0,1]
        ],
        'L': [
            [1,0,0],
            [1,0,0],
            [1,0,0],
            [1,0,0],
            [1,1,1]
        ],
        'M': [
            [1,1,1,1,1],
            [1,0,1,0,1],
            [1,0,1,0,1],
            [1,0,0,0,1],
            [1,0,0,0,1]
        ],
        'N': [
            [1,0,0,1],
            [1,1,0,1],
            [1,0,1,1],
            [1,0,0,1],
            [1,0,0,1]
        ],
        'O': [
            [1,1,1],
            [1,0,1],
            [1,0,1],
            [1,0,1],
            [1,1,1]
        ],
        'P': [
            [1,1,1],
            [1,0,1],
            [1,1,1],
            [1,0,0],
            [1,0,0]
        ],
        'Q': [
            [0,1,1,0],
            [1,0,0,1],
            [1,0,0,1],
            [1,0,1,1],
            [1,1,1,1]
        ],
        'R': [
            [1,1,0],
            [1,0,1],
            [1,0,1],
            [1,1,0],
            [1,0,1]
        ],
        'S': [
            [1,1,1],
            [1,0,0],
            [1,1,1],
            [0,0,1],
            [1,1,1]
        ],
        'T': [
            [1,1,1],
            [0,1,0],
            [0,1,0],
            [0,1,0],
            [0,1,0]
        ],
        'U': [
            [1,0,1],
            [1,0,1],
            [1,0,1],
            [1,0,1],
            [1,1,1]
        ],
        'V': [
            [1,0,0,0,1],
            [1,0,0,0,1],
            [0,1,0,1,0],
            [0,1,0,1,0],
            [0,0,1,0,0]
        ],
        'W': [
            [1,0,0,0,1],
            [1,0,0,0,1],
            [1,0,0,0,1],
            [1,0,1,0,1],
            [1,1,1,1,1]
        ],
        'X': [
            [1,0,0,0,1],
            [0,1,0,1,0],
            [0,0,1,0,0],
            [0,1,0,1,0],
            [1,0,0,0,1]
        ],
        'Y': [
            [1,0,1],
            [1,0,1],
            [0,1,0],
            [0,1,0],
            [0,1,0]
        ],
        'Z': [
            [1,1,1],
            [0,0,1],
            [0,1,0],
            [1,0,0],
            [1,1,1]
        ],
        '0': [
            [1,1,1],
            [1,0,1],
            [1,0,1],
            [1,0,1],
            [1,1,1]
        ],
        '1': [
            [0,1,0],
            [0,1,0],
            [0,1,0],
            [0,1,0],
            [0,1,0]
        ],
        '2': [
            [1,1,1],
            [0,0,1],
            [1,1,1],
            [1,0,0],
            [1,1,1]
        ],
        '3':[
            [1,1,1],
            [0,0,1],
            [1,1,1],
            [0,0,1],
            [1,1,1]
        ],
        '4':[
            [1,0,1],
            [1,0,1],
            [1,1,1],
            [0,0,1],
            [0,0,1]
        ],
        '5':[
            [1,1,1],
            [1,0,0],
            [1,1,1],
            [0,0,1],
            [1,1,1]
        ],
        '6':[
            [1,1,1],
            [1,0,0],
            [1,1,1],
            [1,0,1],
            [1,1,1]
        ],
        '7':[
            [1,1,1],
            [0,0,1],
            [0,0,1],
            [0,0,1],
            [0,0,1]
        ],
        '8':[
            [1,1,1],
            [1,0,1],
            [1,1,1],
            [1,0,1],
            [1,1,1]
        ],
        '9':[
            [1,1,1],
            [1,0,1],
            [1,1,1],
            [0,0,1],
            [1,1,1]
        ],
		':':[
            [0,0,0],
            [0,1,0],
            [0,0,0],
            [0,1,0],
            [0,0,0]
        ],
		'!':[
            [0,1,0],
            [0,1,0],
            [0,1,0],
            [0,0,0],
            [0,1,0]
        ],
		'?':[
            [1,1,1],
            [0,0,1],
            [0,1,0],
            [0,0,0],
            [0,1,0]
        ],
        ' ': [
            [0,0,0],
            [0,0,0],
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ]
	};

    function drawString(string, size, X_offset, Y_offset) {
        var needed = [];
        string = string.toUpperCase(); // because I only did uppercase letters
        for (var i = 0; i < string.length; i++) {
            var letter = letters[string.charAt(i)];
            if (letter) { // because there's letters I didn't do
                needed.push(letter);
            }
        }

        ctx.fillStyle = "rgba(0, 0, 0," + tailLength.toString() + ")";

		// ctx.fillStyle = "white";
		var max_currY = 0;
        var currX = X_offset * font_size;
        for (i = 0; i < needed.length; i++) {
            letter = needed[i];
            var currY = Y_offset * font_size;
            var addX = 0;
            for (var y = 0; y < letter.length; y++) {

				// blend column right from letter
				ctx.fillRect(currX + letter[y].length  * (size * font_size), currY + font_size/4.5, (size * font_size), (size * font_size));

                var row = letter[y];
                for (var x = 0; x < row.length; x++) {
					// blend pixel
                    if (!row[x]) {
                        ctx.fillRect(currX + x * (size * font_size), currY + font_size/4.5, (size * font_size), (size * font_size));
                    }
                }
                addX = Math.max(addX, row.length * (size * font_size));
                currY += size * font_size;

				if (currY > max_currY){
					max_currY = currY;
				}
            }
            currX += (size * font_size) + addX;
        }

		// blend left from text
		ctx.fillRect(0,0, X_offset * font_size, c.height);
		// blend above text
		ctx.fillRect(X_offset * font_size, 0 , (currX - (X_offset * font_size))  , (Y_offset * font_size) + font_size / 4.5);
		// blend right from text
		ctx.fillRect(currX, 0 , c.width, c.height);
		// blend below text
		ctx.fillRect(X_offset * font_size, max_currY , currX - (X_offset * font_size) , c.height);

		var top_left = [X_offset * font_size, Y_offset * font_size];
		var bottom_right = [currX - size * font_size , max_currY];

		return [top_left,bottom_right];
}

	function Update_TextCanvas_Array(){
		TextCanvas_Array = [];
		for(var i = 0; i < characters.length; i++){
			TextCanvas_Array[i] = document.createElement("canvas");
			TextCanvas_Array[i].width = font_size;
			TextCanvas_Array[i].height = font_size;
			var TextCtx = TextCanvas_Array[i].getContext("2d");

			// Black background
			 TextCtx.fillStyle = "rgba(0,0,0,1.0)";
			 TextCtx.fillRect(0, 0, font_size, font_size);

			// white text
			TextCtx.font = font_size + "px consolas";
			TextCtx.fillStyle = "rgba(255,255,255,1.0)";
			TextCtx.fillText(characters[i],0,font_size);
		}
	}

IntervallVariable = setInterval(draw, speed);
