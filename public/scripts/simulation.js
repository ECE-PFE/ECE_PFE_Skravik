function plus(item)
{
	var valeur = item.value;
	item.setAttribute("value" , parseInt(valeur)+1)
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

