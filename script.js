let map;
const defaultCenter = [60.99136593427641, 42.441497413767465];
let Routes = [];
let currName, currCoords;
let spread = 1;
let rangeHTML = document.getElementsByClassName('range')[0]
let rangeNumHTML = document.getElementsByClassName('range-num')[0]
rangeHTML.oninput=()=>{
rangeNumHTML.innerHTML = `Разброс: ${rangeHTML.value}%`
spread = Number((1+rangeHTML.value/100).toFixed(2));
}
let searchMode;
const radioButtons = document.querySelectorAll('input[type="radio"][name="search-mode"]');
radioButtons.forEach(function(radioButton) {
  radioButton.addEventListener('click', function(event) {
    searchMode = parseInt(event.target.value);
  });
});
//let adjMatrix = new Array(adresses.length);
//let distMatrix = new Array(adresses.length);
let currentRoute;
Array.prototype.max = function() {
    return Math.max.apply(null, this);
  };
  
  Array.prototype.min = function() {
    return Math.min.apply(null, this);
  };
class pair{
    constructor(index,value){
        this.index = index;
        this.value = value;
    }
}
class Pos {
	constructor(name, coords, placemark,color) {
		this.name = name;
		this.coords = coords;
		this.placemark = placemark;
	}
}


function init() {
	map = new ymaps.Map('map', {
		center: defaultCenter,
		zoom: 10,
		controls: []
	});
	var searchControl = new ymaps.control.SearchControl({
		options: {
			provider: 'yandex#search'
		}
	});

	map.controls.add(searchControl);
	searchControl.events.add('resultselect', function(e) {
		console.log('resultselect event fired:');
		//console.log(e);
		var target = e.get('target');
		//console.log(target);
		var found = searchControl.getResultsCount(); //target.state.get('found');
		console.log('results found: ' + found);
		var index = searchControl.getSelectedIndex(); //e.get('index');
		var results = searchControl.getResultsArray(); //target.state.get('results');
		if (results.length) {
			var result = results[index]; //getResult(index)
			//console.log(result.properties);
			var coords = result.geometry.getCoordinates();
			//TODO делаем что планировали с координатами найденной точки
			var name = result.properties.get('name');
			currName = name;
			currCoords = coords;

		} else {
			console.log('empty result!');
		}
		console.log("\n");
	});
	//map.controls.remove('geolocationControl'); // удаляем геолокацию
	//map.controls.remove('searchControl'); // удаляем поиск
	map.controls.remove('trafficControl'); // удаляем контроль трафика
	map.controls.remove('typeSelector'); // удаляем тип
	map.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
	map.controls.remove('zoomControl'); // удаляем контрол зуммирования
	map.controls.remove('rulerControl'); // удаляем контрол правил
}

