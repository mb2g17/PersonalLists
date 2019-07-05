<template>

    <b-modal id="item-modal" size="xl" hide-footer
             @hidden.bs.modal="open = false">

        <template slot="modal-title">
            Editing
            "{{ itemName }}"
            in sublist
            "{{ $store.getters.getSublist(listID, sublistID).name }}"
            in list
            "{{ $store.getters.getList(listID).name }}"
        </template>

        <div class="d-block text-center">

            <!-- For every list column -->
            <p v-for="(columnWidth, column) in $store.state.lists[listID].columns">

                <b-form-group
                    :label="column"
                    label-cols-sm="4"
                    label-cols-lg="3"
                >
                    <!-- Text / Data -->
                    <b-form-textarea
                            v-model="item[column].text"
                            :placeholder="column"
                            rows="1"
                    ></b-form-textarea>

                    <!-- Hidden? -->
                    <b-form-checkbox v-model="item[column].hidden">
                        Hidden?
                    </b-form-checkbox>

                    <!-- Link box -->
                    <b-form-input v-model="item[column].link" placeholder="Link (leave blank for none)"></b-form-input>

                </b-form-group>

            </p>
        </div>

        <!-- Buttons -->
        <b-container>
            <b-row>
                <b-col>
                    <b-button class="mt-3" block variant="primary" @click="save">Save</b-button>
                </b-col>
                <b-col>
                    <b-button class="mt-3" block variant="danger" @click="$bvModal.hide('item-modal')">Close</b-button>
                </b-col>
            </b-row>
        </b-container>

    </b-modal>

</template>

<script>
    export default {
        name: "ItemEditor",
        props: [
            'listID' // Current editing list ID
        ],
        data: function() {
            return {
                sublistID: 0, // Current editing sublist ID
                itemID: 0, // Current editing item ID
                open: false, // If true, the dialog is open. If false, we are not open

                cmOptions: { // Editor options
                    tabSize: 2,
                    mode: 'application/json',
                    theme: 'base16-dark',
                    lineNumbers: true,
                    lineWrapping: true,
                    readOnly: true
                },

                item: {} // The item we're changing
            };
        },
        methods: {
            /**
             * The user wants to edit an item
             */
            show(sublistID, itemID) {
                // Update data
                this.sublistID = sublistID;
                this.itemID = itemID;

                // Resets item
                this.item = {};

                // Gets columns and updates data
                let columns = this.$store.getters.getList(this.listID).columns;
                let stateItem = this.$store.getters.getItem(this.listID, sublistID, itemID);
                for (let column in columns)
                {
                    // Sets dummy properties
                    this.$set(this.item, column, {});
                    this.$set(this.item[column], 'text', "");
                    this.$set(this.item[column], 'hidden', false);
                    this.$set(this.item[column], 'link', "");

                    // If this is a string, store normally. If object, update everything else
                    if (typeof stateItem[column] !== 'object')
                        this.item[column].text = stateItem[column];
                    else {
                        this.item[column].text = stateItem[column].text;
                        this.item[column].hidden = stateItem[column].hidden;
                        this.item[column].link = stateItem[column].link;
                    }
                }

                // We are open
                this.open = true;

                // Show modal
                this.$bvModal.show('item-modal');
            },
            /**
             * The user wants to save the item
             */
            save() {

                // Checks if item name already exists
                if (this.$store.getters.checkItemDuplicate(this.listID, this.sublistID, this.itemID, JSON.parse(this.code).name.text)) {
                    alert("Item name already exists! Please change the name!");
                } else {
                    // Replace using state mutator
                    this.$store.commit('updateItem', {
                        listID: this.listID,
                        sublistID: this.sublistID,
                        itemID: this.itemID,
                        item: JSON.parse(this.code)
                    });

                    // We are not open
                    this.open = false;

                    // Close down modal
                    this.$bvModal.hide('item-modal');
                }
            },
        },
        computed: {
            /**
             * The name of the item we're editing. If we're not open, it's empty
             * @returns {string}
             */
            itemName() {
                if (this.open) {
                    let name = this.$store.getters.getItem(this.listID, this.sublistID, this.itemID).name;
                    return typeof name === 'object' ? name.text : name;
                }
                else {
                    return "";
                }
            },
            /**
             * The code in the code editor
             * @returns {string}
             */
            code() {
                return JSON.stringify(
                    this.item,
                    null, 2
                );
            }
        },
        /**
         * When the element is created,
         */
        created: function() {
            // Gets columns
            let columns = this.$store.getters.getList(this.listID).columns;

            // Goes through each column
            for (let column in columns)
            {
                // Sets dummy properties
                this.$set(this.item, column, {});
                this.$set(this.item[column], 'text', "");
                this.$set(this.item[column], 'hidden', false);
                this.$set(this.item[column], 'link', "");
            }
        }
    }
</script>

<style>
</style>