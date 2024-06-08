  // Knapsack problem with asynchronous conditions
class Item {
  constructor(name, weight, value, conditionFn) {
    this.name = name;
    this.weight = weight;
    this.value = value;
    this.conditionFn = conditionFn;
  }
}

// Simulated asynchronous condition functions
const conditionFns = {
  async alwaysTrue() {
    return true;
  },
  async alwaysFalse() {
    return false;
  },
  async randomCondition() {
    return Math.random() > 0.5;
  }
};

// Example items with conditions
const items = [
  new Item('Laptop', 3, 2000, conditionFns.alwaysTrue),
  new Item('Phone', 1, 800, conditionFns.randomCondition),
  new Item('Headphones', 1, 200, conditionFns.alwaysFalse),
  new Item('Notebook', 2, 500, conditionFns.randomCondition),
  new Item('Pen', 0.5, 50, conditionFns.alwaysTrue)
];

// Function to get the optimal value using dynamic programming with recursion and memoization
async function knapsack(items, capacity, memo = {}, index = 0) {
  // Check memoization
  if (memo[`${capacity}-${index}`]) return memo[`${capacity}-${index}`];

  // Base case: no items or no capacity
  if (index >= items.length || capacity <= 0) return { value: 0, items: [] };

  // Get the current item
  const currentItem = items[index];

  // Check if the current item can be included asynchronously
  const canInclude = await currentItem.conditionFn();
  let included = { value: 0, items: [] };

  if (canInclude && currentItem.weight <= capacity) {
    included = await knapsack(items, capacity - currentItem.weight, memo, index + 1);
    included.value += currentItem.value;
    included.items = [...included.items, currentItem];
  }

  // Exclude the current item
  const excluded = await knapsack(items, capacity, memo, index + 1);

  // Choose the better option
  const result = included.value > excluded.value ? included : excluded;

  // Memoize the result
  memo[`${capacity}-${index}`] = result;

  return result;
}

// Run the knapsack algorithm
(async () => {
  const capacity = 5; // Example capacity
  const result = await knapsack(items, capacity);
  console.log('Optimal value:', result.value);
  console.log('Selected items:', result.items.map(item => item.name));
})();