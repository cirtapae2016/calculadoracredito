const tasaActualAnual = 0.3;
const LimiteEndeudamientoMensual = 0.25;

class Credito {
    constructor(nombre, sueldo, montoCredito, meses, tasaActualAnual, LimiteEndeudamientoMensual) {
        this.nombre = nombre;
        this.sueldo = sueldo;
        this.credito = montoCredito;
        this.meses = meses;
        this.tasaActualAnual = tasaActualAnual;
        this.LimiteEndeudamientoMensual = LimiteEndeudamientoMensual;
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

let nombre = prompt("Ingresa tu nombre:");
let montoSueldo = parseInt(prompt("Ingresa tu remuneración mensual:"));
let montoCredito = parseInt(prompt("Ingresa el monto de tu credito para evaluar:"));
let tiempo = parseInt(prompt("Ingresa cuantos meses pretendes pagar el credito:"));

const persona1= new Credito(nombre, montoSueldo, montoCredito, tiempo, tasaActualAnual, LimiteEndeudamientoMensual);

if (persona1.EstadoCredito){
    console.log("FELICITACIONES, " + persona1.nombre + " , tu credito está " + persona1.resultado + " y el total del credito a pagar será de: " +  persona1.CreditoAPagarTotal.toFixed(0));
} else
{
    console.log("Que pena lamento informarte que tu credito está  " + persona1.resultado);
}

console.log(persona1);
