let numCandidatesGlobal = 0;
let candidates = [];

window.addEventListener('beforeunload', () => {
    localStorage.removeItem('candidates');
});

class Credito {
    constructor(nombre, sueldo, montoCredito, meses, tasaDeCambio) {
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
        this.CreditoEnDolar = montoCredito / tasaDeCambio;
        this.TasaCambio=tasaDeCambio;
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


function obtenerTasaDeCambio() {
    return new Promise((resolve, reject) => {
 
        fetch("https://mindicador.cl/api/dolar")
            .then(response => {
                if (!response.ok) {
                    throw new Error('La respuesta de la red no fue correcta.');
                }
                return response.json();
            })
            .then(data => {
                const tasaDeCambio = data.serie && data.serie[0] ? data.serie[0].valor : 0; 
                resolve(tasaDeCambio);
            })
            .catch(error => {
                console.error('Ocurrió un error al obtener la tasa de cambio:', error);
                resolve(0); 
            });
    });
}



function evaluateCandidates() {
    obtenerTasaDeCambio()
        .then(tasaDeCambio => {
            for (let i = candidates.length; i < numCandidatesGlobal; i++) {
                let nombre = document.getElementById(`name${i}`).value;
                let sueldo = parseInt(document.getElementById(`sueldo${i}`).value);
                let credito = parseInt(document.getElementById(`credito${i}`).value);
                let meses = parseInt(document.getElementById(`meses${i}`).value);


                if (sueldo < 100000) {
                    Swal.fire({
                        title: 'Error',
                        text: 'La remuneración no puede ser menor a 100.000',
                        icon: 'error',
                        confirmButtonText: 'Entendido'
                    });
                    return;
                }

                if (credito < 500000) {
                    Swal.fire({
                        title: 'Error',
                        text: 'El monto del crédito no puede ser menor a 500.000',
                        icon: 'error',
                        confirmButtonText: 'Entendido'
                    });
                    return;
                }

                if (meses < 6) {
                    Swal.fire({
                        title: 'Error',
                        text: 'El tiempo mínimo del crédito no puede ser menor a 6 meses',
                        icon: 'error',
                        confirmButtonText: 'Entendido'
                    });
                    return;
                }

           
                let candidate = new Credito(nombre, sueldo, credito, meses, tasaDeCambio);
                candidates.push(candidate);
            }

            document.getElementById('candidates').innerHTML = '';
            displayResults();
            guardarDatos();
        })
        .catch(error => {
            console.error("Ocurrió un error al obtener la tasa de cambio: ", error);
        });
}


function displayResults() {
    let results = document.getElementById('results');
    results.innerHTML = '';
    let start = candidates.length - numCandidatesGlobal;

    for (let i = start; i < candidates.length; i++) {
        let resultado = "";
        let cardHeaderClass = "bg-success text-white";
        let cardBodyClass = "text-success";

        let creditoFormateado = `$${candidates[i].CreditoAPagarTotal.toFixed(0).toLocaleString()}`;
        let cuotaFormateada = `$${candidates[i].cuotaMensual.toFixed(0).toLocaleString()}`;
        let dolarFormateado = `$${candidates[i].CreditoEnDolar.toFixed(2).toLocaleString()}`;

        if (!candidates[i].EstadoCredito) {
            resultado = `Qué pena, ${candidates[i].nombre}: lamento informarte que tu crédito está  ` + candidates[i].resultado;
            cardHeaderClass = "bg-danger text-white"; 
            cardBodyClass = "text-danger";
        } else {
            resultado = `FELICITACIONES, ${candidates[i].nombre}, tu crédito está ${candidates[i].resultado} y el total del crédito a pagar será de: ${creditoFormateado}`;
        }

        let card = `
        <div class="card mt-4">
            <div class="card-header ${cardHeaderClass}">
                Resultado para ${candidates[i].nombre}
            </div>
            <div class="card-body ${cardBodyClass}">
                <p class="card-text">${resultado}</p>
                <p class="card-text"><strong>Cuota mensual a pagar:</strong> ${cuotaFormateada}</p>
                <p class="card-text"><strong>Crédito en Dólares:</strong> ${dolarFormateado}</p>
            </div>
        </div>`;

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
        Swal.fire({
            title: 'Información',
            text: 'No hay información para mostrar. Por favor, ingrese candidatos primero.',
            icon: 'warning',
            confirmButtonText: 'Entendido'
        });
        return; 
    }

    const MayorCreditoE = candidates.reduce((max, candidate) => (candidate.credito > max.credito) ? candidate : max, { credito: 0 });
    
    Swal.fire({
        title: 'Préstamo Más Alto',
        html: `
            <h5>${MayorCreditoE.nombre}</h5>
            <p>Este préstamo es el más alto y es de ${MayorCreditoE.credito}</p>
            <p class="text-muted">Otorgado por nuestra compañía</p>
        `,
        icon: 'info',
        confirmButtonText: 'Genial'
    });
}




function guardarDatos() {
    console.log("Antes de guardar:", candidates);
    localStorage.setItem('candidates', JSON.stringify(candidates));
}

function cargarDatos() {

    limpiarPantalla();


    console.log("Después de cargar:", candidates);
    const datosGuardados = JSON.parse(localStorage.getItem('candidates'));

    candidates = datosGuardados || [];


    displayResults();
} 

function refrescarDatos() {
    localStorage.removeItem('candidates');
}

function limpiarPantalla() {
    document.getElementById('numCandidates').value = '';
    document.getElementById('candidates').innerHTML = '';
    document.getElementById('results').innerHTML = '';
    document.getElementById('mayorCredito').innerHTML = '';
}
