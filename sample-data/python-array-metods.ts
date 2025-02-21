// sample-data/python-array-methods.ts
import type { Method } from '../types';

export const pythonArrayMethods: Method[] = [
  {
    id: 'py_list_len',
    name: 'len',
    language: 'python',
    category: 'array',
    description: 'Returns the number of items in a list',
    syntax: 'len(list)',
    exercises: [
      {
        id: 'py_list_len_1',
        code: 'fruits = ["apple", "banana", "cherry", "date"]',
        question: 'What method returns the number 4?',
        answer: 'len(fruits)',
        hint: 'This method counts how many items are in the list',
        difficulty: 'beginner',
        explanation: 'len() counts the total number of elements in a list. Here, there are 4 fruits in the list.'
      },
      {
        id: 'py_list_len_2',
        code: 'nested_list = [[1, 2], [3, 4], [5, 6]]',
        question: 'What method returns 3?',
        answer: 'len(nested_list)',
        hint: 'Count the number of sublists, not the total numbers',
        difficulty: 'intermediate',
        explanation: 'len() counts the top-level elements. This list contains 3 sublists, regardless of their contents.'
      }
    ]
  },
  {
    id: 'py_list_append',
    name: 'append',
    language: 'python',
    category: 'array',
    description: 'Adds an element to the end of the list',
    syntax: 'list.append(element)',
    exercises: [
      {
        id: 'py_list_append_1',
        code: `numbers = [1, 2, 3]
# Add 4 to the end of the list`,
        question: 'What method will make numbers = [1, 2, 3, 4]?',
        answer: 'numbers.append(4)',
        hint: 'This method adds a single element to the end',
        difficulty: 'beginner',
        explanation: 'append() adds one element to the end of a list. It modifies the original list.'
      },
      {
        id: 'py_list_append_2',
        code: `words = ["Hello", "World"]
# Add "!" to the end`,
        question: 'What method will make words = ["Hello", "World", "!"]?',
        answer: 'words.append("!")',
        hint: 'Add the exclamation mark as a new element',
        difficulty: 'beginner',
        explanation: 'append() works with any data type. Here it adds a string to a list of strings.'
      }
    ]
  },
  {
    id: 'py_list_pop',
    name: 'pop',
    language: 'python',
    category: 'array',
    description: 'Removes and returns an element at the specified position',
    syntax: 'list.pop([index])',
    exercises: [
      {
        id: 'py_list_pop_1',
        code: `colors = ["red", "green", "blue"]
# Remove and return the last color`,
        question: 'What method returns "blue" and leaves colors = ["red", "green"]?',
        answer: 'colors.pop()',
        hint: 'This method without arguments removes the last element',
        difficulty: 'beginner',
        explanation: 'pop() without an index removes and returns the last element of the list.'
      },
      {
        id: 'py_list_pop_2',
        code: `numbers = [10, 20, 30, 40]
# Remove and return the second number`,
        question: 'What method returns 20 and leaves numbers = [10, 30, 40]?',
        answer: 'numbers.pop(1)',
        hint: 'Remember that list indices start at 0',
        difficulty: 'intermediate',
        explanation: 'pop(1) removes and returns the element at index 1 (the second element).'
      }
    ]
  },
  {
    id: 'py_list_insert',
    name: 'insert',
    language: 'python',
    category: 'array',
    description: 'Inserts an element at the specified position',
    syntax: 'list.insert(index, element)',
    exercises: [
      {
        id: 'py_list_insert_1',
        code: `fruits = ["apple", "cherry"]
# Add "banana" between them`,
        question: 'What method will make fruits = ["apple", "banana", "cherry"]?',
        answer: 'fruits.insert(1, "banana")',
        hint: 'This method needs both the position and the element to insert',
        difficulty: 'intermediate',
        explanation: 'insert(1, "banana") adds "banana" at index 1, pushing existing elements to the right.'
      },
      {
        id: 'py_list_insert_2',
        code: `numbers = [2, 3, 4]
# Add 1 at the start`,
        question: 'What method will make numbers = [1, 2, 3, 4]?',
        answer: 'numbers.insert(0, 1)',
        hint: 'Think about the index for the start of the list',
        difficulty: 'beginner',
        explanation: 'insert(0, 1) adds the element at the beginning of the list (index 0).'
      }
    ]
  },
  {
    id: 'py_list_remove',
    name: 'remove',
    language: 'python',
    category: 'array',
    description: 'Removes the first occurrence of the specified element',
    syntax: 'list.remove(element)',
    exercises: [
      {
        id: 'py_list_remove_1',
        code: `fruits = ["apple", "banana", "apple", "cherry"]
# Remove the first "apple"`,
        question: 'What method will make fruits = ["banana", "apple", "cherry"]?',
        answer: 'fruits.remove("apple")',
        hint: 'This method removes by value, not by position',
        difficulty: 'beginner',
        explanation: 'remove("apple") removes the first occurrence of "apple" in the list.'
      },
      {
        id: 'py_list_remove_2',
        code: `numbers = [1, 2, 2, 3, 2]
# Remove the first 2`,
        question: 'What method will make numbers = [1, 2, 3, 2]?',
        answer: 'numbers.remove(2)',
        hint: 'Specify the value you want to remove',
        difficulty: 'intermediate',
        explanation: 'remove(2) removes only the first occurrence of 2, leaving later occurrences unchanged.'
      }
    ]
  },
  {
    id: 'py_list_index',
    name: 'index',
    language: 'python',
    category: 'array',
    description: 'Returns the index of the first occurrence of the specified element',
    syntax: 'list.index(element)',
    exercises: [
      {
        id: 'py_list_index_1',
        code: 'colors = ["red", "green", "blue", "green"]',
        question: 'What method returns 1 (the position of the first "green")?',
        answer: 'colors.index("green")',
        hint: 'This method finds where an element is located',
        difficulty: 'beginner',
        explanation: 'index("green") returns the position of the first "green", which is 1.'
      },
      {
        id: 'py_list_index_2',
        code: 'numbers = [10, 20, 30, 40, 30]',
        question: 'What method returns 2 (the position of the first 30)?',
        answer: 'numbers.index(30)',
        hint: 'Find the position of the first occurrence of 30',
        difficulty: 'beginner',
        explanation: 'index(30) returns the index of the first occurrence of 30, which is 2.'
      }
    ]
  }
];