<template>

    <table>
        <!-- Header -->
        <thead>
            <!-- Title -->
            <tr class="titleParent"
                :class="tableClasses"
                @click="tableClick">
                <th :colspan="Object.keys(columns).length">
                    <p>{{ sublist.name }}</p>
                </th>
            </tr>

            <!-- Column names -->
            <tr class="columnNames">
                <th v-for="(columnWidth, columnName) in columns"
                    :key="columnName"
                    :style="{ width: columnWidth / columnWidthSum * 100 + '%' }"
                    @click="columnClick(columnName)"
                    class="cursorPointer"
                >{{ columnName }}</th>
            </tr>
        </thead>

        <!-- Body -->
        <tbody>

            <!-- Goes through each item -->
            <tr v-for="item in orderedSublist.items" :key="item.name.text" @click="itemClick(item._originalIndex)" :class="itemClasses">

                <!-- Goes through each property of the item -->
                <td v-for="(width, column) in columns" :key="column">

                    <!-- If the item is a link -->
                    <OptionalLink :link="item[column].link">

                        <!-- If the item is hidden -->
                        <template v-if="item[column].hidden">
                            <HiddenText :text="item[column].text"></HiddenText>
                        </template>

                        <!-- If the item is not hidden -->
                        <template v-else>
                            {{ item[column].text }}
                        </template>

                    </OptionalLink>

                </td>

            </tr>

        </tbody>
    </table>

</template>

<script>
    import HiddenText from '@/components/table/HiddenText.vue';
    import OptionalLink from '@/components/table/OptionalLink.vue';
    import _ from 'lodash';

    /**
     * Sublists in table form
     */
    export default {
        name: "Table",
        props: {
            sublist: Object,
            columns: Object,
            movestate: Number
        },
        components: {
            HiddenText,
            OptionalLink
        },
        data: function() {
            return {
                sortCol: "", // What column to sort (blank for nothing)
                sortType: "asc" // Type of sort (asc, desc)
            }
        },
        methods: {
            /**
             * User clicks on an item
             */
            itemClick(itemID) {
                // Checks what mode we are in
                switch (this.$store.state.mode)
                {
                    case 0: // NORMAL
                        this.$emit('item-click', itemID);
                        break;
                    case 1: // EDIT
                        this.$emit('edit-entry', itemID);
                        break;
                    case 2: // DELETE
                        this.$emit('delete-entry', itemID);
                        break;
                }
            },
            /**
             * User clicks on the table
             */
            tableClick() {
                // Checks what mode we are in
                switch (this.$store.state.mode)
                {
                    case 0: // NORMAL
                        this.$emit('table-click');
                        break;
                    case 1: // EDIT
                        this.$emit('edit-sublist');
                        break;
                    case 2: // DELETE
                        this.$emit('delete-sublist');
                        break;
                }
            },
            /**
             * User clicked on a column (used for sorting)
             */
            columnClick(columnName) {
                // If we're already sorting this col
                if (this.sortCol === columnName) {
                    // Switch between asc and desc
                    this.sortType = this.sortType === "asc" ? "desc" : "asc";
                } else {
                    // Set col
                    this.sortCol = columnName;
                }
            }
        },
        computed: {
            /**
             * The sum of the widths of all the columns
             */
            columnWidthSum: function() {
                let sum = 0;
                for (let name in this.columns) {
                    sum += this.columns[name];
                }
                return sum;
            },
            /**
             * The style classes of the item rows in the table
             */
            itemClasses() {
                if (this.$store.state.mode === 1)
                    return ['editMode'];
                else if (this.$store.state.mode === 2)
                    return ['deleteMode'];
                else if (this.movestate === 1)
                    return ['moveMode'];
                else
                    return ['normalMode'];
            },
            /**
             * The style classes of the table titles
             */
            tableClasses() {
                if (this.$store.state.mode === 1)
                    return ['editMode'];
                else if (this.$store.state.mode === 2)
                    return ['deleteMode'];
                else if (this.movestate === 2)
                    return ['moveMode'];
                else
                    return ['normalMode'];
            },
            /**
             * Ordered sublist that we actually display
             */
            orderedSublist() {
                // Gets ordered items
                let orderedItems = [];

                // If empty, just make it a normal sublist
                if (this.sortCol === "")
                    orderedItems = JSON.parse(JSON.stringify(this.sublist.items));
                else
                    orderedItems = _.orderBy(this.sublist.items, o => {
                        // If it's a number, convert it. If not, treat it as a string.
                        if (isNaN(o[this.sortCol].text))
                            return o[this.sortCol].text;
                        else
                            return +o[this.sortCol].text;
                    }, [this.sortType]);

                // Add properties to the items, that point to the original items
                for (let item in orderedItems)
                {
                    // Finds the original item index
                    let originalItemIndex = -1;
                    for (let itemIndex in this.sublist.items)
                    {
                        // If this is the item we're looking for
                        if (orderedItems[item].name.text === this.sublist.items[itemIndex].name.text)
                            originalItemIndex = itemIndex;
                    }

                    // Add a new property
                    orderedItems[item]._originalIndex = originalItemIndex;
                }

                // Returns new sublist with ordered items
                return {
                    name: this.sublist.name,
                    description: this.sublist.description,
                    items: orderedItems
                };
            }
        }
    }
</script>

<style scoped lang="scss">
    // Table itself
    table {
        width: 95%;
        border-collapse: collapse;
        margin-bottom: 20px;
        th, td {
            border: 1px solid black;
            color: black;
        }
    }

    // Parent of table title
    .titleParent {
        background-color: rgba(0, 136, 255, 0.35);
    }

    // Paragraph where the table title is
    .tableparent p {
        font-family: "Bell MT",serif;
        font-weight: bolder;
        font-size: large;
        margin:0;
    }

    // Column names
    .columnNames {
       font-family: "Bell MT",serif;
       font-weight: bolder;
       font-size: 16px;
       text-align:left;
    }

    // Every other row
    tr:nth-child(2n) {
       background-color: rgba(0, 217, 255, 0.18);
    }

    // Data tags
    td {
       font-family: Verdana, Arial,serif;
       font-weight: normal;
       font-size: 11px;
       text-align:left;
    }

    // Misc
    th, td {
        padding: 2px 0 2px 1%;
    }

    // Style of item when edit mode
    .editMode:hover {
        background-color: #ffc107;
        cursor:pointer;
    }

    // Style of item when delete mode
    .deleteMode:hover {
        background-color: #dc3545;
        cursor:pointer;
    }

    // Style of item when moving is occurring
    .moveMode:hover {
        background-color: lightgreen;
        cursor:pointer;
    }

    // Style of item when normal mode
    .normalMode:hover {
        background-color: rgba(0, 217, 255, 0.5);
    }

    // If you hover, you'll have a cursor pointer
    .cursorPointer:hover {
        cursor:pointer;
    }
</style>