 class Stop {
    constructor(stopNumber){
        this.stopNumber = stopNumber;
        this.APIUrl = "https://www.zditm.szczecin.pl/api/v1/displays/"+stopNumber;
        this.departuresList = [];
        this.stopName = "";
    }

}

function createDepartureBoard(){
  //tworzy CAŁĄ tablicę z odjazdami
    const departureBoard = document.getElementById("departureBoard");
    let stopBoards = [];
    let documentHeaders = [];
    if (userPreferences.stops != null){
      for (let i = 0; i < userPreferences.stops.length; i++){
        stopBoards[i] = document.createElement("section");
        fetch(userPreferences.stops[i].APIUrl)
            .then((response) => response.json())
            .then(result => {
                //Komunikuje się z API by nadać nazwę, utworzyc sekcje z przystankiem i wszystko inne
                console.log(userPreferences.stops[i]);
                userPreferences.stops[i].stopName = result.stop_name; //nadaje nazwę przystankowi
                console.log(userPreferences.stops[i].stopName);
                documentHeaders[i] = document.createElement("h3");
                documentHeaders[i].appendChild(document.createTextNode(userPreferences.stops[i].stopName + " (" + userPreferences.stops[i].stopNumber + ") "));
                stopBoards[i].appendChild(documentHeaders[i]);

                //tworzy listę przystanków
                userPreferences.stops[i].departuresList = result.departures; //nadaje nazwę przystankowi
                let documentDepartureList = [];
                for(let j = 0; j < 5; j++){ //dajemy inny iterator, żeby się nie myliło
                    documentDepartureList[j] = document.createElement("li");
                    if(userPreferences.stops[i].departuresList[j].time_real != null)
                    {
                        documentDepartureList[j].appendChild(document.createTextNode(userPreferences.stops[i].departuresList[j].line_number + " " + userPreferences.stops[i].departuresList[j].direction + " → " + userPreferences.stops[i].departuresList[j].time_real + " min"));
                    }else{
                        documentDepartureList[j].appendChild(document.createTextNode(userPreferences.stops[i].departuresList[j].line_number + " " + userPreferences.stops[i].departuresList[j].direction + " → " + userPreferences.stops[i].departuresList[j].time_scheduled));
                    }
                    if("QWERTYUIOPASDFGHJKLZXCVBNM".includes(userPreferences.stops[i].departuresList[i].line_number)){
                        documentDepartureList[j].className = "expressBus";
                    }else if(Number(userPreferences.stops[i].departuresList[i].line_number) <= 12){
                        documentDepartureList[j].className = "tram";
                    }else{
                        documentDepartureList[j].className = "bus";
                    }
                    stopBoards[i].appendChild(documentDepartureList[j]);

                }
            });

      }
      //wypluwa każdą listę przystanków na ekran
      for (let i = 0; i < stopBoards.length; i++){
        departureBoard.appendChild(stopBoards[i]);
      }
    }
}

function clearDepartureBoard(){
  const departureBoard = document.getElementById("departureBoard");
  departureBoard.innerHTML = "";
}

function addStop(){
  userPreferences.addStop(document.getElementById("stopField").value);
  userPreferences.saveToLocalStorage();
  location.reload();
}

function removeStop(){
  for(let i = 0; i<userPreferences.stops.length; i++){
    if(userPreferences.stops[i].stopNumber == document.getElementById("stopField").value){
      userPreferences.stops.splice(i,1); //usuwa ten konrketny wpis
    }
  }
  userPreferences.saveToLocalStorage();
  location.reload();
}
var userPreferences = {
  stops: [],
  addStop(stopNumber){
      this.stops.push(new Stop(stopNumber));
  },
  saveToLocalStorage(){
    localStorage.setItem('stops',JSON.stringify(this.stops));
  },
  readFromLocalStorage(){
    if(JSON.parse(localStorage.getItem('stops'))!=null){
      this.stops = JSON.parse(localStorage.getItem('stops'));
    }
  }
};

//userPreferences.addStop(13331);
//userPreferences.addStop(13321);
//userPreferences.addStop(14011);
//userPreferences.saveToLocalStorage();
userPreferences.readFromLocalStorage();
createDepartureBoard();

document.getElementById("addButton").addEventListener("click", addStop);
document.getElementById("removeButton").addEventListener("click", removeStop);
