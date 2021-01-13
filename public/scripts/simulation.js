function plus(item)
{
	var valeur = item.value;
	item.setAttribute("value" , parseInt(valeur)+1)
	valeurfixe();
}

function plusplus(item)
{
	var valeur = item.value;
	item.setAttribute("value" , parseInt(valeur)+10)
}

function moins(item)
{
	var valeur = item.value;
	valeur = parseInt(valeur)-1
	if(valeur >= 0)
	{
		item.setAttribute("value" , valeur)
	}
}
function moinsmoins(item)
{
	var valeur = item.value;
	valeur = parseInt(valeur)-10
	if(valeur<=0)
	{
		item.setAttribute("value" , 0)
	}
	else{
		item.setAttribute("value" , valeur)
	}
}


function valeurfixe()
{
	var host = "192.168.43.225";
	var port = 3000;
	var endpoint = "signalk/v1/api/vessels/self/"

	valuePath = "electrical/batteries/0/capacity/stateOfCharge"

	var msg =
	    {
	        value: 1.52,
	        source: "interface simulateur",
	    }

	var oReq = new XMLHttpRequest();
	oReq.open("post", "http://" + host + ":" + port + "/" + endpoint + valuePath);
	oReq.send(JSON.stringify(msg));

}



