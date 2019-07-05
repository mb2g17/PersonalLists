<template>

    <div v-if="$route.params.list < $store.state.lists.length">

        <!-- Item editor -->
        <ItemEditor ref="itemEditor" :listID="$route.params.list"></ItemEditor>

        <!-- JSON editors -->
        <JSONEditor ref="jsonEditor"></JSONEditor>
        <JSONEditor size="xl" ref="xljsonEditor"></JSONEditor>

        <!-- Left button group -->
        <b-button-group class="leftGroup">

            <!-- Back button -->
            <b-button variant="primary" @click="$router.push('/')">Back</b-button>

            <!-- Manually edit JSON button -->
            <b-button variant="danger" @click="editJSON">Manually edit JSON</b-button>

            <!-- Move item button -->
            <b-button
                    :variant="move.state === 0 ? 'primary' :
                              move.state === 1 ? 'success' : 'warning'"
                    @click="onMoveItemClick"
            >
                <template v-if="move.state === 0">Move item</template>
                <template v-if="move.state === 1">Click on an item to move</template>
                <template v-if="move.state === 2">Click on a table to move "{{ list.sublists[move.selectedSublistID].items[move.selectedItemID].name.text }}" to</template>
            </b-button>

        </b-button-group>

        <!-- Title -->
        <h1> {{ list.name }} </h1>

        <!-- Description -->
        <h3> {{ list.description }} </h3>

        <!-- New table -->
        <b-button class="newSublistButton" variant="success" @click="newSublist" >+ New sublist</b-button>

        <!-- Sublists -->
        <div v-for="(sublist, sublistID) in list.sublists" :key="sublist.name" class="tableparent">

            <!-- Description -->
            <p>{{ sublist.description }}</p>

            <!-- Table -->
            <Table :sublist="sublist"
                   :columns="list.columns"
                   :movestate="move.state"
                   @item-click="onItemClick(sublistID, $event)"
                   @table-click="onTableClick(sublistID)"
                   @edit-sublist="editSublist(sublistID)"
                   @delete-sublist="deleteSublist(sublistID)"
                   @edit-entry="editEntry(sublistID, $event)"
                   @delete-entry="deleteEntry(sublistID, $event)"
            ></Table>

            <!-- Count -->
            <p>Count: {{ sublist.items.length }}</p>

            <!-- New entry -->
            <b-button class="newEntryButton" variant="success" @click="newEntry(sublistID)" >+ New entry</b-button>

        </div>

    </div>

</template>

