<template>
    <uploader
        class="fb-uploader"
        :class="{'fb-uploader_disabled': isDisabled}"
        :options="uploaderOptions"
        @file-added="checkFile"
        @file-progress="setProgress"
        @file-success="addFileNameToForm"
        @upload-start="toggleFormBlock(true)"
        @complete="toggleFormBlock(false)"
    >
        <uploader-unsupport></uploader-unsupport>

        <!-- dropzone -->
        <uploader-drop>
            <p class="fb-uploader__message">
                {{ $lang.FORMS_UPLOAD_DROP }}
                <span class="fb-uploader__fakebtn">{{ $lang.FORMS_UPLOAD_ADD }}</span>
                <uploader-btn class="fb-uploader__btn" tabindex="1" ref="uploaderBtn"><span>{{ $lang.FORMS_UPLOAD_ADD }}</span></uploader-btn>
            </p>
            <p v-if="format || size">
                <i class="fb-uploader__formats" v-if="format">
                    {{ $lang.FORMS_UPLOAD_FORMAT }} {{ formatString }}.
                </i>
                <i class="fb-uploader__size" v-if="size">
                    {{ $lang.FORMS_UPLOAD_SIZE }} {{ size }}Mb
                </i>
            </p>
        </uploader-drop><!-- / dropzone -->

        <!-- files list -->
        <uploader-list>
            <template slot-scope="props">
                <slot name="list" :file-list="props.fileList" :remove-file="removeFile">
                    <div v-if="props.fileList.length" class="fb-uploader__cwrap">
                        <table class="fb-uploader__list">
                            <tbody>
                                <template v-for="(file, i) in props.fileList">
                                    <tr :key="file.id">
                                        <td class="fb-uploader__list-number">{{ i + 1 }}</td>
                                        <td class="fb-uploader__list-name">
                                            <span class="fb-uploader__list-ftitle">{{ getName(file.name) }}</span>
                                        </td>
                                        <td class="fb-uploader__list-type">{{ getExtension(file.name) }}</td>
                                        <td class="fb-uploader__list-size">{{ file.size | bytesToMb }}</td>
                                        <td class="fb-uploader__list-date">
                                            <template v-if="file.isComplete()">
                                                {{ file._lastProgressCallback | timestampToDate }}
                                            </template>

                                        </td>
                                        <td class="fb-uploader__list-delete">
                                            <button
                                                class="fb-uploader__delete"
                                                :title="$lang.FORMS_UPLOAD_DELETE"
                                                :aria-label="$lang.FORMS_UPLOAD_DELETE"
                                                @click.prevent="removeFile(file, i)" >&times;</button>
                                        </td>
                                    </tr>
                                    <tr
                                        v-if="!file.isComplete()"
                                        :key="file.id + 'loader'"
                                        class="fb-uploader__list-pgwrap"
                                    >
                                        <td colspan="6" class="fb-uploader__list-progress">
                                            <progress
                                                class="fb-uploader__progress"
                                                max="1"
                                                :value="filesProgress[file.uniqueIdentifier]">
                                            </progress>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </slot>
            </template>
        </uploader-list><!-- / files list -->

    </uploader>
</template>

<script>
import fieldMixin from '../js/mixins/fb-field';

export default {

    name: 'fb-uploader',

    mixins: [ fieldMixin ],


    props: {

        url: {
            type: String,
            required: true
        },

        format: {
            type: [String, Array],
        },

        size: [String, Number], // Mb
        validator(value) {
            return +value == value
        }
    },


    data() {
        return {
            filesProgress: {}
        }
    },


    filters: {

        timestampToDate(val) {
            let date = new Date(val)
            return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear() + 1}`
        },

        bytesToMb(val) {
            let mb = val / 1024 / 1024
            return ( mb < 1 ? mb.toFixed(3) : mb.toFixed(1) ) + 'Mb'
        }
    },


    computed: {

        uploaderOptions() {
            return {
                target: this.url,
                testChunks: false
            }
        },

        formatArray() {
            return this.format && Array.isArray(this.format) ?
                   this.format :
                   this.format.split(',').map( extension => extension.trim() )
        },

        formatString() {
            return this.format && Array.isArray(this.format) ?
                   this.format.concat(', ') :
                   this.format
        },

        maxSizeBytes() {
            return this.size * 1024 * 1024
        }
    },


    methods: {

        checkFile(file) {
            if ( this.format && ! this._extensionMatch(file) ) {
                file.ignored = true
                this.showError(this.$lang.FORMS_UPLOADER_EXTENSION_ERROR.replace('%s', file.name));
            }
            if ( this.size && file.size > this.maxSizeBytes ) {
                file.ignored = true
                this.showError(this.$lang.FORMS_UPLOADER_SIZE_ERROR.replace('%s', file.name));
            }
        },

        showError(message) {
            AWES.notify({
                status: 'error',
                message
            })
        },

        setProgress(file) {
            this.$set(this.filesProgress, file.uniqueIdentifier, file.progress())
        },

        getExtension(fileName) {
            return fileName.split('.').pop()
        },

        getName(fileName) {
            let name = fileName.split('.')
            name.pop()
            return name.join('.')
        },

        _extensionMatch(file) {
            let extension = this.getExtension(file.name)
            return this.formatArray.includes(extension)
        },

        toggleFormBlock(status) {
            AWES._store.commit('setLoading', {
                formName: this.formId,
                status
            })
            if ( ! status ) this.$forceUpdate()
        },

        addFileNameToForm(rootFile, file, message, chunk) {
            delete this.filesProgress[file.uniqueIdentifier]
            try {
                let response = JSON.parse(message)
                let fileName = AWES.utils.object.get(response, 'meta.path', file.relativePath)
                Array.isArray(this.formValue) ? this.formValue.push(fileName) : this.formValue = [fileName]
            } catch(e) {
                console.log(e);
            }
        },

        removeFile(file, index) {
            if ( file.isComplete() ) {
                this.formValue.splice(index, 1)
            }
            file.cancel()
            delete this.filesProgress[file.uniqueIdentifier]
        },

        setFocus(state) {
            this.__retries = this.__retries || 20
            try {
                let useMethod = (state !== false) ? 'focus' : 'blur';
                this.$refs.uploaderBtn.$el[useMethod]()
                this.__retries = 20
            } catch(e) {
                this.__retries -= 1
                if (this.__retries) {
                    setTimeout(() => this.setFocus(state), 1000)
                }
            }
        }
    }
}
</script>
