<script>
    import { Button, GradientButton } from 'flowbite-svelte';
	import { Fileupload, Label, Card } from 'flowbite-svelte';
    import { ChartMixedDollarOutline, UsersGroupOutline, ArrowUpOutline, ChevronDownOutline, ChevronRightOutline } from 'flowbite-svelte-icons';

    import Table from "$lib/components/table.svelte";

    import BarChart from "$lib/components/bar-chart.svelte";
    import ColumnChart from "$lib/components/column-chart.svelte";
    import OrdersRevenueChart from '$lib/components/orders-revenue-chart.svelte';

    import CategoriesRevenueChart from "$lib/components/categories-revenue-chart.svelte";
    import CategoriesSalesChart from "$lib/components/categories-sales-chart.svelte";
    import TopProductsByRevenueChart from "$lib/components/top-products-by-revenue-chart.svelte";
    import TopCategoriesByRevenueChart from "$lib/components/top-categories-by-revenue-chart.svelte";
    import TopProductsBySalesChart from "$lib/components/top-products-by-sales-chart.svelte";
    import TopCategoriesBySalesChart from "$lib/components/top-categories-by-sales-chart.svelte";

    import Papa from 'papaparse';

    import { downloadBlob } from "$lib/utils.js";
    import { quickSortObj, quickSort, HashTable } from "$lib/alghoritms.js";
  
    let fileInput;
    let csvData = [];
    let revenue = 0;
    let sales = 0;
    const numFields = ["Номер заказа", "Количество продаж", "Цена за единицу", "Общая стоимость"];

    const onFileSelected = (e) => {
        // let image = e.target.files[0];
        csvData = [];
        Papa.parse(e.target.files[0], {
                download: false,
                header: true,
                skipEmptyLines: true,
                complete: function (answer) {
                    // console.log(answer.data.length);
                    for (let i = 0; i < answer.data.length; i++) {
                        // csvData.push(answer.data[i]);
                        // csvData = csvData;
                        Object.keys(answer.data[i]).forEach(k => {
                            if(numFields.includes(k)) answer.data[i][k] = Number.parseInt(answer.data[i][k]);
                        });
                        csvData = [...csvData, answer.data[i]];
                    }
                    // csvData = csvData;
                    console.log(csvData);
                    // dataLen = 10;
                }
            });
    }    

    function generateReport(data) {
        let report = `# Отчет за период с ${csvData?.[0]?.["Дата заказа"]} по ${csvData?.[csvData?.length-1]?.["Дата заказа"]}\n`;

        // 4. Составить отчет, содержащий информацию об общей выручке магазина, количестве
        // проданных единиц каждого товар и доле каждого товара в общей выручке.

        let total_revenue = 0;
        let total_sales = 0;
        data.forEach(item => {
            total_revenue += item["Общая стоимость"]
            total_sales += item["Количество продаж"]
        })

        report += `Общая выручка за период: ${total_revenue.toLocaleString('en-US')}₽\n`
        report += `Всего заказов: ${csvData.length.toLocaleString('en-US')} шт.\n`
        report += `Продано товаров: ${total_sales.toLocaleString('en-US')} шт.\n`

        let hashTable = new HashTable(data.length)
        for(let i = 0; i < data.length; i++) {
            let revenue = hashTable.get(data[i]["Название товара"])?.revenue || 0;
            revenue += data[i]["Общая стоимость"];
            let sales = hashTable.get(data[i]["Название товара"])?.sales || 0;
            sales += data[i]["Количество продаж"];
            hashTable.updateOrInsert(data[i]["Название товара"], {revenue, sales})
        }
        
        report += "| **Название товара** | **Продано единиц, шт.** | **Выручка, ₽** | **Доля в общей выручке, %** |\n"
        report += "|---------------------|------------------------:|---------------:|----------------------------:|\n"
        let sorted_keys = quickSort(hashTable.getHashTableKeys())
        sorted_keys.forEach(key => {
            let product = hashTable.get(key);
            report += `| ${key} | ${product.sales.toLocaleString('en-US')} | ${product.revenue.toLocaleString('en-US')} | ${Math.round(product.revenue*100/total_revenue*100)/100} |\n`;
        })
        report += `| **Итого** | **${total_sales.toLocaleString('en-US')}** | **${total_revenue.toLocaleString('en-US')}** | **100** \n`;

        return report;
    }

    function saveReport() {
        let data = new Blob([generateReport(csvData)], {type: 'text/plain'});
        downloadBlob(data, `Отчет за период с ${csvData?.[0]?.["Дата заказа"]} по ${csvData?.[csvData?.length-1]?.["Дата заказа"]} .md`)
    }

    $: if (csvData) {
        revenue = 0;
        sales = 0;
        csvData.forEach((item) => {
            revenue += item["Общая стоимость"];
            sales += item["Количество продаж"];
        })
    }

