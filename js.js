document.addEventListener("DOMContentLoaded", function () {

    const canvas = document.querySelector("#canvas")
    const ctx = canvas.getContext("2d")

    let dibujar = false;
    let borrar = false;

    let activo = false;

    let height = canvas.height
    let width = canvas.width

    let coordenadas1= 0;
    let coordenadas2= 0;

   

    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fill();

    document.getElementById("lapiz").addEventListener("click", function() { /* switch estado lapiz */
        if(dibujar){
            dibujar = false;
        }else{
            dibujar = true;
            borrar = false;
        }
        console.log(dibujar);
    });
    document.getElementById("borrar").addEventListener("click", function() {
        if(borrar){
            borrar = false
        }else{
            borrar = true
            dibujar = false
        }
        console.log(borrar);
    });
    document.getElementById("limpiar").addEventListener("click", function(){
        dibujar = false
        borrar = false
        ctx.clearRect(0,0,width,height)
    });
    
    canvas.addEventListener("mousedown", function (){
        activo=true;
    })
    canvas.addEventListener("mousedown", mouseClick);

    canvas.addEventListener("mouseup", function(){
        activo=false;
    })

    function mouseClick() {                 //FUNCION PARA COMENZAR A PINTAR EN EL CANVAS
        if (activo) {
            coordenadas1 = getCoordinates(event);
                canvas.addEventListener("mousemove", function () {
                        draw(ctx, event);
                })
        }

    function getCoordinates(event) {        //RETORNA LAS COORDENADAS DEL PUNTERO
            return {
                    x: event.clientX,
                    y: event.clientY
            };
    }

    function draw(){
        
        let colorLapiz = document.getElementById("colorLapiz").value;
        let grosorLapiz = document.getElementById("grosorLapiz").value;

        if((dibujar || borrar ) && (activo)){
            coordenadas2=getCoordinates(event);
            ctx.lineWidth= grosorLapiz;
            if (borrar)
            ctx.strokeStyle = "#ffffff";
    else {
        
            ctx.strokeStyle = colorLapiz;
    }

    ctx.beginPath();
    ctx.moveTo(coordenadas1.x, coordenadas1.y);
    ctx.lineTo(coordenadas2.x, coordenadas2.y);
    ctx.stroke();
    coordenadas1 = coordenadas2;
        }   
    }
}})

