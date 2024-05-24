import Papa from "papaparse";

class BusinessData {
  csvData = [];

  constructor() {
    // this.data = new Array(size).fill(null);
    this.csvData = [];
  }

  parse(file) {
    this.csvData = [];
    let numFields = [
      "Номер заказа",
      "Количество продаж",
      "Цена за единицу",
      "Общая стоимость",
    ];
    Papa.parse(file, {
      download: false,
      header: true,
      skipEmptyLines: true,
      complete: function (answer) {
        for (let i = 0; i < answer.data.length; i++) {
          Object.keys(answer.data[i]).forEach((k) => {
            if (numFields.includes(k))
              answer.data[i][k] = Number.parseInt(answer.data[i][k]);
          });
          this.csvData = [...this.csvData, answer.data[i]];
        }
      },
    });
  }

  set(key, value) {
    const index = this.hash(key);
    // Обработка коллизий методом цепочек
    if (this.data[index] === null) {
      this.data[index] = [{ key, value }];
    } else {
      this.data[index].push({ key, value });
    }
  }
}

BusinessData.numFields = [
  "Номер заказа",
  "Количество продаж",
  "Цена за единицу",
  "Общая стоимость",
];

export { BusinessData };
