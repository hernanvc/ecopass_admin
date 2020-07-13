
export function FormatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
};


export async function ValidarRut(Objeto) {
    var tmpstr = "";
    var intlargo = Objeto
    if (intlargo === undefined || intlargo === "") {
        return false
    }
    if (intlargo.length > 0) {
        var crut = Objeto
        var largo = crut.length;
        if (largo < 2) {
            return false;
        }
        for (var i = 0; i < crut.length; i++)
            if (crut.charAt(i) !== ' ' && crut.charAt(i) !== '.' && crut.charAt(i) !== '-') {
                tmpstr = tmpstr + crut.charAt(i);
            }
        var rut = tmpstr;
        crut = tmpstr;
        largo = crut.length;

        if (largo > 2)
            rut = crut.substring(0, largo - 1);
        else
            rut = crut.charAt(0);

        var dv = crut.charAt(largo - 1);

        if (rut == null || dv == null)
            return 0;

        var dvr = '0';
        var suma = 0;
        var mul = 2;

        for (var i = rut.length - 1; i >= 0; i--) {
            suma = suma + rut.charAt(i) * mul;
            if (mul == 7)
                mul = 2;
            else
                mul++;
        }
        var res = suma % 11;
        if (res == 1)
            var dvr = 'k';
        else if (res == 0)
            dvr = '0';
        else {
            var dvi = 11 - res;
            dvr = dvi + "";
        }

        if (dvr !== dv.toLowerCase()) {
            return false;
        }
        return true;
    }
}


export function FormateaRut(rut) {
    var actual = rut.replace(/^0+/, "");
    if (actual !== '' && actual.length > 1) {
        var sinPuntos = actual.replace(/\./g, "");
        var actualLimpio = sinPuntos.replace(/-/g, "");
        var inicio = actualLimpio.substring(0, actualLimpio.length - 1);
        var rutPuntos = "";
        var i = 0;
        var j = 1;
        for (var i = inicio.length - 1; i >= 0; i--) {
            var letra = inicio.charAt(i);
            rutPuntos = letra + rutPuntos;
            if (j % 3 == 0 && j <= inicio.length - 1) {
                rutPuntos = "." + rutPuntos;
            }
            j++;
        }
        var dv = actualLimpio.substring(actualLimpio.length - 1);
        rutPuntos = rutPuntos + "-" + dv;
    }
    return rutPuntos;
}