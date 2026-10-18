/**
 * @file bean-list.js
 * @description Defines the BeanList class for the Bean Local coffee directory.
 * The class stores an array of coffee bean objects and provides methods
 * to display, search, sort, create, update and delete bean records.
 * @author Yu Zhang
 * @version 3.1.0
 */

/**
 * BeanList Class
 * @class
 * @property {string} rootId - The id of the HTML element where the bean list is displayed.
 * @property {Array<Object>} beanList - The array of coffee bean objects.
 */
class BeanList {
  /**
   * Create a BeanList instance.
   * @param {string} rootId - HTML id where the list will be displayed.
   * @param {Array<Object>} beans - Initial array of coffee beans.
   */
  constructor(rootId, beans) {
    this.rootId = rootId;
    this.beanList = beans;
    this.refresh();
  }

  /**
   * Generate one row for the Bean Local directory.
   * @param {string} beanName - Coffee bean name.
   * @param {number} rating - Community rating from 1 to 5.
   */
  beanRow(beanName, rating) {
    const rootElement = document.getElementById(this.rootId);
    const row = document.createElement('li');
    row.classList.add('row');
    row.textContent = `${beanName} — Community Rating ${rating}/5`;
    rootElement.appendChild(row);
  }

  /**
   * Generate all rows in the bean list (Read).
   */
  genBeanList() {
    for (let i = 0; i < this.beanList.length; i++) {
      const bean = this.beanList[i];
      this.beanRow(bean.beanName, bean.rating);
    }
  }

  /**
   * Generate rows from a filtered search result.
   * @param {Array<Object>} list - Filtered bean records to display.
   */
  genBeanSearchList(list) {
    this.removeElements();

    for (let i = 0; i < list.length; i++) {
      const bean = list[i];
      this.beanRow(bean.beanName, bean.rating);
    }
  }

  /**
   * Remove all generated bean rows from the DOM.
   */
  removeElements() {
    const rootElement = document.getElementById(this.rootId);
    const childNodes = rootElement.getElementsByClassName('row');
    const len = childNodes.length - 1;

    for (let i = len; i >= 0; i--) {
      rootElement.removeChild(childNodes[i]);
    }
  }

  /**
   * Return one bean object by its zero-based index.
   * @param {number} id - Bean array index.
   * @returns {Object|undefined} Matching bean record.
   */
  getRow(id) {
    return this.beanList.find((bean, index) => index === id);
  }

  /**
   * Refresh the visible directory from the current beanList array.
   */
  refresh() {
    this.removeElements();
    this.genBeanList();
  }

  /**
   * Add a new coffee bean record (Create).
   * @param {string} beanName - Coffee bean name.
   * @param {number} rating - Community rating from 1 to 5.
   */
  add(beanName, rating) {
    this.beanList.push({ beanName, rating });
    this.refresh();
  }

  /**
   * Update an existing coffee bean record (Update).
   * @param {number} index - Zero-based array index.
   * @param {string} beanName - Updated coffee bean name.
   * @param {number} rating - Updated community rating.
   */
  update(index, beanName, rating) {
    this.beanList[index].beanName = beanName;
    this.beanList[index].rating = rating;
    this.refresh();
  }

  /**
   * Delete a coffee bean record (Delete).
   * @param {number} index - Zero-based array index.
   */
  delete(index) {
    this.beanList.splice(index, 1);
    this.refresh();
  }

  /**
   * Sort beans by name from A to Z.
   */
  sortA2Z() {
    this.beanList.sort(function (a, b) {
      return a.beanName.localeCompare(b.beanName);
    });
    this.refresh();
  }

  /**
   * Sort beans by name from Z to A.
   */
  sortZ2A() {
    this.beanList.sort(function (a, b) {
      return b.beanName.localeCompare(a.beanName);
    });
    this.refresh();
  }

  /**
   * Search bean names for a partial, case-insensitive match.
   * Demonstrates string manipulation, iteration and selection.
   * @param {string} nameString - Partial bean name entered by the user.
   */
  search(nameString) {
    const shortList = [];
    const searchTerm = nameString.trim().toLowerCase();

    for (const bean of this.beanList) {
      if (bean.beanName.toLowerCase().includes(searchTerm)) {
        shortList.push(bean);
      }
    }

    this.genBeanSearchList(shortList);
  }
}
