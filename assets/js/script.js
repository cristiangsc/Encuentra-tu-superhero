$(function() {
    $(".show").css("display", "none"); // oculta card superHero
    $("#buscar").click(() => {
        buscarSuperHero() // buscar el superHero
    })

    $(document).keypress(e => {
        if (e.which == 13) {
            buscarSuperHero() // buscar superHero al precionar Enter
        }
    })
})

let buscarSuperHero = () => {
    let id_personaje = $("#input_busqueda").val() // recupera el id del superHero en el DOM
    validacion(id_personaje) ? (getPersonaje(id_personaje)) : alert("Debe ingresar un numero entero") // If ternario que valida si es un ID numerio
}

// valida a traves de una expresión regular el ID numerico, devulve true o false
let validacion = (id) => {
    let expression = /^\d{1,3}$/;
    return expression.test(id) ? true : false
}

// buscar el id superHero en la API, a traves de try-catch se valida si el id existe en la API
let getPersonaje = (id) => {

    $.ajax({
        type: "GET",
        url: `https://superheroapi.com/api.php/3033707663582647/${id}`,
        success: function(response) {
            try {
                $(".show").css("display", "block")
                $(".card-title").text("NOMBRE: " + response.name)
                $("#super-heroe").attr("src", response.image.url)
                $("#conexions").text("Conexiones: " + response.connections["group-affiliation"])
                $("#publicado").text("Publicado por: " + response.biography.publisher)
                $("#ocupacion").text("Ocupación: " + response.work.occupation)
                $("#aparicion").text("Primera Aparición: " + response.biography["first-appearance"])
                $("#altura").text(`Altura:  ${response.appearance.height[0]} - ${response.appearance.height[1]}`)
                $("#peso").text(`Peso:  ${response.appearance.weight[0]} - ${response.appearance.weight[1]}`)
                $("#alianza").text(`Alianzas:  ${response.biography.aliases}`)
                $("#input_busqueda").val("")
                limpiar_grafico()
                generarGrafico(response)
            } catch (error) {

                alert("El ID de SuperHero no existe")
                $(".show").css("display", "none");
                limpiar_grafico();

            }
        }
    })
}

// función que valida si el superHero tiene super poderes para la confección del gráfico
let validar = (personaje) => {
    for (const key in personaje.powerstats) {
        return (personaje.powerstats[key] == 'null') ? false : true
    }
};

// se genera el gráfico si el superHero tiene super poderes de lo contrario muestra un mensaje
function generarGrafico(personaje) {
    if (validar(personaje)) {
        let options = {
            title: {
                text: `ESTADÍSTICA DE PODER ${personaje.name}`
            },

            data: [{
                type: "pie",
                startAngle: 45,
                showInLegend: "true",
                legendText: "{label}",
                indexLabel: "{label} ({y})",
                yValueFormatString: "#,##0.#" % "",
                dataPoints: [
                    { label: "Combate", y: personaje.powerstats.combat },
                    { label: "Resistencia", y: personaje.powerstats.durability },
                    { label: "Inteligencia", y: personaje.powerstats.intelligence },
                    { label: "Poder", y: personaje.powerstats.power },
                    { label: "Velocidad", y: personaje.powerstats.speed },
                    { label: "Fuerza", y: personaje.powerstats.strength }
                ]
            }]
        };
        $("#grafico").CanvasJSChart(options)
    } else {
        $("#grafico").text("No hay datos de super poderes que mostrar!!!")
            // ).text = "No hay datos de super poderes que mostrar!!!";
    }
}

// función que limpia el gráfico para una nueva busqueda.
function limpiar_grafico() {
    $("#grafico").empty()
}