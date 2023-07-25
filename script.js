const body = document.getElementsByTagName("body")[0];
const selector = document.getElementById("selector");
const currencyName = document.querySelector(".selected-currency-name");
const selectedCurrencyContainer = document.querySelector(".selected-currency");
const currencyCurrentValue = document.querySelector(".current-currency__value");
const currencyCurrentDate = document.querySelector(".current-currency__date");
const currencyPreviousValue = document.querySelector(".previous-currency__value");
const currencyPreviousDate = document.querySelector(".previous-currency__date");

async function fetchCurrency() {
  try {
    const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
    const currencyJson = await response.json();
  
    return {
      previousDate: currencyJson.PreviousDate,
      currentDate: currencyJson.Date,
      currencies: currencyJson.Valute,
    };
  } catch(e) {
    console.error("Ошибка загрузки данных:", e);
    return {};
  }
}

function formatDate(strDate) {
  const date = new Date(strDate);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `Курс на ${day}.${month}.${year}`;
}

function updateCurrencyContainer(selectedCurrency, current, previous) {
  const { ID, Name, CharCode, Value, Previous } = selectedCurrency;
  currencyName.textContent = `${ID} - ${Name} (${CharCode})`;

  currencyCurrentDate.textContent = formatDate(current);
  currencyCurrentValue.textContent = Value;

  currencyPreviousDate.textContent = formatDate(previous);
  currencyPreviousValue.textContent = Previous;
}

document.addEventListener("DOMContentLoaded", async () => {
  const { previousDate, currentDate, currencies } = await fetchCurrency();

  if (!currencies || !previousDate || !currentDate) {
    const error = document.createElement('div');
    error.textContent = "Произошла ошибка при загрузке данных";
    error.className = "error"
    body.appendChild(error);
  } else {
    const currenciesArr = Object.values(currencies);

    currenciesArr.forEach((currency) => {
      const option = document.createElement('option');
      option.value = currency.ID;
      option.textContent = `${currency.ID} - ${currency.Name}`;
      selector.appendChild(option);
    });

    selector.addEventListener("change", (event) => {
      selectedCurrencyContainer.style.display = "flex";
      const selectedCurrencyId = selector.value;
      const selectedCurrency = currenciesArr.find(c => c.ID === selectedCurrencyId);
      updateCurrencyContainer(selectedCurrency, currentDate, previousDate);
    });
  }
});