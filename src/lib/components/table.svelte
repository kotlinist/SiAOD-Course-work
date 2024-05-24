<script>
    import { onMount } from 'svelte';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch, Button, Dropdown, DropdownItem, Checkbox, ButtonGroup } from 'flowbite-svelte';
    import { Section } from 'flowbite-svelte-blocks';
    // import {paginationData} from '$lib/advancedTable.js'
    import { PlusOutline, ChevronDownOutline, FilterSolid, ChevronRightOutline, ChevronLeftOutline } from 'flowbite-svelte-icons';
    import { kmpSearch, boyerMoore } from "$lib/alghoritms.js";

    export let paginationData;
    $: if(paginationData) {
    //   console.log(paginationData[0]);
    //   totalItems = paginationData.length;
      updateDataAndPagination();
    //   renderPagination(paginationData.length);
    }

    let divClass='bg-slate-100 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden';
    let innerDivClass='flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4';
    let searchClass='w-full md:w-1/2 relative';
    let svgDivClass='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none';
    let classInput="text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2  pl-10";

    let searchTerm = '';
    let currentPosition = 0;
    const itemsPerPage = 10;
    const showPage = 5;
    let totalPages = 0;
    let pagesToShow = [];
    $: totalItems = paginationData.length;
    let startPage;
    let endPage;

    const updateDataAndPagination = () => {
      const currentPageItems = paginationData.slice(currentPosition, currentPosition + itemsPerPage);
      // totalItems = paginationData.length;
      renderPagination(currentPageItems.length);
    }

    const loadNextPage = () => {
      if (currentPosition + itemsPerPage < paginationData.length) {
        currentPosition += itemsPerPage;
        updateDataAndPagination();
      }
    }
  
    const loadPreviousPage = () => {
      if (currentPosition - itemsPerPage >= 0) {
        currentPosition -= itemsPerPage;
        updateDataAndPagination();
      }
    }
  
    const renderPagination = (totalItems) => {
      totalPages = Math.ceil(paginationData.length / itemsPerPage);
      const currentPage = Math.ceil((currentPosition + 1) / itemsPerPage);
  
      startPage = currentPage - Math.floor(showPage / 2);
      startPage = Math.max(1, startPage);
      endPage = Math.min(startPage + showPage - 1, totalPages);
  
      pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    }
  
    const goToPage = (pageNumber) => {
      currentPosition = (pageNumber - 1) * itemsPerPage;
      updateDataAndPagination();
    }
  
    $: startRange = currentPosition + 1;
    $: endRange = Math.min(currentPosition + itemsPerPage, totalItems);
  
    onMount(() => {
      // Call renderPagination when the component initially mounts
      renderPagination(paginationData.length);
    });
  
    $: currentPageItems = paginationData.slice(currentPosition, currentPosition + itemsPerPage);
    $: filteredItems = paginationData.filter((item) => item["Название товара"].toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
    // $: filteredItems = paginationData.filter((item) => boyerMoore(item["Название товара"].toLowerCase(), searchTerm.toLowerCase()) != 1);
    // $: filteredItems = paginationData.filter((item) => kmpSearch(item["Название товара"].toLowerCase(), searchTerm.toLowerCase()) != []);
  </script>
  
  {#if paginationData.length}
    
  <!-- <Section name="advancedTable" classSection='bg-gray-50 dark:bg-gray-900 p-3 sm:p-5'> -->
      <TableSearch placeholder="Search" hoverable={true} bind:inputValue={searchTerm} {divClass} {innerDivClass} {searchClass} {classInput} >
  
      <!-- <div slot="header" class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
        <Button on:click={() => updateDataAndPagination()}>
          <PlusOutline class="h-3.5 w-3.5 mr-2" />Add product
        </Button>
        <Button color='alternative'>Actions<ChevronDownOutline class="w-3 h-3 ml-2 divide-gray-100" /></Button>
          <Dropdown class="w-44 divide-y divide-gray-100">
            <DropdownItem>Mass Edit</DropdownItem>
            <DropdownItem>Delete all</DropdownItem>
          </Dropdown>
        <Button color='alternative'>Filter<FilterSolid class="w-3 h-3 ml-2 " /></Button>
          <Dropdown class="w-48 p-3 space-y-2 text-sm">
            <h6 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">Choose brand</h6>
            <li>
              <Checkbox>Apple (56)</Checkbox>
            </li>
            <li>
              <Checkbox>Microsoft (16)</Checkbox>
            </li>
            <li>
              <Checkbox>Razor (49)</Checkbox>
            </li>
            <li>
              <Checkbox>Nikon (12)</Checkbox>
            </li>
            <li>
              <Checkbox>BenQ (74)</Checkbox>
            </li>
          </Dropdown>
      </div> -->
        <TableHead>
          <!-- Номер заказа 	Дата заказа 	Название товара 	Категория товара 	Количество продаж 	Цена за единицу	Общая стоимость  -->
          <TableHeadCell padding="px-4 py-3" scope="col">№ заказа</TableHeadCell>
          <TableHeadCell padding="px-4 py-3" scope="col">Дата</TableHeadCell>
          <TableHeadCell padding="px-4 py-3" scope="col">Наименование</TableHeadCell>
          <TableHeadCell padding="px-4 py-3" scope="col">Категория</TableHeadCell>
          <TableHeadCell padding="px-4 py-3" scope="col">Количество продаж</TableHeadCell>
          <TableHeadCell padding="px-4 py-3" scope="col">Цена за единицу</TableHeadCell>
          <TableHeadCell padding="px-4 py-3" scope="col">Общая стоимость</TableHeadCell>
        </TableHead>
        <TableBody class="divide-y">
          {#if searchTerm !== ''}
            {#each filteredItems as item (item["Номер заказа"])}
              <TableBodyRow>
                <!-- Номер заказа 	Дата заказа 	Название товара 	Категория товара 	Количество продаж 	Цена за единицу	Общая стоимость  -->
                <TableBodyCell tdClass="px-4 py-3">{item["Номер заказа"]}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{item["Дата заказа"]}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{item["Название товара"]}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{item["Категория товара"]}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{item["Количество продаж"]}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{item["Цена за единицу"]}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{item["Общая стоимость"]}</TableBodyCell>
                <!-- <TableBodyCell tdClass="px-4 py-3">{item.price}</TableBodyCell> -->
              </TableBodyRow>
            {/each}
          {:else}
            {#each currentPageItems as item (item["Номер заказа"])}
              <TableBodyRow>
                <!-- <TableBodyCell tdClass="px-4 py-3">{item.product_name}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{item.brand}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{item.category}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{item.price}</TableBodyCell> -->
                <TableBodyCell tdClass="px-4 py-3">{item["Номер заказа"]}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{item["Дата заказа"]}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{item["Название товара"]}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{item["Категория товара"]}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{item["Количество продаж"]}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{item["Цена за единицу"]}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{item["Общая стоимость"]}</TableBodyCell>
              </TableBodyRow>
            {/each}
          {/if}
        </TableBody>
        <div slot="footer" class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
          Страница {Math.ceil((currentPosition + 1) / itemsPerPage)}. Показано
          <span class="font-semibold text-gray-900 dark:text-white">{startRange}-{endRange}</span>
          элемент(ов) из
          <span class="font-semibold text-gray-900 dark:text-white">{totalItems}</span>
        </span>
          <ButtonGroup>
            <Button on:click={() => goToPage(1)} disabled={currentPosition === 0}>На первую</Button>
            <Button on:click={loadPreviousPage} disabled={currentPosition === 0}><ChevronLeftOutline size='xs' class='m-1.5'/></Button>
            {#each pagesToShow as pageNumber}
              <Button on:click={() => goToPage(pageNumber)}>
                {#if Math.ceil((currentPosition + 1) / itemsPerPage) == pageNumber}
                    <b>{pageNumber}</b>
                  {:else}
                    {pageNumber}
                {/if}
              </Button>
            {/each}
            <Button on:click={loadNextPage} disabled={ totalPages === endPage }><ChevronRightOutline size='xs' class='m-1.5'/></Button>
            <Button on:click={() => goToPage(totalPages)} disabled={ totalPages === endPage }>На последнюю</Button>
          </ButtonGroup>
        </div>
      </TableSearch>
  <!-- </Section> -->
  {/if}