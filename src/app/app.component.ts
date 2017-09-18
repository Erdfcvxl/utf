import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    decimal = {
        input: null,
        hex: null,
        binary: null,
        acii: null
    };
    heximal = {
        input: null,
        decimal: null,
        binary: null,
        acii: null
    };

    handleDecimalChange() {
        this.decimal.hex = this.convertDecimalToHex(this.decimal.input);
        this.decimal.binary = this.convertDecimalToBinary(this.decimal.input);
        this.decimal.acii = this.convertBinaryToUTF(this.decimal.binary);
    }

    handleHexChange() {
        this.heximal.decimal = this.convertHeximaltoDecimal(this.heximal.input);
        this.heximal.binary = this.convertDecimalToBinary(this.heximal.decimal);
        this.heximal.acii = this.convertBinaryToUTF(this.heximal.binary);
    }

    /* Decimal helpers*/
    convertDecimalToHex(decimal) {
        return (+decimal).toString(16);
    }

    convertDecimalToBinary(decimal) {
        return (+decimal).toString(2);
    }

    convertHexToBinary(hex) {
        return this.convertDecimalToBinary(this.convertDecimalToHex(hex));
    }

    /* Hex helpers */
    convertHeximaltoDecimal(hex) {
        return parseInt(hex, 16);
    }

    convertBinaryToUTF(binary) {
        const self = this;
        const inRange = function (firstPoint, lastPoint, _binary) {
            return (_binary >= self.convertHexToBinary(firstPoint) && _binary <= self.convertHexToBinary(lastPoint));
        };
        let result = '';

        if (inRange('0000', '007F', binary)) {
            result = '0' + binary.slice(-7);
            console.log(0);
        } else if (inRange('0080', '07FF', binary)) {
            result = '110' + binary.slice(-11, -6) + '10' + binary.slice(-6);
            console.log(1);
        } else if (inRange('0800', 'FFFF', binary)) {
            result = '1110' + binary.slice(-16, -12) + '10' + binary.slice(-12, -6) + '10' + binary.slice(-6);
            console.log(2);
        } else if (inRange('10000', '10FFFF', binary)) {
            result = '11110' + binary.slice(-21, -18) + '10' + binary.slice(-18, -12) + '10' + binary.slice(-12, -6) + '10' + binary.slice(-6);
            console.log(3);
        } else {
            result = 'Out of range';
        }

        return result;
    }
}
