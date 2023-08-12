let numCandidatesGlobal = 0;
let candidates = [];

window.addEventListener('beforeunload', function() {
    localStorage.removeItem('candidates');
});

class Credito {
    constructor(nombre, sueldo, montoCredito, meses) {
        this.nombre = nombre;
        this.sueldo = sueldo;
        this.credito = montoCredito;
        this.meses = meses;
        this.tasaActualAnual = 0.3;
        this.LimiteEndeudamientoMensual = 0.25;
        this.tasaActualMensual = this.tasaActualAnual / 12;
        this.montoCreditoMensual = this.credito / this.meses;
        this.EndeudamientoProyectado = this.montoCreditoMensual / this.sueldo;
        this.EstadoCredito = false;
        this.resultado = "Rechazado: ";
        this.cuotaMensual = (() => {
            const factor = Math.pow((1 + this.tasaActualMensual), this.meses);
            return this.credito * (this.tasaActualMensual * factor) / (factor - 1);
        })();
        this.CreditoAPagarTotal = this.cuotaMensual * this.meses;
        this.calificar();
    }

    calificar() {
        if (this.EndeudamientoProyectado>=this.LimiteEndeudamientoMensual){
            this.resultado = this.resultado + " Sobrepasas tu límite de endeudamiento mensual: ("+ this.LimiteEndeudamientoMensual + ") y tu score de endeudamiento es: (" + parseFloat(this.EndeudamientoProyectado.toFixed(2)) + ")";
        }else if (this.sueldo<1000000 && (this.credito > 0.2 * this.sueldo)){
            this.resultado = "Aprobado con reparos: Debes dejar garantías por tu crédito. " +  this.credito + ", Tiempo del crédito: " + this.meses + " meses, Tasa otorgada: " + this.tasaActualAnual + ", Cuota mensual a pagar: " + this.cuotaMensual.toFixed(0)  ;
            this.EstadoCredito = true;
        }else {
            this.resultado = "Aprobado listo para retirar: " + " El crédito solicitado es: " + this.credito + ", Tiempo del crédito: " + this.meses + " meses, Tasa otorgada: " + this.tasaActualAnual + ", Cuota mensual a pagar: " + this.cuotaMensual.toFixed(0);
            this.EstadoCredito = true;
        }
    
    }
}

function askForCandidates() {
    document.getElementById('candidates').innerHTML = '';
    document.getElementById('results').innerHTML = '';
    const numCandidates = document.getElementById('numCandidates').value;
    numCandidatesGlobal += Number(numCandidates);

    for (let i = candidates.length; i < candidates.length + Number(numCandidates); i++) {
       /* let candidateForm = document.createElement('form');
        candidateForm.innerHTML = `
            <h3>Candidato ${i + 1}</h3>
            <input id="name${i}" type="text" placeholder="Nombre"><br>
            <input id="sueldo${i}" type="number" placeholder="Remuneración mensual"><br>
            <input id="credito${i}" type="number" placeholder="Monto de crédito"><br>
            <input id="meses${i}" type="number" placeholder="Meses para pagar">
        `;  */
        let candidateForm = document.createElement('form');
        candidateForm.innerHTML = `
        <div class="form-group">
            <h3>Candidato ${i + 1}</h3>
            <input class="form-control" id="name${i}" type="text" placeholder="Nombre"><br>
            <input class="form-control" id="sueldo${i}" type="number" placeholder="Remuneración mensual"><br>
            <input class="form-control" id="credito${i}" type="number" placeholder="Monto de crédito"><br>
            <input class="form-control" id="meses${i}" type="number" placeholder="Meses para pagar">
        </div>`;

        document.getElementById('candidates').appendChild(candidateForm);
    }
}

