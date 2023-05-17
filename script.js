let map;
const defaultCenter = [60.99136593427641, 42.441497413767465];
let adresses = [];
let currName, currCoords;
let adjMatrix = new Array(adresses.length);
let distMatrix = new Array(adresses.length);
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
	constructor(name, coords, placemark) {
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

function addMarkerByName(name, coords) {
	console.log(`addMarkerByName with name = ${name}`)
	if (name == '') {
		console.log('return from addMarker due to empty string')
		return;
	}
	let placemark = new ymaps.Placemark(coords)
	console.log('added placemark');
	let adress = new Pos(name, coords, placemark);
	adresses.push(adress);
	addAdressHTML(adress);
	console.log(`pushed ${name} ,${coords} to adresses array`);
	map.geoObjects.add(placemark);

}

function addAdressHTML(adress) {
	console.log(`addAdressHTML called`);
	let tag = document.getElementById('adress-list');
	let element = document.createElement('div');
	element.className = "marker";
	element.innerHTML = adress.name + ' ' + 'index: ' + adresses.length;
	console.log('addAdressHTML worked');
	tag.insertAdjacentElement('beforeend', element);

	//info-column beforeend

}
window.addEventListener('load', () => {
    setTimeout(()=>{let kurskPlacemark = new ymaps.Placemark([51.730846, 36.193015]);
    let moscowPlacemark = new ymaps.Placemark([55.755864, 37.617698]);
    let voronezhPlacemark = new ymaps.Placemark([51.660781, 39.200296]);
    let kursk = new Pos('Курск',[51.730846, 36.193015],kurskPlacemark);
    let moscow = new Pos('Москва',[55.755864, 37.617698],moscowPlacemark);
    let voronezh = new Pos('Воронеж',[51.660781, 39.200296],voronezhPlacemark);
    map.geoObjects.add(kurskPlacemark);
    map.geoObjects.add(moscowPlacemark);
    map.geoObjects.add(voronezhPlacemark);
    addAdressHTML(kursk);
    addAdressHTML(moscow);
    addAdressHTML(voronezh)
    adresses.push(kursk);
    adresses.push(moscow);
    adresses.push(voronezh)
    },2000);
	document.getElementById('delete-marker').addEventListener('click', () => {
		let index = Number(document.getElementById('delete-input').value);
		let toRemove = index - 1;
		console.log(index);
		if (!(Number.isInteger(index))) {
			alert('Не число/число не целое');
			return;
		}
		if (index <= 0 && index > adresses.length) {
			alert("Неверный индекс")
		}
		let arr = document.getElementsByClassName('marker');
		arr[toRemove].remove();
		map.geoObjects.remove(adresses[toRemove].placemark);
		adresses.splice(toRemove, 1);
		console.log(adresses);
	})

	document.getElementById('calculate-button').addEventListener('click', () => {
		let defaultShow = document.getElementById('default-show');

		for (let i = 0; i < adresses.length; i++) {
			adjMatrix[i] = new Array(adresses.length);
			distMatrix[i] = new Array(adresses.length);
		}
		console.log(adjMatrix);
		defaultShow.style.display = 'none';
		let matrixShow = document.getElementById('matrix-input-show');
		matrixShow.style.display = "block";
		let table = document.getElementById('matrix-input-table');
		let tr = document.createElement('tr');
		table.insertAdjacentElement('beforeend', tr);
		let th = document.createElement('th');
		th.innerHTML = 'index';
		tr.insertAdjacentElement('beforeend', th);
		for (let i = 0; i < adresses.length; i++) {
			let th = document.createElement('th');
			th.innerHTML = i + 1;
			tr.insertAdjacentElement('beforeend', th);

		}
		for (let i = 0; i < adresses.length; i++) {
			let tr = document.createElement('tr');
			table.insertAdjacentElement('beforeend', tr);
			let th = document.createElement('th');
			th.innerHTML = i + 1;
			tr.insertAdjacentElement('beforeend', th);
			for (let j = 0; j < adresses.length; j++) {
				if (j < i) {
					let td = document.createElement('td');
					tr.insertAdjacentElement('beforeend', td);
				} else if (j == i) {
					let td = document.createElement('td');
					td.innerHTML = 0;
					tr.insertAdjacentElement('beforeend', td);
				} else {
					let td = document.createElement('td');
					tr.insertAdjacentElement('beforeend', td);
					let input = document.createElement('input');
					input.type = 'checkbox';
					input.onclick = () => {
						adjMatrix[i][j] = input.checked;
					}
					td.insertAdjacentElement('beforeend', input)
				}
			}
		}
	})
	document.getElementById('confirm-button').addEventListener('click', () => {
		//console.log(adjMatrix);
		for (let i = 0; i < adresses.length; i++) {
			distMatrix[i][i] = 0;
			for (let j = i + 1; j < adresses.length; j++) {
				if (adjMatrix[i][j] == 0 || adjMatrix[i][j] == undefined || adjMatrix[i][j] == null) {
					distMatrix[i][j] = Infinity;
					distMatrix[j][i] = Infinity;
				} else {
					let rt;
					ymaps.route([adresses[i].coords, adresses[j].coords], {
						multiRoute: true
					}).done((route) => {
						rt = route;
						let path = rt.getActiveRoute();
						let distanceObj = path.properties.get("distance");
						let distance = Math.floor(distanceObj.value);
						distMatrix[i][j] = distance;
						distMatrix[j][i] = distance;
						//console.log(distMatrix);
                        //Dijkstra start
		
		//D[j] == distMatrix[i][j];
		//Dijkstra end
					})
				}
			}
		}
            setTimeout(()=>{
let eccArr = [];
                for (let st = 0; st < adresses.length; st++){
                    let distance2 = new Array(adresses.length);
                    let visited = new Array(adresses.length);
                    let index = 0;
                    let u = 0;
                for (let i = 0; i < adresses.length; i++){
                    distance2[i] = Infinity; visited[i] = false;
                }
                    distance2[st] = 0;
                        for (let count = 0; count < adresses.length-1; count++){
                                    let min = Infinity;
                                    for (let i = 0; i < adresses.length; i++){
                                        if (!visited[i] && distance2[i]<=min){
                                            min = distance2[i];
                                            index = i;
                                        }
                                    }
                                    u = index;
                                    visited[u] = true;
                                    for (let i = 0; i<adresses.length; i++){
                                        if (!visited[i] && distMatrix[u][i] != Infinity && distance2[u] != Infinity && (distance2[u]+distMatrix[u][i]<distance2[i])){
                                            distance2[i] = distance2[u]+distMatrix[u][i];
                                        }
                                    }
                                    
                        }
                        console.log(distance2); 
                                        eccArr.push(distance2.max());
                    }
                    console.log(eccArr);
                    let result = [];
                    let min = eccArr.min() * 1.05;
                    for(let i=0;i<eccArr.length;i++){
                        if(eccArr[i]<min){
                            result.push(new pair(i,eccArr[i]))
                        }
                    }
                    console.log(result);
                    document.getElementById('default-show').style.display = 'block';
                    document.getElementById('matrix-input-show').style.display = 'none';
                    map.setCenter(adresses[result[0].index].coords);
                    for(let i =0;i<result.length;i++){
                        let coord = adresses[result[i].index].coords;
                        var placemark = new ymaps.Placemark(coord, {}, {
                            iconColor: '#FF0000'
                        });
                        
                        map.geoObjects.remove(adresses[result[i].index].placemark);
                        map.geoObjects.add(placemark);
                         
                    }

            },1000)
        console.log("end")
	})

})
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