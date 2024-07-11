mapboxgl.accessToken = mapToken;
console.log(data);
const map = new mapboxgl.Map({
    container: 'map', 
    center: data.geometry.coordinates,
    zoom: 12
});

const el = document.createElement('div');
el.innerHTML = '<i class="fa fa-home fs-4 text-align-center text-danger position-absolute" style="top: 50%; left: 50%; transform: translate(-50%, -50%); text-shadow: 0 0 5px white;"></i>';
el.style.width = '150px';
el.style.height = '150px';
el.style.backgroundColor = '#f002';
el.className= 'rounded-circle border border-danger shadow d-flex justify-content-center align-content-center position-relative';

const marker1 = new mapboxgl.Marker({color: 'red', element: el})
        .setLngLat(data.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25, className: ''})
        .setHTML(`<h3>${data.location}, ${data.country}</h3><div>Exact location will be provided after booking!</div>`))
        .addTo(map);
