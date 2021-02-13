var mymap = L.map('mapid').setView([44.772816, 20.474970], 5); // učitavanje mape

L.tileLayer("https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=49KargoUBhoG7aOlHfZL", {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap); // dodavanje layera, izgleda mape

var dugme = $("#button"); // selektovanje glavnog dugmeta

var lokacija1;     // deklaracija promenljivih
var lokacija2;

var lat1;
var lon1;
var lat2;
var lon2;

var marker1;
var marker2;

var polyline;

function ucitajPodatke(data) {         // callback funkcije za pozivanje jsona
    lat1 = data.data[0].latitude;
    lon1 = data.data[0].longitude;
}

function ucitajPodatke1(data) {
    lat2 = data.data[0].latitude;
    lon2 = data.data[0].longitude;
}

$("#potvrdi1").click(function() {       // click na dugme potvrdi
    lokacija1 = $("#polje1").val();
    $.getJSON("https://api.positionstack.com/v1/forward?access_key=a7a02e4730bf8564e45aac6e0d3a3704&query="+lokacija1,
    ucitajPodatke);
    if($("#polje1").val() == "") {   // ako je polje prazno da pocrveni i promeni placeholder
        $("#polje1").attr('placeholder','Molimo Vas da popunite sva polja...');
        $("#polje1").css("border-color", "red");
    } 
    if($("#polje1").val()!="") {  // ako dobro unese da pozeleni
        $("#polje1").css("border-color", "green");
    }
})

$("#potvrdi2").click(function() {
    lokacija2 = $("#polje2").val();
    $.getJSON("https://api.positionstack.com/v1/forward?access_key=a7a02e4730bf8564e45aac6e0d3a3704&query="+lokacija2,
    ucitajPodatke1);
    if($("#polje2").val() == "") {
        $("#polje2").attr('placeholder','Molimo Vas da popunite sva polja...');
        $("#polje2").css("border-color", "red");
    }
    if($("#polje2").val()!="") {
        $("#polje2").css("border-color", "green");
    }
})

$("#izbrisi1").click(function() {   // click na dugme izbrisi
    $("#polje1").val("");  // postaje prazno
    $("#polje1").css("border-color", "rgb(146, 146, 146)"); // vraca boju okvira
    lat1 = undefined; // ponistava lat i lon
    lon1 = undefined;
    if (marker1 != undefined) {   // ako postoji neki pin brise ga
        mymap.removeLayer(marker1);
    }
    if(polyline != undefined) {  // ako postoji putanja brise je
        mymap.removeLayer(polyline);
    }
})

$("#izbrisi2").click(function() {
    $("#polje2").val("");
    $("#polje2").css("border-color", "rgb(146, 146, 146)");
    lat2 = undefined;
    lon2 = undefined;
    if (marker2 != undefined) {
        mymap.removeLayer(marker2);
    };
    if(polyline != undefined) {
        mymap.removeLayer(polyline);
    }
})

dugme.click(function() {
    if (marker1 != undefined) {
        mymap.removeLayer(marker1);
    };

    if (marker2 != undefined) {
        mymap.removeLayer(marker2);
    };

    if(polyline != undefined) {
        mymap.removeLayer(polyline);
    }

    if($("#polje1").val() == "") {
        $("#polje1").attr('placeholder','Molimo Vas da popunite sva polja...');
        $("#polje1").css("border-color", "red");
    } 
    
    if($("#polje2").val() == "") {
        $("#polje2").attr('placeholder','Molimo Vas da popunite sva polja...');
        $("#polje2").css("border-color", "red");
    } 
    
    if(lat1 == undefined || lon1 == undefined) {
        alert("Nepostojeća prva lokacija");
        $("#polje1").css("border-color", "red");
    } 
    
    if(lat2 == undefined || lon2 == undefined) {
        alert("Nepostojeća druga lokacija");
        $("#polje2").css("border-color", "red");
    }

    marker1 = L.marker([lat1, lon1]).addTo(mymap);
    marker2 = L.marker([lat2, lon2]).addTo(mymap);

    var latlngs = Array();
    latlngs.push(marker1.getLatLng());
    latlngs.push(marker2.getLatLng());
    polyline = L.polyline(latlngs, {color: '#00f2ff'}).addTo(mymap);
    mymap.fitBounds(polyline.getBounds());
    
    var radlat1 = Math.PI * lat1 / 180;   // formula za distancu izvor internet
    var radlat2 = Math.PI * lat2 / 180;
    var radlon1 = Math.PI * lon1 / 180;
    var radlon2 = Math.PI * lon2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;

    $("#tekst").html(Math.round(dist*100)/100);
    $("#tekst").css("color", "black");
});