function evaluateCandidates() {
    for (let i = candidates.length; i < numCandidatesGlobal; i++) {
        let nombre = document.getElementById(`name${i}`).value;
        let sueldo = parseInt(document.getElementById(`sueldo${i}`).value);
        let credito = parseInt(document.getElementById(`credito${i}`).value);
        let meses = parseInt(document.getElementById(`meses${i}`).value);

        let candidate = new Credito(nombre, sueldo, credito, meses);
        candidates.push(candidate); // Agrega los candidatos recién ingresados a la variable global
    }

    document.getElementById('candidates').innerHTML = ''; // Limpia la sección de ingreso de candidatos

    displayResults();
    guardarDatos(); // Llama a la función para guardar los datos
}


function displayResults() {
    let results = document.getElementById('results');
    results.innerHTML = '';
    let start = candidates.length - numCandidatesGlobal;
    for (let i = start; i < candidates.length; i++) {
        let resultado = "";
        let cardHeaderClass = "bg-success text-white"; // Clase para tarjetas aprobadas
        let cardBodyClass = "text-success";

        if (!candidates[i].EstadoCredito) {
            resultado = `Que pena, ${candidates[i].nombre}: lamento informarte que tu crédito está  ` + candidates[i].resultado;
            cardHeaderClass = "bg-danger text-white"; // Clase para tarjetas rechazadas
            cardBodyClass = "text-danger";
        } else {
            resultado = "FELICITACIONES, " + candidates[i].nombre + " , tu crédito está " + candidates[i].resultado + " y el total del crédito a pagar será de: " + candidates[i].CreditoAPagarTotal.toFixed(0);
        }

        let card = `
        <div class="card">
            <div class="card-header ${cardHeaderClass}">
                Resultado para ${candidates[i].nombre}
            </div>
            <div class="card-body ${cardBodyClass}">
                <p class="card-text">${resultado}</p>
            </div>
        </div>
        <br>`;

        results.innerHTML += card;
    }
}

function traeMayorCreditoE() {
    if (candidates.length === 0) return null;
    let maxCred = Math.max.apply(Math, candidates.map(c => c.credito));
    let MayorCreditoE = candidates.filter(c => c.credito === maxCred);
    return MayorCreditoE;
}

function MuestraMayorCredito() {
    if (candidates.length === 0) {
        let content = `
            <div class="card text-white bg-warning text-center">
                <div class="card-header">
                    Información
                </div>
                <div class="card-body">
                    <h5 class="card-title">No Hay Datos</h5>
                    <p class="card-text">No hay información para mostrar. Por favor, ingrese candidatos primero.</p>
                </div>
            </div>
        `;

        document.getElementById('mayorCredito').innerHTML = content;
        return; // Salimos de la función ya que no hay candidatos para procesar
    }

    const MayorCreditoE = candidates.reduce((max, candidate) => (candidate.credito > max.credito) ? candidate : max, { credito: 0 });
    let content = `
        <div class="card text-white bg-info text-center">
            <div class="card-header">
                Préstamo Más Alto
            </div>
            <div class="card-body">
                <h5 class="card-title">${MayorCreditoE.nombre}</h5>
                <p class="card-text">Este préstamo es el más alto y es de ${MayorCreditoE.credito}</p>
            </div>
            <div class="card-footer text-muted">
                Otorgado por nuestra compañía
            </div>
        </div>
    `;

    document.getElementById('mayorCredito').innerHTML = content;
}




function guardarDatos() {
    localStorage.setItem('candidates', JSON.stringify(candidates));
}

function cargarDatos() {
    // Limpiamos las secciones de candidatos y resultados
    limpiarPantalla();

    // Recuperamos los datos del almacenamiento local
    const datosGuardados = JSON.parse(localStorage.getItem('candidates'));
    candidates = datosGuardados || [];

    // Mostramos los resultados
    displayResults();
} // Aquí estaba faltando la llave

function refrescarDatos() {
    localStorage.removeItem('candidates');
}

function limpiarPantalla() {
    document.getElementById('numCandidates').value = '';
    document.getElementById('candidates').innerHTML = '';
    document.getElementById('results').innerHTML = '';
    document.getElementById('mayorCredito').innerHTML = '';
}
