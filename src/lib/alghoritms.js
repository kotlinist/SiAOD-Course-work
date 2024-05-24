function quickSort(array) {
  const len = array.length;
  if (len <= 1) return array;

  const pivotIndex = Math.floor(len / 2);
  const pivot = array[pivotIndex];
  let left = [],
    right = [];

  for (let i = 0; i < len; i++) {
    if (i === pivotIndex) continue;
    const current = array[i];
    if (current < pivot) {
      left.push(current);
    } else {
      right.push(current);
    }
  }

  return [...quickSort(left), array[pivotIndex], ...quickSort(right)];
}

function quickSortObj(array, field) {
  const len = array.length;
  if (len <= 1) return array;

  const pivotIndex = Math.floor(len / 2);
  const pivot = array[pivotIndex][field];
  let left = [],
    right = [];

  for (let i = 0; i < len; i++) {
    if (i === pivotIndex) continue;
    const current = array[i];
    if (current[field] < pivot) {
      left.push(current);
    } else {
      right.push(current);
    }
  }

  return [
    ...quickSort(left, field),
    array[pivotIndex],
    ...quickSort(right, field),
  ];
}

function kmpSearch(text, pattern) {
  const lps = computeLpsArray(pattern);
  let i = 0;
  let j = 0;
  const matches = [];

  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++;
      j++;

      if (j === pattern.length) {
        matches.push(i - j);
        j = lps[j - 1]; // Переход к следующему префиксу
      }
    } else {
      if (j === 0) {
        i++;
      } else {
        j = lps[j - 1];
      }
    }
  }

  return matches;
}

function computeLpsArray(pattern) {
  const lps = new Array(pattern.length);
  lps[0] = 0;

  for (let i = 1; i < pattern.length; i++) {
    let j = 0;

    while (j < i && pattern[i] !== pattern[j]) {
      if (j === 0) {
        j = lps[j] + 1;
      } else {
        j = lps[j - 1];
      }
    }

    lps[i] = j;
  }

  return lps;
}

function boyerMoore(text, pattern) {
  // Предварительная обработка шаблона
  const lastCharTable = createLastCharTable(pattern);
  const prefixTable = createPrefixTable(pattern);

  let i = pattern.length - 1;
  let index = 0;

  while (i < text.length) {
    // Сравнение символов справа налево
    if (text[i] === pattern[i]) {
      i--;
      index++;
    } else {
      // Проверка по таблице префиксов
      if (i < prefixTable[index]) {
        index = prefixTable[index];
        i = pattern.length - 1;
      } else {
        // Сдвиг на основе таблицы последних символов
        i -= lastCharTable[text[i]];
        index = 0;
      }
    }
  }

  // Проверка нахождения шаблона
  if (index === pattern.length) {
    return text.indexOf(pattern);
  } else {
    return -1;
  }
}

// Создание таблицы последних символов
function createLastCharTable(pattern) {
  const table = {};
  for (let i = 0; i < pattern.length; i++) {
    table[pattern[i]] = i;
  }
  return table;
}

// Создание таблицы префиксов
function createPrefixTable(pattern) {
  const table = [pattern.length];
  let i = pattern.length - 2;
  let k = 1;

  while (i >= 0) {
    while (pattern[i] !== pattern[k]) {
      table[i] = k;
      k = prefixTable[k - 1];
      i--;
      if (i < 0) {
        break;
      }
    }

    table[i] = k;
    k = i + 1;
    i--;
  }

  return table;
}

class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class HashTable {
  constructor(size) {
    this.size = size;
    this.buckets = Array(size).fill(null);
  }

  set(key, value) {
    const hashIndex = this.hash(key);
    const newNode = new Node(key, value);

    if (this.buckets[hashIndex] === null) {
      this.buckets[hashIndex] = newNode;
    } else {
      let current = this.buckets[hashIndex];
      while (current.next) {
        current = current.next;
      }

      current.next = newNode;
      newNode.prev = current;
    }
  }

  get(key) {
    const hashIndex = this.hash(key);
    let node = this.buckets[hashIndex];

    while (node) {
      if (node.key === key) {
        return node.value;
      }
      node = node.next;
    }

    return null;
  }

  remove(key) {
    const hashIndex = this.hash(key);
    let node = this.buckets[hashIndex];

    while (node) {
      if (node.key === key) {
        if (node.prev === null) {
          this.buckets[hashIndex] = node.next;
        } else {
          node.prev.next = node.next;
        }

        if (node.next) {
          node.next.prev = node.prev;
        }

        node = null;
        return;
      }
      node = node.next;
    }
  }

  getHashTableKeys() {
    const allKeys = [];

    for (let i = 0; i < this.size; i++) {
      let node = this.buckets[i];

      while (node) {
        allKeys.push(node.key);
        node = node.next;
      }
    }

    return allKeys;
  }

  updateOrInsert(key, newValue) {
    let hashIndex = this.hash(key);
    let node = this.buckets[hashIndex];

    while (node) {
      if (node.key === key) {
        // Обновляем значение, если ключ найден
        node.value = newValue;
        return;
      }
      node = node.next;
    }

    // Вставляем новый узел, если ключ не найден
    this.set(key, newValue);
  }

  hash(key) {
    if (typeof key === "string") {
      let hash = 0;
      for (let i = 0; i < key.length; i++) {
        hash = (hash + key.charCodeAt(i)) % this.size;
      }
      return hash;
    } else if (typeof key === "number") return key % this.size;
    else return 0;
  }
}

/*
class HashTable {
  constructor(size = 5) {
    this.data = new Array(size).fill(null);
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

  get(key) {
    const index = this.hash(key);
    if (this.data[index] === null) return undefined;

    for (const item of this.data[index]) {
      if (item.key === key) {
        return item.value;
      }
    }

    return undefined;
  }

  remove(key) {
    const index = this.hash(key);
    if (this.data[index] === null) return undefined;

    let removedItem;
    for (let i = 0; i < this.data[index].length; i++) {
      if (this.data[index][i].key === key) {
        removedItem = this.data[index].splice(i, 1)[0];
        break;
      }
    }

    return removedItem ? removedItem.value : undefined;
  }

  getHashTableKeys() {
    const keys = [];
    for (const bucket of this.data) {
      if (bucket !== null) {
        for (const item of bucket) {
          keys.push(item.key);
        }
      }
    }
    return keys;
  }

  updateOrInsert(key, newValue) {
    const index = this.hash(key);

    if (this.data[index] === null) {
      this.data[index] = [{ key, value: newValue }];
      return true; // Ключ создан
    } else {
      for (let i = 0; i < this.data[index].length; i++) {
        if (this.data[index][i].key === key) {
          this.data[index][i].value = newValue;
          return true; // Ключ обновлен
        }
      }

      this.data[index].push({ key, value: newValue });
      return true; // Ключ создан
    }
  }

  hash(key) {
    if (typeof key === "string") {
      let hash = 0;
      for (let i = 0; i < key.length; i++) {
        hash = (hash + key.charCodeAt(i)) % this.data.length;
      }
      return hash;
    } else if (typeof key === "number") return key % this.data.length;
    else return 0;
  }
}
*/

export { quickSortObj, quickSort, kmpSearch, boyerMoore, HashTable };