</script>

<div class="pl-8 pr-8 pb-4">
    <div class="flex grid-cols-2 gap-4 items-end">
        <div class="grow">
            <Label for="with_helper" class="pb-1 pt-4">Загрузите CSV файл</Label>
            <Fileupload on:change={(e)=>onFileSelected(e)} bind:this={fileInput} accept="text/csv" id="with_helper" />
        </div>
        <div><GradientButton color="blue" on:click={saveReport} disabled='{!csvData.length}'>Сохранить отчет</GradientButton></div>
    </div>

</div>

    <div class="pl-8 pr-8 pb-4">
        <Table bind:paginationData={csvData}/>
    </div>

    {#if csvData.length}
        <!-- <div class="pl-8 pr-8 pb-4">
            <Card size="md" class="pl-8 pr-8 pb-4">
                <!-- <div class="flex justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center">
                      <div class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center me-3">
                        <ChartMixedDollarOutline class="w-6 h-6 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <h5 class="leading-none text-2xl font-bold text-gray-900 dark:text-white pb-1">3.4k</h5>
                        <p class="text-sm font-normal text-gray-500 dark:text-gray-400">Leads generated per week</p>
                      </div>
                    </div>
                    <div>
                        <div class="flex justify-between items-start w-full pb-4 mb-6 border-b border-gray-200 dark:border-gray-700">
                            <div class="flex-col items-center">
                                <div class="flex items-center">
                                  <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white me-1">Топ 5 товаров</h5>
                                  <div class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center me-3">
                                    <ChartMixedDollarOutline class="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                  </div>
                                  <div>
                                    <h5 class="leading-none text-2xl font-bold text-gray-900 dark:text-white pb-1">Топ 5 товаров (по продажам)</h5>
                                  </div>
                        </div>
                        <div class="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between"></div>
                <h4 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Показатели магазина за период с {csvData?.[0]?.["Дата заказа"]} по {csvData?.[csvData?.length-1]?.["Дата заказа"]}</h4>
                <h3 class="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">Общая выручка: {revenue.toLocaleString('en-US')} ₽</h3>
                <h3 class="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">Количество проданных товаров: {sales.toLocaleString('en-US')} шт.</h3>
                            </div>
            </Card>
        </div> -->
        <div class="pl-8 pr-8 pb-4">
            <Card size="">
                <div class="flex justify-between items-start w-full pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex-col items-center">
                        <div class="flex items-center">
                            <div class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center me-3">
                                <ChartMixedDollarOutline class="w-6 h-6 text-gray-500 dark:text-gray-400" />
                            </div>
                            <div>
                                <h5 class="leading-none text-xl font-bold text-gray-900 dark:text-white pb-1">Показатели магазина</h5>
                            </div>
                        </div>
                    </div>
                </div>

            <div class="grid grid-cols-1 py-3">
                <h4 class="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">Показатели магазина за период с {csvData?.[0]?.["Дата заказа"]} по {csvData?.[csvData?.length-1]?.["Дата заказа"]}</h4>
                <h3 class="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">Общая выручка: {revenue.toLocaleString('en-US')} ₽</h3>
                <h3 class="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">Количество проданных товаров: {sales.toLocaleString('en-US')} шт.</h3>
                <div>
                    <OrdersRevenueChart bind:data={csvData} />
                </div>
            </div>
            </Card>
        </div>
    {/if}

    <!-- <div class="pl-8 pr-8 pb-4">
        <LineChart bind:data={csvData} />
    </div> -->

    <div class="grid grid-cols-2 gap-3 pl-8 pr-8 pb-6">
        <!-- <ColumnChart bind:data={csvData} /> -->
        <!-- <Line data={dataLine} options={{ responsive: true }}/> -->
        <!-- <Bar {data} options={{ responsive: true }} /> -->
        <CategoriesRevenueChart bind:data={csvData} />
        <CategoriesSalesChart bind:data={csvData} />
        <!-- <BarChart bind:data={csvData} /> -->
    </div>

    <div class="grid grid-cols-4 gap-3 pl-8 pr-8 pb-6">
        <TopProductsByRevenueChart bind:data={csvData} />
        <TopProductsBySalesChart bind:data={csvData} />
        <TopCategoriesByRevenueChart bind:data={csvData} />
        <TopCategoriesBySalesChart bind:data={csvData} />
    </div>

<!-- {#if files}
	<h2>Selected files:</h2>
	{#each Array.from(files) as file}
		<p>{file.name} ({file.size} bytes)</p>
		{csv}
	{/each}
{/if} -->

<style>
</style>
