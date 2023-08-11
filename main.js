let numCandidatesGlobal = 0;
let candidates = [];

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
    const numCandidates = document.getElementById('numCandidates').value;
    numCandidatesGlobal += Number(numCandidates);

    for (let i = candidates.length; i < candidates.length + Number(numCandidates); i++) {
        let candidateForm = document.createElement('form');
        candidateForm.innerHTML = `
            <h3>Candidato ${i + 1}</h3>
            <input id="name${i}" type="text" placeholder="Nombre"><br>
            <input id="sueldo${i}" type="number" placeholder="Remuneración mensual"><br>
            <input id="credito${i}" type="number" placeholder="Monto de crédito"><br>
            <input id="meses${i}" type="number" placeholder="Meses para pagar">
        `;
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
        candidates.push(candidate);
    }

    displayResults();
    guardarDatos(); // Llama a la función para guardar los datos
}

function displayResults() {
    let results = document.getElementById('results');
    results.innerHTML = '';

    for (let i = 0; i < candidates.length; i++) {
        let resultado = "";
        let candidateResult = document.createElement('p');
        if (candidates[i].EstadoCredito) {
            resultado = "FELICITACIONES, " + candidates[i].nombre + " , tu credito está " + candidates[i].resultado + " y el total del credito a pagar será de: " + candidates[i].CreditoAPagarTotal.toFixed(0);
        } else {
            resultado = `Que pena, ${candidates[i].nombre}: lamento informarte que tu credito está  ` + candidates[i].resultado;
        }

        candidateResult.innerHTML = `Resultado para ${candidates[i].nombre}: ${resultado}`;
        results.appendChild(candidateResult);
    }
}

function traeMayorCreditoE() {
    if (candidates.length === 0) return null;
    let maxCred = Math.max.apply(Math, candidates.map(c => c.credito));
    let MayorCreditoE = candidates.filter(c => c.credito === maxCred);
    return MayorCreditoE;
}

function MuestraMayorCredito() {
    const MayorCreditoE = candidates.reduce((max, candidate) => (candidate.credito > max.credito) ? candidate : max, { credito: 0 });
    document.getElementById('mayorCredito').innerHTML = `El préstamo más alto fue solicitado por ${MayorCreditoE.nombre} y es de ${MayorCreditoE.credito}`;
}


function guardarDatos() {
    localStorage.setItem('candidates', JSON.stringify(candidates));
}

function cargarDatos() {
    // Limpiamos las secciones de candidatos y resultados
    document.getElementById('candidates').innerHTML = '';
    document.getElementById('results').innerHTML = '';

    // Recuperamos los datos del almacenamiento local
    const datosGuardados = JSON.parse(localStorage.getItem('candidates'));
    candidates = datosGuardados || [];

    // Mostramos los resultados
    displayResults();
} // Aquí estaba faltando la llave

function refrescarDatos() {
    localStorage.removeItem('candidates');
}