<script>
    import Table from '@/components/table/Table.vue';
    import ItemEditor from "@/components/items/ItemEditor";
    import JSONEditor from '@/components/JSONEditor';
    import * as misc from "@/misc.js";

    export default {
        name: "list",
        components: {
            ItemEditor,
            Table,
            JSONEditor
        },
        data: function() {
            return {
                move: {
                    /**
                     * 0 - Not moving any items
                     * 1 - Want to move an item; need to select an item
                     * 2 - Selected an item; need to pick a table
                     */
                    state: 0,
                    selectedSublistID: 0, // The sublist of the item we've selected
                    selectedItemID: 0 // The item we've selected
                }
            };
        },
        methods: {
            /**
             * When the user wants to edit the JSON manually
             */
            editJSON() {
                // Asks if the user is sure
                let response = confirm("Are you sure you want to use this? It gets really laggy with big lists! It crashes the system! There's a reason why I put it in red!");

                if (response) {
                    // Opens up JSON editor to edit sublist
                    this.$refs.xljsonEditor.show(this.list.name, JSON.stringify(this.list, null, 2), function(json) {
                        // Updates list
                        this.$store.commit('updateWholeList', {
                            list: json,
                            listID: this.$route.params.list
                        });
                    });
                }
            },
            /**
             * When the user clicks on move item
             */
            onMoveItemClick() {
                // If on state 0, go to 1. Else, go back to state 0
                switch (this.move.state) {
                    case 0:
                        this.move.state = 1;
                        break;
                    case 1: case 2:
                        this.move.state = 0;
                        this.move.selectedSublistID = 0;
                        this.move.selectedItemID = 0;
                }
            },
            /**
             * When the user clicks on an item
             */
            onItemClick(sublistID, itemID) {
                // If we're on the "select an item" state
                if (this.move.state === 1) {
                    // Store this item
                    this.move.selectedSublistID = sublistID;
                    this.move.selectedItemID = itemID;

                    // Move onto next state
                    this.move.state = 2;
                }
            },
            /**
             * When the user clicks on a table
             */
            onTableClick(sublistID) {
                // If we're on the "move item to table" state
                if (this.move.state === 2) {
                    // Move back to move state
                    this.move.state = 1;

                    // Moves item
                    this.$store.commit('moveItem', {
                        listID: this.$route.params.list,
                        itemID: this.move.selectedItemID,
                        srcSublistID: this.move.selectedSublistID,
                        destSublistID: sublistID
                    });
                }
            },
            /**
             * When a user wants to add a new sublist
             */
            newSublist() {
                // Creates the new sublist
                this.$store.commit('addNewSublist', this.$route.params.list);

                // Edits sublist
                this.editSublist(this.$store.state.lists[this.$route.params.list].sublists.length - 1);
            },
            /**
             * Edits a sublist
             */
            editSublist(sublistID) {
                // Gets sublist
                let sublist = this.$store.getters.getSublist(this.$route.params.list, sublistID);
                sublist = {
                    name: sublist.name,
                    description: sublist.description
                };

                // Opens up JSON editor to edit sublist
                this.$refs.jsonEditor.show(sublist.name, JSON.stringify(sublist, null, 2), function(json) {
                    // Checks if sublist name already exists
                    if (this.$store.getters.checkSublistDuplicate(this.$route.params.list, sublistID, json.name)) {
                        alert("Sublist name already exists! Changing name to something random...");
                        json.name = misc.randomString(16);
                    }

                    // Updates sublist
                    this.$store.commit('updateSublist', {
                        listID: this.$route.params.list,
                        sublistID: sublistID,
                        sublist: json
                    });
                });
            },
            /**
             * Deletes a sublist
             */
            deleteSublist(sublistID) {
                // If this is not the last sublist
                if (this.$store.state.lists[this.$route.params.list].sublists.length !== 1) {
                    // Deletes sublist
                    this.$store.commit('deleteSublist', {
                        listID: this.$route.params.list,
                        sublistID: sublistID
                    });
                } else {
                    alert("You must have at least 1 sublist in a list!");
                }
            },
            /**
             * When a user wants to add a new entry
             */
            newEntry(sublistID) {
                // Get columns
                let newEntry = {};
                for (let column in this.list.columns) {
                    newEntry[column] = {
                        "text": misc.randomString(16),
                        "hidden": false,
                        "link": ""
                    };
                }

                // Add item
                this.$store.commit('addNewItem', {
                    listID: this.$route.params.list,
                    sublistID: sublistID,
                    item: newEntry
                });

                // Edit item
                this.editEntry(sublistID, this.$store.state.lists[this.$route.params.list].sublists[sublistID].items.length - 1);
            },
            /**
             * When a user wants to edit an entry
             */
            editEntry(sublistID, itemID) {
                // Edit item using the item editor
                this.$refs.itemEditor.show(
                    sublistID,
                    itemID
                );
            },
            /**
             * When a user wants to delete an entry
             */
            deleteEntry(sublistID, itemID) {
                // Delete this entry
                this.$store.commit('deleteItem', {
                    listID: this.$route.params.list,
                    sublistID: sublistID,
                    itemID: itemID
                });
            }
        },
        computed: {
            /**
             * The list that we're currently looking at
             */
            list: function() {
                return this.$store.getters.getList(this.$route.params.list);
            }
        },
        created: function() {
            //console.log(this.list);
        },
        mounted: function() {
            //$("table").tablesorter(); // Adds tablesorter to table
        }
    }

</script>

<style lang="scss">
    // The parent of the whole table
    .tableparent {
        width: 100%;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;

        // Sublist description
        p {
            font-family: Verdana, Arial;
            font-size: 12px;
        }
    }

    // Button to add a new entry
    .newEntryButton {
        margin-bottom:50px;
    }

    // Button to add a new sublist
    .newSublistButton {
        margin-bottom:25px;
    }

    // Fixes group to left top
    .leftGroup {
        position:fixed;
        left: 10px;
        top: 10px;
    }
</style>