ymaps.ready(init);
const submit = document.getElementById('marker-submit');
const nameInput = document.getElementById('name-input');
submit.addEventListener('click', () => {
	console.log('submit-click');
	if (currName == undefined) {
		alert('error, null fields');
		return;
	}
	addMarkerByName(currName, currCoords);


})
////////////////////////////////////////////////////////////////////////////////////////////////////////
function addMarkerByName(name, coords) {
	console.log(`addMarkerByName with name = ${name}`)
	if (name == '') {
		console.log('return from addMarker due to empty string')
		return;
	}
	let currRouteInArray;
	let indexOfCurrRoute;  //for debugging
	for(let i =0;i<Routes.length;i++){
		if(currentRoute.index == Routes[i].index){
			currRouteInArray=Routes[i];
			indexOfCurrRoute = i;
			break;
		}
	}
	let placemark = new ymaps.Placemark(coords,{},{
		iconColor:currentRoute.color
	})
	console.log('added placemark');
	let adress = new Pos(name, coords, placemark,currentRoute.color);
	
	currRouteInArray.push(adress);
	addAdressHTML(adress);
	console.log(`pushed ${name} ,${coords} to ${indexOfCurrRoute} array`);
	map.geoObjects.add(placemark);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////


function createRouteHTML(){

	if(createRouteHTML.counter == undefined){createRouteHTML.counter = 0;}
	createRouteHTML.counter++;
	console.log(createRouteHTML.counter);
	console.log('createRouteHTML');


	let route = document.createElement('div');
	route.index = createRouteHTML.counter;
	route.color = getRandomColor();
	route.className = "route";
	let span = document.createElement('span');
	span.className='route-span';
	route.insertAdjacentElement('afterbegin',span);
	span.insertAdjacentText('beforebegin','[')
	span.insertAdjacentText('afterend',']')
	
	let adressList = document.getElementById('adress-list');
	adressList.insertAdjacentElement('beforeend', route);


	
	let selectRoute = document.createElement('input')
	selectRoute.type = 'checkbox';
	selectRoute.className = 'select-route-checkbox';
	selectRoute.addEventListener('click',function(event){
		event.stopPropagation();
		currentRoute = selectRoute.parentNode;
		let boxes = document.getElementsByClassName('select-route-checkbox');
		Array.from(boxes).forEach((el)=>{
			el.checked = false;
		})
		selectRoute.checked = true;
	});
	route.insertAdjacentElement('beforeend',selectRoute);

	let deleteRoute = document.createElement('a');
	deleteRoute.class = 'delete-route-link'
	deleteRoute.addEventListener('click', function(event) {
		event.preventDefault();
		deleteRoute.parentNode.remove();
		for(let i =0;i<Routes.length;i++){
			if(Routes[i].index==route.index){
				Routes.splice(i,1)
			break;
			}
		}
	  });
	  deleteRoute.href='#';
	  deleteRoute.innerText = "Удалить путь";
	  route.insertAdjacentElement('beforeend',deleteRoute)



	currentRoute = selectRoute.parentNode;
	let boxes = document.getElementsByClassName('select-route-checkbox');
		Array.from(boxes).forEach((el)=>{
			el.checked = false;
		})
		selectRoute.checked = true;

		let toPush = new Array();
		toPush.index = createRouteHTML.counter;
		Routes.push(toPush)
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
function addAdressHTML(adress) {
	console.log(`addAdressHTML called`);
	//currentRoute
	let element = document.createElement('a'); // создание элемента
	element.href='#';
	element.className = "mark";
	element.innerHTML = adress.name+',\t';
	element.addEventListener('click', function(event) {
		event.preventDefault();
		let parentSpan = element.parentNode;
		let parentRoute = parentSpan.parentNode;
		console.log(parentRoute)
		console.log(`parentRoute.index is ${parentRoute.index}`)
		for(let i =0;i<Routes.length;i++){
			if(parentRoute.index==Routes[i].index){
				for(let j =0;j<Routes[i].length;j++){ 
					if(Routes[i][j] == adress){
						Routes[i].splice(j,1);
						break;
					}
				}
				break;
			}
		}
		parentSpan.removeChild(element);
		map.geoObjects.remove(adress.placemark);
	  });
	let placemarkList = currentRoute.querySelector('span')
	placemarkList.insertAdjacentElement('beforeend', element);
	//info-column beforeend

}
////////////////////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener('load', () => {
    setTimeout(()=>{
		// let kurskPlacemark = new ymaps.Placemark([51.730846, 36.193015]);
    // let moscowPlacemark = new ymaps.Placemark([55.755864, 37.617698]);
    // let voronezhPlacemark = new ymaps.Placemark([51.660781, 39.200296]);
    // let kursk = new Pos('Курск',[51.730846, 36.193015],kurskPlacemark);
    // let moscow = new Pos('Москва',[55.755864, 37.617698],moscowPlacemark);
    // let voronezh = new Pos('Воронеж',[51.660781, 39.200296],voronezhPlacemark);
    // map.geoObjects.add(kurskPlacemark);
    // map.geoObjects.add(moscowPlacemark);
    // map.geoObjects.add(voronezhPlacemark);
    // addAdressHTML(kursk);
    // addAdressHTML(moscow);
    // addAdressHTML(voronezh)
    // adresses.push(kursk);
    // adresses.push(moscow);
    // adresses.push(voronezh)
    },2000);
	document.getElementById('create-route').addEventListener('click', () => {
		createRouteHTML();
	})

	document.getElementById('calculate-button').addEventListener('click', () => {
		console.log('calculate called');
		let WholeGraph = new Array();
		for(let i =0;i<Routes.length;i++){
			for(let j =0;j<Routes[i].length;j++){
				if(!graphIncludes(WholeGraph,Routes[i][j]))
					WholeGraph.push(Routes[i][j])
			}
		}
		document.querySelectorAll('.path-div').forEach(e => e.remove());
		let minMaxLengthArr = [];
		let minMaxRouteArr = [];
		let shortestRouteCenter = [];
		minMaxLength =1e9;
		for(let i =0;i<WholeGraph.length;i++){
			let maxLength=0;
			let maxRoute;
			for(let j =0;j<Routes.length;j++){
				let tempRoute = getShortestRoute(Routes[j],WholeGraph[i]);
				if(tempRoute.pathLength>maxLength){
					maxLength = tempRoute.pathLength;
					maxRoute = tempRoute.path;
				}
			}
			if(maxLength<minMaxLength){minMaxLength=maxLength;}
				minMaxLengthArr.push(maxLength);
				minMaxRouteArr.push(maxRoute);
				shortestRouteCenter.push(WholeGraph[i]);
		}
		console.log(`maxlength is ${minMaxLength}`)
		for(let i =0;i<minMaxLengthArr.length;i++){
			console.log(`k;sjdhfal;kjsdhfqask;ljdhfa;skdjhfa;ksjdhf;aksjdhf ${i}`)
			console.log(minMaxLengthArr[i]);
			if(minMaxLengthArr[i]>minMaxLength*spread){
				console.log('splicesplicesplia;sljkdhf;kajsdhfk;ajshdf;kasjdhf;kj')
				minMaxLengthArr.splice(i,1);
				minMaxRouteArr.splice(i,1);
				shortestRouteCenter.splice(i,1);
				i--;
			}
		}
		console.log(minMaxLengthArr);
		console.log(minMaxRouteArr);
		console.log(shortestRouteCenter);
		let points =[];
		for(let i=0;i<minMaxRouteArr.length;i++){
			// points.push(minMaxRoute[i].coords);
			addPathHTMLShortestOverall(minMaxRouteArr[i],minMaxLengthArr[i],shortestRouteCenter[i]);
		}
	// 	console.log(points);
	// 	let routeMap = new ymaps.route(points, {
	// 		mapStateAutoApply: true,	
	// 	  });
		
	// 	  routeMap.then(function(rt) {
	// 		map.geoObjects.add(rt);
	// 	  });
	 })

// 	document.getElementById('confirm-button').addEventListener('click', () => {
// 		//console.log(adjMatrix);
// 		for (let i = 0; i < adresses.length; i++) {
// 			distMatrix[i][i] = 0;
// 			for (let j = i + 1; j < adresses.length; j++) {
// 					let rt;
// 					ymaps.route([adresses[i].coords, adresses[j].coords], {
// 						multiRoute: true
// 					}).done((route) => {
// 						rt = route;
// 						let path = rt.getActiveRoute();
// 						let distanceObj = path.properties.get("distance");
// 						let distance = Math.floor(distanceObj.value);
// 						distMatrix[i][j] = distance;
// 						distMatrix[j][i] = distance;
// 					})
				
// 			}
// 		}
//             setTimeout(()=>{
// let eccArr = [];
//                 for (let st = 0; st < adresses.length; st++){
//                     let distance2 = new Array(adresses.length);
//                     let visited = new Array(adresses.length);
//                     let index = 0;
//                     let u = 0;
//                 for (let i = 0; i < adresses.length; i++){
//                     distance2[i] = Infinity; visited[i] = false;
//                 }
//                     distance2[st] = 0;
//                         for (let count = 0; count < adresses.length-1; count++){
//                                     let min = Infinity;
//                                     for (let i = 0; i < adresses.length; i++){
//                                         if (!visited[i] && distance2[i]<=min){
//                                             min = distance2[i];
//                                             index = i;
//                                         }
//                                     }
//                                     u = index;
//                                     visited[u] = true;
//                                     for (let i = 0; i<adresses.length; i++){
//                                         if (!visited[i] && distMatrix[u][i] != Infinity && distance2[u] != Infinity && (distance2[u]+distMatrix[u][i]<distance2[i])){
//                                             distance2[i] = distance2[u]+distMatrix[u][i];
//                                         }
//                                     }
                                    
//                         }
//                         console.log(distance2); 
//                                         eccArr.push(distance2.max());
//                     }
//                     console.log(eccArr);
//                     let result = [];
//                     let min = eccArr.min() * 1.05;
//                     for(let i=0;i<eccArr.length;i++){
//                         if(eccArr[i]<min){
//                             result.push(new pair(i,eccArr[i]))
//                         }
//                     }
//                     console.log(result);
//                     document.getElementById('default-show').style.display = 'block';
//                     document.getElementById('matrix-input-show').style.display = 'none';
//                     map.setCenter(adresses[result[0].index].coords);
//                     for(let i =0;i<result.length;i++){
//                         let coord = adresses[result[i].index].coords;
//                         var placemark = new ymaps.Placemark(coord, {}, {
//                             iconColor: '#FF0000'
//                         });
                        
//                         map.geoObjects.remove(adresses[result[i].index].placemark);
//                         map.geoObjects.add(placemark);
                         
//                     }

//             },1000)
//         console.log("end")
// 	})

})



