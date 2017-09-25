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
    newContents: '';

    handleDecimalChange() {
        this.decimal.hex = helpers.convertDecimalToHex(this.decimal.input);
        this.decimal.binary = helpers.convertDecimalToBinary(this.decimal.input);
        this.decimal.acii = this.convertBinaryToUTF(this.decimal.binary, this.decimal.input);
    }

    handleHexChange() {
        this.heximal.decimal = helpers.convertHeximaltoDecimal(this.heximal.input);
        this.heximal.binary = helpers.convertDecimalToBinary(this.heximal.decimal);
        this.heximal.acii = this.convertBinaryToUTF(this.heximal.binary, this.heximal.decimal);
    }

    handleFileUpload(e) {
        const self = this;
        const files = e.target.files;
        if (files.length > 0) {
            const fileReader = new FileReader();
            fileReader.onload = function (ev) {
                self.initFileParser(ev.target['result']);
            };

            fileReader.readAsText(files[0], "UTF-8");
        }
    }

    initFileParser(contents) {
        for (let i = 0; i < contents.length; i++) {
            const ASCII = helpers.convertToASCII(contents[i]);

            this.newContents += ASCII > 127 ? helpers.getSymbolFromTable(ASCII) : contents[i];
        }

        this.populateParsedFile();
    }

    populateParsedFile() {
        const download = document.getElementById('download');
        download.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(this.newContents));
        download.setAttribute('download', 'convertedFile.txt');
    }


    /* UTF helpers*/
    convertBinaryToUTF(binary, decimal) {
        const self = this;
        const inRange = function (firstPoint, lastPoint, _decimal) {
            return (_decimal >= helpers.convertHeximaltoDecimal(firstPoint) && _decimal <= helpers.convertHeximaltoDecimal(lastPoint));
        };
        let result = '';


        if (inRange('0000', '7F', decimal)) {
            result = '0' + binary.slice(-7);
            console.log(0);
        } else if (inRange('80', '7FF', decimal)) {
            result = '110' + binary.slice(-11, -6) + '10' + binary.slice(-6);
            console.log(1);
        } else if (inRange('0800', 'FFFF', decimal)) {
            result = '1110' + binary.slice(-16, -12) + '10' + binary.slice(-12, -6) + '10' + binary.slice(-6);
            console.log(2);
        } else if (inRange('10000', '10FFFF', decimal)) {
            result = '11110' + binary.slice(-21, -18) + '10' + binary.slice(-18, -12) + '10' + binary.slice(-12, -6) + '10' + binary.slice(-6);
            console.log(3);
        } else {
            result = 'Out of range';
        }

        return result;
    }
}

export const helpers = {
    /* Decimal helpers*/
    convertDecimalToHex(decimal) {
        return (+decimal).toString(16);
    },

    convertDecimalToBinary(decimal) {
        return (+decimal).toString(2);
    },

    /* Hex helpers */
    convertHeximaltoDecimal(hex) {
        return parseInt(hex, 16);
    },

    convertToASCII(char) {
        return char.charCodeAt(0);
    },

    getSymbolFromTable(ASCII) {
        for (let i = 0; i < symbolTable.length; i++) {
            if (symbolTable[i]['key'] === ASCII) {
                return symbolTable[i]['value'];
            }
        }

        console.log('Error! No symbol found in symbol table. Please add ASCII value:' + ASCII);
        return '<' + ASCII + '>';
    }
};

export const symbolTable = [
    {key: 176, value: '░'},
    {key: 177, value: '▒'},
    {key: 178, value: '▓'},
    {key: 179, value: '│'},
    {key: 180, value: '┤'},
    {key: 181, value: '╡'},
    {key: 182, value: '╢'},
    {key: 183, value: '╖'},
    {key: 184, value: '╕'},
    {key: 185, value: '╣'},
    {key: 186, value: '║'},
    {key: 187, value: '╗'},
    {key: 188, value: '╝'},
    {key: 189, value: '╜'},
    {key: 190, value: '╛'},
    {key: 191, value: '┐'},
    {key: 192, value: '└'},
    {key: 193, value: '┴'},
    {key: 194, value: '┬'},
    {key: 195, value: '├'},
    {key: 196, value: '─'},
    {key: 197, value: '┼'},
    {key: 198, value: '╞'},
    {key: 199, value: '╟'},
    {key: 200, value: '╚'},
    {key: 201, value: '╔'},
    {key: 202, value: '╩'},
    {key: 203, value: '╦'},
    {key: 204, value: '╠'},
    {key: 205, value: '═'},
    {key: 206, value: '╬'},
    {key: 207, value: '╧'},
    {key: 208, value: '╨'},
    {key: 209, value: '╤'},
    {key: 210, value: '╥'},
    {key: 211, value: '╙'},
    {key: 212, value: '╘'},
    {key: 213, value: '╒'},
    {key: 214, value: '╓'},
    {key: 215, value: '╫'},
    {key: 216, value: '╪'},
    {key: 217, value: '┘'},
    {key: 218, value: '┌'},
    {key: 219, value: '█'},
    {key: 220, value: '▄'},
    {key: 221, value: '▌'},
    {key: 222, value: '▐'},
    {key: 223, value: '▀'},
];
