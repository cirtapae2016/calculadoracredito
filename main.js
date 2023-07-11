const tasaActualAnual = 0.3;
const LimiteEndeudamientoMensual = 0.25;

/* const validarCredito = (sueldo, Credito, meses, tasaActualAnual, LimiteEndeudamientoMensual) => {
    let resultado="Rechazado";
    let tasaActualMensual = tasaActualAnual / 12;
    let montoCreditoMensual = Credito / meses;
    let EndeudamientoProyectado = montoCreditoMensual / sueldo;
    let LeyendaAprobacion = "Debes contactarte con nuestro servicio de apoyo al cliente, credito pre-aprobado es:"
    let cuotaMensual = (() => {
      const factor = Math.pow((1 + tasaActualMensual), meses);
      return Credito * (tasaActualMensual * factor) / (factor - 1);
    })();

    if (EndeudamientoProyectado>=LimiteEndeudamientoMensual){
        resultado = resultado + " Sobrepasas tu límite de endeudamiento mensual: ("+ LimiteEndeudamientoMensual + ") y tu score de endeudamiento es: (" + parseFloat(EndeudamientoProyectado.toFixed(2)) + ")";
    }else if (sueldo<1000000 && (Credito > 0.2 * sueldo)){
        resultado = "Aprobado con reparos: Debes dejar garantías por tu crédito." + LeyendaAprobacion + Credito + ", Tiempo del crédito: " + meses + " meses, Tasa otorgada: " + tasaActualAnual + ", Cuota mensual a pagar: " + cuotaMensual.toFixed(0)  ;
    }else {
        resultado = "Aprobado listo para retirar: " + " El crédito solicitado es: " + Credito + ", Tiempo del crédito: " + meses + " meses, Tasa otorgada: " + tasaActualAnual + ", Cuota mensual a pagar: " + cuotaMensual.toFixed(0);
    }

    return resultado;
}  */

class Credito {
    constructor(nombre, sueldo, Credito, meses, tasaActualAnual, LimiteEndeudamientoMensual) {
        this.nombre = nombre;
        this.sueldo = sueldo;
        this.credito = Credito;
        this.meses = meses;
        this.tasaActualAnual = tasaActualAnual;
        this.LimiteEndeudamientoMensual = LimiteEndeudamientoMensual;
        this.EstadoCredito = false;
        this.tasaActualMensual = this.tasaActualAnual / 12;
        this.montoCreditoMensual = this.credito / this.meses;
        this.EndeudamientoProyectado = this.montoCreditoMensual / this.sueldo;
        this.resultado = "Rechazado: ";
        this.EstadoCredito = false;
        this.cuotaMensual = (() => {
            const factor = Math.pow((1 + this.tasaActualMensual), this.meses);
            return this.credito * (this.tasaActualMensual * factor) / (factor - 1);
          })();
        this.CreditoAPagarTotal = this.cuotaMensual * this.meses;

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

