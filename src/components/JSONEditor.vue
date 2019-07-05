<template>

    <b-modal :size="size" :id="modalID" hide-footer>

        <template slot="modal-title">
            Editing {{ editingName }}
        </template>

        <div class="d-block text-center">
            <prism-editor v-model="code"
                          language="js"
                          class="prismEditor"
            ></prism-editor>
        </div>

        <b-container>
            <b-row>
                <b-col>
                    <b-button class="mt-3" block variant="primary" @click="save">Save</b-button>
                </b-col>
                <b-col>
                    <b-button class="mt-3" block variant="danger" @click="$bvModal.hide(modalID)">Close</b-button>
                </b-col>
            </b-row>
        </b-container>

    </b-modal>

</template>

<script>
    import * as misc from '@/misc.js';
    import PrismEditor from 'vue-prism-editor';

    /**
     * Allows user to edit some given JSON
     */
    export default {
        name: "JSONEditor",
        props: {
            size: {
                type: String,
                default: 'lg'
            }
        },
        components: {
            PrismEditor
        },
        data: function() {
            return {
                editingName: "", // The name of the thing we're editing
                code: "", // The original code that we need to edit
                callback: null, // The callback function when we finish editing JSON
                modalID: misc.randomString(16) // A random generated ID for the modal
            };
        },
        methods: {
            /**
             * When parent wants us to show modal
             */
            show(editingName, code, callback) {
                // Sets editing name
                this.editingName = editingName;

                // Sets code
                this.code = code;

                // Sets callback
                this.callback = callback;

                // Show modal
                this.$bvModal.show(this.modalID);
            },
            /**
             * When user is ready to save
             */
            save() {
                // If actual JSON
                if (this.isJsonCode(this.code)) {
                    // Run callback
                    this.callback(JSON.parse(this.code));

                    // Close modal
                    this.$bvModal.hide(this.modalID);
                } else {
                    alert("Couldn't parse JSON! Please check syntax and save again.");
                }
            },
            /**
             * Checks if the code written is JSON code
             * @returns {boolean} true if JSON, false if invalid
             */
            isJsonCode(code) {
                try {
                    JSON.parse(code);
                } catch (e) {
                    return false;
                }
                return true;
            }
        }
    }
</script>

<style scoped>
    .prismEditor {
        font-size: 12px;
    }
</style>