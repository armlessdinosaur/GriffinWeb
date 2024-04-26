 class Stop {
    constructor(stopNumber){
        this.stopNumber = stopNumber;
        this.APIUrl = "https://www.zditm.szczecin.pl/api/v1/displays/"+stopNumber;
        this.departuresList = [];
        this.stopName = "";
        this.createStopBoard();
    }
    createStopBoard(){
        //Komunikuje się z API by nadać nazwę, utworzyc sekcje z przystankiem i wszystko inne
        let stopBoard = document.createElement("section");
        stopBoard.className = "stopBoard";
        fetch(this.APIUrl)
            .then((response) => response.json())
            .then(result => {
                this.stopName = result.stop_name; //nadaje nazwę przystankowi
                console.log(this.stopName);
                this.documentHeader = document.createElement("h3");
                this.documentHeader.appendChild(document.createTextNode(this.stopName + " (" + this.stopNumber + ") "));
                stopBoard.appendChild(this.documentHeader);
                //this.createDeparturesList();
            });

            //tworzy początkową listę przystanków
            fetch(this.APIUrl)
            .then((response) => response.json())
            .then(result => {
                this.departuresList = result.departures; //nadaje nazwę przystankowi
                console.log(this.departuresList[0]);
                this.documentDepartureList = [];
                for(let i = 0; i < 5; i++){
                    this.documentDepartureList[i] = document.createElement("li");
                    if(this.departuresList[i].time_real != null)
                    {
                        this.documentDepartureList[i].appendChild(document.createTextNode(this.departuresList[i].line_number + " " + this.departuresList[i].direction + " → " + this.departuresList[i].time_real + " min"));
                    }else{
                        this.documentDepartureList[i].appendChild(document.createTextNode(this.departuresList[i].line_number + " " + this.departuresList[i].direction + " → " + this.departuresList[i].time_scheduled));
                    }
                    
                    stopBoard.appendChild(this.documentDepartureList[i]);
                }
            });
        departureBoard.appendChild(stopBoard);
    }
}

const departureBoard = document.getElementById("departureBoard");
var stops = []; //tworzy array przystanków
stops[0] = new Stop(13331);
stops[1] = new Stop(13321);
console.log(stops[0].stopName + stops[0].stopNumber + stops[0].APIUrl);


