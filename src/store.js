import Vue from 'vue'
import Vuex from 'vuex'
import _ from "lodash";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        lists: [],

        /**
         * 0 - normal
         * 1 - edit
         * 2 - delete
         */
        mode: 0
    },
    mutations: {
        /**
         * Sets a new mode
         * @param state - existing state
         * @param newMode - the new mode to set
         */
        setMode(state, newMode) {
            state.mode = newMode;
        },
        /**
         * Sets new lists JSON array
         * @param state - existing state
         * @param newlists - the new lists to set
         */
        setAll(state, newlists) {
            // Removes _originalIndex in all items, if it exists
            _.forEach(newlists, (list, listID) => {
                _.forEach(list.sublists, (sublist, sublistID) => {
                    _.forEach(sublist.items, (item, itemID) => {
                        delete newlists[listID].sublists[sublistID].items[itemID]._originalIndex;
                    });
                });
            });

            // Saves list
            state.lists = newlists;
        },
        /**
         * Adds a new list to the array of lists
         * @param state - existing state
         */
        addNewList(state) {
            state.lists.push({
                "name": "New list",
                "description": "New list description",
                "columns": {
                    "name":  8,
                    "score":  3,
                    "description": 9
                },
                "sublists": [
                    {
                        "name": "New sublist",
                        "description": "This is a new sublist.",
                        "items":
                            [
                                {
                                    "name": {
                                        "text": "New item",
                                        "hidden": false,
                                        "link": "https://en.wikipedia.org"
                                    },
                                    "score": {
                                        "text": "5",
                                        "hidden": false,
                                        "link": ""
                                    },
                                    "description": {
                                        "text": "This is a new item.",
                                        "hidden": true,
                                        "link": ""
                                    }
                                }
                            ]
                    },
                ]
            });
        },
        /**
         * Updates a list
         * @param state - existing state
         * @param payload - contains 'list' and 'listID'
         */
        updateList(state, payload) {
            // Destructuring
            let {list: list, listID: listID} = payload;

            // Creates version of the old list to edit
            let oldList = JSON.parse(JSON.stringify(state.lists[listID]));

            // Creates a list of old and new columns
            let oldCols = new Set(Object.keys(oldList.columns));
            let newCols = new Set(Object.keys(list.columns));

            // Derives common columns and new columns
            let commonCols = new Set(
                [...oldCols].filter(x => newCols.has(x))
            );
            let addedCols = new Set(
                [...newCols].filter(x => !commonCols.has(x))
            );

            // Goes through each sublist (we are doing all this to preserve order of the columns)
            for (let sublistID in oldList.sublists)
            {
                // Goes through each item
                for (let itemID in oldList.sublists[sublistID].items)
                {
                    // Gets item and resets the actual list item
                    let item = oldList.sublists[sublistID].items[itemID];
                    oldList.sublists[sublistID].items[itemID] = {};

                    // Goes through each new column
                    for (let column of newCols)
                    {
                        // If it's within the common columns, just write it again
                        if (commonCols.has(column)) {
                            oldList.sublists[sublistID].items[itemID][column] = item[column];
                        }
                        // If it's within the added columns, add it as blank
                        else if (addedCols.has(column)) {
                            oldList.sublists[sublistID].items[itemID][column] = {
                                text: "",
                                hidden: false,
                                link: ""
                            };
                        }
                    }
                }
            }

            // Updates oldList properties
            oldList.name = list.name;
            oldList.description = list.description;
            oldList.columns = list.columns;

            // Replaces the new list with the old, edited one
            Vue.set(state.lists, listID, oldList);
        },
        /**
         * Updates a whole list, not just the name, columns and description
         * @param state - existing state
         * @param list - new list
         * @param listID - list to replace with
         */
        updateWholeList(state, {list, listID}) {
            Vue.set(state.lists, listID, list);
        },
        /**
         * Deletes a list
         * @param state - existing state
         * @param listID - the list to delete
         */
        deleteList(state, listID) {
            // Filter out ID
            state.lists.splice(listID, 1);
        },
        /**
         * Adds a new sublist
         * @param state - existing state
         * @param listID - ID of the list
         */
        addNewSublist(state, listID) {
            // Adds new sublist
            state.lists[listID].sublists.push({
                "name": "New sublist",
                "description": "New sublist description",
                "items": []
            });
        },
        /**
         * Updates sublist
         * @param state - existing state
         * @param listID - ID of list
         * @param sublistID - ID of sublist
         * @param sublist - sublist to update
         */
        updateSublist(state, {listID, sublistID, sublist}) {
            // Updates sublist
            Vue.set(state.lists[listID].sublists[sublistID], "name", sublist.name);
            Vue.set(state.lists[listID].sublists[sublistID], "description", sublist.description);
        },
        /**
         * Deletes sublist
         * @param state - existing state
         * @param listID - ID of list
         * @param sublistID - ID of sublist
         */
        deleteSublist(state, {listID, sublistID}) {
            // Deletes sublist
            state.lists[listID].sublists.splice(sublistID, 1);
        },
        /**
         * Adds a new item to a sublist
         * @param state - existing state
         * @param listID - the ID of the list
         * @param sublistID - the ID of the sublist
         * @param item - the actual item to add
         */
        addNewItem(state, {listID, sublistID, item}) {
            // Pushes a new element onto state
            state.lists[listID].sublists[sublistID].items.push(item);
        },
        /**
         * Updates an item in a sublist
         * @param state - existing state
         * @param listID - the ID of the list
         * @param sublistID - the ID of the sublist
         * @param itemID - the ID of the item
         * @param item - the new item to replace with
         */
        updateItem(state, {listID, sublistID, itemID, item}) {
            // Updates item
            Vue.set(state.lists[listID].sublists[sublistID].items, itemID, item);
        },
        /**
         * Deletes an item in a sublist
         * @param state - existing state
         * @param listID - the ID of the list
         * @param sublistID - the ID of the sublist
         * @param itemID - the ID of the item to delete
         */
        deleteItem(state, {listID, sublistID, itemID}) {
            // Deletes item
            state.lists[listID].sublists[sublistID].items.splice(itemID, 1);
        },
        /**
         * Moves an item
         * @param state - existing state
         * @param listID - the ID of the list where this is happening
         * @param itemID - the ID of the item to move
         * @param srcSublistID - the sublist where the item is now
         * @param destSublistID - the sublist where the item should be moved to
         */
        moveItem(state, {listID, itemID, srcSublistID, destSublistID}) {
            // Gets the item
            let item = JSON.parse(JSON.stringify(state.lists[listID].sublists[srcSublistID].items[itemID]));

            // Removes it from source sublist
            state.lists[listID].sublists[srcSublistID].items.splice(itemID, 1);

            // Adds it to destination sublist
            state.lists[listID].sublists[destSublistID].items.push(item);
        }
    },
    getters: {
        /**
         * Gets a single list
         * @param state - existing state
         * @returns {Function} a function that gets list based on name
         */
        getList: state => listID => state.lists[listID],
        /**
         * Gets a single sublist
         * @param state - existing state
         * @returns {function(*, *): ({name, description, items}|*)}
         */
        getSublist: state => (listID, sublistID) => state.lists[listID].sublists[sublistID],
        /**
         * Gets a single item
         * @param state - existing state
         * @returns {function(*, *, *): ({score, name, description}|*)}
         */
        getItem: state => (listID, sublistID, itemID) => state.lists[listID].sublists[sublistID].items[itemID],
        /**
         * Gets a set of list names
         */
        getListNames: state => {
            return _.reduce(state.lists, (result, value, key) => result.add(value.name), new Set());
        },
        /**
         * Checks for any duplicates in a new list name
         * @param state - existing state
         * @returns {function(*=, *=): *}
         */
        checkListDuplicate: state => (listID, newListName) => {
            // Gets the list names
            let listNames = _.reduce(state.lists, (result, value, key) => {
                result.push(value.name);
                return result;
            }, []);

            // Remove list ID
            listNames.splice(listID, 1);

            // Does the name still exist?
            return listNames.includes(newListName);
        },
        /**
         * Checks for any duplicates in a new sublist name
         * @param state
         * @returns {function(*, *=, *=): *}
         */
        checkSublistDuplicate: state => (listID, sublistID, newSublistName) => {
            // Gets the sublist names
            let sublistNames = _.reduce(state.lists[listID].sublists, (result, value, key) => {
                result.push(value.name);
                return result;
            }, []);

            // Remove sublist ID
            sublistNames.splice(sublistID, 1);

            // Does the name still exist?
            return sublistNames.includes(newSublistName);
        },
        /**
         * Checks for any duplicates in a new item name
         * @param state
         * @returns {function(*, *=, *=): *}
         */
        checkItemDuplicate: state => (listID, sublistID, itemID, newItemName) => {
            // Gets the sublist names
            let itemNames = _.reduce(state.lists[listID].sublists[sublistID].items, (result, value, key) => {
                result.push(value.name.text);
                return result;
            }, []);

            // Remove item ID
            itemNames.splice(itemID, 1);

            // Does the name still exist?
            return itemNames.includes(newItemName);
        },
    },
    actions: {

    }
});
