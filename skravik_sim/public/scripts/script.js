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

function post(){
    var msg = [];
    var datas = document.getElementsByTagName("input");
    for(var k=0; k<datas.length; k++){
        if(datas[k].hasAttribute("id")){
            if(datas[k].path_sk != ""){
                msg.push({
                    "path" : datas[k].getAttribute("path_sk"),
                    "value": parseFloat(datas[k].value)
                });
            }
        }
    }

    console.log(msg);
    
    var oReq = new XMLHttpRequest();
    oReq.open("POST", "/skServer/plugins/skravik-sim-plugin/api");
    oReq.setRequestHeader("Content-Type", "application/json");
    oReq.send(JSON.stringify(msg));
    
    setTimeout(post, 1000);
}

post();