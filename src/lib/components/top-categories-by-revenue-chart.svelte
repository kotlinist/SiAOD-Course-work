<script>
    import { Chart, Card, A, Button, Dropdown, DropdownItem, Popover } from 'flowbite-svelte';
    import { UsersGroupOutline, ChartLineUpOutline, ArrowUpOutline, ChevronDownOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
    import { ArrowUpWideShortSolid, CaretUpSolid } from 'svelte-awesome-icons';

    import { HashTable, quickSortObj } from "$lib/alghoritms.js";
    import { nFormatter } from "$lib/utils.js";
    import BarChart from './bar-chart.svelte';

    export let data;
    $: if(data) {
        calculateRevenue()
    }

    let hashTable;
    let goods = []; 
    let sorted_goods = [];
    let chartData = [];
    let labels = [];
    let total_revenue = 0;

    function calculateRevenue() {
      hashTable = new HashTable(data.length)
      goods = []; 
      sorted_goods = [];
      chartData = [];
      labels = [];
      total_revenue = 0;
        data.forEach((item) => {
            total_revenue += item["Общая стоимость"];
        })
        console.log("TOTAL: "+total_revenue)

        for(let i = 0; i < data.length; i++) {
        // data.forEach((item) => {
        let revenue = hashTable.get(data[i]["Категория товара"]) || 0;
        revenue += data[i]["Общая стоимость"];
        hashTable.updateOrInsert(data[i]["Категория товара"], revenue)
        // Number.parseInt(item["Общая стоимость"]);
        // hashTable.set("name", "John");
        }
        console.log(hashTable);
        console.log(hashTable.getHashTableKeys());
        hashTable.getHashTableKeys().forEach(k => {
            goods = [...goods, {name: k, revenue: hashTable.get(k)}];
        })

        sorted_goods = quickSortObj(goods, "revenue").slice(goods.length-5, goods.length)
        console.log(sorted_goods)

        let fraction_of_top = 0;
        sorted_goods.forEach((v, k) => {
            fraction_of_top += v.revenue;
        })
        sorted_goods.forEach((v, k) => {
            chartData = [...chartData, v.revenue*100/fraction_of_top]
            labels = [...labels, v.name]
        })
        // chartData = [...chartData, (total_revenue - fraction_of_top)*100/total_revenue]
        console.log(chartData)
        console.log(labels)
    }

    $: options = {
    series: chartData,
      colors: ['#f87171', '#fb923c', '#facc15', '#4ade80', '#22d3ee', '#38bdf8', '#60a5fa', '#818cf8', '#a78bfa'], // 400 for 5+? sections
    //   colors: ['#f87171', '#fb923c', '#fbbf24', '#facc15', '#a3e635', '#4ade80', '#34d399', '#2dd4bf', '#22d3ee', '#38bdf8', '#60a5fa', '#818cf8', '#a78bfa'], // 400 full
      chart: {
        height: 420,
        width: '100%',
        type: 'pie'
      },
      stroke: {
        colors: ['white'],
        lineCap: ''
      },
      plotOptions: {
        pie: {
          labels: {
            show: true
          },
          size: '100%',
          dataLabels: {
            offset: -25
          }
        }
      },
      labels,
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: 'Inter, sans-serif'
        }
      },
      legend: {
        position: 'bottom',
        fontFamily: 'Inter, sans-serif'
      },
      yaxis: {
        labels: {
          formatter: function (value, plotInfo) {
            // console.log("PLOT" + plotInfo)
            return Math.round(value*100)/100 + '% - ' + sorted_goods[plotInfo.dataPointIndex].revenue.toLocaleString('en-US') + '₽';
          }
        }
      },
      xaxis: {
        labels: {
          formatter: function (value, plotInfo) {
            return value + '%';
          }
        },
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        }
      }
    };
  </script>
  
  {#if data.length}
  <Card>
    <div class="flex justify-between items-start w-full pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex-col items-center">
        <div class="flex items-center">
          <!-- <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white me-1">Топ 5 товаров</h5> -->
          <div class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center me-3">
            <ArrowUpWideShortSolid class="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <h5 class="leading-none text-2xl font-bold text-gray-900 dark:text-white pb-1">Топ 5 категорий (по выручке)</h5>
            <!-- <p class="text-sm font-normal text-gray-500 dark:text-gray-400">Leads generated per week</p> -->
          </div>
          <!-- <InfoCircleSolid id="pie1" class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer ms-1" />
          <Popover triggeredBy="#pie1" class="text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 z-10">
            <div class="p-3 space-y-2">
              <h3 class="font-semibold text-gray-900 dark:text-white">Activity growth - Incremental</h3>
              <p>Report helps navigate cumulative growth of community activities. Ideally, the chart should have a growing trend, as stagnating chart signifies a significant decrease of community activity.</p>
              <h3 class="font-semibold text-gray-900 dark:text-white">Calculation</h3>
              <p>For each date bucket, the all-time volume of activities is calculated. This means that activities in period n contain all activities up to period n, plus the activities generated by your community in period.</p>
              <A href="/">Read more <ChevronRightOutline class="w-2 h-2 ms-1.5" /></A>
            </div>
          </Popover> -->
        </div>
      </div>
      <!-- <div class="flex justify-end items-center">
        <DotsHorizontalOutline id="dots-menu" class="dots-menu dark:text-white" />
        <Dropdown triggeredBy="#dots-menu" class="w-44" offset="-6">
          <DropdownItem><PenSolid class="inline w-3 h-3 me-2" /> Edit widget</DropdownItem>
          <DropdownItem><DownloadSolid class="inline w-3 h-3 me-2" />Dropdown data</DropdownItem>
          <DropdownItem><ShareNodesSolid class="inline w-3 h-3 me-2" />Add to repository</DropdownItem>
          <DropdownItem><TrashBinSolid class="inline w-3 h-3 me-2" />Delete widget</DropdownItem>
        </Dropdown>
      </div> -->
    
  </div>
    <Chart {options} class="py-4" />

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
          Traffic analysis
          <ChevronRightOutline class="w-2.5 h-2.5 ms-1.5" />
        </A>
      </div>
    </div> -->
  </Card>
  {/if}