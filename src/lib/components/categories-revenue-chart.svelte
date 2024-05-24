<script>
  import { Chart, Card, A, Button, Dropdown, DropdownItem } from 'flowbite-svelte';
  import { ArrowUpOutline, ChevronDownOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
  import { MoneyBillTrendUpSolid, ArrowUpWideShortSolid, CaretUpSolid } from 'svelte-awesome-icons';

  import { HashTable } from "$lib/alghoritms.js";
  import { nFormatter } from "$lib/utils.js";

  export let data;
  $: if(data) {
    hashTable = new HashTable(data.length)
    // calculateCount()
    calculaterevenue()
  }

  let hashTable;
  let chartData = [];
  let categories = [];
  let min = {name: undefined, revenue: Number.MAX_SAFE_INTEGER};
  let max = {name: undefined, revenue: Number.MIN_SAFE_INTEGER};

  function calculaterevenue() {
    for(let i = 0; i < data.length; i++) {
    // data.forEach((item) => {
      let revenue = hashTable.get(data[i]["Категория товара"]) || 0;
      revenue += data[i]["Общая стоимость"];
      hashTable.updateOrInsert(data[i]["Категория товара"], revenue)
      if(revenue > max.revenue) max = {name: data[i]["Категория товара"], revenue}
      if(revenue < min.revenue) min = {name: data[i]["Категория товара"], revenue}
      // Number.parseInt(item["Общая стоимость"]);
      // hashTable.set("name", "John");
    }
    // console.log(hashTable);
    // console.log(hashTable.getHashTableKeys());
    categories = hashTable.getHashTableKeys();
    categories.forEach(k => {
      chartData = [...chartData, hashTable.get(k)];
    })
    // return revenue;
  }

  function calculateCount() {
    for(let i = 0; i < data.length; i++) {
    // data.forEach((item) => {
      let count = hashTable.get(data[i]["Категория товара"]) || 0;
      count += data[i]["Количество продаж"];
      hashTable.updateOrInsert(data[i]["Категория товара"], count)
      // Number.parseInt(item["Общая стоимость"]);
      // hashTable.set("name", "John");
    }
    // console.log(hashTable);
    // console.log(hashTable.getHashTableKeys());
    categories = hashTable.getHashTableKeys();
    categories.forEach(k => {
      chartData = [...chartData, hashTable.get(k)];
    })
    // console.log(categories)
    // console.log(chartData)
  }

  $: options = {
    series: [
      {
        name: 'Общая сумма',
        color: '#31C48D',
        data: chartData
      }
    ],
    chart: {
      sparkline: {
        enabled: false
      },
      type: 'bar',
      width: '100%',
      height: 600,
      toolbar: {
        show: false
      }
    },
    fill: {
      opacity: 1
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: '100%',
        borderRadiusApplication: 'end',
        borderRadius: 6,
        dataLabels: {
          position: 'top'
        }
      }
    },
    legend: {
      show: true,
      position: 'bottom'
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (value) {
          return value.toLocaleString('en-US') + '₽';
      },
      }
    },
    xaxis: {
      labels: {
        show: true,
        style: {
          fontFamily: 'Inter, sans-serif',
          cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
        },
        formatter: function (value) {
          return nFormatter(value) + ' ₽';
        }
      },
      categories,
      axisTicks: {
        show: false
      },
      axisBorder: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          fontFamily: 'Inter, sans-serif',
          cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
        }
      }
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: -20
      }
    }
  };
</script>

{#if data.length}
<Card size="">
  <div class="flex justify-between border-gray-200 border-b dark:border-gray-700 pb-3">
    <dl>
      <!-- <dt class="text-2xl font-bold text-gray-700 dark:text-gray-600 pb-1">Общая выручка по категориям</dt> -->
      <div class="flex items-center">
        <!-- <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white me-1">Топ 5 товаров</h5> -->
        <div class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center me-3">
          <MoneyBillTrendUpSolid class="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </div>
        <div>
          <h5 class="leading-none text-2xl font-bold text-gray-900 dark:text-white pb-1">Общая выручка по категориям</h5>
          <!-- <p class="text-sm font-normal text-gray-500 dark:text-gray-400">Leads generated per week</p> -->
        </div>
      <!-- <dd class="leading-none text-3xl font-bold text-gray-900 dark:text-white">$5,405</dd> -->
    </dl>
    <!-- <div>
      <span class="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md dark:bg-green-900 dark:text-green-300">
        <ArrowUpOutline class="w-2.5 h-2.5 me-1.5" />
        Profit rate 23.5%
      </span>
    </div> -->
  </div>

  <div class="grid grid-cols-2 py-3">
    <dl>
      <dt class="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">Max</dt>
      <dd class="leading-none text-xl font-bold text-green-500 dark:text-green-400">{max.revenue.toLocaleString('en-US')}₽ ({max.name})</dd>
    </dl>
    <dl>
      <dt class="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">Min</dt>
      <dd class="leading-none text-xl font-bold text-red-600 dark:text-red-500">{min.revenue.toLocaleString('en-US')}₽ ({min.name})</dd>
    </dl>
  </div>

  <Chart {options} />
  <!-- <div class="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
    <div class="flex justify-between items-center pt-5">
      <Button class="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent focus:ring-transparent dark:focus:ring-transparent py-0">Last 7 days<ChevronDownOutline class="w-2.5 m-2.5 ms-1.5" /></Button>
      <Dropdown class="w-40" offset="-6">
        <DropdownItem>Yesterday</DropdownItem>
        <DropdownItem>Today</DropdownItem>
        <DropdownItem>Last 7 days</DropdownItem>
        <DropdownItem>Last 30 days</DropdownItem>
        <DropdownItem>Last 90 days</DropdownItem>
      </Dropdown>
      <A href="/" class="uppercase text-sm font-semibold hover:text-primary-700 dark:hover:text-primary-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2 hover:no-underline">
        Leads Report
        <ChevronRightOutline class="w-2.5 h-2.5 ms-1.5" />
      </A>
    </div>
  </div> -->
</Card>
{/if}