function graphIncludes(graph,point){
	for(let i =0;i<graph.length;i++){
		if(point.coords==graph[i].coords)
		return true;
	}
	return false;
}

function distanceBetween(placemark1, placemark2) {
	// Get coordinates of both placemarks
	var coords1 = placemark1.geometry.getCoordinates();
	var coords2 = placemark2.geometry.getCoordinates();
  
	// Calculate distance between coordinates using Yandex Maps API
	var distance = ymaps.coordSystem.geo.getDistance(coords1, coords2)/1000;
	return Number(distance.toFixed(1));


					
  }
function createDistMatrix(graph){
	let matrix = new Array(graph.length);
	for (var i = 0; i < matrix.length; i++) {
		matrix[i] = new Array(graph.length);
	  }
	for (let i = 0; i < graph.length; i++) {
		matrix[i][i] = 0;
		for (let j = i + 1; j < graph.length; j++) {
				let distance = distanceBetween(graph[i].placemark,graph[j].placemark)
				matrix[i][j] = distance;
				matrix[j][i] = distance;
		}
	}
	return matrix;
}
function getShortestRoute(routeInst,from){
	let route = routeInst.slice();
	route.push(from);
	let distMatrix = createDistMatrix(route);
	console.log(route);
	console.log(distMatrix)
	let path= new Array();
	let pathLength=0;
	let beenTo = new Array(route.length).fill(0);
	let currentPosition = route.length-1;
	beenTo[currentPosition] = true;
	for(let i =0;i<route.length-1;i++){

		let minDist=1e6;
		let minDistIndex = 0;
		for(let j =0;j<route.length;j++){
			if(j==currentPosition){continue;}
			if(distMatrix[currentPosition][j]<minDist&&!beenTo[j]){
				minDist = distMatrix[currentPosition][j]
				minDistIndex = j;
				
			}
		}
		if(currentPosition == minDistIndex){console.log("ACHTUNG LISHNYAYA PROHODKA")}
		currentPosition = minDistIndex;
		beenTo[currentPosition]=true;
		pathLength+=minDist;
		path.push(route[minDistIndex]);
	}
	let ret={
		path:path,
		pathLength:pathLength,
	};
	console.log(ret);
	console.log(`shortest route returned ${pathLength}`)
	return ret;
}
function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
  }
