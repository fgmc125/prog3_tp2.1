class Currency {
    constructor(code, name) {
        this.code = code;
        this.name = name;
    }
}

class CurrencyConverter {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
        this.currencies = [];
    }

    async getCurrencies() {
        try {
            const response = await fetch(`${this.apiUrl}/currencies`);
            const data = await response.json();
            this.currencies = Object.keys(data).map(code => new Currency(code, data[code]));
            return this.currencies;
        } catch (error) {
            console.error("Se produjo un error al obtener las monedas:", error);
            throw new Error("Error al obtener las monedas.");
        }
    }

    async convertCurrency(amount, fromCurrency, toCurrency) {
        if (fromCurrency.code === toCurrency.code) {
            return amount;
        }

        try {
            const response = await fetch(`${this.apiUrl}/latest?amount=${amount}&from=${fromCurrency.code}&to=${toCurrency.code}`);
            const data = await response.json();
            return data.rates[toCurrency.code];
        } catch (error) {
            console.error("Se producho un error al convertir la moneda:", error);
            throw new Error("Error al convertir la moneda.");
        }
    }

    populateCurrencies(selectElement, currencies) {
        if (currencies) {
            currencies.forEach((currency) => {
                const option = document.createElement("option");
                option.value = currency.code;
                option.textContent = `${currency.code} - ${currency.name}`;
                selectElement.appendChild(option);
            });
        }
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("conversion-form");
    const resultDiv = document.getElementById("result");
    const loadingDiv = document.getElementById("loading");
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");

    const converter = new CurrencyConverter("https://api.frankfurter.app");

    try {
        const currencies = await converter.getCurrencies();
        converter.populateCurrencies(fromCurrencySelect, currencies);
        converter.populateCurrencies(toCurrencySelect, currencies);
    } catch (error) {
        resultDiv.textContent = "No se pudieron cargar las monedas.";
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        resultDiv.textContent = "";
        loadingDiv.style.display = "block";

        const amount = document.getElementById("amount").value;
        const fromCurrency = converter.currencies.find(
            (currency) => currency.code === fromCurrencySelect.value
        );
        const toCurrency = converter.currencies.find(
            (currency) => currency.code === toCurrencySelect.value
        );

        try {
            const convertedAmount = await converter.convertCurrency(amount, fromCurrency, toCurrency);
            if (convertedAmount !== null && !isNaN(convertedAmount)) {
                resultDiv.textContent = `${amount} ${fromCurrency.code} son ${convertedAmount.toFixed(2)} ${toCurrency.code}`;
            } else {
                resultDiv.textContent = "Error al realizar la conversión.";
            }
        } catch (error) {
            resultDiv.textContent = error.message;
        } finally {
            loadingDiv.style.display = "none";
        }
    });
});