function addPathHTMLShortestOverall(path,length,center){
	let pathsHTML = document.getElementById('paths-info');
	let pathDiv = document.createElement('div');
	pathDiv.className = 'path-div';
	pathsHTML.insertAdjacentElement('beforeend',pathDiv);
	let span = document.createElement('span');
	span.innerText +="Центр: "+center.name+". Самый длинный путь: ";
	for(let i=0;i<path.length;i++){
		span.innerText += path[i].name+', ';
	}
	span.innerText+=length;
pathDiv.insertAdjacentElement('beforeend',span);
}
/*
let rt;

ymaps.route(['Southern Butovo', 'Moscow, metro Park Kultury'], {
    multiRoute: true
}).done(function (route) {
    rt = route;
    route.options.set("mapStateAutoApply", true);
    map.geoObjects.add(route);
    var path = rt.getActiveRoute(); 
    console.log(path.properties.get("distance").text);
}, function (err) {
    throw err;
}, this);





*/

//searchMode 
//максим ты сможешь kekw

	// let matrixShow = document.getElementById('matrix-input-show');
		// matrixShow.style.display = "block";
		// let table = document.getElementById('matrix-input-table');
		// let tr = document.createElement('tr');
		// table.insertAdjacentElement('beforeend', tr);
		// let th = document.createElement('th');
		// th.innerHTML = 'index';
		// tr.insertAdjacentElement('beforeend', th);
		// for (let i = 0; i < adresses.length; i++) {
		// 	let th = document.createElement('th');
		// 	th.innerHTML = i + 1;
		// 	tr.insertAdjacentElement('beforeend', th);

		// }
		// for (let i = 0; i < adresses.length; i++) {
		// 	let tr = document.createElement('tr');
		// 	table.insertAdjacentElement('beforeend', tr);
		// 	let th = document.createElement('th');
		// 	th.innerHTML = i + 1;
		// 	tr.insertAdjacentElement('beforeend', th);
		// 	for (let j = 0; j < adresses.length; j++) {
		// 		if (j < i) {
		// 			let td = document.createElement('td');
		// 			tr.insertAdjacentElement('beforeend', td);
		// 		} else if (j == i) {
		// 			let td = document.createElement('td');
		// 			td.innerHTML = 0;
		// 			tr.insertAdjacentElement('beforeend', td);
		// 		} else {
		// 			let td = document.createElement('td');
		// 			tr.insertAdjacentElement('beforeend', td);
		// 			let input = document.createElement('input');
		// 			input.type = 'checkbox';
		// 			input.onclick = () => {
		// 				adjMatrix[i][j] = input.checked;
		// 			}
		// 			td.insertAdjacentElement('beforeend', input)
		// 		}
		// 	}
		// }




	// 	let rt;
	// ymaps.route([coords1, coords2], {
	// 	multiRoute: true
	// }).done((route) => {
	// 	rt = route;
	// 	let path = rt.getActiveRoute();
	// 	let distanceObj = path.properties.get("distance");
	// 	let distance = Math.floor(distanceObj.value);
	// 	console.log(distance);
	// })